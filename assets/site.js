const preferences={getItem(k){try{return localStorage.getItem(k)}catch{return null}},setItem(k,v){try{localStorage.setItem(k,v)}catch{}}};

// ── LANGUE ────────────────────────────────────────────────
const translations=window.siteTranslations||{};
const plainTranslations=[];
const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
while(walker.nextNode()){
 const node=walker.currentNode,key=node.textContent.trim();
 if(translations[key]&&!node.parentElement.closest('[data-fr],script,style'))plainTranslations.push({node,key,original:node.textContent});
}
const attributeTranslations=[];
document.querySelectorAll('[aria-label],[alt],[title]').forEach(el=>{
 ['aria-label','alt','title'].forEach(attr=>{const key=el.getAttribute(attr);if(translations[key])attributeTranslations.push({el,attr,key});});
});
window.translateSite=(key,lang=document.documentElement.lang)=>translations[key]?.[lang==='sr-Latn'?'sr':lang]||key;
function setLang(lang){
 lang=['fr','en','de','sr'].includes(lang)?lang:'fr';
 document.documentElement.lang=lang==='sr'?'sr-Latn':lang;
 document.querySelectorAll('[data-fr]').forEach(el=>{
  const key=el.dataset.fr;
  el.innerHTML=lang==='fr'?key:(translations[key]?.[lang]||el.getAttribute('data-'+lang)||key);
 });
 plainTranslations.forEach(({node,key,original})=>{node.textContent=original.replace(key,translateSite(key,lang));});
 attributeTranslations.forEach(({el,attr,key})=>el.setAttribute(attr,translateSite(key,lang)));
 document.querySelectorAll('.language-select').forEach(select=>{select.value=lang;});
 document.querySelectorAll('.handwriting-accessible').forEach(el=>el.lang=document.documentElement.lang);
 // Only French and English PDF versions exist; German/Serbian use English.
 document.querySelectorAll('[download],#nav-cv-link,#hero-cv-link').forEach(a=>a.href=lang==='fr'?'CV_Marina_Montalbano.pdf':'CV_Marina_Montalbano_EN.pdf');
 try{sessionStorage.setItem('portfolioLanguage',lang)}catch{}
 document.dispatchEvent(new CustomEvent('site-language-change',{detail:lang}));
}
document.querySelectorAll('.language-select').forEach(select=>{
 select.addEventListener('change',()=>setLang(select.value));
});
let initialLanguage='fr';
try{initialLanguage=sessionStorage.getItem('portfolioLanguage')||'fr'}catch{}
setLang(initialLanguage);

// ── HAMBURGER MENU ───────────────────────────────────────
function toggleMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const burger = document.getElementById('hamburger');
  const isOpen = overlay.classList.toggle('open');
 document.body.classList.toggle('menu-open',isOpen);
 if(isOpen)overlay.querySelector('.mm-close').focus();else burger.focus();
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
function checkMobile() {
  const burger = document.getElementById('hamburger');
  if (window.innerWidth <= 1180) {
    burger.style.display = 'flex';
  } else {
    burger.style.display = 'none';
    document.getElementById('mobileMenuOverlay').classList.remove('open');
 document.body.classList.remove('menu-open');document.getElementById('hamburger').setAttribute('aria-expanded','false');
  }
}
window.addEventListener('resize', checkMobile);
checkMobile();

document.querySelectorAll('.mm-item').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('mobileMenuOverlay').classList.remove('open');
 document.body.classList.remove('menu-open');document.getElementById('hamburger').setAttribute('aria-expanded','false');
  });
});

// ── MENU "Aa" — ACCESSIBILITÉ ────────────────────────────
function toggleA11yPanel(suffix) {
  suffix = suffix || '';
  const toggle = document.getElementById('a11yToggle' + suffix);
  const panel = document.getElementById('a11yPanel' + suffix);
  const isOpen = panel.hasAttribute('hidden');
  if (isOpen) {
    panel.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
  } else {
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
  }
}
// Fermer les panneaux au clic extérieur ou avec Échap
document.addEventListener('click', (e) => {
  document.querySelectorAll('.a11y-menu, .mm-a11y').forEach(wrap => {
    if (!wrap.contains(e.target)) {
      const panel = wrap.querySelector('.a11y-panel');
      const toggle = wrap.querySelector('.a11y-toggle');
      if (panel && !panel.hasAttribute('hidden')) {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
 if(document.getElementById('mobileMenuOverlay').classList.contains('open'))toggleMenu();
    document.querySelectorAll('.a11y-panel').forEach(panel => panel.setAttribute('hidden', ''));
    document.querySelectorAll('.a11y-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
  }
});

// Taille du texte — stepper 100% → 150% par pas de 10, agit sur --text-scale
let currentTextScalePct = 100;
function applyTextScale(pct) {
  currentTextScalePct = Math.min(150, Math.max(100, pct));
  document.documentElement.style.setProperty('--text-scale', currentTextScalePct / 100);
  document.body.classList.toggle('text-scale-large', currentTextScalePct > 100);
  document.querySelectorAll('.a11y-step-value').forEach(el => el.textContent = currentTextScalePct + '%');
  preferences.setItem('textScale', currentTextScalePct);
}
function stepTextScale(delta) {
  applyTextScale(currentTextScalePct + delta);
}

// Contraste élevé
function toggleHighContrast(active) {
  document.body.classList.toggle('high-contrast', active);
  document.querySelectorAll('.toggle-contrast').forEach(cb => cb.checked = active);
  preferences.setItem('highContrast', active ? '1' : '0');
  const sidebar = document.getElementById('hcSidebar');
  if (active) {
    sidebar.classList.add('active');
    document.body.classList.add('hc-sidebar-open');
  } else {
    sidebar.classList.remove('active');
    document.body.classList.remove('hc-sidebar-open');
  }
}
function closeHcSidebar() {
  document.getElementById('hcSidebar').classList.remove('active');
  document.body.classList.remove('hc-sidebar-open');
}

// Police dyslexie
function toggleDyslexicFont(active) {
  document.body.classList.toggle('dyslexic-font', active);
  document.querySelectorAll('.toggle-dyslexic').forEach(cb => cb.checked = active);
  preferences.setItem('dyslexicFont', active ? '1' : '0');
}

// Liens soulignés
function toggleUnderlineLinks(active) {
  document.body.classList.toggle('underline-links', active);
  document.querySelectorAll('.toggle-underline').forEach(cb => cb.checked = active);
  preferences.setItem('underlineLinks', active ? '1' : '0');
}

// Restaurer les préférences enregistrées
(function restoreA11yPrefs() {
  const savedScale = parseInt(preferences.getItem('textScale'), 10);
  applyTextScale(savedScale || 100);
  if (preferences.getItem('highContrast') === '1') {
    document.body.classList.add('high-contrast', 'hc-sidebar-open');
    document.getElementById('hcSidebar').classList.add('active');
    document.querySelectorAll('.toggle-contrast').forEach(cb => cb.checked = true);
  }
  if (preferences.getItem('dyslexicFont') === '1') {
    document.body.classList.add('dyslexic-font');
    document.querySelectorAll('.toggle-dyslexic').forEach(cb => cb.checked = true);
  }
  if (preferences.getItem('underlineLinks') === '1') {
    document.body.classList.add('underline-links');
    document.querySelectorAll('.toggle-underline').forEach(cb => cb.checked = true);
  }
})();

document.addEventListener('keydown',e=>{
 const overlay=document.getElementById('mobileMenuOverlay');
 if(e.key!=='Tab'||!overlay.classList.contains('open'))return;
 const a=[...overlay.querySelectorAll('a,button,input,select')].filter(el=>el.getClientRects().length);
 if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus();}
 else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus();}
});

