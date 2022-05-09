class VoxelWorld {

    constructor(cellSize) {

        this.cellSize = cellSize;
        this.cell = new Uint8Array(cellSize * cellSize * cellSize); 
    }

    generateGeometry() {

        const {cellSize} = this;

        const positions   = [];
        const normals     = [];
        const indices     = [];
        const plateColors = [];

        for (let z = 0; z < cellSize; z++) {
            for (let y = 0; y < cellSize; y++) {
                for (let x = 0; x < cellSize; x++) {

                    const voxel = this.getVoxel(x, y, z);
                    if (voxel) {
                        for (const {dir, corners} of this.faces) {

                            const neighbor = this.getVoxel(x + dir[0], y + dir[1], z + dir[2]);
                            if (!neighbor) {
                                
                                const indi = plateColors.length;

                                for (const pos of corners) {

                                    positions.push(x + pos[0], y + pos[1], z + pos[2]);
                                    normals.push(...dir);
                                    plateColors.push(voxel - 1);
                                }
                                
                                indices.push(
                                    indi    , indi + 1, indi + 2, 
                                    indi + 2, indi + 3, indi
                                );
                            }
                        }
                    }
                }
            }
        }

        return { positions, normals, indices, plateColors };
    }

    getOffset(x, y, z) {

        const {cellSize} = this;

        return z * cellSize * cellSize +
               y * cellSize +
               x
    }

    isInCell(x, y, z) {

        const {cellSize} = this;

        return (x >= 0) && (y >= 0) && (z >= 0) && (x < cellSize) && (y < cellSize) && (z < cellSize);
    }

    getVoxel(x, y, z) {

        const {cell} = this;

        return this.isInCell(x, y, z) ? cell[this.getOffset(x, y, z)] : 0;
    }

    setVoxel(x, y, z, value) {

        if (!this.isInCell(x, y, z)) {

            return false;
        }

        this.cell[this.getOffset(x, y, z)] = value;

        return true;
    }

    getCellSize() {

        return this.cellSize;
    }

    intersectRay(start, end) {
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let dz = end.z - start.z;
        const lenSq = dx * dx + dy * dy + dz * dz;
        const len = Math.sqrt(lenSq);
    
        dx /= len;
        dy /= len;
        dz /= len;
    
        let t = 0.0;
        let ix = Math.floor(start.x);
        let iy = Math.floor(start.y);
        let iz = Math.floor(start.z);
    
        const stepX = (dx > 0) ? 1 : -1;
        const stepY = (dy > 0) ? 1 : -1;
        const stepZ = (dz > 0) ? 1 : -1;
    
        const txDelta = Math.abs(1 / dx);
        const tyDelta = Math.abs(1 / dy);
        const tzDelta = Math.abs(1 / dz);
    
        const xDist = (stepX > 0) ? (ix + 1 - start.x) : (start.x - ix);
        const yDist = (stepY > 0) ? (iy + 1 - start.y) : (start.y - iy);
        const zDist = (stepZ > 0) ? (iz + 1 - start.z) : (start.z - iz);
    
        // location of nearest voxel boundary, in units of t
        let txMax = (txDelta < Infinity) ? txDelta * xDist : Infinity;
        let tyMax = (tyDelta < Infinity) ? tyDelta * yDist : Infinity;
        let tzMax = (tzDelta < Infinity) ? tzDelta * zDist : Infinity;
    
        let steppedIndex = -1;
    
        // main loop along raycast vector
        while (t <= len) {
            const voxel = this.getVoxel(ix, iy, iz);
            if (voxel) {
                return {
                    position: [
                        start.x + t * dx,
                        start.y + t * dy,
                        start.z + t * dz,
                    ],
                    normal: [
                        steppedIndex === 0 ? -stepX : 0,
                        steppedIndex === 1 ? -stepY : 0,
                        steppedIndex === 2 ? -stepZ : 0,
                    ],
                    voxel,
                };
            }
    
            // advance t to next nearest voxel boundary
            if (txMax < tyMax) {
                if (txMax < tzMax) {
                    ix += stepX;
                    t = txMax;
                    txMax += txDelta;
                    steppedIndex = 0;
                } else {
                    iz += stepZ;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            } else {
                if (tyMax < tzMax) {
                    iy += stepY;
                    t = tyMax;
                    tyMax += tyDelta;
                    steppedIndex = 1;
                } else {
                    iz += stepZ;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            }
        }
        return null;
    }

    faces = [
        { // left
            dir: [ -1,  0,  0, ],
            corners: [
                [ 0, 1, 0 ],
                [ 0, 0, 0 ],
                [ 0, 0, 1 ],
                [ 0, 1, 1 ],
            ],
        },
        { // right
            dir: [  1,  0,  0, ],
            corners: [
                [ 1, 1, 1 ],
                [ 1, 0, 1 ],
                [ 1, 0, 0 ],
                [ 1, 1, 0 ],
            ],
        },
        { // bottom
            dir: [  0, -1,  0, ],
            corners: [
                [ 1, 0, 1 ],
                [ 0, 0, 1 ],
                [ 0, 0, 0 ],
                [ 1, 0, 0 ],
            ],
        },
        { // top
            dir: [  0,  1,  0, ],
            corners: [
                [ 0, 1, 1 ],
                [ 1, 1, 1 ],
                [ 1, 1, 0 ],
                [ 0, 1, 0 ],
            ],
        },
        { // back
            dir: [  0,  0, -1, ],
            corners: [
                [ 1, 0, 0 ],
                [ 0, 0, 0 ],
                [ 0, 1, 0 ],
                [ 1, 1, 0 ],
            ],
        },
        { // front
            dir: [  0,  0,  1, ],
            corners: [
                [ 0, 0, 1 ],
                [ 1, 0, 1 ],
                [ 1, 1, 1 ],
                [ 0, 1, 1 ],
            ],
        },
    ];
}

export default VoxelWorld;