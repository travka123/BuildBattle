import * as THREE from 'three';

class VoxelEditor {

    #renderer;
    #scene;
    #camera;

    #fov    = 75;
    #near   = 0.1;
    #far    = 5;
    #aspect = 2;
    
    init(canvas) {

        this.#renderer = new THREE.WebGLRenderer({canvas});
        this.#renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        this.#scene = new THREE.Scene();

        this.#aspect = canvas.offsetWidth / canvas.offsetHeight;
        this.#camera = new THREE.PerspectiveCamera(this.#fov, this.#aspect, this.#near, this.#far);




        this.#camera.position.z = 2;

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const material = new THREE.MeshPhongMaterial({color: 0x442288});

        const cube = new THREE.Mesh(geometry, material);

        cube.rotateX(100);
        cube.rotateY(100);

        this.#scene.add(cube);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.#scene.add(light);

        this.render();
    }

    render() {

        this.#renderer.render(this.#scene, this.#camera);
    }

    resize() {

        const canvas = this.#renderer.domElement;

        this.#renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

        this.#camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.#camera.updateProjectionMatrix();

        this.render();
    }

}

export default VoxelEditor;