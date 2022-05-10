import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerApi from "../ServerApi";

const Home = () => {

    const [token, setToken] = useState(localStorage.getItem('jwt'));

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

    return (
        <div className="Home">
            <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}>
                <div className="card" style={{width: '400px', margin: 'auto', marginTop: '20vh'}}>
                    {stats ? 
                    <div>
                        <div><h3 className="text-center mt-1">played: {stats.played}</h3></div>
                        <div><h3 className="text-center">wins: {stats.wins}</h3></div>
                    </div> :
                    null}
                    {token ?
                        <button className="btn btn-primary btn-block m-2" onClick={() => (navigate('/game'))}>Play</button> :
                        <button className="btn btn-primary btn-block m-2" onClick={() => (navigate('/signin'))}>Sign in</button>}
                    <button className="btn btn-secondary btn-block m-2" onClick={() => navigate('/sandbox')}>To sandbox</button>
                </div>
            </div>     
        </div>
    );
}

export default Home;