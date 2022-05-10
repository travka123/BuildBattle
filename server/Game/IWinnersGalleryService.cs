namespace Server.Game;

public interface IWinnersGalleryService {

    public List<GalleryItem> Get();

    public void Add(GalleryItem item);
}

public record GalleryItem(string playerName, string theme, List<List<int>> world);