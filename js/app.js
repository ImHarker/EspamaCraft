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
import {
    FBXLoader
} from 'FBXLoader';

let txikenz;
let animationMixer;

const fbxLoader = new FBXLoader()
fbxLoader.load(
    '../models/txiken.fbx',
    (object) => {

        animationMixer = new THREE.AnimationMixer(object);
        let action = animationMixer.clipAction(object.animations[0]);
        action.play();

        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load('../models/txiken.png');
        texture.magFilter = THREE.NearestFilter;
        let material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        
        object.traverse(function (child) {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        object.rotation.y = Math.PI;
        object.scale.set(.01, .01, .01);
        object.position.set(0, 7, -0.5);
        cena.add(object);
        txikenz = object;
    },
    (progress) => { },
    (error) => {
        console.log(error)
    }
)

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

export const player = new Player(camaraPerspetiva);
export const terrain = new Terrain();
const aimController = new AimController();

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

    if(txikenz) {
        animationMixer.update(Time.deltaTime);
        txikenz.rotation.y -= Time.deltaTime * Math.PI / 2;
        let txikenDirection = new THREE.Vector3();
        txikenz.getWorldDirection(txikenDirection);
        txikenz.position.x += txikenDirection.x * 0.1 * Time.deltaTime;
        txikenz.position.z += txikenDirection.z * 0.1 * Time.deltaTime;
    }

    if (lastPosX != Math.floor(camaraPerspetiva.parent.position.x / 16) || lastPosZ != Math.floor(camaraPerspetiva.parent.position.z / 16)) {
        terrain.Update();
    }

    if (Time.time > 1 && !playerSpawned) {
        playerSpawned = true;
        let y = terrain.GetHeight(0, 0);
        player.object.position.set(0, y + 3, 0);
    }

    aimController.Update();

    lastPosX = Math.floor(camaraPerspetiva.parent.position.x / 16);
    lastPosZ = Math.floor(camaraPerspetiva.parent.position.z / 16);
    player.Update();

    skybox.position.set(camaraPerspetiva.parent.position.x, camaraPerspetiva.parent.position.y, camaraPerspetiva.parent.position.z);
    skybox.needsUpdate = true;

    pointLight.position.set(camaraPerspetiva.parent.position.x, camaraPerspetiva.parent.position.y + 0.5, camaraPerspetiva.parent.position.z);
    pointLight.needsUpdate = true;

    renderer.render(cena, camaraPerspetiva);
    updateMinimap();

    requestAnimationFrame(loop);
}