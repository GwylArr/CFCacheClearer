using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Api.Common.OpenApi;
using CFCacheClearer.Authorization;
using CFCacheClearer.Configuration;
using CFCacheClearer.Services;
using CFCacheClearer.Services.Interfaces;

namespace CFCacheClearer.Composers
{
    public class CFCacheClearerApiComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddOptions<List<CloudflareSiteSettings>>()
                .BindConfiguration(CloudflareSiteSettings.SectionName)
                .ValidateOnStart();

            builder.Services.AddOptions<AccessSettings>()
                .BindConfiguration(AccessSettings.SectionName);

            builder.Services.AddHttpClient(CloudflareCacheService.HttpClientName, httpClient =>
            {
                httpClient.BaseAddress = new Uri("https://api.cloudflare.com/");
            });

            builder.Services.TryAddScoped<ICloudflareCacheService, CloudflareCacheService>();
            builder.Services.TryAddSingleton<IAccessService, AccessService>();

            builder.Services.AddSingleton<IAuthorizationHandler, CFCacheClearerAccessHandler>();
            builder.Services.AddAuthorizationBuilder()
                .AddPolicy(CFCacheClearerAccessHandler.PolicyName, policy => policy.AddRequirements(new CFCacheClearerAccessRequirement()));

            builder.Services.AddSingleton<IOperationIdHandler, CustomOperationHandler>();

            builder.Services.Configure<SwaggerGenOptions>(opt =>
            {
                opt.SwaggerDoc(Constants.ApiName, new OpenApiInfo
                {
                    Title = "CFCache Clearer Backoffice API",
                    Version = "1.0",
                });

                opt.OperationFilter<CFCacheClearerOperationSecurityFilter>();
            });
        }

        public class CFCacheClearerOperationSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
        {
            protected override string ApiName => Constants.ApiName;
        }

        public class CustomOperationHandler : OperationIdHandler
        {
            public CustomOperationHandler(IOptions<ApiVersioningOptions> apiVersioningOptions) : base(apiVersioningOptions)
            {
            }

            protected override bool CanHandle(ApiDescription apiDescription, ControllerActionDescriptor controllerActionDescriptor)
            {
                return controllerActionDescriptor.ControllerTypeInfo.Namespace?.StartsWith("CFCacheClearer.Controllers", comparisonType: StringComparison.InvariantCultureIgnoreCase) is true;
            }
        }
    }
}
