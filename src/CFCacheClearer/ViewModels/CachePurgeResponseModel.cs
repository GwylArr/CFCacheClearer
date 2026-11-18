namespace CFCacheClearer.ViewModels;

public class CachePurgeResponseModel
{
    public required bool Success { get; init; }

    public required string Message { get; init; }
}
