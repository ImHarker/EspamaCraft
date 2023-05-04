import * as THREE from 'three';
import {Stats} from './Stats.js'

var cena = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camaraPerspetiva =new  THREE.PerspectiveCamera(90, 16/9, 0.1, 500);
camaraPerspetiva.position.set(0, 25, 0);
renderer.setSize(window.innerWidth, window.innerHeight);


function createStats() {
    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
  }

export var stats = createStats();
document.body.appendChild( stats.domElement );

document.body.appendChild(renderer.domElement);



window.addEventListener('resize', function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camaraPerspetiva.aspect = window.innerWidth / window.innerHeight;
    camaraPerspetiva.updateProjectionMatrix();
});

export {cena, renderer, camaraPerspetiva};