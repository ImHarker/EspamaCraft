import * as THREE from 'three';
import vertCode from './shaders/skyboxVert.js';
import fragCode from './shaders/skyboxFrag.js';
import {cena, renderer, camaraPerspetiva, stats} from './scene.js';
import {movement} from './input.js'




let enableSun = true;
let sunDir = new THREE.Vector3(0.5, 0.5, 0);

document.addEventListener('DOMContentLoaded', Start);


function Start(){
    var focoLuz = new THREE.AmbientLight('#666666', 1);
    cena.add(focoLuz);
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(sunDir.x, sunDir.y, sunDir.z);
    cena.add(dirLight);

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}


var skyboxGeo = new THREE.BoxGeometry(200, 200, 200);

var skyboxShader = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 },

        sunDir: { value: sunDir },
        sunIntensity: { value: 0.01 },
        sunColor: { value: new THREE.Color(0xffffff) },

        enableSun: { value: enableSun }
    },
    vertexShader: vertCode,
    fragmentShader: fragCode,
    side: THREE.BackSide
});

var skybox = new THREE.Mesh(skyboxGeo, skyboxShader);

cena.add(skybox);

function loop(){
    skyboxShader.uniforms.enableSun.value = enableSun;
    skyboxShader.needsUpdate = true;

    movement();

    stats.update();
    renderer.render(cena, camaraPerspetiva);

    requestAnimationFrame(loop);
}
