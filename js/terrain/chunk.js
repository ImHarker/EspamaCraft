import {
    BlockType
} from "./blockType.js";
import {
    Block
} from "./block.js";

export class Chunk {
    static chunkSize = 16;
    static chunkHeight = 64;
    static frequency = 0.015;
    static amplitude = 16;

    constructor(offsetX, offsetZ, terrain) {
        this.terrain = terrain;
        this.blocks = [];
        this.blockAmount = [];

        Object.keys(BlockType).forEach(_ => {
            this.blockAmount.push(0);
        });

        this.offsetX = offsetX * Chunk.chunkSize;
        this.offsetZ = offsetZ * Chunk.chunkSize;

        for (let x = 0; x < Chunk.chunkSize; x++) {
            this.blocks.push([]);
            for (let y = 0; y < Chunk.chunkHeight; y++) {
                this.blocks[x].push([]);
                for (let z = 0; z < Chunk.chunkSize; z++) {
                    this.blocks[x][y][z] = new Block();
                }
            }
        }
    }

    GetBlock(x, y, z) {
        if (x < 0 || x >= Chunk.chunkSize || y < 0 || y >= Chunk.chunkHeight || z < 0 || z >= Chunk.chunkSize) {
            return this.terrain.GetBlock(x + this.offsetX, y, z + this.offsetZ);
        }

        return this.blocks[x][y][z];
    }

    ActivateBlocks() {
        this.blockAmount = [];

        Object.keys(BlockType).forEach(_ => {
            this.blockAmount.push(0);
        });

        for (let x = 0; x < Chunk.chunkSize; x++) {
            for (let y = 0; y < Chunk.chunkHeight; y++) {
                for (let z = 0; z < Chunk.chunkSize; z++) {
                    if (this.blocks[x][y][z].type == BlockType.Default) {
                        this.blocks[x][y][z].isActive = false;
                        continue;
                    }

                    let isBlockVisible = false;

                    if (this.GetBlock(x - 1, y, z) != undefined) {
                        if (this.GetBlock(x - 1, y, z).type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (this.GetBlock(x + 1, y, z) != undefined) {
                        if (this.GetBlock(x + 1, y, z).type.transparent) {
                            isBlockVisible = true;
                        }
                    }

                    if (y > 0) {
                        if (this.blocks[x][y - 1][z].type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (y < Chunk.chunkHeight - 1) {
                        if (this.blocks[x][y + 1][z].type.transparent) {
                            isBlockVisible = true;
                        }
                    }

                    if (this.GetBlock(x, y, z - 1) != undefined) {
                        if (this.GetBlock(x, y, z - 1).type.transparent) {
                            isBlockVisible = true;
                        }
                    }
                    if (this.GetBlock(x, y, z + 1) != undefined) {
                        if (this.GetBlock(x, y, z + 1).type.transparent) {
                            isBlockVisible = true;
                        }
                    }

                    this.blocks[x][y][z].isActive = isBlockVisible;
                    if (this.blocks[x][y][z].isActive) this.blockAmount[this.blocks[x][y][z].type.id]++;
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
        for (let i = 1; i < Math.floor(Math.random() * 3) + 2; i++) {
            this.blocks[x][y + i][z].type = BlockType.Cactus;
        }
    }

    Lerp(a, b, t) {
        if (t > 1) t = 1;
        return (1 - t) * a + t * b;
    }

    CreateMesh() {
        let R = 25;
        let bluenoise = [];

        for (let x = 0; x < Chunk.chunkSize; x++) {
            bluenoise.push([]);
            for (let z = 0; z < Chunk.chunkSize; z++) {
                let nx = x / Chunk.chunkSize - 0.5;
                let nz = z / Chunk.chunkSize - 0.5;
                bluenoise[x].push((noise.simplex2(50 * (nx + this.offsetX), 50 * (nz + this.offsetZ)) + 1) / 2);

                let biome = (noise.simplex2((x + this.offsetX) * Chunk.frequency, (z + this.offsetZ) * Chunk.frequency) + 1) / 2;

                let y = 0;

                let yNoise = noise.simplex2((x + this.offsetX) * Chunk.frequency, (z + this.offsetZ) * Chunk.frequency);
                let grassHeight = Math.floor((yNoise * Chunk.amplitude / 1.75) + 1) / 2 + Chunk.amplitude / 1.75;
                let sandHeight = Math.floor((yNoise * Chunk.amplitude / 5) + 1) / 2 + Chunk.amplitude / 5;

                if (biome > 0.5) {
                    let blendFactor = (biome - 0.5) * 2;
                    blendFactor = Math.sqrt(blendFactor);

                    y = Math.floor(this.Lerp(sandHeight, grassHeight, blendFactor));

                    this.blocks[x][y][z].type = BlockType.Grass;
                } else {
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

        for (let x = 2; x < Chunk.chunkSize - 2; x++) {
            for (let z = 2; z < Chunk.chunkSize - 2; z++) {
                let max = 0;

                for (let dz = -R; dz <= R; dz++) {
                    for (let dx = -R; dx <= R; dx++) {
                        let nx = x + dx;
                        let nz = z + dz;

                        if (0 <= nx && nx < Chunk.chunkSize && 0 <= nz && nz < Chunk.chunkSize) {
                            let e = bluenoise[nx][nz];
                            if (e > max) max = e;
                        }
                    }
                }

                if (bluenoise[x][z] == max) {
                    for (let y = 0; y < Chunk.chunkHeight; y++) {
                        if (this.blocks[x][y][z].type == BlockType.Grass) {
                            this.BuildTree(x, y, z);
                        } else if (this.blocks[x][y][z].type == BlockType.Sand) {
                            this.BuildCactus(x, y, z);
                        }
                    }
                }
            }
        }
    }
}