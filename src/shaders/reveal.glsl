uniform float uTime;
uniform sampler2D uTexture;
uniform float uReveal;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float noise = sin((uv.y + uTime * 0.6) * 12.0) * 0.08;
  float mask = smoothstep(uReveal - 0.2, uReveal, uv.y + noise);

  vec4 tex = texture2D(uTexture, uv);
  gl_FragColor = vec4(tex.rgb, tex.a * mask);
}
