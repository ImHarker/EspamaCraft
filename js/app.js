import * as THREE from 'three';
import {
    skyboxVertCode
} from './shaders/skyboxVert.js';
import {
    skyboxFragCode
} from './shaders/skyboxFrag.js';
import {
    wireframeVertCode
} from './shaders/wireframeVert.js';
import {
    wireframeFragCode
} from './shaders/wireframeFrag.js';
import {
    cena,
    renderer,
    camaraPerspetiva,
    updateStats
} from './scene.js';
import {
    movement
} from './input.js'
import {
    Terrain
} from './terrain/terrain.js';
import {
    Time
} from './time.js';
import {
    updateMinimap
} from './minimap.js';
import {
    BlockType
} from './terrain/blockType.js';

let enableSun = true;
let sunDir = new THREE.Vector3(0.5, 0.5, 0);

document.addEventListener('DOMContentLoaded', Start);

let focoLuz = new THREE.AmbientLight('#666666', 1);
focoLuz.name = "focoLuz";
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.name = "dirLight";
dirLight.position.set(sunDir.x, sunDir.y, sunDir.z);
let pointLight = new THREE.PointLight(0xffffff, 1, 16);
pointLight.name = "pointLight";

function Start() {
    cena.add(focoLuz);
    cena.add(dirLight);

    cena.fog = new THREE.Fog(0xcccccc, 35, 70);

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}

export function ToggleSun() {
    enableSun = !enableSun;

    if (enableSun) {
        cena.add(dirLight);
    } else {
        cena.remove(dirLight);
    }
}

export function ToggleAmbient() {
    let focoLuzObject = cena.getObjectByName("focoLuz");
    if (focoLuzObject != undefined) {
        cena.remove(focoLuz);
    } else {
        cena.add(focoLuz);
    }
}

export function TogglePointLights() {
    let pointLightObject = cena.getObjectByName("pointLight");
    if (pointLightObject != undefined) {
        cena.remove(pointLight);
    } else {
        cena.add(pointLight);
    }
}

var skyboxGeo = new THREE.BoxGeometry(400, 400, 400);

var skyboxShader = new THREE.ShaderMaterial({
    uniforms: {
        topColor: {
            value: new THREE.Color(0x0077ff)
        },
        bottomColor: {
            value: new THREE.Color(0xffffff)
        },
        offset: {
            value: 33
        },
        exponent: {
            value: 0.6
        },

        sunDir: {
            value: sunDir
        },
        sunIntensity: {
            value: 0.01
        },
        sunColor: {
            value: new THREE.Color(0xffff00)
        },

        enableSun: {
            value: enableSun
        }
    },
    vertexShader: skyboxVertCode,
    fragmentShader: skyboxFragCode,
    side: THREE.BackSide
});

var skybox = new THREE.Mesh(skyboxGeo, skyboxShader);

cena.add(skybox);

let lastPosX = 0;
let lastPosZ = 0;

const terrain = new Terrain();

let hitbox = new THREE.Mesh(new THREE.BoxGeometry(1.001, 1.001, 1.001), new THREE.MeshBasicMaterial({
    color: 0xEEEEEE,
    transparent: true,
    opacity: 0.3
}));

let addBlock = false;
let removeBlock = false;

document.addEventListener('click', (event) => {
    if (event.button == 0) removeBlock = true;
});
document.addEventListener('mousedown', (event) => {
    if (event.button == 2) addBlock = true;
});

function loop() {
    Time.update();
    updateStats();
    skyboxShader.uniforms.enableSun.value = enableSun;
    skyboxShader.needsUpdate = true;

    movement();

    if (lastPosX != Math.floor(camaraPerspetiva.position.x / 16) || lastPosZ != Math.floor(camaraPerspetiva.position.z / 16)) {
        terrain.Update();
    }

    let raycaster = new THREE.Raycaster();
    let pointer = new THREE.Vector2();

    raycaster.setFromCamera(pointer, camaraPerspetiva);
    let intersects = raycaster.intersectObjects(cena.children);

    const parent = hitbox.parent;
    if (parent != undefined) {
        parent.remove(hitbox);
    }

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].distance > 6.8) continue;
        if (intersects[i].object == undefined) continue;
        if (intersects[i].object == skybox) continue;
        if (intersects[i].object == hitbox) continue;
        let point = intersects[i].point;
        // if (intersects[i].normal.x == 1) {
        //     point.add(new THREE.Vector3(-0.5, 0, 0));
        // } else if (intersects[i].normal.x == -1) {
        //     point.add(new THREE.Vector3(0.5, 0, 0));
        // }
        // if (intersects[i].normal.y == 1) {
        //     point.add(new THREE.Vector3(0, -0.5, 0));
        // } else if (intersects[i].normal.y == -1) {
        //     point.add(new THREE.Vector3(0, 0.5, 0));
        // }
        // if (intersects[i].normal.z == 1) {
        //     point.add(new THREE.Vector3(0, 0, -0.5));
        // } else if (intersects[i].normal.z == -1) {
        //     point.add(new THREE.Vector3(0, 0, 0.5));
        // }

        let faceNormal = intersects[i].face.normal;
        let offset = faceNormal;
        offset.multiplyScalar(0.5);
        point.copy(intersects[i].point).add(offset);

        let block = terrain.GetBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z));
        if (!block.isActive) continue;
        intersects[i].object.add(hitbox);
        hitbox.position.set(Math.round(point.x), Math.round(point.y), Math.round(point.z));
        break;
    }

    if (addBlock) {
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance > 7) continue;
            if (intersects[i].object == undefined) continue;
            if (intersects[i].object == skybox) continue;
            if (intersects[i].object == hitbox) continue;
            let point = intersects[i].point;
            // if (intersects[i].normal.x == 1) {
            //     point.add(new THREE.Vector3(-0.5, 0, 0));
            // } else if (intersects[i].normal.x == -1) {
            //     point.add(new THREE.Vector3(0.5, 0, 0));
            // }
            // if (intersects[i].normal.y == 1) {
            //     point.add(new THREE.Vector3(0, -0.5, 0));
            // } else if (intersects[i].normal.y == -1) {
            //     point.add(new THREE.Vector3(0, 0.5, 0));
            // }
            // if (intersects[i].normal.z == 1) {
            //     point.add(new THREE.Vector3(0, 0, -0.5));
            // } else if (intersects[i].normal.z == -1) {
            //     point.add(new THREE.Vector3(0, 0, 0.5));
            // }

            let faceNormal = intersects[i].face.normal;
            let offset = faceNormal;
            offset.multiplyScalar(0.5);
            point.copy(intersects[i].point).add(offset);


            let block = terrain.GetBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z));
            if (!block.isActive) continue;
            let newPos = point.clone().add(intersects[i].normal);
            let newBlock = terrain.GetBlock(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z));
            if (newBlock == undefined) continue;
            if (newBlock.type != BlockType.Default) continue;
            newBlock.type = BlockType.Dirt;
            terrain.cachedChunks[Math.floor(Math.round(newPos.x) / 16)][Math.floor(Math.round(newPos.z) / 16)].ActivateBlocks();
            terrain.GenerateChunks();
            terrain.GenerateMesh();
            break;
        }
        addBlock = false;
    }

    if (removeBlock) {
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].distance > 7) continue;
            if (intersects[i].object == undefined) continue;
            if (intersects[i].object == skybox) continue;
            if (intersects[i].object == hitbox) continue;
            let point = intersects[i].point;
            // if (intersects[i].normal.x == 1) {
            //     point.add(new THREE.Vector3(-0.5, 0, 0));
            // } else if (intersects[i].normal.x == -1) {
            //     point.add(new THREE.Vector3(0.5, 0, 0));
            // }
            // if (intersects[i].normal.y == 1) {
            //     point.add(new THREE.Vector3(0, -0.5, 0));
            // } else if (intersects[i].normal.y == -1) {
            //     point.add(new THREE.Vector3(0, 0.5, 0));
            // }
            // if (intersects[i].normal.z == 1) {
            //     point.add(new THREE.Vector3(0, 0, -0.5));
            // } else if (intersects[i].normal.z == -1) {
            //     point.add(new THREE.Vector3(0, 0, 0.5));
            // }
            let faceNormal = intersects[i].face.normal;
            let offset = faceNormal;
            offset.multiplyScalar(0.5);
            point.copy(intersects[i].point).add(offset);

            let block = terrain.GetBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z));
            if (!block.isActive) continue;
            if (block.type == BlockType.Default) continue;
            block.type = BlockType.Default;
            terrain.cachedChunks[Math.floor(Math.round(point.x) / 16)][Math.floor(Math.round(point.z) / 16)].ActivateBlocks();
            terrain.GenerateChunks();
            terrain.GenerateMesh();
            break;
        }
        removeBlock = false;
    }

    // Detect down collision
    /*let block = terrain.GetBlock(Math.floor(camaraPerspetiva.position.x), Math.floor(camaraPerspetiva.position.y) - 2, Math.floor(camaraPerspetiva.position.z));
    if (block != undefined) {
        if (block.isActive) {
            console.log(
                new THREE.Box3(
                    camaraPerspetiva.position - new THREE.Vector3(-0.5, -1, -0.5),
                    camaraPerspetiva.position + new THREE.Vector3(0.5, 1, 0.5)
                ).intersectsBox(
                    new THREE.Box3(
                        new THREE.Vector3(block.x - 0.5, block.y - 0.5, block.z - 0.5),
                        new THREE.Vector3(block.x + 0.5, block.y + 0.5, block.z + 0.5)
                    )
                )
            );
        }
    }*/

    lastPosX = Math.floor(camaraPerspetiva.position.x / 16);
    lastPosZ = Math.floor(camaraPerspetiva.position.z / 16);

    skybox.position.set(camaraPerspetiva.position.x, camaraPerspetiva.position.y, camaraPerspetiva.position.z);
    skybox.needsUpdate = true;

    pointLight.position.set(camaraPerspetiva.position.x, camaraPerspetiva.position.y + 0.5, camaraPerspetiva.position.z);
    pointLight.needsUpdate = true;

    renderer.render(cena, camaraPerspetiva);
    updateMinimap();

    requestAnimationFrame(loop);
}