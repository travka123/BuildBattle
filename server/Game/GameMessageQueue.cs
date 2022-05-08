using Server.Game.Messages;
using System.Collections.Concurrent;

namespace Server.Game;

public class GameMessageQueue : IGameMessageQueue {

    public BlockingCollection<GameMessage> MessageQueue { get; } = new();
}

