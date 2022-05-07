using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Server.Game;

[Authorize]
public class GameHub : Hub {

    private enum ClientState { None, Waiting };

    private static readonly ConcurrentDictionary<string, ClientState> clientState = new();

    public override async Task OnConnectedAsync() {

        clientState[Context.User!.Identity!.Name!] = ClientState.Waiting; 

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception) {

        clientState.Remove(Context.User!.Identity!.Name!, out ClientState _);

        await base.OnDisconnectedAsync(exception);
    }
}

