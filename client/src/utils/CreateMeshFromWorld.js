import * as THREE from 'three';

function createMeshFromWorld(world) {
    
    const {positions, normals, indices } = world.generateGeometry();   

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshLambertMaterial({color: 'green'});

    const positionNumComponents = 3;
    const normalNumComponents = 3;

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.setIndex(indices);

    return new THREE.Mesh(geometry, material);
}

export default createMeshFromWorld;