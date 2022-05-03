import * as THREE from 'three';

class VoxelRenderer {
    
    constructor(voxelWorld) {

        this.voxelWorld = voxelWorld;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('lightblue');
        this.scene = scene;

        this.mesh = this.createMesh();
        scene.add(this.mesh);
        
        const addLight = (x, y, z) => {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(x, y, z);
            scene.add(light);
        }

        addLight(-1,  2,  4);
        addLight( 1, -1, -2);
    }

    setCanvas(canvas) {

        const renderer = new THREE.WebGLRenderer({canvas});
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
        this.renderer = renderer;
    }

    createMesh() {

        const {positions, normals, indices } = this.voxelWorld.generateGeometry();   

        const geometry = new THREE.BufferGeometry();
        const material = new THREE.MeshLambertMaterial({color: 'green'});

        const positionNumComponents = 3;
        const normalNumComponents = 3;

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setIndex(indices);

        return new THREE.Mesh(geometry, material);
    }

    render(camera, hasChanged) {

        const {renderer, scene} = this;

        if (hasChanged) {

            scene.remove(this.mesh);
            this.mesh = this.createMesh();
            scene.add(this.mesh);
        }

        renderer.render(scene, camera);
    }

    updateSize(camera) {

        const {renderer} = this;

        const canvas = renderer.domElement;

        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        this.render(camera);
    }

}

export default VoxelRenderer;