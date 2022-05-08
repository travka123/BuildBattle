namespace Server.Game.Messages;

public record BlockRemoveMessage(string playerId, int x, int y, int z) : GameMessage;

