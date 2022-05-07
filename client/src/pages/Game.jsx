import AuthorizedAccess from "../components/AuthorizedAccess";
import GameController from "../components/GameController";

const Game = () => {

    return (
        <AuthorizedAccess>
            <GameController />
        </AuthorizedAccess>
    );
}

export default Game;