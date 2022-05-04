import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import createMeshFromWorld from "./utils/CreateMeshFromWorld";

class VoxelViewer {

    constructor() {

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

        const fov = 75;
        const near = 0.1;
        const far = 1000;
        const aspect = 2;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    setWorld(world) {

        this.voxelWorld = world;

        if (this.mesh){
            this.scene.remove(this.mesh);
        }
        
        this.mesh = createMeshFromWorld(world);
        this.scene.add(this.mesh);

        this.render();
    }

    setCanvas(canvas) {

        this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, canvas);

        this.resetCamera();

        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        this.render();

        this.controls.addEventListener('change', () => this.render());
    }

    render = () => this.renderer?.render(this.scene, this.camera);

    resetCamera() {

        const {camera, controls} = this;
   
        if (this.voxelWorld) {

            const center = Math.floor(this.voxelWorld.getCellSize() / 2) + 0.5;
            camera.position.z = 40;
            camera.position.x = 40;
            camera.position.y = 20;
            camera.lookAt(center, center, center);

            if (this.controls) {

                controls.target.set(center, center, center);
                controls.update();
            }
        }
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

        const {camera, voxelWorld} = this;

        const start = new THREE.Vector3();
        const end = new THREE.Vector3();
        start.setFromMatrixPosition(camera.matrixWorld);
        end.set(x, y, 1).unproject(camera);

        return voxelWorld.intersectRay(start, end);
    }
}

export default VoxelViewer;