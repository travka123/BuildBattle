namespace Server.Game;

public record PlayerInfo(string Login, List<string>? group = null);