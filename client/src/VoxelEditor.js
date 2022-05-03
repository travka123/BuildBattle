import VoxelViewer from "./VoxelViewer";
import VoxelWorld from "./VoxelWorld";

class VoxelEditor {

    constructor() {

        this.cellSize = 33;
        this.voxelWorld = new VoxelWorld(this.cellSize);

        const centerBlock = Math.floor(this.voxelWorld.getCellSize() / 2);

        this.voxelWorld.setVoxel(centerBlock, centerBlock, centerBlock, 1);

        this.voxelViewer = new VoxelViewer(this.voxelWorld);
    }

    setCanvas(canvas) {

        this.voxelViewer.setCanvas(canvas);
    }

    updateSize() {

        this.voxelViewer.updateSize();
    }
}

export default VoxelEditor;