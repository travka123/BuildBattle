import React, { useEffect, useRef } from "react";
import ColorPicker from "../components/ColorPicker";
import VoxelEditor from "../VoxelEditor";

const Sandbox = () => {

    const canvasRef = useRef(null);

    const voxelEditor = useRef(null);

    useEffect(() => {

        voxelEditor.current = new VoxelEditor(canvasRef.current);

        const onResize = () => voxelEditor.current.updateSize()

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);

    }, [])

    return(
        <div className="Sandbox"> 

            <ColorPicker style={{position: 'absolute', top: '40px', left: '20px'}} onColorChange={(id) => {voxelEditor.current?.setActiveColorId(id)}}/>   

            <div className="vh-100 overflow-hidden">
                <canvas ref={canvasRef} className="w-100 h-100"/>
            </div>

        </div>
    );
}

export default Sandbox;