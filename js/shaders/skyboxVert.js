export const skyboxVertCode = /* GLSL */ `
    varying vec3 vWorldPosition;

    void main() {
        vWorldPosition = position;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`