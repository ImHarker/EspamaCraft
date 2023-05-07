import * as THREE from 'three';
import vertCode from './shaders/skyboxVert.js';
import fragCode from './shaders/skyboxFrag.js';
import { cena, renderer, camaraPerspetiva, updateStats } from './scene.js';
import { movement } from './input.js'
import { Terrain } from './terrain/terrain.js';
import { Time } from './time.js';
import { updateMinimap } from './minimap.js';

let enableSun = true;
let sunDir = new THREE.Vector3(0.5, 0.5, 0);

document.addEventListener('DOMContentLoaded', Start);

function Start() {
    var focoLuz = new THREE.AmbientLight('#666666', 1);
    cena.add(focoLuz);
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(sunDir.x, sunDir.y, sunDir.z);
    cena.add(dirLight);

    cena.fog = new THREE.Fog(0xcccccc, 35, 70);

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}


var skyboxGeo = new THREE.BoxGeometry(400, 400, 400);

var skyboxShader = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 },

        sunDir: { value: sunDir },
        sunIntensity: { value: 0.01 },
        sunColor: { value: new THREE.Color(0xffff00) },

        enableSun: { value: enableSun }
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

function loop() {
    Time.update();
    updateStats();
    skyboxShader.uniforms.enableSun.value = enableSun;
    skyboxShader.needsUpdate = true;

    movement();

    if (lastPosX != Math.floor(camaraPerspetiva.position.x / 16) || lastPosZ != Math.floor(camaraPerspetiva.position.z / 16)) {
        terrain.Update();
    }

    lastPosX = Math.floor(camaraPerspetiva.position.x / 16);
    lastPosZ = Math.floor(camaraPerspetiva.position.z / 16);

    skybox.position.set(camaraPerspetiva.position.x, camaraPerspetiva.position.y, camaraPerspetiva.position.z);
    skybox.needsUpdate = true;

    renderer.render(cena, camaraPerspetiva);
    updateMinimap();

    requestAnimationFrame(loop);
}
