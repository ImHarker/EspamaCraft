import * as THREE from 'three';
import { camaraPerspetiva } from './scene.js';
import { GetCookie } from "./cookies.js";

export class Audio {

    static curSound = Math.floor(Math.random() * 2);
    static sound;

    static Start() {

        if (Audio.sound == undefined) {
            const listener = new THREE.AudioListener();
            camaraPerspetiva.add(listener);

            Audio.sound = new THREE.Audio(listener);
        }

        if (Audio.sound.isPlaying) return;

        const audioLoader = new THREE.AudioLoader();

        if (Audio.curSound == 0) {
            audioLoader.load('../audio/sweden.mp3', (buffer) => {
                Audio.sound.setBuffer(buffer);
                Audio.sound.setLoop(true);
                Audio.sound.setVolume(GetCookie("volume") / 100.0);
                Audio.sound.onEnded = () => {
                    Audio.curSound = 1;
                    Audio.Start();
                };
                Audio.sound.play();
            });
        } else {
            audioLoader.load('../audio/minecraft.mp3', (buffer) => {
                Audio.sound.setBuffer(buffer);
                Audio.sound.setLoop(true);
                Audio.sound.setVolume(GetCookie("volume") / 100.0);
                Audio.sound.onEnded = () => {
                    Audio.curSound = 0;
                    Audio.Start();
                };
                Audio.sound.play();
            });
        }
        return;
    }
}