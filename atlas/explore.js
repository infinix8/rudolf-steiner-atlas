'use strict';
(() => {
const isHome = document.body.dataset.view === 'home';
const base = isHome ? 'atlas/' : '';
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const themes = [
{id:'I',name:'Knowledge & inner development',short:'Inner development',cue:'How do we come to know?',description:'Thinking, freedom, spiritual practice and the art of knowing.',intro:'Begin with thinking itself. Explore Steiner’s approaches to freedom, knowledge and the development of inner capacities.',color:'#e5eadb',tone:'#647957',art:'<circle cx="75" cy="50" r="36"/><circle cx="75" cy="50" r="24"/><circle cx="75" cy="50" r="11"/><path d="M15 50h120M75 8v84M32 17l86 66M32 83l86-66"/>'},
{id:'II',name:'Cosmos & destiny',short:'Cosmos & destiny',cue:'What is our place in the cosmos?',description:'Cosmic evolution, spiritual beings, karma and reincarnation.',intro:'Journey from the beginnings of worlds to the question of individual destiny. Explore the spiritual cosmology described in Steiner’s works.',color:'#e0e8eb',tone:'#5d7a88',art:'<circle cx="75" cy="50" r="35"/><ellipse cx="75" cy="50" rx="63" ry="19" transform="rotate(-25 75 50)"/><circle cx="75" cy="50" r="13"/><circle cx="125" cy="24" r="4" fill="currentColor"/><circle cx="53" cy="77" r="3" fill="currentColor"/>'},
{id:'III',name:'The human being',short:'The human being',cue:'What does it mean to be human?',description:'Body, soul, spirit, consciousness and the course of a life.',intro:'Explore the human being as Steiner describes it: embodied, inwardly active and developing through a lifetime and beyond.',color:'#ece0d4',tone:'#9b795a',art:'<circle cx="75" cy="19" r="9"/><path d="M75 29v36m0-24L43 55m32-14l32 14M75 65L56 91m19-26l19 26"/><ellipse cx="75" cy="50" rx="35" ry="44"/><circle cx="75" cy="50" r="24"/>'},
{id:'IV',name:'Christ & civilizations',short:'Christ & history',cue:'How does history become meaningful?',description:'The Christ impulse, ancient mysteries and cultural epochs.',intro:'Follow Steiner’s interpretations of religious history, the Mystery of Golgotha and the spiritual forces he connects with the unfolding of civilizations.',color:'#e9e2ed',tone:'#8a7292',art:'<path d="M25 88h100M35 87V42l40-28 40 28v45M48 87V46m27 41V34m27 53V46"/><circle cx="75" cy="34" r="24"/><path d="M13 60h124"/>'},
{id:'V',name:'Science & practical life',short:'Science & life',cue:'How can insight become action?',description:'Healing, education, nature, agriculture and social renewal.',intro:'Discover how Steiner brought his ideas into practical fields, from the classroom and the farm to medicine, scientific inquiry and social life.',color:'#dfe9df',tone:'#5b826b',art:'<path d="M75 92V44M75 70C35 75 27 50 31 29c25-2 43 12 44 41ZM75 52c0-27 18-40 43-35 2 22-15 38-43 35Z"/><path d="M43 41l32 29m0-18 29-23"/>'},
{id:'VI',name:'Art & anthroposophical life',short:'Art & movement',cue:'What can creativity reveal?',description:'Colour, music, architecture, eurythmy, festivals and community.',intro:'Enter the creative life of anthroposophy. Explore Steiner’s work with the arts, architecture, movement and the rhythms of the year.',color:'#eee5ce',tone:'#a0894d',art:'<path d="M13 72c25-80 39 80 62 0s38 75 62-15M13 54c25-80 39 80 62 0s38 75 62-15M13 36c25-80 39 80 62 0s38 75 62-15"/>'}
];
const art = t => `<div class="art" aria-hidden="true"><svg viewBox="0 0 150 100" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">${t.art}</svg></div>`;
const card = t => `<a class="world" style="--card:${t.color};--tone:${t.tone}" href="${base}explore.html?region=${t.id}"><span class="overline"><span>World ${t.id}</span><span aria-hidden="true">→</span></span>${art(t)}<h3>${t.name}</h3><p>${t.description}</p><span class="enter">Explore this world <b aria-hidden="true">→</b></span></a>`;
let taxonomy;
let vocabulary = [];
async function loadTaxonomy(){
 const response = await fetch((isHome ? '' : '../') + 'taxonomy/taxonomy-v1.json');
 if(!response.ok) throw new Error('The topic map could not be loaded.');
 taxonomy = await response.json();
 return taxonomy;
}
if(isHome){
 const motionButton=document.querySelector('.motion-toggle');
 motionButton.addEventListener('click',()=>{
  const paused=motionButton.getAttribute('aria-pressed')!=='true';
  motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.textContent=paused?'Resume motion':'Pause motion';
  document.querySelector('.universe').classList.toggle('paused',paused);
 });
 document.querySelector('#world-cards').innerHTML = themes.map(card).join('');
 const input=document.querySelector('#concept-search');
 const results=document.querySelector('#concept-results');
 const count=document.querySelector('#result-count');
 let nodes=[];
 function search(){
  const q=input.value.trim().toLocaleLowerCase();
  if(!q){results.innerHTML='';count.textContent='';return;}
  if(!taxonomy){count.textContent='Loading the concept index…';return;}
  const tokens=q.split(/\s+/);
  const hits=nodes.filter(n=>tokens.every(t=>n.text.includes(t))).sort((a,b)=>(b.title.toLowerCase()===q)-(a.title.toLowerCase()===q));
  count.textContent=hits.length ? `${hits.length} matching concepts${hits.length>12 ? ' · Showing the first 12. Add a word to narrow your search.' : ''}` : 'No concepts found. Try a broader word, such as thinking or soul.';
  results.innerHTML=hits.slice(0,12).map(n=>`<a class="result" href="${base}index.html#node=${encodeURIComponent(n.id)}">${escape(n.title)}<small>${escape(n.region)}</small></a>`).join('');
 }
 input.addEventListener('input',search);
 Promise.all([loadTaxonomy(),fetch('research/search-vocabulary.json').then(r=>r.ok?r.json():null).catch(()=>null)]).then(([data,vocab])=>{
  vocabulary=vocab?.terms||[];
  function visit(n,region,ancestors=[]){
   const synonyms=vocabulary.filter(t=>t.target_id===n.id).map(t=>t.term);
   nodes.push({...n,region,text:[n.title,...ancestors,...synonyms].join(' ').toLocaleLowerCase()});
   (n.children||[]).forEach(c=>visit(c,region,[...ancestors,n.title]));
  }
  data.tree.forEach(r=>visit(r,r.title));search();
 }).catch(()=>{input.disabled=true;count.innerHTML=`The concept search is unavailable. <a href="${base}index.html">Browse the full thematic index →</a>`;});
 return;
}
const related={
 II:[['cosmic-evolution.html','Cosmic evolution','Explore the seven planetary conditions.'],['agency.html','Spiritual hierarchies','Compare beings, stages and activities.']],
 III:[['body.html','The visual body map','Choose an organ and explore its layers.'],['evolution-story.html','Human evolution','Follow an animated journey through 21 stages.']],
 IV:[['evolution-story.html','Cultural epochs','Follow the unfolding human journey.'],['dossiers.html','Study dossiers','Explore focused, source-linked questions.']],
 V:[['body.html','Organs & healing','Explore the organ guides and research.'],['sources.html','Original works','Find the books and lectures behind a theme.']]
};
let readingPaths = [];
function renderReadingPaths() {
 const host = document.querySelector('#theme-reading');
 if (!host || !taxonomy || !currentTheme) return;
 const ids = new Set();
 const visit = n => {ids.add(n.id);(n.children || []).forEach(visit);};
 visit(taxonomy.tree.find(r => r.id === currentTheme.id));
 const matches = readingPaths.filter(p => p.nodes.some(id => ids.has(id))).slice(0,2);
 host.hidden = !matches.length;
 host.innerHTML = '<p class="eyebrow">Prefer a little guidance?</p><h2>Follow a thread through the theme.</h2><div class="theme-trails">' + matches.map(p => '<a href="journey.html?path=' + encodeURIComponent(p.id) + '"><strong>' + escape(p.title) + '</strong><small>' + escape(p.description) + '</small><small>' + p.nodes.length + ' concepts · Begin this journey →</small></a>').join('') + '</div><p class="search-hint">Editorial routes through existing concepts. <a href="journey.html">See all eight reading journeys →</a></p>';
}
fetch('study-paths.json').then(r => {if(!r.ok)throw new Error('Routes unavailable');return r.json();}).then(data => {readingPaths = data.paths || [];renderReadingPaths();}).catch(() => {});
let currentTheme;
let currentDomain;
function showDomain(id,update=true){
 const region=taxonomy.tree.find(r=>r.id===currentTheme.id);
 const domain=region.children.find(d=>d.id===id)||region.children[0];
 currentDomain=domain.id;
 document.querySelectorAll('.domain-button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.domain===domain.id)));
 const panel=document.querySelector('#topic-panel');
 panel.classList.remove('fade-in');
 panel.innerHTML=`<h3>${escape(domain.title)}</h3><p>Choose a topic to explore its concepts and source leads.</p><div class="topics">${(domain.children||[]).map(n=>`<a class="topic" href="index.html#node=${encodeURIComponent(n.id)}"><span>${escape(n.title)}</span><small>Explore concepts & sources &nbsp; →</small></a>`).join('')}</div><div class="domain-actions"><a class="text-link" href="index.html#node=${domain.id}">View the whole branch →</a><a class="text-link" href="sources.html">Find original works →</a></div>`;
 requestAnimationFrame(()=>panel.classList.add('fade-in'));
 if(update){const url=new URL(location.href);url.searchParams.set('domain',domain.id);history.pushState(null,'',url);}
}
function renderTheme(){
 const params=new URLSearchParams(location.search);
 const invalid=params.has('region')&&!themes.some(t=>t.id===params.get('region'));
 currentTheme=themes.find(t=>t.id===params.get('region'))||themes[0];
 const t=currentTheme;
 const region=taxonomy.tree.find(r=>r.id===t.id);
 document.documentElement.style.setProperty('--card',t.color);
 document.documentElement.style.setProperty('--tone',t.tone);
 document.documentElement.style.setProperty('--accent',t.tone);
 document.title=`${t.name} · Rudolf Steiner Atlas`;
 document.querySelector('#theme-intro').innerHTML=`<div><a class="back" href="../index.html#worlds">← All six worlds</a><p class="eyebrow">World ${t.id} / ${t.cue}</p><h1>${t.name}</h1><p class="lede">${t.intro}</p>${invalid?'<p class="search-hint">That theme was not found. You can explore this world or choose another below.</p>':''}</div>${art(t)}`;
 document.querySelector('#domain-buttons').innerHTML=region.children.map(d=>`<button class="domain-button" data-domain="${d.id}" type="button" aria-controls="topic-panel" aria-pressed="false">${escape(d.title)}</button>`).join('');
 document.querySelector('#theme-switch').innerHTML=themes.map(other=>`<a href="explore.html?region=${other.id}" ${other.id===t.id?'aria-current="page"':''}>${other.short} ${other.id===t.id?'':'→'}</a>`).join('');
 const journeys=document.querySelector('#theme-journeys');
 journeys.hidden=!related[t.id];
 journeys.innerHTML=related[t.id]?`<p class="eyebrow">Another way to explore</p><h2>See the theme come to life.</h2><div class="topics">${related[t.id].map(([url,title,desc])=>`<a class="topic" href="${url}"><span>${title}</span><small>${desc} →</small></a>`).join('')}</div>`:'';
 showDomain(params.get('domain'),false);
 renderReadingPaths();
}
document.querySelector('#domain-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-domain]');if(b)showDomain(b.dataset.domain);});
window.addEventListener('popstate',()=>{if(taxonomy)renderTheme();});
loadTaxonomy().then(renderTheme).catch(()=>{
 document.querySelector('#theme-intro').innerHTML='<div class="error"><h1>The theme could not be opened.</h1><p>Please reload, or <a class="text-link" href="index.html">browse the full thematic index →</a>.</p></div>';
});
})();
