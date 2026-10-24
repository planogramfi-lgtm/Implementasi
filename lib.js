const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m,ok){const t=$('toast');t.textContent=m;t.style.background=ok?'#2e9e6b':'#d64545';t.style.display='block';setTimeout(()=>t.style.display='none',3500)}
function done(m){$('ovm').textContent=m;$('ov').style.display='flex'}
let _sh;
function warn(el,label){toast('Isi '+label+' dulu',0);el.classList.add('miss');el.scrollIntoView({block:'center'});setTimeout(()=>el.classList.remove('miss'),2000)}
function Seq(f){const chk=n=>{for(let j=0;j<n;j++)if(!f[j].el.value.trim()){warn(f[j].el,f[j].label);return true}return false};f.forEach((x,i)=>x.el._guard=()=>chk(i));return()=>chk(f.length)}
function Combo(inp,arr){inp._arr=arr;if(inp._ok)return;inp._ok=1;inp.readOnly=true;inp.setAttribute('inputmode','none');
 const w=document.createElement('span');w.className='cw';inp.parentNode.insertBefore(w,inp);w.appendChild(inp);inp.addEventListener('click',()=>pick(inp))}
function shDraw(){const i=_sh._i,sb=i._sub||{},q=$('shq').value.trim().toLowerCase(),a=(i._arr||[]).filter(x=>(String(x)+' '+(sb[x]||'')).toLowerCase().includes(q)).slice(0,200),sel=i._sel||[];
 const all=(i._opt&&!q)?'<div class="o" data-v=""><b>'+esc(i._opt)+'</b></div>':'';
 $('shl').innerHTML=all+(a.length?a.map(x=>{const d=i._dis?i._dis(x):'',h=i._hint?i._hint(x):'';return '<div class="o'+(d?' dis':'')+'" data-v="'+esc(x)+'">'+(i._multi?(sel.includes(x)?'☑ ':'☐ '):'')+esc(x)+(d?'<small>'+esc(d)+'</small>':(h?'<small>'+esc(h)+'</small>':(sb[x]?'<small>'+esc(sb[x])+'</small>':'')))+'</div>'}).join(''):'<p class="mut">'+((i._arr||[]).length?'Tidak ditemukan':'Belum ada pilihan (isi kolom sebelumnya dulu)')+'</p>')}
function pick(inp){
 if(inp._guard&&inp._guard())return;
 if(!_sh){_sh=document.createElement('div');_sh.id='sh';_sh.innerHTML='<div class="shb"><div class="sht"><b id="sht"></b><button type="button" id="shx">✕</button></div><input id="shq" placeholder="Ketik untuk mencari…" autocomplete="off"><div id="shl"></div><div id="shm" style="display:none;gap:8px;margin-top:8px"><button type="button" class="btn s" id="sha" style="margin:0">Pilih semua</button><button type="button" class="btn" id="shd" style="margin:0;flex:1">Selesai</button></div></div>';document.body.appendChild(_sh);
  const cl=()=>{const i=_sh._i;_sh.style.display='none';if(i._multi)i.dispatchEvent(new Event('change',{bubbles:true}))};
  _sh.addEventListener('click',e=>{if(e.target===_sh||e.target.id==='shx'||e.target.id==='shd')cl();else if(e.target.id==='sha'){const i=_sh._i;i._sel=(i._sel||[]).length===(i._arr||[]).length?[]:(i._arr||[]).slice();i.value=i._sel.join(', ');shDraw()}});$('shq').addEventListener('input',shDraw);
  $('shl').addEventListener('click',e=>{const t=e.target.closest('.o');if(!t||t.classList.contains('dis'))return;const i=_sh._i;
   if(i._multi){const s=new Set((i._sel||[]).map(String)),v=t.dataset.v;s.has(v)?s.delete(v):s.add(v);i._sel=(i._arr||[]).filter(x=>s.has(String(x)));i.value=i._sel.join(', ');shDraw();return}
   i.value=t.dataset.v;_sh.style.display='none';i.dispatchEvent(new Event('change',{bubbles:true}))})}
 _sh._i=inp;const lb=inp.parentNode.previousElementSibling;$('sht').textContent=inp._title||((lb&&lb.classList.contains('l'))?lb.textContent:'Pilih No Rak');$('shq').value='';$('shm').style.display=inp._multi?'flex':'none';$('sha').style.display=inp._noall?'none':'';shDraw();_sh.style.display='block'}
function need(inp,arr,name){if(!arr.includes(inp.value.trim()))throw name+' belum dipilih / tidak valid';return inp.value.trim()}
function Cal(inp,noPast){const pop=document.createElement('div');pop.className='cal';inp.parentNode.style.position='relative';inp.parentNode.appendChild(pop);let d=new Date();d.setDate(1);
 const iso=(y,m,k)=>y+'-'+String(m+1).padStart(2,'0')+'-'+String(k).padStart(2,'0');
 function draw(){const T=new Date(),ti=iso(T.getFullYear(),T.getMonth(),T.getDate()),y=d.getFullYear(),m=d.getMonth(),n=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7;
  let h='<div class="ch"><b data-n="-1">‹</b><span>'+d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})+'</span><b data-n="1">›</b></div><div class="cg">'+['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=>'<i>'+x+'</i>').join('')+'<s></s>'.repeat(off);
  for(let i=1;i<=n;i++){const mon=new Date(y,m,i).getDay()===1&&(!noPast||iso(y,m,i)>=ti);h+='<u class="'+(mon?'mon':'off')+'" data-d="'+(mon?iso(y,m,i):'')+'">'+i+'</u>'}pop.innerHTML=h+'</div>'}
 pop.onclick=e=>{const t=e.target;if(t.dataset.n){d.setMonth(d.getMonth()+ +t.dataset.n);draw()}else if(t.dataset.d){inp.value=t.dataset.d;pop.style.display='none';inp.dispatchEvent(new Event('change'))}};
 inp.readOnly=true;inp.onclick=()=>{if(inp._guard&&inp._guard())return;draw();pop.style.display='block'};document.addEventListener('click',e=>{if(e.target!==inp&&!pop.contains(e.target))pop.style.display='none'})}
function compress(file,cb){const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const s=Math.min(1,2000/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};i.src=r.result};r.readAsDataURL(file)}
function Rows(box,raks,guard,cb,dis,opt){opt=opt||{};const man=()=>!!(opt.manual&&opt.manual());
 function add(){const r=document.createElement('div');r.className='row';const m=man();
 r.innerHTML='<div class="rh"><input class="rak" placeholder="'+(m?'Ketik no rak, pisahkan koma (contoh: DA1, DA2, DA3)':'Pilih No Rak (boleh lebih dari satu)')+'"><button class="x" type="button">✕</button></div>'
 +(opt.notes?'<input class="nts" maxlength="100" placeholder="Tulis keterangan misal : Khusus 3 Rak, Khusus 4 Rak, Ecolog, dll" style="margin-top:8px">':'')
 +(opt.ket?'<input class="ket" maxlength="150" placeholder="Tulis keterangan misal: PLU (New Item), Update Rak, dll" style="margin-top:8px">':'')
 +'<label class="btn s">📷 Kamera<input type="file" accept="image/*" capture="environment" hidden></label><label class="btn s">🖼️ Galeri<input type="file" accept="image/*" hidden></label><img class="pv" hidden>';
 box.appendChild(r);const ri=r.querySelector('.rak'),nt=r.querySelector('.nts'),kt=r.querySelector('.ket');ri._sel=[];ri._guard=guard;
 if(m){ri.addEventListener('focus',()=>{if(guard&&guard())ri.blur()});
  ri.addEventListener('input',()=>{ri._sel=[...new Set(ri.value.split(/[,;\n]+/).map(x=>x.trim().replace(/\s+/g,' ').toUpperCase()).filter(Boolean))];cb&&cb()})}
 else{Combo(ri,raks);ri._multi=1;ri._noall=1;ri._title='No Rak (boleh lebih dari satu)';
  ri._dis=x=>(dis&&dis(x))||([...box.querySelectorAll('.rak')].some(e=>e!==ri&&(e._sel||[]).includes(x))?'Sudah dipilih di baris lain':'');
  ri._hint=x=>opt.hint?opt.hint(x):''}
 // urutan isi: info posting > ... > no rak > keterangan > foto (tidak boleh lompat)
 const ord=el=>el.addEventListener('focus',()=>{if(guard&&guard()){el.blur();return}if(!(ri._sel||[]).length){el.blur();warn(ri,'No Rak')}});
 if(nt)ord(nt);if(kt)ord(kt);
 r.querySelectorAll('label.btn').forEach(l=>l.addEventListener('click',e=>{if(guard&&guard()){e.preventDefault();return}if(!(ri._sel||[]).length){e.preventDefault();warn(ri,'No Rak');return}if(kt&&!kt.value.trim()){e.preventDefault();warn(kt,'Keterangan')}}));
 r.querySelectorAll('input[type=file]').forEach(f=>f.onchange=()=>{if(f.files[0])compress(f.files[0],u=>{r._d=u;const p=r.querySelector('.pv');p.src=u;p.hidden=false;f.value='';cb&&cb()})});
 r.querySelector('.x').onclick=()=>{if(box.children.length>1){r.remove();cb&&cb()}}}
 add();return{add,tryAdd(){for(const r of box.children)if(!r._d){toast('Upload gambar dulu sebelum tambah rak',0);r.classList.add('miss');r.scrollIntoView({block:'center'});setTimeout(()=>r.classList.remove('miss'),2000);return}add()},reset(){box.innerHTML='';add();cb&&cb()},count(){return[...box.children].filter(r=>r._d).length},get(){const o=[],m=man();for(const r of box.children){const ri=r.querySelector('.rak'),ks=ri._sel||[];if(!ks.length)throw 'No rak belum dipilih';
 ks.forEach(k=>{if(m){if(!/^[A-Z0-9][A-Z0-9 ._\/-]{0,29}$/.test(k))throw 'No rak "'+k+'" tidak valid (huruf/angka, maks 30 karakter)'}else if(!raks.includes(k))throw 'No rak "'+k+'" tidak ada di MASTER RAK'});
 const kt=r.querySelector('.ket'),nt=r.querySelector('.nts');if(kt&&!kt.value.trim())throw 'Keterangan rak '+ks.join(', ')+' belum diisi';if(!r._d)throw 'Foto untuk rak '+ks.join(', ')+' belum dipilih';
 o.push({raks:ks.slice(),ket:kt?kt.value.trim():undefined,notes:nt?nt.value.trim():undefined,data:r._d.split(',')[1]})}
 const all=o.reduce((a,x)=>a.concat(x.raks),[]);if(new Set(all).size<all.length)throw 'Ada no rak yang dobel';return o}}}
function dshF(f,b){document.querySelectorAll('.dsh-f button').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.rsec').forEach(s=>s.style.display=(f==='all'||s.dataset.s===f)?'':'none')}
function resHTML(r,btn){
 const A=r.sudah.slice().sort((a,b)=>b.pct-a.pct||b.foto-a.foto),Z=r.belum,fo=A.reduce((a,x)=>a+x.foto,0),tu=A.reduce((a,x)=>a+x.toko,0),tt=A.concat(Z).reduce((a,x)=>a+x.total,0),pt=tt?Math.round(tu*1000/tt)/10:0;
 const C=2*Math.PI*44,off=C*(1-r.pct/100);
 const donut='<svg viewBox="0 0 120 120" width="118" height="118"><circle cx="60" cy="60" r="44" fill="none" stroke="#F5C6C6" stroke-width="14"/><circle cx="60" cy="60" r="44" fill="none" stroke="#4CAF73" stroke-width="14" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 60 60)"/><text x="60" y="60" text-anchor="middle" font-size="26" font-weight="800" fill="#12355b">'+r.pct+'%</text><text x="60" y="78" text-anchor="middle" font-size="11" fill="#6b7c93">branch upload</text></svg>';
 const card=(x,ok)=>'<div class="rc '+(ok?'ok':'no')+'"><div class="t"><div><b>'+esc(x.nama)+'</b><div class="sb">'+(ok?x.foto+' foto • '+x.toko+' dari '+x.total+' toko':'Belum ada toko yang upload • '+x.total+' toko')+'</div></div><div class="pc2">'+(ok?x.pct:0)+'%<small>toko upload</small></div></div>'
  +'<div class="bar"><i style="width:'+(ok?Math.max(x.pct>0?3:0,Math.min(100,x.pct)):0)+'%"></i></div>'
  +'<div class="ft"><span class="st">'+(ok?'✓ Sudah upload':'✕ Belum upload')+'</span>'+(ok&&btn?'<button data-b="'+esc(x.nama)+'">Lihat foto</button>':'')+'</div></div>';
 return '<div class="dsh-t"><b>📊 Dashboard Implementasi</b><small>Periode '+esc(r.p)+'</small></div>'
 +'<div class="dsh-hero">'+donut+'<div class="lg"><div class="li"><i style="background:#4CAF73"></i>Sudah upload<b>'+r.done+'</b></div><div class="li"><i style="background:#F5C6C6"></i>Belum upload<b>'+Z.length+'</b></div><div class="li" style="font-size:12.5px;color:#6b7c93">dari '+r.total+' branch</div></div></div>'
 +'<div class="dsh-k"><div><b>'+tu+'</b><small>toko sudah upload dari '+tt+' ('+pt+'%)</small></div><div><b>'+fo+'</b><small>total foto masuk</small></div></div>'
 +'<div class="dsh-g">🟢 Hijau = sudah upload &nbsp;•&nbsp; 🔴 Merah = belum upload. Persen di kanan = toko yang sudah upload di branch itu.'+(btn?' Tekan Lihat foto untuk membuka fotonya.':'')+'</div>'
 +'<div class="dsh-f"><button class="on" onclick="dshF(\'all\',this)">Semua ('+(A.length+Z.length)+')</button><button onclick="dshF(\'ok\',this)">✓ Sudah ('+A.length+')</button><button onclick="dshF(\'no\',this)">✕ Belum ('+Z.length+')</button></div>'
 +'<div class="rsec" data-s="no"><div class="dsh-h"><span class="dot" style="background:#E57373"></span>Perlu ditindaklanjuti<span class="n" style="background:#F9D3D3;color:#8E2A2A">'+Z.length+' branch</span></div>'+(Z.length?Z.map(x=>card(x,0)).join(''):'<p class="mut">Semua branch sudah upload 🎉</p>')+'</div>'
 +'<div class="rsec" data-s="ok"><div class="dsh-h"><span class="dot" style="background:#4CAF73"></span>Sudah upload<span class="n" style="background:#CBEAD4;color:#1B5E32">'+A.length+' branch</span></div>'+(A.length?A.map(x=>card(x,1)).join(''):'<p class="mut">Belum ada</p>')+'</div>'}
function Tabs(onH){document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.tab').forEach(s=>s.hidden=s.id!==b.dataset.t);if(onH)onH(b.dataset.t)})}
function Tbl(box,h,rs,msg){box.innerHTML=rs.length?'<div class="wrap"><table><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+rs.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</table></div>':'<p class="mut">'+(msg||'Belum ada riwayat upload')+'</p>'}
function Fil(box,h,rs,fc){if(!rs.length){box.innerHTML='<p class="mut">Belum ada riwayat upload</p>';return}
 const st={q:'',f:{},n:50};
 box.innerHTML='<div class="card"><input class="fq" placeholder="🔍 Cari (no rak, toko, PIC, dll)"><div class="fg">'+fc.map(c=>{const v=[...new Set(rs.map(r=>String(r[c])))].sort();if(/Tgl/.test(h[c]))v.reverse();return '<select data-c="'+c+'"><option value="">Semua '+esc(h[c])+'</option>'+v.map(x=>'<option>'+esc(x)+'</option>').join('')+'</select>'}).join('')+'</div><div class="fi"><span class="fc mut"></span><button type="button" class="btn s fr">↺ Reset</button></div></div><div class="ft"></div><button type="button" class="btn s fm" style="width:100%" hidden></button>';
 const q=s=>box.querySelector(s);
 function draw(){const a=rs.filter(r=>Object.keys(st.f).every(c=>!st.f[c]||String(r[c])===st.f[c])&&(!st.q||r.join(' ').toLowerCase().includes(st.q)));
  q('.fc').textContent='Menampilkan '+Math.min(st.n,a.length)+' dari '+a.length+' data';
  Tbl(q('.ft'),h,a.slice(0,st.n),a.length?'':'Tidak ada data yang cocok');
  const m=q('.fm');m.hidden=a.length<=st.n;m.textContent='Tampilkan '+Math.min(50,a.length-st.n)+' lagi'}
 q('.fq').oninput=e=>{st.q=e.target.value.trim().toLowerCase();st.n=50;draw()};
 box.querySelectorAll('select').forEach(s=>s.onchange=()=>{st.f[s.dataset.c]=s.value;st.n=50;draw()});
 q('.fr').onclick=()=>{st.q='';st.f={};st.n=50;q('.fq').value='';box.querySelectorAll('select').forEach(s=>s.value='');draw()};
 q('.fm').onclick=()=>{st.n+=50;draw()};draw()}
function Hist(box,jenis,who){box.innerHTML='<p class="mut">Memuat…</p>';google.script.run.withSuccessHandler(rs=>Fil(box,['Tgl Info Posting','Branch','Tipe Toko',who,'No Rak','Jenis Rak'],rs,jenis==='PLANOGRAM'?[0,1,2,3,5]:[0,1,2,5])).withFailureHandler(e=>box.innerHTML='<p class="mut">'+esc(e.message)+'</p>').getHistory(jenis)}
const PAL=['#1E6FD9','#E8590C','#2F9E44','#9C36B5','#D6336C','#0C8599','#B7791F','#5F3DC4','#C92A2A','#5C940D','#495057','#6D4C41'];
function bcol(n){const L=(typeof M!=='undefined'&&M&&M.branches)||[];let i=L.indexOf(n);if(i<0){i=0;for(const c of String(n))i=(i*31+c.charCodeAt(0))%997}return PAL[i%PAL.length]}
// Riwayat upload HO: tampilan seperti Info Posting, per branch (warna beda tiap branch) + filter tanggal & branch
function Riw(box){
 let D=null,fb='';const q=s=>box.querySelector(s);
 const sp=(a,s)=>a.map(x=>'<span style="color:'+x.c+';font-weight:700">'+esc(x.t)+'</span>').join(s||', ');
 const th=['Tipe Toko','Kode','Jenis','Rak Reguler','Rak Non Reguler','PIC Rak','Keterangan'];
 const blk=b=>'<div class="bbox" style="--bc:'+bcol(b.branch)+'"><div class="bh"><span class="bn">🏬 '+esc(b.name||b.branch)+'</span><span class="bs">'+b.nTipe+' tipe toko • '+b.nRak+' rak<br>terakhir upload '+esc(b.waktu)+'</span></div><div class="wrap"><table class="bt"><tr>'+th.map(x=>'<th>'+x+'</th>').join('')+'</tr>'
  +b.groups.map(g=>(g.label?'<tr class="bg"><td colspan="7">'+esc(g.label)+'</td></tr>':'')+g.rows.map(w=>'<tr><td>'+esc(w.ukuran)+'</td><td>'+esc(w.kode)+'</td><td>'+esc(w.jenis)+'</td><td>'+sp(w.raks,'; ')+'</td><td>'+sp(w.rakNR,'; ')+'</td><td>'+sp(w.pics)+'</td><td>'+sp(w.ket,'; ')+'</td></tr>').join('')).join('')+'</table></div></div>';
 function res(){const a=D.branches.filter(b=>!fb||b.branch===fb);
  q('.rres').innerHTML=a.length?a.map(blk).join(''):'<p class="mut">Belum ada upload untuk pilihan ini</p>';
  box.querySelectorAll('.chip').forEach(c=>c.style.opacity=(!fb||c.dataset.b===fb)?1:.4)}
 function frame(){
  if(!D.p){box.innerHTML='<p class="mut">Belum ada riwayat upload</p>';return}
  if(!D.branches.some(b=>b.branch===fb))fb='';
  box.innerHTML='<div class="card"><label class="l" style="margin-top:0">Tanggal Info Posting</label><select class="rpd">'+D.periods.map(x=>'<option'+(x===D.p?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select>'
   +'<label class="l">Branch</label><select class="rbf"><option value="">Semua Branch ('+D.branches.length+')</option>'+D.branches.map(b=>'<option value="'+esc(b.branch)+'"'+(b.branch===fb?' selected':'')+'>'+esc(b.name||b.branch)+'</option>').join('')+'</select>'
   +'<div class="chips">'+D.branches.map(b=>'<button type="button" class="chip" data-b="'+esc(b.branch)+'" style="--bc:'+bcol(b.branch)+'">'+esc(b.name||b.branch)+'</button>').join('')+'</div>'
   +(D.pics.length?'<div style="margin-top:10px;font-size:12px"><b>PIC:</b> '+D.pics.map(p=>'<span style="color:'+p.c+';font-weight:700">● '+esc(p.name)+'</span>').join(' &nbsp; ')+'</div>':'')+'</div><div class="rres"></div>';
  q('.rpd').onchange=e=>{box.innerHTML='<p class="mut">Memuat…</p>';load(e.target.value)};
  q('.rbf').onchange=e=>{fb=e.target.value;res()};
  box.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{fb=(fb===c.dataset.b)?'':c.dataset.b;q('.rbf').value=fb;res()});
  res()}
 function load(p){google.script.run.withSuccessHandler(r=>{D=r;frame()}).withFailureHandler(e=>box.innerHTML='<p class="mut">'+esc(e.message)+'</p>').getRiwayatHO(p||'')}
 box.innerHTML='<p class="mut">Memuat…</p>';load('')}
