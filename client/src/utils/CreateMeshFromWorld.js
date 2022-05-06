import * as THREE from 'three';
import ColorPlate from './ColorPlate';

function createMeshFromWorld(world) {

    const {positions, normals, indices, plateColors } = world.generateGeometry();
    
    const colors = [];

    for (let i = 0; i < plateColors.length; i++) {

        const color = ColorPlate.colorsRGBGL[plateColors[i]];
        colors.push(...color);
    }

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshPhongMaterial({vertexColors: true});

    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const colorNumComponents = 3;

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), colorNumComponents));
    geometry.setIndex(indices);

    return new THREE.Mesh(geometry, material);
}

export default createMeshFromWorld;