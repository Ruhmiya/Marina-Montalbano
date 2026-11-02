(()=>{
const rings = [
  {
    radius: 430,
    words: ["Empathy","Curiosity","Observation","Accessibility","Collaboration","Communication","User Research","Interviews","Personas"]
  },
  {
    radius: 340,
    words: ["Information Architecture","User Flow","Journey Mapping","Wireframes","UX Design","Testing","Problem Solving"]
  },
  {
    radius: 255,
    words: ["UI Design","Visual Design","Design System","Components","Auto Layout","Prototyping","Motion Design"]
  },
  {
    radius: 175,
    words: ["FIGMA","Balsamiq","Miro","Responsive","Performance","WCAG","GitHub"]
  },
  {
    radius: 100,
    words: ["Product Thinking","Strategy","Innovation","Rétrospective","Daily","Impact"]
  }
];


const svg=document.getElementById('career-target');
if(!svg)return;
const ns="http://www.w3.org/2000/svg";
rings.forEach((ring,index)=>{
 const group=document.createElementNS(ns,'g');
 group.setAttribute('class','target-ring');
 group.style.setProperty('--duration',(65+index*12)+'s');
 group.style.setProperty('--direction',index%2?'reverse':'normal');
 const path=document.createElementNS(ns,'path');
 const id='career-ring-'+index,r=ring.radius;
 path.setAttribute('id',id);
 path.setAttribute('d','M '+r+' 0 A '+r+' '+r+' 0 1 1 '+(-r)+' 0 A '+r+' '+r+' 0 1 1 '+r+' 0');
 path.setAttribute('fill','none');group.appendChild(path);
 const text=document.createElementNS(ns,'text');text.setAttribute('class','target-ring-text');
 const textPath=document.createElementNS(ns,'textPath');textPath.setAttribute('href','#'+id);
 textPath.setAttribute('textLength',String(2*Math.PI*r*.95));
 textPath.setAttribute('lengthAdjust','spacing');
 textPath.textContent=ring.words.join(' • ')+' •';
 text.appendChild(textPath);group.appendChild(text);
 group.setAttribute('aria-hidden','true');svg.appendChild(group);
});
const button=document.getElementById('target-motion-toggle');
const section=svg.closest('.target-section');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function syncMotion(){button.hidden=reduced.matches;section.classList.toggle('target-reduced',reduced.matches);}
syncMotion();reduced.addEventListener('change',syncMotion);
button.addEventListener('click',()=>{
 const paused=section.classList.toggle('target-paused');
 button.setAttribute('aria-pressed',String(paused));
 const label=button.querySelector('span');
 label.dataset.fr=paused?'Reprendre l’animation':'Mettre l’animation en pause';
 label.dataset.en=paused?'Resume animation':'Pause animation';
 label.textContent=document.documentElement.lang==='en'?label.dataset.en:label.dataset.fr;
});
})();