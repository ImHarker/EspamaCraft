import { BlockType } from "./blockType.js";
import { Block } from "./block.js";

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

    GetBlock(x, y, z) {
        if(x < 0) {
            // Get terrain chunk x - 1
            return new Block();
        } else if(x >= this.chunkSize) {
            // Get terrain chunk x + 1
            return new Block();
        }
        if(z < 0) {
            // Get terrain chunk z - 1
            return new Block();
        } else if(z >= this.chunkSize) {
            // Get terrain chunk z + 1
            return new Block();
        }

        return this.blocks[x][y][z];
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

                    if (this.GetBlock(x - 1, y, z).type.transparent) {
                        isBlockVisible = true;
                    }
                    if (this.GetBlock(x + 1, y, z).type.transparent) {
                        isBlockVisible = true;
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
                    if (this.GetBlock(x, y, z - 1).type.transparent) {
                        isBlockVisible = true;
                    }
                    if (this.GetBlock(x, y, z + 1).type.transparent) {
                        isBlockVisible = true;
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

    BuildCactus(x, y, z) {
        for(let i = 1; i < Math.floor(Math.random() * 3) + 2; i++) {
            this.blocks[x][y + i][z].type = BlockType.Cactus;
        }
    }

    Lerp(a, b, t) {
        if(t > 1) t = 1;
        return (1 - t) * a + t * b;
    }

    CreateMesh() {
        let R = 25;
        let bluenoise = [];

        for (let x = 0; x < this.chunkSize; x++) {
            bluenoise.push([]);
            for (let z = 0; z < this.chunkSize; z++) {
                let nx = x / this.chunkSize - 0.5;
                let nz = z / this.chunkSize - 0.5;
                bluenoise[x].push((noise.simplex2(50 * (nx + this.offsetX), 50 * (nz + this.offsetZ)) + 1) / 2);
                
                let biome = (noise.simplex2((x + this.offsetX) * this.frequency * 0.5, (z + this.offsetZ) * this.frequency * 0.5) + 1) / 2;
                
                let y = 0;

                let grassHeight = Math.floor((noise.simplex2((x + this.offsetX) * this.frequency, (z + this.offsetZ) * this.frequency) * this.amplitude / 1.75) + 1) / 2 + this.amplitude / 1.75;
                let sandHeight = Math.floor((noise.simplex2((x + this.offsetX) * this.frequency, (z + this.offsetZ) * this.frequency) * this.amplitude / 5) + 1) / 2 + this.amplitude / 5;

                if (biome > 0.5) {
                    let blendFactor = (biome - 0.5) * 2;
                    blendFactor = Math.sqrt(blendFactor);
                    
                    y = Math.floor(this.Lerp(sandHeight, grassHeight, blendFactor));
                    
                    this.blocks[x][y][z].type = BlockType.Grass;
                }
                else {
                    y = Math.floor(sandHeight);
                    this.blocks[x][y][z].type = BlockType.Sand;
                }

                let yBuilder = 0;
                while (yBuilder < y) {
                    this.blocks[x][yBuilder][z].type = BlockType.Dirt;
                    yBuilder++;
                }
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
                        } else if (this.blocks[x][y][z].type == BlockType.Sand) {
                            this.BuildCactus(x, y, z);
                        }
                    }
                }
            }
        }

        this.ActivateBlocks();
    }
}