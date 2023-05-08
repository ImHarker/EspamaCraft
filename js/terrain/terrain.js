import { Chunk } from "./chunk.js"
import { camaraPerspetiva } from '../scene.js';
import { BlockType } from "./blockType.js";
import { cena } from "../scene.js";
import * as THREE from 'three';

let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let dummy = new THREE.Object3D();

export class Terrain {
    constructor() {
        this.chunks = {};
        this.cachedChunks = {};
        this.chunkDistance = 4;
        this.blockAmount = [];
        this.mesh = [];
        this.counter = [];

        this.Update();
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

        for (let i in this.chunks) {
            for (let j in this.chunks[i]) {
                let chunk = this.chunks[i][j];

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
        for (let x in this.chunks) {
            this.chunks[x] = {};
        }
        this.chunks = {};

        this.counter = [];
        this.blockAmount = [];

        Object.keys(BlockType).forEach(_ => {
            this.blockAmount.push(0);
            this.counter.push(0);
        });

        for (let i = Math.floor(camaraPerspetiva.position.x / 16) - this.chunkDistance; i < Math.floor(camaraPerspetiva.position.x / 16) + this.chunkDistance; i++) {
            if (this.chunks[i] == undefined) this.chunks[i] = {};

            for (let j = Math.floor(camaraPerspetiva.position.z / 16) - this.chunkDistance; j < Math.floor(camaraPerspetiva.position.z / 16) + this.chunkDistance; j++) {
                if (this.chunks[i][j] != undefined) continue;
                if (this.cachedChunks[i] != undefined && this.cachedChunks[i][j] != undefined) {
                    this.chunks[i][j] = this.cachedChunks[i][j];
                }
                else {
                    this.chunks[i][j] = new Chunk(i, j);
                    this.chunks[i][j].CreateMesh();
                    if(this.cachedChunks[i] == undefined) this.cachedChunks[i] = {};
                    this.cachedChunks[i][j] = this.chunks[i][j];
                }

                let chunk = this.chunks[i][j];

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