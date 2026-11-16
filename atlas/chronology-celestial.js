"use strict";
(() => {
 const DATA_URL="../research/steiner-hierarchical-chronology-events-v02.json";
 const DOSSIER_URL="../research/steiner-cosmic-condition-dossiers-v02.json";
 const NS="http://www.w3.org/2000/svg";
 const $=id=>document.getElementById(id);
 const nodes=new Map(),events=new Map(),groups=new Map(),sources=new Map(),dossiers=new Map();
 let data=null,level="root",selected="cos-earth",rotation=0,drag=null,suppress=false,searching=false,showingAll=false,extraRecord=null;
 const CX=309,CY=406,R=355,GW=820,GH=790;
 const kinds={root:"ENTIRE COSMIC DEVELOPMENT",cosmic:"COSMIC EVOLUTION",epoch:"GREAT EARTH EPOCH",culture:"CULTURAL EVOLUTION",event:"RESEARCH ENTRY"};
 const colors={past:"#e6b876",present:"#a9d8c6",future:"#c8b5e5"};
 function add(id,label,parent,kind,group,status,description){nodes.set(id,{id,label,parent,kind,group,status,description:description||""});}
 function construct(d){
  data=d;d.events.forEach(x=>events.set(x.id,x));d.sources.forEach(x=>sources.set(x.id,x));d.groups.forEach(x=>groups.set(x.id,x));
  add("root","Seven cosmic conditions",null,"root",null,"past","The seven great cosmic conditions in Steiner's account, presented as a source-linked chronology. The wheel represents the sequence, not measured physical time.");
  [
   ["cos-saturn","Old Saturn","CH-2","past","First condition: warmth and the earliest physical-body germ."],
   ["cos-sun","Old Sun","CH-3","past","Second condition: the etheric or life-body germ."],
   ["cos-moon","Old Moon","CH-4","past","Third condition: the astral body and picture-consciousness."],
   ["cos-earth","Earth","CH-5","present","Fourth condition: the developing human I, conscious freedom and the transformation of inherited wisdom into love."],
   ["cos-jupiter","Future Jupiter","CH-21","future","Fifth projected condition: self-conscious image-awareness."],
   ["cos-venus","Future Venus","CH-22","future","Sixth projected condition: inspired and creative spiritual awareness."],
   ["cos-vulcan","Future Vulcan","CH-23","future","Seventh projected condition: intuitive participation while individuality persists."]
  ].forEach(x=>add(x[0],x[1],"root","cosmic",x[2],x[3],x[4]));
  [
   ["earth-polar","Polar","CH-6","past","The first great Earth epoch in Steiner's esoteric account."],
   ["earth-hyper","Hyperborean","CH-7","past","The second great Earth epoch in Steiner's esoteric account."],
   ["earth-lemur","Lemurian","CH-8","past","The third great Earth epoch, concerned with changing human organization."],
   ["earth-atlant","Atlantean","CH-9","past","The fourth great Earth epoch, with seven named subdivisions and overlapping processes."],
   ["earth-post","Post-Atlantean",null,"present","The fifth great Earth epoch, consisting of seven cultural periods."],
   ["earth-sixth","Sixth Earth Epoch","CH-18","future","A projected great Earth epoch associated with seven seals."],
   ["earth-seventh","Seventh Earth Epoch","CH-19","future","A projected great Earth epoch associated with seven trumpets."]
  ].forEach(x=>add(x[0],x[1],"cos-earth","epoch",x[2],x[3],x[4]));
  [
   "Ancient Indian","Ancient Persian","Egypto-Chaldean","Greco-Roman","Consciousness-Soul Age","Sixth Cultural Period","Seventh Cultural Period"
  ].forEach((label,i)=>add("period-"+(10+i),label,"earth-post","culture","CH-"+(10+i),i<4?"past":i===4?"present":"future",groups.get("CH-"+(10+i))?.title||"Post-Atlantean cultural period"));
  for(const n of [...nodes.values()]){
   if(!n.group||n.id==="cos-earth")continue; // Earth-wide records cross multiple epochs, not extra formal Earth epochs.
   for(const e of d.events.filter(x=>x.parent_id===n.group)){
    add(e.id,e.title.replace(/\.$/,""),n.id,"event",null,n.status==="future"?"future":n.status==="present"?"present":"past",e.description);
   }
  }
 }
 function children(id){return [...nodes.values()].filter(n=>n.parent===id);}
 function chain(id){const x=[];while(id&&nodes.has(id)){x.unshift(id);id=nodes.get(id).parent;}return x;}
 function preferred(id){const p={root:"cos-earth","cos-earth":"earth-post","earth-post":"period-14"}[id];return children(id).find(c=>c.id===p)?.id||children(id)[0]?.id||null;}
 function setHash(id){try{history.replaceState(null,"","#"+encodeURIComponent(id));}catch(e){location.hash=encodeURIComponent(id);}}
 function fullLabel(node){return node?.label||"The complete chronology";}
 function compact(text,max){if(text.length<=max)return text;const sub=text.slice(0,max-1);const cut=sub.lastIndexOf(" ");return (cut>max*.6?sub.slice(0,cut):sub)+"…";}
 function append(to,tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;to.appendChild(e);return e;}
 function button(text,fn,className){const b=document.createElement("button");b.type="button";if(className)b.className=className;b.textContent=text;b.addEventListener("click",fn);return b;}
 function svg(tag,attrs,text){const el=document.createElementNS(NS,tag);if(attrs)for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;return el;}
 function point(radius,degrees){const a=degrees*Math.PI/180;return [CX+radius*Math.cos(a),CY+radius*Math.sin(a)];}
 function degreesBetween(x,y){return (x-y+540)%360-180;}
 function normalize(d){return (d%360+540)%360-180;}
 function initialRotation(id){
   const list=children(id),p=preferred(id),index=Math.max(0,list.findIndex(x=>x.id===p));
   return -baseAngle(index,list.length);
 }
 function baseAngle(i,count){
   if(count<=7)return (i-(count-1)/2)*42;
   return i*360/count;
 }
 const rotations=new Map();
 function currentRotation(){if(!rotations.has(level))rotations.set(level,initialRotation(level));return rotations.get(level);}
 function position(a){return point(R,a);}
 function angleAt(e){
   const rect=$("celestial-wheel").getBoundingClientRect();
   const hubX=rect.left+CX/GW*rect.width,hubY=rect.top+CY/GH*rect.height;
   return Math.atan2(e.clientY-hubY,e.clientX-hubX)*180/Math.PI;
 }
 function buildWheel(){
  const dial=$("celestial-wheel");dial.replaceChildren();
  const defs=svg("defs");
  const metal=svg("radialGradient",{id:"hubMetal",cx:"28%",cy:"26%",r:"78%"});
  [["0%","#ffecca"],["32%","#e7b46c"],["68%","#8f6438"],["100%","#4b3829"]].forEach(([offset,color])=>metal.appendChild(svg("stop",{offset,"stop-color":color})));
  defs.appendChild(metal);
  const aura=svg("radialGradient",{id:"aura"});
  [["0%","#e8bf6a","#f9e0a1"],["50%","#92794a","#92794a"],["100%","#38455d","#3a4960"]].forEach(([offset,color])=>aura.appendChild(svg("stop",{offset,"stop-color":color,"stop-opacity":offset==="100%"?".08":".32"})));
  defs.appendChild(aura);
  const glow=svg("filter",{id:"glowFilter",x:"-70%",y:"-70%",width:"240%",height:"240%"});
  glow.appendChild(svg("feGaussianBlur",{stdDeviation:"4"}));defs.appendChild(glow);
  dial.appendChild(defs);
  dial.appendChild(svg("circle",{cx:CX,cy:CY,r:395,fill:"none",stroke:"#d0aa6b","stroke-opacity":".09"}));
  for(const r of [187,273,354,366]){
   const path="M "+point(r,-90).join(" ")+" A "+r+" "+r+" 0 0 1 "+point(r,90).join(" ");
   dial.appendChild(svg("path",{d:path,class:"orbit"+(r===273?" dashed":"")}));
  }
  for(let i=0;i<=48;i++){
   let a=-90+i*180/48;
   const inner=point(i%4===0?360:363,a),outer=point(i%4===0?373:369,a);
   dial.appendChild(svg("line",{x1:inner[0],y1:inner[1],x2:outer[0],y2:outer[1],stroke:"#d2b078","stroke-width":i%4===0?"1.6":".8","stroke-opacity":i%4===0?".8":".38"}));
  }
  dial.appendChild(svg("line",{x1:CX,y1:28,x2:CX,y2:760,class:"axis"}));
  // Unlabeled ghost spokes are an instrument ornament, not additional chronological nodes.
  for(let i=-9;i<=9;i++){
    const a=i*9.1;
    const p=point(R*(i%2===0?".81":".63"),a);
    dial.appendChild(svg("line",{x1:CX,y1:CY,x2:p[0],y2:p[1],class:"minor"}));
  }
  let list=children(level),visible=0,angleOffset=currentRotation();
  list.forEach((node,i)=>{
   const angle=normalize(baseAngle(i,list.length)+angleOffset);
   if(Math.cos(angle*Math.PI/180)<.075)return;
   visible++;
   const end=position(angle);
   const g=svg("g",{class:"wheel-ray"+(selected===node.id?" active":""),role:"button",tabindex:"0","data-ray":node.id,"aria-label":node.label+". "+(children(node.id).length?"Select to explore deeper":"Select to read source-linked event")});
   g.appendChild(svg("title",{},node.label+". "+node.description));
   g.appendChild(svg("line",{x1:CX,y1:CY,x2:end[0],y2:end[1],class:"stem"}));
   g.appendChild(svg("line",{x1:CX,y1:CY,x2:end[0],y2:end[1],class:"hit"}));
   g.appendChild(svg("circle",{cx:end[0],cy:end[1],r:selected===node.id?8.2:5.2,fill:selected===node.id?"#ffdb9a":"#ecc68b",class:"end-glow"}));
   let labelRadius=291;
   const lx=point(labelRadius,angle)[0]+9,ly=point(labelRadius,angle)[1];
   const maxChars=list.length>12?17:23;
   const label=compact(node.label,maxChars);
   g.appendChild(svg("text",{x:lx,y:ly-2,class:"ray-label","dominant-baseline":"middle"},label));
   if(list.length<=9){g.appendChild(svg("text",{x:lx,y:ly+16,class:"ray-caption"},""+(i+1).toString().padStart(2,"0")+" · "+(node.status==="future"?"Projected":node.kind==="event"?"Event":node.kind==="culture"?"Culture":node.kind==="epoch"?"Epoch":"Stage")));}
   g.addEventListener("click",()=>{if(suppress)return;select(node.id);});
   g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(node.id);}});
   dial.appendChild(g);
  });
  const hub=svg("g",{"aria-hidden":"true"});
  hub.appendChild(svg("circle",{cx:CX,cy:CY,r:84,fill:"url(#aura)","stroke":"#b18b50","stroke-width":".7","stroke-opacity":".45"}));
  for(const r of [76,65,56])hub.appendChild(svg("circle",{cx:CX,cy:CY,r,fill:"none",stroke:"#d5aa72", "stroke-opacity":r===76?".7":".45","stroke-width":r===76?"1.4":"1"}));
  for(let i=0;i<6;i++){const p=point(69,i*60);hub.appendChild(svg("circle",{cx:p[0],cy:p[1],r:2.8,fill:"#d5ac70"}));}
  hub.appendChild(svg("circle",{cx:CX,cy:CY,r:53,class:"wheel-hub-ring"}));
  hub.appendChild(svg("circle",{cx:CX,cy:CY,r:44,class:"wheel-hub-core"}));
  const sigil=svg("g",{fill:"none",stroke:"#ebc78b","stroke-opacity":".9","stroke-width":"1"});
  for(let i=0;i<6;i++){
    const p1=point(32,i*60),p2=point(32,(i+2)*60);
    sigil.appendChild(svg("line",{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1]}));
  }
  sigil.appendChild(svg("circle",{cx:CX,cy:CY,r:29}));
  hub.appendChild(sigil);
  hub.appendChild(svg("circle",{cx:CX,cy:CY,r:8,fill:"#edd7aa",stroke:"#fff3c5","stroke-width":"1.5"}));
  dial.appendChild(hub);
  $("wheel-count").textContent=visible+" of "+list.length+" visible";
 }
 function select(id){
   if(!nodes.has(id))return;
   extraRecord=null;
   const node=nodes.get(id);
   if(node.parent&&node.parent!==level){level=node.parent;currentRotation();}
   selected=id;
   setHash(id);
   render();
 }
 function enter(id){
   if(!nodes.has(id))return;
   if(!children(id).length){select(id);return;}
   level=id;selected=preferred(id)||id;extraRecord=null;currentRotation();setHash(id);render();
 }
 function out(){
  if(level==="root")return;
  let current=level;level=nodes.get(level)?.parent||"root";selected=current;extraRecord=null;setHash(selected);render();
 }
 function reset(){level="root";selected="cos-earth";extraRecord=null;rotations.set("root",initialRotation("root"));setHash("root");render();}
 function traverse(id){
   if(!nodes.has(id))return;
   let node=nodes.get(id);
   if(children(id).length){enter(id);}
   else{level=node.parent||"root";select(id);}
 }
 function rotate(delta){rotations.set(level,currentRotation()+delta);buildWheel();}
 function fieldName(){return level==="root"?"COSMIC CONDITIONS":nodes.get(level)?.kind==="cosmic"?"EARTH / COSMIC INTERVALS":nodes.get(level)?.kind==="epoch"?"EARTH EPOCHS":nodes.get(level)?.kind==="culture"?"CULTURAL PERIODS":"RESEARCH EVENTS";}
 function getSourceIds(node){
   if(!node)return [];
   if(node.kind==="event")return events.get(node.id)?.source_ids||[];
   const ids=new Set();
   if(node.group)data.events.filter(e=>e.parent_id===node.group).forEach(e=>e.source_ids.forEach(id=>ids.add(id)));
   // Aggregate sources for structural bridge nodes such as Post-Atlantean,
   // which have seven formal children but no dedicated CH group of their own.
   if(!node.group){for(const next of children(node.id)){if(next.group){
     data.events.filter(e=>e.parent_id===next.group).forEach(e=>e.source_ids.forEach(id=>ids.add(id)));
   }}}
   if(dossiers.has(node.id))dossiers.get(node.id).priority_sources.forEach(id=>ids.add(id));
   return [...ids];
 }
 function evidence(flag){return {P:"Passage checked",L:"Source lead",I:"Editorial synthesis",D:"Derived dating",X:"Context caution"}[flag]||flag;}
 function phrases(node){
   if(!node)return [];
   if(node.kind==="event"){
     const ev=events.get(node.id);
     return [...(ev.evidence_flags||[]).map(evidence),"Within "+(groups.get(ev.parent_id)?.title||"Steiner's chronology")];
   }
   const d=dossiers.get(node.id);
   if(d)return [compact(d.human_organization,88),compact(d.consciousness,88),...d.milestones.slice(0,3).map(m=>m.heading)];
   if(node.group){const e=data.events.filter(x=>x.parent_id===node.group);return e.slice(0,5).map(x=>x.title.replace(/\.$/,""));}
   return children(node.id).slice(0,5).map(x=>x.label);
 }
 function selectResearch(e){
    const node=nodes.get(e.id);
    if(node){select(node.id);return;}
    extraRecord=e;renderPanel();
 }
 function related(node){
   if(extraRecord)return [];
   let arr=children(node.id);
   if(arr.length)return arr.map(x=>({id:x.id,title:x.label,code:x.id,mode:"node"}));
   if(node.kind==="event"){
     return children(node.parent).filter(x=>x.id!==node.id).slice(0,12).map(x=>({id:x.id,title:x.label,code:x.id,mode:"node"}));
   }
   if(node.group)return data.events.filter(e=>e.parent_id===node.group).map(e=>({id:e.id,title:e.title.replace(/\.$/,""),code:e.id,mode:"record"}));
   return [];
 }
 function recordForItem(item){
  if(item.mode==="node"){select(item.id);return;}
  let event=events.get(item.id);
  if(event)selectResearch(event);
 }
 function renderPanel(){
   const node=nodes.get(selected)||nodes.get(level);
   if(!node)return;
   const record=extraRecord;
   const d=!record?dossiers.get(node.id):null;
   const ev=record||events.get(node.id);
   const total=children(level).length,rank=Math.max(0,children(level).findIndex(x=>x.id===node.id));
   $("node-id").textContent=record?record.id:String(rank+1).padStart(2,"0")+" / "+String(total).padStart(2,"0");
   $("node-category").textContent=record?"CROSS-ERA RESEARCH":(kinds[node.kind]||"CHRONOLOGY");
   $("node-title").textContent=record?record.title.replace(/\.$/,""):node.id==="cos-earth"?"Earth — The Turning Point":node.label;
   $("node-range").textContent=record?(groups.get(record.parent_id)?.title||record.parent_id).toUpperCase():node.kind==="cosmic"?(rank+1)+" OF SEVEN COSMIC CONDITIONS":node.kind==="epoch"?(rank+1)+" OF SEVEN EARTH EPOCHS":node.kind==="culture"?(rank+1)+" OF SEVEN CULTURAL PERIODS":node.kind==="event"?"SOURCE-LINKED CHRONOLOGY EVENT":"EXPLORING THE EVOLUTION";
   $("node-description").textContent=record?record.description:d?.summary||node.description;
   const them=$("key-themes");them.replaceChildren();
   const themes=record?record.evidence_flags.map(evidence):phrases(node);
   themes.slice(0,5).forEach(t=>append(them,"li",null,t));
   const list=related(node),target=$("related-events");target.replaceChildren();
   $("events-heading").textContent=record?"SOURCE CONTEXT":list.length?"KEY EVENTS / SUBDIVISIONS":"RELATED RESEARCH";
   $("view-all").disabled=!list.length;$("view-all").hidden=!list.length;
   list.slice(0,showingAll?18:5).forEach(item=>{
      const row=append(target,"div","event-line");
      const b=button("",()=>recordForItem(item));
      append(b,"span","event-code",item.code);
      append(b,"span",null,item.title);
      row.appendChild(b);
   });
   if(!list.length)append(target,"p","research-note","No smaller chronological divisions are indexed at this node.");
   const idList=record?record.source_ids:getSourceIds(node);
   const sourceBox=$("source-list");sourceBox.replaceChildren();
   idList.slice(0,5).map(id=>sources.get(id)).filter(Boolean).forEach(s=>{
      const a=append(sourceBox,"a",null,s.id+" · "+compact(s.citation_name,31)+" ↗");a.href=s.url;
      a.target="_blank";a.rel="noopener noreferrer";a.title=s.citation_name;
   });
   if(!idList.length)append(sourceBox,"span","research-note","Source leads are being indexed.");
   $("evidence-label").textContent=record?record.evidence_flags.map(evidence).join(" · "):d?"DETAILED DOSSIER":"SOURCE-ATTRIBUTED";
   const explore=$("explore");explore.disabled=!!record||children(node.id).length===0;
   explore.firstChild.textContent=explore.disabled?"READ THE SOURCES ABOVE ":"EXPLORE THIS STAGE ";
   $("zoom-in").disabled=!!record||!children(node.id).length;
   $("zoom-out").disabled=level==="root";
 }
 function renderAll(){
   const node=nodes.get(selected),raw=extraRecord;
   const items=raw?[raw]:node?related(node):[];
   const box=$("event-grid");box.replaceChildren();
   $("all-events-title").textContent=raw?raw.title.replace(/\.$/,""):"Within "+(node?.label||"the chronology");
   items.forEach(item=>{
      const event=events.get(item.id);
      const b=button("",()=>{if(item.mode)recordForItem(item);else selectResearch(item);document.querySelector(".information").scrollIntoView({behavior:"smooth",block:"start"});},"event-card");
      append(b,"small",null,item.code||item.id);
      append(b,"strong",null,item.title.replace(/\.$/,""));
      if(event)append(b,"small",null,event.evidence_flags.join(" · "));
      box.appendChild(b);
   });
   $("all-events").hidden=false;
 }
 function renderMenu(){
   const names=chain(level),el=$("breadcrumbs");el.replaceChildren();
   names.forEach((id,i)=>{
     if(i)append(el,"i",null,"›");
     el.appendChild(button(id==="root"?"Whole evolution":nodes.get(id).label,()=>enter(id)));
   });
   const menu=$("level-menu");menu.replaceChildren();
   [{id:"root",name:"Seven cosmic conditions"},{id:"cos-earth",name:"Seven great Earth epochs"},{id:"earth-post",name:"Seven cultural periods"}].forEach(x=>{
      menu.appendChild(button(x.name,()=>{enter(x.id);menu.hidden=true;$("level-menu-button").setAttribute("aria-expanded","false");}));
   });
   const target=nodes.get(level);
   $("current-level").textContent="LEVEL "+chain(level).length+" · "+(target?.label||"COSMIC CONDITIONS").toUpperCase();
   $("zoom-label").textContent="LEVEL "+chain(level).length;
   const dots=$("page-dots");dots.replaceChildren();
   for(let i=0;i<4;i++)append(dots,"span",i===chain(level).length-1?"active":"");
 }
 function render(){if(!data)return;buildWheel();showingAll=false;renderMenu();renderPanel();}
 function drawSearch(){
   const q=$("search-input").value.trim().toLowerCase(),out=$("search-results");out.replaceChildren();
   if(q.length<2){append(out,"p","research-note","Search all 231 research records and the parent evolutionary stages.");return;}
   const matches=[...nodes.values()].filter(x=>x.id!=="root"&&(x.label+" "+x.description).toLowerCase().includes(q)).slice(0,12);
   const ids=new Set(matches.map(n=>n.id));
   const additional=data.events.filter(e=>!ids.has(e.id)&&(e.title+" "+e.description).toLowerCase().includes(q)).slice(0,8);
   if(!matches.length&&!additional.length)append(out,"p","research-note","No matching entries. Try a shorter term.");
   for(const item of matches){
     const b=button("",()=>{if(children(item.id).length){if(item.parent)enter(item.parent);select(item.id);}else traverse(item.id);closeSearch();}, "search-results-item");
     append(b,"strong",null,item.label);append(b,"small",null,item.kind+" · "+item.id);out.appendChild(b);
   }
   for(const item of additional){
     const b=button("",()=>{selectResearch(item);closeSearch();},"search-results-item");
     append(b,"strong",null,item.title.replace(/\.$/,""));append(b,"small",null,"Research · "+item.id);out.appendChild(b);
   }
 }
 function closeSearch(){$("search-overlay").hidden=true;searching=false;$("search-open").focus();}
 function toast(message){
   const el=$("toast");el.textContent=message;el.hidden=false;
   clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,2400);
 }
 function attach(){
   const wheel=$("celestial-wheel");
   wheel.addEventListener("pointerdown",e=>{
     if(e.button!==0)return;
     drag={id:e.pointerId,x:e.clientX,y:e.clientY,a:angleAt(e),start:currentRotation(),moved:false};
   });
   wheel.addEventListener("pointermove",e=>{
     if(!drag||drag.id!==e.pointerId)return;
     if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7){
       drag.moved=true;try{wheel.setPointerCapture(e.pointerId);}catch(err){}
     }
     if(drag.moved){rotations.set(level,drag.start+degreesBetween(angleAt(e),drag.a));buildWheel();}
   });
   function endDrag(e){
     if(!drag||drag.id!==e.pointerId)return;
     if(drag.moved){suppress=true;setTimeout(()=>suppress=false,80);}
     drag=null;
   }
   wheel.addEventListener("pointerup",endDrag);wheel.addEventListener("pointercancel",endDrag);
   $("rotate-prev").addEventListener("click",()=>rotate(-22));
   $("rotate-next").addEventListener("click",()=>rotate(22));
   $("zoom-in").addEventListener("click",()=>enter(selected));
   $("zoom-out").addEventListener("click",out);
   $("reset").addEventListener("click",reset);
   $("explore").addEventListener("click",()=>enter(selected));
   $("level-menu-button").addEventListener("click",()=>{
     const menu=$("level-menu");menu.hidden=!menu.hidden;$("level-menu-button").setAttribute("aria-expanded",String(!menu.hidden));
   });
   $("view-all").addEventListener("click",()=>{showingAll=true;renderPanel();renderAll();$("all-events").scrollIntoView({behavior:"smooth",block:"start"});});
   $("close-events").addEventListener("click",()=>{$("all-events").hidden=true;});
   $("search-open").addEventListener("click",()=>{$("search-overlay").hidden=false;searching=true;$("search-input").focus();drawSearch();});
   $("search-close").addEventListener("click",closeSearch);
   $("search-input").addEventListener("input",drawSearch);
   $("search-overlay").addEventListener("click",e=>{if(e.target===$("search-overlay"))closeSearch();});
   $("bookmark").addEventListener("click",()=>{
     const url=location.href;
     if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).then(()=>toast("Stage link copied")).catch(()=>toast("Copy the page URL to save this selection"));
     else toast("Copy the page URL to save this selection");
   });
   document.addEventListener("keydown",e=>{
      if(e.key==="Escape"){if(searching){closeSearch();return;}if(!$("level-menu").hidden){$("level-menu").hidden=true;return;}}
      if(e.target.matches("input,textarea,select,[contenteditable=true]")||searching)return;
      if(e.key==="ArrowLeft"){e.preventDefault();rotate(-14);}
      if(e.key==="ArrowRight"){e.preventDefault();rotate(14);}
      if(e.key==="Backspace"){e.preventDefault();out();}
      if(e.key==="+"||e.key==="="){e.preventDefault();enter(selected);}
      if(e.key==="-"){e.preventDefault();out();}
   });
   window.addEventListener("hashchange",()=>{
    const id=decodeURIComponent(location.hash.slice(1));
    if(!nodes.has(id)||id===selected)return;
    const node=nodes.get(id);if(children(id).length)enter(id);else{level=node.parent||"root";select(id);}
   });
 }
 async function boot(){
   attach();
   try{
     const [a,b]=await Promise.all([fetch(DATA_URL,{cache:"no-store"}),fetch(DOSSIER_URL,{cache:"no-store"})]);
     if(!a.ok)throw Error("Chronology JSON HTTP "+a.status);
     const dat=await a.json();
     if(!Array.isArray(dat.events)||dat.events.length<200)throw Error("Unexpected chronology dataset");
     construct(dat);
     if(b.ok){const deep=await b.json();(deep.conditions||[]).forEach(x=>dossiers.set(x.node_id,x));}
     let id=decodeURIComponent(location.hash.slice(1));
     if(nodes.has(id)){
       if(children(id).length){level=id;selected=preferred(id);}
       else{level=nodes.get(id).parent||"root";selected=id;}
     }else{level="root";selected="cos-earth";}
     currentRotation();render();
     window.__celestialPoc={ready:true,events:dat.events.length,sources:dat.sources.length,dossiers:dossiers.size,
       cosmic:children("root").length,earth:children("cos-earth").length,cultures:children("earth-post").length,
       state:()=>({level,selected,rotation:currentRotation()}),select,enter,out,rotate,reset};
   }catch(err){
     $("node-title").textContent="Chronology data unavailable";
     $("node-description").textContent="Could not load the source-linked research data: "+err.message+". The POC requires the published research JSON.";
     $("explore").disabled=true;
   }
 }
 boot();
})();