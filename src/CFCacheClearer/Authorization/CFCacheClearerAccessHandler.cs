using Microsoft.AspNetCore.Authorization;
using Umbraco.Cms.Core.Security;
using CFCacheClearer.Services.Interfaces;

namespace CFCacheClearer.Authorization;

public class CFCacheClearerAccessHandler : AuthorizationHandler<CFCacheClearerAccessRequirement>
{
    public const string PolicyName = "CFCacheClearer.AllowedUserGroups";

    private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;
    private readonly IAccessService _accessService;

    public CFCacheClearerAccessHandler(IBackOfficeSecurityAccessor backOfficeSecurityAccessor, IAccessService accessService)
    {
        _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
        _accessService = accessService;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CFCacheClearerAccessRequirement requirement)
    {
        var currentUser = _backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;

        if (_accessService.IsAllowed(currentUser))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
