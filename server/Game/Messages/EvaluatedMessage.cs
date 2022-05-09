namespace Server.Game.Messages {

    public record EvaluatedMessage(string playerId, string EvaluatedPlayerLogin, int Score) : GameMessage;
}
