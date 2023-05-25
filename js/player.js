import * as THREE from 'three';
import {
    Time
} from './time.js';
import {
    cena,
    renderer
} from './scene.js';
import {
    player,
    terrain
} from './app.js';
import {
    PointerLockControls
} from 'PointerLockControls';
import {
    paused,
    TogglePauseMenu
} from './pauseMenu.js';
import {
    Audio
} from './audio.js';

export class Player {
    static raycaster = new THREE.Raycaster();
    static pointer = new THREE.Vector2();

    constructor(camera) {
        this.camera = camera;
        this.camera.position.set(0, 1.65, 0);
        this.object = new THREE.Object3D();
        this.object.add(camera);
        this.updateStartPos = this.object.position.clone();

        this.isGrounded = false;

        this.speed = 5;

        this.velocity = new THREE.Vector3();

        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;

        document.addEventListener('keydown', this.OnKeyDown.bind(this));
        document.addEventListener('keyup', this.OnKeyUp.bind(this));

        var controls = new PointerLockControls(this.camera, renderer.domElement);

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

    }

    OnKeyDown(event) {
        switch (event.keyCode) {
            case 87: // W
                this.forward = true;
                break;
            case 65: // A
                this.left = true;
                break;
            case 83: // S
                this.backward = true;
                break;
            case 68: // D
                this.right = true;
                break;
            case 32: // Space
                if (this.isGrounded) {
                    this.velocity.y = 6.5;
                }
                break;
            case 70: // F
                player.velocity.y = 0;
                player.object.position.y = terrain.GetHeight(Math.floor(player.object.position.x), Math.floor(player.object.position.z)) + 1.5;
                break;
            case 80: // P
                TogglePauseMenu();
                break;
        }
    }

    OnKeyUp(event) {
        switch (event.keyCode) {
            case 87: // W
                this.forward = false;
                break;
            case 65: // A
                this.left = false;
                break;
            case 83: // S
                this.backward = false;
                break;
            case 68: // D
                this.right = false;
                break;
        }
    }

    Update() {
        if (Time.time < 5) return;

        this.updateStartPos = this.object.position.clone();

        // Apply input
        let horizontalVelocity = new THREE.Vector2();
        if (this.forward) {
            horizontalVelocity.y = -1;
        } else if (this.backward) {
            horizontalVelocity.y = 1;
        } else {
            horizontalVelocity.y = 0;
        }

        if (this.left) {
            horizontalVelocity.x = -1;
        } else if (this.right) {
            horizontalVelocity.x = 1;
        } else {
            horizontalVelocity.x = 0;
        }

        horizontalVelocity.normalize();

        this.CheckGround();

        if (!this.isGrounded) this.ApplyGravity();
        else if (this.velocity.y < 0) {
            this.velocity.y = 0;
        }

        // Apply velocity
        this.velocity.x = horizontalVelocity.x * this.speed;
        this.velocity.z = horizontalVelocity.y * this.speed;

        // Check for collisions
        this.Collide();

        let forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);

        forward.y = 0;
        forward.normalize();

        let right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        right.y = 0;
        right.normalize();

        forward.multiplyScalar(-this.velocity.z);
        right.multiplyScalar(this.velocity.x);

        console.log(forward, right);

        this.object.position.add(forward.clone().multiplyScalar(Time.deltaTime));
        this.object.position.add(right.clone().multiplyScalar(Time.deltaTime));
        this.object.position.add(new THREE.Vector3(0, this.velocity.y * Time.deltaTime, 0));
        this.object.needsUpdate = true;
    }

    CheckGround() {
        Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(-0.25, 0.01, -0.25)), new THREE.Vector3(0, -1, 0));

        let intersects = Player.raycaster.intersectObjects(cena.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[0].distance < 0.1) {
                this.isGrounded = true;
                return;
            } else {
                this.isGrounded = false;
            }
        }

        Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(-0.25, 0.01, 0.25)), new THREE.Vector3(0, -1, 0));

        intersects = Player.raycaster.intersectObjects(cena.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[0].distance < 0.1) {
                this.isGrounded = true;
                return;
            } else {
                this.isGrounded = false;
            }
        }

        Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(0.25, 0.01, -0.25)), new THREE.Vector3(0, -1, 0));

        intersects = Player.raycaster.intersectObjects(cena.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[0].distance < 0.1) {
                this.isGrounded = true;
                return;
            } else {
                this.isGrounded = false;
            }
        }

        Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(0.25, 0.0, 0.25)), new THREE.Vector3(0, -1, 0));

        intersects = Player.raycaster.intersectObjects(cena.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[0].distance < 0.1) {
                this.isGrounded = true;
                return;
            } else {
                this.isGrounded = false;
            }
        }
    }

    ApplyGravity() {
        this.velocity.y -= 20 * Time.deltaTime;
    }

    Collide() {
        let intersects;

        let horizontalVelocity = this.velocity.clone();
        horizontalVelocity.y = 0;

        if (horizontalVelocity.length() > 0.001) {
            if (horizontalVelocity.clone().normalize().x > 0) {
                Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(0.2, 0.1, 0)), new THREE.Vector3(1, 0, 0));
                intersects = Player.raycaster.intersectObjects(cena.children);
                if (intersects.length > 0) {
                    if (intersects[0].distance < horizontalVelocity.clone().multiplyScalar(Time.deltaTime).length()) {
                        horizontalVelocity.x = 0;
                    }
                }
            } else if (horizontalVelocity.clone().normalize().x < 0) {
                Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(-0.2, 0.1, 0)), new THREE.Vector3(-1, 0, 0));
                intersects = Player.raycaster.intersectObjects(cena.children);
                if (intersects.length > 0) {
                    if (intersects[0].distance < horizontalVelocity.clone().multiplyScalar(Time.deltaTime).length()) {
                        horizontalVelocity.x = 0;
                    }
                }
            }

            if (horizontalVelocity.clone().normalize().z > 0) {
                Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(0, 0.1, 0.2)), new THREE.Vector3(0, 0, 1));
                intersects = Player.raycaster.intersectObjects(cena.children);
                if (intersects.length > 0) {
                    if (intersects[0].distance < horizontalVelocity.clone().multiplyScalar(Time.deltaTime).length()) {
                        horizontalVelocity.z = 0;
                    }
                }
            } else if (horizontalVelocity.clone().normalize().z < 0) {
                Player.raycaster.set(this.object.position.clone().add(new THREE.Vector3(0, 0.1, -0.2)), new THREE.Vector3(0, 0, -1));
                intersects = Player.raycaster.intersectObjects(cena.children);
                if (intersects.length > 0) {
                    if (intersects[0].distance < horizontalVelocity.clone().multiplyScalar(Time.deltaTime).length()) {
                        horizontalVelocity.z = 0;
                    }
                }
            }
        }

        this.velocity.x = horizontalVelocity.x;
        this.velocity.z = horizontalVelocity.z;

        if (this.velocity.y <= 0) {
            let block = terrain.GetBlock(Math.floor(this.object.position.x), Math.floor(this.object.position.y + 0.5), Math.floor(this.object.position.z));
            if (block != undefined) {
                if (block.isActive) {
                    this.velocity.y = 0;
                    this.object.position.y = terrain.GetHeight(Math.floor(this.object.position.x), Math.floor(this.object.position.z)) + 0.5;
                }
            }
        }

        if (this.velocity.x != 0) {
            let block = terrain.GetBlock(Math.floor(this.object.position.x + this.velocity.x * Time.deltaTime), Math.floor(this.object.position.y + 0.5), Math.floor(this.object.position.z));
            if (block != undefined) {
                if (block.isActive) {
                    this.velocity.x = 0;
                }
            }
        }

        if (this.velocity.z != 0) {
            let block = terrain.GetBlock(Math.floor(this.object.position.x), Math.floor(this.object.position.y + 0.5), Math.floor(this.object.position.z + this.velocity.z * Time.deltaTime));
            if (block != undefined) {
                if (block.isActive) {
                    this.velocity.z = 0;
                }
            }
        }
    }
}