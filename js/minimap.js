import {
    cena,
    camaraPerspetiva
} from './scene.js';
import * as THREE from 'three';


let minimaprenderer = new THREE.WebGLRenderer();
minimaprenderer.setSize(256, 256);
let minimapCamera = new THREE.OrthographicCamera(-45, 45, 45, -45, -100, 10000);
minimapCamera.layers.enable(1);
minimapCamera.up = new THREE.Vector3(0, 0, -1);
minimapCamera.lookAt(new THREE.Vector3(0, -1, 0));
cena.add(minimapCamera);
let div = document.createElement('div');
div.id = 'Minimap';
div.style.position = 'absolute';
div.style.top = '5px';
div.style.right = '5px';
div.style.width = '256px';
div.style.height = '256px';
div.style.zIndex = '100';
div.style.display = 'block';
div.style.border = 'solid 5px black';
document.body.appendChild(div);
div.appendChild(minimaprenderer.domElement);

let player = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), new THREE.MeshBasicMaterial({
    color: 0x0000ff
}));
player.position.set(0, 0, 0);
player.layers.set(1);
cena.add(player);


export function updateMinimap() {
    minimapCamera.position.set(camaraPerspetiva.position.x, 50, camaraPerspetiva.position.z);
    player.position.set(camaraPerspetiva.position.x, 49, camaraPerspetiva.position.z);
    minimaprenderer.render(cena, minimapCamera);
}