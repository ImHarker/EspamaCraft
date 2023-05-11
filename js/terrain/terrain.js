import { Chunk } from "./chunk.js"
import { camaraPerspetiva } from '../scene.js';
import { BlockType } from "./blockType.js";
import { cena } from "../scene.js";
import * as THREE from 'three';
import { GetCookie } from "../cookies.js";

let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let dummy = new THREE.Object3D();

export class Terrain {
    constructor() {
        this.cachedChunks = {};
        this.chunkDistance = parseInt(GetCookie("renderDistance"));
        this.blockAmount = [];
        this.mesh = [];
        this.counter = [];

        this.Update();
    }

    GetBlock(x, y, z) {
        let chunkX = Math.floor(x / 16);
        let chunkZ = Math.floor(z / 16);

        if (this.cachedChunks[chunkX] == undefined || this.cachedChunks[chunkX][chunkZ] == undefined) {
            return undefined;
        }

        let chunk = this.cachedChunks[chunkX][chunkZ];

        if (chunk.blocks[x - chunk.offsetX] == undefined || chunk.blocks[x - chunk.offsetX][y] == undefined || chunk.blocks[x - chunk.offsetX][y][z - chunk.offsetZ] == undefined) {
            return undefined;
        }

        return chunk.blocks[x - chunk.offsetX][y][z - chunk.offsetZ];
    }

    GenerateMesh() {
        for (let i = 0; i < this.mesh.length; i++) {
            cena.remove(this.mesh[i]);
        }

        this.mesh = [];

        Object.keys(BlockType).forEach(key => {
            this.mesh.push(new THREE.InstancedMesh(cubeGeometry, BlockType[key].material, this.blockAmount[BlockType[key].id]));
            this.mesh[BlockType[key].id].instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            cena.add(this.mesh[BlockType[key].id]);
        });

        for (let i = Math.floor(camaraPerspetiva.position.x / 16) - this.chunkDistance; i <= Math.floor(camaraPerspetiva.position.x / 16) + this.chunkDistance; i++) {
            for (let j = Math.floor(camaraPerspetiva.position.z / 16) - this.chunkDistance; j <= Math.floor(camaraPerspetiva.position.z / 16) + this.chunkDistance; j++) {
                let chunk = this.cachedChunks[i][j];

                for (let x = 0; x < chunk.chunkSize; x++) {
                    for (let y = 0; y < chunk.chunkHeight; y++) {
                        for (let z = 0; z < chunk.chunkSize; z++) {
                            let block = chunk.blocks[x][y][z];
                            if (!block.isActive) continue;
                            dummy.position.set(x + chunk.offsetX, y, z + chunk.offsetZ);
                            dummy.updateMatrix();

                            this.mesh[block.type.id].setMatrixAt(this.counter[block.type.id]++, dummy.matrix);
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.mesh.length; i++) {
            this.mesh[i].instanceMatrix.needsUpdate = true;
            this.mesh[i].computeBoundingSphere();
        }
    }

    GenerateChunks() {
        this.counter = [];
        this.blockAmount = [];

        Object.keys(BlockType).forEach(_ => {
            this.blockAmount.push(0);
            this.counter.push(0);
        });

        for (let i = Math.floor(camaraPerspetiva.position.x / 16) - this.chunkDistance; i <= Math.floor(camaraPerspetiva.position.x / 16) + this.chunkDistance; i++) {
            for (let j = Math.floor(camaraPerspetiva.position.z / 16) - this.chunkDistance; j <= Math.floor(camaraPerspetiva.position.z / 16) + this.chunkDistance; j++) {
                if (this.cachedChunks[i] == undefined) {
                    this.cachedChunks[i] = {};
                }

                if(this.cachedChunks[i][j] == undefined) {
                    let tempChunk = new Chunk(i, j, this);
                    tempChunk.CreateMesh();
                    this.cachedChunks[i][j] = tempChunk;
                }
            }
        }

        for(let i = Math.floor(camaraPerspetiva.position.x / 16) - this.chunkDistance; i <= Math.floor(camaraPerspetiva.position.x / 16) + this.chunkDistance; i++) {
            for(let j = Math.floor(camaraPerspetiva.position.z / 16) - this.chunkDistance; j <= Math.floor(camaraPerspetiva.position.z / 16) + this.chunkDistance; j++) {
                let chunk = this.cachedChunks[i][j];

                chunk.ActivateBlocks();

                for (let x = 0; x < chunk.chunkSize; x++) {
                    for (let y = 0; y < chunk.chunkHeight; y++) {
                        for (let z = 0; z < chunk.chunkSize; z++) {
                            let block = chunk.blocks[x][y][z];
                            if (!block.isActive) continue;
                            this.blockAmount[block.type.id]++;
                        }
                    }
                }
            }
        }
    }

    Update() {
        this.GenerateChunks();
        this.GenerateMesh();
    }
}