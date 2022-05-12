import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerApi from "../ServerApi";
import * as signalR from '@microsoft/signalr';
import ViewerCard from "../components/ViewerCard";

const Home = () => {

    const token = localStorage.getItem('jwt');

    const navigate = useNavigate();

    const [stats, setStats] = useState(null);

    useEffect(() => {
        (async () => {

            const api = new ServerApi(token);
            const response = await api.stats();

            if (response.status === 200);
                setStats(response.stats);

        })();
    }, [token]);

    const [history, setHistory] = useState();

    useEffect(() => {
        (async () => {

            const api = new ServerApi(token);
            const response = await api.history();

            if (response.status === 200);
                setHistory(response.history.reverse());

            console.log(response.history)

        })();
    }, [token]);

    const [worlds, setWorlds] = useState(null);
    const worldsRef = useRef(null);

    useEffect(() => {

        const connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7208/gallery', {withCredentials: true, accessTokenFactory: () => token})
            .build();

        (async () => {

            connection.on("onConnected", (worlds) => {

                worlds = worlds.reverse().map((world, id) => {
                    world.key = id;
                    return world;
                });

                worldsRef.current = worlds;
                console.log(worldsRef.current);
                setWorlds(worldsRef.current)
            });

            connection.on("onAdd", (world) => {

                if (worldsRef.current) {

                    world.key = worldsRef.current.length;

                    worldsRef.current = [world, ...worldsRef.current];
                    console.log(worldsRef.current);
                    setWorlds(worldsRef.current);
                }
            });

            await connection.start();
        })();

        return () => {
            (async () => {

                await connection.stop();
            })();
        }
    }, [token]);

    return (
        <div className="Home" style={{overflowX: 'hidden', height: '100vh'}}>
            <div style={{width: '100vw', height: '55%', backgroundColor: 'lightblue', overflow: 'hidden'}}>
                <div className="card" style={{width: '400px', margin: 'auto', marginTop: '10vh'}}>
                    {stats ?    
                    <div className="d-flex justify-content-around">
                        <h3 className="d-inline text-center mt-2">played: {stats.played}</h3>
                        <h3 className="d-inline text-center mt-2">wins: {stats.wins}</h3>
                    </div> :
                    null}
                    {token ?
                        <button className="btn btn-primary btn-block m-2" onClick={() => (navigate('/game'))}>Play</button> :
                        <button className="btn btn-primary btn-block m-2" onClick={() => (navigate('/signin'))}>Sign in</button>}
                    <button className="btn btn-secondary btn-block m-2" onClick={() => navigate('/sandbox')}>To sandbox</button>
                    {history ?
                        <div className="overflow-auto" style={{maxHeight: '160px'}}>
                            {history.map((match, id) => 
                                <div key={id} className="d-flex justify-content-between">
                                    <h5 className="d-inline m-2" style={{width: '6rem'}}>{match.theme}</h5>
                                    <h5 className="d-inline m-2">{new Date(match.date).toLocaleString().slice(0, 17)}</h5>
                                    <h5 className="d-inline m-2" style={{width: '3rem'}}>{match.isWinner ? 'WIN' : ''}</h5>
                                </div>)} 
                        </div>:
                        null}
                </div>
            </div>
            <div style={{overflowX: 'hidden', backgroundColor: 'lightblue', minHeight: '45%'}}>
                <div className="d-flex justify-content-around flex-wrap vertical-scrollable" >

                        {worlds ? worlds.map((item) => <ViewerCard blocks={item.world} key={item.key}
                            style={{margin: '30px'}} canvasStyle={{width: '22rem', height: '22rem'}} text={`${item.theme}, ${item.playerName}`}/>) : ''}
                </div>
            </div>   
        </div>
    );
}

export default Home;