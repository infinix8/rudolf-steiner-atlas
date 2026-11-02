"use strict";
const $=q=>document.querySelector(q);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store={data:null,graph:null,tax:null,nodes:new Map(),sources:new Map()};
const safeUrl=url=>{try{let x=new URL(url);return x.protocol==="https:"&&["rsarchive.org","www.rsarchive.org"].includes(x.hostname)}catch{return false}};
function makeIndex(){
  const walk=node=>{store.nodes.set(node.id,node);for(const c of node.children||[])walk(c)};
  store.tax.tree.forEach(walk);store.graph.sources.forEach(s=>store.sources.set(s.id,s));
  for(const t of store.data.trajectories){
    const option=document.createElement("option");option.value=t.id;option.textContent=t.title;
    $("#trajectory-select").append(option);
  }
}
function display(){
  const id=$("#trajectory-select").value;
  const t=store.data.trajectories.find(x=>x.id===id);
  if(!t){$("#trajectory-view").innerHTML='<p class="empty">Choose a concept trajectory above.</p>';return;}
  const links=t.topic_ids.map(id=>'<a href="index.html#node='+encodeURIComponent(id)+'">'+esc(store.nodes.get(id)?.title||id)+'</a>').join("");
  const cards=t.entries.map((e,i)=>{
    const src=store.sources.get(e.source_id);
    if(!src)return "";
    const when=src.lecture_date?'<time datetime="'+esc(src.lecture_date)+'">'+esc(src.lecture_date)+'</time>':
      '<span>Authored work · publication / revision date not yet verified in the graph</span>';
    const link=safeUrl(src.url)?'<a class="source-link" href="'+esc(src.url)+'" target="_blank" rel="noopener noreferrer">Read original chapter or lecture ↗</a>':
      '<span>Source URL needs verification</span>';
    return '<article class="trajectory-card"><div class="trajectory-date">Source '+(i+1)+' · '+when+'</div>'+
      '<h3>GA '+esc(src.ga)+' · '+esc(src.work)+'</h3><p class="meta">'+esc(src.unit)+
      ' · '+esc(src.kind.replaceAll("_"," "))+' · '+esc(src.edition)+'</p>'+
      '<span class="interpretation">'+esc(e.interpretation.replaceAll("_"," "))+'</span>'+
      '<p>'+esc(e.claim)+'</p><div class="trajectory-warning"><strong>Passage:</strong> '+esc(e.locator)+
      '. Selected passage consulted; entire work and translation variants have not been systematically compared.</div>'+link+
      '</article>';
  }).join("");
  $("#trajectory-view").innerHTML='<p class="trajectory-comparison-type">'+esc(t.comparison_type.replaceAll("_"," "))+'</p>'+
    '<h2>'+esc(t.title)+'</h2><p class="intro">'+esc(t.question)+'</p>'+
    '<div class="trajectory-tools">'+links+'</div><div class="trajectory-cards">'+cards+'</div>'+
    '<div class="trajectory-note"><h2>What the current sources support</h2><p>'+esc(t.conclusion)+'</p></div>'+
    '<div class="panel"><h2 style="font-size:1.05rem">Further work needed</h2><p>'+esc(t.open_question)+'</p></div>';
  const query=new URLSearchParams(location.search);query.set("id",id);
  history.replaceState(null,"",location.pathname+"?"+query.toString());
  document.title=t.title+" · Rudolf Steiner Atlas";
}
async function start(){
  try{
    const [dr,gr,tr]=await Promise.all([fetch("../research/concept-trajectories-v1.json"),
      fetch("../research/knowledge-graph-v1.json"),fetch("../taxonomy/taxonomy-v1.json")]);
    if(!dr.ok||!gr.ok||!tr.ok)throw Error("Cannot load the local source data.");
    [store.data,store.graph,store.tax]=await Promise.all([dr.json(),gr.json(),tr.json()]);
    makeIndex();$("#trajectory-select").addEventListener("change",display);
    const id=new URLSearchParams(location.search).get("id");
    if(store.data.trajectories.some(x=>x.id===id))$("#trajectory-select").value=id;
    display();
  }catch(e){$("#trajectory-view").innerHTML='<p class="empty">'+esc(e.message)+'</p>';}
}
start();