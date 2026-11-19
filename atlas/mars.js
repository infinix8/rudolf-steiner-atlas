(function(){
"use strict";
var partsRoot=document.getElementById("parts"),side=document.getElementById("side-nav"),dossiers=document.getElementById("dossiers");
function escapeHTML(s){return String(s===undefined||s===null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var glyphs={cosmos:"◎",beings:"✧",earth:"◈",atlantis:"♜",buddha:"☼",soul:"✦",courage:"✺",organs:"♧",iron:"⬖",plants:"❀",music:"♫",time:"◷"};
function card(ch){return '<a class="card" href="#chapter-'+ch.id+'" data-chapter="'+ch.id+'"><span class="art '+escapeHTML(ch.art)+'"><span class="art-symbol" aria-hidden="true">'+escapeHTML(glyphs[ch.art]||"✦")+'</span></span><span class="chapter-id">CHAPTER '+ch.id+' · PDF p. '+ch.page+'</span><h3>'+escapeHTML(ch.title)+'</h3><p>'+escapeHTML(ch.short)+'</p><span class="explore">Explore chapter →</span></a>'}
function part(info,i,chapters){var group=chapters.filter(function(x){return x.part===i+1});return '<section class="part" id="part-'+(i+1)+'"><div class="part-title"><h2><span class="part-num">'+["I.","II.","III.","IV."][i]+'</span> '+escapeHTML(info[0])+'</h2><p>'+escapeHTML(info[1])+'</p></div><div class="cards">'+group.map(card).join("")+'</div></section>'}
function claim(s,data){return '<article class="entry" id="sub-'+s.number.replace(".","-")+'"><h4>'+escapeHTML(s.number+' '+s.title)+'</h4><p>'+escapeHTML(s.body)+'</p><div class="claim-foot"><span class="grade" title="'+escapeHTML(data.grades[s.grade])+'">Evidence '+escapeHTML(s.grade)+'</span><span class="refs">'+escapeHTML(s.sources)+'</span></div></article>'}
function dossier(ch,data){return '<details class="dossier" id="chapter-'+ch.id+'"><summary><span><strong>'+ch.id+'. '+escapeHTML(ch.title)+'</strong><small>PDF p. '+ch.page+' · '+ch.sub.length+' research subsections · Select to expand</small></span></summary><div class="dossier-content">'+ch.sub.map(function(s){return claim(s,data)}).join("")+'</div></details>'}
function makeSources(data){return '<div class="source-grid">'+data.links.map(function(x){return '<a href="'+escapeHTML(x[1])+'" rel="noopener noreferrer" target="_blank"><strong>'+escapeHTML(x[0])+' ↗</strong><small>'+escapeHTML(x[2])+'</small></a>'}).join("")+'</div>'}
function openHash(){var id=decodeURIComponent(location.hash.slice(1));var node=document.getElementById(id);if(!node)return;if(/^chapter-[0-9]+$/.test(id)){node.open=true;requestAnimationFrame(function(){node.scrollIntoView({block:"start"})})}if(/^sub-[0-9]+-[0-9]+$/.test(id)){var ancestor=node.closest("details.dossier");if(ancestor)ancestor.open=true;requestAnimationFrame(function(){node.scrollIntoView({block:"start"})})}}
function render(data){
if(!Array.isArray(data.chapters)||data.chapters.length!==12)throw Error("Incomplete research");
partsRoot.innerHTML=data.parts.map(function(p,i){return part(p,i,data.chapters)}).join("");
side.innerHTML=data.parts.map(function(p,i){var links=data.chapters.filter(function(ch){return ch.part===i+1}).map(function(ch){return '<a class="chapter-link" href="#chapter-'+ch.id+'">'+escapeHTML(ch.title)+'</a>'}).join("");return '<a class="part-link" href="#part-'+(i+1)+'">'+["I.","II.","III.","IV."][i]+' '+escapeHTML(p[0])+'</a>'+links}).join("");
dossiers.innerHTML=data.chapters.map(function(ch){return dossier(ch,data)}).join("");
document.getElementById("source-links").innerHTML=makeSources(data);
document.addEventListener("click",function(e){var a=e.target.closest("[data-chapter]");if(a){var n=document.getElementById("chapter-"+a.getAttribute("data-chapter"));if(n)n.open=true}});
window.addEventListener("hashchange",openHash);openHash();
}
fetch("mars-research.json").then(function(r){if(!r.ok)throw Error("Research unavailable");return r.json()}).then(render).catch(function(){partsRoot.innerHTML='<p class="loading">Mars research could not load. <a href="planetary-spheres.html">Go back to planetary spheres.</a></p>';});
})();