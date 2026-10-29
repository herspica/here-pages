var e=class{canvas;artwork;reducedMotion;onReady;gl;observer;program=null;texture=null;buffer=null;timeUniform=null;frame=0;elapsed=0;lastClock=0;lastPaint=0;needsResize=!0;disposed=!1;lost=!1;ready=!1;constructor(e,t,n,r){this.canvas=e,this.artwork=t,this.reducedMotion=n,this.onReady=r;let i=e.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!0,powerPreference:`low-power`});if(!i)throw Error(`WebGL is unavailable`);this.gl=i;try{this.initialize()}catch(e){throw this.release(),e}this.observer=new ResizeObserver(()=>{this.needsResize=!0,this.schedule()}),this.observer.observe(e),e.addEventListener(`webglcontextlost`,this.contextLost),e.addEventListener(`webglcontextrestored`,this.contextRestored),document.addEventListener(`visibilitychange`,this.visibilityChanged),this.schedule()}compile(e,t){let n=this.gl,r=n.createShader(t);if(!r)throw Error(`Cannot allocate a shader`);if(n.shaderSource(r,e),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS)){let e=n.getShaderInfoLog(r);throw n.deleteShader(r),Error(e??`Cannot compile the collage shader`)}return r}initialize(){let e=this.gl,t=this.compile(`
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,e.VERTEX_SHADER),n;try{n=this.compile(`
precision highp float;
uniform sampler2D uArtwork;
uniform float uTime;
varying vec2 vUv;

void moon(inout vec2 sampleUv, vec2 p, vec2 center, float radius, float phase) {
  float mask = 1.0 - smoothstep(radius * 0.82, radius * 1.72, distance(p, center));
  vec2 drift = vec2(
    sin(uTime * 0.55 + phase) - sin(phase),
    sin(uTime * 0.43 + phase * 1.3) - sin(phase * 1.3)
  ) * vec2(0.0045, 0.0065);
  sampleUv -= drift * mask;
}

vec2 rotate(vec2 p, float angle) {
  float s = sin(angle), c = cos(angle);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

float random(vec2 seed) {
  return fract(sin(dot(seed, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // Work in the original image's top-left coordinate system.
  vec2 p = vec2(vUv.x, 1.0 - vUv.y);
  vec2 sampleUv = p;

  moon(sampleUv, p, vec2(0.1625, 0.1484), 0.037, 0.2);
  moon(sampleUv, p, vec2(0.2516, 0.1430), 0.048, 1.0);
  moon(sampleUv, p, vec2(0.3469, 0.1570), 0.051, 1.8);
  moon(sampleUv, p, vec2(0.4492, 0.1797), 0.050, 2.6);
  moon(sampleUv, p, vec2(0.5555, 0.2273), 0.051, 3.4);
  moon(sampleUv, p, vec2(0.6734, 0.2984), 0.054, 4.2);
  moon(sampleUv, p, vec2(0.7609, 0.4078), 0.055, 5.0);
  moon(sampleUv, p, vec2(0.8148, 0.5078), 0.049, 5.8);
  moon(sampleUv, p, vec2(0.8539, 0.6094), 0.044, 6.6);
  moon(sampleUv, p, vec2(0.8766, 0.7031), 0.043, 7.4);

  vec2 halo = p - vec2(0.491, 0.426);
  float radius = length(halo);
  float haloMask = smoothstep(0.065, 0.115, radius)
    * (1.0 - smoothstep(0.235, 0.295, radius))
    * (1.0 - smoothstep(0.435, 0.555, p.y));
  sampleUv += (rotate(halo, sin(uTime * 0.47) * 0.022) - halo) * haloMask;

  // Move the existing ink spiral, keeping the central eye and lower statue still.
  vec2 spiral = p - vec2(0.541, 0.557);
  float spiralMask = (1.0 - smoothstep(0.035, 0.098, length(spiral)))
    * smoothstep(0.493, 0.525, p.y);
  sampleUv += (rotate(spiral, sin(uTime * 0.68) * 0.11) - spiral) * spiralMask;

  float leftOffset = (p.x - (0.115 + 0.035 * sin(p.y * 12.0))) / 0.052;
  float rightOffset = (p.x - (0.865 + 0.04 * sin(p.y * 11.0))) / 0.055;
  float leftBand = exp(-leftOffset * leftOffset);
  float rightBand = exp(-rightOffset * rightOffset);
  float ribbons = (leftBand + rightBand) * (1.0 - smoothstep(0.57, 0.73, p.y));
  sampleUv.x += sin(uTime * 0.62) * sin(p.y * 18.0 + uTime * 0.28) * ribbons * 0.005;
  sampleUv.y += sin(uTime * 0.39) * ribbons * 0.002;

  vec3 color = texture2D(uArtwork, clamp(sampleUv, 0.0, 1.0)).rgb;
  float warmInk = smoothstep(0.035, 0.145, color.r - color.b) * smoothstep(0.26, 0.58, color.g);
  float haloAngle = atan(halo.y, abs(halo.x) < 0.000001 ? 0.000001 : halo.x);
  float movingLight = sin(haloAngle * 3.0 - uTime * 1.05 + radius * 48.0);
  float fadeIn = smoothstep(0.0, 1.8, uTime);
  color *= 1.0 + warmInk * haloMask * movingLight * 0.25 * fadeIn;

  // Sparse matte gold flecks drift around the collage, never over the statue.
  vec2 grid = vec2(9.0, 11.0);
  vec2 cell = floor(p * grid);
  float seed = random(cell);
  vec2 local = fract(p * grid);
  vec2 fleck = vec2(0.18 + 0.64 * seed, fract(seed * 7.0 - uTime * (0.055 + seed * 0.04)));
  fleck.x += sin(uTime * 0.6 + seed * 14.0) * 0.05;
  float speck = 1.0 - smoothstep(0.0004, 0.0017, length((local - fleck) / grid));
  float edge = smoothstep(0.0, 0.16, fleck.y) * (1.0 - smoothstep(0.84, 1.0, fleck.y));
  float protectStatue = 1.0 - smoothstep(0.60, 0.67, p.y)
    * smoothstep(0.22, 0.30, p.x) * (1.0 - smoothstep(0.73, 0.81, p.x));
  float speckMask = smoothstep(0.15, 0.23, p.y) * (1.0 - smoothstep(0.87, 0.95, p.y)) * protectStatue;
  color += vec3(0.68, 0.54, 0.29) * speck * edge * speckMask * 0.48 * fadeIn;
  gl_FragColor = vec4(color, 1.0);
}`,e.FRAGMENT_SHADER)}catch(n){throw e.deleteShader(t),n}if(this.program=e.createProgram(),!this.program)throw e.deleteShader(t),e.deleteShader(n),Error(`Cannot allocate a program`);if(e.attachShader(this.program,t),e.attachShader(this.program,n),e.linkProgram(this.program),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(this.program,e.LINK_STATUS))throw Error(`Cannot link the collage shader`);if(e.useProgram(this.program),this.buffer=e.createBuffer(),!this.buffer)throw Error(`Cannot allocate the image plane`);e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let r=e.getAttribLocation(this.program,`aPosition`);if(e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0),this.texture=e.createTexture(),!this.texture)throw Error(`Cannot allocate the artwork texture`);e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.artwork),e.uniform1i(e.getUniformLocation(this.program,`uArtwork`),0),this.timeUniform=e.getUniformLocation(this.program,`uTime`),this.needsResize=!0}schedule(){this.frame||this.disposed||this.lost||document.hidden||(this.frame=requestAnimationFrame(this.tick))}stop(){cancelAnimationFrame(this.frame),this.frame=0,this.lastClock=0}tick=e=>{if(this.frame=0,this.disposed||this.lost||document.hidden)return;if(!this.needsResize&&!this.reducedMotion&&e-this.lastPaint<1e3/30-.5){this.schedule();return}!this.reducedMotion&&this.lastClock&&(this.elapsed+=Math.max(0,e-this.lastClock)/1e3),this.lastClock=e;let t=this.gl;if(this.needsResize){let e=this.canvas.getBoundingClientRect(),n=Math.min(window.devicePixelRatio||1,1.5,1280/Math.max(e.width,e.height,1)),r=Math.max(1,Math.round(e.width*n)),i=Math.max(1,Math.round(e.height*n));(this.canvas.width!==r||this.canvas.height!==i)&&(this.canvas.width=r,this.canvas.height=i),t.viewport(0,0,r,i),this.needsResize=!1}t.uniform1f(this.timeUniform,this.elapsed),t.drawArrays(t.TRIANGLE_STRIP,0,4),this.lastPaint=e,this.ready||(this.ready=!0,this.onReady(!0)),this.reducedMotion||this.schedule()};setReducedMotion(e){this.reducedMotion!==e&&(this.reducedMotion=e,this.stop(),(!e||this.needsResize)&&this.schedule())}visibilityChanged=()=>{this.stop(),document.hidden||this.schedule()};contextLost=e=>{e.preventDefault(),this.lost=!0,this.ready=!1,this.stop(),this.onReady(!1)};contextRestored=()=>{if(!this.disposed){this.program=null,this.texture=null,this.buffer=null;try{this.initialize(),this.lost=!1,this.schedule()}catch{this.release(),this.onReady(!1)}}};release(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindTexture(this.gl.TEXTURE_2D,null),this.gl.useProgram(null),this.gl.deleteBuffer(this.buffer),this.gl.deleteTexture(this.texture),this.gl.deleteProgram(this.program),this.program=null,this.texture=null,this.buffer=null}dispose(){this.disposed=!0,this.stop(),this.observer.disconnect(),this.canvas.removeEventListener(`webglcontextlost`,this.contextLost),this.canvas.removeEventListener(`webglcontextrestored`,this.contextRestored),document.removeEventListener(`visibilitychange`,this.visibilityChanged),this.release()}};export{e as LunarFolioScene};