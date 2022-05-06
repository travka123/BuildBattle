import React from "react";
import Editor from "../components/Editor";

const Sandbox = () => {

    return(
        <div className="Sandbox"> 
            <div>

                <Editor style={{width: '100vw', height: '100vh'}}
                    onBlockAdd={(position, colorId) => {console.log(`Block added. Position: ${position} ColorID: ${colorId}`)}}
                    onBlockRemove={(position) => {console.log(`Block removed. Position=${position}`)}}
                    />

            </div>
        </div>
    );
}

export default Sandbox;