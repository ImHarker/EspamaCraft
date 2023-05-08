import * as THREE from 'three';
import { Time } from './time.js';

var cena = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camaraPerspetiva = new THREE.PerspectiveCamera(90, 16 / 9, 0.1, 500);
camaraPerspetiva.position.set(0, 25, 0);
renderer.setSize(window.innerWidth, window.innerHeight);


let div = document.createElement('div');
div.id = 'Stats';
const newContent = document.createTextNode(`FPS: ${Math.floor(1 / Time.deltaTime)}\nX: ${camaraPerspetiva.position.x.toFixed(1)}\nY: ${camaraPerspetiva.position.y.toFixed(1)}\nZ: ${camaraPerspetiva.position.z.toFixed(1)}`);
div.appendChild(newContent);
div.style.position = 'absolute';
div.style.whiteSpace = 'pre-wrap';
div.style.top = '5px';
div.style.fontFamily = "VT323, Lucida Console, monospace";
div.style.fontSize = '1.5rem';
div.style.fontWeight = '500';
div.style.left = '5px';
div.style.width = '150px';
div.style.color = 'white';
div.style.textShadow = '-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000';
div.style.padding = '5px';
div.style.textAlign = 'start';
div.style.zIndex = '100';
div.style.display = 'block';
document.body.appendChild(div);

let timer = 0.0;
let lastFps = 0.0;

export function updateStats() {
    timer += Time.deltaTime;
    if (timer >= 0.1) {
        timer = 0.0;
        lastFps = Math.floor(1 / Time.deltaTime);
    }
    div.innerHTML = `FPS: ${lastFps}\nX: ${camaraPerspetiva.position.x.toFixed(1)}\nY: ${camaraPerspetiva.position.y.toFixed(1)}\nZ: ${camaraPerspetiva.position.z.toFixed(1)}`;
}

document.body.appendChild(renderer.domElement);



window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camaraPerspetiva.aspect = window.innerWidth / window.innerHeight;
    camaraPerspetiva.updateProjectionMatrix();
});

export { cena, renderer, camaraPerspetiva };