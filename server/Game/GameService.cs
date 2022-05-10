using Microsoft.AspNetCore.SignalR;
using Server.Data;
using Server.Game.Messages;
using System.Collections.Concurrent;

namespace Server.Game;

public class GameService : BackgroundService {

    public const int GROUP_SIZE = 1;
    const int BUILDING_TIME = 15;
    const int EVALUATING_TIME = 15;

    private readonly IHubContext<GameHub> _hubContext;
    private readonly BlockingCollection<GameMessage> _messageQueue;

    private readonly IServiceScopeFactory _scopeFactory;

    public GameService(IHubContext<GameHub> hubContext, IGameMessageQueue messageQueue, IServiceScopeFactory scopeFactory) {

        _hubContext = hubContext;
        _messageQueue = messageQueue.MessageQueue;
        _scopeFactory = scopeFactory;
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

            case PlayerConnectedMessage dmes:
                HandlePlayerConnected(dmes, stoppingToken);
                break;

            case PlayerDisconnectedMessage dmes:
                HandlePlayerDisconnected(dmes, stoppingToken);
                break;

            case BlockAddMessage dmes:
                HandleBlockAdd(dmes);
                break;

            case BlockRemoveMessage dmes:
                HandleBlockRemoved(dmes);
                break;

            case StageEndMessage dmes when dmes.Stage == "building":
                HandleBuildingEnd(dmes, stoppingToken);
                break;

            case EvaluatedMessage dmes:
                HandleEvaluated(dmes);
                break;

            case StageEndMessage dmes when dmes.Stage == "evaluating":
                HandleEvaluatingEnd(dmes);
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

        _playersInfo.TryGetValue(message.playerId, out PlayerInfo? info);

        if ((info is not null) && (info.State == "waiting")) {

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

    private readonly Random _random = new();

    private void HandleGroupFormed(List<string> group, CancellationToken stoppingToken) {

        var groupPlayersInfo = new List<(string, PlayerInfo)>();

        foreach (var userId in group) {

            var login = _playersInfo[userId].Login;

            var info = new PlayerInfo("building", login, group);

            _playersInfo[userId] = info;

            groupPlayersInfo.Add((userId, info));
        }

        using (var scope = _scopeFactory.CreateScope()) {

            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var count = dbContext.Themes.Count();

            var theme = dbContext.Themes.Skip(_random.Next() % count).Take(1).Single();

            _hubContext.Clients.Clients(group).SendAsync("SetTheme", theme.Name);
        }

        var logins = new List<string>();

        foreach (var (clientId, info) in groupPlayersInfo) {

            _hubContext.Clients.Client(clientId).SendAsync("SetOwnName", info.Login);

            logins.Add(info.Login);
        }

        _hubContext.Clients.Clients(group).SendAsync("SetPlayers", logins);

        _hubContext.Clients.Clients(group).SendAsync("SetState", "building");
        _hubContext.Clients.Clients(group).SendAsync("SetTimer", BUILDING_TIME);

        Task.Run(async () => {

            await Task.Delay(BUILDING_TIME * 1000, stoppingToken);

            if (!stoppingToken.IsCancellationRequested) {

                _messageQueue.Add(new StageEndMessage("building", group), stoppingToken);
            }

        }, stoppingToken);
    }

    private void HandleBlockAdd(BlockAddMessage message) {

        var info = _playersInfo[message.playerId];

        if (info.State == "building") {

            _hubContext.Clients.Clients(info.Group!).SendAsync("BlockAdd", info.Login,
                message.x, message.y, message.z, message.colorId);
        }
    }

    private void HandleBlockRemoved(BlockRemoveMessage message) {

        var info = _playersInfo[message.playerId];

        if (info.State == "building") {

            _hubContext.Clients.Clients(info.Group!).SendAsync("BlockRemove", info.Login,
                message.x, message.y, message.z);
        }
    }

    private void HandleBuildingEnd(StageEndMessage message, CancellationToken stoppingToken) {

        foreach (var playerId in message.Group) {

            _playersInfo[playerId] = _playersInfo[playerId] with { State = "evaluating", Scores = new() };
        }

        _hubContext.Clients.Clients(message.Group).SendAsync("SetState", "evaluation");
        _hubContext.Clients.Clients(message.Group).SendAsync("SetTimer", EVALUATING_TIME);

        Task.Run(async () => {

            await Task.Delay(BUILDING_TIME * 1000, stoppingToken);

            if (!stoppingToken.IsCancellationRequested) {

                _messageQueue.Add(new StageEndMessage("evaluating", message.Group), stoppingToken);
            }

        }, stoppingToken);
    }

    private void HandleEvaluated(EvaluatedMessage message) {

        var info = _playersInfo[message.playerId];

        if ((info.State == "evaluating") && (info.Login != message.EvaluatedPlayerLogin)) {

            info.Scores![message.EvaluatedPlayerLogin] = message.Score;
        }
    }

    private void HandleEvaluatingEnd(StageEndMessage message) {

        List<PlayerInfo> playersInfo = new();

        foreach (var playerId in message.Group) {

            playersInfo.Add(_playersInfo[playerId]);
        }

        var best = playersInfo.MaxBy(i => {

            return playersInfo.Sum(j => {

                if (j.Scores!.TryGetValue(i.Login, out int score)) {

                    return score;
                }

                return 3;
            });
        });

        _hubContext.Clients.Clients(message.Group).SendAsync("SetWinner", best!.Login);

        foreach (var playerId in message.Group) {

            _playersInfo.Remove(playerId);
        }
    }
}
