import React from "react";
import Viewer from "./Viewer";

const ViewerCard = ({style, canvasStyle, blocks, text}) => {

    return (
        <div className="ViewerCard" style={style}>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{text}</h5>
                    <Viewer style={canvasStyle} blocks={blocks} />
                </div>     
            </div>         
        </div>
    );
}

export default ViewerCard;