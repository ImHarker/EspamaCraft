import * as THREE from 'three';

var cena = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camaraPerspetiva =new  THREE.PerspectiveCamera(75, 16/9, 0.1, 500);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camaraPerspetiva.aspect = window.innerWidth / window.innerHeight;
    camaraPerspetiva.updateProjectionMatrix();
});

export {cena, renderer, camaraPerspetiva};