import { useEffect } from "react";
import * as signalR from '@microsoft/signalr';

const GameController = ({jwt}) => {

    useEffect(() => {

        (async () => {
            const connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7208/game', {accessTokenFactory: () => jwt})
            .build();

            await connection.start();
        })();

    }, [jwt]);

    return null;
}

export default GameController;