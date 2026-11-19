(() => {
"use strict";
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const positions={saturn:[15,19],jupiter:[72,12],mars:[90,35],sun:[50,50],venus:[84,80],mercury:[28,84],moon:[10,64]};
const links=(ids,all)=>'<div class="research-source-links">'+ids.map(id=>{const s=all.sources[id];return s&&/^https:\/\/rsarchive\.org\//.test(s.url)?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer" title="'+esc(s.title+' · '+s.paragraph)+'">'+esc(s.ga)+' · '+esc(s.paragraph)+' ↗</a>':''}).join("")+'</div>';
function start(data){
 const rows=data.mappings;
 const buttons=rows.map(m=>{const p=positions[m.planet];return '<button class="planet-node" data-planet="'+esc(m.planet)+'" aria-label="Show '+esc(m.planet)+' and '+esc(m.organ)+'" aria-pressed="false" style="--x:'+p[0]+'%;--y:'+p[1]+'%"><span class="dot" aria-hidden="true"></span><strong>'+esc(m.planet[0].toUpperCase()+m.planet.slice(1))+'</strong><small>'+esc(m.organ)+'</small></button>';}).join("");
 $("planet-nodes").innerHTML=buttons;
 $("organ-choice").innerHTML=rows.map(m=>'<button data-planet="'+esc(m.planet)+'" aria-pressed="false"><strong>'+esc(m.planet[0].toUpperCase()+m.planet.slice(1))+'</strong>'+esc(m.organ)+'</button>').join("");
 function select(p,replace){
  const m=rows.find(x=>x.planet===p);
  document.querySelectorAll("[data-planet]").forEach(b=>b.setAttribute("aria-pressed",String(b.getAttribute("data-planet")===p)));
  if(m){
   const plane=m.planet[0].toUpperCase()+m.planet.slice(1);
   const text=m.body.map(t=>'<p>'+esc(t)+'</p>').join("");
   $("selected-organ").innerHTML='<p class="tag">Direct correspondence · Etheric / occult analogy</p><h3>'+esc(plane)+' <span class="pair-symbol">↔</span> '+esc(m.organ)+'</h3><p class="lead">'+esc(m.strapline)+'</p>'+text+'<p class="source-cue"><strong>Reading status:</strong> '+esc(m.claimLevel)+'. '+esc(m.notes)+'</p><div class="link-actions"><a href="planetary-sphere.html?sphere='+esc(m.planet)+'">Open '+esc(plane)+' guide ↗</a><a href="'+esc(m.route)+'">Open '+esc(m.organ)+' research ↗</a></div>'+links(m.sourceIds,data);
  }else{
   $("selected-organ").innerHTML='<p class="tag">Research boundary · No verified organ pair</p><h3>Hidden Vulcan</h3><p class="lead">No direct one-to-one organ correspondence was found in the seven-organ passages reviewed.</p><p>'+esc(data.vulcan.summary)+'</p><p>Absence within these selected source views is not proof that Steiner never discussed Vulcan and organs anywhere in his corpus.</p><div class="link-actions"><a href="'+esc(data.vulcan.planetRoute)+'">Explore Vulcan ↗</a></div>';
  }
  if(replace && typeof URL!=="undefined" && typeof history!=="undefined"){
    const u=new URL(location.href);u.searchParams.set("sphere",p);u.searchParams.delete("organ");history.replaceState(null,"",u.pathname+u.search+u.hash);
  }
 }
 const chosen=new URLSearchParams(location.search);
 const org=chosen.get("organ"),pl=chosen.get("sphere");
 select(pl==="vulcan"?"vulcan":rows.find(m=>m.organId===org)?.planet||rows.find(m=>m.planet===pl)?.planet||"sun",false);
 $("planet-nodes").addEventListener("click",e=>{const b=e.target.closest("[data-planet]");if(b)select(b.dataset.planet,true);});
 $("organ-choice").addEventListener("click",e=>{const b=e.target.closest("[data-planet]");if(b)select(b.dataset.planet,true);});
 const contexts=$("framework-cards");
 contexts.innerHTML=data.systemFrameworks.map((s,i)=>'<article class="framework-card"><div class="framework-kind">0'+(i+1)+' · '+esc(s.context)+'</div><h3>'+esc(s.title)+'</h3><p>'+esc(s.body)+'</p>'+links(s.sourceIds,data)+'</article>').join("");
 $("organ-matrix").innerHTML=rows.map(m=>'<tr><td><a href="planetary-sphere.html?sphere='+esc(m.planet)+'">'+esc(m.planet[0].toUpperCase()+m.planet.slice(1))+'</a></td><td><a href="'+esc(m.route)+'">'+esc(m.organ)+'</a></td><td>'+esc(m.claimLevel)+'</td><td>'+links(m.sourceIds,data)+'</td></tr>').join("");
}
fetch("../research/planetary-organ-crosswalk-v1.json").then(r=>{if(!r.ok)throw Error("Cannot load crosswalk data");return r.json();}).then(d=>{
 if(!Array.isArray(d.mappings)||d.mappings.length!==7||!d.sources)throw Error("Crosswalk schema incomplete");
 start(d);
}).catch(()=>{$("selected-organ").innerHTML='<p>Unable to load this section. <a href="../docs/PLANETARY_ORGAN_RESEARCH_V1.md">Read the research manuscript ↗</a></p>';});
})();