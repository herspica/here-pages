var e=[[.1625,.1484,.043],[.2516,.143,.05],[.3469,.157,.053],[.4492,.1797,.049],[.5555,.2273,.053],[.6734,.2984,.053],[.7609,.4078,.052],[.8148,.5078,.05],[.8539,.6039,.045],[.8766,.6977,.046]],t={x:.494397,y:.469132,major:.444438,minor:.243127,tilt:37.3711555*Math.PI/180};function n(){let e=document.createElement(`canvas`);e.width=e.height=1280;let t=e.getContext(`2d`);if(!t)throw Error(`Cannot create the figure matte`);t.fillStyle=`#000`,t.fillRect(0,0,1280,1280),t.fillStyle=`#fff`;for(let e of[`M353 720C337 675 346 618 368 557C380 520 398 486 416 460C430 442 451 446 458 467C468 492 457 514 454 535C478 544 501 565 521 596C544 628 550 666 568 706L556 753Z`,`M735 718C733 674 741 620 764 581C781 551 802 540 817 535C810 510 803 487 815 465C825 445 846 447 861 464C890 502 909 551 922 602C935 651 928 695 903 735Z`,`M570 565C569 541 578 521 600 510C624 498 646 503 666 514C682 524 693 539 697 551L723 558L724 576C719 591 704 596 689 591L680 611L665 615L658 637L647 654L629 664L615 653L605 628L589 616L585 600L573 592L565 580Z`,`M338 783C351 744 386 713 423 707L503 682L574 675L690 680L766 650L897 650C935 680 953 749 948 812L921 935L906 1033L950 1175L956 1280H320L321 1135L331 1060L380 1020L403 947L367 873L350 809Z`])t.fill(new Path2D(e));return e}var r=class{canvas;artwork;reducedMotion;onReady;gl;observer;program=null;texture=null;figureTexture=null;buffer=null;timeUniform=null;rectUniform=null;passUniform=null;sourceUniform=null;destinationUniform=null;opacityUniform=null;frame=0;elapsed=0;lastClock=0;lastPaint=0;needsResize=!0;disposed=!1;lost=!1;ready=!1;constructor(e,t,n,r){this.canvas=e,this.artwork=t,this.reducedMotion=n,this.onReady=r;let i=e.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!0,powerPreference:`low-power`});if(!i)throw Error(`WebGL is unavailable`);this.gl=i;try{this.initialize()}catch(e){throw this.release(),e}this.observer=new ResizeObserver(()=>{this.needsResize=!0,this.schedule()}),this.observer.observe(e),e.addEventListener(`webglcontextlost`,this.contextLost),e.addEventListener(`webglcontextrestored`,this.contextRestored),document.addEventListener(`visibilitychange`,this.visibilityChanged),this.schedule()}compile(e,t){let n=this.gl,r=n.createShader(t);if(!r)throw Error(`Cannot allocate a shader`);if(n.shaderSource(r,e),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS)){let e=n.getShaderInfoLog(r);throw n.deleteShader(r),Error(e??`Cannot compile the collage shader`)}return r}initialize(){let e=this.gl,t=this.compile(`
attribute vec2 aPosition;
uniform vec4 uRect;
uniform vec3 uDestination;
uniform float uPass;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vec2 size = uPass > 0.5 ? uDestination.zz * 2.0 : uRect.zw;
  vec2 center = uPass > 0.5 ? vec2(uDestination.x * 2.0 - 1.0, 1.0 - uDestination.y * 2.0) : uRect.xy;
  gl_Position = vec4(aPosition * size + center, 0.0, 1.0);
}`,e.VERTEX_SHADER),r;try{r=this.compile(`
precision highp float;
uniform sampler2D uArtwork;
uniform sampler2D uFigure;
uniform float uTime;
uniform float uPass;
uniform vec3 uSource;
uniform float uOpacity;
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

float figure(vec2 p) {
  return texture2D(uFigure, p).r;
}

float haloDomain(vec2 p) {
  float radius = distance(p, vec2(0.491, 0.426));
  return (1.0 - smoothstep(0.285, 0.31, radius)) * (1.0 - figure(p));
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
    gl_FragColor = vec4(moonInk, alpha * uOpacity);
    return;
  }

  vec3 original = texture2D(uArtwork, p).rgb;
  vec3 paper = bluePaper(p);
  float oldMoons = moonAreas(p);
  vec3 color = mix(original, paper, oldMoons);

  // Clear the entire old halo, including its core. Only the figure stays fixed.
  float oldRays = haloDomain(p) * warmPaper(original) * (1.0 - oldMoons);
  color = mix(color, paper, oldRays);
  vec2 halo = rotate(p - vec2(0.491, 0.426), -uTime * 0.14);
  float haloRadius = length(halo);
  float haloAngle = atan(halo.y, abs(halo.x) < 0.000001 ? 0.000001 : halo.x);
  // Reuse an unobstructed printed sector of the original halo around the full disk.
  // Rays, core, gaps, and grain all move with this one rotating coordinate system.
  float sector = fract((haloAngle + 3.14159265) / 1.04719755);
  float sourceAngle = -2.70526034 + sector * 1.04719755;
  vec2 haloSource = vec2(0.491, 0.426) + vec2(cos(sourceAngle), sin(sourceAngle)) * max(haloRadius, 0.045);
  vec3 haloInk = texture2D(uArtwork, haloSource).rgb;
  float sourceRibbon = 1.0 - smoothstep(0.014, 0.030, abs(haloSource.y - (0.218 + (haloSource.x - 0.30) * 0.18)));
  float haloAlpha = haloDomain(p) * warmPaper(haloInk) * (1.0 - moonAreas(haloSource))
    * (1.0 - figure(haloSource)) * (1.0 - sourceRibbon);
  color = mix(color, haloInk, haloAlpha);

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
}`,e.FRAGMENT_SHADER)}catch(n){throw e.deleteShader(t),n}if(this.program=e.createProgram(),!this.program)throw e.deleteShader(t),e.deleteShader(r),Error(`Cannot allocate a program`);if(e.attachShader(this.program,t),e.attachShader(this.program,r),e.linkProgram(this.program),e.deleteShader(t),e.deleteShader(r),!e.getProgramParameter(this.program,e.LINK_STATUS))throw Error(`Cannot link the collage shader`);if(e.useProgram(this.program),this.buffer=e.createBuffer(),!this.buffer)throw Error(`Cannot allocate the image plane`);e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let i=e.getAttribLocation(this.program,`aPosition`);if(e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0),this.texture=e.createTexture(),!this.texture)throw Error(`Cannot allocate the artwork texture`);if(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.artwork),e.uniform1i(e.getUniformLocation(this.program,`uArtwork`),0),this.figureTexture=e.createTexture(),!this.figureTexture)throw Error(`Cannot allocate the figure matte`);e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.figureTexture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,n()),e.uniform1i(e.getUniformLocation(this.program,`uFigure`),1),e.activeTexture(e.TEXTURE0),this.timeUniform=e.getUniformLocation(this.program,`uTime`),this.rectUniform=e.getUniformLocation(this.program,`uRect`),this.passUniform=e.getUniformLocation(this.program,`uPass`),this.sourceUniform=e.getUniformLocation(this.program,`uSource`),this.destinationUniform=e.getUniformLocation(this.program,`uDestination`),this.opacityUniform=e.getUniformLocation(this.program,`uOpacity`),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),this.needsResize=!0}schedule(){this.frame||this.disposed||this.lost||document.hidden||(this.frame=requestAnimationFrame(this.tick))}stop(){cancelAnimationFrame(this.frame),this.frame=0,this.lastClock=0}tick=n=>{if(this.frame=0,this.disposed||this.lost||document.hidden)return;if(!this.needsResize&&!this.reducedMotion&&n-this.lastPaint<1e3/30-.5){this.schedule();return}!this.reducedMotion&&this.lastClock&&(this.elapsed+=Math.max(0,n-this.lastClock)/1e3),this.lastClock=n;let r=this.gl;if(this.needsResize){let e=this.canvas.getBoundingClientRect(),t=Math.min(window.devicePixelRatio||1,1.5,1280/Math.max(e.width,e.height,1)),n=Math.max(1,Math.round(e.width*t)),i=Math.max(1,Math.round(e.height*t));(this.canvas.width!==n||this.canvas.height!==i)&&(this.canvas.width=n,this.canvas.height=i),r.viewport(0,0,n,i),this.needsResize=!1}r.uniform1f(this.timeUniform,this.elapsed),r.uniform1f(this.passUniform,0),r.uniform4f(this.rectUniform,0,0,1,1),r.drawArrays(r.TRIANGLE_STRIP,0,4),r.uniform1f(this.passUniform,1);for(let[n,i]of e.entries()){let e=this.elapsed*Math.PI/24+n*Math.PI/5-Math.PI*.95,a=Math.cos(e)*t.major,o=Math.sin(e)*t.minor,s=t.x+a*Math.cos(t.tilt)-o*Math.sin(t.tilt),c=t.y+a*Math.sin(t.tilt)+o*Math.cos(t.tilt);r.uniform3f(this.sourceUniform,i[0],i[1],i[2]),r.uniform3f(this.destinationUniform,s,c,.037),r.uniform1f(this.opacityUniform,1),r.drawArrays(r.TRIANGLE_STRIP,0,4)}this.lastPaint=n,this.ready||(this.ready=!0,this.onReady(!0)),this.reducedMotion||this.schedule()};setReducedMotion(e){this.reducedMotion!==e&&(this.reducedMotion=e,this.stop(),(!e||this.needsResize)&&this.schedule())}visibilityChanged=()=>{this.stop(),document.hidden||this.schedule()};contextLost=e=>{e.preventDefault(),this.lost=!0,this.ready=!1,this.stop(),this.onReady(!1)};contextRestored=()=>{if(!this.disposed){this.program=null,this.texture=null,this.figureTexture=null,this.buffer=null;try{this.initialize(),this.lost=!1,this.schedule()}catch{this.release(),this.onReady(!1)}}};release(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindTexture(this.gl.TEXTURE_2D,null),this.gl.useProgram(null),this.gl.deleteBuffer(this.buffer),this.gl.deleteTexture(this.texture),this.gl.deleteTexture(this.figureTexture),this.gl.deleteProgram(this.program),this.program=null,this.texture=null,this.figureTexture=null,this.buffer=null}dispose(){this.disposed=!0,this.stop(),this.observer.disconnect(),this.canvas.removeEventListener(`webglcontextlost`,this.contextLost),this.canvas.removeEventListener(`webglcontextrestored`,this.contextRestored),document.removeEventListener(`visibilitychange`,this.visibilityChanged),this.release()}};export{r as LunarFolioScene};