import * as THREE from 'three';
import { PointerLockControls } from 'PointerLockControls';

var cena = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camaraPerspetiva =new  THREE.PerspectiveCamera(75, 16/9, 0.1, 500);


var geometriaCubo = new THREE.BoxGeometry(1,1,1);
var textura = new THREE.TextureLoader().load("./img/boxImage.jpg");
var materialTextura = new THREE.MeshStandardMaterial({map: textura});
var meshCubo = new THREE.Mesh(geometriaCubo, materialTextura);


document.addEventListener('DOMContentLoaded', Start);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camaraPerspetiva.aspect = window.innerWidth / window.innerHeight;
    camaraPerspetiva.updateProjectionMatrix();
});

function Start(){
    cena.add(meshCubo);
    var focoLuz = new THREE.AmbientLight('#ffffff', 1);
    cena.add(focoLuz);

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}


var up = false;
var down = false;
var left = false;
var right = false;



meshCubo.translateZ(-6);


function loop(){
    meshCubo.rotateY(Math.PI/180 * 1);

    movement();

    renderer.render(cena, camaraPerspetiva);
    
    requestAnimationFrame(loop);
}


const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);


controls.addEventListener('lock', function (){

});


controls.addEventListener('unlock', function (){

});


document.addEventListener(
    'click',
    function (){
        controls.lock();
    }, 
    false
);


document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyDown(event){
    var keycode = event.which;

    if(keycode == 87){
        up = true;
    }
    else if(keycode == 83){
        down = true;
    }
    else if(keycode == 65){
        left = true;
    }
    else if(keycode == 68){
        right = true;
    }
    else if(keycode == 32){ 
        camaraPerspetiva.position.y += 1;
    }
    else if(keycode == 16){ 
        camaraPerspetiva.position.y -= 1;
    }
}
function onDocumentKeyUp(event){
    var keycode = event.which;

    if(keycode == 87){
        up = false;
    }
    else if(keycode == 83){
        down = false;
    }
    else if(keycode == 65){
        left = false;
    }
    else if(keycode == 68){
        right = false;
    }
}

function movement(){
        if(up) controls.moveForward(0.25);
        if(down) controls.moveForward(-0.25);
        if(left) controls.moveRight(-0.25);
        if(right) controls.moveRight(0.25);
    }

var texture_dir = new THREE.TextureLoader().load('../skybox/posx.jpg');
var texture_esq = new THREE.TextureLoader().load('../skybox/negx.jpg');
var texture_up = new THREE.TextureLoader().load('../skybox/posy.jpg');
var texture_dn = new THREE.TextureLoader().load('../skybox/negy.jpg');
var texture_bk = new THREE.TextureLoader().load('../skybox/posz.jpg');
var texture_ft = new THREE.TextureLoader().load('../skybox/negz.jpg');

var materialArray = [];

materialArray.push(new THREE.MeshBasicMaterial( {map: texture_dir }));
materialArray.push(new THREE.MeshBasicMaterial( {map: texture_esq }));
materialArray.push(new THREE.MeshBasicMaterial( {map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( {map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( {map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( {map: texture_ft }));

for(var i = 0; i < 6; i++){
    materialArray[i].side = THREE.BackSide;
}

var skyboxGeo = new THREE.BoxGeometry(200, 200, 200);

var skybox = new THREE.Mesh(skyboxGeo, materialArray);

cena.add(skybox);


