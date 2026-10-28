import{C as e,E as t,h as n,k as r,l as i,m as a,n as o,r as s,s as c,w as l,y as u}from"./gravityGeometry-D_z5nL-f.js";var d=`
varying vec2 vUv;
void main() { vUv=uv; gl_Position=vec4(position.xy,0.,1.); }
`,f=`
precision highp float;
uniform sampler2D uAtlas,uOptics;
uniform vec2 uResolution,uPointer,uPulse;
uniform float uTime,uZoom,uPulseAge,uMotion;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p) {
  vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
mat2 rotate(float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

vec3 stars(vec2 pixel,float scale,float threshold,float strength) {
  vec2 grid=pixel/scale,cell=floor(grid),local=fract(grid);
  float id=hash(cell),enabled=step(threshold,id);
  vec2 center=vec2(hash(cell+13.1),hash(cell+37.4))*.80+.10;
  vec2 d=(local-center)*scale;
  float radius=.45+hash(cell+61.)*.5;
  float light=exp(-dot(d,d)/(radius*radius));
  float bright=step(.989,id);
  light+=exp(-length(d)*1.1)*.10*bright;
  float twinkle=.80+.20*sin(uTime*(.23+id*.4)+id*60.);
  return mix(vec3(.58,.70,.92),vec3(.92,.91,.88),id)*light*enabled*strength*twinkle;
}

float equationInk(vec2 surface) {
  vec2 cell=floor(surface),local=fract(surface);
  float tile=floor(hash(cell+vec2(19.,7.))*48.);
  vec2 atlas=(vec2(mod(tile,4.),11.-floor(tile/4.))+local)/vec2(4.,12.);
  return textureGrad(uAtlas,atlas,dFdx(surface)/vec2(4.,12.),dFdy(surface)/vec2(4.,12.)).r;
}

vec4 opticalLayer(vec2 p,float t) {
  // The artwork's angle and shape come from the supplied reference. Its
  // shadow is opaque; alpha is deliberately never animated or translated.
  vec2 uv=p/5.55+vec2(.51,.49);
  vec4 base=texture2D(uOptics,uv);
  float brightness=max(base.r,max(base.g,base.b));
  float emission=smoothstep(.045,.62,brightness);
  vec2 disk=rotate(.76)*p;
  vec2 around=vec2(-p.y*.70,p.x);
  vec2 along=vec2(.73,.68)*(.6+.4*sin(disk.x*.8));
  float foreground=exp(-pow((disk.y+.30)*3.2,2.));
  vec2 velocity=mix(around,along,foreground)*.024;
  velocity+=vec2(sin(p.y*9.+t*.33),cos(p.x*8.-t*.27))*.0017;
  velocity*=emission;
  float phase=fract(t*.13),second=fract(t*.13+.5);
  float blend=abs(phase*2.-1.);
  vec3 first=texture2D(uOptics,uv-velocity*(phase-.5)).rgb;
  vec3 next=texture2D(uOptics,uv-velocity*(second-.5)).rgb;
  vec3 plasma=mix(first,next,blend);
  // Only luminous pixels advect. This protects the dark core and occlusion.
  vec3 color=mix(base.rgb,plasma,emission*.62);
  float passing=.92+.08*sin(disk.x*17.-t*1.9+noise(p*6.)*3.);
  color*=mix(1.,passing,emission);
  float edges=smoothstep(0.,.025,uv.x)*smoothstep(0.,.025,uv.y)
    *(1.-smoothstep(.975,1.,uv.x))*(1.-smoothstep(.975,1.,uv.y));
  float extent=1.-smoothstep(2.80,3.80,length(p));
  float opaqueCore=smoothstep(.9,.98,base.a)*(1.-smoothstep(.02,.10,brightness));
  float alpha=mix(base.a,1.,opaqueCore);
  float blueHaze=smoothstep(.025,.18,base.b-base.r);
  alpha*=mix(1.,.46,blueHaze);
  color*=mix(1.,.78,blueHaze);
  return vec4(color,alpha*edges*extent);
}

void main() {
  vec2 pixel=vUv*uResolution;
  float reference=min(uResolution.x*.123,uResolution.y*.086);
  vec2 center=vec2(uResolution.x*.355,uResolution.y*.495);
  center.x=mix(center.x,uResolution.x*.40,smoothstep(1.,1.8,uResolution.x/uResolution.y));
  vec2 p=(pixel-center)/reference/uZoom;
  p-=uPointer*vec2(.13,.08);
  vec2 rippleDelta=(vUv-uPulse)*vec2(uResolution.x/uResolution.y,1.);
  float wave=exp(-pow((length(rippleDelta)-uPulseAge*.32)*95.,2.))*exp(-uPulseAge*.9)*uMotion;
  p+=rippleDelta*wave*.06;
  float t=uTime;
  vec2 starPixel=p*reference+center+uPointer*4.;
  vec3 color=stars(starPixel,31.,.77,.65)+stars(starPixel+45.,103.,.76,1.15)+stars(starPixel-70.,187.,.86,1.6);

  // The white sheet narrows into the accretion throat. A local lens bends
  // its coordinates near the body; the optical shadow then occludes it.
  float bend=2.05*(1.-exp(-pow(abs(p.y+.12),1.65)*.24));
  float left=.02+bend+p.y*.035;
  float distanceToSheet=p.x-left;
  float sheet=smoothstep(-.04,.16,distanceToSheet);
  vec2 warped=p;
  float proximity=exp(-pow((length(p)-1.20)*2.2,2.));
  warped+=normalize(p+vec2(.001))*proximity*.095;
  float radial=max(.45,length(vec2(warped.x+.08,warped.y*.86)));
  float theta=atan(warped.y*.86,warped.x+.08);
  float swell=sin(theta*3.-t*.17)*.008*smoothstep(1.,4.,radial);
  vec2 surface=vec2(log(radial)*4.8+t*.075,theta*23.+swell);
  float ink=equationInk(surface);
  float fade=smoothstep(.85,1.8,radial);
  float white=.72+.45*smoothstep(1.,5.,radial);
  float shimmer=.94+.06*sin(log(radial)*7.+theta*8.+t*.46);
  color+=mix(vec3(.47,.61,.79),vec3(.91,.94,1.),fade)*ink*sheet*white*shimmer;

  // No ellipse outline and no straight beam across the dark body.
  float distanceFade=exp(-abs(p.y)*.74)*smoothstep(1.35,2.5,abs(p.y));
  float seam=exp(-abs(distanceToSheet+.10)*17.)*distanceFade;
  color+=vec3(.07,.17,.28)*seam;
  color+=vec3(.65,.46,.26)*wave*.08;
  color=vec3(1.)-exp(-color*1.12);

  vec4 optics=opticalLayer(p,t);
  color=mix(color,optics.rgb,optics.a);
  float vignette=1.-.12*pow(length((vUv-.5)*1.25),2.);
  gl_FragColor=vec4(color*vignette,1.);
}
`,p;function m(){return p??=new Promise((e,t)=>{let n=new Image;n.onload=()=>e(n),n.onerror=()=>{p=void 0,t(Error(`Unable to load black-hole optics`))},n.src=`/here-pages/assets/event-horizon-optics.png`}),p}var h=class{canvas;input;renderer;scene=new e;camera=new i;atlas;optics;geometry=new u(2,2);material;uniforms={uResolution:{value:new r(1,1)},uPointer:{value:new r},uPulse:{value:new r(-10,-10)},uTime:{value:0},uZoom:{value:1},uPulseAge:{value:100},uMotion:{value:1},uAtlas:{value:null},uOptics:{value:null}};pointer=new r;zoom=1;observer;frame=0;last=0;drawn=0;width=0;height=0;ratio=0;dirty=!0;reduced=!1;disposed=!1;lost=!1;down=null;constructor(e,r,i,a){this.canvas=e,this.input=r,this.renderer=new c({canvas:e,antialias:!1,alpha:!1,preserveDrawingBuffer:!0,powerPreference:`high-performance`}),this.atlas=o(i,e.clientWidth<700),this.atlas.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()),this.uniforms.uAtlas.value=this.atlas,this.optics=new t(a),this.optics.colorSpace=``,this.optics.needsUpdate=!0,this.uniforms.uOptics.value=this.optics,this.material=new l({uniforms:this.uniforms,vertexShader:d,fragmentShader:f,depthTest:!1,depthWrite:!1,toneMapped:!1}),this.scene.add(new n(this.geometry,this.material)),e.dataset.scene=`event-horizon-continuous-sheet`,e.dataset.renderer=`layered-optics-webgl`,e.dataset.optics=`advected-plasma-opaque-shadow`,e.dataset.bufferPreserved=`true`,this.observer=new ResizeObserver(()=>{this.dirty=!0,this.schedule()}),this.observer.observe(e),document.addEventListener(`visibilitychange`,this.onVisibility),r.addEventListener(`pointermove`,this.onMove),r.addEventListener(`pointerdown`,this.onDown),r.addEventListener(`pointerup`,this.onUp),r.addEventListener(`pointercancel`,this.onCancel),r.addEventListener(`lostpointercapture`,this.onCancel),r.addEventListener(`pointerleave`,this.onLeave),r.addEventListener(`wheel`,this.onWheel,{passive:!1}),r.addEventListener(`keydown`,this.onKey),r.addEventListener(`dblclick`,this.reset),e.addEventListener(`webglcontextlost`,this.onLost),e.addEventListener(`webglcontextrestored`,this.onRestored),this.schedule()}setReducedMotion(e){this.reduced=e,this.uniforms.uMotion.value=+!e,this.uniforms.uPulseAge.value=100,this.canvas.dataset.motion=e?`paused`:`flowing`,this.last=0,this.dirty=!0,this.schedule()}schedule=()=>{this.frame||this.disposed||this.lost||document.hidden||(this.frame=requestAnimationFrame(this.tick))};tick=e=>{if(this.frame=0,this.disposed||this.lost||document.hidden)return;let t=this.last?(e-this.last)/1e3:0;if(this.last=e,this.reduced||(this.uniforms.uTime.value+=t,this.uniforms.uPulseAge.value+=t),this.dirty||e-this.drawn>=1e3/30-.5){let t=this.canvas.getBoundingClientRect(),n=Math.round(t.width),r=Math.round(t.height),i=Math.min(devicePixelRatio||1,2,Math.sqrt(24e5/Math.max(1,n*r)));n&&r&&(n!==this.width||r!==this.height||i!==this.ratio)&&(this.width=n,this.height=r,this.ratio=i,this.renderer.setDrawingBufferSize(n,r,i),this.uniforms.uResolution.value.set(n,r)),this.uniforms.uPointer.value.lerp(this.pointer,this.reduced?1:.09),this.uniforms.uZoom.value=a.lerp(this.uniforms.uZoom.value,this.zoom,this.reduced?1:.12),this.renderer.render(this.scene,this.camera),this.canvas.dataset.time=this.uniforms.uTime.value.toFixed(2),this.canvas.dataset.context=`ready`,this.drawn=e,this.dirty=!1}this.reduced||this.schedule()};onVisibility=()=>{document.hidden?(cancelAnimationFrame(this.frame),this.frame=0,this.last=0):(this.dirty=!0,this.schedule())};onMove=e=>{if(this.reduced&&!this.down)return;let t=this.input.getBoundingClientRect();this.pointer.set((e.clientX-t.left)/t.width*2-1,1-(e.clientY-t.top)/t.height*2),this.dirty=!0,this.schedule()};onDown=e=>{this.down||(this.down={x:e.clientX,y:e.clientY,id:e.pointerId},this.input.setPointerCapture(e.pointerId),this.input.dataset.dragging=`true`,this.input.dataset.pointer=`true`)};onUp=e=>{if(this.down&&this.down.id===e.pointerId){if(!this.reduced&&Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)<7){let t=this.input.getBoundingClientRect();this.uniforms.uPulse.value.set((e.clientX-t.left)/t.width,1-(e.clientY-t.top)/t.height),this.uniforms.uPulseAge.value=0,this.dirty=!0,this.schedule()}this.onCancel(),this.input.hasPointerCapture(e.pointerId)&&this.input.releasePointerCapture(e.pointerId)}};onCancel=()=>{this.down=null,this.input.dataset.dragging=`false`};onLeave=()=>{!this.down&&!this.reduced&&(this.pointer.set(0,0),this.dirty=!0,this.schedule())};onWheel=e=>{e.preventDefault(),this.zoom=a.clamp(this.zoom*Math.exp(-e.deltaY*5e-4),.75,1.4),this.dirty=!0,this.schedule()};onKey=e=>{let t={ArrowLeft:[-.3,0],ArrowRight:[.3,0],ArrowUp:[0,.3],ArrowDown:[0,-.3]};if(t[e.key])this.pointer.add(new r(...t[e.key])).clampScalar(-2,2);else if(e.key===`+`||e.key===`=`)this.zoom=Math.min(1.4,this.zoom+.08);else if(e.key===`-`)this.zoom=Math.max(.75,this.zoom-.08);else if(e.key.toLowerCase()===`r`||e.key===`Home`)this.reset();else return;e.preventDefault(),this.input.dataset.pointer=`false`,this.dirty=!0,this.schedule()};reset=()=>{this.pointer.set(0,0),this.zoom=1,this.dirty=!0,this.schedule()};onLost=e=>{e.preventDefault(),this.lost=!0,cancelAnimationFrame(this.frame),this.frame=0,this.last=0,this.canvas.dataset.context=`lost`};onRestored=()=>{this.lost=!1,this.ratio=0,this.atlas.needsUpdate=!0,this.optics.needsUpdate=!0,this.dirty=!0,this.schedule()};dispose(){this.disposed=!0,cancelAnimationFrame(this.frame),this.observer.disconnect(),document.removeEventListener(`visibilitychange`,this.onVisibility),this.input.removeEventListener(`pointermove`,this.onMove),this.input.removeEventListener(`pointerdown`,this.onDown),this.input.removeEventListener(`pointerup`,this.onUp),this.input.removeEventListener(`pointercancel`,this.onCancel),this.input.removeEventListener(`lostpointercapture`,this.onCancel),this.input.removeEventListener(`pointerleave`,this.onLeave),this.input.removeEventListener(`wheel`,this.onWheel),this.input.removeEventListener(`keydown`,this.onKey),this.input.removeEventListener(`dblclick`,this.reset),this.canvas.removeEventListener(`webglcontextlost`,this.onLost),this.canvas.removeEventListener(`webglcontextrestored`,this.onRestored),this.geometry.dispose(),this.material.dispose(),this.atlas.dispose(),this.optics.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss()}};export{h as EventHorizonScene,s as prepareFormulaArtwork,m as prepareOpticalArtwork};