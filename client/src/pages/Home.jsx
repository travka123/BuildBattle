import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerApi from "../ServerApi";

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

    return (
        <div className="Home">
            <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}>
                <div className="card" style={{width: '400px', margin: 'auto', marginTop: '10vh'}}>
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
                    {history ?
                        <div className="overflow-auto" style={{maxHeight: '160px'}}>
                            {history.map((match, id) => 
                                <div key={id} className="d-flex justify-content-between">
                                    <h5 className="d-inline m-2" style={{width: '7rem'}}>{match.theme}</h5>
                                    <h5 className="d-inline m-2">{new Date(match.date).toLocaleString().slice(0, 17)}</h5>
                                    <h5 className="d-inline m-2" style={{width: '3rem'}}>{match.isWinner ? 'WIN' : ''}</h5>
                                </div>)} 
                        </div>:
                        null}
                </div>
            </div>     
        </div>
    );
}

export default Home;