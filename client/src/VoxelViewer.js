import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import createMeshFromWorld from "./utils/CreateMeshFromWorld";

class VoxelViewer {

    constructor(canvas, voxelWorld) {

        this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        const fov = 75;
        const near = 0.1;
        const far = 1000;
        const aspect = canvas.offsetWidth / canvas.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this.controls = new OrbitControls(this.camera, canvas);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('lightblue');

        const ambientLightColor = 0x777777;
        const ambientLight = new THREE.AmbientLight(ambientLightColor);
        this.scene.add(ambientLight);

        const cameraLightColor = 0x888888;
        const cameraLightIntensity = 1;
        this.cameraLight = new THREE.DirectionalLight(cameraLightColor, cameraLightIntensity);
        this.scene.add(this.cameraLight);

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

    render = () => {

        const cameraPosition = this.camera.position;
        const center = this.controls.target;

        this.cameraLight.position.set(cameraPosition.x - center.x, cameraPosition.y - center.y, cameraPosition.z - center.z);

        this.renderer?.render(this.scene, this.camera)
    }

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