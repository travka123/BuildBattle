namespace Server.Game.Messages {
    public record PlayerConnectedMessage(string id, string login) : GameMessage;
}
