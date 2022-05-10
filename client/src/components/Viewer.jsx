import React, { useEffect, useRef } from "react";
import VoxelViewer from "../VoxelViewer";
import VoxelWorld from "../VoxelWorld";

const Viewer = ({style, blocks}) => {

    const canvasRef = useRef();

    const cellSize = 33;
    const center = Math.floor(cellSize / 2);

    const viewerRef = useRef(null); 

    useEffect(() => {

        const world = new VoxelWorld(cellSize);

        world.setVoxel(center, center, center, 1);

        viewerRef.current = new VoxelViewer(canvasRef.current, world);

    }, [center]);

    const currentBlocksRef = useRef([]);

    useEffect(() => {
        
        if (blocks) {

            for (const block of currentBlocksRef.current) {

                viewerRef.current.voxelWorld.setVoxel(block[0], block[1], block[2], 0);
            }

            for (const block of blocks) {

                viewerRef.current.voxelWorld.setVoxel(block[0], block[1], block[2], block[3] + 1);
            }

            viewerRef.current.update();

            currentBlocksRef.current = blocks;
        }

    }, [blocks]);

    return (
        <div className="Viewer" style={style}>
            <div className="overflow-hidden" style={{userSelect: 'none', width: '100%', height: '100%'}}>

                <canvas ref={canvasRef} className="w-100 h-100" />

            </div>
        </div>
    );
};

export default Viewer;