using Microsoft.AspNetCore.SignalR;
using Server.Game.Messages;
using System.Collections.Concurrent;

namespace Server.Game;

public class GameService : BackgroundService {

    public const int GROUP_SIZE = 2;
    const int BUILDING_TIME = 15;

    private IHubContext<GameHub> _hubContext;
    private BlockingCollection<GameMessage> _messageQueue;

    public GameService(IHubContext<GameHub> hubContext, IGameMessageQueue messageQueue) {

        _hubContext = hubContext;
        _messageQueue = messageQueue.MessageQueue;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {

        await Task.Run(() => MessageLoop(stoppingToken), stoppingToken);
    }

    private void MessageLoop(CancellationToken stoppingToken) {

        try {

            while (true) {

                HandleMessage(_messageQueue.Take(stoppingToken), stoppingToken);
            }
        }
        catch (OperationCanceledException) {
        }
    }

    private void HandleMessage(GameMessage message, CancellationToken stoppingToken) {

        switch (message) {

            case PlayerConnectedMessage pcm:
                HandlePlayerConnected(pcm, stoppingToken);
                break;

            case PlayerDisconnectedMessage pdm:
                HandlePlayerDisconnected(pdm, stoppingToken);
                break;

            case BlockAddMessage bam:
                HandleBlockAdd(bam);
                break;

            case BlockRemoveMessage brm:
                HandleBlockRemoved(brm);
                break;

            case BuildingEndMessage bem:
                HandleBuildingEnd(bem);
                break;
        }
    }

    private Dictionary<string, PlayerInfo> _playersInfo = new();

    private List<string> _waitingPlayers = new List<string>();

    private void HandlePlayerConnected(PlayerConnectedMessage message, CancellationToken stoppingToken) {

        _playersInfo[message.id] = new PlayerInfo("waiting", message.login);

        _waitingPlayers.Add(message.id);

        _hubContext.Clients.Client(message.id).SendAsync("setState", "waiting");
        _hubContext.Clients.Clients(_waitingPlayers).SendAsync("WaitingProgress", _waitingPlayers.Count, GROUP_SIZE, stoppingToken);

        TryFormGroup(stoppingToken);
    }

    private void HandlePlayerDisconnected(PlayerDisconnectedMessage message, CancellationToken stoppingToken) {

        _playersInfo.Remove(message.playerId, out PlayerInfo? info);

        if ((info is not null) && (info.Group is null)) {

            _waitingPlayers.Remove(message.playerId);

            _hubContext.Clients.Clients(_waitingPlayers).SendAsync("WaitingProgress", _waitingPlayers.Count, GROUP_SIZE, stoppingToken);
        }
    }

    private void TryFormGroup(CancellationToken stoppingToken) {

        if (_waitingPlayers.Count == GROUP_SIZE) {

            var group = _waitingPlayers;

            _waitingPlayers = new();

            HandleGroupFormed(group, stoppingToken);
        }
    }

    private void HandleGroupFormed(List<string> group, CancellationToken stoppingToken) {

        var groupPlayersInfo = new List<(string, PlayerInfo)>();

        foreach (var userId in group) {

            var login = _playersInfo[userId].Login;

            var info = new PlayerInfo("building", login, group);

            _playersInfo[userId] = info;

            groupPlayersInfo.Add((userId, info));
        }

        _hubContext.Clients.Clients(group).SendAsync("SetState", "building");
        _hubContext.Clients.Clients(group).SendAsync("SetTimer", BUILDING_TIME);

        var logins = new List<string>();

        foreach(var (clientId, info) in groupPlayersInfo) {

            _hubContext.Clients.Client(clientId).SendAsync("SetOwnName", info.Login);

            logins.Add(info.Login);
        }

        _hubContext.Clients.Clients(group).SendAsync("SetPlayers", logins);

        Task.Run(async () => {

            await Task.Delay(BUILDING_TIME * 1000, stoppingToken);

            if (!stoppingToken.IsCancellationRequested) {

                _messageQueue.Add(new BuildingEndMessage(group), stoppingToken);
            }

        }, stoppingToken);
    }

    private void HandleBlockAdd(BlockAddMessage message) {

        var info = _playersInfo[message.playerId];

        if (info.state == "building") {

            _hubContext.Clients.Clients(info.Group!).SendAsync("BlockAdd", info.Login, 
                message.x, message.y, message.z, message.colorId);
        }
    }

    private void HandleBlockRemoved(BlockRemoveMessage message) {

        var info = _playersInfo[message.playerId];

        if (info.state == "building") {

            _hubContext.Clients.Clients(info.Group!).SendAsync("BlockRemove", info.Login,
                message.x, message.y, message.z);
        }
    }

    private void HandleBuildingEnd(BuildingEndMessage message) {

        _hubContext.Clients.Clients(message.group).SendAsync("SetState", "evaluation");
    }
}
