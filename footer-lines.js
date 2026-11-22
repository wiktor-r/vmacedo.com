// Footer 'Bookend' lines: .fflow (desktop, mirrored hero lines; reads data-cfg) and .fflow-m (phone). Pauses off screen and when the tab is hidden; one still frame under prefers-reduced-motion.
(()=>{const box=document.querySelector('.fflow'); if(!box) return; const cv=box.querySelector('canvas'), ctx=cv.getContext('2d');
 const C=Object.assign({mode:'C',n:15,amp:.035,k:1.6,wmin:2.2,wmax:6.8},JSON.parse(box.dataset.cfg||'{}'));
 const RAMP=[[79,122,147],[150,180,196],[240,220,203],[232,160,122],[201,74,91],[192,57,43]], SEG=180;   // the phone's ramp, blue -> red
 const col=t=>{const v=t*(RAMP.length-1),i=Math.min(RAMP.length-2,Math.floor(v)),f=v-i;return RAMP[i].map((c,k)=>Math.round(c+(RAMP[i+1][k]-c)*f))};
 const rnd=s=>{const x=Math.sin(s*12.9898+78.233)*43758.5453;return x-Math.floor(x)};
 const L=Array.from({length:C.n},(_,i)=>{const t=i/(C.n-1);return {t,c:col(t),w:C.wmin+t*(C.wmax-C.wmin)+rnd(i*3.1)*1.3,f:.6+rnd(i*5.7)*.8,s:.16+rnd(i*7.3)*.18,ph:rnd(i*9.1)*6.28,a:.6+rnd(i*4.4)*.8,j:rnd(i*2.3)-.5,q:rnd(i*6.1)-.5}});
 let W=0,H=0,D=1;
 const fit=()=>{const z=parseFloat(getComputedStyle(document.documentElement).zoom)||1;W=box.clientWidth;H=box.clientHeight;D=Math.min(2,window.devicePixelRatio||1)*z;
  cv.width=Math.round(W*D);cv.height=Math.round(H*D);ctx.setTransform(D,0,0,D,0,0);gfit()};
 const rgb=(c,a,k=1)=>`rgba(${c.map(v=>Math.max(0,Math.min(255,Math.round(v*k))))},${a})`;
 const cl=v=>Math.max(0,Math.min(1,v)), ss=(a,b,v)=>{const x=cl((v-a)/(b-a));return x*x*(3-2*x)};
 const bez=(p0,p1,p2,p3,s)=>{const m=1-s;return [m*m*m*p0[0]+3*m*m*s*p1[0]+3*m*s*s*p2[0]+s*s*s*p3[0], m*m*m*p0[1]+3*m*m*s*p1[1]+3*m*s*s*p2[1]+s*s*s*p3[1]]};
 // control points in box fractions (x of width, y of height), per line t: 0 = blue (outer), 1 = red (inner)
 const ctrl=l=>{const t=l.t, sp=Math.pow(t,C.rp??.6);
  if(C.mode==='C'){ // enter from the bottom edge near column 7, sweep up and open into the upper-right corner
   const xs=C.x0+(C.x1-C.x0)*(t+l.j*.3/(C.n-1)), ye=C.ye0+(C.ye1-C.ye0)*sp;
   return [[xs,1.1],[xs+C.lean,C.cy+.16*t],[C.cx+.22*t,ye+.03],[1.08,ye]]}
  else {            // enter from the right edge low, flow left a little, turn up into the upper right
   const ys=C.ys0+(C.ys1-C.ys0)*(t+l.j*.3/(C.n-1)), g=1-ss(C.g0??.55,C.g1??.72,t), tt=Math.min(1,t/(C.g0??.55));
   const xt=C.xt0+(C.xt1-C.xt0)*tt, xe=C.xe0+(C.xe1-C.xe0)*tt;   // turn point and exit on the top edge
   const lerp=(a,b)=>[a[0]+(b[0]-a[0])*g,a[1]+(b[1]-a[1])*g];
   const E=g>=.5?[-.12+(xe+.12)*(g-.5)*2,-.12]:[-.12,-.12+(ys-.02+.12)*(1-g*2)];
   return [[1.08,ys], lerp([.62,ys+.01],[xt,ys+.02]), lerp([.3,ys+.02],[xt+.04,ys-.36]), E]}};

 // ---- v3 rendering: ONE flat stroke per line (no strands, edges or highlights), normal blending.
 //      Soft, airbrushed edge: the same stroke is laid three times, slightly wider and fainter each time (feather ~1.5 px). ----
 const colc=t=>col(Math.max(0,Math.min(1,t)));
 const gfit=()=>{};
 const FE=[[3.2,.16],[1.6,.3],[0,.62]];   // [extra width in CSS px, opacity]: outer feather -> flat body
 const glow=ls=>{ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='source-over'; ctx.lineCap='round'; ctx.lineJoin='round';
  for(const l of ls){const p=l.pts, w=1.2+l.w*.55; ctx.beginPath(); p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
   for(const [e,a] of FE){ctx.strokeStyle=rgb(l.c,a); ctx.lineWidth=w+e; ctx.stroke()}}
 };
 const draw=T=>{const ls=[];
  for(const l of L){const [p0,p1,p2,p3]=ctrl(l).map(([x,y])=>[x*W,y*H]); const base=[];
   for(let s=0;s<=SEG;s++) base.push(bez(p0,p1,p2,p3,s/SEG));
   const pts=base.map(([x,y],s)=>{const u=s/SEG, a=base[Math.max(0,s-1)], b=base[Math.min(SEG,s+1)], dx=b[0]-a[0], dy=b[1]-a[1], n=Math.hypot(dx,dy)||1;
    const env=ss(.06,.4,u)*(1-.5*ss(.8,1,u));                         // parallel entry, soft crossings in the middle, calmer at the end
    const o=env*H*C.amp*(l.a*Math.sin(u*l.f*6.283*C.k+T*l.s+l.ph)+.35*Math.sin(u*9*C.k-T*l.s*1.4+l.ph*2)) + H*.008*Math.sin(u*2.2+T*.12);
    return [x-dy/n*o, y+dx/n*o]});
   ls.push({pts,c:l.c,t:l.t,w:l.w*(1+.12*Math.sin(T*.27+l.ph))})}
  glow(ls)};
 window.__foot=t=>{fit();draw(t)};
 fit();
 const still=matchMedia('(prefers-reduced-motion: reduce)');
 let raf=0, visible=true, t0=performance.now(), tAcc=7.3;
 const loop=now=>{tAcc+=(now-t0)/1000; t0=now; draw(tAcc); raf=requestAnimationFrame(loop)};
 const run=()=>{cancelAnimationFrame(raf); if(!box.offsetParent) return; if(still.matches){draw(7.3);return} if(visible&&!document.hidden){t0=performance.now(); raf=requestAnimationFrame(loop)} else draw(tAcc)};
 new IntersectionObserver(e=>{visible=e[0].isIntersecting; run()}).observe(box);
 document.addEventListener('visibilitychange',run); still.addEventListener?.('change',run);
 new ResizeObserver(()=>{fit(); draw(tAcc); run()}).observe(box);
 run();
})();
;
(()=>{const box=document.querySelector('.fflow-m'); if(!box) return; const cv=box.querySelector('canvas'), ctx=cv.getContext('2d');
 // sea blue -> sea light -> peach -> rose -> red, far to near
 const RAMP=[[79,122,147],[150,180,196],[240,220,203],[232,160,122],[201,74,91],[192,57,43]], N=14, SEG=64;
 const col=t=>{const v=t*(RAMP.length-1),i=Math.min(RAMP.length-2,Math.floor(v)),f=v-i;return RAMP[i].map((c,k)=>Math.round(c+(RAMP[i+1][k]-c)*f))};
 const rnd=s=>{const x=Math.sin(s*12.9898+78.233)*43758.5453;return x-Math.floor(x)};
 const L=Array.from({length:N},(_,i)=>{const t=i/(N-1);return {t,c:col(t),w:2+t*4.2+rnd(i*3.1)*1.4,f:.55+rnd(i*5.7)*.7,s:.16+rnd(i*7.3)*.18,ph:rnd(i*9.1)*6.28,a:.055+rnd(i*4.4)*.05,y:.27+t*.48}});
 let W=0,H=0,D=1;
 const fit=()=>{const r=cv.getBoundingClientRect();D=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;cv.width=Math.round(W*D);cv.height=Math.round(H*D);ctx.setTransform(D,0,0,D,0,0);gfit()};
 const rgb=(c,a,k=1)=>`rgba(${c.map(v=>Math.max(0,Math.min(255,Math.round(v*k))))},${a})`;

 // ---- v3 rendering: ONE flat stroke per line (no strands, edges or highlights), normal blending.
 //      Soft, airbrushed edge: the same stroke is laid three times, slightly wider and fainter each time (feather ~1.5 px). ----
 const colc=t=>col(Math.max(0,Math.min(1,t)));
 const gfit=()=>{};
 const FE=[[3.2,.16],[1.6,.3],[0,.62]];   // [extra width in CSS px, opacity]: outer feather -> flat body
 const glow=ls=>{ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='source-over'; ctx.lineCap='round'; ctx.lineJoin='round';
  for(const l of ls){const p=l.pts, w=1.2+l.w*.55; ctx.beginPath(); p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
   for(const [e,a] of FE){ctx.strokeStyle=rgb(l.c,a); ctx.lineWidth=w+e; ctx.stroke()}}
 };
 const draw=t=>{const ls=[];
  for(const l of L){const pts=[];
   for(let s=0;s<=SEG;s++){const u=s/SEG, x=-W*.05+u*W*1.1;
    const env=u<.08?0:Math.pow(Math.min(1,(u-.08)/.66),1.35);   // calm parallel entry, opening up to the right
    const y=H*(l.y-(u-.5)*.24) + H*.02*Math.sin(u*2.4+t*.12)
      + env*(H*l.a*Math.sin(u*l.f*6.283+t*l.s+l.ph) + H*.016*Math.sin(u*4.7-t*l.s*1.4+l.ph*2) + H*.012*Math.sin(u*3.1+t*.11+l.ph));
    pts.push([x,y])}
   ls.push({pts,c:l.c,t:l.t,w:l.w*(1+.12*Math.sin(t*.27+l.ph))})}
  glow(ls)};
 window.__footM=t=>{fit();draw(t)};
 fit();
 const still=matchMedia('(prefers-reduced-motion: reduce)');
 let raf=0, visible=true, t0=performance.now(), tAcc=7.3;
 const loop=now=>{tAcc+=(now-t0)/1000; t0=now; draw(tAcc); raf=requestAnimationFrame(loop)};
 const run=()=>{cancelAnimationFrame(raf); if(still.matches){draw(7.3);return} if(visible&&!document.hidden){t0=performance.now(); raf=requestAnimationFrame(loop)} else draw(tAcc)};
 new IntersectionObserver(e=>{visible=e[0].isIntersecting; run()}).observe(box);
 document.addEventListener('visibilitychange',run); still.addEventListener?.('change',run);
 new ResizeObserver(()=>{fit(); draw(tAcc)}).observe(box); addEventListener('orientationchange',()=>{fit(); draw(tAcc)});
 run();
})();
