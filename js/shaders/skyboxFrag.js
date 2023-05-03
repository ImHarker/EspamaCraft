// language=Glsl
const fragCode = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    
    uniform vec3 sunDir;
    uniform float sunIntensity;
    uniform vec3 sunColor;
    
    uniform bool enableSun;
    
    varying vec3 vWorldPosition;
    
    vec4 Sun() {
        vec3 sun = normalize( sunDir );
        vec3 normal = normalize( vWorldPosition );
        
        float intensity = max( dot( normal, sun ), 0.0 );
        
        vec3 color = pow( intensity * sunColor, vec3( 1.0/sunIntensity ));
        
        return vec4( color, 1.0 );
    }
    
    void main() {
        
        float h = normalize( vWorldPosition + offset ).y;
        vec4 color = vec4( mix( bottomColor, topColor, max( pow( max(h , 0.0 ), exponent ), 0.0 ) ), 1.0 );
        
        if(enableSun) {
            vec4 sun = Sun();
            gl_FragColor = color + sun;
        }
        else {
            gl_FragColor = color;
        }
    }
`;

export default fragCode;