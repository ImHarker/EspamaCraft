export const skyboxFragCode = /* GLSL */ `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;

    uniform vec3 sunDir;
    uniform float sunIntensity;
    uniform vec3 sunColor;

    uniform bool enableSun;

    varying vec3 vWorldPosition;

    float sdBox( in vec2 p, in vec2 b )
    {
        vec2 d = abs(p)-b;
        return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
    }

    float IntersectPlane(vec3 planeNormal, float planeDistance, vec3 rayOrigin, vec3 rayDirection)
    {
        const float epsilon = 0.0000001f;
        float nDotRayDirection = dot(planeNormal, rayDirection);
        if (abs(nDotRayDirection) < epsilon) // almost 0
        {
            return 0.0f;
        }
        vec3 actualPlanePosition = (planeNormal * -planeDistance) - rayOrigin;
        return dot(actualPlanePosition, planeNormal) / nDotRayDirection;
    }


    vec4 Sun()
    {
        vec3 rayOrigin = vec3(0, 25, 0); // the origin of the ray
        vec3 rayDir = normalize( vec3(0, 25, 0) - vWorldPosition ); // the direction of the ray
        vec3 planeNormal = normalize( sunDir ); // the normal of the plane

        vec3 col = vec3(0);

        float t = IntersectPlane( planeNormal, 35.0f, rayOrigin, rayDir);
        if (t <= 0.0f) return vec4(0,0,0,1);
        
        vec3 pointOnPlane = rayOrigin + rayDir * t;

        vec3 WorldUp = vec3(0,1,0);
        vec3 WorldRight = normalize(cross(WorldUp, planeNormal));
        vec3 WorldUp2 = normalize(cross(planeNormal, WorldRight));

        vec2 projected2DPoint = vec2(dot(pointOnPlane, WorldRight), dot(pointOnPlane, WorldUp2));

        col += step(sdBox( projected2DPoint, vec2(5.0) ), 0.0);


        return vec4(col, 1.0);
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