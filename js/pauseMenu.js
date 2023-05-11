import { ToggleSun, ToggleAmbient, TogglePointLights } from './app.js';

let pauseMenu = document.getElementById('pauseMenu');
pauseMenu.classList.add('hidden');
pauseMenu.classList.remove('show');

let toggleSunButton = document.getElementById('toggleSun');
toggleSunButton.onclick = ToggleSun;

let toggleAmbientButton = document.getElementById('toggleAmbient');
toggleAmbientButton.onclick = ToggleAmbient;

let togglePointLightsButton = document.getElementById('togglePointLights');
togglePointLightsButton.onclick = TogglePointLights;

export let paused = false;

export function TogglePauseMenu() {
    paused = !paused;

    if(paused) {
        pauseMenu.classList.remove('hidden');
        pauseMenu.classList.add('show');
    } else {
        pauseMenu.classList.add('hidden');
        pauseMenu.classList.remove('show');
    }
}