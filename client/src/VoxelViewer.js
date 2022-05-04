import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import createMeshFromWorld from "./utils/CreateMeshFromWorld";

class VoxelViewer {

    constructor(canvas, voxelWorld) {

        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        const fov = 75;
        const near = 0.1;
        const far = 1000;
        const aspect = canvas.offsetWidth / canvas.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this.controls = new OrbitControls(this.camera, canvas);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('lightblue');

        const addLight = (x, y, z) => {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(x, y, z);
            this.scene.add(light);
        }

        addLight(-1,  2,  4);
        addLight( 1, -1, -2);

        this.cellSize = voxelWorld.getCellSize();
        this.voxelWorld = voxelWorld;
        this.voxelWorldMesh = createMeshFromWorld(voxelWorld);
        this.scene.add(this.voxelWorldMesh);

        this.resetCamera();

        this.controls.addEventListener('change', () => this.render());
    }

    update() {

        this.scene.remove(this.voxelWorldMesh);  
        this.voxelWorldMesh = createMeshFromWorld(this.voxelWorld);
        this.scene.add(this.voxelWorldMesh);

        this.render();
    }

    render = () => this.renderer?.render(this.scene, this.camera);

    resetCamera() {

        const {camera, controls} = this;
   
        if (this.voxelWorld) {

            const center = Math.floor(this.cellSize / 2) + 0.5;
            camera.position.z = 30;
            camera.position.x = 30;
            camera.position.y = 20;
            camera.lookAt(center, center, center);

            if (this.controls) {

                controls.target.set(center, center, center);
                controls.update();
            }
        }

        this.render();
    }

    updateSize() {

        const {renderer, camera, controls, render} = this;

        const canvas = renderer.domElement;

        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        controls.update();

        render();
    }

    getBlockAt(x, y) {

        const {renderer} = this;

        const canvas = renderer.domElement;

        const vx = (x / canvas.width ) *  2 - 1;
        const vy = (y / canvas.height) * -2 + 1;

        const {camera, voxelWorld} = this;

        const start = new THREE.Vector3();
        const end = new THREE.Vector3();
        start.setFromMatrixPosition(camera.matrixWorld);
        end.set(vx, vy, 1).unproject(camera);

        return voxelWorld.intersectRay(start, end);
    }

    getCanvasRelativePosition = (x, y) => {

        const {renderer} = this;

        const canvas = renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (x - rect.left) * canvas.width  / rect.width,
            y: (y - rect.top ) * canvas.height / rect.height,
        };
    }
}

export default VoxelViewer;