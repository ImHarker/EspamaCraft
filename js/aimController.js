import * as THREE from "three";
import {
    camaraPerspetiva,
    cena
} from "./scene.js";
import {
    terrain
} from "./app.js";
import {
    BlockType
} from "./terrain/blockType.js";

export class AimController {
    static hitbox = new THREE.Mesh(new THREE.BoxGeometry(1.001, 1.001, 1.001), new THREE.MeshBasicMaterial({
        color: 0xEEEEEE,
        transparent: true,
        opacity: 0.3
    }));
    static raycaster = new THREE.Raycaster();
    static pointer = new THREE.Vector2();

    constructor() {
        this.addBlock = false;
        this.removeBlock = false;
        this.getBlock = false;

        this.placeBlockType = BlockType.Dirt;

        document.addEventListener('mousedown', (event) => {
            if (event.button == 0) this.removeBlock = true;
            if (event.button == 1) this.getBlock = true;
            if (event.button == 2) this.addBlock = true;
        });
    }

    Update() {
        AimController.raycaster.setFromCamera(AimController.pointer, camaraPerspetiva);
        let intersects = AimController.raycaster.intersectObjects(cena.children);

        const parent = AimController.hitbox.parent;
        if (parent != undefined) {
            parent.remove(AimController.hitbox);
        }

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance > 6.8) continue;
            if (intersects[i].object == undefined) continue;
            if (intersects[i].object == AimController.hitbox) continue;

            let point = intersects[i].point.clone();
            let faceNormal = intersects[i].face.normal.clone();
            faceNormal.multiplyScalar(0.5);
            point.sub(faceNormal);

            let block = terrain.GetBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z));
            if (!block.isActive) continue;

            intersects[i].object.add(AimController.hitbox);
            AimController.hitbox.position.set(Math.round(point.x), Math.round(point.y), Math.round(point.z));

            break;
        }

        if (this.addBlock) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].distance > 7) continue;
                if (intersects[i].object == undefined) continue;
                if (intersects[i].object == AimController.hitbox) continue;

                let point = intersects[i].point.clone();
                let faceNormal = intersects[i].face.normal.clone();
                faceNormal.multiplyScalar(0.5);
                point.sub(faceNormal);

                let block = terrain.GetBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z));
                if (!block.isActive) continue;
                let newPos = point.clone().add(intersects[i].normal);
                let newBlock = terrain.GetBlock(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z));
                if (newBlock == undefined) continue;
                if (newBlock.type != BlockType.Default) continue;
                newBlock.type = this.placeBlockType;

                let chunkX = Math.floor(Math.round(point.x) / 16);
                let chunkZ = Math.floor(Math.round(point.z) / 16);

                let relativeBlockX = Math.floor(Math.round(point.x) % 16);
                if (relativeBlockX < 0) {
                    relativeBlockX += 16;
                }
                let relativeBlockZ = Math.floor(Math.round(point.z) % 16);
                if (relativeBlockZ < 0) {
                    relativeBlockZ += 16;
                }

                terrain.cachedChunks[chunkX][chunkZ].ActivateBlocks();

                if (relativeBlockX == 0) {
                    terrain.cachedChunks[chunkX - 1][chunkZ].ActivateBlocks();
                } else if (relativeBlockX == 15) {
                    terrain.cachedChunks[chunkX + 1][chunkZ].ActivateBlocks();
                }

                if (relativeBlockZ == 0) {
                    terrain.cachedChunks[chunkX][chunkZ - 1].ActivateBlocks();
                } else if (relativeBlockZ == 15) {
                    terrain.cachedChunks[chunkX][chunkZ + 1].ActivateBlocks();
                }

                terrain.GenerateChunks();
                terrain.GenerateMesh();
                break;
            }
            this.addBlock = false;
        }

        if (this.getBlock) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].distance > 7) continue;
                if (intersects[i].object == undefined) continue;
                if (intersects[i].object == AimController.hitbox) continue;

                let point = intersects[i].point.clone();
                let faceNormal = intersects[i].face.normal.clone();
                faceNormal.multiplyScalar(0.5);
                point.sub(faceNormal);

                let block = terrain.GetBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z));
                if (!block.isActive) continue;
                this.placeBlockType = block.type;
                break;
            }
            this.getBlock = false;
        }

        if (this.removeBlock) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].distance > 7) continue;
                if (intersects[i].object == undefined) continue;
                if (intersects[i].object == AimController.hitbox) continue;

                let point = intersects[i].point.clone();
                let faceNormal = intersects[i].face.normal.clone();
                faceNormal.multiplyScalar(0.5);
                point.sub(faceNormal);

                let block = terrain.GetBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z));
                if (!block.isActive) continue;
                block.type = BlockType.Default;

                let chunkX = Math.floor(Math.round(point.x) / 16);
                let chunkZ = Math.floor(Math.round(point.z) / 16);

                let relativeBlockX = Math.floor(Math.round(point.x) % 16);
                if (relativeBlockX < 0) {
                    relativeBlockX += 16;
                }
                let relativeBlockZ = Math.floor(Math.round(point.z) % 16);
                if (relativeBlockZ < 0) {
                    relativeBlockZ += 16;
                }

                terrain.cachedChunks[chunkX][chunkZ].ActivateBlocks();

                if (relativeBlockX == 0) {
                    terrain.cachedChunks[chunkX - 1][chunkZ].ActivateBlocks();
                } else if (relativeBlockX == 15) {
                    terrain.cachedChunks[chunkX + 1][chunkZ].ActivateBlocks();
                }

                if (relativeBlockZ == 0) {
                    terrain.cachedChunks[chunkX][chunkZ - 1].ActivateBlocks();
                } else if (relativeBlockZ == 15) {
                    terrain.cachedChunks[chunkX][chunkZ + 1].ActivateBlocks();
                }

                terrain.GenerateChunks();
                terrain.GenerateMesh();
                break;
            }
            this.removeBlock = false;
        }
    }
}