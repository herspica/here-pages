import{t as e}from"./index-BGDkI00S.js";import{A as t,C as n,D as r,O as i,T as a,_ as o,a as s,b as c,c as l,d as u,f as d,g as f,h as p,i as m,j as h,k as g,m as _,n as v,o as y,p as b,r as x,s as S,t as C,u as w,v as T,w as E,x as D,y as O}from"./gravityGeometry-D_z5nL-f.js";var k={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},A=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},j=new o(-1,1,1,-1,0,1),M=new class extends l{constructor(){super(),this.setAttribute(`position`,new d([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new d([0,2,0,0,2,0],2))}},N=class{constructor(e){this._mesh=new p(M,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,j)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},P=class extends A{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof E?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=i.clone(e.uniforms),this.material=new E({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new N(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},F=class extends A{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},I=class extends A{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},L=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new g);this._width=n.width,this._height=n.height,t=new h(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:b}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new P(k),this.copyPass.material.blending=0,this.timer=new r}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}F!==void 0&&(r instanceof F?n=!0:r instanceof I&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new g);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},R=class extends A{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new w}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},z={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new w(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},B=class e extends A{constructor(e,n=1,r,a){super(),this.strength=n,this.radius=r,this.threshold=a,this.resolution=e===void 0?new g(256,256):new g(e.x,e.y),this.clearColor=new w(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new h(o,s,{type:b,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new h(o,s,{type:b,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new h(o,s,{type:b,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),o=Math.round(o/2),s=Math.round(s/2)}let c=z;this.highPassUniforms=i.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new E({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new g(1/o,1/s),o=Math.round(o/2),s=Math.round(s/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1;let u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new t(1,1,1),new t(1,1,1),new t(1,1,1),new t(1,1,1),new t(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=i.clone(k.uniforms),this.blendMaterial=new E({uniforms:this.copyUniforms,vertexShader:k.vertexShader,fragmentShader:k.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new w,this._oldClearAlpha=1,this._basic=new f,this._fsQuad=new N(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new g(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new E({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new g(.5,.5)},direction:{value:new g(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new E({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};B.BlurDirectionX=new g(1,0),B.BlurDirectionY=new g(0,1);var V={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},H=class extends A{constructor(){super(),this.isOutputPass=!0,this.uniforms=i.clone(V.uniforms),this.material=new D({name:V.name,uniforms:this.uniforms,vertexShader:V.vertexShader,fragmentShader:V.fragmentShader}),this._fsQuad=new N(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},u.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},U=`
varying vec2 vScreen;
void main() { vScreen=position.xy; gl_Position=vec4(position.xy,1.,1.); }
`,W=`
uniform vec2 uPointer,uPulseOrigin;
uniform float uAspect,uHoverAmount,uPulseAge,uInteraction;
`,G=`
float hoverLight(vec2 screen) {
  vec2 delta=(screen-uPointer)*vec2(uAspect,1.);
  return exp(-dot(delta,delta)*22.)*uHoverAmount*uInteraction;
}
float clickWave(vec2 screen) {
  float distance=length((screen-uPulseOrigin)*vec2(uAspect,1.));
  float ring=(distance-uPulseAge*1.05)*25.;
  return exp(-ring*ring)*exp(-uPulseAge*1.5)*uInteraction;
}
float clickFlash(vec2 screen) {
  vec2 delta=(screen-uPulseOrigin)*vec2(uAspect,1.);
  return exp(-dot(delta,delta)*55.)*exp(-uPulseAge*5.)*uInteraction;
}
`,K=`
${W}
${G}
uniform sampler2D uAtlas;
uniform vec3 uEye,uRight,uUp,uForward;
uniform float uTime,uTanFov,uHeight;
varying vec2 vScreen;

float inkAt(vec2 uv,float angularScale,float radialScale,vec3 p) {
  float pixelWorld=2.*distance(uEye,p)*uTanFov/uHeight;
  float density=max(ATLAS_WIDTH*angularScale/(6.283185*max(1.,length(p.xz))),ATLAS_WIDTH*.75*radialScale);
  float lod=clamp(log2(max(1.,density*pixelWorld))-.35,0.,12.);
  return textureLod(uAtlas,fract(uv),lod).r;
}

vec3 accretion(vec3 p) {
  float radius=length(p.xz);
  float angle=atan(p.z,p.x)-uTime*.16-1.08*log(max(1.,radius));
  float inward=radius+uTime*.13;
  float warp=.045*sin(angle*3.+radius*.4);
  float heat=exp(-max(0.,radius-1.85)*1.35);
  float mantle=exp(-max(0.,radius-2.2)*.36);
  float large=inkAt(vec2(angle/6.283185*2.6,(inward*.31+warp)/3.2),2.6,.31/3.2,p);
  float fine=inkAt(vec2(angle/6.283185*7.5+.21,(inward*.94+warp)/3.2+.31),7.5,.94/3.2,p);
  float micro=inkAt(vec2(angle/6.283185*25.+.63,(inward*2.8+warp)/3.2+.72),25.,2.8/3.2,p);
  float average=textureLod(uAtlas,vec2(.5),12.).r;
  float light=large*(.025+heat*1.9)+fine*(.012+heat*2.3+mantle*.08)+micro*(.02+heat*1.8)*(1.-smoothstep(5.,11.,radius));
  light+=average*(heat*11.5+mantle*.25);
  float sideView=1.+2.5*(1.-smoothstep(.07,.24,abs(uEye.y)/length(uEye)))*(1.-smoothstep(4.,8.,radius));
  float edge=smoothstep(1.27,1.58,radius)*(1.-smoothstep(6.,11.,radius));
  float modulation=.8+.2*cos(angle*3.+inward*.4);
  vec3 color=mix(vec3(1.,.68,.32),vec3(1.,.93,.76),pow(heat,2.));
  return color*light*sideView*edge*modulation;
}

vec3 bend(vec3 p,float momentum) {
  float r2=dot(p,p);
  return -1.16*momentum*p/max(.00001,r2*r2*sqrt(r2));
}

void main() {
  float wave=clickWave(vScreen),flash=clickFlash(vScreen),hover=hoverLight(vScreen);
  vec2 rippleDirection=normalize(vScreen-uPulseOrigin+vec2(.0001));
  vec2 screen=vScreen+rippleDirection*wave*.006;
  vec3 direction=normalize(uForward+uRight*(screen.x*uAspect*uTanFov)+uUp*(screen.y*uTanFov));
  float along=dot(uEye,direction);
  float impact2=max(0.,dot(uEye,uEye)-along*along);
  if(along>0.||impact2>900.) { gl_FragColor=vec4(0.); return; }
  float sphereRoot=1.92*1.92-impact2;
  float sphereT=-along-sqrt(max(0.,sphereRoot));
  bool body=sphereRoot>0.&&sphereT>0.;
  vec3 point=uEye+direction*max(0.,-along-sqrt(max(0.,900.-impact2)));
  vec3 velocity=direction;
  vec3 angular=cross(point,velocity);
  float momentum=dot(angular,angular);
  vec3 light=vec3(0.);
  float coverage=0.,capture=0.;
  for(int stepIndex=0;stepIndex<TRACE_STEPS;stepIndex++) {
    float radius=length(point);
    if(radius<.79) { capture=1.; break; }
    if(radius>30.1&&dot(point,velocity)>0.) break;
    float dt=clamp(radius*.08,.04,1.8);
    vec3 acceleration=bend(point,momentum);
    vec3 next=point+velocity*dt+acceleration*(dt*dt*.5);
    vec3 nextVelocity=velocity+(acceleration+bend(next,momentum))*(dt*.5);
    if(point.y*next.y<0.) {
      vec3 crossing=mix(point,next,point.y/(point.y-next.y));
      float projectedDistance=dot(crossing-uEye,direction);
      bool inFront=!body||projectedDistance<sphereT;
      if(inFront) {
        vec3 emission=accretion(crossing);
        light+=emission*(1.-coverage);
        float opacity=clamp(max(emission.r,max(emission.g,emission.b))*.5,0.,.94);
        coverage+=(1.-coverage)*opacity;
      }
    }
    point=next; velocity=nextVelocity;
  }
  if(body) {
    vec3 normal=normalize(uEye+direction*sphereT);
    float rim=pow(1.-max(0.,dot(normal,-direction)),3.);
    light+=vec3(.003,.0025,.0018)*rim*(1.-coverage);
  }
  light*=1.+hover*.85+wave*2.2+flash*2.;
  float event=(wave*.018+flash*.08)*(body?.03:1.);
  light+=vec3(1.,.84,.52)*event;
  light/=1.+max(light.r,max(light.g,light.b))/4.;
  gl_FragColor=vec4(light,max(event,max(coverage,max(capture,body?1.:0.))));
}
`,q=`
${W}
${G}
uniform float uTime,uLayer;
attribute vec2 aFlow;
attribute float aRibbon;
attribute vec3 aCenter,aTangent,aSide;
varying vec2 vUv,vFlow;
varying float vRibbon;
varying vec3 vWorld;
varying float vDepth;
varying vec4 vClip;
void main() {
  vUv=uv; vFlow=aFlow; vRibbon=aRibbon;
  // Move an entire cross-section together, so the connected surface and its
  // equations sway and twist as one ribbon. The accretion roots stay anchored.
  float anchored=smoothstep(.015,.18,uv.x);
  float phase=uLayer*1.31;
  float wave=sin(aFlow.x*.26-uTime*.92+phase);
  float swell=sin(aFlow.x*.14-uTime*.57+phase*.7);
  vec3 binormal=normalize(cross(aTangent,aSide));
  float amplitude=anchored*(.16+min(length(aCenter),22.)*.045);
  vec3 center=aCenter+binormal*(wave*amplitude)+aSide*(swell*amplitude*.38);
  float twist=anchored*.62*sin(aFlow.x*.19-uTime*.72+phase);
  vec3 offset=position-aCenter;
  vec3 p=center+offset*cos(twist)+cross(aTangent,offset)*sin(twist);
  vec4 initial=projectionMatrix*modelViewMatrix*vec4(p,1.);
  vec2 screen=initial.xy/max(.1,initial.w);
  float response=clickWave(screen)*.48+clickFlash(screen)*.12;
  response+=hoverLight(screen)*.045*sin(uTime*2.1+screen.x*3.);
  p+=normal*response*smoothstep(2.,4.,length(p))*smoothstep(2.,6.,-(modelViewMatrix*vec4(p,1.)).z);
  vec4 world=modelMatrix*vec4(p,1.);
  vec4 view=viewMatrix*world;
  vWorld=world.xyz; vDepth=-view.z;
  vClip=projectionMatrix*view;
  gl_Position=vClip;
}
`,J=`
${W}
${G}
uniform sampler2D uAtlas;
uniform float uTime,uLayer,uVisibility,uGuide,uCrosswise,uDensity;
varying vec2 vUv,vFlow;
varying float vRibbon;
varying vec3 vWorld;
varying float vDepth;
varying vec4 vClip;
void main() {
  // Every glyph, filament and highlight lives on the same ribbon coordinates.
  // There are no camera-facing symbol sprites or independently moving tiles.
  vec2 flow=vec2(vFlow.x+uTime*.65,vFlow.y);
  vec2 lettering=vec2(vRibbon*.25*uDensity+uTime*.035+uLayer*.25,(vUv.y*uDensity+mod(uLayer,3.))/3.);
  // The foreground ribbon reads across its width, with complete equations
  // stacked along the curve. Its glyphs still inherit the surface perspective.
  if(uCrosswise>.5) lettering=vec2(vUv.y*.25*uDensity+mod(uLayer,4.)*.25,-vRibbon/3.*uDensity-uTime*.013+uLayer*.173);
  float text=smoothstep(.07,.80,texture2D(uAtlas,lettering).r);
  float fine=texture2D(uAtlas,flow*vec2(.32,.4266667)+vec2(.21,.37)).r;
  // Degenerate derivatives and dot-product rounding must not feed NaN into
  // the HDR bloom chain (pow of a negative base is undefined in GLSL).
  vec3 surfaceNormal=cross(dFdx(vWorld),dFdy(vWorld));
  vec3 normal=surfaceNormal*inversesqrt(max(dot(surfaceNormal,surfaceNormal),1.e-12));
  vec3 eyeDelta=cameraPosition-vWorld;
  vec3 toEye=eyeDelta*inversesqrt(max(dot(eyeDelta,eyeDelta),1.e-12));
  float grazing=pow(clamp(1.-abs(dot(normal,toEye)),0.,1.),2.5);
  float distanceToCore=length(vWorld);
  float coreLight=exp(-distanceToCore*.05);
  float accent=.72+.28*cos(vFlow.y*.8+uLayer*2.);
  float transition=smoothstep(2.5,7.,distanceToCore);
  float energy=text*(.25+transition*.90)*accent+fine*(1.-transition)*.18;
  float edge=min(vUv.y,1.-vUv.y);
  float feather=smoothstep(0.,.018,edge);
  float rail=exp(-edge*180.);
  float filament=pow(.5+.5*cos(vFlow.y*78.+sin(vFlow.x*.23)*.6),26.);
  float lightFlow=pow(.5+.5*sin(vFlow.x*.42+uTime*1.6+uLayer*2.),4.);
  energy=energy*feather*(.86+lightFlow*.32)+(filament*.024+rail*.016)*(.6+lightFlow)*coreLight;
  float guide=.025+rail*.20+filament*.065;
  energy=mix(energy,guide,uGuide);
  float nearFade=smoothstep(3.,7.,vDepth);
  float depthFade=1.-smoothstep(18.,65.,vDepth)*.55;
  float entrance=smoothstep(1.9,3.4,distanceToCore);
  float endFade=1.-smoothstep(.92,1.,vUv.x);
  vec2 screen=vClip.xy/vClip.w;
  float response=hoverLight(screen)*1.2+clickWave(screen)*3.+clickFlash(screen)*2.5;
  vec3 gold=mix(vec3(.68,.48,.22),vec3(${e.ribbonHighlight.join(`,`)}),grazing*.45+coreLight*.2);
  gold=mix(gold,vec3(1.,.95,.80),clamp(response*.2,0.,.65));
  vec3 color=gold*energy*uVisibility*nearFade*depthFade*entrance*endFade*(1.25+response);
  gl_FragColor=vec4(color,1.);
}
`,Y=class{canvas;input;renderer;scene=new n;rayScene=new n;rayTarget=new h(1,1,{type:b,depthBuffer:!1});camera=new T(46,1,.15,220);composer;presentationQuad;presentationMaterial;hasCompletedFrame=!1;sceneFrames=0;presentations=0;atlas;rayMaterial;time={value:0};pixel={value:1};right={value:new t};up={value:new t};forward={value:new t};eye={value:new t};pointer=new g;parallax=new g;interaction={uPointer:{value:new g},uPulseOrigin:{value:new g},uAspect:{value:1},uHoverAmount:{value:0},uPulseAge:{value:100},uInteraction:{value:1}};baseEye=new t(-8.8,3.65,15.85);target=new t(-.17,-.5,-.09);orbit=new t(Math.atan2(-8.8,15.85),Math.asin(3.65/this.baseEye.length()),this.baseEye.length());view=this.orbit.clone();touches=new Map;down=new g;dragged=!1;pulseCount=0;observer;frame=0;lastTick=0;lastDraw=0;reduced=!1;disposed=!1;lost=!1;width=0;height=0;ratio=1;quality=1;resizePending=!0;lensResizePending=!0;redrawPending=!0;forceResize=!1;bufferResizes=0;compact;statsStart=0;statsFrames=0;submitTime=0;constructor(e,t,n){this.canvas=e,this.input=n,this.compact=e.clientWidth<700,this.renderer=new S({canvas:e,antialias:!1,alpha:!1,preserveDrawingBuffer:!0,powerPreference:`high-performance`}),this.renderer.setClearColor(0,1),this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.02,this.renderer.info.autoReset=!1,this.atlas=v(t,this.compact),this.atlas.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()),this.composer=new L(this.renderer),this.composer.renderToScreen=!1,this.composer.addPass(new R(this.scene,this.camera)),this.composer.addPass(new B(new g(512,512),.18,.35,1.15));let r=new H;r.material.depthTest=r.material.depthWrite=!1,this.composer.addPass(r),this.presentationMaterial=new E({uniforms:{uCompletedFrame:{value:null}},vertexShader:U,fragmentShader:`uniform sampler2D uCompletedFrame; varying vec2 vScreen; void main(){ gl_FragColor=vec4(texture2D(uCompletedFrame,vScreen*.5+.5).rgb,1.); }`,depthTest:!1,depthWrite:!1,toneMapped:!1,blending:0}),this.presentationQuad=new N(this.presentationMaterial);let i=new p(new a(1.92,64,48),new f({colorWrite:!1,depthWrite:!0}));this.scene.add(i),this.rayMaterial=new E({vertexShader:U,fragmentShader:K,defines:{TRACE_STEPS:this.compact?112:144,ATLAS_WIDTH:this.atlas.image.width.toFixed(1)},uniforms:{...this.interaction,uAtlas:{value:this.atlas},uTime:this.time,uEye:this.eye,uRight:this.right,uUp:this.up,uForward:this.forward,uTanFov:{value:.5},uHeight:{value:800}},depthTest:!1,depthWrite:!1,blending:0});let o=new p(new O(2,2),this.rayMaterial);o.frustumCulled=!1,this.rayScene.add(o);let c=new p(new O(2,2),new E({vertexShader:U,fragmentShader:`uniform sampler2D uLensImage; varying vec2 vScreen; void main(){ gl_FragColor=texture2D(uLensImage,vScreen*.5+.5); }`,uniforms:{uLensImage:{value:this.rayTarget.texture}},transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:201,blendDst:205}));c.frustumCulled=!1,c.renderOrder=-5,this.scene.add(c);for(let e=0;e<y;e++){let t=new E({vertexShader:q,fragmentShader:J,uniforms:{...this.interaction,uAtlas:{value:this.atlas},uTime:this.time,uLayer:{value:e},uVisibility:{value:s[e].visibility},uCrosswise:{value:+!!s[e].crosswise},uDensity:{value:s[e].density},uGuide:{value:0}},transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,blending:2}),n=new p(C(e,this.compact),t);n.frustumCulled=!1,n.renderOrder=1,this.scene.add(n)}this.buildStars(),e.dataset.renderer=`equation-light-raytracing`,e.dataset.scene=`immersive-formula-ribbons-v7`,e.dataset.formulaLayout=`twenty-wide-twisted-ribbons`,e.dataset.ribbonCount=String(y),e.dataset.symbolBillboards=`0`,e.dataset.ribbonGuide=`false`,e.dataset.presentation=`retained-frame-v2`,e.dataset.bufferPreserved=String(this.renderer.getContextAttributes().preserveDrawingBuffer),e.dataset.context=`ready`,this.observer=new ResizeObserver(()=>{this.resizePending=!0,this.requestDraw()}),this.observer.observe(e),document.addEventListener(`visibilitychange`,this.onVisibility),n.addEventListener(`pointerdown`,this.onPointerDown),n.addEventListener(`pointermove`,this.onPointerMove),n.addEventListener(`pointerup`,this.onPointerUp),n.addEventListener(`pointercancel`,this.onPointerCancel),n.addEventListener(`lostpointercapture`,this.onPointerCancel),n.addEventListener(`pointerleave`,this.onPointerLeave),n.addEventListener(`wheel`,this.onWheel,{passive:!1}),n.addEventListener(`keydown`,this.onKeyDown),n.addEventListener(`dblclick`,this.resetView),n.addEventListener(`blur`,this.onBlur),e.addEventListener(`webglcontextlost`,this.onContextLost),e.addEventListener(`webglcontextrestored`,this.onContextRestored),this.schedule()}buildStars(){let e=m(27385),t=[],n=[],r=[],i=[];for(let a=0;a<8200;a++){let a=e()*Math.PI*2,o=e()*2-1,s=70+e()*90,c=Math.sqrt(1-o*o);t.push(Math.cos(a)*c*s,o*s,Math.sin(a)*c*s);let l=e();n.push(l>.991?4+e()*5:.4+e()*1.3);let u=e()>.3;r.push(u?1:.65,u?.85:.8,u?.61:1),i.push(e()*6.28)}let a=new l;a.setAttribute(`position`,new d(t,3)),a.setAttribute(`aSize`,new d(n,1)),a.setAttribute(`aColor`,new d(r,3)),a.setAttribute(`aPhase`,new d(i,1));let o=new E({uniforms:{uTime:this.time,uPixelRatio:this.pixel},vertexShader:`
        uniform float uTime,uPixelRatio;
        attribute float aSize,aPhase;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vHero;
        void main(){
          vColor=aColor*(.74+.08*sin(uTime*.17+aPhase)); vHero=step(4.,aSize);
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
          gl_PointSize=max(.8,aSize*uPixelRatio);
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vHero;
        void main(){
          vec2 p=gl_PointCoord-.5;
          float d=dot(p,p);
          float core=exp(-d*42.), halo=exp(-d*12.)*.13;
          float rays=(exp(-abs(p.x)*70.)+exp(-abs(p.y)*70.))*exp(-d*12.)*.055*vHero;
          gl_FragColor=vec4(vColor*(core+halo+rays),1.);
        }
      `,transparent:!0,depthTest:!1,depthWrite:!1,blending:2}),s=new c(a,o);s.frustumCulled=!1,s.renderOrder=-10,this.scene.add(s)}resize(){let e=this.canvas.getBoundingClientRect(),t=Math.round(e.width),n=Math.round(e.height);if(!t||!n||this.disposed)return;let r=Math.min(window.devicePixelRatio||1,2,Math.sqrt(3e6/(t*n)));if(!this.forceResize&&t===this.width&&n===this.height&&r===this.ratio)return;let i=r!==this.ratio;this.width=t,this.height=n,this.ratio=r,this.forceResize=!1,this.pixel.value=this.ratio,this.renderer.setDrawingBufferSize(this.width,this.height,this.ratio),i&&this.composer.setPixelRatio(this.ratio),this.composer.setSize(this.width,this.height),this.lensResizePending=!0;let a=Math.min(this.width*.175,this.height*.135,145);this.camera.aspect=this.width/this.height,this.camera.fov=_.radToDeg(2*Math.atan(this.height*1.96/(2*a*this.baseEye.length()))),this.camera.updateProjectionMatrix(),this.interaction.uAspect.value=this.camera.aspect,this.rayMaterial.uniforms.uTanFov.value=Math.tan(_.degToRad(this.camera.fov*.5)),this.canvas.dataset.resolution=`${this.canvas.width}×${this.canvas.height}`,this.canvas.dataset.bufferResizes=String(++this.bufferResizes)}resizeLens(){let e=Math.min(this.ratio,Math.sqrt(85e4/(this.width*this.height)))*this.quality;this.rayTarget.setSize(Math.max(1,Math.round(this.width*e)),Math.max(1,Math.round(this.height*e))),this.rayMaterial.uniforms.uHeight.value=this.rayTarget.height,this.canvas.dataset.lensResolution=`${this.rayTarget.width}×${this.rayTarget.height}`,this.lensResizePending=!1}updateCamera(){this.parallax.lerp(this.pointer,this.reduced?0:.04),this.view.lerp(this.orbit,this.reduced?1:.18);let[e,t,n]=this.view.toArray();this.camera.position.set(Math.sin(e)*Math.cos(t)*n,Math.sin(t)*n,Math.cos(e)*Math.cos(t)*n),this.camera.position.x+=this.parallax.x*.2,this.camera.position.y+=this.parallax.y*.13;let r=this.target.clone().sub(this.camera.position).normalize();this.camera.up.set(0,1,0).applyAxisAngle(r,.4),this.camera.lookAt(this.target),this.camera.updateMatrixWorld(),this.eye.value.copy(this.camera.position),this.right.value.setFromMatrixColumn(this.camera.matrixWorld,0),this.up.value.setFromMatrixColumn(this.camera.matrixWorld,1),this.camera.getWorldDirection(this.forward.value),this.canvas.dataset.camera=`${e.toFixed(3)},${t.toFixed(3)},${n.toFixed(2)}`,this.canvas.dataset.flowTime=this.time.value.toFixed(2)}render(){if(this.lost||!this.width||!this.height||this.disposed)return;this.lensResizePending&&this.resizeLens();let e=performance.now();if(this.updateCamera(),this.renderer.info.reset(),this.renderer.setRenderTarget(this.rayTarget),this.renderer.setClearColor(0,0),this.renderer.clear(),this.renderer.render(this.rayScene,this.camera),this.renderer.setRenderTarget(null),this.renderer.setClearColor(0,1),this.composer.render(),this.presentationMaterial.uniforms.uCompletedFrame.value=this.composer.readBuffer.texture,this.hasCompletedFrame=!0,this.canvas.dataset.sceneFrames=String(++this.sceneFrames),this.reduced)return;this.submitTime+=performance.now()-e,this.statsFrames++;let t=performance.now()-this.statsStart;if(this.statsStart&&t>3500){let e=this.statsFrames*1e3/t;this.canvas.dataset.fps=e.toFixed(1),this.canvas.dataset.submitMs=(this.submitTime/this.statsFrames).toFixed(2),this.canvas.dataset.drawCalls=String(this.renderer.info.render.calls),this.canvas.dataset.triangles=String(this.renderer.info.render.triangles),this.canvas.dataset.pixelRatio=this.ratio.toFixed(2),this.canvas.dataset.flowTime=this.time.value.toFixed(2),this.statsStart=performance.now(),this.statsFrames=0,this.submitTime=0,!this.reduced&&e<21&&this.quality>.68&&(this.quality*=.82,this.lensResizePending=!0)}}present(){if(!this.hasCompletedFrame||this.lost||this.disposed)return;let e=this.renderer.autoClear;this.renderer.autoClear=!1;try{this.renderer.setRenderTarget(null),this.presentationQuad.render(this.renderer),this.canvas.dataset.presentations=String(++this.presentations)}finally{this.renderer.autoClear=e}}animate=e=>{if(this.frame=0,this.disposed||document.hidden||this.lost)return;this.resizePending&&(this.resizePending=!1,this.resize());let t=this.lastTick?(e-this.lastTick)/1e3:0;t>.25&&(this.statsStart=e,this.statsFrames=0,this.submitTime=0,delete this.canvas.dataset.fps);let n=t;this.lastTick=e,this.reduced||(this.time.value+=n,this.interaction.uPulseAge.value+=n);let r=1e3/30;(this.redrawPending||!this.reduced&&e-this.lastDraw>=r)&&(this.redrawPending=!1,this.lastDraw=e-(e-this.lastDraw)%r,this.render()),this.present(),this.reduced||this.requestFrame()};requestFrame(){this.frame||this.disposed||document.hidden||this.lost||(this.frame=requestAnimationFrame(this.animate))}requestDraw(){this.redrawPending=!0,this.requestFrame()}schedule(){cancelAnimationFrame(this.frame),this.frame=0,this.lastTick=this.lastDraw=0,this.statsStart=performance.now(),this.statsFrames=0,this.submitTime=0,this.requestDraw()}onVisibility=()=>this.schedule();pointAt(e){let t=this.input.getBoundingClientRect();this.pointer.set((e.clientX-t.left)/this.width*2-1,1-(e.clientY-t.top)/this.height*2),this.interaction.uPointer.value.copy(this.pointer)}onPointerDown=e=>{e.button===0&&(this.pointAt(e),this.input.dataset.pointer=`true`,this.input.focus({preventScroll:!0}),this.input.setPointerCapture(e.pointerId),this.touches.set(e.pointerId,new g(e.clientX,e.clientY)),this.touches.size===1?(this.down.set(e.clientX,e.clientY),this.dragged=!1):this.dragged=!0,this.input.dataset.dragging=`true`)};onPointerMove=e=>{this.pointAt(e),this.interaction.uHoverAmount.value=+(e.pointerType===`mouse`);let t=this.touches.get(e.pointerId);if(!t)return;let n=new g(e.clientX,e.clientY);if(this.touches.size>1){let r=[...this.touches.entries()].find(([t])=>t!==e.pointerId)[1],i=t.distanceTo(r),a=n.distanceTo(r);i>8&&a>8&&(this.orbit.z=_.clamp(this.orbit.z*i/a,10,32))}else n.distanceTo(this.down)>5&&(this.dragged=!0),this.dragged&&(this.orbit.x-=(n.x-t.x)/this.width*2.7,this.orbit.y=_.clamp(this.orbit.y+(n.y-t.y)/this.height*1.7,-.92,1.12));t.copy(n),this.reduced&&this.requestDraw()};onPointerUp=e=>{this.touches.has(e.pointerId)&&(!this.dragged&&this.touches.size===1&&!this.reduced&&(this.pointAt(e),this.interaction.uPulseOrigin.value.copy(this.pointer),this.interaction.uPulseAge.value=0,this.canvas.dataset.pulses=String(++this.pulseCount),this.requestDraw()),this.touches.delete(e.pointerId),this.input.hasPointerCapture(e.pointerId)&&this.input.releasePointerCapture(e.pointerId),this.touches.size||(this.input.dataset.dragging=`false`))};onPointerCancel=e=>{this.touches.delete(e.pointerId),this.dragged=!0,this.touches.size||(this.input.dataset.dragging=`false`)};onPointerLeave=()=>{this.interaction.uHoverAmount.value=0,this.touches.size||this.pointer.set(0,0)};onBlur=()=>{delete this.input.dataset.pointer};onWheel=e=>{if(e.ctrlKey)return;e.preventDefault();let t=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?this.height:1);this.orbit.z=_.clamp(this.orbit.z*Math.exp(_.clamp(t*.001,-.3,.3)),10,32),this.reduced&&this.requestDraw()};resetView=()=>{this.orbit.set(Math.atan2(this.baseEye.x,this.baseEye.z),Math.asin(this.baseEye.y/this.baseEye.length()),this.baseEye.length()),this.reduced&&this.requestDraw()};onKeyDown=e=>{switch(delete this.input.dataset.pointer,e.key){case`ArrowLeft`:this.orbit.x-=.12;break;case`ArrowRight`:this.orbit.x+=.12;break;case`ArrowUp`:this.orbit.y=Math.min(1.12,this.orbit.y+.08);break;case`ArrowDown`:this.orbit.y=Math.max(-.92,this.orbit.y-.08);break;case`+`:case`=`:this.orbit.z=Math.max(10,this.orbit.z*.9);break;case`-`:this.orbit.z=Math.min(32,this.orbit.z/.9);break;case`r`:case`R`:case`Home`:this.resetView();break;default:return}e.preventDefault(),this.reduced&&this.requestDraw()};onContextLost=e=>{e.preventDefault(),this.lost=!0,this.hasCompletedFrame=!1,this.canvas.dataset.context=`lost`,this.schedule()};onContextRestored=()=>{this.lost=!1,this.canvas.dataset.context=`ready`,this.forceResize=this.resizePending=!0,this.schedule()};setReducedMotion(e){this.reduced=e,this.interaction.uInteraction.value=+!e,this.interaction.uPulseAge.value=100,this.canvas.dataset.motion=e?`still`:`flowing`,e&&(this.parallax.set(0,0),this.pointer.set(0,0)),this.schedule()}dispose(){this.disposed=!0,cancelAnimationFrame(this.frame),this.observer.disconnect(),document.removeEventListener(`visibilitychange`,this.onVisibility),this.input.removeEventListener(`pointerdown`,this.onPointerDown),this.input.removeEventListener(`pointermove`,this.onPointerMove),this.input.removeEventListener(`pointerup`,this.onPointerUp),this.input.removeEventListener(`pointercancel`,this.onPointerCancel),this.input.removeEventListener(`lostpointercapture`,this.onPointerCancel),this.input.removeEventListener(`pointerleave`,this.onPointerLeave),this.input.removeEventListener(`wheel`,this.onWheel),this.input.removeEventListener(`keydown`,this.onKeyDown),this.input.removeEventListener(`dblclick`,this.resetView),this.input.removeEventListener(`blur`,this.onBlur),this.canvas.removeEventListener(`webglcontextlost`,this.onContextLost),this.canvas.removeEventListener(`webglcontextrestored`,this.onContextRestored),this.scene.traverse(e=>{(e instanceof p||e instanceof c)&&(e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>e.dispose()))}),this.atlas.dispose(),this.rayScene.traverse(e=>{e instanceof p&&e.geometry.dispose()}),this.rayMaterial.dispose(),this.rayTarget.dispose(),this.composer.passes.forEach(e=>e.dispose()),this.composer.dispose(),this.presentationMaterial.dispose(),this.presentationQuad.dispose(),this.renderer.dispose()}};export{Y as GravityScene,x as prepareFormulaArtwork};