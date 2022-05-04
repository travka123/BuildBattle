import VoxelViewer from "./VoxelViewer";
import VoxelWorld from "./VoxelWorld";

class VoxelEditor extends VoxelViewer {

    constructor(canvas) {

        const cellSize = 33;
        const voxelWorld = new VoxelWorld(cellSize);
        const rootBlockColor = 1;
        const center = Math.floor(cellSize / 2);
        voxelWorld.setVoxel(center, center, center, rootBlockColor);

        super(canvas, voxelWorld);

        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    onMouseDown() {

        this.lastClickDate = Date.now();
    }

    onMouseUp(event) { 

        if (Date.now() - this.lastClickDate < 200) {

            this.onClick(event);
        }
    }

    onClick(event) {

        const {x, y} = this.getCanvasRelativePosition(event.offsetX, event.offsetY);

        switch (event.button) {

            case 0:
                this.addBlock(x, y);
                break;

            case 2:
                this.removeBlock(x, y);
                break;

            default:
                break;
        }
    }

    addBlock(canvasX, canvasY) {

        const intersection = this.getBlockAt(canvasX, canvasY);

        if (intersection) {

            const position = intersection.position.map((p, i) => Math.floor(p + 0.5 * intersection.normal[i]));
        
            if (this.activeColorId) {

                this.voxelWorld.setVoxel(...position, this.activeColorId);

                this.update();
            }
        }
    }

    removeBlock(canvasX, canvasY) {

        const intersection = this.getBlockAt(canvasX, canvasY);

        if (intersection) {

            const position = intersection.position.map((p, i) => Math.floor(p - 0.5 * intersection.normal[i]));

            const center = Math.floor(this.cellSize / 2);

            if ((position[0] !== center) || (position[1] !== center) || (position[2] !== center)) {

                this.voxelWorld.setVoxel(...position, 0);

                this.update(); 
            }     
        }
    }

    setActiveColorId(colorId) {

        if (colorId) {

            this.activeColorId = colorId;
        }
    } 
} 

export default VoxelEditor;