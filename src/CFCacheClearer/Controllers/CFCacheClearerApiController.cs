using System.Linq;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Security;
using CFCacheClearer.Authorization;
using CFCacheClearer.Services.Interfaces;
using CFCacheClearer.ViewModels;

namespace CFCacheClearer.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "CFCacheClearer")]
    public class CFCacheClearerApiController : CFCacheClearerApiControllerBase
    {
        private readonly ICloudflareCacheService _cloudflareCacheService;
        private readonly IAccessService _accessService;
        private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;

        public CFCacheClearerApiController(
            ICloudflareCacheService cloudflareCacheService,
            IAccessService accessService,
            IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
        {
            _cloudflareCacheService = cloudflareCacheService;
            _accessService = accessService;
            _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
        }

        [HttpGet("access")]
        [ProducesResponseType<AccessResponseModel>(StatusCodes.Status200OK)]
        public ActionResult<AccessResponseModel> GetAccess()
        {
            var currentUser = _backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;
            return new AccessResponseModel { Allowed = _accessService.IsAllowed(currentUser) };
        }

        [HttpGet("sites")]
        [Authorize(Policy = CFCacheClearerAccessHandler.PolicyName)]
        [ProducesResponseType<IEnumerable<SiteModel>>(StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<SiteModel>> GetSites()
        {
            var sites = _cloudflareCacheService.GetSites()
                .Select(site => new SiteModel { Index = site.Index, BaseUrl = site.BaseUrl });

            return Ok(sites);
        }

        [HttpPost("purge-path")]
        [Authorize(Policy = CFCacheClearerAccessHandler.PolicyName)]
        [ProducesResponseType<CachePurgeResponseModel>(StatusCodes.Status200OK)]
        public async Task<ActionResult<CachePurgeResponseModel>> PurgePath(PurgePathRequestModel request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Path))
            {
                return new CachePurgeResponseModel { Success = false, Message = "Please enter a path to purge." };
            }

            var result = await _cloudflareCacheService.PurgeUrlAsync(request.SiteIndex, request.Path, cancellationToken);
            return new CachePurgeResponseModel { Success = result.Success, Message = result.Message };
        }

        [HttpPost("purge-tags")]
        [Authorize(Policy = CFCacheClearerAccessHandler.PolicyName)]
        [ProducesResponseType<CachePurgeResponseModel>(StatusCodes.Status200OK)]
        public async Task<ActionResult<CachePurgeResponseModel>> PurgeTags(PurgeTagsRequestModel request, CancellationToken cancellationToken)
        {
            var tags = request.Tags.Where(tag => !string.IsNullOrWhiteSpace(tag)).ToArray();
            if (tags.Length == 0)
            {
                return new CachePurgeResponseModel { Success = false, Message = "Please enter at least one tag to purge." };
            }

            var result = await _cloudflareCacheService.PurgeTagsAsync(request.SiteIndex, tags, cancellationToken);
            return new CachePurgeResponseModel { Success = result.Success, Message = result.Message };
        }

        [HttpPost("purge-all")]
        [Authorize(Policy = CFCacheClearerAccessHandler.PolicyName)]
        [ProducesResponseType<CachePurgeResponseModel>(StatusCodes.Status200OK)]
        public async Task<ActionResult<CachePurgeResponseModel>> PurgeAll(PurgeSiteRequestModel request, CancellationToken cancellationToken)
        {
            var result = await _cloudflareCacheService.PurgeEverythingAsync(request.SiteIndex, cancellationToken);
            return new CachePurgeResponseModel { Success = result.Success, Message = result.Message };
        }
    }
}
