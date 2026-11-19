(() => {
"use strict";
const root = document.getElementById("detail-root");
const grid = document.getElementById("planet-grid");
const slug = new URLSearchParams(location.search).get("sphere") || "saturn";
if (root && slug === "mars") { location.replace("mars.html" + location.hash); return; }
const topicModule = () => import("./planetary-tree-guides.js");

const escapeHTML = (x) => String(x ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeId = (s) => /^[a-z0-9-]+$/.test(s) ? s : "";
const sourceLink = (key, sources) => { const s=sources[key]; if (!s) return ""; const url=String(s.url); if(!url.startsWith("https://rsarchive.org/")) return ""; return '<a href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer" title="'+escapeHTML(s.note)+'">'+escapeHTML(s.ga)+' · '+escapeHTML(s.date)+' ↗</a>'; };
const orb = (id) => '<div class="orb orb--'+safeId(id)+'" aria-hidden="true"></div>';
function renderCards(data) {
  grid.innerHTML=data.planets.map(p => '<a class="planet-card '+(p.id==="vulcan"?"vulcan":"")+'" href="planetary-sphere.html?sphere='+safeId(p.id)+'" aria-label="Explore '+escapeHTML(p.name)+'"><span class="card-eyebrow">'+escapeHTML(p.eyebrow)+'</span>'+orb(p.id)+'<h3>'+escapeHTML(p.name)+'</h3><p>'+escapeHTML(p.summary)+'</p><span class="read">Explore the sphere →</span></a>').join("");
}
function renderDetail(p,data){
  document.title=p.name+' — Planetary Spheres · Rudolf Steiner Atlas';
  const snippets=[{h:"Present sphere",v:p.sphere},{h:"Cosmic embodiment",v:p.embodiment},{h:"Oracle / intelligence",v:p.oracle}];
  const lens=p.lenses.map((item,i)=>'<section class="lens" id="lens-'+(i+1)+'"><div class="index">Division '+(i+1)+' / 03</div><h2>'+escapeHTML(item.title)+'</h2><h3>'+escapeHTML(item.lead)+'</h3>'+item.body.map(v=>'<p>'+escapeHTML(v)+'</p>').join("")+'<div class="ref-links" aria-label="Original sources">'+item.refs.map(key=>sourceLink(key,data.sources)).join("")+'</div></section>').join("");
  const used=Array.from(new Set(p.lenses.flatMap(l=>l.refs)));
  root.innerHTML='<section class="hero detail-hero"><div class="wrap">'+orb(p.id)+'<div><a class="back" href="planetary-tree.html">← Planetary Tree of Life</a><div class="hero-label">'+escapeHTML(p.eyebrow)+'</div><h1>'+escapeHTML(p.name)+'</h1><p class="lede">'+escapeHTML(p.tagline)+'. '+escapeHTML(p.summary)+'</p></div></div></section>'+
    '<div class="wrap detail-main"><section class="guide-hierarchy" id="planetary-guide" aria-label="Planetary topics"></section><details class="guide-more" id="full-reading"><summary>Full planetary dossier</summary></details><div class="dossier-reading"><div class="summary-strip"><div><strong>Principal hierarchy (GA 110)</strong><p>'+escapeHTML(p.hierarchy)+'</p></div><div class="right"><strong>Planetary intelligence (GA 237)</strong><p>'+escapeHTML(p.archangel)+'</p></div></div>'+
    '<aside class="context-box"><h2>Which “'+escapeHTML(p.name)+'” does Steiner mean?</h2><div class="context-grid">'+snippets.map(s=>'<article><h3>'+escapeHTML(s.h)+'</h3><p>'+escapeHTML(s.v)+'</p></article>').join("")+'</div></aside>'+
    '<nav class="jump-nav" aria-label="Explore the three divisions">'+p.lenses.map((l,i)=>'<a href="#lens-'+(i+1)+'">0'+(i+1)+' · '+escapeHTML(l.title)+'</a>').join("")+'</nav>'+
    lens+insightCards(p,data)+relationCards(p,data)+'<section class="planet-organ-link" id="organ-bridge"><h2>Within the human being</h2><p>Loading the source-linked planetary–organ research…</p></section>'+'<aside class="source-card"><h2>Continue in the original lectures</h2><p>These are paraphrased editorial guides. Follow the primary texts for Steiner’s wording and context. The source manuscript records the open questions and confidence limits.</p><div class="source-list">'+used.map(key=>sourceLink(key,data.sources)).join("")+'</div><p><a href="../docs/PLANETARY_SPHERES_RESEARCH_V1.md">Open the research manuscript ↗</a> · <a href="planetary-spheres.html">Choose another sphere ↗</a></p><p>'+escapeHTML(data.disclaimer)+'</p></aside></div></div>';
  const dossier = document.getElementById("full-reading");
  dossier.append(root.querySelector(".dossier-reading"));
  const revealDossier = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target && dossier.contains(target)) {
      dossier.open = true;
      target.scrollIntoView();
    }
  };
  revealDossier();
  window.addEventListener("hashchange", revealDossier);
  const guide = document.getElementById("planetary-guide");
  topicModule().then(module => module.loadPlanetaryGuide(guide, p.id)).catch(() => { dossier.open = true; });
}


// Phase 3: Optional organ correspondence layer; a failed crosswalk fetch does not break planetary pages.
function loadOrganBridge(p){
 const host=document.getElementById("organ-bridge");if(!host)return;
 fetch("../research/planetary-organ-crosswalk-v1.json").then(r=>{if(!r.ok)throw Error("No crosswalk");return r.json();}).then(data=>{
   const m=data.mappings.find(x=>x.planet===p.id);
   if(!m){
     host.innerHTML='<p class="eyebrow dark">Evidence boundary</p><h2>Vulcan and the human organs</h2><p>No specific organ is named for Vulcan in the sevenfold GA 107/128 crosswalk. The Oracle and future cosmic condition belong to separate source contexts.</p><p><a href="planetary-organs.html?sphere=vulcan">Read the research boundary ↗</a></p>';
     return;
   }
   const refs=m.sourceIds.map(id=>{const s=data.sources[id];return s&&/^https:\/\/rsarchive\.org\//.test(s.url)?'<a href="'+escapeHTML(s.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(s.ga+' · '+s.paragraph)+' ↗</a>':''}).join("");
   host.innerHTML='<p class="eyebrow dark">New · Planetary–organ crosswalk</p><h2>'+escapeHTML(p.name)+' and the '+escapeHTML(m.organ.toLowerCase())+'</h2><p>'+escapeHTML(m.strapline)+'. This is an explicitly named historical <strong>etheric/occult correspondence</strong>, not proof of biological or therapeutic causation.</p><div class="bridge-link-actions"><a href="planetary-organs.html?sphere='+escapeHTML(p.id)+'">Explore the inner planetary system ↗</a><a href="'+escapeHTML(m.route)+'">Read '+escapeHTML(m.organ)+' organ guide ↗</a></div><div class="ref-links">'+refs+'</div>';
 }).catch(()=>{host.innerHTML='<h2>Within the human being</h2><p>Explore the organ correspondence research.</p><p><a href="planetary-organs.html?sphere='+escapeHTML(p.id)+'">Planet–organ Atlas ↗</a></p>';});
}

// Phase 2: evidence close-ups, contextual relations, and comparison.
function sourceChips(refs,sources){return '<div class="ref-links">'+refs.map(id=>sourceLink(id,sources)).join("")+'</div>';}
function insightCards(p,data){
  return '<section class="research-focus" id="text-evidence"><div class="focus-heading"><div><p class="eyebrow dark">Selected primary-source findings</p><h2>Closer to the texts</h2></div><p>These notes identify their evidence level and keep passages in separate lecture contexts.</p></div><div class="insight-grid">'+(p.insights||[]).map(n=>
    '<article class="insight-card"><div class="insight-meta">'+escapeHTML(n.evidenceLevel)+'</div><h3>'+escapeHTML(n.title)+'</h3><p>'+escapeHTML(n.body)+'</p>'+sourceChips(n.sourceIds,data.sources)+'</article>'
  ).join("")+'</div></section>';
}
function relationCards(p,data){
  const related=(data.connections||[]).filter(e=>e.from===p.id||e.to===p.id);
  if(!related.length)return "";
  return '<section class="related-spheres" id="related-spheres"><div class="focus-heading"><div><p class="eyebrow dark">Follow a verified connection</p><h2>How the realms interact</h2></div><p>Direct comparisons are made in one passage. Syntheses combine distinct passages.</p></div><div class="relation-grid">'+related.map(e=>{
    const next=e.from===p.id?e.to:e.from;
    const other=data.planets.find(x=>x.id===next);
    return '<article class="relation-card"><span class="connection-label">'+(e.kind==="direct"?"Direct source connection":"Cross-source interpretation")+'</span><h3><a href="planetary-sphere.html?sphere='+escapeHTML(next)+'">'+escapeHTML(other.name)+' →</a></h3><h4>'+escapeHTML(e.heading)+'</h4><p>'+escapeHTML(e.description)+'</p>'+sourceChips(e.refs,data.sources)+'</article>';
  }).join("")+'</div></section>';
}
function renderCompare(data){
  const selectA=document.getElementById("compare-a");
  const selectB=document.getElementById("compare-b");
  const result=document.getElementById("comparison-results");
  const matrix=document.getElementById("matrix-body");
  if(!selectA||!selectB||!result||!matrix) return;
  const opts=data.planets.map(p=>'<option value="'+escapeHTML(p.id)+'">'+escapeHTML(p.name)+'</option>').join("");
  selectA.innerHTML=opts;selectB.innerHTML=opts;selectA.value="sun";selectB.value="moon";
  const short=(p)=>'<div class="compare-card"><div class="mini-orb orb orb--'+escapeHTML(p.id)+'" aria-hidden="true"></div><p class="eyebrow dark">'+escapeHTML(p.eyebrow)+'</p><h3><a href="planetary-sphere.html?sphere='+escapeHTML(p.id)+'">'+escapeHTML(p.name)+' ↗</a></h3><p>'+escapeHTML(p.summary)+'</p><dl><dt>Present spiritual boundary</dt><dd>'+escapeHTML(p.hierarchy)+'</dd><dt>Great evolutionary condition</dt><dd>'+escapeHTML(p.embodiment)+'</dd><dt>Atlantean stream</dt><dd>'+escapeHTML(p.oracle)+'</dd></dl></div>';
  function render(){const a=data.planets.find(p=>p.id===selectA.value),b=data.planets.find(p=>p.id===selectB.value);if(!a||!b)return;
    result.innerHTML=short(a)+short(b);
    const matches=(data.connections||[]).filter(e=>[e.from,e.to].includes(a.id)&&[e.from,e.to].includes(b.id)&&a.id!==b.id);
    document.getElementById("shared-sources").innerHTML=matches.length?matches.map(e=>'<article class="relation-card"><span class="connection-label">'+(e.kind==="direct"?"Direct passage":"Source synthesis")+'</span><h3>'+escapeHTML(e.heading)+'</h3><p>'+escapeHTML(e.description)+'</p>'+sourceChips(e.refs,data.sources)+'</article>').join(""):'<p class="no-direct">No exact connection is recorded yet between these two realms. Compare their independent source lists before inferring a relationship.</p>';
  }
  selectA.addEventListener("change",render);selectB.addEventListener("change",render);render();
  matrix.innerHTML=data.planets.map(p=>'<tr><th scope="row"><a href="planetary-sphere.html?sphere='+escapeHTML(p.id)+'">'+escapeHTML(p.name)+'</a></th><td>'+escapeHTML(p.hierarchy)+'</td><td>'+escapeHTML(p.comparisonShort)+'</td><td>'+escapeHTML(p.archangel)+'</td></tr>').join("");
  const legend=document.getElementById("comparison-pathways");
  legend.innerHTML=data.studyGuide.pathways.map(t=>'<article class="path-card"><p class="eyebrow dark">'+(t.kind==="direct"?"Single-source reading":"Combined-source reading")+'</p><h3>'+escapeHTML(t.title)+'</h3><p>'+escapeHTML(t.summary)+'</p><div class="path-links">'+t.planets.map(id=>'<a href="planetary-sphere.html?sphere='+escapeHTML(id)+'">'+escapeHTML(data.planets.find(p=>p.id===id).name)+'</a>').join("")+'</div>'+sourceChips(t.refs,data.sources)+'</article>').join("");
}

if (root && slug === "earth") {
  topicModule().then(module => module.renderEarth(root)).catch(() => {
    root.innerHTML = '<div class="wrap"><h1>Earth</h1><p><a href="living-cosmos.html?view=history&amp;node=earth">Explore Earth in The Living Cosmos</a></p></div>';
  });
  return;
}

fetch("../research/planetary-spheres-v1.json").then(r => { if(!r.ok)throw Error("data unavailable");return r.json(); }).then(data => {
  if(!data.planets || !data.sources)throw Error("invalid data");
  if(grid)renderCards(data);
  if(document.getElementById('comparison-results'))renderCompare(data);
  if(root){const p=data.planets.find(item=>item.id===slug);if(p){renderDetail(p,data);loadOrganBridge(p);}else root.innerHTML='<div class="wrap"><h1>Sphere not found</h1><p><a href="planetary-spheres.html">Browse all eight guides</a></p></div>';}
}).catch(()=>{if(grid)grid.innerHTML='<p>The data could not be loaded. <a href="../docs/PLANETARY_SPHERES_RESEARCH_V1.md">Read the research manuscript</a>.</p>';if(root)root.innerHTML='<div class="wrap"><p>Unable to load this guide. <a href="planetary-spheres.html">Return to the overview</a>.</p></div>';});
})();