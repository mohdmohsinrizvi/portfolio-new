/**
 * GLSL for THE SIGNAL CORE.
 *
 * Ashima / Stefan Gustavson simplex noise is used under the standard
 * permissive terms (see docs/ASSET_CREDITS.md); everything else here is
 * original to this project.
 */

export const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export const SIGNAL_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFrequency;
uniform float uOctaves;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;
varying vec3 vPosition;

${SIMPLEX_3D}

float fbm(vec3 p, float octaves){
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    float w = clamp(octaves - float(i), 0.0, 1.0);
    sum += snoise(p * freq) * amp * w;
    freq *= 2.05;
    amp *= 0.5;
  }
  return sum;
}

float field(vec3 p){
  vec3 drift = vec3(0.0, uTime * 0.11, uTime * 0.07);
  float base = fbm(p * uFrequency + drift, uOctaves);
  float detail = snoise(p * uFrequency * 2.7 - drift.zxy) * 0.24;
  return base + detail;
}

void main(){
  vec3 n = normalize(normal);
  float d = field(position);

  vec3 displaced = position + n * d * uAmp;

  // rebuild a perturbed normal by sampling the field along two tangents
  float e = 0.045;
  vec3 t1 = normalize(abs(n.y) < 0.99 ? cross(n, vec3(0.0, 1.0, 0.0)) : vec3(1.0, 0.0, 0.0));
  vec3 t2 = normalize(cross(n, t1));
  float d1 = field(position + t1 * e);
  float d2 = field(position + t2 * e);
  vec3 p1 = position + t1 * e + n * d1 * uAmp;
  vec3 p2 = position + t2 * e + n * d2 * uAmp;
  vec3 perturbed = normalize(cross(p1 - displaced, p2 - displaced));
  if (dot(perturbed, n) < 0.0) perturbed = -perturbed;

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vec4 view = viewMatrix * world;

  vNormal = normalize(mat3(modelMatrix) * perturbed);
  vViewDir = normalize(cameraPosition - world.xyz);
  vNoise = d;
  vPosition = displaced;

  gl_Position = projectionMatrix * view;
}
`;

export const SIGNAL_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;
varying vec3 vPosition;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);

  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.4);

  // thin-film style interference: hue sweeps with viewing angle.
  // The surface-noise term is kept small — a large one shreds the palette
  // into rainbow confetti instead of a slow iridescent band.
  float phase = fres * 2.1 + vNoise * 0.16 + uTime * 0.035;
  vec3 film = 0.5 + 0.5 * cos(6.2831853 * (vec3(0.02, 0.36, 0.68) + phase));
  // pull the raw rainbow back toward the site palette so the object reads
  // as iridescent violet/teal/champagne rather than a full spectrum
  vec3 tint = mix(uColB, uColC, 0.5 + 0.5 * sin(phase * 1.7));
  film = mix(film, tint, 0.55);

  // a soft key light from upper-left keeps the silhouette readable
  vec3 L = normalize(vec3(-0.55, 0.72, 0.42));
  float lambert = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);
  float spec = pow(clamp(dot(reflect(-L, N), V), 0.0, 1.0), 48.0);

  vec3 deep = mix(uColA, uColB, smoothstep(-0.5, 0.6, vNoise));
  vec3 body = mix(deep, film, 0.26 + 0.30 * fres);
  body += uColC * spec * 0.55;
  body += uColC * pow(fres, 3.0) * 0.5;
  body *= 0.62 + 0.38 * lambert;

  float alpha = clamp(0.72 + fres * 0.42, 0.0, 1.0) * uIntensity;

  // gamma-ish lift so the core reads against a near-black background
  body = pow(max(body, 0.0), vec3(0.86));

  gl_FragColor = vec4(body * uIntensity, alpha);
}
`;

export const POINT_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uSpread;

attribute float aSeed;
attribute float aScale;

varying float vAlpha;

void main(){
  vec3 p = position;
  float t = uTime * 0.06 + aSeed * 6.2831853;
  p.x += sin(t) * 0.32;
  p.y += cos(t * 0.83) * 0.26;
  p.z += sin(t * 1.21) * 0.32;
  p *= uSpread;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // The projection constant is deliberately small: a large one turns any
  // particle near the camera into a screen-filling blob, and additive
  // stacking of those blobs saturates the frame to white. Clamp so a
  // stray particle can never dominate the composition.
  gl_PointSize = clamp(uSize * aScale * (26.0 / max(-mv.z, 0.001)), 0.6, 9.0);

  float depthFade = smoothstep(26.0, 4.0, -mv.z);
  vAlpha = (0.05 + 0.17 * aScale) * depthFade;
}
`;

export const POINT_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, a * a * vAlpha);
}
`;
