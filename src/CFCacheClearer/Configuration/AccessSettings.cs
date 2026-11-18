namespace CFCacheClearer.Configuration;

public class AccessSettings
{
    public const string SectionName = "CFCacheClearer:Access";

    /// <summary>
    /// The aliases of the user groups allowed to use CF Cache Clearer.
    /// If not set, only the built-in "admin" group has access.
    /// </summary>
    public string[]? AllowedUserGroups { get; set; }
}
