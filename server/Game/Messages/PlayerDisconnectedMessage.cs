namespace Server.Game.Messages {
    public record PlayerDisconnectedMessage(string playerId) : GameMessage {
    }
}
