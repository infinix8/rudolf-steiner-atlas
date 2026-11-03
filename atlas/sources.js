"use strict";
const $ = id => document.querySelector(id);
const safe = s => String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const state = {graph:null,taxonomy:null,aliases:null,nodes:new Map(),domains:new Map(),bySource:new Map(),knownEventBySource:new Map()};
function index(){
  for (const event of state.aliases.events) {
    for (const id of event.source_ids) {
      if (state.knownEventBySource.has(id)) throw Error("A page belongs to multiple confirmed events: "+id);
      state.knownEventBySource.set(id,event);
    }
  }
  const walk=(node,domain=null)=>{
    state.nodes.set(node.id,node);
    const d=/^\d{2}$/.test(node.id)?node.id:domain;
    if(d)state.domains.set(node.id,d);
    for(const child of node.children||[])walk(child,d);
  };
  for(const r of state.taxonomy.tree)walk(r);
  for(const e of state.graph.edges)for(const ref of e.evidence){
    const arr=state.bySource.get(ref.source_id)||[];
    arr.push(e);state.bySource.set(ref.source_id,arr);
  }
  for(const region of state.taxonomy.tree)for(const domain of region.children){
    const o=document.createElement("option");o.value=domain.id;o.textContent=domain.id+" · "+domain.title;
    $("#filter-domain").append(o);
  }
}
function validUrl(url){
  try{const u=new URL(url);return u.protocol==="https:"&&["rsarchive.org","www.rsarchive.org"].includes(u.hostname);}catch{return false;}
}
function draw(){
  const term=$("#filter-text").value.trim().toLowerCase();
  const domain=$("#filter-domain").value,kind=$("#filter-kind").value;
  let list=state.graph.sources.filter(s=>{
    if(kind&&s.kind!==kind)return false;
    const edges=state.bySource.get(s.id)||[];
    if(domain&&!edges.some(e=>[e.from,e.to].some(id=>state.domains.get(id)===domain)))return false;
    if(term&&!["ga "+s.ga,s.ga,s.work,s.unit,s.lecture_date,s.edition].join(" ").toLowerCase().includes(term))return false;
    return true;
  }).sort((a,b)=>Number(a.ga)-Number(b.ga)||(a.lecture_date||"").localeCompare(b.lecture_date||""));
  $("#source-counts").innerHTML=[
    ["Source pages (not events)",list.length],["Known shared-event groups",new Set(list.map(s=>state.knownEventBySource.get(s.id)?.id).filter(Boolean)).size],
    ["Linked relationships",new Set(list.flatMap(s=>(state.bySource.get(s.id)||[]).map(e=>e.id))).size],
    ["Domains reached",new Set(list.flatMap(s=>(state.bySource.get(s.id)||[]).flatMap(e=>[state.domains.get(e.from),state.domains.get(e.to)]))).size]
  ].map(([label,value])=>'<div class="stat"><strong>'+value+'</strong><span>'+safe(label)+'</span></div>').join("");
  $("#source-cards").innerHTML=list.map(s=>{
    const edges=state.bySource.get(s.id)||[];
    const concepts=[...new Set(edges.flatMap(e=>[e.from,e.to]))];
    const hasLink=validUrl(s.url);
    const event = state.knownEventBySource.get(s.id);
    const sameEvent = event ? '<p class="muted" style="font-size:.8rem"><strong>Alternate view of one known lecture event:</strong> '+
      safe(event.name)+' ('+safe(event.date)+'). '+safe(event.caution)+
      '<br><small>Other archived view(s): '+event.source_ids.filter(id=>id!==s.id).map(id=>
        safe(state.graph.sources.find(view=>view.id===id)?.unit||id)).join('; ')+
      '</small></p>' : '<p class="muted" style="font-size:.78rem">Distinct-event status has not been exhaustively audited.</p>';
    return '<article class="tile" style="cursor:default;min-height:220px">'+
      '<div class="eyebrow">GA '+safe(s.ga)+' · '+safe(s.kind.replace(/_/g," "))+'</div>'+
      '<h3>'+safe(s.work)+'</h3><p><strong>'+safe(s.unit)+'</strong>'+
      (s.lecture_date?' · <span>'+safe(s.lecture_date)+'</span>':'')+'</p>'+
      '<p class="muted" style="font-size:.85rem">'+safe(s.review.scope)+'</p>'+sameEvent+
      '<div class="count">'+edges.length+' evidence references · '+concepts.length+' connected topics</div>'+
      '<p>'+ (hasLink?'<a href="'+safe(s.url)+'" target="_blank" rel="noopener noreferrer">Read original at RS Archive ↗</a>':'Source URL requires review')+
      '</p><p><a href="graph.html?focus='+encodeURIComponent(concepts[0]||"")+'">Explore connections →</a></p></article>';
  }).join("") || '<p class="empty">No original source pages match these filters.</p>';
}
async function start(){
  try{
    const [g,t,a]=await Promise.all([fetch("../research/knowledge-graph-v1.json"),fetch("../taxonomy/taxonomy-v1.json"),
      fetch("../research/known-source-view-aliases-v1.json")]);
    if(!g.ok||!t.ok||!a.ok)throw Error("Unable to load local atlas data");
    [state.graph,state.taxonomy,state.aliases]=await Promise.all([g.json(),t.json(),a.json()]);
    index();draw();
    for(const id of ["#filter-text","#filter-domain","#filter-kind"])$(id).addEventListener(id==="#filter-text"?"input":"change",draw);
    $("#reset").addEventListener("click",()=>{$("#filter-text").value="";$("#filter-domain").value="";$("#filter-kind").value="";draw();});
  }catch(e){$("#source-cards").innerHTML='<p class="empty">'+safe(e.message)+'</p>';}
}
start();