namespace Server.Game;

public class WinnersGalleryService : IWinnersGalleryService {

    const int MAX_SIZE = 5;

    private readonly Queue<GalleryItem> _queue = new();

    private readonly object _lock = new object();

    void IWinnersGalleryService.Add(GalleryItem item) {

        lock (_lock) {

            if (_queue.Count == MAX_SIZE) {

                _queue.Dequeue();
            }

            _queue.Enqueue(item);
        }
    }

    List<GalleryItem> IWinnersGalleryService.Get() {

        lock (_lock) {

            return _queue.ToList();
        }
    }
}
