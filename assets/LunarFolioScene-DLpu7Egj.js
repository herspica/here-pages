var e=[[.1625,.1484,.043],[.2516,.143,.05],[.3469,.157,.053],[.4492,.1797,.049],[.5555,.2273,.053],[.6734,.2984,.053],[.7609,.4078,.052],[.8148,.5078,.05],[.8539,.6039,.045],[.8766,.6977,.046]],t=class{canvas;artwork;reducedMotion;onReady;gl;observer;program=null;texture=null;buffer=null;timeUniform=null;rectUniform=null;passUniform=null;sourceUniform=null;destinationUniform=null;opacityUniform=null;behindUniform=null;orbitWidth=.34;frame=0;elapsed=0;lastClock=0;lastPaint=0;needsResize=!0;disposed=!1;lost=!1;ready=!1;constructor(e,t,n,r){this.canvas=e,this.artwork=t,this.reducedMotion=n,this.onReady=r;let i=e.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!0,powerPreference:`low-power`});if(!i)throw Error(`WebGL is unavailable`);this.gl=i;try{this.initialize()}catch(e){throw this.release(),e}this.observer=new ResizeObserver(()=>{this.needsResize=!0,this.schedule()}),this.observer.observe(e),e.addEventListener(`webglcontextlost`,this.contextLost),e.addEventListener(`webglcontextrestored`,this.contextRestored),document.addEventListener(`visibilitychange`,this.visibilityChanged),this.schedule()}compile(e,t){let n=this.gl,r=n.createShader(t);if(!r)throw Error(`Cannot allocate a shader`);if(n.shaderSource(r,e),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS)){let e=n.getShaderInfoLog(r);throw n.deleteShader(r),Error(e??`Cannot compile the collage shader`)}return r}initialize(){let e=this.gl,t=this.compile(`
attribute vec2 aPosition;
uniform vec4 uRect;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition * uRect.zw + uRect.xy, 0.0, 1.0);
}`,e.VERTEX_SHADER),n;try{n=this.compile(`
precision highp float;
uniform sampler2D uArtwork;
uniform float uTime;
uniform float uPass;
uniform vec3 uSource;
uniform vec3 uDestination;
uniform float uOpacity;
uniform float uBehind;
varying vec2 vUv;

vec2 rotate(vec2 p, float angle) {
  float s = sin(angle), c = cos(angle);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

float circle(vec2 p, vec2 center, float radius) {
  return 1.0 - smoothstep(radius - 0.0025, radius + 0.0025, distance(p, center));
}

float moonAreas(vec2 p) {
  float mask = circle(p, vec2(0.1625, 0.1484), 0.046);
  mask = max(mask, circle(p, vec2(0.2516, 0.1430), 0.053));
  mask = max(mask, circle(p, vec2(0.3469, 0.1570), 0.056));
  mask = max(mask, circle(p, vec2(0.4492, 0.1797), 0.052));
  mask = max(mask, circle(p, vec2(0.5555, 0.2273), 0.056));
  mask = max(mask, circle(p, vec2(0.6734, 0.2984), 0.056));
  mask = max(mask, circle(p, vec2(0.7609, 0.4078), 0.055));
  mask = max(mask, circle(p, vec2(0.8148, 0.5078), 0.053));
  mask = max(mask, circle(p, vec2(0.8539, 0.6039), 0.048));
  return max(mask, circle(p, vec2(0.8766, 0.6977), 0.049));
}

float warmPaper(vec3 color) {
  return (1.0 - smoothstep(0.025, 0.14, color.b - color.r)) * smoothstep(0.045, 0.18, max(color.r, color.g));
}

float ellipse(vec2 p, vec2 center, vec2 radii) {
  return 1.0 - smoothstep(0.91, 1.02, length((p - center) / radii));
}

float statue(vec2 p) {
  float body = ellipse(p, vec2(0.50, 0.79), vec2(0.245, 0.30));
  vec2 left = rotate(p - vec2(0.365, 0.475), 0.29);
  vec2 right = rotate(p - vec2(0.65, 0.475), -0.28);
  float hands = max(ellipse(left, vec2(0.0), vec2(0.080, 0.155)), ellipse(right, vec2(0.0), vec2(0.083, 0.157)));
  float face = ellipse(p, vec2(0.491, 0.431), vec2(0.065, 0.078));
  return max(max(body, hands), face);
}

float haloDomain(vec2 p) {
  float radius = distance(p, vec2(0.491, 0.426));
  return smoothstep(0.065, 0.091, radius) * (1.0 - smoothstep(0.245, 0.29, radius))
    * (1.0 - smoothstep(0.51, 0.575, p.y)) * (1.0 - statue(p));
}

float random(float value) {
  return fract(sin(value * 127.1) * 43758.5453);
}

float tearInk(vec2 p) {
  float mask = ellipse(p, vec2(0.513, 0.498), vec2(0.009, 0.018));
  mask = max(mask, ellipse(p, vec2(0.532, 0.511), vec2(0.009, 0.018)));
  mask = max(mask, ellipse(p, vec2(0.513, 0.525), vec2(0.009, 0.018)));
  mask = max(mask, ellipse(p, vec2(0.534, 0.537), vec2(0.009, 0.018)));
  mask = max(mask, ellipse(p, vec2(0.513, 0.554), vec2(0.009, 0.018)));
  mask = max(mask, ellipse(p, vec2(0.532, 0.563), vec2(0.009, 0.018)));
  return max(mask, ellipse(p, vec2(0.514, 0.584), vec2(0.009, 0.018)));
}

vec3 bluePaper(vec2 p) {
  // Use the original's empty upper paper, preserving its coarse grain.
  vec2 tile = fract((p + vec2(0.073, 0.019)) / 0.07);
  return texture2D(uArtwork, vec2(0.43, 0.018) + tile * vec2(0.07, 0.065)).rgb;
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y);
  if (uPass > 0.5) {
    vec2 local = p * 2.0 - 1.0;
    vec3 moonInk = texture2D(uArtwork, uSource.xy + local * uSource.z).rgb;
    float alpha = (1.0 - smoothstep(0.91, 1.0, length(local))) * warmPaper(moonInk);
    vec2 location = uDestination.xy + local * uDestination.z;
    float protectFace = ellipse(location, vec2(0.49, 0.82), vec2(0.14, 0.13));
    alpha *= (1.0 - max(protectFace, statue(location) * uBehind));
    gl_FragColor = vec4(moonInk, alpha * uOpacity);
    return;
  }

  vec3 original = texture2D(uArtwork, p).rgb;
  vec3 paper = bluePaper(p);
  float oldMoons = moonAreas(p);
  vec3 color = mix(original, paper, oldMoons);

  // Remove only the old rays, then turn the native gold ink around a fixed center.
  float oldRays = haloDomain(p) * warmPaper(original) * (1.0 - oldMoons);
  color = mix(color, paper, oldRays);
  vec2 halo = p - vec2(0.491, 0.426);
  float haloRadius = length(halo);
  float haloAngle = atan(halo.y, abs(halo.x) < 0.000001 ? 0.000001 : halo.x) - uTime * 0.14;
  float spoke = (haloAngle + 3.14159265) / 6.2831853 * 138.0;
  float lineId = mod(floor(spoke), 138.0);
  float endRadius = 0.15 + random(lineId) * 0.08;
  float width = 0.11 + random(lineId + 11.0) * 0.12;
  float ray = 1.0 - smoothstep(width, width + 0.07, abs(fract(spoke) - 0.5));
  float tips = 1.0 - smoothstep(endRadius - 0.009, endRadius, haloRadius);
  float brokenInk = 0.65 + 0.35 * smoothstep(0.02, 0.13, paper.b);
  float dashes = 0.68 + 0.32 * smoothstep(0.10, 0.32, fract(haloRadius * 61.0 + random(lineId + 17.0)));
  float haloAlpha = haloDomain(p) * ray * tips * brokenInk * dashes * 0.78;
  color = mix(color, vec3(0.87, 0.82, 0.66), haloAlpha);

  // Continuous inward advection and rotation, bounded to the existing torso spiral.
  vec2 spiral = p - vec2(0.541, 0.557);
  float spiralRadius = length(spiral);
  float spiralMask = (1.0 - smoothstep(0.047, 0.105, spiralRadius)) * smoothstep(0.49, 0.518, p.y) * (1.0 - tearInk(p));
  float flowA = fract(uTime / 10.0);
  float flowB = fract(uTime / 10.0 + 0.5);
  vec2 sourceA = vec2(0.541, 0.557) + rotate(spiral, -uTime * 0.34) * (0.7 + flowA * 0.6);
  vec2 sourceB = vec2(0.541, 0.557) + rotate(spiral, -uTime * 0.34) * (0.7 + flowB * 0.6);
  float weightA = 0.5 - 0.5 * cos(flowA * 6.2831853);
  vec3 inkA = texture2D(uArtwork, sourceA).rgb;
  vec3 inkB = texture2D(uArtwork, sourceB).rgb;
  float alphaA = smoothstep(0.05, 0.20, inkA.r - inkA.b) * smoothstep(0.03, 0.13, inkA.g - inkA.b)
    * (1.0 - tearInk(sourceA)) * smoothstep(0.515, 0.532, sourceA.y);
  float alphaB = smoothstep(0.05, 0.20, inkB.r - inkB.b) * smoothstep(0.03, 0.13, inkB.g - inkB.b)
    * (1.0 - tearInk(sourceB)) * smoothstep(0.515, 0.532, sourceB.y);
  vec3 spiralInk = mix(mix(color, inkB, alphaB), mix(color, inkA, alphaA), weightA);
  color = mix(color, spiralInk, spiralMask * 0.78);
  gl_FragColor = vec4(color, 1.0);
}`,e.FRAGMENT_SHADER)}catch(n){throw e.deleteShader(t),n}if(this.program=e.createProgram(),!this.program)throw e.deleteShader(t),e.deleteShader(n),Error(`Cannot allocate a program`);if(e.attachShader(this.program,t),e.attachShader(this.program,n),e.linkProgram(this.program),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(this.program,e.LINK_STATUS))throw Error(`Cannot link the collage shader`);if(e.useProgram(this.program),this.buffer=e.createBuffer(),!this.buffer)throw Error(`Cannot allocate the image plane`);e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let r=e.getAttribLocation(this.program,`aPosition`);if(e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0),this.texture=e.createTexture(),!this.texture)throw Error(`Cannot allocate the artwork texture`);e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.artwork),e.uniform1i(e.getUniformLocation(this.program,`uArtwork`),0),this.timeUniform=e.getUniformLocation(this.program,`uTime`),this.rectUniform=e.getUniformLocation(this.program,`uRect`),this.passUniform=e.getUniformLocation(this.program,`uPass`),this.sourceUniform=e.getUniformLocation(this.program,`uSource`),this.destinationUniform=e.getUniformLocation(this.program,`uDestination`),this.opacityUniform=e.getUniformLocation(this.program,`uOpacity`),this.behindUniform=e.getUniformLocation(this.program,`uBehind`),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),this.needsResize=!0}schedule(){this.frame||this.disposed||this.lost||document.hidden||(this.frame=requestAnimationFrame(this.tick))}stop(){cancelAnimationFrame(this.frame),this.frame=0,this.lastClock=0}tick=t=>{if(this.frame=0,this.disposed||this.lost||document.hidden)return;if(!this.needsResize&&!this.reducedMotion&&t-this.lastPaint<1e3/30-.5){this.schedule();return}!this.reducedMotion&&this.lastClock&&(this.elapsed+=Math.max(0,t-this.lastClock)/1e3),this.lastClock=t;let n=this.gl;if(this.needsResize){let e=this.canvas.getBoundingClientRect();this.orbitWidth=Math.min(.34,Math.max(.17,window.innerWidth/Math.max(1,e.width)*.5-.052));let t=Math.min(window.devicePixelRatio||1,1.5,1280/Math.max(e.width,e.height,1)),r=Math.max(1,Math.round(e.width*t)),i=Math.max(1,Math.round(e.height*t));(this.canvas.width!==r||this.canvas.height!==i)&&(this.canvas.width=r,this.canvas.height=i),n.viewport(0,0,r,i),this.needsResize=!1}n.uniform1f(this.timeUniform,this.elapsed),n.uniform1f(this.passUniform,0),n.uniform4f(this.rectUniform,0,0,1,1),n.drawArrays(n.TRIANGLE_STRIP,0,4),n.uniform1f(this.passUniform,1);let r=e.map((e,t)=>{let n=this.elapsed*Math.PI/24+t*Math.PI/5-Math.PI*.95,r=Math.sin(n);return{source:e,depth:r,x:.5+Math.cos(n)*this.orbitWidth,y:.5+r*.37,radius:.031+(r+1)*.004}}).sort((e,t)=>e.depth-t.depth);for(let e of r)n.uniform3f(this.sourceUniform,e.source[0],e.source[1],e.source[2]),n.uniform3f(this.destinationUniform,e.x,e.y,e.radius),n.uniform4f(this.rectUniform,e.x*2-1,1-e.y*2,e.radius*2,e.radius*2),n.uniform1f(this.opacityUniform,.78+(e.depth+1)*.11),n.uniform1f(this.behindUniform,+(e.depth<0)),n.drawArrays(n.TRIANGLE_STRIP,0,4);this.lastPaint=t,this.ready||(this.ready=!0,this.onReady(!0)),this.reducedMotion||this.schedule()};setReducedMotion(e){this.reducedMotion!==e&&(this.reducedMotion=e,this.stop(),(!e||this.needsResize)&&this.schedule())}visibilityChanged=()=>{this.stop(),document.hidden||this.schedule()};contextLost=e=>{e.preventDefault(),this.lost=!0,this.ready=!1,this.stop(),this.onReady(!1)};contextRestored=()=>{if(!this.disposed){this.program=null,this.texture=null,this.buffer=null;try{this.initialize(),this.lost=!1,this.schedule()}catch{this.release(),this.onReady(!1)}}};release(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindTexture(this.gl.TEXTURE_2D,null),this.gl.useProgram(null),this.gl.deleteBuffer(this.buffer),this.gl.deleteTexture(this.texture),this.gl.deleteProgram(this.program),this.program=null,this.texture=null,this.buffer=null}dispose(){this.disposed=!0,this.stop(),this.observer.disconnect(),this.canvas.removeEventListener(`webglcontextlost`,this.contextLost),this.canvas.removeEventListener(`webglcontextrestored`,this.contextRestored),document.removeEventListener(`visibilitychange`,this.visibilityChanged),this.release()}};export{t as LunarFolioScene};