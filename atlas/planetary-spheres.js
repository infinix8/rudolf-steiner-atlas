(() => {
"use strict";
const root = document.getElementById("detail-root");
const grid = document.getElementById("planet-grid");
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
  root.innerHTML='<section class="hero detail-hero"><div class="wrap">'+orb(p.id)+'<div><a class="back" href="planetary-spheres.html">← All planetary spheres</a><div class="hero-label">'+escapeHTML(p.eyebrow)+'</div><h1>'+escapeHTML(p.name)+'</h1><p class="lede">'+escapeHTML(p.tagline)+'. '+escapeHTML(p.summary)+'</p></div></div></section>'+
    '<div class="wrap detail-main"><div class="summary-strip"><div><strong>Principal hierarchy (GA 110)</strong><p>'+escapeHTML(p.hierarchy)+'</p></div><div class="right"><strong>Planetary intelligence (GA 237)</strong><p>'+escapeHTML(p.archangel)+'</p></div></div>'+
    '<aside class="context-box"><h2>Which “'+escapeHTML(p.name)+'” does Steiner mean?</h2><div class="context-grid">'+snippets.map(s=>'<article><h3>'+escapeHTML(s.h)+'</h3><p>'+escapeHTML(s.v)+'</p></article>').join("")+'</div></aside>'+
    '<nav class="jump-nav" aria-label="Explore the three divisions">'+p.lenses.map((l,i)=>'<a href="#lens-'+(i+1)+'">0'+(i+1)+' · '+escapeHTML(l.title)+'</a>').join("")+'</nav>'+
    lens+'<aside class="source-card"><h2>Continue in the original lectures</h2><p>These are paraphrased editorial guides. Follow the primary texts for Steiner’s wording and context. The source manuscript records the open questions and confidence limits.</p><div class="source-list">'+used.map(key=>sourceLink(key,data.sources)).join("")+'</div><p><a href="../docs/PLANETARY_SPHERES_RESEARCH_V1.md">Open the research manuscript ↗</a> · <a href="planetary-spheres.html">Choose another sphere ↗</a></p><p>'+escapeHTML(data.disclaimer)+'</p></aside></div>';
}
fetch("../research/planetary-spheres-v1.json").then(r => { if(!r.ok)throw Error("data unavailable");return r.json(); }).then(data => {
  if(!data.planets || !data.sources)throw Error("invalid data");
  if(grid)renderCards(data);
  if(root){const slug=new URLSearchParams(location.search).get("sphere")||"saturn";const p=data.planets.find(item=>item.id===slug);if(p)renderDetail(p,data);else root.innerHTML='<div class="wrap"><h1>Sphere not found</h1><p><a href="planetary-spheres.html">Browse all eight guides</a></p></div>';}
}).catch(()=>{if(grid)grid.innerHTML='<p>The data could not be loaded. <a href="../docs/PLANETARY_SPHERES_RESEARCH_V1.md">Read the research manuscript</a>.</p>';if(root)root.innerHTML='<div class="wrap"><p>Unable to load this guide. <a href="planetary-spheres.html">Return to the overview</a>.</p></div>';});
})();