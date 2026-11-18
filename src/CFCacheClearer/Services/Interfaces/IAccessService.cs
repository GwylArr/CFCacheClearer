using Umbraco.Cms.Core.Models.Membership;

namespace CFCacheClearer.Services.Interfaces;

public interface IAccessService
{
    bool IsAllowed(IUser? user);
}
