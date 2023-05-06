import { PointerLockControls } from 'PointerLockControls';
import { cena, renderer, camaraPerspetiva } from './scene.js';
import { Time } from './time.js';
import { Audio } from './audio.js';

var controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);

var front = false;
var back = false;
var left = false;
var right = false;
var up = false;
var down = false;

controls.addEventListener('lock', function () { });
controls.addEventListener('unlock', function () { });

document.addEventListener(
    'click',
    function () {
        controls.lock();
        Audio.Start();
    },
    false
);

document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    var keycode = event.which;

    if (keycode == 87) {
        front = true;
    }
    else if (keycode == 83) {
        back = true;
    }
    else if (keycode == 65) {
        left = true;
    }
    else if (keycode == 68) {
        right = true;
    }
    else if (keycode == 32) {
        up = true;
    }
    else if (keycode == 16) {
        down = true;
    }
    else if (keycode == 70) {
        enableSun = !enableSun;
    }
}

function onDocumentKeyUp(event) {
    var keycode = event.which;

    if (keycode == 87) {
        front = false;
    }
    else if (keycode == 83) {
        back = false;
    }
    else if (keycode == 65) {
        left = false;
    }
    else if (keycode == 68) {
        right = false;
    }
    else if (keycode == 32) {
        up = false;
    }
    else if (keycode == 16) {
        down = false;
    }
}


export function movement() {
    if (up) camaraPerspetiva.position.y += 20 * Time.deltaTime;
    if (down) camaraPerspetiva.position.y -= 20 * Time.deltaTime;
    if (front) controls.moveForward(20 * Time.deltaTime);
    if (back) controls.moveForward(-20 * Time.deltaTime);
    if (left) controls.moveRight(-20 * Time.deltaTime);
    if (right) controls.moveRight(20 * Time.deltaTime);
}