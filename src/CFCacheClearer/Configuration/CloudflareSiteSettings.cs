namespace CFCacheClearer.Configuration;

public class CloudflareSiteSettings
{
    public const string SectionName = "CFCacheClearer:Cloudflare";

    /// <summary>
    /// The Zone ID from CloudFlare
    /// </summary>
    public required string ZoneId { get; set; }

    /// <summary>
    /// The API token from CloudFlare
    /// </summary>
    public required string ApiToken { get; set; }

    /// <summary>
    /// The site's public base URL.
    /// </summary>
    public required string BaseUrl { get; set; }
}
