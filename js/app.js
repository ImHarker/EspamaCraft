import * as THREE from 'three';
import vertCode from './shaders/skyboxVert.js';
import fragCode from './shaders/skyboxFrag.js';
import {cena, renderer, camaraPerspetiva} from './scene.js';
import {movement} from './input.js'


var geometriaCubo = new THREE.BoxGeometry(1,1,1);
var textura = new THREE.TextureLoader().load("./img/boxImage.jpg");
var materialTextura = new THREE.MeshStandardMaterial({map: textura});
var meshCubo = new THREE.Mesh(geometriaCubo, materialTextura);

let enableSun = true;
let sunDir = new THREE.Vector3(0.5, 0.5, 0);

document.addEventListener('DOMContentLoaded', Start);


function Start(){
    cena.add(meshCubo);
    var focoLuz = new THREE.AmbientLight('#444444', 1);
    cena.add(focoLuz);
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(sunDir.x, sunDir.y, sunDir.z);
    cena.add(dirLight);

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}

meshCubo.translateZ(-6);


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
    meshCubo.rotateY(Math.PI/180 * 1);

    skyboxShader.uniforms.enableSun.value = enableSun;
    skyboxShader.needsUpdate = true;

    movement();

    renderer.render(cena, camaraPerspetiva);

    requestAnimationFrame(loop);
}
