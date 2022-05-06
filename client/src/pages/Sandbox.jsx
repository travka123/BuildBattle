import React from "react";
import { useNavigate } from "react-router-dom";
import Editor from "../components/Editor";

const Sandbox = () => {

    const navigate = useNavigate();

    return(
        <div className="Sandbox"> 
            <div>

                <Editor style={{width: '100vw', height: '100vh'}}
                    onBlockAdd={(position, colorId) => {console.log(`Block added. Position: ${position} ColorID: ${colorId}`)}}
                    onBlockRemove={(position) => {console.log(`Block removed. Position=${position}`)}}
                    />

                <button style={{position: 'absolute', bottom: '40px', left: '20px'}} onClick={() => navigate(-1)}>BACK</button>

            </div>
        </div>
    );
}

export default Sandbox;