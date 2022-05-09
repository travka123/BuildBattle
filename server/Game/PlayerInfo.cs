namespace Server.Game;

public record PlayerInfo(string State, string Login, List<string>? Group = null, Dictionary<string, int>? Scores = null);