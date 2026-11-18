namespace CFCacheClearer.ViewModels;

public class PurgeTagsRequestModel
{
    public required int SiteIndex { get; init; }

    public required string[] Tags { get; init; }
}
