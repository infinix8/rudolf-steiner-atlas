"use strict";
// Time is attached to dated talks, not to the associated timeless concept or modern translation.
const $=q=>document.querySelector(q);
const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
const state={tax:null,graph:null,nodes:new Map(),domainOf:new Map(),index:new Map()};
const safeUrl=url=>{try{const v=new URL(url);return v.protocol==="https:"&&["rsarchive.org","www.rsarchive.org"].includes(v.hostname)}catch{return false}};
function prep(){
  const walk=(node,domain=null)=>{
    state.nodes.set(node.id,node);
    const d=/^\d{2}$/.test(node.id)?node.id:domain;
    if(d)state.domainOf.set(node.id,d);
    for(const c of node.children||[])walk(c,d);
  };
  for(const region of state.tax.tree)walk(region);
  for(const edge of state.graph.edges)for(const ev of edge.evidence){
    const list=state.index.get(ev.source_id)||[];list.push(edge);state.index.set(ev.source_id,list);
  }
  for(const reg of state.tax.tree)for(const dom of reg.children){
    const o=document.createElement("option");o.value=dom.id;o.textContent=dom.id+" · "+dom.title;
    $("#timeline-domain").append(o);
  }
  const years=[...new Set(state.graph.sources.filter(s=>s.lecture_date).map(s=>s.lecture_date.slice(0,4)))].sort();
  for(const yr of years)for(const selector of ["#timeline-from","#timeline-to"]){
    const option=document.createElement("option");option.value=yr;option.textContent=yr;
    $(selector).append(option);
  }
}
function sourcesMatching(){
  const q=$("#timeline-query").value.trim().toLowerCase(),domain=$("#timeline-domain").value,
    first=$("#timeline-from").value,until=$("#timeline-to").value;
  return state.graph.sources.filter(s=>{
    const year=s.lecture_date?.slice(0,4);
    if((first||until)&&year&&(first&&year<first||until&&year>until))return false;
    if(domain&&!(state.index.get(s.id)||[]).some(e=>[e.from,e.to].some(id=>state.domainOf.get(id)===domain)))return false;
    const topics=[...new Set((state.index.get(s.id)||[]).flatMap(e=>[e.from,e.to]))];
    const hay=[s.work,s.unit,s.ga,s.lecture_date,s.edition,...topics.map(id=>state.nodes.get(id)?.title)].join(" ").toLowerCase();
    return !q||q.split(/\s+/).every(v=>hay.includes(v));
  });
}
function linkToOriginal(src,text){
  return safeUrl(src.url)?'<a href="'+escapeHtml(src.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(text)+' ↗</a>':
    '<span class="muted">Original URL needs checking</span>';
}
function makeCard(src){
  const edges=state.index.get(src.id)||[],topics=[...new Set(edges.flatMap(e=>[e.from,e.to]))].slice(0,8);
  return '<article class="chronology-entry"><time datetime="'+escapeHtml(src.lecture_date)+'">'+escapeHtml(src.lecture_date)+'</time>'+
    '<h3>GA '+escapeHtml(src.ga)+' · '+escapeHtml(src.work)+'</h3><p><strong>'+escapeHtml(src.unit)+'</strong></p>'+
    '<p class="mini">'+edges.length+' source-linked relationships from selected passages · '+escapeHtml(src.edition)+'</p>'+
    '<ul>'+topics.map(id=>'<li class="topic"><a href="index.html#node='+encodeURIComponent(id)+'">'+escapeHtml(state.nodes.get(id)?.title||id)+'</a></li>').join("")+'</ul>'+
    '<div class="sources-link">'+linkToOriginal(src,"Read original lecture")+
    (topics.length?'<a href="graph.html?focus='+encodeURIComponent(topics[0])+'">Explore its connections →</a>':"")+
    '</div></article>';
}
function undatedCard(src){
  const edges=state.index.get(src.id)||[];
  return '<article class="undated-card"><span class="eyebrow">GA '+escapeHtml(src.ga)+' · '+escapeHtml(src.kind.replaceAll("_"," "))+'</span>'+
    '<h3>'+escapeHtml(src.work)+'</h3><p>'+escapeHtml(src.unit)+'</p>'+
    '<p class="muted" style="font-size:.8rem">'+edges.length+' passage-linked graph references</p>'+
    linkToOriginal(src,"Read original source")+'</article>';
}
function render(){
  const list=sourcesMatching(),dated=list.filter(s=>s.lecture_date).sort((a,b)=>a.lecture_date.localeCompare(b.lecture_date));
  const undated=list.filter(s=>!s.lecture_date);
  $("#timeline-stats").innerHTML=[
    ["Dated talks",dated.length],["Undated written source pages",undated.length],
    ["Years represented",new Set(dated.map(s=>s.lecture_date.slice(0,4))).size]
  ].map(([label,n])=>'<div class="stat"><strong>'+n+'</strong><span>'+escapeHtml(label)+'</span></div>').join("");
  const groups=new Map();for(const s of dated){
    const year=s.lecture_date.slice(0,4);
    if(!groups.has(year))groups.set(year,[]);
    groups.get(year).push(s);
  }
  $("#timeline-list").innerHTML=[...groups].map(([year,sources])=>
    '<section aria-label="Lectures in '+escapeHtml(year)+'"><h2 class="year-label">'+escapeHtml(year)+'</h2>'+
    sources.map(makeCard).join("")+'</section>').join("")||'<p class="empty">No dated talks match these filters.</p>';
  $("#undated-sources").innerHTML=undated.map(undatedCard).join("")||
    '<p class="empty">No undated written works match these filters.</p>';
}
async function start(){
  try{
    const [gr,tr]=await Promise.all([fetch("../research/knowledge-graph-v1.json"),fetch("../taxonomy/taxonomy-v1.json")]);
    if(!gr.ok||!tr.ok)throw Error("Unable to load local original-source graph");
    [state.graph,state.tax]=await Promise.all([gr.json(),tr.json()]);
    prep();render();
    for(const selector of ["#timeline-domain","#timeline-query","#timeline-from","#timeline-to"])
      $(selector).addEventListener(selector==="#timeline-query"?"input":"change",render);
    $("#timeline-clear").addEventListener("click",()=>{
      for(const selector of ["#timeline-domain","#timeline-query","#timeline-from","#timeline-to"])$(selector).value="";
      render();
    });
  }catch(e){$("#timeline-list").innerHTML='<p class="empty">'+escapeHtml(e.message)+'</p>';}
}
start();