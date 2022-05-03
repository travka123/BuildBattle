import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import VoxelWorld from './VoxelWorld';

class VoxelRenderer {
    
    init(canvas) {

        const renderer = new THREE.WebGLRenderer({canvas});
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
        this.renderer = renderer;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('lightblue');
        this.scene = scene;

        const fov = 75;
        const near = 0.1;
        const far = 1000;
        const aspect = canvas.offsetWidth / canvas.offsetHeight;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        this.camera = camera;

        const controls = new OrbitControls(camera, canvas);
        this.controls = controls;

        const cellSize = 32;
        const rootBlockCords = new THREE.Vector3(cellSize / 2, cellSize / 2, cellSize / 2);

        controls.target.set(rootBlockCords.x + 0.5, rootBlockCords.y + 0.5, rootBlockCords.z + 0.5);
        controls.update();

        camera.position.z = 40;
        camera.position.x = 40;
        camera.position.y = 20;
        camera.lookAt(rootBlockCords);

        const world = new VoxelWorld(cellSize);

        for (let y = 0; y < cellSize; ++y) {
            for (let z = 0; z < cellSize; ++z) {
                for (let x = 0; x < cellSize; ++x) {
                    const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
                    if (y < height) {
                        world.setVoxel(x, y, z, 1);
                    }
                }
            }
        }

        //world.setVoxel(rootBlockCords.x, rootBlockCords.y, rootBlockCords.z, 1);   

        const {positions, normals, indices } = world.generateGeometry();   

        const geometry = new THREE.BufferGeometry();
        const material = new THREE.MeshLambertMaterial({color: 'green'});

        const positionNumComponents = 3;
        const normalNumComponents = 3;

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setIndex(indices);

        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
        
        const addLight = (x, y, z) => {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(x, y, z);
            scene.add(light);
        }

        addLight(-1,  2,  4);
        addLight( 1, -1, -2);

        this.render();

        controls.addEventListener('change', () => this.render());
    }

    render() {

        const {renderer, scene, camera} = this;

        renderer.render(scene, camera);
    }

    updateSize() {

        const {renderer, camera} = this;

        const canvas = renderer.domElement;

        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        this.render();
    }

}

export default VoxelRenderer;