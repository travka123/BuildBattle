import { useEffect, useRef, useState } from "react";
import * as signalR from '@microsoft/signalr';
import Waiting from "../pages/Waiting";
import Editor from "./Editor";
import Viewer from "./Viewer";
import EvaluationBar from "./EvaluationBar";
import { useNavigate } from "react-router-dom";

const GameController = ({jwt}) => {

    const [state, setState] = useState('');

    const [self, setSelf] = useState('');
    const [players, setPlayers] = useState(null);

    const [currentConnected, setCurrentConnected] = useState('');
    const [targetConnected, setTargetConnected] = useState('');

    const [timeLeft, setTimeLeft] = useState(0);
    
    const [worlds, setWorlds] = useState(null);
    const worldsRef = useRef();

    const connectionRef = useRef(null);

    const [currentEvaluating, setCurrentEvaluating] = useState(0);

    const [winner, setWinner] = useState('');

    const [theme, setTheme] = useState('');

    const navigate = useNavigate();

    useEffect(() => {

        let exists = true;

        const timer = (time) => {

            setTimeLeft(time)
     
            time--;
            if (time >= 0) {
    
                setTimeout(() => timer(time), 1000);
            }
        }

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

                

                timer(timeInSeconds);
            });

            connection.on("SetOwnName", (name) => {

                console.log(`Hello, ${name})`);
                setSelf(name);
            });

            connection.on("SetPlayers", (players) => {

                setPlayers(players);

                const worlds = {};

                for (const player of players) {

                    worlds[player] = [];
                }

                worldsRef.current = worlds;
                setWorlds(worlds);

                console.log(players);
                console.log(worlds);
            });

            connection.on("BlockAdd", (playerName, x, y, z, colorId) => {

                const worlds = worldsRef.current;

                if (worlds) {

                    worlds[playerName].push([x, y, z, colorId]);
                    setWorlds(worlds);

                    console.log(worlds);
                }

                console.log("Add", playerName, x, y, z, colorId);
            });

            connection.on("BlockRemove", (playerName, x, y, z) => {

                let worlds = worldsRef.current;

                if (worlds) {

                    worlds[playerName] = worlds[playerName].filter((block) => (block[0] !== x) || (block[1] !== y) || (block[2]) !== z)
                    setWorlds(worldsRef.current);

                    console.log(worlds);
                }

                console.log("Remove", playerName, x, y, z);
            });

            connection.on("SetWinner", (winner) => {

                setWinner(winner);
                setState('ended');
                timer(6);
                setTimeout(() => {

                    if (exists)
                        navigate('/', {replace: true});

                }, 6000);

                console.log(winner);
            });

            connection.on("SetTheme", (theme) => {

                setTheme(theme);

                console.log(theme);
            });

            await connection.start();

            connectionRef.current = connection;
                       
        })();

        return async () => {

            exists = false;

            await connection.stop()
        };
        
    }, [jwt, navigate]);

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

    const showNext = () => {
        if (currentEvaluating + 1 < players.length)
            setCurrentEvaluating(currentEvaluating + 1);
    }

    const showPrevious = () => {
        if (currentEvaluating > 0)
            setCurrentEvaluating(currentEvaluating - 1);
    }

    const [marks, setMarks] = useState({});

    const evaluated = (value) => {
        
        const nmarks = {...marks};

        nmarks[players[currentEvaluating]] = value;

        const connection = connectionRef.current;
        if (connection) {

            connection.invoke("Evaluated", players[currentEvaluating], value);
        }

        setMarks(nmarks);
    }

    return (
        <div className="GameController">

            {
                state === 'waiting' ? <Waiting current={currentConnected} target={targetConnected}/> :
                state === 'building' ? 
                    <div>
                        <Editor onBlockAdd={onBlockAdd} onBlockRemove={onBlockRemove} style={{width: '100vw', height: '100vh'}} />
                        <div style={{position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)'}}><h3>{theme}</h3></div>
                    </div> :
                state === 'evaluation' ? 
                    <div>
                        <Viewer blocks={worlds[players[currentEvaluating]]} style={{width: '100vw', height: '100vh'}}/>
                        <button onClick={showNext} style={{position: 'absolute', bottom: '40px', right: '40px'}}>NEXT</button>
                        <button onClick={showPrevious} style={{position: 'absolute', bottom: '40px', left: '40px'}}>PREV</button>
                        {players[currentEvaluating] !== self ? 
                            <EvaluationBar rating={marks[players[currentEvaluating]]} setSelected={evaluated} style={{position: 'absolute', top: '40px', left: '40px'}}/> :
                            null}
                        <h2 style={{position: 'absolute', top: '150px', left: '40px'}}>{players[currentEvaluating]}</h2>
                        <div style={{position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)'}}><h3>{theme}</h3></div>
                    </div> :
                state === 'ended' ? 
                    <div>
                        <Viewer blocks={worlds[winner]} style={{width: '100vw', height: '100vh'}}/>
                        <div style={{position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)'}}><h3>WINNER</h3></div>
                        <div style={{position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)'}}><h2>{winner}</h2></div>
                        <div style={{position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)'}}><h3>{theme}</h3></div>
                    </div> :
                <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}/>}

            {timeLeft ? <h2 style={{position: 'absolute', top: '40px', right: '40px'}}>{timeLeft}</h2> :null}

        </div>
    );
}

export default GameController;