// Glow bottle — validated reference scene.
//
// This is not wired into the site. It is the scene that was rendered and
// visually confirmed during the inspection pass, kept verbatim so the React
// port starts from something known to work rather than from a description.
//
// Port target: a <BottleScene /> under @react-three/fiber, dynamically
// imported with ssr:false and gated on reduced motion. See
// docs/3D-HERO-BRIEF.md for the beat map and the rules this must respect.
//
// Structure that matters: `bottle` (body + label + contents) and `cap` are
// separate groups. The cap-opening beat depends on that separation, and a real
// bottle.glb would need the same detached `cap` node to drop in here.
//
// Globals assumed by the viewer this ran in: THREE, canvas, width, height.
// In the React port these come from useThree()/the Canvas instead.

const BRAND = { cream:'#F7E8D5', gold:'#C8A063', navy:'#0F2A4C', berry:0xC9202F, berry2:0xA81826 };

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(30, width/height, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2, never 3
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;

// ---------- procedural studio environment ----------
// A canvas gradient plus soft-box blobs, pushed through PMREM. This is what
// produces the travelling highlights on the glass. No .hdr file, no CDN fetch:
// keep it that way, a drei <Environment preset> would reintroduce a network
// dependency for no visual gain at this scale.
function envTex(){
  const c=document.createElement('canvas'); c.width=1024; c.height=512;
  const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#ffffff'); g.addColorStop(0.42,'#faf0e2'); g.addColorStop(1,'#b9a48c');
  x.fillStyle=g; x.fillRect(0,0,1024,512);
  const blob=(cx,cy,r,a)=>{const rg=x.createRadialGradient(cx,cy,0,cx,cy,r);
    rg.addColorStop(0,'rgba(255,255,255,'+a+')'); rg.addColorStop(1,'rgba(255,255,255,0)');
    x.fillStyle=rg; x.fillRect(cx-r,cy-r,r*2,r*2);};
  blob(250,150,170,0.95); blob(760,190,140,0.75); blob(520,60,110,0.5);
  const t=new THREE.CanvasTexture(c);
  t.mapping=THREE.EquirectangularReflectionMapping; t.colorSpace=THREE.SRGBColorSpace;
  return t;
}
const pmrem=new THREE.PMREMGenerator(renderer);
const envRT=pmrem.fromEquirectangular(envTex());
scene.environment=envRT.texture;
// TEARDOWN: envRT.dispose(), pmrem.dispose(), and dispose every geometry,
// material and texture below. Three.js does not free GPU memory on its own.

// ---------- label ----------
// Figures here are placeholders for the port: read them from
// src/data/products.json instead, exactly as tools/spin-render/label-wrap.mjs
// does, so the printed panel can never contradict the page.
// The side panels are deliberately illegible rule-bars -- a wrong dosage
// printed on the bottle would be worse than no dosage at all.
function labelTex(){
  const c=document.createElement('canvas'); c.width=2048; c.height=1024;
  const x=c.getContext('2d');
  x.fillStyle=BRAND.cream; x.fillRect(0,0,2048,1024);
  const cx=1024;
  x.strokeStyle=BRAND.gold; x.lineWidth=6; x.strokeRect(cx-330,70,660,884);
  x.lineWidth=2;                           x.strokeRect(cx-312,88,624,848);
  x.textAlign='center'; x.fillStyle=BRAND.navy;
  x.font='italic 150px Georgia, serif'; x.fillText('Glow', cx, 300);
  x.font='bold 92px Helvetica, Arial';  x.fillText('HAIR, SKIN', cx, 462);
                                        x.fillText('& NAILS', cx, 558);
  x.font='600 58px Helvetica, Arial';    x.fillText('G U M M I E S', cx, 666);
  x.fillStyle='#7a6a55';
  x.font='500 52px Helvetica, Arial';    x.fillText('PASSION FRUIT', cx, 764);
  x.strokeStyle=BRAND.gold; x.lineWidth=2;
  x.beginPath(); x.moveTo(cx-200,812); x.lineTo(cx+200,812); x.stroke();
  x.fillStyle=BRAND.navy; x.font='600 38px Helvetica, Arial';
  x.fillText('NET WT. 6.56 oz (186 g)  |  60 GUMMIES', cx, 880);
  x.fillStyle='rgba(20,18,16,0.13)';
  [180,1868].forEach(p=>{ for(let i=0;i<17;i++) x.fillRect(p-150,180+i*42,300,15); });
  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=8;
  t.wrapS=THREE.RepeatWrapping; t.offset.x=0.5; // front panel faces camera at rest
  return t;
}

// ---------- materials ----------
const glassMat=new THREE.MeshPhysicalMaterial({ color:0xffffff, roughness:0.09, metalness:0,
  transmission:0.92, thickness:1.6, ior:1.46, clearcoat:1, clearcoatRoughness:0.05,
  transparent:true, opacity:0.62, side:THREE.DoubleSide, envMapIntensity:1.35, depthWrite:false });
const capMat=new THREE.MeshPhysicalMaterial({ color:0xF7F5F1, roughness:0.34,
  clearcoat:0.55, clearcoatRoughness:0.28, envMapIntensity:0.9 });
const labelMat=new THREE.MeshPhysicalMaterial({ map:labelTex(), roughness:0.58,
  clearcoat:0.3, envMapIntensity:0.55, side:THREE.DoubleSide });

// ---------- silhouette ----------
// A revolved profile, not stacked primitives: foot chamfer, straight wall,
// shoulder curve, neck. This is the single biggest readability win over the
// older tools/spin-render/spin3d.mjs model.
const R=2.05, prof=[];
prof.push(new THREE.Vector2(0.001,0.06), new THREE.Vector2(R*0.72,0.05),
          new THREE.Vector2(R*0.95,0.22), new THREE.Vector2(R,0.55));
for(let i=0;i<=8;i++) prof.push(new THREE.Vector2(R, 0.55+(i/8)*4.55));
prof.push(new THREE.Vector2(R*0.995,5.35), new THREE.Vector2(R*0.94,5.72),
          new THREE.Vector2(R*0.80,6.05),  new THREE.Vector2(R*0.63,6.28),
          new THREE.Vector2(R*0.53,6.45),  new THREE.Vector2(R*0.52,7.05));

const bottle=new THREE.Group();
bottle.add(new THREE.Mesh(new THREE.LatheGeometry(prof,96), glassMat));
const label=new THREE.Mesh(new THREE.CylinderGeometry(R*1.006,R*1.006,3.5,96,1,true), labelMat);
label.position.y=2.55; bottle.add(label);

// contents, seen through the glass. 150 on desktop; drop this count on mobile.
const gGeo=new THREE.SphereGeometry(0.33,14,12);
const gMats=[BRAND.berry,BRAND.berry2,0xD4472F].map(c=>new THREE.MeshPhysicalMaterial({
  color:c, roughness:0.26, transmission:0.35, thickness:0.6, clearcoat:0.75, envMapIntensity:1.1 }));
let sd=11; const rnd=()=>{sd=(sd*1103515245+12345)%2147483648; return sd/2147483648;};
for(let i=0;i<150;i++){
  const m=new THREE.Mesh(gGeo,gMats[i%3]);
  const a=rnd()*Math.PI*2, r=Math.sqrt(rnd())*(R-0.45);
  m.position.set(Math.cos(a)*r, 0.5+Math.pow(rnd(),2)*3.9, Math.sin(a)*r);
  m.rotation.set(rnd()*3,rnd()*3,rnd()*3);
  m.scale.set(1,0.78,1).multiplyScalar(0.85+rnd()*0.35);
  bottle.add(m);
}

// ---------- cap: its own group, so it can leave ----------
const cap=new THREE.Group();
const cb=new THREE.Mesh(new THREE.CylinderGeometry(R*0.60,R*0.60,0.95,96), capMat); cb.position.y=0.475; cap.add(cb);
const ct=new THREE.Mesh(new THREE.CylinderGeometry(R*0.60,R*0.60,0.08,96), capMat); ct.position.y=0.95; cap.add(ct);
const ribGeo=new THREE.BoxGeometry(0.03,0.74,0.055);
const ribMat=new THREE.MeshStandardMaterial({color:0xdedad3,roughness:0.55,envMapIntensity:0.7});
for(let i=0;i<60;i++){const a=(i/60)*Math.PI*2;const rb=new THREE.Mesh(ribGeo,ribMat);
  rb.position.set(Math.cos(a)*R*0.603,0.47,Math.sin(a)*R*0.603); rb.rotation.y=-a; cap.add(rb);}
cap.position.y=6.85;

// ---------- gummies that emerge on scroll ----------
const emerge=[];
for(let i=0;i<16;i++){
  const m=new THREE.Mesh(gGeo,gMats[i%3]);
  m.scale.set(1,0.78,1).multiplyScalar(0.95+rnd()*0.3);
  m.userData={a:(i/16)*Math.PI*2+rnd(), rad:2.6+rnd()*3.4, up:1.6+rnd()*3.2, sp:0.6+rnd()*0.8, ph:rnd()*6.28};
  m.visible=false; emerge.push(m);
}

const product=new THREE.Group();
product.add(bottle,cap); emerge.forEach(m=>product.add(m));
product.position.y=-3.3; scene.add(product);

// ---------- cinematic lighting ----------
scene.add(new THREE.AmbientLight(0xffffff,0.5));
const key =new THREE.DirectionalLight(0xfff6ec,2.6); key.position.set(-6,9,8);
const fill=new THREE.DirectionalLight(0xeaf2ff,0.9); fill.position.set(7,2,6);
const rim =new THREE.DirectionalLight(0xffffff,2.4); rim.position.set(2,5,-8);
scene.add(key,fill,rim);
const bounce=new THREE.PointLight(0xF0A868,1.1,26); bounce.position.set(0,-4,4); // warm underlight
scene.add(bounce);

// ---------- choreography ----------
// `p` is 0..1. Here it is driven by time so the loop can be reviewed; in the
// port it is driven by a single pinned ScrollTrigger with scrub:1. Keep the
// beat windows below -- they were tuned visually.
const ease=t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const cl=(v,a,b)=>Math.max(0,Math.min(1,(v-a)/(b-a)));

function frame(p,t){
  // camera push-in, then a slight rise as it hands off to the next section
  camera.position.set(0, 0.6+1.4*ease(cl(p,0.35,1)), 26-9*ease(cl(p,0,0.55)));
  camera.lookAt(0, 0.15+0.5*ease(cl(p,0.5,1)), 0);

  product.rotation.y = t*0.32 + ease(cl(p,0.2,0.7))*1.1;  // continuous + scrolled
  product.position.y = -3.3 + Math.sin(t*0.9)*0.13;       // float, non-harmonic
  product.rotation.z = -0.16*ease(cl(p,0.28,0.62));       // tilt into new pose
  product.rotation.x =  0.10*ease(cl(p,0.28,0.62));

  const o=ease(cl(p,0.42,0.68));                          // cap opens
  cap.position.y=6.85+o*3.6; cap.position.x=o*1.5;
  cap.rotation.z=o*0.9; cap.rotation.x=o*0.45;

  const e=cl(p,0.55,1);                                   // gummies emerge
  emerge.forEach((m,i)=>{
    const d=cl(e,i*0.035,i*0.035+0.45);                   // staggered per gummy
    m.visible=d>0.001; if(!m.visible) return;
    const k=ease(d), rad=k*m.userData.rad;
    m.position.set(Math.cos(m.userData.a)*rad,
                   6.4+k*m.userData.up+Math.sin(t*m.userData.sp+m.userData.ph)*0.28,
                   Math.sin(m.userData.a)*rad);
    m.rotation.set(t*0.5+m.userData.ph, t*0.4, t*0.3);
  });
}

const t0=performance.now();
(function animate(){
  requestAnimationFrame(animate);
  const t=(performance.now()-t0)/1000;
  frame((t%13)/13, t);   // port: replace (t%13)/13 with the scroll progress
  renderer.render(scene,camera);
})();
