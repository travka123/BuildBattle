using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Server.Game;

[Authorize]
public class GameHub : Hub {

    private enum ClientState { None, Waiting };

    private static readonly Dictionary<string, string> _verifiedConnections = new();
    private readonly object _verifyLock = new object();

    public override async Task OnConnectedAsync() {

        bool verified = false;

        var login = Context.User!.Identity!.Name!;

        lock (_verifyLock) {

            if (!_verifiedConnections.ContainsKey(login)) {

                _verifiedConnections.Add(login, Context.ConnectionId);

                verified = true;
            }
        }

        if (verified) {

            await OnVerifiedConnectedAsync();
        }
        else {

            Context.Abort();
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception) {

        bool verified = false;

        var login = Context.User!.Identity!.Name!;

        lock (_verifyLock) {

            verified = _verifiedConnections[login] == Context.ConnectionId;
        }

        if (verified) {

            await OnVerifiedDisconnectedAsync(exception);
        }

        if (verified) {

            lock (_verifyLock) {

                _verifiedConnections.Remove(login);
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    private async Task OnVerifiedConnectedAsync() {
    }

    private async Task OnVerifiedDisconnectedAsync(Exception? exception) {
    }
}

