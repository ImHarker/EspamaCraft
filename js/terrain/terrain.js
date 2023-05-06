import { Chunk } from "./chunk.js"
import { camaraPerspetiva } from '../scene.js';
import { BlockType } from "./blockType.js";
import { cena } from "../scene.js";
import * as THREE from 'three';

export class Terrain {
    constructor() {
        this.chunks = {};
        this.cachedChunks = {};
        this.chunkDistance = 4;
        this.blockAmount = [];
        this.mesh = [];

        this.Update();
    }

    GenerateMesh() {
        for (let i = 0; i < this.mesh.length; i++) {
            cena.remove(this.mesh[i]);
        }

        this.blockAmount = [];
        this.mesh = [];
        let counter = [];

        let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

        Object.keys(BlockType).forEach(_ => {
            this.blockAmount.push(0);
            counter.push(0);
        });

        for (let i in this.chunks) {
            for (let j in this.chunks[i]) {
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

        Object.keys(BlockType).forEach(key => {
            this.mesh.push(new THREE.InstancedMesh(cubeGeometry, BlockType[key].material, this.blockAmount[BlockType[key].id]));
        });

        for (let i = 0; i < this.mesh.length; i++) {
            this.mesh[i].instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            cena.add(this.mesh[i]);
        }

        let dummy = new THREE.Object3D();

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

                            this.mesh[block.type.id].setMatrixAt(counter[block.type.id]++, dummy.matrix);
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

    Update() {
        for (let x in this.chunks) {
            this.chunks[x] = {};
        }
        this.chunks = {};

        for (let x = Math.floor(camaraPerspetiva.position.x / 16) - this.chunkDistance; x < Math.floor(camaraPerspetiva.position.x / 16) + this.chunkDistance; x++) {
            if (this.chunks[x] == undefined) this.chunks[x] = {};

            for (let z = Math.floor(camaraPerspetiva.position.z / 16) - this.chunkDistance; z < Math.floor(camaraPerspetiva.position.z / 16) + this.chunkDistance; z++) {
                if (this.chunks[x][z] != undefined) continue;
                if (this.cachedChunks[x] != undefined && this.cachedChunks[x][z] != undefined) {
                    this.chunks[x][z] = this.cachedChunks[x][z];
                    continue;
                }

                this.chunks[x][z] = new Chunk(x, z);
                this.chunks[x][z].CreateMesh();
            }
        }

        for (let i in this.chunks) {
            if (this.cachedChunks[i] == undefined) this.cachedChunks[i] = {};
            for (let j in this.chunks[i]) {
                if (this.cachedChunks[i][j] != undefined) continue;
                this.cachedChunks[i][j] = this.chunks[i][j];
            }
        }

        this.GenerateMesh();
    }
}