using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Server.Game;

[Authorize]
public class GalleryHab : Hub {

    private readonly IWinnersGalleryService _winnersGalleryService;

    public GalleryHab(IWinnersGalleryService winnersGalleryService) {

        _winnersGalleryService = winnersGalleryService;
    }

    public override async Task OnConnectedAsync() {

        await base.OnConnectedAsync();

        await Clients.All.SendAsync("onConnected", _winnersGalleryService.Get());
    }
}

