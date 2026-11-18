namespace CFCacheClearer.ViewModels;

public class PurgePathRequestModel
{
    public required int SiteIndex { get; init; }

    public required string Path { get; init; }
}
