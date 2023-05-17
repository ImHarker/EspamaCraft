import {
    PointerLockControls
} from 'PointerLockControls';
import {
    renderer,
    camaraPerspetiva
} from './scene.js';
import {
    Audio
} from './audio.js';
import {
    paused,
    TogglePauseMenu
} from './pauseMenu.js';

var controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);

controls.addEventListener('lock', function () {});
controls.addEventListener('unlock', function () {});

document.addEventListener(
    'click',
    function () {
        if (paused) return;
        controls.lock();
        Audio.Start();
    },
    false
);

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    var keycode = event.which;

    if (keycode == 80) {
        TogglePauseMenu();
        if (paused) controls.unlock();
        else controls.lock();
    } else if (keycode == 77) {
        if (Audio.sound.isPlaying) Audio.sound.pause();
        else Audio.sound.play();
    }
}