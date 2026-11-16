"use strict";
(() => {
const INDEX_URL="../research/steiner-hierarchical-chronology-events-v06.json";
const DOSSIER_URL="../research/steiner-cosmic-condition-dossiers-v02.json";
const $=id=>document.getElementById(id);
const NS="http://www.w3.org/2000/svg";
const nodes=new Map(),events=new Map(),groups=new Map(),sources=new Map(),dossiers=new Map();
let index=null,level="root",selected="cos-earth",tab="overview",page=0,searchActive=false,extraRecord=null;
const stagePositions=[[153,98],[336,190],[522,281],[720,350],[918,281],[1104,190],[1287,98]];
const symbols=["✦","✧","◌","✧","◉","✧","✦"];
const palette=[
 {a:"#6f462f",b:"#c68a49",c:"#f6d7a5"},
 {a:"#b14716",b:"#fdbf42",c:"#fff0ab"},
 {a:"#485669",b:"#8fa2b4",c:"#e2e4dc"},
 {a:"#153e5e",b:"#3f8ba3",c:"#b5d7a7"},
 {a:"#855c54",b:"#c6a083",c:"#f8dbac"},
 {a:"#8e719e",b:"#c6acc5",c:"#fff0d6"},
 {a:"#543e88",b:"#9078c6",c:"#d9c0fc"}
];
function add(id,label,parent,kind,group,status,summary){
 nodes.set(id,{id,label,parent,kind,group,status,summary:summary||""});
}
function construct(data){
 index=data;
 data.sources.forEach(s=>sources.set(s.id,s));
 data.groups.forEach(g=>groups.set(g.id,g));
 data.events.forEach(e=>events.set(e.id,e));
 add("root","The Seven Planetary Conditions",null,"root",null,"past","Seven evolutionary conditions described by Steiner: Old Saturn, Old Sun, Old Moon, Earth, Future Jupiter, Future Venus and Future Vulcan.");
 [
 ["cos-saturn","Old Saturn","CH-2","past","Warmth and the physical-body germ"],
 ["cos-sun","Old Sun","CH-3","past","Life and the etheric-body germ"],
 ["cos-moon","Old Moon","CH-4","past","The astral organization and picture-consciousness"],
 ["cos-earth","Earth","CH-5","present","The I, self-consciousness and human moral freedom"],
 ["cos-jupiter","Future Jupiter","CH-21","future","The development of conscious imaginations"],
 ["cos-venus","Future Venus","CH-22","future","Inspiration and further metamorphosis"],
 ["cos-vulcan","Future Vulcan","CH-23","future","Intuition and the seventh condition"]
 ].forEach(x=>add(x[0],x[1],"root","cosmic",x[2],x[3],x[4]));
 [
 ["earth-polar","Polar","CH-6","past","First great Earth epoch"],
 ["earth-hyper","Hyperborean","CH-7","past","Second great Earth epoch"],
 ["earth-lemur","Lemurian","CH-8","past","Third great Earth epoch"],
 ["earth-atlant","Atlantean","CH-9","past","Fourth great Earth epoch"],
 ["earth-post","Post-Atlantean",null,"present","Fifth great Earth epoch"],
 ["earth-sixth","Sixth Earth Epoch","CH-18","future","Projected epoch of seven seals"],
 ["earth-seventh","Seventh Earth Epoch","CH-19","future","Projected epoch of seven trumpets"]
 ].forEach(x=>add(x[0],x[1],"cos-earth","epoch",x[2],x[3],x[4]));
 const periods=["Ancient Indian","Ancient Persian","Egypto-Chaldean","Greco-Roman","Consciousness-Soul Age","Sixth Cultural Period","Seventh Cultural Period"];
 periods.forEach((name,i)=>add("period-"+(i+10),name,"earth-post","culture","CH-"+(10+i),i<4?"past":i===4?"present":"future",groups.get("CH-"+(10+i))?.title||name));
 for(const n of [...nodes.values()]){
   n.summary=data.stage_notes?.[n.id]||n.summary;
   if(!n.group||n.id==="cos-earth")continue; // CH-5 events span the Earth epoch hierarchy
   for(const e of data.events.filter(x=>x.parent_id===n.group)){
     add(e.id,e.title.replace(/\.$/,""),n.id,"event",null,n.status==="future"?"future":n.status==="present"?"present":"past",e.description);
   }
 }
}
const children=id=>[...nodes.values()].filter(x=>x.parent===id);
function pathTo(id){let a=[];while(id&&nodes.has(id)){a.unshift(id);id=nodes.get(id).parent;}return a;}
function n(id){return nodes.get(id);}
function preferred(id){let c=children(id);const names={root:"cos-earth","cos-earth":"earth-post","earth-post":"period-14"};return c.find(x=>x.id===names[id])?.id||c[0]?.id||null;}
function setHash(id){try{history.replaceState(null,"","#"+encodeURIComponent(id));}catch(e){location.hash=encodeURIComponent(id);}}
function navigate(id,scroll=false){
 if(!nodes.has(id))return;
 extraRecord=null;
 if(!children(id).length){select(id);return;}
 level=id;selected=preferred(id)||id;page=0;tab="overview";render();setHash(id);
 if(scroll)document.querySelector(".cosmic-scene")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function select(id){
 if(!nodes.has(id))return;
 extraRecord=null;
 const p=n(id).parent;
 if(p&&p!==level){level=p;page=0;}
 const list=children(level),idx=list.findIndex(x=>x.id===id);
 if(idx>=0)page=Math.floor(idx/7);
 selected=id;tab="overview";render();setHash(id);
}
function deeper(){if(children(selected).length)navigate(selected,true);else if(children(level).length){$("events-section").hidden=false;$("events-section").scrollIntoView({behavior:"smooth"});}}
function goOut(){if(level!=="root")navigate(n(level).parent||"root",true);}
function between(points){
 if(points.length===0)return "";
 let p=points[0],s="M"+p[0]+" "+p[1];
 for(let i=0;i<points.length-1;i++){
  let p0=points[i-1]||points[i],p1=points[i],p2=points[i+1],p3=points[i+2]||p2;
  const c1x=p1[0]+(p2[0]-p0[0])/6,c1y=p1[1]+(p2[1]-p0[1])/6;
  const c2x=p2[0]-(p3[0]-p1[0])/6,c2y=p2[1]-(p3[1]-p1[1])/6;
  s+=" C"+c1x+" "+c1y+" "+c2x+" "+c2y+" "+p2[0]+" "+p2[1];
 }
 return s;
}
function svg(tag,props,text){
 const e=document.createElementNS(NS,tag);
 if(props)for(const [k,v] of Object.entries(props))e.setAttribute(k,String(v));
 if(text!==undefined)e.textContent=text;return e;
}
function html(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function textTo(parent,tag,cls,text){const e=html(tag,cls,text);parent.appendChild(e);return e;}
function btn(label,fn,cls){const b=html("button",cls||"",label);b.type="button";b.addEventListener("click",fn);return b;}
function paletteFor(i,item){
 if(level==="root")return palette[i];
 if(item?.status==="future")return palette[Math.min(i+3,6)];
 if(item?.status==="present")return palette[3];
 return palette[Math.max(0,i%3)];
}
function stageLabel(item,idx){
 let t=item.label;
 if(t.length>25){t=t.slice(0,24).trim()+"…";}
 const short=idx===3&&t.length>18?t.slice(0,17)+"…":t;
 return short;
}
function smallSubtitle(item){
 if(level==="root"){
  const captions=["Physical germ","Life & etheric","Astral & soul","Turning point","Conscious images","Inspiration","Intuition"];
  return captions[["cos-saturn","cos-sun","cos-moon","cos-earth","cos-jupiter","cos-venus","cos-vulcan"].indexOf(item.id)]||"";
 }
 if(item.kind==="event")return "Research event";
 if(item.status==="future")return "Projected";
 return item.kind==="culture"?"Cultural period":item.kind==="epoch"?"Earth epoch":"Explore";
}
function defs(root){
 const d=svg("defs");
 const left=svg("linearGradient",{id:"arcWarm",x1:"0%",y1:"0%",x2:"100%",y2:"0%"});
 [["0%","#efb85e"],["55%","#f7d494"],["100%","#cfe0b8"]].forEach(([at,col])=>left.appendChild(svg("stop",{offset:at,"stop-color":col})));d.appendChild(left);
 const right=svg("linearGradient",{id:"arcCool",x1:"0%",y1:"0%",x2:"100%",y2:"0%"});
 [["0%","#c9e1c2"],["50%","#c6addd"],["100%","#a781f2"]].forEach(([at,col])=>right.appendChild(svg("stop",{offset:at,"stop-color":col})));d.appendChild(right);
 const filter=svg("filter",{id:"arcGlow",x:"-20%",y:"-40%",width:"140%",height:"180%"});
 filter.appendChild(svg("feGaussianBlur",{stdDeviation:"5"}));d.appendChild(filter);
 palette.forEach((q,i)=>{
  const g=svg("radialGradient",{id:"planet-"+i,cx:"30%",cy:"24%",r:"78%"});
  [[0,q.c],[.45,q.b],[1,q.a]].forEach(([offset,color])=>g.appendChild(svg("stop",{offset:(offset*100)+"%","stop-color":color})));
  d.appendChild(g);
 });
 const glow=svg("radialGradient",{id:"halo"});
 glow.appendChild(svg("stop",{offset:"0","stop-color":"#fff7d1","stop-opacity":".9"}));
 glow.appendChild(svg("stop",{offset:"1","stop-color":"#fff9d9","stop-opacity":"0"}));d.appendChild(glow);
 root.appendChild(d);
}
function decoratePlanet(group,cx,cy,r,i,item){
 let layer=svg("g",{transform:"translate("+cx+" "+cy+")"});
 const halo=svg("circle",{r:r+19,cx:0,cy:0,fill:"url(#halo)",class:"stage-halo"});layer.appendChild(halo);
 layer.appendChild(svg("circle",{cx:0,cy:0,r:r+4,fill:"none",stroke:"#fffdf0","stroke-opacity":".6","stroke-width":"1"}));
 layer.appendChild(svg("circle",{cx:0,cy:0,r,fill:"url(#planet-"+i+")",class:"orb-core"}));
 // Astral spheres are symbolic illustrations, not literal modern planets.
 if(item.id==="cos-earth"||item.id==="earth-post"){
  layer.appendChild(svg("path",{d:"M-16 -28 Q3 -33 10 -18 L19 -14 18 -1 4 1 -2 14 -17 8 -22 -9Z",fill:"#9fc494",opacity:".87",stroke:"#eddfb7","stroke-width":".8"}));
  layer.appendChild(svg("path",{d:"M16 9Q29 5 25 18L15 29 7 19 10 12Z",fill:"#a7ba89",opacity:".8"}));
 } else if(i===4||i===5){
  [-.4,-.13,.16,.46].forEach((k,j)=>layer.appendChild(svg("ellipse",{cx:0,cy:k*r,rx:r*Math.sqrt(Math.max(.1,1-k*k))*.94,ry:r*.1,fill:"none",stroke:"#fff1db","stroke-opacity":(.25+.08*j),"stroke-width":"2.5"})));
 } else if(i===1||i===6){
  layer.appendChild(svg("path",{d:"M-"+(r*.7)+" 0 Q0 -"+(r*.4)+" "+(r*.65)+" "+(r*.1),fill:"none",stroke:"#fff4c5","stroke-opacity":".6","stroke-width":"3"}));
 }
 layer.appendChild(svg("ellipse",{cx:-r*.27,cy:-r*.33,rx:r*.38,ry:r*.13,fill:"#fffce2",opacity:".19",transform:"rotate(-30)"}));
 layer.appendChild(svg("circle",{cx:0,cy:0,r:r,fill:"none",stroke:"#ffffff","stroke-width":"2","stroke-opacity":".78"}));
 const num=svg("text",{x:0,y:6,"text-anchor":"middle","font-family":"Cormorant Garamond, Georgia, serif","font-size":r>.43*100?"29":"24","font-weight":"700",fill:"#fffaf4",stroke:"#373154","stroke-opacity":".3","stroke-width":"1", "paint-order":"stroke"},String(i+1));
 layer.appendChild(num);group.appendChild(layer);
}
function renderArc(){
 const root=$("arc-visual");root.replaceChildren();defs(root);
 const all=children(level),start=page*7,items=all.slice(start,start+7);
 const pts=stagePositions.slice(0,items.length);
 if(items.length===1)pts[0]=stagePositions[3];
 else if(items.length<7){const shift=Math.floor((7-items.length)/2);for(let i=0;i<items.length;i++)pts[i]=stagePositions[shift+i];}
 const leftAll=stagePositions.slice(0,4),rightAll=stagePositions.slice(3);
 const bgLeft=svg("path",{d:between(leftAll),stroke:"#e8c985","stroke-width":"17","stroke-opacity":".38",fill:"none",filter:"url(#arcGlow)"});
 const bgRight=svg("path",{d:between(rightAll),stroke:"#ba9be7","stroke-width":"17","stroke-opacity":".44",fill:"none",filter:"url(#arcGlow)"});
 root.appendChild(bgLeft);root.appendChild(bgRight);
 root.appendChild(svg("path",{d:between(leftAll),class:"cosmic-arc",stroke:"url(#arcWarm)"}));
 root.appendChild(svg("path",{d:between(rightAll),class:"cosmic-arc",stroke:"url(#arcCool)"}));
 for(let i=0;i<items.length;i++){
  const item=items[i],position=pts[i],idx=start+i,p=paletteFor(i,item),x=position[0],y=position[1],r=i===3&&items.length===7?47:36;
  const group=svg("g",{class:"arc-stage"+(selected===item.id?" selected":""),role:"button",tabindex:"0","data-node":item.id,"aria-label":item.label+", select for information"+(children(item.id).length?" and then explore sub-periods":"")});
  group.appendChild(svg("title",{},item.label+". "+item.summary));
  const key=["cos-saturn","cos-sun","cos-moon","cos-earth","cos-jupiter","cos-venus","cos-vulcan"].indexOf(item.id);
  decoratePlanet(group,x,y,r,key>=0?key:(i%7),item);
  const w=i===3&&items.length===7?194:168,plaqueY=y+r+7;
  group.appendChild(svg("rect",{x:x-w/2,y:plaqueY,width:w,height:49,rx:23,ry:23,class:"tag-plaque"}));
  group.appendChild(svg("text",{x,y:plaqueY+23,class:"stage-title"},stageLabel(item,idx)));
  group.appendChild(svg("text",{x,y:plaqueY+39,class:"stage-summary"},smallSubtitle(item)));
  group.addEventListener("click",()=>{
   if(selected===item.id&&children(item.id).length)navigate(item.id,true);
   else select(item.id);
  });
  group.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();if(selected===item.id&&children(item.id).length)navigate(item.id,true);else select(item.id);}});
  root.appendChild(group);
 }
 $("stage-progress").textContent=(items.length?start+1:0)+"–"+(start+items.length)+" OF "+all.length;
 $("prev-stage").disabled=!all.length||all.findIndex(x=>x.id===selected)<=0;
 $("next-stage").disabled=!all.length||all.findIndex(x=>x.id===selected)>=all.length-1;
 if(level==="root"){
  $("scene-subtitle").textContent="The Evolution of Earth and Humanity";
  $("main-heading").textContent="The Seven Planetary Conditions";
  $("scene-explanation").textContent="A cosmic evolution in seven great stages: descent toward material embodiment, Earth as a turning point, and an ascent toward spiritualization.";
  $("phase-left").hidden=false;$("phase-right").hidden=false;
 }else{
  $("main-heading").textContent=n(level)?.label||"Explore an epoch";
  $("scene-subtitle").textContent="Explore the stages within "+(n(level)?.label||"this period");
  $("scene-explanation").textContent="Select an interval to read its sources, then explore its nested developments. This curve is a navigation layout, not an asserted midpoint for this sublevel.";
  $("phase-left").hidden=true;$("phase-right").hidden=true;
 }
 const trail=$("arc-trail");trail.replaceChildren();
 pathTo(level).forEach((id,i)=>{
  if(i)trail.appendChild(html("span",null,"›"));
  const b=btn(id==="root"?"Whole evolution":n(id).label,()=>navigate(id,true),i===pathTo(level).length-1?"current":"");
  trail.appendChild(b);
 });
}
function nodeSourceIds(id){
 let nd=n(id);if(!nd)return [];
 if(nd.kind==="event")return events.get(id)?.source_ids||[];
 let all= index.events.filter(e=>e.parent_id===nd.group),ids=new Set();
 all.forEach(e=>e.source_ids.forEach(s=>ids.add(s)));
 const d=dossiers.get(id);if(d)d.priority_sources?.forEach(s=>ids.add(s));
 return [...ids];
}
function viewText(item){
 const d=dossiers.get(item.id);
 return d?.summary||item.summary||events.get(item.id)?.description||"Research entry linked to Steiner's works.";
}
function selectedRecord(){return n(selected)||n(level);}
function makeSourceLinks(parent,ids,limit=6,event=null){
 const audited=event?.audited_passages||[];
 const cited=new Set(audited.map(p=>p.source_id));
 const references=audited.map(p=>({source:sources.get(p.source_id),label:p.citation}));
 for(const id of new Set(ids)){
  if(references.length>=limit)break;
  if(cited.has(id))continue;
  const source=sources.get(id);
  if(source?.url)references.push({source,label:source.id+" · "+source.citation_name});
 }
 if(!references.length){textTo(parent,"p",null,"Source links for this passage are still being indexed.");return;}
 const container=html("div","link-list");
 for(const {source,label} of references){
  const a=html("a","source-link");
  a.href=source.url;a.target="_blank";a.rel="noopener noreferrer";
  textTo(a,"strong",null,label);textTo(a,"span",null,"↗");container.appendChild(a);
 }
 for(const id of event?.organ_ids||[]){
  const a=textTo(container,"a","source-link","Organ dossier · "+id.replace(/^organ-/,"").replaceAll("-"," "));
  a.href="organs.html?organ="+encodeURIComponent(id);
 }
 parent.appendChild(container);
}
function renderTabs(){
 document.querySelectorAll("[data-tab]").forEach(b=>{const yes=b.dataset.tab===tab;b.setAttribute("aria-selected",String(yes));});
 const panel=$("tab-panel");panel.replaceChildren();
 if(extraRecord){
   const e=extraRecord;
   panel.setAttribute("aria-labelledby","tab-"+tab);
   textTo(panel,"div","label",e.id);
   textTo(panel,"h2",null,e.title);
   textTo(panel,"p",null,e.description);
   makeSourceLinks(panel,e.source_ids,6,e);
   return;
 }
 const item=selectedRecord();if(!item)return;
 panel.setAttribute("aria-labelledby","tab-"+tab);
 const d=dossiers.get(item.id),ev=events.get(item.id);
 const summary=viewText(item);
 if(tab==="overview"){
   const wrap=html("div","main-overview");
   const art=textTo(wrap,"div","selected-art",item.kind==="root"?"✧":item.kind==="cosmic"?"✦":item.kind==="event"?"✧":"◈");
   if(item.id==="cos-earth")art.textContent="◉";
   const copy=html("div");
   textTo(copy,"div","label",item.kind==="root"?"THE COMPLETE CYCLE":(item.kind==="event"?"SOURCE-LINKED CLAIM":item.status==="future"?"PROJECTED STAGE":"CHRONOLOGY STAGE"));
   textTo(copy,"h2",null,item.kind==="root"?"Seven planetary conditions":item.label);
   if(d)textTo(copy,"div","main-sub",d.position);
   else if(item.kind==="cosmic")textTo(copy,"div","main-sub","A great cosmic condition");
   textTo(copy,"p",null,summary);wrap.appendChild(copy);panel.appendChild(wrap);
   if(d){const facts=html("div","facts");[d.consciousness,d.human_organization].forEach(s=>textTo(facts,"span","fact",s.length>95?s.slice(0,92)+"…":s));panel.appendChild(facts);}
   else if(ev){const facts=html("div","facts");textTo(facts,"span","fact","Evidence: "+ev.evidence_flags.join("/"));textTo(facts,"span","fact","References: "+ev.source_ids.join(", "));panel.appendChild(facts);}
   else {const c=children(item.id);if(c.length){const facts=html("div","facts");textTo(facts,"span","fact",c.length+" nested intervals or events");panel.appendChild(facts);}}
 }else if(tab==="development"){
   textTo(panel,"h3",null,"What changes during "+item.label+"?");
   let list=d?.milestones?.map(m=>({title:m.heading,detail:m.finding}))||
    (item.group?index.events.filter(e=>e.parent_id===item.group).slice(0,7).map(e=>({title:e.title,detail:e.description})):[]);
   if(ev)list=[{title:ev.title,detail:ev.description}];
   if(!list.length)list=children(item.id).slice(0,7).map(c=>({title:c.label,detail:c.summary}));
   const ul=html("ul","research-bullets");list.slice(0,8).forEach(m=>textTo(ul,"li",null,m.title+" — "+m.detail));panel.appendChild(ul);
 }else if(tab==="human"){
   textTo(panel,"h3",null,"Human development and consciousness");
   if(d){textTo(panel,"p",null,d.human_organization);textTo(panel,"p",null,d.consciousness);textTo(panel,"p",null,d.elements);}
   else if(ev){textTo(panel,"p",null,ev.description);textTo(panel,"p","caution","This is a source-attributed claim, not an empirical medical or anthropological finding.");}
   else{textTo(panel,"p",null,"Research at this level is organized in the child-stage and source records. Select a child to examine its specific human-development claims.");}
 }else if(tab==="beings"){
   textTo(panel,"h3",null,"Spiritual hierarchies and agencies");
   const agencies=d?.agencies||[];
   if(agencies.length){const ul=html("ul","research-bullets");agencies.forEach(a=>textTo(ul,"li",null,a));panel.appendChild(ul);}
   else{textTo(panel,"p",null,"This stage has not yet been given a separately audited hierarchy dossier. Source-linked entries remain accessible below; do not infer that a named being acts only in one epoch.");}
   const a=html("a","open-dossier","Explore the hierarchies atlas ↗");a.href="agency.html";panel.appendChild(a);
 }else if(tab==="sources"){
   textTo(panel,"h3",null,"Read Steiner's original sources");
   if(ev){textTo(panel,"p",null,"Evidence status: "+ev.evidence_flags.map(x=>({P:"pertinent passage checked",L:"source located",I:"editorial synthesis",D:"derived dating",X:"special caution"}[x]||x)).join(" · "));}
   makeSourceLinks(panel,nodeSourceIds(item.id),8,ev);
   const a=html("a","open-dossier","Read the master chronology and research method ↗");a.href="../docs/STEINER_HIERARCHICAL_CHRONOLOGY_MASTER_V01.md";panel.appendChild(a);
 }
}
function iconFor(item,i){
 if(item.id==="earth-polar")return "△";
 if(item.id==="earth-hyper")return "✧";
 if(item.id==="earth-lemur")return "☼";
 if(item.id==="earth-atlant")return "⌑";
 if(item.id==="earth-post")return "◈";
 if(item.id==="period-14")return "✺";
 return ["◈","✧","☼","⌑","✦","△","◉"][i%7];
}
function renderExtras(){
 const item=selectedRecord(),c=children(item.id);
 $("extra-title").textContent=c.length?"Within "+item.label+" — further exploration":item.kind==="event"?"Passage and context":"Related research";
 const box=$("depth-thumbnails");box.replaceChildren();
 c.slice(0,4).forEach((node,i)=>{
  const b=btn("",()=>select(node.id),"thumb");
  const art=textTo(b,"span","thumb-scene",iconFor(node,i));art.setAttribute("aria-hidden","true");
  textTo(b,"span","thumb-name",node.label);box.appendChild(b);
 });
 if(!c.length){const alt=children(level).filter(x=>x.id!==item.id).slice(0,4);alt.forEach((node,i)=>{
  const b=btn("",()=>select(node.id),"thumb");
  const art=textTo(b,"span","thumb-scene",iconFor(node,i));art.setAttribute("aria-hidden","true");
  textTo(b,"span","thumb-name",node.label);box.appendChild(b);
 });}
 const action=$("explore-selected");action.disabled=c.length===0;
 action.firstChild.textContent=c.length?"Explore "+item.label+" in depth ":"No deeper divisions yet ";
 $("research-status").textContent=dossiers.has(item.id)?
 "Expanded dossier · "+dossiers.get(item.id).milestones.length+" passage-linked findings":
 item.kind==="event"?"Source-linked entry · "+(events.get(item.id)?.source_ids.length||0)+" reference(s)":
 item.group?"Stage-linked research · "+index.events.filter(e=>e.parent_id===item.group).length+" entries":"Hierarchical Atlas · Source-linked research";
}
function renderEventCards(){
 const container=$("event-grid");container.replaceChildren();
 let node=selectedRecord(),c=children(node.id);
 if(c.length===0&&node.parent)c=children(node.parent);
 if(!c.length){$("events-section").hidden=true;return;}
 const shouldShow=c[0]?.kind==="event"||node.kind==="event";
 $("events-section").hidden=!shouldShow;
 if(!shouldShow)return;
 $("events-title").textContent="Explore the events within "+(node.kind==="event"?n(node.parent).label:node.label);
 $("events-count").textContent=c.length+" research entries";
 c.forEach((child,i)=>{
  const b=btn("",()=>{select(child.id);$("tab-panel").scrollIntoView({behavior:"smooth",block:"center"});},"event-card");
  textTo(b,"span","event-ref",child.id);
  textTo(b,"strong",null,child.label);
  textTo(b,"small",null,events.get(child.id)?.evidence_flags.join(" · ")||"Source record");
  container.appendChild(b);
 });
}
function renderDeeper(){
 document.querySelectorAll(".deeper-tile[data-target]").forEach(b=>b.classList.toggle("active",b.dataset.target===level));
}
function render(){
 if(!index)return;
 renderArc();renderTabs();renderExtras();renderEventCards();renderDeeper();
}
function stageStep(delta){
 const c=children(level);let idx=c.findIndex(x=>x.id===selected);
 if(idx<0)idx=0;idx=Math.min(c.length-1,Math.max(0,idx+delta));
 if(c[idx])select(c[idx].id);
}
function searchOpen(){
 const box=$("search-dialog");box.hidden=false;searchActive=true;$("search-input").focus();renderSearch();
}
function searchClose(){
 $("search-dialog").hidden=true;searchActive=false;$("search-open").focus();
}
function renderSearch(){
 const q=$("search-input").value.trim().toLowerCase(),target=$("search-results");target.replaceChildren();
 if(q.length<2){textTo(target,"p",null,"Search cosmic stages, Earth epochs, cultural periods and individual research entries.");return;}
 const matches=[...nodes.values()].filter(x=>x.id!=="root"&&(x.label+" "+x.summary+" "+x.id).toLowerCase().includes(q)).slice(0,18);
 const crossEra=index.events.filter(e=>!nodes.has(e.id)&&(e.title+" "+e.description+" "+e.id).toLowerCase().includes(q)).slice(0,8);
 if(!matches.length&&!crossEra.length){textTo(target,"p",null,"No matches. Try a broader term.");return;}
 matches.forEach(x=>{
  const b=btn("",()=>{
   if(children(x.id).length&&x.kind!=="event"){if(x.parent&&x.parent!=="root")navigate(x.parent);else navigate("root");select(x.id);}
   else{const parent=x.parent||"root";navigate(parent);select(x.id);}
   searchClose();document.querySelector(".research-card").scrollIntoView({behavior:"smooth",block:"center"});
  },"search-result");
  textTo(b,"strong",null,x.label);
  textTo(b,"small",null,(x.kind==="event"?"Research event":x.kind==="epoch"?"Earth epoch":x.kind==="culture"?"Cultural period":"Cosmic condition")+" · "+x.id);
  target.appendChild(b);
 });
 crossEra.forEach(e=>{
  const result=btn("",()=>{openCrossEraRecord(e);searchClose();},"search-result");
  textTo(result,"strong",null,e.title);
  textTo(result,"small",null,"Cross-era research · "+e.id);
  target.appendChild(result);
 });
}
function openCrossEraRecord(e){
 extraRecord=e;
 setHash(e.id);
 renderTabs();
 $("tab-panel").scrollIntoView({behavior:"smooth",block:"center"});
}
function showCrossEra(){
 const sections=["CH-1","CH-5","CH-17","CH-20","CH-24","CH-25","CH-26","CH-27"];
 const container=$("event-grid");container.replaceChildren();$("events-section").hidden=false;
 $("events-title").textContent="Cross-era and recurring developments";
 const found=index.events.filter(x=>sections.includes(x.parent_id));$("events-count").textContent=found.length+" records across eras";
 found.forEach(e=>{
   const b=btn("",()=>openCrossEraRecord(e),"event-card");
   textTo(b,"span","event-ref",e.id);
   textTo(b,"strong",null,e.title);textTo(b,"small",null,groups.get(e.parent_id)?.title||"Cross-era");
   container.appendChild(b);
 });
 $("events-section").scrollIntoView({behavior:"smooth",block:"start"});
}
function attach(){
 document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{tab=b.dataset.tab;renderTabs();}));
 document.querySelectorAll(".deeper-tile[data-target]").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.target==="cross-era")showCrossEra();
  else navigate(b.dataset.target,true);
 }));
 $("explore-selected").addEventListener("click",deeper);
 $("prev-stage").addEventListener("click",()=>stageStep(-1));
 $("next-stage").addEventListener("click",()=>stageStep(1));
 $("search-open").addEventListener("click",searchOpen);
 $("search-close").addEventListener("click",searchClose);
 $("search-input").addEventListener("input",renderSearch);
 $("search-dialog").addEventListener("click",e=>{if(e.target===$("search-dialog"))searchClose();});
 document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&searchActive){e.preventDefault();searchClose();return;}
  if(e.target.matches("input,textarea,select")||searchActive)return;
  if(e.key==="ArrowRight"){e.preventDefault();stageStep(1);}
  if(e.key==="ArrowLeft"){e.preventDefault();stageStep(-1);}
  if(e.key==="Backspace"&&level!=="root"){e.preventDefault();goOut();}
  if((e.key==="Enter"||e.key===" ")&&e.target===document.body){e.preventDefault();deeper();}
 });
 window.addEventListener("hashchange",()=>{
  let id=decodeURIComponent(location.hash.slice(1));
  if(!nodes.has(id)){
   const record=events.get(id);
   if(record)openCrossEraRecord(record);
   return;
  }
  if(children(id).length)navigate(id);else{navigate(n(id).parent||"root");select(id);}
 });
}
async function init(){
 attach();
 try{
  const [a,b]=await Promise.all([fetch(INDEX_URL,{cache:"no-store"}),fetch(DOSSIER_URL,{cache:"no-store"})]);
  if(!a.ok)throw Error("Chronology data HTTP "+a.status);
  const data=await a.json();if(data.events?.length<200)throw Error("Research data is incomplete");
  construct(data);
  if(b.ok){const d=await b.json();(d.conditions||[]).forEach(x=>dossiers.set(x.node_id,x));}
  let id=decodeURIComponent(location.hash.slice(1));
  if(nodes.has(id)){
   if(children(id).length){level=id;selected=preferred(id);}
   else{level=n(id).parent||"root";selected=id;}
   let idx=children(level).findIndex(x=>x.id===selected);page=Math.max(0,Math.floor(idx/7));
  }else{extraRecord=events.get(id)||null;}
  render();
  window.__arcPoc={ready:true,entryCount:data.events.length,dossierCount:dossiers.size,rootStages:children("root").length,earthEpochs:children("cos-earth").length,culturalPeriods:children("earth-post").length,state:()=>({level,selected,tab,page}),navigate,select};
 }catch(err){
  const p=$("tab-panel");p.replaceChildren();textTo(p,"h2",null,"Research data unavailable");textTo(p,"p",null,"The visualization could not load its source-linked JSON data. "+err.message);
 }
}
init();
})();