import * as THREE from 'three';
import {
    skyboxVertCode
} from './shaders/skyboxVert.js';
import {
    skyboxFragCode
} from './shaders/skyboxFrag.js';
import {
    cena,
    renderer,
    camaraPerspetiva,
    updateStats
} from './scene.js';
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
    AimController
} from './aimController.js';
import {
    Player
} from './player.js';

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

export const terrain = new Terrain();
const aimController = new AimController();
export const player = new Player(camaraPerspetiva);

function Start() {
    cena.add(player.object);
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

let playerSpawned = false;

function loop() {
    Time.update();
    updateStats();
    skyboxShader.uniforms.enableSun.value = enableSun;
    skyboxShader.needsUpdate = true;

    if (lastPosX != Math.floor(camaraPerspetiva.position.x / 16) || lastPosZ != Math.floor(camaraPerspetiva.position.z / 16)) {
        terrain.Update();
    }

    if (Time.time > 1 && !playerSpawned) {
        playerSpawned = true;
        let y = terrain.GetHeight(0, 0);
        player.object.position.set(0, y + 3, 0);
    }

    aimController.Update();
    player.Update();

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