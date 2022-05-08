using Microsoft.AspNetCore.SignalR;
using Server.Game.Messages;
using System.Collections.Concurrent;

namespace Server.Game;

public class GameService : BackgroundService {

    public const int GROUP_SIZE = 3;

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

            case PlayerConnectedMessage pcm when message is PlayerConnectedMessage:
                HandlePlayerConnected(pcm, stoppingToken);
                break;

            case PlayerDisconnectedMessage pdm when message is PlayerDisconnectedMessage:
                HandlePlayerDisconnected(pdm, stoppingToken);
                break;
        }
    }

    private Dictionary<string, PlayerInfo> playersInfo = new();

    private List<string> waitingPlayers = new List<string>();

    private void HandlePlayerConnected(PlayerConnectedMessage message, CancellationToken stoppingToken) {

        playersInfo[message.id] = new PlayerInfo(message.login);

        waitingPlayers.Add(message.id);

        _hubContext.Clients.Client(message.id).SendAsync("setState", "waiting");
        _hubContext.Clients.Clients(waitingPlayers).SendAsync("WaitingProgress", waitingPlayers.Count, GROUP_SIZE, stoppingToken);

        TryFormGroup();
    }

    private void HandlePlayerDisconnected(PlayerDisconnectedMessage message, CancellationToken stoppingToken) {

        playersInfo.Remove(message.playerId, out PlayerInfo? info);

        if ((info is not null) && (info.group is null)) {

            waitingPlayers.Remove(message.playerId);

            _hubContext.Clients.Clients(waitingPlayers).SendAsync("WaitingProgress", waitingPlayers.Count, GROUP_SIZE, stoppingToken);
        }
    }

    private void TryFormGroup() {

        if (waitingPlayers.Count == GROUP_SIZE) {

            var group = waitingPlayers;

            waitingPlayers = new();

            HandleGroupFormed(group);
        }
    }

    private void HandleGroupFormed(List<string> group) {


    }
}
