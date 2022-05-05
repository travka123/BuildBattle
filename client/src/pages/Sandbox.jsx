import React from "react";
import Editor from "../components/Editor";

const Sandbox = () => {

    return(
        <div className="Sandbox"> 
            <div>

                <Editor style={{width: '100vw', height: '100vh'}} />

            </div>
        </div>
    );
}

export default Sandbox;