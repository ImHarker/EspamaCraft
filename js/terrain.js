import * as THREE from 'three';
import {cena, renderer, camaraPerspetiva} from './scene.js';
import { perlin } from "./perlin.js";


var geometriaCubo = new THREE.BoxGeometry(1,1,1);
var textura = new THREE.TextureLoader().load("../img/dirt.png");
textura.magFilter = THREE.NearestFilter;

var texture_side = new THREE.TextureLoader().load('../img/grass_side.png');
texture_side.magFilter = THREE.NearestFilter;
var texture_top = new THREE.TextureLoader().load('../img/grass_top.png');
texture_top.magFilter = THREE.NearestFilter;
var texture_down = new THREE.TextureLoader().load('../img/dirt.png');
texture_down.magFilter = THREE.NearestFilter;

var materialArrayGrass = [];
materialArrayGrass.push(new THREE.MeshStandardMaterial( {map: texture_side }));
materialArrayGrass.push(new THREE.MeshStandardMaterial( {map: texture_side }));
materialArrayGrass.push(new THREE.MeshStandardMaterial( {map: texture_top }));
materialArrayGrass.push(new THREE.MeshStandardMaterial( {map: texture_down }));
materialArrayGrass.push(new THREE.MeshStandardMaterial( {map: texture_side }));
materialArrayGrass.push(new THREE.MeshStandardMaterial( {map: texture_side }));


let frequency = 0.03;
let amplitude = 16;
let chunkSize = 100;

for(let z = 0; z < chunkSize; z++)
{
    for(let x = 0; x < chunkSize; x++)
    {
        let y = Math.floor(perlin.get(x * frequency, z * frequency) * amplitude) + 16;
        let cubo = new THREE.Mesh(geometriaCubo, materialArrayGrass);
            cubo.position.set(x, y ,z);
            cena.add(cubo);
            y--;
        // while(y > 0){
        //     let cubo = new THREE.Mesh(geometriaCubo, new THREE.MeshStandardMaterial( {map: textura }));
        //     cubo.position.set(x, y ,z);
        //     cena.add(cubo);
        //     y--;
        // }
    
    }
}


