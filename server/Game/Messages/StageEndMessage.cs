﻿namespace Server.Game.Messages;

public record StageEndMessage(string Stage, List<string> Group) : GameMessage;
