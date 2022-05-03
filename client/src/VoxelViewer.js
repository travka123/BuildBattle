import VoxelRenderer from "./VoxelRenderer";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class VoxelViewer {

    constructor(voxelWorld) {

        this.voxelWorld = voxelWorld;
        this.voxelRenderer = new VoxelRenderer(this.voxelWorld);
    }

    setCanvas(canvas) {

        const center = Math.floor(this.voxelWorld.getCellSize() / 2) + 0.5;

        const fov = 75;
        const near = 0.1;
        const far = 1000;
        const aspect = canvas.offsetWidth / canvas.offsetHeight;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.z = 40;
        camera.position.x = 40;
        camera.position.y = 20;
        camera.lookAt(center, center, center);
        this.camera = camera;

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(center, center, center);
        controls.update();
        this.controls = controls;

        this.voxelRenderer.setCanvas(canvas);

        this.voxelRenderer.render(camera);

        controls.addEventListener('change', () => this.voxelRenderer.render(camera));
    }

    updateSize() {

        this.controls.update();

        this.voxelRenderer.updateSize(this.camera);
    }

    updateGeometry() {

        this.voxelRenderer.render(this.camera, true);
    }

}

export default VoxelViewer;