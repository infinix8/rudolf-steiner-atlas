"use strict";
const $=q=>document.querySelector(q);
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const state={data:null,graph:null,tax:null,nodes:new Map(),sourceById:new Map(),edgeById:new Map()};
const safeUrl=url=>{try{const u=new URL(url);return u.protocol==="https:"&&["rsarchive.org","www.rsarchive.org"].includes(u.hostname)}catch{return false}};
function prepare(){
  const visit=node=>{state.nodes.set(node.id,node);for(const c of node.children||[])visit(c)};
  state.tax.tree.forEach(visit);
  state.graph.sources.forEach(s=>state.sourceById.set(s.id,s));
  state.graph.edges.forEach(e=>state.edgeById.set(e.id,e));
}
function title(id){return state.nodes.get(id)?.title||id}
function sourceAnchor(id,locator){
  const src=state.sourceById.get(id);
  if(!src)return '<span class="muted">Source not found: '+esc(id)+'</span>';
  const label='GA '+src.ga+' · '+src.unit;
  const base=safeUrl(src.url)?'<a href="'+esc(src.url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>':esc(label);
  return base+' <span class="muted">('+esc(locator)+')</span>';
}
function listCard(d){
  return '<article class="tile dossier-card"><div class="eyebrow">Study question</div>'+
    '<a href="dossiers.html?id='+encodeURIComponent(d.id)+'"><strong>'+esc(d.title)+'</strong></a>'+
    '<p>'+esc(d.description)+'</p><div class="count">'+d.sections.length+' evidence-guided sections · '+d.topic_ids.length+' topic entry points</div></article>';
}
function listView(){
  $("#dossier-detail").innerHTML="";
  $("#dossier-list-view").hidden=false;
  const q=$("#dossier-search").value.trim().toLowerCase();
  const list=state.data.dossiers.filter(d=>!q||[d.title,d.question,d.description,...d.topic_ids.map(title)].join(" ").toLowerCase().includes(q));
  $("#dossier-list").innerHTML=list.map(listCard).join("")||'<p class="empty">No matching study question.</p>';
}
function renderDetails(d){
  $("#dossier-list-view").hidden=true;
  const sourceIds=[...new Set(d.sections.flatMap(s=>s.evidence.map(e=>e.source_id)))];
  const sections=d.sections.map(s=>
    '<section class="dossier-section"><h2>'+esc(s.heading)+'</h2><p>'+esc(s.body)+'</p>'+
    '<div class="evidence"><strong class="mini-label">Original passages</strong><ul>'+
    s.evidence.map(e=>'<li>'+sourceAnchor(e.source_id,e.locator)+'</li>').join("")+
    '</ul></div></section>').join("");
  const cross=d.connections.map(c=>{
    const e=state.edgeById.get(c.edge_id);
    if(!e)return "";
    return '<li>'+esc(c.note)+'<br><a href="graph.html?focus='+encodeURIComponent(e.from)+'">'+esc(title(e.from))+' ⇢ '+esc(title(e.to))+'</a> <span class="mini-label">('+esc(c.edge_id)+')</span></li>';
  }).join("");
  const sidebar='<aside class="dossier-sidebar"><h2>Primary-source entry points</h2>'+
    '<p class="muted" style="font-size:.82rem">Read the full text at the original archive; this guide contains only editorial notes.</p>'+
    sourceIds.map(id=>{const src=state.sourceById.get(id);return '<div class="source-link">'+sourceAnchor(id,src?.review?.scope?"Selected paragraphs reviewed":"Source lead")+'</div>'}).join("")+
    '<hr><h2>Supported conceptual connections</h2><ul>'+cross+'</ul>'+
    '<hr><h2>Important boundaries</h2><ul>'+d.cautions.map(note=>'<li>'+esc(note)+'</li>').join("")+'</ul>'+
    '</aside>';
  $("#dossier-detail").innerHTML=
    '<div class="dossier-breadcrumb"><a href="dossiers.html">All study questions</a> / '+esc(d.title)+'</div>'+
    '<p class="eyebrow">Original editorial research dossier</p><h1>'+esc(d.title)+'</h1>'+
    '<p class="intro">'+esc(d.question)+'</p><p class="dossier-intro">'+esc(d.description)+'</p>'+
    '<div class="caution">Source scope: only selected passages have been read. This is not a Steiner-authored sequence, complete doctrine, a verified translation comparison, or independent evidence for esoteric claims.</div>'+
    '<div class="dossier-nodes">'+d.topic_ids.map(id=>'<a href="index.html#node='+encodeURIComponent(id)+'">'+esc(title(id))+'</a>').join("")+'</div>'+
    '<div class="dossier-body"><div>'+sections+
    '<section class="dossier-insights"><h3>Questions for deeper source study</h3><ol>'+d.research_questions.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol></section>'+
    '</div>'+sidebar+'</div>';
  document.title=d.title+" · Rudolf Steiner Atlas";
}
async function start(){
  try{
    const [dr,gr,tr]=await Promise.all([
      fetch("../research/concept-dossiers-v1.json"),fetch("../research/knowledge-graph-v1.json"),fetch("../taxonomy/taxonomy-v1.json")
    ]);
    if([dr,gr,tr].some(r=>!r.ok))throw Error("Cannot read local atlas dossier records");
    [state.data,state.graph,state.tax]=await Promise.all([dr.json(),gr.json(),tr.json()]);
    prepare();
    const id=new URLSearchParams(location.search).get("id");
    const selected=state.data.dossiers.find(x=>x.id===id);
    if(selected)renderDetails(selected);
    else{$("#dossier-search").addEventListener("input",listView);listView();}
  }catch(e){$("#dossier-detail").innerHTML='<p class="empty">'+esc(e.message)+'</p>';}
}
start();