import { PointerLockControls } from 'PointerLockControls';
import {cena, renderer, camaraPerspetiva} from './scene.js';


const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);


var up = false;
var down = false;
var left = false;
var right = false;

controls.addEventListener('lock', function () { });
controls.addEventListener('unlock', function () { });
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
    else if(keycode == 70){
        enableSun = !enableSun;
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


export function movement(){
    if(up) controls.moveForward(0.25);
    if(down) controls.moveForward(-0.25);
    if(left) controls.moveRight(-0.25);
    if(right) controls.moveRight(0.25);
}