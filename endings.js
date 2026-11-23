/* Endings for the Line home: five abstract pictures of "starting from what people actually need", drawn in the soft-edge language
   of the live pieces (flat ramp colour, every shape laid three times: body .62, +1.6 px at .30, +3.2 px at .16).
   One canvas under the last stretch of the line. Its progress (0 loose .. 1 resolved) follows the page as the last screen comes in
   (sideways on desktop, downwards on phone) and never moves the page; arriving in one jump still plays it, in about 2.4 s.
   Endings.mount('consensus'|'relief'|'clearing'|'rings'|'weave') */
(()=>{
 const RAMP=[[79,122,147],[150,180,196],[240,220,203],[232,160,122],[201,74,91],[192,57,43]], PAPER=[244,241,234], INK=[26,25,22];
 const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, ss=(a,b,v)=>{const x=cl((v-a)/(b-a));return x*x*(3-2*x)};
 const eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
 const col=t=>{const v=cl(t)*(RAMP.length-1),i=Math.min(RAMP.length-2,Math.floor(v)),f=v-i;return RAMP[i].map((c,k)=>c+(RAMP[i+1][k]-c)*f)};
 const mixc=(a,b,f)=>a.map((c,k)=>c+(b[k]-c)*f), solid=c=>mixc(PAPER,c,.62);
 const rgb=(c,a=1)=>`rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${Math.round(cl(a)*1000)/1000})`;
 const prng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const h2=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
 const noise=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return lerp(lerp(h2(xi,yi),h2(xi+1,yi),u),lerp(h2(xi,yi+1),h2(xi+1,yi+1),u),v)*2-1};
 const FE=[[3.2,.16],[1.6,.3],[0,.62]];
 let ctx;
 const fillG=(c,a,build)=>{for(const [e,al] of FE){ctx.fillStyle=rgb(c,al*a);ctx.beginPath();build(e/2);ctx.fill()}};
 const strokeG=(c,a,w,build)=>{ctx.beginPath();build();for(const [e,al] of FE){ctx.strokeStyle=rgb(c,al*a);ctx.lineWidth=w+e;ctx.stroke()}};
 const poly=(P,g)=>{const n=P.length;let A=0;for(let i=0;i<n;i++){const b=P[(i+1)%n];A+=P[i][0]*b[1]-b[0]*P[i][1]}const sg=A>0?g:-g;
  for(let i=0;i<n;i++){const a=P[(i+n-1)%n],b=P[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,x=P[i][0]+dy/l*sg,y=P[i][1]-dx/l*sg;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath()};
 const rr=(x,y,w,h,r)=>{ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};
 const sup=(th,n)=>{const c=Math.cos(th),s=Math.sin(th);return [Math.sign(c)*Math.pow(Math.abs(c),2/n),Math.sign(s)*Math.pow(Math.abs(s),2/n)]};
 // iso-lines of a scalar grid as closed loops (marching squares, stitched); the border of the grid must lie below the level
 function contours(f,nx,ny,th){const seg=new Map(),add=(a,b)=>seg.set(a,b);
  for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const k=j*nx+i,code=(f[k]>=th?8:0)|(f[k+1]>=th?4:0)|(f[k+nx+1]>=th?2:0)|(f[k+nx]>=th?1:0);if(!code||code===15)continue;
   const T=2*k,R=2*(k+1)+1,B=2*(k+nx),L=2*k+1;
   switch(code){case 1:add(L,B);break;case 2:add(B,R);break;case 3:add(L,R);break;case 4:add(R,T);break;case 5:add(R,T);add(L,B);break;case 6:add(B,T);break;case 7:add(L,T);break;
    case 8:add(T,L);break;case 9:add(T,B);break;case 10:add(T,L);add(B,R);break;case 11:add(T,R);break;case 12:add(R,L);break;case 13:add(R,B);break;case 14:add(B,L);break}}
  const pt=id=>{const k=id>>1,i=k%nx,j=(k/nx)|0;if(id&1){const a=f[k],b=f[k+nx];return [i,j+(th-a)/(b-a)]}const a=f[k],b=f[k+1];return [i+(th-a)/(b-a),j]};
  const loops=[];while(seg.size){const start=seg.keys().next().value;let cur=start;const L=[];let guard=0;
   while(seg.has(cur)&&guard++<20000){L.push(pt(cur));const nxt=seg.get(cur);seg.delete(cur);cur=nxt;if(cur===start)break}
   if(L.length>3)loops.push(L)}
  return loops}

 const S={};
 // 1 · Consensus: many rough drawings of roughly the same thing arrive one over the other; the form is what they share
 S.consensus={init(g){const R=prng(7),N=36;this.C=g.phone?{x:g.W*.5,y:g.H*.52}:{x:g.F.x+g.F.w*.385,y:g.H*.54};this.R=g.phone?Math.min(g.W*.30,g.H*.33):Math.min(g.H*.37,g.F.w*.185);this.o=[];
   for(let i=0;i<N;i++)this.o.push({dx:(R()-.5)*.26,dy:(R()-.5)*.26,sc:.9+R()*.24,as:1.25*(.9+R()*.2),rot:(R()-.5)*.42,seed:R()*99,wob:.025+R()*.045,
    hx:g.phone?g.W*(.08+R()*.84):this.C.x-(.14+R()*.86)*Math.min(this.C.x-this.R*.45,g.F.w*.72),hy:g.phone?-g.H*.05+R()*g.H*.42:g.H*(.14+R()*.74),hs:.2+R()*.26,hr:(R()-.5)*2.6,tau:i/N*.5});this.mean=null},
  shape(cx,cy,sc,as,rot,seed,wob){const P=[],c=Math.cos(rot),s=Math.sin(rot),R=this.R;for(let k=0;k<84;k++){const th=k/84*6.2832,b=sup(th,2.35),lobe=1+.1*Math.cos(th-.6)+.07*Math.cos(2*th+1.1)+.04*Math.cos(3*th+.4),w=lobe*(1+(seed<0?0:noise(k*.11+seed,seed*.37)*wob+noise(k*.31+seed*2,3.1)*wob*.45)),x=b[0]*as*R*sc*w,y=b[1]*R*sc*w;P.push([cx+x*c-y*s,cy+x*s+y*c])}return P},
  draw(g,P){const C=this.C,f=ss(.6,.98,P);
   if(!this.mean){const A=this.o.map(o=>this.shape(C.x+o.dx*this.R,C.y+o.dy*this.R,o.sc,o.as,o.rot,o.seed,o.wob));this.mean=A[0].map((_,k)=>{let x=0,y=0;for(const a of A){x+=a[k][0];y+=a[k][1]}return [C.x+(x/A.length-C.x)*.93,C.y+(y/A.length-C.y)*.93]})}
   if(f>.003)fillG(mixc(RAMP[4],RAMP[5],.35),f,e=>poly(this.mean,e));
   for(const o of this.o){const t=eio((P-o.tau)/.5),a=lerp(.72,.42,f);
    const Q=this.shape(lerp(o.hx,C.x+o.dx*this.R,t),lerp(o.hy,C.y+o.dy*this.R,t),lerp(o.hs,o.sc,t),lerp(1,o.as,t),lerp(o.hr,o.rot,t),o.seed,o.wob*(1+1.6*(1-t)));
    strokeG(RAMP[0],a,.9,()=>poly(Q,0))}}};
 // 2 · Relief: every mark raises the ground a little where it falls; the land is the sum of them
 S.relief={init(g){const R=prng(19),gs=g.phone?9:12;this.gs=gs;this.nx=Math.ceil(g.W/gs)+3;this.ny=Math.ceil(g.H/gs)+3;this.f=new Float32Array(this.nx*this.ny);this.pts=[];
   const sig=g.H*.085,add=(cx,cy,n,sx,sy,w)=>{for(let i=0;i<n;i++){const a=R()*6.2832,r=Math.sqrt(-2*Math.log(1-R()*.999))*.5;this.pts.push({x:cx+Math.cos(a)*r*sx,y:cy+Math.sin(a)*r*sy,w:w*(.6+R()*.8)})}};
   if(g.phone){add(g.W*.42,g.H*.66,46,g.W*.36,g.H*.3,1);add(g.W*.74,g.H*.86,22,g.W*.24,g.H*.2,1);add(g.W*.3,g.H*.3,10,g.W*.3,g.H*.2,.6)}
   else{const F=g.F;add(F.x+F.w*.36,g.H*.70,70,F.w*.22,g.H*.30,1);add(F.x+F.w*.70,g.H*.86,34,F.w*.17,g.H*.18,1);add(F.x+F.w*.12,g.H*.9,22,F.w*.14,g.H*.14,.8);add(F.x-F.w*.12,g.H*.9,16,F.w*.2,g.H*.14,.6);add(F.x+F.w*.5,g.H*.34,10,F.w*.3,g.H*.14,.5)}
   const x0=Math.min(...this.pts.map(p=>p.x)),x1=Math.max(...this.pts.map(p=>p.x));
   for(const p of this.pts){p.tau=g.phone?cl(p.y/g.H)*.6:cl((p.x-x0)/(x1-x0))*.62;p.s=sig*(.8+R()*.5)}
   this.Z=g.Z;this.max=0;this.field(g,1);for(let k=0;k<this.f.length;k++)if(this.f[k]>this.max)this.max=this.f[k]},
  field(g,P){const {nx,ny,gs,f}=this;f.fill(0);const Z=this.Z;
   for(const p of this.pts){const w=p.w*eio((P-p.tau-.06)/.34);if(w<.003)continue;const rad=p.s*3,i0=Math.max(1,Math.floor((p.x-rad)/gs)+1),i1=Math.min(nx-2,Math.ceil((p.x+rad)/gs)+1),j0=Math.max(1,Math.floor((p.y-rad)/gs)+1),j1=Math.min(ny-2,Math.ceil((p.y+rad)/gs)+1),k=1/(2*p.s*p.s);
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=(i-1)*gs-p.x,dy=(j-1)*gs-p.y;f[j*nx+i]+=w*Math.exp(-(dx*dx+dy*dy)*k)}}
   const fade=g.H*.16;for(let j=1;j<ny-1;j++)for(let i=1;i<nx-1;i++){const x=(i-1)*gs,y=(j-1)*gs;let m=ss(0,fade,x)*ss(0,fade*.6,y);if(g.phone)m*=ss(0,fade,g.W-x)*ss(0,fade,g.H-y);
     if(Z){const d=Math.max(Z.x-x,x-Z.x-Z.w,Z.y-y,y-Z.y-Z.h);if(d<40)m*=ss(0,40,d)}if(m<1)f[j*nx+i]*=m}},
  draw(g,P){const {nx,ny,gs,f}=this;this.field(g,P);
   const T=[.06,.16,.29,.45,.63,.82].map(v=>v*this.max);
   T.forEach((th,b)=>{const L=contours(f,nx,ny,th);if(!L.length)return;const loops=L.map(l=>l.map(q=>[(q[0]-1)*gs,(q[1]-1)*gs]));
    for(const [e,al] of FE){ctx.fillStyle=rgb(b?solid(RAMP[b]):RAMP[0],b?(e?al:1):al);ctx.beginPath();for(const l of loops)poly(l,e/2);ctx.fill('evenodd')}});
   for(const p of this.pts){const a=ss(p.tau-.07,p.tau+.02,P);if(a<.01)continue;ctx.fillStyle=rgb(INK,.6*a);ctx.beginPath();ctx.arc(p.x,p.y,2,0,6.2832);ctx.fill()}}};
 // 3 · Clearing: the small things gather, and the form is the room they leave
 S.clearing={init(g){const R=prng(31),F=g.F,c=g.phone?cl(g.H/20,20,34):cl(g.H/17,24,40);   /* desktop: a coarser grid, ~30% fewer chips (vmacedo.com, 23/11: holds 60 fps at 1440@2) */
   this.c=c;
   this.V=g.phone?{x:g.W*.5,y:g.H*.5,a:g.W*.39,b:g.H*.17}:{x:F.x+F.w*.5,y:g.H*.5,a:Math.min(F.w*.26,400),b:g.H*.2};this.n=g.phone?3.4:4.6;this.ch=[];
   const x0=g.phone?0:Math.max(0,F.x-F.w*.5);
   for(let y=c*.5;y<g.H+c*.3;y+=c)for(let x=x0+c*.5;x<g.W+c*.3;x+=c){const u=g.phone?1:cl((x-x0)/(F.x-x0+F.w*.12));if(R()>Math.pow(u,1.5)*.97+.03)continue;
     this.ch.push({x:x+(R()-.5)*c*.5,y:y+(R()-.5)*c*.5,rot:(R()-.5)*1.3,a:.42+R()*.58,s:c*(.5+R()*.2),k:R()})}
   g.place&&g.place(this.V.x,this.V.y)},
  draw(g,P){const V=this.V,n=this.n,o=eio(P/.52),set=eio((P-.2)/.7);
   for(const q of this.ch){const dx=(q.x-V.x)/V.a,dy=(q.y-V.y)/V.b,m=Math.pow(Math.pow(Math.abs(dx),n)+Math.pow(Math.abs(dy),n),1/n)||1e-4,m2=Math.pow(1.18+Math.pow(m,3.2),1/3.2)+.04,me=lerp(m,m2,o);
    const x=V.x+dx/m*me*V.a,y=V.y+dy/m*me*V.b,d=me-1,t=cl(1-d/1.5),c=col(lerp(.0,1,Math.pow(t,1.6))),al=q.a*lerp(.5,1,t);
    if(x<-20||x>g.W+20||y<-20||y>g.H+20)continue;const top=ss(6,g.c0||46,y);if(top<.02)continue;
    ctx.save();ctx.translate(x,y);ctx.rotate(q.rot*(1-set));const s=q.s;fillG(c,al*top,e=>rr(-s/2-e,-s/2-e,s+2*e,s+2*e,1.5+e));ctx.restore()}}};
 // 4 · Rings: it starts from a core and everything after is laid around it, one layer at a time
 S.rings={init(g){const R=prng(53),n=15;this.n=n;this.K=g.phone?{x:g.W*.5,y:g.H*.52}:{x:g.F.x+g.F.w*.36,y:g.H*.585};this.Rm=g.phone?Math.min(g.W*.45,g.H*.455):Math.min(g.H*.5,g.F.w*.265);
   let u=.1;this.u=[u];for(let j=1;j<n;j++){u+=.6+R()*.9;this.u.push(u)}const top=this.u[n-1];this.u=this.u.map(v=>v/top);this.u[0]=.085;this.sd=R()*50;let ox=0,oy=0;this.off=this.u.map((u,j)=>{if(j){ox+=(R()-.42)*.03*this.Rm*(.4+u);oy+=(R()-.5)*.028*this.Rm*(.4+u)}return [ox,oy]})},
  rad(j,th){const u=this.u[j];return this.Rm*u*(1+(.014+.062*u)*noise(Math.cos(th)*1.5+this.sd+j*.21,Math.sin(th)*1.5+j*.33)+(.004+.012*u)*noise(Math.cos(th)*4+j*.5,Math.sin(th)*4+this.sd))},
  draw(g,P){const n=this.n,K=this.K,G=P*(n+1.2),M=120,gj=j=>eio(cl((G-j)/2.2));
   const prev=new Float32Array(M),cur=[];for(let j=0;j<n;j++){const gg=gj(j);if(gg<=.001)break;const row=new Float32Array(M);for(let k=0;k<M;k++){const r=this.rad(j,k/M*6.2832);row[k]=j?prev[k]+(r-prev[k])*gg:r*gg;prev[k]=row[k]}cur.push(row)}
   for(let j=cur.length-1;j>=0;j--){const Q=[];for(let k=0;k<M;k++){const th=k/M*6.2832;Q.push([K.x+this.off[j][0]+Math.cos(th)*cur[j][k],K.y+this.off[j][1]+Math.sin(th)*cur[j][k]])}
    const c=solid(col(j/(n-1)));for(const [e,al] of FE){ctx.fillStyle=rgb(e?col(j/(n-1)):c,e?al:1);ctx.beginPath();poly(Q,e/2);ctx.fill()}}}};
 // 5 · Weave: single threads, each its own colour, cross until they hold as one cloth (it hangs from the line like everything else on the page)
 S.weave={init(g){const R=prng(71),F=g.F;const nR=g.phone?16:20;this.p=cl((g.H*.84)/nR,13,34);const p=this.p;
   this.X0=g.phone?g.W*.14:F.x+F.w*.15;const nC=Math.max(8,Math.round((g.phone?g.W*.72:Math.min(F.w*.46,g.H*1.05))/p));this.nR=nR;this.nC=nC;this.Y0=g.H*(g.phone?.1:.075);
   this.wf=[];this.wp=[];
   for(let j=0;j<nR;j++)this.wf.push({y:this.Y0+(j+.5)*p,ly:g.H*(.05+.9*(j+.5)/nR)+(R()-.5)*8,xs:this.X0-(g.phone?g.W*(.03+R()*.08):F.w*(.02+R()*.09)),fr:p*(.5+R()*1.6),ph:R()*6.28,c:col(j/(nR-1)),tau:.16+j/nR*.36+R()*.04});
   for(let i=0;i<nC;i++)this.wp.push({c:col(i/(nC-1)),x:this.X0+(i+.5)*p,lx:this.X0+nC*p/2+(i+.5-nC/2)*p*1.55,l0:g.H*(.04+R()*.09),fr:p*(.6+R()*1.5),ph:R()*6.28,tau:i/nC*.26+R()*.03})},
  draw(g,P){const p=this.p,tw=p*.88,Y1=this.Y0+this.nR*p,X1=this.X0+this.nC*p;ctx.lineCap='butt';ctx.lineJoin='round';
   const wf=this.wf.map(w=>{const o=eio((P-w.tau)/.42);return {o,y:lerp(w.ly,w.y,eio((P-.1)/.7)),x1:lerp(w.xs+p*1.2,X1+w.fr,o),w}}),wp=this.wp.map(w=>{const o=eio((P-w.tau)/.4);return {o,x:lerp(w.lx,w.x,eio((P-.08)/.7)),y1:lerp(w.l0,Y1+w.fr,o),w}});
   const line=(c,x0,y0,x1,y1,wob,ph,horiz,body)=>{const n=Math.max(2,Math.round(Math.hypot(x1-x0,y1-y0)/40));ctx.beginPath();for(let k=0;k<=n;k++){const t=k/n,x=lerp(x0,x1,t),y=lerp(y0,y1,t),d=Math.sin(t*5+ph)*wob;k?ctx.lineTo(x+(horiz?0:d),y+(horiz?d:0)):ctx.moveTo(x+(horiz?0:d),y+(horiz?d:0))}
    if(!body)for(const [e,al] of FE.slice(0,2)){ctx.strokeStyle=rgb(c,al);ctx.lineWidth=tw+e;ctx.stroke()}ctx.strokeStyle=rgb(solid(c));ctx.lineWidth=tw;ctx.stroke()};
   const wobF=5*(1-eio((P-.1)/.7));
   for(const t of wf)if(t.o>.002)line(t.w.c,t.w.xs,t.y,t.x1,t.y,wobF,t.w.ph,true);
   for(const t of wp)line(t.w.c,t.x,g.phone?this.Y0-t.w.fr*.8:0,t.x,t.y1,wobF*.7,t.w.ph,false);
   // plain weave: at every other crossing the weft runs over the warp
   wf.forEach((t,j)=>{if(t.o<=.002)return;ctx.strokeStyle=rgb(solid(t.w.c));ctx.lineWidth=tw;ctx.beginPath();wp.forEach((v,i)=>{if((i+j)%2||v.y1<t.y+tw/2||t.x1<v.x+p*.5)return;const d=Math.sin(((v.x-t.w.xs)/(t.x1-t.w.xs))*5+t.w.ph)*wobF;ctx.moveTo(v.x-p*.52,t.y+d);ctx.lineTo(v.x+p*.52,t.y+d)});ctx.stroke()})}};

 function mount(kind){const bay=document.querySelector('#need'),box=bay.querySelector('.endart'),cv=box.querySelector('canvas'),cta=bay.querySelector('.cta'),sc=S[kind],wide=matchMedia('(min-width:821px)'),still=matchMedia('(prefers-reduced-motion: reduce)');
  ctx=cv.getContext('2d');let g={},P=0,tPrev=null,raf=0,forced=null;const DUR=2.4;
  const size=()=>{const r=cv.getBoundingClientRect();if(!r.width||!r.height)return;let D=Math.min(2,devicePixelRatio||1);while(r.width*r.height*D*D>7e6&&D>1)D-=.25;
   cv.width=Math.round(r.width*D);cv.height=Math.round(r.height*D);ctx.setTransform(D,0,0,D,0,0);const phone=!wide.matches,W=r.width,H=r.height,fw=Math.min(W,innerWidth);
   g={W,H,phone,F:phone?{x:0,y:0,w:W,h:H}:{x:W-fw,y:0,w:fw,h:H},Z:null,place:(x,y)=>{const b=bay.getBoundingClientRect();bay.style.setProperty('--vx',(r.left-b.left+x)+'px');bay.style.setProperty('--vy',(r.top-b.top+y)+'px')}};
   if(cta&&kind!=='clearing'){const c=cta.getBoundingClientRect();if(c.bottom>r.top&&c.top<r.bottom)g.Z={x:c.left-r.left-26,y:c.top-r.top-40,w:c.width+70,h:c.height+70}}
   sc.init(g)};
  const target=()=>{const r=cv.getBoundingClientRect();if(forced!==null)return forced;if(still.matches)return 1;return g.phone?cl((innerHeight-r.top)/(r.height*.96)):cl(1-(r.left+g.F.x)/innerWidth)};
  const paint=()=>{ctx.clearRect(0,0,g.W,g.H);sc.draw(g,P)};
  const clock=()=>window.__endT!=null?window.__endT:performance.now()/1000;
  const step=()=>{raf=0;if(!g.W)size();if(!g.W)return;const t=clock(),dt=tPrev===null?1/60:Math.min(.1,t-tPrev);tPrev=t;const PT=target(),d=PT-P,m=dt/DUR;P+=Math.max(-m*2.5,Math.min(m,d));if(still.matches||forced!==null)P=PT;paint();
   if(Math.abs(PT-P)>.0004&&window.__endT==null)raf=requestAnimationFrame(step);else if(window.__endT==null)tPrev=null};
  const kick=()=>{if(!raf&&window.__endT==null)raf=requestAnimationFrame(step)};
  addEventListener('scroll',kick,{passive:true});addEventListener('resize',()=>{size();kick()});new ResizeObserver(()=>{size();kick()}).observe(box);
  document.fonts&&document.fonts.ready.then(()=>{size();kick()});
  size();kick();
  window.__endFrame=step;window.__endSet=p=>{forced=p;if(p!==null){size();step()}};return {kind}}
 window.Endings={mount,kinds:Object.keys(S)};
})();
