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

    public async Task BlockAdd(int x, int y, int z, int colorId) {

        _messageQueue.Add(new BlockAddMessage(Context.ConnectionId, x, y, z, colorId));

        await Task.CompletedTask;
    }

    public async Task BlockRemove(int x, int y, int z) {

        _messageQueue.Add(new BlockRemoveMessage(Context.ConnectionId, x, y, z));

        await Task.CompletedTask;
    }

    public async Task Evaluated(string playerLogin, int score) {

        if ((score > 0) && (score <= 5)) {

            _messageQueue.Add(new EvaluatedMessage(Context.ConnectionId, playerLogin, score));
        }

        await Task.CompletedTask;
    }
}

public enum Status { Nonde, Waiting }

public record State(Status Status);


