import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/sandbox')}>To sandbox</button>
    );
}

export default Home;