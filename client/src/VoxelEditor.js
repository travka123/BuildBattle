import VoxelViewer from "./VoxelViewer";
import VoxelWorld from "./VoxelWorld";

class VoxelEditor extends VoxelViewer {

    constructor(canvas) {

        const cellSize = 33;
        const voxelWorld = new VoxelWorld(cellSize);
        const rootBlockColor = 0;
        const center = Math.floor(cellSize / 2);
        voxelWorld.setVoxel(center, center, center, rootBlockColor + 1);

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

        switch (event.button) {

            case 0:
                this.addBlock(event.offsetX, event.offsetY);
                break;

            case 2:
                this.removeBlock(event.offsetX, event.offsetY);
                break;

            default:
                break;
        }
    }

    addBlock(canvasX, canvasY) {

        const intersection = this.getBlockAt(canvasX, canvasY);

        if (intersection) {

            const position = intersection.position.map((p, i) => Math.floor(p + 0.5 * intersection.normal[i]));
        
            if (this.activeColorId !== undefined) {

                if (this.voxelWorld.setVoxel(...position, this.activeColorId + 1)) {

                    this.update();

                    this.callEvent('onAdd', position, this.activeColorId);                
                }            
            }
        }
    }

    removeBlock(canvasX, canvasY) {

        const intersection = this.getBlockAt(canvasX, canvasY);

        if (intersection) {

            const position = intersection.position.map((p, i) => Math.floor(p - 0.5 * intersection.normal[i]));

            const center = Math.floor(this.cellSize / 2);

            if ((position[0] !== center) || (position[1] !== center) || (position[2] !== center)) {

                if (this.voxelWorld.setVoxel(...position, 0)) {

                    this.update();

                    this.callEvent('onRemove', position);
                }
            }     
        }
    }

    handlers = {onAdd: [], onRemove: []};

    addEventListener(type, handler) {

        this.handlers[type].push(handler);
    }

    removeEventListner(type, handler) {

        this.handlers[type] = this.handlers[type].filter((h) => h !== handler);
    }

    callEvent(type, ...args) {

        for (let handler of this.handlers[type]) {

            handler(...args);
        }
    } 

    setActiveColorId(colorId) {

        this.activeColorId = colorId;
    }
} 

export default VoxelEditor;