namespace Server.Game;

public record PlayerInfo(string State, string Login, List<string>? Group = null, 
    Dictionary<string, int>? Scores = null, Dictionary<(int, int, int), int>? World = null);