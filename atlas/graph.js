"use strict";
// This viewer fetches only repository-owned JSON. No archive text is downloaded.
// All real source URLs are opened only when the reader chooses to follow them.
const ns = "http://www.w3.org/2000/svg";
const state = { graph: null, taxonomy: null, nodes: new Map(), edges: [], selected: null };
const byId = (id) => state.nodes.get(id);
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (v) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[v]));
const getSource = (id) => state.graph.sources.find((src) => src.id === id);
const sourceUrl = (value) => {
  try { const u = new URL(value); return u.protocol === "https:" && ["rsarchive.org", "www.rsarchive.org"].includes(u.hostname); }
  catch (_) { return false; }
};
const formatTitle = (id) => byId(id)?.title || id;
const sourceLabel = (ref) => { const s = getSource(ref); return s ? "GA " + s.ga + " · " + s.work : ref; };
const sourceLinks = (id) => {
  const src = getSource(id);
  if (!src || !sourceUrl(src.url)) return '<span>Source URL requires verification</span>';
  return '<a class="btn-source" href="' + esc(src.url) +
    '" target="_blank" rel="noopener noreferrer">Read original chapter / lecture ↗</a>';
};
function prepare() {
  const visit = (node) => { if (state.nodes.has(node.id)) throw new Error("Duplicate node " + node.id);
    state.nodes.set(node.id, node); (node.children || []).forEach(visit); };
  state.taxonomy.tree.forEach(visit);
  const domainSelect = $("#domain-filter");
  for (const region of state.taxonomy.tree) for (const domain of region.children) {
    const opt = document.createElement("option");
    opt.value = domain.id; opt.textContent = domain.id + " · " + domain.title;
    domainSelect.append(opt);
  }
  const sourceSelect = $("#source-filter");
  for (const src of state.graph.sources) {
    const opt = document.createElement("option"); opt.value = src.id;
    opt.textContent = "GA " + src.ga + " · " + src.work.slice(0, 38);
    sourceSelect.append(opt);
  }
  const families = state.graph.semantic_families?.definitions || {};
  for (const [key,description] of Object.entries(families)) {
    const opt = document.createElement("option"); opt.value = key;
    opt.textContent = key.replaceAll("_"," ");
    opt.title = description;
    $("#family-filter").append(opt);
  }
  const t = [...new Set(state.graph.edges.map((e) => e.type))].sort();
  for (const type of t) {
    const opt = document.createElement("option"); opt.value = type;
    opt.textContent = type.replace(/_/g, " ");
    $("#type-filter").append(opt);
  }
  const focus = new URLSearchParams(location.search).get("focus");
  if (focus && byId(focus)) $("#graph-search").value = focus;
}
function filterEdges() {
  const src = $("#source-filter").value, type = $("#type-filter").value;
  const domain = $("#domain-filter").value, basis = $("#evidence-filter").value, family = $("#family-filter").value;
  const q = $("#graph-search").value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return state.graph.edges.filter((edge) => {
    if (src && !edge.evidence.some((e) => e.source_id === src)) return false;
    if (type && edge.type !== type) return false;
    if (family && edge.relation_family !== family) return false;
    if (basis && edge.evidence_basis !== basis) return false;
    if (domain && ![edge.from, edge.to].some(id => id.startsWith("RS-" + domain + "."))) return false;
    if (!q.length) return true;
    const sourceText = edge.evidence.map((e) => sourceLabel(e.source_id)).join(" ");
    const haystack = [edge.from, edge.to, formatTitle(edge.from), formatTitle(edge.to),
      edge.type, edge.claim, sourceText].join(" ").toLowerCase();
    return q.every((token) => haystack.includes(token));
  });
}
function makeSvg(tag, attrs = {}, textContent) {
  const e = document.createElementNS(ns, tag);
  for (const [k,v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (textContent !== undefined) e.textContent = textContent;
  return e;
}
function networkLayout(edges) {
  const ids = [...new Set(edges.flatMap((e) => [e.from, e.to]))].sort((a, b) => a.localeCompare(b));
  const rad = Math.max(145, Math.min(265, ids.length * 7.3));
  const cx=450,cy=305;
  return new Map(ids.map((id, i) => {
    const a = -Math.PI/2 + (2*Math.PI*i/Math.max(1, ids.length));
    return [id,{x:cx+rad*Math.cos(a),y:cy+rad*Math.sin(a)}];
  }));
}
function paintNetwork(edges) {
  const svg=$("#graph-svg"); svg.replaceChildren(makeSvg("title", {}, "Diagram of the filtered source-linked relationships"));
  const positions = networkLayout(edges), max = 85;
  if (!edges.length) {
    svg.append(makeSvg("text",{x:450,y:300,"text-anchor":"middle",fill:"#667683"},"No source relationships match these filters"));
    return;
  }
  const group=makeSvg("g");
  for (const edge of edges.slice(0,max)) {
    const a=positions.get(edge.from),b=positions.get(edge.to);
    const line=makeSvg("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,
      class:"graph-edge"+(state.selected===edge.id?" highlight":"")});
    group.append(line);
  }
  const focus = edges.find((e)=>e.id===state.selected);
  const activeNodes = new Set(focus?[focus.from,focus.to]:[]);
  for (const [id,pos] of positions) {
    const fg=makeSvg("g");
    const circle=makeSvg("circle",{cx:pos.x,cy:pos.y,r:activeNodes.has(id)?10:6,
      class:"graph-node"+(activeNodes.has(id)?" active":""),
      tabindex:"0",role:"link","aria-label":"Open atlas concept "+formatTitle(id)});
    const go=()=>{window.location.href="index.html#node="+encodeURIComponent(id)};
    circle.addEventListener("click",go);
    circle.addEventListener("keydown",(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});
    const title=makeSvg("title",{},formatTitle(id)+" ("+id+")");circle.append(title);
    fg.append(circle);
    let l=formatTitle(id);if(l.length>23)l=l.slice(0,21)+"…";
    const label=makeSvg("text",{
      x:pos.x+(pos.x>=450?10:-10),y:pos.y-9,
      "text-anchor":pos.x>=450?"start":"end",class:"graph-label"
    },l);
    fg.append(label);group.append(fg);
  }
  svg.append(group);
}
function rowHtml(edge) {
  const name = formatTitle(edge.from) + " → " + formatTitle(edge.to);
  const src = edge.evidence.map((s)=>sourceLabel(s.source_id)).join("; ");
  const isReview = edge.evidence_basis==="editorial_comparison";
  return '<tr class="'+(edge.id===state.selected?"selected":"")+'"><td><button data-edge="'+esc(edge.id)+'">' +
    esc(name)+'</button><div class="mini-label">'+esc(edge.id)+'</div></td><td>'+esc(edge.type.replace(/_/g," "))+
    '</td><td>'+esc(src)+'</td><td><span class="badge '+(isReview?"warn":"green")+'">'+
    (isReview?"Editorial comparison":"Selected passage checked")+'</span></td></tr>';
}
function selectEdge(edge) {
  state.selected = edge.id;
  const left=byId(edge.from),right=byId(edge.to);
  let out='<p class="eyebrow">'+esc(edge.id)+'</p><h2>Relationship evidence</h2>'+
    '<p class="mini-label">Editorial connection family: '+esc(edge.relation_family?.replaceAll('_',' ')||'unclassified')+
    '</p>'+
    '<p><strong>'+esc(left.title)+'</strong><br><span class="muted">'+esc(edge.type.replace(/_/g," "))+
    '</span><br><strong>'+esc(right.title)+'</strong></p>'+
    '<p>'+esc(edge.claim)+'</p>'+
    '<div class="caution">'+(edge.evidence_basis==="editorial_comparison"
      ?"This is the editors' comparison of two inspected sources. Steiner has not been represented as explicitly making the exact comparison."
      :"This relation is a short editorial paraphrase of a selected Steiner passage; it is not an independent factual endorsement or a full-volume review.")+'</div>'+
    '<div class="detail-label">Explore original concepts</div>'+
    '<p><a href="index.html#node='+encodeURIComponent(edge.from)+'">'+esc(left.title)+'</a>'+
    ' · <a href="index.html#node='+encodeURIComponent(edge.to)+'">'+esc(right.title)+'</a></p>';
  for (const ev of edge.evidence) {
    const s=getSource(ev.source_id);
    out+='<div class="evidence-source"><strong>GA '+esc(s.ga)+' · '+esc(s.unit)+'</strong>'+
      '<div class="mini-label">'+esc(s.work)+' · '+esc(s.edition)+
      (s.lecture_date?' · '+esc(s.lecture_date):'')+'</div>'+
      '<p class="detail-label">Passage locator</p><p>'+esc(ev.passage_locator)+'</p>'+
      '<p class="mini-label">Review scope: '+esc(s.review.scope)+'</p>'+sourceLinks(s.id)+'</div>';
  }
  if(edge.note)out+='<p class="muted">'+esc(edge.note)+'</p>';
  $("#evidence-panel").innerHTML=out;
  const rows=$("#relations").querySelectorAll("tr");
  rows.forEach((r)=>r.classList.toggle("selected",!!r.querySelector('[data-edge="'+edge.id+'"]')));
}
function render() {
  const edges=filterEdges();
  $("#graph-stats").innerHTML=[
    ["Filtered relationships",edges.length],["Linked concepts",new Set(edges.flatMap(e=>[e.from,e.to])).size],
    ["Source pages",new Set(edges.flatMap(e=>e.evidence.map(x=>x.source_id))).size]
  ].map(([label,value])=>'<div class="stat"><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div>').join("");
  $("#result-count").textContent=edges.length+" connections";
  $("#relations").innerHTML=edges.map(rowHtml).join("") ||
    '<tr><td colspan="4">No connections match these filters.</td></tr>';
  if(!edges.some(e=>e.id===state.selected))state.selected=edges[0]?.id||null;
  if(state.selected)selectEdge(edges.find(e=>e.id===state.selected));
  else $("#evidence-panel").innerHTML='<h2>No relationship selected</h2><p>Adjust the source, relation or search filters.</p>';
  paintNetwork(edges);
}
async function init(){
  try{
    const [g,t]=await Promise.all([fetch("../research/knowledge-graph-v1.json"),fetch("../taxonomy/taxonomy-v1.json")]);
    if(!g.ok||!t.ok)throw Error("Cannot load repository JSON; serve this directory over localhost instead of file://.");
    [state.graph,state.taxonomy]=await Promise.all([g.json(),t.json()]);
    prepare();render();
    ["#source-filter","#domain-filter","#evidence-filter","#family-filter","#type-filter","#graph-search"].forEach(id=>
      $(id).addEventListener(id==="#graph-search"?"input":"change",render));
    $("#clear-filters").addEventListener("click",()=>{$("#source-filter").value="";$("#domain-filter").value="";
      $("#evidence-filter").value="";$("#family-filter").value="";$("#type-filter").value="";
      $("#graph-search").value="";render();});
    $("#relations").addEventListener("click",e=>{
      const btn=e.target.closest("[data-edge]");if(!btn)return;
      const edge=state.graph.edges.find(e=>e.id===btn.dataset.edge);
      if(edge){selectEdge(edge);paintNetwork(filterEdges());$("#evidence-panel").focus();}
    });
  }catch(error){$("#graph-content").insertAdjacentHTML("beforeend",
    '<p class="empty">Unable to load: '+esc(error.message)+'</p>');}
}
init();