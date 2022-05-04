import VoxelViewer from "./VoxelViewer";
import VoxelWorld from "./VoxelWorld";
import * as THREE from 'three';

class VoxelEditor {

    constructor() {

        this.cellSize = 33;
        this.voxelWorld = new VoxelWorld(this.cellSize);

        const centerBlock = Math.floor(this.voxelWorld.getCellSize() / 2);

        this.voxelWorld.setVoxel(centerBlock, centerBlock, centerBlock, 1);

        this.voxelViewer = new VoxelViewer();
        this.voxelViewer.setWorld(this.voxelWorld);
    }

    setCanvas(canvas) {

        this.voxelViewer.setCanvas(canvas);

        var clickDate = Date.now();

        const getCanvasRelativePosition = (event) => {
            const rect = canvas.getBoundingClientRect();
            console.log(event.clientX);
            return {
                x: (event.clientX - rect.left) * canvas.width  / rect.width,
                y: (event.clientY - rect.top ) * canvas.height / rect.height,
            };
        }

        const onClick = (event) => {
            const pos = getCanvasRelativePosition(event);
            const x = (pos.x / canvas.width ) *  2 - 1;
            const y = (pos.y / canvas.height) * -2 + 1;

            const intersection = this.voxelViewer.getBlockAt(x, y);
            if (intersection) {

                const pos = intersection.position.map((p, i) => {
                    return Math.floor(p + 0.5 * intersection.normal[i]);
                });

                this.voxelWorld.setVoxel(pos[0], pos[1], pos[2], 1);

                console.log(pos);
                
                this.voxelViewer.setWorld(this.voxelWorld);
            }
        }

        canvas.addEventListener('mousedown', () => {

            clickDate = Date.now();   

            console.log('md'); 
        });

        canvas.addEventListener('mouseup', (event) => {
            if (Date.now() - clickDate < 200) {

                onClick(event);
            }
        });
    }

    updateSize() {

        this.voxelViewer.updateSize();
    }
}

export default VoxelEditor;