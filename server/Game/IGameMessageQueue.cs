using Server.Game.Messages;
using System.Collections.Concurrent;

namespace Server.Game;

public interface IGameMessageQueue {

    public BlockingCollection<GameMessage> MessageQueue { get; }
}
