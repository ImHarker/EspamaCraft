import * as THREE from 'three';

var dirtTexture = new THREE.TextureLoader().load("../../img/dirt.png");
dirtTexture.magFilter = THREE.NearestFilter;

var grassSideTexture = new THREE.TextureLoader().load('../../img/grass_side.png');
grassSideTexture.magFilter = THREE.NearestFilter;
var grassTopTexture = new THREE.TextureLoader().load('../../img/grass_top.png');
grassTopTexture.magFilter = THREE.NearestFilter;

let debug = false;

export const BlockType = {
    Default: {
        id: 0,
        name: "default",
        material: new THREE.MeshStandardMaterial()
    },
    Grass: {
        id: 1,
        name: "grass",
        material: [
            new THREE.MeshStandardMaterial({ map: grassSideTexture, wireframe: debug }),
            new THREE.MeshStandardMaterial({ map: grassSideTexture, wireframe: debug }),
            new THREE.MeshStandardMaterial({ map: grassTopTexture, wireframe: debug }),
            new THREE.MeshStandardMaterial({ map: dirtTexture, wireframe: debug }),
            new THREE.MeshStandardMaterial({ map: grassSideTexture, wireframe: debug }),
            new THREE.MeshStandardMaterial({ map: grassSideTexture, wireframe: debug })
        ]
    },
    Dirt: {
        id: 2,
        name: "dirt",
        material: new THREE.MeshStandardMaterial({ map: dirtTexture, wireframe: debug })
    }
    /*,
    Stone: "stone",
    Bedrock: "bedrock"*/
}