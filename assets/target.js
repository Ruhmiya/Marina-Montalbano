(()=>{
const rings=[
 {radius:443,words:['Recherche utilisateur','Profils utilisateurs','Flux utilisateurs','Système de conception','Conception UI','Architecture de l’information']},
 {radius:323,words:['Innovation','Accessibilité','Stratégie','Entretiens','Recherche','Collaboration','Empathie','Prototypage']},
 {radius:211,words:['Figma','UX/UI','Parcours','Impact','Tests','Flux','UI']}
];
const svg=document.getElementById('career-target');
if(!svg)return;
const ns='http://www.w3.org/2000/svg';
const button=document.getElementById('target-motion-toggle');
const section=svg.closest('.target-section');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function element(tag,parent){
 const node=document.createElementNS(ns,tag);
 parent.appendChild(node);
 return node;
}
function render(){
 svg.querySelectorAll('.target-ring').forEach(node=>node.remove());
 rings.forEach(({radius:r,words},index)=>{
  const group=element('g',svg);
  group.setAttribute('class','target-ring');
  group.setAttribute('aria-hidden','true');
  group.style.setProperty('--duration',(180+index*25)+'s');
  group.style.setProperty('--direction',index%2?'reverse':'normal');
  const labels=words.map(word=>{
   const text=element('text',group);
   text.setAttribute('class','target-ring-text');
   text.style.fontSize='38px';
   text.textContent=window.translateSite(word);
   return {text,label:text.textContent,length:text.getComputedTextLength()};
  });
  const circumference=2*Math.PI*r;
  const total=labels.reduce((sum,item)=>sum+item.length,0);
  const factor=Math.min(1,(circumference-words.length*32)/Math.max(total,1));
  const gap=(circumference-total*factor)/words.length;
  let start=-Math.PI/2-labels[0].length*factor/(2*r);
  labels.forEach(({text,label,length},i)=>{
   const width=length*factor;
   const middle=start+width/(2*r);
   const reverse=Math.sin(middle)>0;
   const a=middle+(reverse?1:-1)*Math.PI/2;
   const path=element('path',group);
   path.id='target-arc-'+index+'-'+i;
   const x=r*Math.cos(a),y=r*Math.sin(a);
   path.setAttribute('d','M '+x+' '+y+' A '+r+' '+r+' 0 0 '+(reverse?0:1)+' '+(-x)+' '+(-y));
   path.setAttribute('fill','none');
   text.textContent='';
   text.style.fontSize=(38*factor)+'px';
   text.setAttribute('text-anchor','middle');
   const tp=element('textPath',text);
   tp.setAttribute('href','#'+path.id);
   tp.setAttribute('startOffset','50%');
   tp.textContent=label;
   const angle=start+(width+gap/2)/r;
   const dot=element('circle',group);
   dot.setAttribute('cx',r*Math.cos(angle));dot.setAttribute('cy',r*Math.sin(angle));
   dot.setAttribute('r','5');dot.setAttribute('fill','#f4c562');
   start+=(width+gap)/r;
  });
 });
 button.querySelector('span').textContent=window.translateSite(section.classList.contains('target-paused')?'Reprendre l’animation':'Mettre l’animation en pause');
}
function syncMotion(){button.hidden=reduced.matches;section.classList.toggle('target-reduced',reduced.matches);}
syncMotion();reduced.addEventListener('change',syncMotion);
button.addEventListener('click',()=>{const paused=section.classList.toggle('target-paused');button.setAttribute('aria-pressed',String(paused));button.querySelector('span').textContent=window.translateSite(paused?'Reprendre l’animation':'Mettre l’animation en pause');});
document.addEventListener('site-language-change',render);
render();
if(document.fonts)document.fonts.ready.then(render);
})();