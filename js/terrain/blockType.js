import * as THREE from 'three';

var dirtTexture = new THREE.TextureLoader().load("../../img/dirt.png");
dirtTexture.magFilter = THREE.NearestFilter;

var grassSideTexture = new THREE.TextureLoader().load('../../img/grass_side.png');
grassSideTexture.magFilter = THREE.NearestFilter;
var grassTopTexture = new THREE.TextureLoader().load('../../img/grass_top.png');
grassTopTexture.magFilter = THREE.NearestFilter;
var oakLogTexture = new THREE.TextureLoader().load('../../img/oak_log.png');
oakLogTexture.magFilter = THREE.NearestFilter;
var oakLogTopTexture = new THREE.TextureLoader().load('../../img/oak_log_top.png');
oakLogTopTexture.magFilter = THREE.NearestFilter;
var oakLeavesTexture = new THREE.TextureLoader().load('../../img/oak_leaves.png');
oakLeavesTexture.magFilter = THREE.NearestFilter;
var sandTexture = new THREE.TextureLoader().load('../../img/sand.png');
sandTexture.magFilter = THREE.NearestFilter;

var cactusTopTexture = new THREE.TextureLoader().load('../../img/cactus_top.png');
cactusTopTexture.magFilter = THREE.NearestFilter;
var cactusSideTexture = new THREE.TextureLoader().load('../../img/cactus_side.png');
cactusSideTexture.magFilter = THREE.NearestFilter;
var cactusBottomTexture = new THREE.TextureLoader().load('../../img/cactus_bottom.png');
cactusBottomTexture.magFilter = THREE.NearestFilter;

var glowstoneTexture = new THREE.TextureLoader().load('../../img/glowstone.png');
glowstoneTexture.magFilter = THREE.NearestFilter;

let debug = false;

export const BlockType = {
    Default: {
        id: 0,
        name: "default",
        material: new THREE.MeshStandardMaterial(),
        transparent: true
    },
    Grass: {
        id: 1,
        name: "grass",
        material: [
            new THREE.MeshStandardMaterial({
                map: grassSideTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: grassSideTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: grassTopTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: dirtTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: grassSideTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: grassSideTexture,
                wireframe: debug
            })
        ],
        transparent: false
    },
    Dirt: {
        id: 2,
        name: "dirt",
        material: new THREE.MeshStandardMaterial({
            map: dirtTexture,
            wireframe: debug
        }),
        transparent: false
    },
    OakLog: {
        id: 3,
        name: "oak_log",
        material: [
            new THREE.MeshStandardMaterial({
                map: oakLogTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: oakLogTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: oakLogTopTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: oakLogTopTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: oakLogTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: oakLogTexture,
                wireframe: debug
            })
        ],
        transparent: false
    },
    OakLeaves: {
        id: 4,
        name: "oak_leaves",
        material: new THREE.MeshStandardMaterial({
            map: oakLeavesTexture,
            wireframe: debug,
            transparent: true
        }),
        transparent: true
    },
    Sand: {
        id: 5,
        name: "sand",
        material: new THREE.MeshStandardMaterial({
            map: sandTexture,
            wireframe: debug
        }),
        transparent: false
    },
    Cactus: {
        id: 6,
        name: "cactus",
        material: [
            new THREE.MeshStandardMaterial({
                map: cactusSideTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: cactusSideTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: cactusTopTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: cactusBottomTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: cactusSideTexture,
                wireframe: debug
            }),
            new THREE.MeshStandardMaterial({
                map: cactusSideTexture,
                wireframe: debug
            })
        ],
        transparent: false
    },
    Glowstone: {
        id: 7,
        name: "glowstone",
        material: new THREE.MeshStandardMaterial({
            map: glowstoneTexture,
            wireframe: debug
        }),
        transparent: false
    },
    /*,
    Stone: "stone",
    Bedrock: "bedrock"*/
}