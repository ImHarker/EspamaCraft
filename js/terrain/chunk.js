import { BlockType } from "./blockType.js";
import { Block } from "./block.js";
import { cena } from "../scene.js";
import { perlin } from "./perlin.js";
import * as THREE from 'three';

export class Chunk {
    chunkSize = 16;
    chunkHeight = 64;
    blockAmount = [];

    constructor(offsetX, offsetZ) {
        this.frequency = 0.03;
        this.amplitude = 16;

        this.offsetX = offsetX * this.chunkSize;
        this.offsetZ = offsetZ * this.chunkSize;

        this.blocks = [];
        for (let x = 0; x < this.chunkSize; x++) {
            this.blocks.push([]);
            for (let y = 0; y < this.chunkHeight; y++) {
                this.blocks[x].push([]);
                for (let z = 0; z < this.chunkSize; z++) {
                    this.blocks[x][y][z] = new Block();
                }
            }
        }
    }

    ActivateBlocks() {
        for (let x = 0; x < this.chunkSize; x++) {
            for (let y = 0; y < this.chunkHeight; y++) {
                for (let z = 0; z < this.chunkSize; z++) {
                    if (this.blocks[x][y][z].type == BlockType.Default) {
                        this.blocks[x][y][z].isActive = false;
                        continue;
                    }

                    let isBlockVisible = false;

                    //if (x == 0 || x == this.chunkSize - 1 || y == 0 || y == this.chunkHeight - 1 || z == 0 || z == this.chunkSize - 1) isBlockVisible = true;

                    if (x > 0) {
                        if (this.blocks[x - 1][y][z].type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (x < this.chunkSize - 1) {
                        if (this.blocks[x + 1][y][z].type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (y > 0) {
                        if (this.blocks[x][y - 1][z].type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (y < this.chunkHeight - 1) {
                        if (this.blocks[x][y + 1][z].type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (z > 0) {
                        if (this.blocks[x][y][z - 1].type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (z < this.chunkSize - 1) {
                        if (this.blocks[x][y][z + 1].type.transparent) {
                            isBlockVisible = true;
                        }
                    }

                    this.blocks[x][y][z].isActive = isBlockVisible;
                }
            }
        }
    }

    BuildTree(x, y, z) {
        // Trunk
        for (let i = 0; i < 6; i++) {
            this.blocks[x][y + i][z].type = BlockType.OakLog;
        }

        // Leaves
        this.blocks[x][y + 6][z].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 6][z].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 6][z].type = BlockType.OakLeaves;
        this.blocks[x][y + 6][z + 1].type = BlockType.OakLeaves;
        this.blocks[x][y + 6][z - 1].type = BlockType.OakLeaves;

        this.blocks[x + 1][y + 5][z].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 5][z].type = BlockType.OakLeaves;
        this.blocks[x][y + 5][z + 1].type = BlockType.OakLeaves;
        this.blocks[x][y + 5][z - 1].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 5][z + 1].type = BlockType.OakLeaves;

        this.blocks[x + 1][y + 4][z].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 4][z].type = BlockType.OakLeaves;
        this.blocks[x][y + 4][z + 1].type = BlockType.OakLeaves;
        this.blocks[x][y + 4][z - 1].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 4][z + 1].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 4][z - 1].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 4][z + 1].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 4][z - 1].type = BlockType.OakLeaves;
        this.blocks[x + 2][y + 4][z].type = BlockType.OakLeaves;
        this.blocks[x - 2][y + 4][z].type = BlockType.OakLeaves;
        this.blocks[x][y + 4][z + 2].type = BlockType.OakLeaves;
        this.blocks[x][y + 4][z - 2].type = BlockType.OakLeaves;
        this.blocks[x + 2][y + 4][z + 1].type = BlockType.OakLeaves;
        this.blocks[x + 2][y + 4][z - 1].type = BlockType.OakLeaves;
        this.blocks[x - 2][y + 4][z + 1].type = BlockType.OakLeaves;
        this.blocks[x - 2][y + 4][z - 1].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 4][z + 2].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 4][z - 2].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 4][z + 2].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 4][z - 2].type = BlockType.OakLeaves;

        this.blocks[x + 1][y + 3][z].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 3][z].type = BlockType.OakLeaves;
        this.blocks[x][y + 3][z + 1].type = BlockType.OakLeaves;
        this.blocks[x][y + 3][z - 1].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 3][z + 1].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 3][z - 1].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 3][z + 1].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 3][z - 1].type = BlockType.OakLeaves;
        this.blocks[x + 2][y + 3][z].type = BlockType.OakLeaves;
        this.blocks[x - 2][y + 3][z].type = BlockType.OakLeaves;
        this.blocks[x][y + 3][z + 2].type = BlockType.OakLeaves;
        this.blocks[x][y + 3][z - 2].type = BlockType.OakLeaves;
        this.blocks[x + 2][y + 3][z + 1].type = BlockType.OakLeaves;
        this.blocks[x + 2][y + 3][z - 1].type = BlockType.OakLeaves;
        this.blocks[x - 2][y + 3][z + 1].type = BlockType.OakLeaves;
        this.blocks[x - 2][y + 3][z - 1].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 3][z + 2].type = BlockType.OakLeaves;
        this.blocks[x + 1][y + 3][z - 2].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 3][z + 2].type = BlockType.OakLeaves;
        this.blocks[x - 1][y + 3][z - 2].type = BlockType.OakLeaves;
        this.blocks[x - 2][y + 3][z + 2].type = BlockType.OakLeaves;
    }

    CreateMesh() {
        for (let x = 0; x < this.chunkSize; x++) {
            for (let z = 0; z < this.chunkSize; z++) {
                let y = Math.floor(perlin.get((x + this.offsetX) * this.frequency, (z + this.offsetZ) * this.frequency) * this.amplitude) + 16;

                this.blocks[x][y][z].type = BlockType.Grass;

                let yBuilder = 0;
                while (yBuilder < y) {
                    this.blocks[x][yBuilder][z].type = BlockType.Dirt;
                    yBuilder++;
                }
            }
        }

        let R = 25;
        let bluenoise = [];
        for (let x = 0; x < this.chunkSize; x++) {
            bluenoise.push([]);
            for (let z = 0; z < this.chunkSize; z++) {
                let nx = x / this.chunkSize - 0.5;
                let nz = z / this.chunkSize - 0.5;

                bluenoise[x].push(perlin.get(50 * (nx + this.offsetX), 50 * (nz + this.offsetZ)));
            }
        }

        for (let x = 2; x < this.chunkSize - 2; x++) {
            for (let z = 2; z < this.chunkSize - 2; z++) {
                let max = 0;
                for (let dz = -R; dz <= R; dz++) {
                    for (let dx = -R; dx <= R; dx++) {
                        let nx = x + dx;
                        let nz = z + dz;

                        if (0 <= nx && nx < this.chunkSize && 0 <= nz && nz < this.chunkSize) {
                            let e = bluenoise[nx][nz];
                            if (e > max) max = e;
                        }
                    }
                }

                if (bluenoise[x][z] == max) {
                    for (let y = 0; y < this.chunkHeight; y++) {
                        if (this.blocks[x][y][z].type == BlockType.Grass) {
                            this.BuildTree(x, y, z);
                        }
                    }
                }
            }
        }

        this.ActivateBlocks();
    }
}