import * as THREE from 'three';
import { Stats } from './Stats.js'

var cena = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camaraPerspetiva = new THREE.PerspectiveCamera(90, 16 / 9, 0.1, 500);
camaraPerspetiva.position.set(0, 25, 0);
renderer.setSize(window.innerWidth, window.innerHeight);


let div = document.createElement('div');
div.id = 'Coords';
const newContent = document.createTextNode(`X: ${camaraPerspetiva.position.x.toFixed(1)}\nY: ${camaraPerspetiva.position.y.toFixed(1)}\nZ: ${camaraPerspetiva.position.z.toFixed(1)}`);
div.appendChild(newContent);
div.style.position = 'absolute';
div.style.whiteSpace = 'pre-wrap';
div.style.top = '5px';
div.style.fontFamily = "Lucida Console, Courier New, monospace";
div.style.fontWeight = 'bold';
div.style.right = '5px';
div.style.width = '120px';
div.style.border = '1px solid black';
div.style.padding = '5px';
div.style.textAlign = 'start';
div.style.zIndex = '100';
div.style.display = 'block';
document.body.appendChild(div);


function createStats() {
  var stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0';
  stats.domElement.style.top = '0';

  return stats;
}

export var stats = createStats();
document.body.appendChild(stats.domElement);

document.body.appendChild(renderer.domElement);



window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camaraPerspetiva.aspect = window.innerWidth / window.innerHeight;
  camaraPerspetiva.updateProjectionMatrix();
});

export { cena, renderer, camaraPerspetiva };