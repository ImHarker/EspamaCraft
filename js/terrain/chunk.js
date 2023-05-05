import { BlockType } from "./blockType.js";
import { Block } from "./block.js";
import { cena } from "../scene.js";
import { perlin } from "./perlin.js";
import * as THREE from 'three';

export class Chunk {
    chunkSize = 16;
    chunkHeight = 32;
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
                        if (this.blocks[x - 1][y][z].type == BlockType.Default) {
                            isBlockVisible = true;
                        }
                    }
                    if (x < this.chunkSize - 1) {
                        if (this.blocks[x + 1][y][z].type == BlockType.Default) {
                            isBlockVisible = true;
                        }
                    }
                    if (y > 0) {
                        if (this.blocks[x][y - 1][z].type == BlockType.Default) {
                            isBlockVisible = true;
                        }
                    }
                    if (y < this.chunkHeight - 1) {
                        if (this.blocks[x][y + 1][z].type == BlockType.Default) {
                            isBlockVisible = true;
                        }
                    }
                    if (z > 0) {
                        if (this.blocks[x][y][z - 1].type == BlockType.Default) {
                            isBlockVisible = true;
                        }
                    }
                    if (z < this.chunkSize - 1) {
                        if (this.blocks[x][y][z + 1].type == BlockType.Default) {
                            isBlockVisible = true;
                        }
                    }

                    this.blocks[x][y][z].isActive = isBlockVisible;
                }
            }
        }
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

        this.ActivateBlocks();
    }
}