import { useEffect, useRef, useState } from "react";
import * as signalR from '@microsoft/signalr';
import Waiting from "../pages/Waiting";
import Editor from "./Editor";

const GameController = ({jwt}) => {

    const [state, setState] = useState('');

    const [self, setSelf] = useState('');

    const [currentConnected, setCurrentConnected] = useState('');
    const [targetConnected, setTargetConnected] = useState('');

    const [timeLeft, setTimeLeft] = useState(0);

    const connectionRef = useRef(null);

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

            connection.on("SetTimer", (timeInSeconds) => {

                const timer = (time) => {

                    setTimeLeft(time)
             
                    time--;
                    if (time >= 0) {
            
                        setTimeout(() => timer(time), 1000);
                    }
                }

                timer(timeInSeconds);
            });

            connection.on("SetOwnName", (name) => {

                console.log(`Hello, ${name})`);
                setSelf(name);
            });

            connection.on("SetPlayers", (players) => {

                console.log(players);
            });

            connection.on("BlockAdd", (playerName, x, y, z, colorId) => {

                console.log("Add", playerName, x, y, z, colorId);
            });

            connection.on("BlockRemove", (playerName, x, y, z) => {

                console.log("Remove", playerName, x, y, z);
            });

            await connection.start();

            connectionRef.current = connection;
                       
        })();

        return async () => await connection.stop()
        
    }, [jwt]);

    const onBlockAdd = (position, colorId) => {

        const connection = connectionRef.current;
        if (connection) {

            connection.invoke("BlockAdd", position[0], position[1], position[2], colorId);
        }
    }

    const onBlockRemove = (position) => {

        const connection = connectionRef.current;
        if (connection) {

            connection.invoke("BlockRemove", position[0], position[1], position[2]);
        }
    }

    return (
        <div className="GameController">

            {state === 'waiting' ? <Waiting current={currentConnected} target={targetConnected}/> :
                state === 'building' ? <Editor onBlockAdd={onBlockAdd} onBlockRemove={onBlockRemove} style={{width: '100vw', height: '100vh'}} /> :
                <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}/>}

            {timeLeft ? <h2 style={{position: 'absolute', bottom: '40px', left: '20px'}}>{self}, {timeLeft}</h2> :null}

        </div>
    );
}

export default GameController;