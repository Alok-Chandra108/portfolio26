export const AtmosphereShader = {
  uniforms: {
    'glowColor': { value: null },
    'viewVector': { value: null }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() {
      vNormal = normalize( normalMatrix * normal );
      vPositionNormal = normalize( ( modelViewMatrix * vec4(position, 1.0) ).xyz );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() {
      float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 2.0 );
      gl_FragColor = vec4( glowColor, intensity );
    }
  `
};

export const EarthShader = {
  uniforms: {
    uDayTexture: { value: null },
    uNightTexture: { value: null },
    uCloudTexture: { value: null },
    uSunDirection: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vSunDirection;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vSunDirection = normalize(viewMatrix * vec4(10.0, 10.0, 10.0, 0.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uDayTexture;
    uniform sampler2D uNightTexture;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vSunDirection;

    void main() {
      vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
      vec3 nightColor = texture2D(uNightTexture, vUv).rgb;

      float diff = max(dot(vNormal, vSunDirection), 0.0);
      float nightIntensity = 1.0 - diff;
      
      // Smooth transition
      float lerpFactor = smoothstep(0.3, 0.7, diff);
      vec3 finalColor = mix(nightColor, dayColor, lerpFactor);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};
