namespace Server.Game.Messages;

public record BlockAddMessage(string playerId, int x, int y, int z, int colorId) : GameMessage;

