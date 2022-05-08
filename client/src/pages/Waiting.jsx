import React from "react";

const Waiting = ({current, target}) => {

    return (
        <div className="Waiting">
            <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}>
                <div className="card" style={{width: '400px', margin: 'auto', marginTop: '20vh'}}>
                    <div className="card-body">
                        <h2 className="text-center">{current} / {target}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Waiting;