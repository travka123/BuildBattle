import React, { useEffect, useRef } from "react";
import VoxelRenderer from "../VoxelRenderer";

const Sandbox = () => {

    const canvasRef = useRef(null);
    const voxelEditorRef = useRef(new VoxelRenderer());

    useEffect(() => {

        const voxelEditor = voxelEditorRef.current;

        voxelEditor.init(canvasRef.current)

        const onResize = () => voxelEditor.updateSize()

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);

    }, [])

    return(
        <div className="Sandbox">      
            <div className="vh-100 overflow-hidden">

                <canvas ref={canvasRef} className="w-100 h-100"/>

            </div>
        </div>
    );
}

export default Sandbox;