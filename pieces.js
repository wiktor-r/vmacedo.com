/* The alternating pieces of vmacedo.com (Construct -> Collate -> Atlas), same drawing code and glow-v3 edge as the live opening,
   made multi-instance for the layout studies:
     Pieces.mount(box,{mode:'cycle'})                         the live alternation (7.5 s per piece)
     Pieces.mount(box,{mode:'turn',piece:'collate',at:7.5})   one piece that stays resolved and re-forms when its turn comes round
     Pieces.mount(box,{mode:'scrub',piece:'atlas'}).set(p)    one piece whose progress (0 loose .. 1 resolved) is set from outside
     Pieces.cell(box,{t:'q',k:1,c:3})                         one module of Construct (q quarter, d disc, s square), drawn true when it enters view
   {inset:.86} scales the whole drawing about the box centre, so nothing reaches the box edge (it would be cut).
   inst.covered=true pauses an instance that is on screen but hidden under something else (Pieces.kick() restarts the loop).
   Pieces.setTime(t) drives every instance from outside (used to record), Pieces.still() shows everything resolved. */
(()=>{
 const RAMP=[[79,122,147],[150,180,196],[240,220,203],[232,160,122],[201,74,91],[192,57,43]], COVER=[240,220,203];
 const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, ss=(a,b,v)=>{const x=cl((v-a)/(b-a));return x*x*(3-2*x)};
 const eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
 const col=t=>{const v=cl(t)*(RAMP.length-1),i=Math.min(RAMP.length-2,Math.floor(v)),f=v-i;return RAMP[i].map((c,k)=>c+(RAMP[i+1][k]-c)*f)};
 const rgb=(c,a)=>`rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${Math.round(cl(a)*1000)/1000})`;
 const prng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const h2=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
 const noise=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return lerp(lerp(h2(xi,yi),h2(xi+1,yi),u),lerp(h2(xi,yi+1),h2(xi+1,yi+1),u),v)*2-1};
 const FE=[[3.2,.16],[1.6,.3],[0,.62]];
 const MC=[RAMP[0],RAMP[1],col(.5),RAMP[3],RAMP[4],RAMP[5]];
 const OUTL={q:(()=>{const p=[[-.5,-.5]];for(let i=0;i<=20;i++){const a=i/20*Math.PI/2;p.push([-.5+Math.cos(a),-.5+Math.sin(a)])}return p})(),
  d:Array.from({length:36},(_,i)=>[.5*Math.cos(i/36*6.2832),.5*Math.sin(i/36*6.2832)]),
  s:[[-.5,-.5,.5,-.5],[.5,-.5,.5,.5],[.5,.5,-.5,.5],[-.5,.5,-.5,-.5]].flatMap(([a,b,c,d])=>Array.from({length:8},(_,i)=>[lerp(a,c,i/8),lerp(b,d,i/8)]))};
 const still=matchMedia('(prefers-reduced-motion: reduce)'), STILL=6.4, IN=.25;
 const insts=[]; let MAN=null, FROZEN=false, T0=performance.now(), TACC=-IN, raf=0;
 const now=()=>MAN!==null?MAN:TACC;

 function surface(box){
  let cv=box.querySelector('canvas'); if(!cv){cv=document.createElement('canvas');box.appendChild(cv)}
  const main=cv.getContext('2d'), layer=document.createElement('canvas'), lctx=layer.getContext('2d');
  const g={cv,main,layer,lctx,ctx:main,W:0,H:0,D:1,K:1,SOFT:0,FS:1};
  g.size=()=>{const r=cv.getBoundingClientRect();g.D=Math.min(2,window.devicePixelRatio||1);g.W=r.width;g.H=r.height;
   cv.width=layer.width=Math.max(1,Math.round(g.W*g.D));cv.height=layer.height=Math.max(1,Math.round(g.H*g.D));main.setTransform(g.D,0,0,g.D,0,0);lctx.setTransform(g.D,0,0,g.D,0,0)};
  g.fillG=(c,a,build)=>{for(const [e,al] of FE){g.ctx.fillStyle=rgb(c,al*a*g.K);g.ctx.beginPath();build(e/2*g.FS*(1+g.SOFT*5));g.ctx.fill()}};
  g.strokeG=(c,a,w,build)=>{g.ctx.beginPath();build();for(const [e,al] of FE){g.ctx.strokeStyle=rgb(c,al*a*g.K);g.ctx.lineWidth=w+e*g.FS*(1+g.SOFT*3);g.ctx.stroke()}};
  g.poly=(P,gr)=>{const ctx=g.ctx,n=P.length;let A=0;for(let i=0;i<n;i++){const b=P[(i+1)%n];A+=P[i][0]*b[1]-b[0]*P[i][1]}const sg=A>0?gr:-gr;
   for(let i=0;i<n;i++){const a=P[(i+n-1)%n],b=P[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,x=P[i][0]+dy/l*sg,y=P[i][1]-dx/l*sg;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath()};
  g.rr=(x,y,w,h,r)=>{const ctx=g.ctx;ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};
  return g}

 function mount(box,o={}){
  const g=surface(box); let CX=0,CY=0,S=1,GA=null;
  const fit=()=>{g.size();CX=g.W*(o.cx??.5);CY=g.H*(o.cy??.5);S=o.grid!=null?(Math.min(g.W,g.H)-2*(parseFloat(getComputedStyle(box).getPropertyValue('--bleed'))||o.grid))/(4*.47):Math.min(g.W*.38,g.H*.42)*(o.scale||1);g.FS=cl(S/95,.42,1);GA=makeAtlas(10,9)};
  // ---- Collate: hand-cut scraps are trimmed square and collated into one fanned stack ----
  const NS=13, PV=7, SHT=[]; {const R=prng(23), cs=[[-1,-1],[1,-1],[1,1],[-1,1]];
   for(let k=0;k<NS;k++){const pts=[],cj=[0,1,2,3].map(()=>[(R()-.5)*.34,(R()-.5)*.34]);
    for(let s=0;s<4;s++)for(let i=0;i<PV;i++){const f=i/PV,a=cs[s],b=cs[(s+1)%4],ja=cj[s],jb=cj[(s+1)%4];
     pts.push([lerp(a[0],b[0],f),lerp(a[1],b[1],f),lerp(a[0]+ja[0],b[0]+jb[0],f)+(i?(R()-.5)*.07:0),lerp(a[1]+ja[1],b[1]+jb[1],f)+(i?(R()-.5)*.07:0)])}
    SHT.push({k,pts,th:(R()-.5)*1.5,sw:.32+R()*.5,sh:.3+R()*.42,ph:R()*6.28,tau:k<2?.3+k*.3:.95+(k-2)*.36,c:k===NS-1?COVER:col(k/(NS-2))})}}
  const LOOSE=[[.16,.2],[.62,.12],[.36,.5],[.86,.34],[.12,.72],[.5,.84],[.78,.7],[.3,.14],[.92,.86],[.58,.44],[.1,.44],[.24,.86],[.44,.28]];
  const collate=t=>{const W=g.W,sw=.95*S,sh=sw*1.414,step=.068*S,ang=lerp(.34,.86,.5+.5*Math.sin(t*.16-1.2)),dx=Math.cos(ang)*step,dy=-Math.sin(ang)*step,bx=CX-(NS-1)*dx/2,by=CY-(NS-1)*dy/2,dr=cl(S/95,.3,1)*4;
   for(const s of SHT){const o2=eio((t-s.tau)/1.7),lift=Math.sin(o2*Math.PI),lx=CX+(LOOSE[s.k][0]-.5)*Math.min(2.5*S,W-Math.min(84,W*.3))+Math.sin(t*.21+s.ph)*dr,ly=CY+(LOOSE[s.k][1]-.5)*1.75*S+Math.cos(t*.17+s.ph)*dr;
    const x=lerp(lx,bx+s.k*dx,o2),y=lerp(ly,by+s.k*dy,o2)-lift*.1*S,th=lerp(s.th+Math.sin(t*.13+s.ph)*.05,0,o2),c=Math.cos(th),sn=Math.sin(th),hw=lerp(sw*s.sw*.34,sw/2,o2),hh=lerp(sw*s.sh*.47,sh/2,o2);
    const P=s.pts.map(p=>{const px=lerp(p[2],p[0],o2)*hw,py=lerp(p[3],p[1],o2)*hh;return [x+px*c-py*sn,y+px*sn+py*c]});
    g.fillG(s.c,1,e=>g.poly(P,e))}};
  // ---- Atlas: a shuffled sheet of swatches sorts itself, chip by chip, into a tint chart ----
  const makeAtlas=(cols,rows)=>{const R=prng(41),n=cols*rows,slot=[...Array(n).keys()],chips=[];
   for(let k=0;k<n*3;k++){const a=Math.floor(R()*n),b=cl((a/cols|0)+Math.round((R()-.5)*7),0,rows-1)*cols+cl(a%cols+Math.round((R()-.5)*7),0,cols-1);[slot[a],slot[b]]=[slot[b],slot[a]]}
   for(let i=0;i<n;i++){const c=i%cols,r=i/cols|0,f=(c+r)/(cols+rows-2)+R()*.13;
    chips.push({c,r,sc:slot[i]%cols,sr:slot[i]/cols|0,col:col(c/(cols-1)),a:lerp(.3,1,Math.pow(r/(rows-1),.85)),rot:(R()-.5)*.5,jx:(R()-.5)*.3,jy:(R()-.5)*.3,tau:.4+f/1.13*4.2})}
   return {cols,rows,chips}};
  const atlas=t=>{const {cols,rows,chips}=GA,gw=Math.min(2.66*S,g.W*.94),sz=gw/cols*.7,cell=(gw-sz)/(cols-1),x0=CX-gw/2+sz/2,y0=CY-(cell*(rows-1))/2,ctx=g.ctx;
   const it=chips.map(ch=>{const o2=eio((t-ch.tau)/1.6);return {ch,o:o2,lift:Math.sin(o2*Math.PI),x:lerp(x0+(ch.sc+ch.jx)*cell,x0+ch.c*cell,o2),y:lerp(y0+(ch.sr+ch.jy)*cell,y0+ch.r*cell,o2)}}).sort((a,b)=>(a.o<1)-(b.o<1)||a.lift-b.lift||a.ch.tau-b.ch.tau);
   for(const i of it){const s=sz*(1+i.lift*.08);ctx.save();ctx.translate(i.x,i.y-i.lift*4*g.FS);ctx.rotate(i.ch.rot*(1-i.o));g.fillG(i.ch.col,i.ch.a,e=>g.rr(-s/2-e,-s/2-e,s+2*e,s+2*e,Math.min(1.5,s*.12)+e));ctx.restore()}};
  // ---- Construct: pencil shapes are drawn true on a construction grid and become a modular mark ----
  const NG=4;
  const MARK=[['q',2,0],['s',0,2],['q',3,4],['-',0,0],['d',0,3],['q',1,0],['q',0,1],['q',3,5],['q',1,5],['q',2,2],['d',0,4],['s',0,3],['-',0,0],['q',0,4],['q',1,1],['q',2,0]];
  const CELLS=MARK.map((m,i)=>{const R=prng(70+i);return {t:m[0],k:m[1],c:m[2],x:i%NG,y:i/NG|0,jx:(R()-.5)*.26,jy:(R()-.5)*.26,jr:(R()-.5)*.5,js:.82+R()*.3,seed:R()*99,ord:R()}}).filter(c=>c.t!=='-');
  CELLS.slice().sort((a,b)=>a.ord-b.ord).forEach((c,i)=>c.tau=.5+i*.3);
  const construct=t=>{const cell=.47*S,G=cell*NG,x0=CX-G/2,y0=CY-G/2,all=eio((t-4.1)/1.9),ov=.11*S*all,ctx=g.ctx,lw=cl(S/95,.6,1);
   if(all>.01)g.strokeG(RAMP[0],.32*all,.7*lw,()=>{for(let i=0;i<=NG;i++){ctx.moveTo(x0+i*cell,y0-ov);ctx.lineTo(x0+i*cell,y0+G+ov);ctx.moveTo(x0-ov,y0+i*cell);ctx.lineTo(x0+G+ov,y0+i*cell)}});
   for(const c of CELLS){const o2=eio((t-c.tau)/1.5),raw=1-o2,cx=x0+(c.x+.5)*cell+c.jx*cell*raw,cy=y0+(c.y+.5)*cell+c.jy*cell*raw,rot=c.k*Math.PI/2+c.jr*raw,sc=lerp(c.js,1,o2)*cell,co=Math.cos(rot),si=Math.sin(rot);
    const shape=(sd,amp)=>OUTL[c.t].map((p,i)=>{const w=amp*raw,x=(p[0]+noise(i*.33+sd,t*.25)*w)*sc,y=(p[1]+noise(i*.33+sd+40,t*.25)*w)*sc;return [cx+x*co-y*si,cy+x*si+y*co]});
    const P=shape(c.seed,.05), f=ss(.45,1,o2);
    if(f>.004)g.fillG(MC[c.c],f,e=>g.poly(P,e));
    if(raw>.01){g.strokeG(RAMP[0],.95*ss(0,.5,raw),.9*lw,()=>g.poly(P,0));const Q=shape(c.seed+17,.07);g.strokeG(RAMP[0],.5*ss(0,.5,raw),.7*lw,()=>g.poly(Q,0))}}};
  const ALL={construct,collate,atlas};
  const mode=o.mode||'cycle', PIECES=(mode==='cycle'?(o.order||['construct','collate','atlas']):[o.piece||'construct']).map(n=>ALL[n]);
  const PER=mode==='cycle'?7.5:(o.loop||22.5), LOOP=PER*PIECES.length, AT=o.at||0; let P=o.p??1;
  const sheet=(piece,t,k)=>{if(k<.004)return;g.SOFT=1-k;g.K=1;g.ctx=k>.999?g.main:g.lctx;const ctx=g.ctx;if(ctx===g.lctx)ctx.clearRect(0,0,g.W,g.H);ctx.lineCap='round';ctx.lineJoin='round';
   const f=o.inset??1;if(f!==1){ctx.save();ctx.translate(g.W/2,g.H/2);ctx.scale(f,f);ctx.translate(-g.W/2,-g.H/2)}piece(t);if(f!==1)ctx.restore();if(ctx===g.lctx){g.main.globalAlpha=k;g.main.drawImage(g.layer,0,0,g.W,g.H);g.main.globalAlpha=1}g.ctx=g.main};
  const draw=T=>{if(!g.W||!g.H)return;g.main.clearRect(0,0,g.W,g.H);
   if(mode==='scrub'){sheet(PIECES[0],cl(P)*STILL,1);return}
   if(FROZEN||still.matches){sheet(PIECES[0],STILL,1);return}
   PIECES.forEach((piece,i)=>{const t=(((T-AT-i*PER+IN)%LOOP)+LOOP)%LOOP-IN;if(t>PER+.2||(mode==='cycle'&&T<.2&&i))return;
    sheet(piece,t,ss(-IN,.65,t)*(1-ss(PER-.7,PER+.2,t)))})};
  const inst={box,draw,fit,visible:true,animated:mode!=='scrub',set(p){if(Math.abs(p-P)<.002)return;P=p;draw(now())},redraw(){fit();draw(now())}};
  fit(); draw(now()); insts.push(inst);
  new IntersectionObserver(e=>{inst.visible=e[0].isIntersecting;kick()},{rootMargin:'0px'}).observe(box);
  new ResizeObserver(()=>{fit();draw(now())}).observe(box);
  kick(); return inst}

 // one module of Construct at any size: pencil outline, then filled true
 function cell(box,o={}){
  const g=surface(box), PAD=o.pad??6, seed=o.seed??(o.k*7.3+o.c*3.1+1), R=prng(Math.round(seed*100)), jx=(R()-.5)*.2, jy=(R()-.5)*.2, jr=(R()-.5)*.42, js=.84+R()*.2;
  let O=o.o??0, target=O, t0=null;
  const draw=T=>{g.main.clearRect(0,0,g.W,g.H);const o2=(FROZEN||still.matches)?1:O,raw=1-o2,sz=Math.min(g.W,g.H)-2*PAD,cx=g.W/2+jx*sz*raw,cy=g.H/2+jy*sz*raw,rot=(o.k||0)*Math.PI/2+jr*raw,sc=lerp(js,1,o2)*sz,co=Math.cos(rot),si=Math.sin(rot),ctx=g.ctx;
   ctx.lineCap='round';ctx.lineJoin='round';g.K=1;g.SOFT=0;g.FS=1;
   const shape=(sd,amp)=>OUTL[o.t||'q'].map((p,i)=>{const w=amp*raw,x=(p[0]+noise(i*.33+sd,T*.25)*w)*sc,y=(p[1]+noise(i*.33+sd+40,T*.25)*w)*sc;return [cx+x*co-y*si,cy+x*si+y*co]});
   const P=shape(seed,.05), f=ss(.45,1,o2);
   if(f>.004)g.fillG(MC[o.c??0],f*(o.a??1),e=>g.poly(P,e));
   if(raw>.01){g.strokeG(RAMP[0],.95*ss(0,.5,raw),1,()=>g.poly(P,0));const Q=shape(seed+17,.07);g.strokeG(RAMP[0],.5*ss(0,.5,raw),.8,()=>g.poly(Q,0))}};
  const inst={box,fit:()=>g.size(),visible:false,animated:true,cell:true,
   draw:T=>{if(target&&O<1){if(t0===null)t0=T;O=eio(cl((T-t0-(o.delay||0))/1.5));} draw(T)},
   done:()=>O>=1, go(){target=1}, redraw(){g.size();draw(now())}};
  g.size(); draw(0); insts.push(inst);
  new IntersectionObserver(e=>{inst.visible=e[0].isIntersecting;if(e[0].isIntersecting&&e[0].intersectionRatio>.35)inst.go();kick()},{threshold:[0,.35,.6]}).observe(box);
  new ResizeObserver(()=>{g.size();draw(now())}).observe(box);
  return inst}

 const frame=t=>{TACC+=Math.min(.1,(t-T0)/1000);T0=t;let live=false;
  for(const i of insts){if(!i.visible||i.covered||!i.animated||(i.cell&&i.done()&&i._last))continue;i.draw(TACC);if(i.cell&&i.done())i._last=true;live=true}
  raf=live?requestAnimationFrame(frame):0};
 function kick(){if(MAN!==null||FROZEN||still.matches||document.hidden||raf)return;T0=performance.now();raf=requestAnimationFrame(frame)}
 document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);raf=0;kick()});
 window.Pieces={mount,cell,RAMP,col,rgb,kick,
  setTime(t){MAN=t;cancelAnimationFrame(raf);raf=0;for(const i of insts){i._last=false;i.draw(t)}},
  still(){FROZEN=true;cancelAnimationFrame(raf);raf=0;for(const i of insts){i.fit();i.draw(STILL)}},
  auto(sel='[data-piece]'){document.querySelectorAll(sel).forEach(b=>{const d=b.dataset;b._piece=d.piece==='cell'?cell(b,JSON.parse(d.cfg||'{}')):mount(b,Object.assign({mode:d.piece},JSON.parse(d.cfg||'{}')))})}};
})();
