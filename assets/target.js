(()=>{
const rings = [{"radius": 430, "words": ["Empathie", "Curiosité", "Observation", "Accessibilité", "Collaboration", "Communication", "Recherche utilisateur", "Entretiens", "Profils utilisateurs"]}, {"radius": 340, "words": ["Architecture de l’information", "Flux utilisateurs", "Cartographie des parcours", "Maquettes filaires", "Conception UX", "Tests", "Résolution de problèmes"]}, {"radius": 255, "words": ["Conception UI", "Conception visuelle", "Système de conception", "Composants", "Mise en page automatique", "Prototypage", "Animation"]}, {"radius": 175, "words": ["Figma", "Balsamiq", "Miro", "Adaptation aux écrans", "Performance", "Normes d’accessibilité", "GitHub"]}, {"radius": 100, "words": ["Vision produit", "Stratégie", "Innovation", "Rétrospective", "Point quotidien", "Impact"]}];
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
 textPath.setAttribute('lengthAdjust','spacingAndGlyphs');
 textPath.dataset.words=JSON.stringify(ring.words);
 text.appendChild(textPath);group.appendChild(text);
 group.setAttribute('aria-hidden','true');svg.appendChild(group);
});
const button=document.getElementById('target-motion-toggle');
const section=svg.closest('.target-section');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function syncMotion(){button.hidden=reduced.matches;section.classList.toggle('target-reduced',reduced.matches);}
syncMotion();reduced.addEventListener('change',syncMotion);
function localizeTarget(){
 const t=window.translateSite;
 const lang=document.documentElement.lang;
 svg.querySelector(".target-center-title").style.fontSize=({fr:32,en:24,de:23,"sr-Latn":20}[lang]||32)+"px";
 svg.querySelectorAll('textPath').forEach(el=>{el.textContent=JSON.parse(el.dataset.words).map(k=>t(k)).join(' • ')+' •';});
 button.querySelector('span').textContent=t(section.classList.contains('target-paused')?'Reprendre l’animation':'Mettre l’animation en pause');
}
button.addEventListener('click',()=>{
 const paused=section.classList.toggle('target-paused');
 button.setAttribute('aria-pressed',String(paused));localizeTarget();
});
document.addEventListener('site-language-change',localizeTarget);
localizeTarget();
})();
