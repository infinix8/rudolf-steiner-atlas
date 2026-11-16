"use strict";
(() => {
  const DATA_PATH = "../research/steiner-hierarchical-chronology-events-v01.json";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const CX = 540, CY = 480;
  const $ = (id) => document.getElementById(id);
  let chronology, nodes = new Map(), events = new Map(), groups = new Map(), sources = new Map();
  let focus = "root", inspected = "root", activeMain = "cos-earth", previewOnHover = null, angleOffset = -13;
  let drag = null, suppressClick = false, currentThread = null;
  const primaryR = {start:111,end:277}, secondaryR = {start:291,end:359};
  const fmt = (id) => nodes.get(id)?.label || id;

  function put(id,label,parent,kind,group,status,summary){
    nodes.set(id,{id,label,parent,kind,group,status,summary:summary||""});
  }
  function buildGraph(d){
    chronology=d;
    for(const g of d.groups)groups.set(g.id,g);
    for(const s of d.sources)sources.set(s.id,s);
    for(const e of d.events)events.set(e.id,e);
    put("root","Seven cosmic conditions",null,"root",null,"past",
      "Steiner describes seven great conditions of cosmic evolution. Each of these is a stage, not a present-day astronomical planet.");
    [
      ["cos-saturn","Old Saturn","CH-2","past","Warmth and the earliest physical-body germ"],
      ["cos-sun","Old Sun","CH-3","past","The etheric or life-body germ"],
      ["cos-moon","Old Moon","CH-4","past","The astral body and picture-consciousness"],
      ["cos-earth","Earth","CH-5","present","The I and humanity's distinctive Earth work"],
      ["cos-jupiter","Future Jupiter","CH-21","future","A later condition of transformed life"],
      ["cos-venus","Future Venus","CH-22","future","Further spiritual metamorphosis"],
      ["cos-vulcan","Future Vulcan","CH-23","future","The seventh great cosmic condition"]
    ].forEach(x=>put(x[0],x[1],"root","cosmic",x[2],x[3],x[4]));
    [
      ["earth-polar","Polar","CH-6","past","The first great Earth epoch"],
      ["earth-hyper","Hyperborean","CH-7","past","The second great Earth epoch"],
      ["earth-lemur","Lemurian","CH-8","past","The third great Earth epoch"],
      ["earth-atlant","Atlantean","CH-9","past","The fourth great Earth epoch"],
      ["earth-post","Post-Atlantean",null,"present","The fifth great Earth epoch"],
      ["earth-sixth","Sixth Earth epoch","CH-18","future","A projected epoch of seven seals"],
      ["earth-seventh","Seventh Earth epoch","CH-19","future","A projected epoch of seven trumpets"]
    ].forEach(x=>put(x[0],x[1],"cos-earth","epoch",x[2],x[3],x[4]));
    const periods=[
      ["Ancient Indian","past","Ancient Indian wisdom"],
      ["Ancient Persian","past","Zarathustra and earthly development"],
      ["Egypto-Chaldean","past","Cosmic order and the Egyptian mysteries"],
      ["Greco-Roman","past","Intellectual or mind soul; Mystery of Golgotha"],
      ["Consciousness-soul","present","Fifth age, from approximately 1413"],
      ["Sixth cultural age","future","Sixth post-Atlantean period, projected"],
      ["Seventh cultural age","future","Seventh post-Atlantean period, projected"]
    ];
    periods.forEach((p,i)=>put("period-"+(i+10),p[0],"earth-post","culture","CH-"+(i+10),p[1],p[2]));
    // Add all stage-specific records as leaf rays. Group-linked Earth-wide claims
    // remain readable in the Earth panel; they are not invented eighth epochs.
    for(const n of [...nodes.values()]){
      if(!n.group)continue;
      d.events.filter(e=>e.parent_id===n.group).forEach(e=>{
        put(e.id,e.title.replace(/\.$/,""),n.id,"event",null,
          n.status==="future"?"future":n.status==="present"?"present":"past",e.description);
      });
    }
  }
  function children(id){return [...nodes.values()].filter(n=>n.parent===id);}
  function parents(id){const a=[];while(id && nodes.has(id)){a.unshift(id);id=nodes.get(id).parent;}return a;}
  function sourceRecords(group){
    if(!group)return [];
    const ids=new Set();
    for(const e of chronology.events)if(e.parent_id===group)e.source_ids.forEach(id=>ids.add(id));
    return [...ids].map(id=>sources.get(id)).filter(Boolean);
  }
  function defaultChild(id){
    const c=children(id);
    if(!c.length)return null;
    if(id==="root")return "cos-earth";
    if(id==="cos-earth")return "earth-post";
    if(id==="earth-post")return "period-14";
    return c[0].id;
  }
  function writeLocation(id){
    try{history.replaceState(null,"","#"+encodeURIComponent(id));}
    catch(e){location.hash=encodeURIComponent(id);}
  }
  function openRay(id){
    const n=nodes.get(id);
    if(!n)return;
    if(children(id).length){
      focus=id;inspected=id;activeMain=defaultChild(id);
    }else{
      inspected=id;
      if(n.parent&&n.parent!==focus)focus=n.parent;
      activeMain=id;
    }
    previewOnHover=null;writeLocation(id);render();
  }
  function goToFocus(id){
    if(!nodes.has(id))return;
    focus=id;inspected=id;activeMain=defaultChild(id);previewOnHover=null;
    writeLocation(id);render();
  }
  function color(n,index){
    const past=["#d8a277","#cba887","#e0b98a","#be926f","#d6ad82","#bd9b7a"];
    const future=["#b4a9df","#a19ad2","#c9b6e4","#979ccf"];
    const now=["#8dd0b9","#80c8bb","#a1d8c0"];
    const a=n.status==="future"?future:n.status==="present"?now:past;
    return a[index % a.length];
  }
  function polar(radius,degrees){
    const r=degrees*Math.PI/180;
    return [CX+radius*Math.cos(r),CY+radius*Math.sin(r)];
  }
  function elem(tag,attributes,text){
    const el=document.createElementNS(SVG_NS,tag);
    if(attributes)for(const [name,value] of Object.entries(attributes))el.setAttribute(name,String(value));
    if(text!==undefined)el.textContent=text;
    return el;
  }
  function child(parent,tag,className,text){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=text;
    parent.appendChild(el);
    return el;
  }
  function makeButton(text,className,callback){
    const b=document.createElement("button");
    b.type="button";if(className)b.className=className;
    b.textContent=text;b.addEventListener("click",callback);return b;
  }
  function beamPath(start,end,a,halfAngle){
    const p0=polar(start,a-1.1*halfAngle);
    const p1=polar(start+72,a-1.9*halfAngle);
    const p2=polar(end,a);
    const p3=polar(start+72,a+1.9*halfAngle);
    const p4=polar(start,a+1.1*halfAngle);
    return "M"+p0.join(" ")+" L"+p1.join(" ")+" L"+p2.join(" ")+" L"+p3.join(" ")+" L"+p4.join(" ")+" Z";
  }
  function normalAngle(a){return (a%360+360)%360;}
  function truncateAtWord(name,cap){
    if(name.length<=cap)return name;
    const chunk=name.slice(0,cap);
    const last=chunk.lastIndexOf(" ");
    return (last>=cap*.55?chunk.slice(0,last):chunk.replace(/\s+$/,""))+"…";
  }
  function rayLabel(node,a,isChild,count){
    const flipped=normalAngle(a)>90 && normalAngle(a)<270;
    const rad=isChild?(flipped?487:371):(flipped?270:162);
    const [x,y]=polar(rad,a);
    const label=elem("text",{
      class:"ray-label"+(isChild?" secondary":count>11?" smaller":""),
      transform:"translate("+x+" "+y+") rotate("+(a+(flipped?180:0))+")",
      "text-anchor":"start","dominant-baseline":"middle"
    },truncateAtWord(node.label,isChild?19:count>11?20:24));
    return label;
  }
  function addRay(parent,node,angle,index,count,isChild,isActive){
    const g=elem("g",{
      "data-ray":node.id,role:"button",tabindex:"0",
      "aria-label":node.label+"; "+(children(node.id).length?"open nested chronology":"show sources"),
      class:(isChild?"ray-secondary":"ray-primary")+(isActive?" active":" inactive")
    });
    g.appendChild(elem("title",{},node.label+". "+node.summary));
    const start=isChild?secondaryR.start:primaryR.start;
    const end=isChild?secondaryR.end:primaryR.end;
    const half=isChild?Math.max(.44,1.1-count*.025):Math.max(.8,2.65-count*.045);
    const c=color(node,index);
    g.appendChild(elem("path",{d:beamPath(start,end,angle,half),class:"beam",fill:c,"fill-opacity":isActive?"1":isChild?".92":".84"}));
    const p1=polar(start,angle),p2=polar(end-7,angle),pt=polar(end+2,angle);
    g.appendChild(elem("line",{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],stroke:c,class:"ray-stem"}));
    g.appendChild(elem("circle",{cx:pt[0],cy:pt[1],r:isChild?2.5:3.8,fill:c,class:"ray-dot"}));
    g.appendChild(rayLabel(node,angle,isChild,count));
    g.addEventListener("pointerenter",()=>{if(drag?.moved||isChild)return;previewOnHover=node.id;paintSecondary();});
    // Keep the hovered parent's smaller rays visible while the pointer travels to them.
    // Otherwise the child fan disappears before a user can select one.

    parent.appendChild(g);
  }
  function activeChildren(){
    const visible=children(focus);
    const mainId=previewOnHover||activeMain;
    if(!visible.some(x=>x.id===mainId))return {mainId:null,list:[]};
    return {mainId,list:children(mainId).slice(0,8)};
  }
  function paintSecondary(){
    const layer=$("secondary-layer");
    if(!layer||!chronology)return;
    layer.replaceChildren();
    const main=children(focus),{mainId,list}=activeChildren();
    if(!list.length)return;
    const index=main.findIndex(x=>x.id===mainId);
    if(index<0)return;
    const center=-90+angleOffset+index*360/main.length;
    const spread=Math.min(104,Math.max(45,11.8*(list.length-1)));
    const from=center-spread/2;
    const a0=from, a1=center+spread/2;
    // A translucent fan ties the shorter rays to the selected long ray.
    const hub=polar(281,center),a=polar(285,a0),b=polar(285,a1);
    const fan=elem("path",{d:"M"+hub.join(" ")+" L"+a.join(" ")+" A285 285 0 0 1 "+b.join(" ")+" Z",
      fill:color(nodes.get(mainId),index),"fill-opacity":".12",stroke:"none"});
    layer.appendChild(fan);
    list.forEach((node,i)=>{
      const angle=center+(list.length===1?0:(i/(list.length-1)-.5)*spread);
      addRay(layer,node,angle,i,list.length,true,inspected===node.id);
    });
  }
  function paintDial(){
    const dial=$("dial");
    dial.replaceChildren();
    const defs=elem("defs");
    const soft=elem("radialGradient",{id:"sun-halo"});
    soft.appendChild(elem("stop",{offset:"0%","stop-color":"#e3c78c","stop-opacity":".25"}));
    soft.appendChild(elem("stop",{offset:"68%","stop-color":"#b2c9bd","stop-opacity":".045"}));
    soft.appendChild(elem("stop",{offset:"100%","stop-color":"#b2c9bd","stop-opacity":"0"}));
    defs.appendChild(soft);dial.appendChild(defs);
    dial.appendChild(elem("circle",{cx:CX,cy:CY,r:388,fill:"url(#sun-halo)","pointer-events":"none"}));
    [94,190,281,365,494].forEach((r,i)=>dial.appendChild(elem("circle",{cx:CX,cy:CY,r,
      class:"orbit",stroke:i===1?"#eddaa622":undefined})));
    const primaryLayer=elem("g",{id:"primary-layer"}),secondaryLayer=elem("g",{id:"secondary-layer"});
    const main=children(focus);
    main.forEach((node,i)=>{
      const angle=-90+angleOffset+i*360/main.length;
      addRay(primaryLayer,node,angle,i,main.length,false,node.id===(previewOnHover||activeMain)||node.id===inspected);
    });
    dial.appendChild(primaryLayer);
    dial.appendChild(secondaryLayer);
    paintSecondary();
    // The historical/root categories are not duration-proportional; their rays
    // have equal angular spacing within each active hierarchical level.
  }
  function buildBreadcrumbs(){
    const box=$("breadcrumbs");box.replaceChildren();
    const stack=parents(focus);
    stack.forEach((id,i)=>{
      if(i)child(box,"span",null,"›");
      box.appendChild(makeButton(id==="root"?"The whole":fmt(id),"",()=>goToFocus(id)));
    });
    $("back").hidden=focus==="root";
    $("core-kicker").textContent=focus==="root"?"THE WHOLE":nodes.get(focus).kind.toUpperCase().replace("_"," ");
    $("core-title").textContent=focus==="root"?"Seven cosmic conditions":fmt(focus);
    $("core-caption").textContent=focus==="root"?"Click any ray to unfold":children(focus).length+" rays within";
    $("level-title").textContent=focus==="root"?"Seven cosmic conditions":"Inside "+fmt(focus);
    $("level-desc").textContent=children(focus).length?"These are the larger rays at this scale. Select one to zoom further; its smaller rays preview on the dial.":"This is a research entry.";
    $("level-badge").textContent="DEPTH "+String(parents(focus).length).padStart(2,"0");
  }
  function addSources(box,items){
    const vals=items.filter(Boolean).slice(0,6);
    if(!vals.length)return;
    child(box,"h3",null,"STEINER SOURCE LINKS");
    vals.forEach(s=>{
      const a=document.createElement("a");a.className="source-link";a.href=s.url;
      a.target="_blank";a.rel="noopener noreferrer";
      child(a,"strong",null,s.id+" · "+s.citation_name);
      child(a,"small",null,(s.is_primary?"Read the work / lecture":"Internal evidence checkpoint")+" ↗");
      box.appendChild(a);
    });
  }
  function field(parent,key,value){
    const dl=child(parent,"dl","field");
    child(dl,"dt",null,key);child(dl,"dd",null,value);
  }
  function evidenceLabel(code){
    return {P:"Relevant excerpt checked",L:"Primary source lead",I:"Editorial synthesis",
      D:"Derived chronology",X:"Textual or ethical caution"}[code]||code;
  }
  function statusLabel(n){
    return n.status==="future"?"PROJECTED FUTURE":n.status==="present"?"ONGOING / EARTH":"EARLIER DEVELOPMENT";
  }
  function groupHeading(node){
    if(node.group)return groups.get(node.group)?.title||node.label;
    if(node.id==="earth-post")return "Fifth great Earth epoch";
    return node.label;
  }
  function inspect(){
    const body=$("inspector-body");body.replaceChildren();
    const n=nodes.get(inspected)||nodes.get("root");
    $("node-code").textContent=n.kind==="event"?n.id:(n.group||n.id).toUpperCase();
    child(body,"div","topic-pill",n.kind==="root"?"THE FULL CYCLE":n.kind==="event"?"SOURCE-LINKED EVENT":statusLabel(n));
    child(body,"h2",null,n.kind==="root"?"Every ray holds a world.":n.label);
    if(n.kind==="event"){
      const e=events.get(n.id);
      child(body,"p",null,e.description);
      field(body,"Part of",groups.get(e.parent_id)?.title||"Research theme");
      field(body,"Evidence",e.evidence_flags.map(evidenceLabel).join(" · "));
      field(body,"Scale",e.time_scale.replace(/_/g," "));
      if(e.evidence_flags.includes("X"))child(body,"div","quote","This entry carries a source, historical or ethical caution. Read the passage in context.");
      else child(body,"div","quote","Steiner's esoteric account: not independent verification of the historical or scientific claim.");
      addSources(body,e.source_ids.map(id=>sources.get(id)));
      return;
    }
    const cc=children(n.id);
    const explanation=n.summary||(n.kind==="root"?
      "Start with the great cosmic conditions, then explore Earth's epochs, its cultural periods, and individual teaching records.":groupHeading(n));
    child(body,"p",null,explanation);
    field(body,"Current scale",n.kind==="root"?"Entire evolutionary sequence":n.kind==="cosmic"?"Cosmic condition":n.kind==="epoch"?"Earth epoch":n.kind==="culture"?"Cultural age":"Interval");
    field(body,"Contained rays",cc.length+"");
    field(body,"Temporal status",n.kind==="root"?"Past · present · projected":statusLabel(n).toLowerCase());
    if(n.id==="cos-earth"){
      child(body,"h3",null,"EARTH-WIDE EVENTS");
      child(body,"p",null,"The linked research also covers processes spanning many Earth epochs; these are not extra formal epochs.");
      body.appendChild(makeButton("Read Earth-wide records →","inspector-action",()=>renderThreadGroup("CH-5")));
    }
    if(n.id==="earth-post"){
      child(body,"div","quote","Post-Atlantean periods are approximately or arithmetically dated in this research, not scientifically dated cosmic boundaries.");
    }
    if(n.kind==="root"){
      child(body,"div","quote","Click any long ray to zoom in; the shorter rays show a preview of its nested events. Turn the sun by dragging anywhere on the dial.");
    }
    if(n.group){
      const records=chronology.events.filter(e=>e.parent_id===n.group);
      child(body,"h3",null,"IN THIS STAGE");
      child(body,"p",null,records.length+" research entries are associated with this interval, including transitions and activities attributed to Steiner.");
      addSources(body,sourceRecords(n.group));
    }
  }
  function buildCard(box,node,index,isSmall){
    const b=makeButton("","ray-card"+(node.id===inspected?" selected":""),()=>openRay(node.id));
    b.style.setProperty("--ray-color",color(node,index));
    child(b,"span","ray-index",String(index+1).padStart(2,"0")+(isSmall?" · SUB-RAY":" · MAJOR RAY"));
    child(b,"strong",null,node.label);
    child(b,"small",null,children(node.id).length?
      children(node.id).length+" nested rays · open ↗":"Read source record ↗");
    box.appendChild(b);
  }
  function renderCards(){
    const primary=$("primary-list"),secondary=$("secondary-list");
    primary.replaceChildren();secondary.replaceChildren();
    const main=children(focus),sub=activeChildren().list;
    $("ray-count").textContent=main.length+" major rays";
    $("main-count").textContent="("+main.length+")";
    $("sub-count").textContent="("+sub.length+" visible)";
    main.forEach((n,i)=>buildCard(primary,n,i,false));
    sub.forEach((n,i)=>buildCard(secondary,n,i,true));
    if(!sub.length)child(secondary,"p","empty-group","Select or point to a longer ray to preview its next layer. If no smaller rays exist, you have reached a source-linked event.");
    if(children(activeMain||"").length>sub.length&&sub.length){
      const more=child(secondary,"p","empty-group",
        "Showing "+sub.length+" of "+children(activeMain).length+" sub-rays. Open the parent ray to see every event at full size.");
      more.style.marginTop="8px";
    }
  }
  function render(){
    if(!chronology)return;
    paintDial();buildBreadcrumbs();inspect();renderCards();
    if($("dial-viewport") && innerWidth<660){
      const p=$("dial-viewport");p.scrollLeft=Math.max(0,(p.scrollWidth-p.clientWidth)/2);
    }
  }
  function renderThreadGroup(groupId){
    if(!groups.has(groupId))return;
    currentThread=groupId;
    document.querySelectorAll("[data-thread]").forEach(b=>b.classList.toggle("active",b.dataset.thread===groupId));
    const box=$("thread-detail");box.replaceChildren();box.hidden=false;
    child(box,"h3",null,groups.get(groupId).title);
    child(box,"p",null,"Cross-cutting records can apply to more than one era. They are not inserted as consecutive extra epochs.");
    const list=child(box,"div","thread-records");
    const matches=chronology.events.filter(e=>e.parent_id===groupId);
    matches.forEach(e=>list.appendChild(makeButton(e.title.replace(/\.$/,""),"",()=>{
      // A recurring record is kept outside the formal time hierarchy.
      inspected="root";inspect();
      const target=$("inspector-body");target.replaceChildren();
      child(target,"div","topic-pill","CROSS-ERA STRAND");
      child(target,"h2",null,e.title.replace(/\.$/,""));
      child(target,"p",null,e.description);
      field(target,"Evidence",e.evidence_flags.map(evidenceLabel).join(" · "));
      addSources(target,e.source_ids.map(id=>sources.get(id)));
      $("node-code").textContent=e.id;
      target.scrollIntoView({behavior:"smooth",block:"nearest"});
    })));
    if(groupId==="CH-5")box.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  function rotated(delta){
    angleOffset=(angleOffset+delta)%360;
    paintDial();
  }
  function attachControls(){
    const dial=$("dial");
    dial.addEventListener("click",e=>{
      if(suppressClick){suppressClick=false;return;}
      const g=e.target.closest("[data-ray]");if(g)openRay(g.dataset.ray);
    });
    dial.addEventListener("keydown",e=>{
      if((e.key==="Enter"||e.key===" ")&&e.target.closest("[data-ray]")){
        e.preventDefault();openRay(e.target.closest("[data-ray]").dataset.ray);
      }else if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
        e.preventDefault();rotated(e.key==="ArrowRight"?15:-15);
      }
    });
    function pointerAngle(e){
      const r=dial.getBoundingClientRect();
      const x=r.left+r.width/2, y=r.top+r.height/2;
      return Math.atan2(e.clientY-y,e.clientX-x)*180/Math.PI;
    }
    function relativeDelta(a,b){return ((a-b+540)%360)-180;}
    dial.addEventListener("pointerdown",e=>{
      if(e.button!==0)return;
      drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,startAngle:pointerAngle(e),initial:angleOffset,moved:false};
    });
    dial.addEventListener("pointermove",e=>{
      if(!drag||drag.id!==e.pointerId)return;
      if(!drag.moved && Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>7){
        drag.moved=true;previewOnHover=null;
        try{dial.setPointerCapture(e.pointerId);}catch(err){}
      }
      if(!drag.moved)return;
      angleOffset=drag.initial+relativeDelta(pointerAngle(e),drag.startAngle);
      paintDial();
    });
    function endDrag(){
      if(drag?.moved){
        suppressClick=true;setTimeout(()=>{suppressClick=false;},80);
      }
      drag=null;
    }
    dial.addEventListener("pointerup",endDrag);
    dial.addEventListener("pointercancel",endDrag);
    dial.addEventListener("wheel",e=>{
      if(Math.abs(e.deltaY)<1)return;
      e.preventDefault();rotated(e.deltaY>0?8:-8);
    },{passive:false});
    $("rotate-left").addEventListener("click",()=>rotated(-24));
    $("rotate-right").addEventListener("click",()=>rotated(24));
    $("home").addEventListener("click",()=>goToFocus("root"));
    $("back").addEventListener("click",()=>{if(focus!=="root")goToFocus(nodes.get(focus).parent||"root");});
    document.querySelectorAll("[data-thread]").forEach(b=>b.addEventListener("click",()=>renderThreadGroup(b.dataset.thread)));
    window.addEventListener("hashchange",()=>{
      const id=decodeURIComponent(location.hash.slice(1));
      if(nodes.has(id))openRay(id);
    });
  }
  async function boot(){
    attachControls();
    try{
      const r=await fetch(DATA_PATH,{cache:"no-cache"});
      if(!r.ok)throw new Error("HTTP "+r.status);
      const d=await r.json();
      if(d.events?.length<100||!Array.isArray(d.sources)||!Array.isArray(d.groups))throw new Error("Unexpected research data");
      buildGraph(d);
      const id=decodeURIComponent(location.hash.slice(1));
      if(id==="root"||id==="cos-earth"||nodes.has(id)){
        if(id!=="root"){const n=nodes.get(id);if(children(id).length)focus=id;else focus=n.parent||"root";inspected=id;activeMain=defaultChild(focus)||id;}
      }
      render();
      window.__sunRayPOC={ready:true,researchEvents:d.events.length,sourceRecords:d.sources.length,
        rootRays:children("root").length,earthEpochRays:children("cos-earth").length,
        postAtlanteanRays:children("earth-post").length,focus:()=>focus};
    }catch(error){
      const panel=$("inspector-body");panel.replaceChildren();
      child(panel,"h2",null,"Unable to load the chronology.");
      child(panel,"p",null,"The dial needs the published JSON research index. "+error.message+". Check the GitHub Pages release and reopen this page.");
      $("node-code").textContent="DATA UNAVAILABLE";
    }
  }
  boot();
})();