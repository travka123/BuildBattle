import { useEffect, useState } from "react";
import * as signalR from '@microsoft/signalr';
import Waiting from "../pages/Waiting";

const GameController = ({jwt}) => {

    const [state, setState] = useState('');

    const [currentConnected, setCurrentConnected] = useState('');
    const [targetConnected, setTargetConnected] = useState('');

    useEffect(() => {

        const connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7208/game', {withCredentials: true, accessTokenFactory: () => jwt})
            .build();

        (async () => {  

            connection.on("SetState", (nstate) => {

                setState(nstate);
            });

            connection.on("WaitingProgress", (current, target) => {

                setCurrentConnected(current);
                setTargetConnected(target);
            });

            await connection.start();
                       
        })();

        return async () => await connection.stop()
        
    }, [jwt]);

    return (
        <div className="GameController">
            {state === 'waiting' ? <Waiting current={currentConnected} target={targetConnected}/> : 
             <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}/>}
        </div>
    );
}

export default GameController;