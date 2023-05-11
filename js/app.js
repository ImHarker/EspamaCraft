import * as THREE from 'three';
import vertCode from './shaders/skyboxVert.js';
import fragCode from './shaders/skyboxFrag.js';
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
    vertexShader: vertCode,
    fragmentShader: fragCode,
    side: THREE.BackSide
});

var skybox = new THREE.Mesh(skyboxGeo, skyboxShader);

cena.add(skybox);

let lastPosX = 0;
let lastPosZ = 0;

const terrain = new Terrain();

// let points = [
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(0, 0, 16),
// ];

// let line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({
//     color: 0xff0000
// }));
// cena.add(line);

function loop() {
    Time.update();
    updateStats();
    skyboxShader.uniforms.enableSun.value = enableSun;
    skyboxShader.needsUpdate = true;

    movement();

    if (lastPosX != Math.floor(camaraPerspetiva.position.x / 16) || lastPosZ != Math.floor(camaraPerspetiva.position.z / 16)) {
        terrain.Update();
    }

    // Camera direction line
    /*let vector = new THREE.Vector3(0, 0, -1);
    vector.applyQuaternion(camaraPerspetiva.quaternion);

    let camPos = new THREE.Vector3(camaraPerspetiva.position.x, camaraPerspetiva.position.y, camaraPerspetiva.position.z);

    line.geometry.dispose();
    points = [
        new THREE.Vector3(camPos.x, camPos.y - .1, camPos.z).add(new THREE.Vector3(vector.x, vector.y, vector.z).multiplyScalar(.1)),
        new THREE.Vector3(camPos.x, camPos.y - .1, camPos.z).add(new THREE.Vector3(vector.x, vector.y, vector.z).multiplyScalar(10)),
    ];
    line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    line.needsUpdate = true;*/


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