import React, { useEffect, useRef } from "react";
import ColorPicker from "./ColorPicker";
import VoxelEditor from "../VoxelEditor";

const Editor = ({style}) => {

    const voxelEditorRef = useRef(null);

    const canvasRef = useRef(null);

    useEffect(() => {

        voxelEditorRef.current = new VoxelEditor(canvasRef.current);

    }, []);

    useEffect(() => {

        const onResize = () => voxelEditorRef.current?.updateSize();

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);

    }, []);

    return (
        <div className="Editor">
            <div className="overflow-hidden" style={style}>

                <ColorPicker style={{position: 'absolute', top: '40px', left: '20px'}} onColorChange={(id) => {voxelEditorRef.current?.setActiveColorId(id)}}/> 

                <canvas ref={canvasRef} className="w-100 h-100"/>

            </div>
        </div>
    );
}

export default Editor;