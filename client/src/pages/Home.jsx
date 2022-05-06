import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const [token, setToken] = useState(localStorage.getItem('jwt'));

    const navigate = useNavigate();

    return (
        <div className="Home">
            <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}>
                <div className="card" style={{width: '400px', margin: 'auto', marginTop: '20vh'}}>
                    {token ?
                        <button className="btn btn-primary btn-block m-2">Play</button> :
                        <button className="btn btn-primary btn-block m-2" onClick={() => (navigate('/signin'))}>Sign in</button>}
                    <button className="btn btn-secondary btn-block m-2" onClick={() => navigate('/sandbox')}>To sandbox</button>
                </div>
            </div>     
        </div>
    );
}

export default Home;