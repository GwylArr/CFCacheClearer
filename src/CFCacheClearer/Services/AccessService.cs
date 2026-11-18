using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Models.Membership;
using CFCacheClearer.Configuration;
using CFCacheClearer.Services.Interfaces;

namespace CFCacheClearer.Services;

public class AccessService : IAccessService
{
    private readonly AccessSettings _settings;

    public AccessService(IOptions<AccessSettings> settings)
    {
        _settings = settings.Value;
    }

    public bool IsAllowed(IUser? user)
    {
        if (user is null)
        {
            return false;
        }

        var allowedGroups = _settings.AllowedUserGroups is { Length: > 0 }
            ? _settings.AllowedUserGroups
            : [Umbraco.Cms.Core.Constants.Security.AdminGroupAlias];

        return user.Groups.Any(group => allowedGroups.Contains(group.Alias, StringComparer.OrdinalIgnoreCase));
    }
}
