using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using CFCacheClearer.Configuration;
using CFCacheClearer.Services.Interfaces;

namespace CFCacheClearer.Services;

public class CloudflareCacheService : ICloudflareCacheService
{
    public const string HttpClientName = "CFCacheClearer.Cloudflare";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<CloudflareCacheService> _logger;
    private readonly IReadOnlyList<CloudflareSiteSettings> _sites;

    private static readonly JsonSerializerOptions ResponseJsonOptions = new(JsonSerializerDefaults.Web);

    public CloudflareCacheService(IHttpClientFactory httpClientFactory, ILogger<CloudflareCacheService> logger, IOptions<List<CloudflareSiteSettings>> settings)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _sites = settings.Value;
    }

    public IReadOnlyList<CloudflareSiteInfo> GetSites() =>
        _sites.Select((site, index) => new CloudflareSiteInfo(index, site.BaseUrl)).ToList();

    public Task<CloudflarePurgeResult> PurgeUrlAsync(int siteIndex, string url, CancellationToken cancellationToken = default)
    {
        if (!TryGetSite(siteIndex, out var site))
        {
            return Task.FromResult(new CloudflarePurgeResult(false, "Unknown site."));
        }

        var fullUrl = BuildFullUrl(site, url);
        return PurgeAsync(site, new { files = new[] { fullUrl } }, fullUrl, cancellationToken);
    }

    public Task<CloudflarePurgeResult> PurgeTagsAsync(int siteIndex, IReadOnlyCollection<string> tags, CancellationToken cancellationToken = default)
    {
        if (!TryGetSite(siteIndex, out var site))
        {
            return Task.FromResult(new CloudflarePurgeResult(false, "Unknown site."));
        }

        var description = $"tags ({string.Join(", ", tags)}) on {site.BaseUrl}";
        return PurgeAsync(site, new { tags }, description, cancellationToken);
    }

    public Task<CloudflarePurgeResult> PurgeEverythingAsync(int siteIndex, CancellationToken cancellationToken = default)
    {
        if (!TryGetSite(siteIndex, out var site))
        {
            return Task.FromResult(new CloudflarePurgeResult(false, "Unknown site."));
        }

        return PurgeAsync(site, new { purge_everything = true }, $"entire site ({site.BaseUrl})", cancellationToken);
    }

    private bool TryGetSite(int siteIndex, out CloudflareSiteSettings site)
    {
        if (siteIndex >= 0 && siteIndex < _sites.Count)
        {
            site = _sites[siteIndex];
            return true;
        }

        site = null!;
        return false;
    }

    private static string BuildFullUrl(CloudflareSiteSettings site, string path)
    {
        var baseUrl = site.BaseUrl.TrimEnd('/');
        var relativePath = path.StartsWith('/') ? path : $"/{path}";
        return $"{baseUrl}{relativePath}";
    }

    private async Task<CloudflarePurgeResult> PurgeAsync(CloudflareSiteSettings site, object requestBody, string description, CancellationToken cancellationToken)
    {
        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        using var request = new HttpRequestMessage(HttpMethod.Post, $"client/v4/zones/{site.ZoneId}/purge_cache")
        {
            Content = JsonContent.Create(requestBody),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", site.ApiToken);

        var response = await httpClient.SendAsync(request, cancellationToken);
        var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
        var result = TryParseResponse(responseBody);

        if (result is not { Success: true })
        {
            var errorMessage = result?.Errors is { Length: > 0 }
                ? string.Join("; ", result.Errors.Select(error => $"{error.Code}: {error.Message}"))
                : $"Cloudflare returned {response.StatusCode}: {responseBody}";

            _logger.LogError("Failed to purge Cloudflare cache for {Description}, status {StatusCode}, details {Details}", description, response.StatusCode, errorMessage);
            return new CloudflarePurgeResult(false, errorMessage);
        }

        _logger.LogInformation("Successfully purged Cloudflare cache for {Description}", description);
        return new CloudflarePurgeResult(true, $"Cache purge requested for {description}");
    }

    private static CloudflareApiResponse? TryParseResponse(string responseBody)
    {
        try
        {
            return JsonSerializer.Deserialize<CloudflareApiResponse>(responseBody, ResponseJsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private sealed record CloudflareApiResponse(bool Success, CloudflareApiError[]? Errors);

    private sealed record CloudflareApiError(int Code, string Message);
}
