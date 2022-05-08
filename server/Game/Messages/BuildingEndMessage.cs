namespace Server.Game.Messages;

public record BuildingEndMessage(List<string> group) : GameMessage;
