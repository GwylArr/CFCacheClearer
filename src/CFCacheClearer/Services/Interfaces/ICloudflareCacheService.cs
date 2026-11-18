namespace CFCacheClearer.Services.Interfaces;

public interface ICloudflareCacheService
{
    IReadOnlyList<CloudflareSiteInfo> GetSites();

    Task<CloudflarePurgeResult> PurgeUrlAsync(int siteIndex, string url, CancellationToken cancellationToken = default);

    Task<CloudflarePurgeResult> PurgeTagsAsync(int siteIndex, IReadOnlyCollection<string> tags, CancellationToken cancellationToken = default);

    Task<CloudflarePurgeResult> PurgeEverythingAsync(int siteIndex, CancellationToken cancellationToken = default);
}

public record CloudflarePurgeResult(bool Success, string Message);

public record CloudflareSiteInfo(int Index, string BaseUrl);
