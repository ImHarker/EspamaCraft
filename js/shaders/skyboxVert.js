// language=Glsl
const vertCode = `
varying vec3 vWorldPosition;

void main() {
    
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

export default vertCode;