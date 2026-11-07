(()=>{
const rings=[
 {radius:440,words:["Empathie","Curiosité","Observation","Accessibilité","Collaboration","Communication","Recherche utilisateur","Entretiens","Profils utilisateurs","Normes d’accessibilité"],mobile:["Empathie","Accessibilité","Collaboration","Recherche utilisateur","Profils utilisateurs"]},
 {radius:365,words:["Architecture de l’information","Flux utilisateurs","Cartographie des parcours","Maquettes filaires","Conception UX","Tests","Résolution de problèmes"],mobile:["Architecture de l’information","Flux utilisateurs","Entretiens","Tests"]},
 {radius:290,words:["Conception UI","Conception visuelle","Système de conception","Composants","Mise en page automatique","Prototypage","Animation"],mobile:["Conception UI","Système de conception","Prototypage"]},
 {radius:215,words:["Figma","Balsamiq","Miro","Adaptation aux écrans","Performance","GitHub"],mobile:["Figma","Miro","Performance"]},
 {radius:140,words:["Vision produit","Stratégie","Innovation","Rétrospective","Point quotidien","Impact"],mobile:["Stratégie","Innovation","Impact"]}
];
const svg=document.getElementById('career-target');
if(!svg)return;
const ns="http://www.w3.org/2000/svg",button=document.getElementById('target-motion-toggle'),section=svg.closest('.target-section');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let compactMode=null;
function renderRings(compact){
 svg.querySelectorAll('.target-ring').forEach(node=>node.remove());
 rings.forEach((ring,index)=>{
  const group=document.createElementNS(ns,'g');group.setAttribute('class','target-ring');
  group.style.setProperty('--duration',(110+index*20)+'s');group.style.setProperty('--direction',index%2?'reverse':'normal');
  const path=document.createElementNS(ns,'path'),id='career-ring-'+index,r=ring.radius;
  path.setAttribute('id',id);path.setAttribute('d','M '+r+' 0 A '+r+' '+r+' 0 1 1 '+(-r)+' 0 A '+r+' '+r+' 0 1 1 '+r+' 0');path.setAttribute('fill','none');group.appendChild(path);
  const words=compact?ring.mobile:ring.words;
  words.forEach((word,i)=>{
   const text=document.createElementNS(ns,'text');text.setAttribute('class','target-ring-text');text.setAttribute('text-anchor','middle');
   const tp=document.createElementNS(ns,'textPath');tp.setAttribute('href','#'+id);tp.setAttribute('startOffset',(((i+.5)/words.length)*100)+'%');tp.dataset.words=JSON.stringify([word]);
   text.appendChild(tp);group.appendChild(text);
  });
  group.setAttribute('aria-hidden','true');svg.appendChild(group);
 });
}
function localizeTarget(){
 const t=window.translateSite;
 svg.querySelectorAll('textPath').forEach(el=>{el.textContent=JSON.parse(el.dataset.words).map(k=>t(k)).join('');});
 spaceRingLabels();
 button.querySelector('span').textContent=t(section.classList.contains('target-paused')?'Reprendre l’animation':'Mettre l’animation en pause');
}
function spaceRingLabels(){
 const scale=svg.getBoundingClientRect().width/1000;
 if(!scale)return;
 svg.querySelectorAll('.target-ring').forEach((group,index)=>{
  const circumference=2*Math.PI*rings[index].radius;
  const gap=12/scale;
  let used=0;
  const labels=[];
  group.querySelectorAll('text').forEach(text=>{
   text.style.display='';
   const path=text.querySelector('textPath');
   const length=text.getComputedTextLength();
   if(used+length+gap>circumference){
    text.style.display='none';
    return;
   }
   labels.push({path,length});
   used+=length+gap;
  });
  let offset=0;
  const spacing=gap+(circumference-used)/(labels.length||1);
  labels.forEach(({path,length})=>{
   path.setAttribute('startOffset',((offset+(length+spacing)/2)/circumference*100)+'%');
   offset+=length+spacing;
  });
 });
}
function syncRingFont(){
 const width=svg.getBoundingClientRect().width||600,scale=width/1000;
 const textScale=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--text-scale'))||1;
 svg.querySelectorAll('.target-ring-text').forEach(el=>{el.style.fontSize=(14*textScale/scale)+'px';});
 const compact=width<430,title=svg.querySelector('.target-center-title'),role=svg.querySelector('.target-center-role');
 if(title)title.style.fontSize=((compact?11:16)/scale)+'px';
 if(role)role.style.fontSize=((compact?8:12)/scale)+'px';
}
function syncLayout(){
 const compact=svg.getBoundingClientRect().width < 520;
 if(compact!==compactMode){renderRings(compact);compactMode=compact;}
 syncRingFont();localizeTarget();
}
function syncMotion(){button.hidden=reduced.matches;section.classList.toggle('target-reduced',reduced.matches);}
syncMotion();reduced.addEventListener('change',syncMotion);
button.addEventListener('click',()=>{const paused=section.classList.toggle('target-paused');button.setAttribute('aria-pressed',String(paused));localizeTarget();});
document.addEventListener('site-language-change',localizeTarget);
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(syncLayout,120);});
syncLayout();
if(document.fonts)document.fonts.ready.then(syncLayout);
new ResizeObserver(syncLayout).observe(svg);
})();