"use strict";
// Built from repository-owned taxonomy and evidence edges. No source-site scraping or copies.
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const state={tax:null,graph:null,subdomains:[],nodes:new Map(),sourceById:new Map()};
function initIndex(){
  for(const s of state.graph.sources)state.sourceById.set(s.id,s);
  const subs=[];
  const index=(node,domain=null)=>{
    state.nodes.set(node.id,node);
    const d=/^\d{2}$/.test(node.id)?node:domain;
    const descend=new Set([node.id]);
    for(const child of node.children||[])for(const id of index(child,d))descend.add(id);
    if(/^RS-\d{2}\.\d{2}$/.test(node.id)){
      const local=state.graph.edges.filter(e=>descend.has(e.from)||descend.has(e.to));
      const direct=local.filter(e=>e.from===node.id||e.to===node.id);
      const status=direct.length?"direct":local.length?"descendant":"none";
      subs.push({node,domain:d,local,direct,status,
        sources:[...new Set(local.flatMap(e=>e.evidence.map(x=>x.source_id)))],
        descendantIds:descend});
    }
    return descend;
  };
  for(const region of state.tax.tree)for(const d of region.children)index(d,d);
  state.subdomains=subs.sort((a,b)=>a.node.id.localeCompare(b.node.id));
  for(const region of state.tax.tree)for(const domain of region.children){
    const opt=document.createElement("option");opt.value=domain.id;opt.textContent=domain.id+" · "+domain.title;
    $("#coverage-domain").append(opt);
  }
}
function counts(items){
  return {direct:items.filter(x=>x.status==="direct").length,
    descendant:items.filter(x=>x.status==="descendant").length,
    none:items.filter(x=>x.status==="none").length};
}
function listSources(item){
  const src=item.sources.map(id=>state.sourceById.get(id)).filter(Boolean).sort((a,b)=>Number(a.ga)-Number(b.ga));
  return src.length?'<details><summary>Original source pages ('+src.length+')</summary><ul>'+
    src.map(s=>{
      let safe=false;try{const u=new URL(s.url);safe=u.protocol==="https:"&&["rsarchive.org","www.rsarchive.org"].includes(u.hostname);}catch{}
      return '<li>'+(safe?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">GA '+esc(s.ga)+" · "+esc(s.unit)+' ↗</a>':
        'GA '+esc(s.ga)+" · "+esc(s.unit))+'</li>';
    }).join("")+'</ul></details>':
    '<p class="mini">No original source relation has been attached to this branch yet.</p>';
}
function entry(item){
  const name=item.status==="direct"?"Direct subdomain evidence":item.status==="descendant"?"Evidence in child concepts":"Not yet connected";
  return '<article class="coverage-entry"><div class="domain">'+esc(item.domain.id)+' · '+esc(item.domain.title)+'</div>'+
    '<h3><a href="index.html#node='+encodeURIComponent(item.node.id)+'">'+esc(item.node.title)+'</a></h3>'+
    '<span class="status '+item.status+'">'+name+'</span>'+
    '<p class="mini">'+esc(item.node.id)+' · '+item.local.length+' relationship(s), '+item.sources.length+' original source page(s)'+
    (item.status==="descendant"?" · no exact subdomain endpoint":"")+'</p>'+
    (item.local.length?'<a href="graph.html?focus='+encodeURIComponent(item.node.id)+'">Explore linked relationships →</a>':
       '<p><a href="sources.html">Browse original-source guide →</a></p>')+
    listSources(item)+'</article>';
}
function render(){
  const domain=$("#coverage-domain").value,status=$("#coverage-status").value,term=$("#coverage-search").value.trim().toLowerCase();
  const list=state.subdomains.filter(x=>(!domain||x.domain.id===domain)&&(!status||x.status===status)&&
    (!term||[x.node.id,x.node.title,x.domain.title].join(" ").toLowerCase().includes(term)));
  const all=counts(state.subdomains),current=counts(list);
  $("#coverage-stats").innerHTML=[
    ["Subdomains",state.subdomains.length],["Direct graph evidence",all.direct],["Child-concept evidence only",all.descendant],
    ["Without graph evidence",all.none]
  ].map(([k,v])=>'<div class="stat"><strong>'+v+'</strong><span>'+esc(k)+'</span></div>').join("");
  $("#coverage-summary").innerHTML='<strong>'+list.length+' matching subdomains</strong> · '+
    current.direct+' direct · '+current.descendant+' via child only · '+current.none+' with no evidence';
  $("#coverage-list").innerHTML=list.map(entry).join("") || '<p class="empty">No subdomains match. Adjust the filters.</p>';
}
async function start(){
  try{
    const [tr,gr]=await Promise.all([fetch("../taxonomy/taxonomy-v1.json"),fetch("../research/knowledge-graph-v1.json")]);
    if(!tr.ok||!gr.ok)throw Error("Unable to load atlas source JSON");
    [state.tax,state.graph]=await Promise.all([tr.json(),gr.json()]);
    initIndex();render();
    for(const id of ["#coverage-domain","#coverage-status","#coverage-search"]){
      $(id).addEventListener(id==="#coverage-search"?"input":"change",render);
    }
    $("#coverage-reset").addEventListener("click",()=>{
      $("#coverage-domain").value=$("#coverage-status").value=$("#coverage-search").value="";render();
    });
  }catch(e){$("#coverage-list").innerHTML='<p class="empty">'+esc(e.message)+'</p>';}
}
start();