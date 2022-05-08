using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Server.Game.Messages;
using System.Collections.Concurrent;

namespace Server.Game;

[Authorize]
public class GameHub : Hub {

    private enum ClientState { None, Waiting };

    private static readonly Dictionary<string, string> _verifiedConnections = new();
    private static readonly object _verifyLock = new object();

    private BlockingCollection<GameMessage> _messageQueue;

    public GameHub(IGameMessageQueue messageQueue) {

        _messageQueue = messageQueue.MessageQueue;
    }

    public override async Task OnConnectedAsync() {

        await base.OnConnectedAsync();

        bool verified = false;

        var login = Context.User!.Identity!.Name!;

        lock (_verifyLock) {

            if (!_verifiedConnections.ContainsKey(login)) {

                _verifiedConnections.Add(login, Context.ConnectionId);

                verified = true;
            }
        }

        if (verified) {

            _messageQueue.Add(new PlayerConnectedMessage(Context.ConnectionId, login));
        }
        else {

            Context.Abort();
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception) {

        bool verified = false;

        var login = Context.User!.Identity!.Name!;

        lock (_verifyLock) {

            verified = _verifiedConnections[login] == Context.ConnectionId;
        }

        if (verified) {

           _messageQueue.Add(new PlayerDisconnectedMessage(Context.ConnectionId));
        }

        if (verified) {

            lock (_verifyLock) {

                _verifiedConnections.Remove(login);
            }
        }

        await base.OnDisconnectedAsync(exception);
    } 

    private static readonly ConcurrentDictionary<string, Status> _states = new();
}

public enum Status { Nonde, Waiting }

public record State(Status Status);


