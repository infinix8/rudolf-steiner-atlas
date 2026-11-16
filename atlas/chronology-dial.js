"use strict";
(() => {
  const DATA_URL="../research/steiner-hierarchical-chronology-events-v01.json";
  const NS="http://www.w3.org/2000/svg";
  const $=id=>document.getElementById(id);
  const nodes=new Map(), events=new Map(), groups=new Map(), sources=new Map();
  const rotations=new Map();
  let data=null, focus="root", selected="cos-earth", preview="cos-earth";
  let drag=null, suppressClick=false, changing=false, hovering=false;
  const isReduced=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall=()=>window.matchMedia("(max-width: 640px)").matches;
  function metrics(){
    return isSmall()
      ?{w:730,h:740,cx:73,cy:370,maxR:470,boundY:304,majorFont:25,minorFont:18}
      :{w:1080,h:960,cx:139,cy:480,maxR:640,boundY:413,majorFont:27,minorFont:16};
  }
  const palettes={
    past:["#b99483","#c19b8d","#c8a37c","#b586a2","#d2a583","#ae90a2"],
    present:["#3fa3b0","#4fb4ac","#5eac9a"],
    future:["#a28cc7","#9a92ca","#b4a1d6","#b1a8d7"]
  };
  const periodNames=["Ancient Indian","Ancient Persian","Egypto-Chaldean","Greco-Roman","Consciousness-soul","Sixth cultural period","Seventh cultural period"];
  function put(id,label,parent,kind,group,status,summary){
    nodes.set(id,{id,label,parent,kind,group,status,summary:summary||""});
  }
  function prepare(input){
    data=input;
    for(const s of input.sources)sources.set(s.id,s);
    for(const g of input.groups)groups.set(g.id,g);
    for(const e of input.events)events.set(e.id,e);
    put("root","Whole cycle",null,"root",null,"past",
      "Seven great cosmic conditions from Old Saturn through Earth to the three projected future conditions.");
    [
      ["cos-saturn","Old Saturn","CH-2","past","Warmth and the earliest physical-body germ"],
      ["cos-sun","Old Sun","CH-3","past","The developing etheric or life-body germ"],
      ["cos-moon","Old Moon","CH-4","past","Astral life and dreamlike picture consciousness"],
      ["cos-earth","Earth","CH-5","present","The human I, self-consciousness and freedom"],
      ["cos-jupiter","Future Jupiter","CH-21","future","A projected post-Earth planetary condition"],
      ["cos-venus","Future Venus","CH-22","future","A further projected planetary condition"],
      ["cos-vulcan","Future Vulcan","CH-23","future","The seventh projected cosmic condition"]
    ].forEach(x=>put(x[0],x[1],"root","cosmic",x[2],x[3],x[4]));
    [
      ["earth-polar","Polar","CH-6","past","First great Earth epoch"],
      ["earth-hyper","Hyperborean","CH-7","past","Second great Earth epoch"],
      ["earth-lemur","Lemurian","CH-8","past","Third great Earth epoch"],
      ["earth-atlant","Atlantean","CH-9","past","Fourth great Earth epoch"],
      ["earth-post","Post-Atlantean",null,"present","Fifth great Earth epoch"],
      ["earth-sixth","Sixth Earth epoch","CH-18","future","Projected era of seven seals"],
      ["earth-seventh","Seventh Earth epoch","CH-19","future","Projected era of seven trumpets"]
    ].forEach(x=>put(x[0],x[1],"cos-earth","epoch",x[2],x[3],x[4]));
    for(let i=0;i<7;i++){
      const g="CH-"+(i+10);
      put("period-"+(i+10),periodNames[i],"earth-post","culture",g,
        i<4?"past":i===4?"present":"future",groups.get(g)?.title||"Post-Atlantean cultural period");
    }
    // Research records have a single attested/attributed parent. They become
    // the full-length spokes when their parent period is entered.
    const parents=[...nodes.values()].filter(n=>n.group);
    for(const n of parents){
      // CH-5 describes Earth-wide processes; they are not six extra formal epochs.
      if(n.id==="cos-earth")continue;
      for(const e of input.events.filter(ev=>ev.parent_id===n.group)){
        const status=n.status==="future"?"future":
          (e.chronology_status==="projected"?"future":n.status==="present"?"present":"past");
        put(e.id,e.title.replace(/\.$/,""),n.id,"event",null,status,e.description);
      }
    }
  }
  function getChildren(id){return [...nodes.values()].filter(n=>n.parent===id);}
  function getParents(id){const result=[];while(id&&nodes.has(id)){result.unshift(id);id=nodes.get(id).parent;}return result;}
  function hasChildren(id){return getChildren(id).length>0;}
  function preferredChild(id){
    const ids=getChildren(id).map(n=>n.id);
    const pick={root:"cos-earth","cos-earth":"earth-post","earth-post":"period-14"};
    return ids.includes(pick[id])?pick[id]:ids[0]||null;
  }
  function defaultAngle(id){
    const c=getChildren(id);
    const prefer=preferredChild(id);
    const at=c.findIndex(x=>x.id===prefer);
    return at<0?0:-at*(c.length===7?40:360/c.length);
  }
  function rotation(){if(!rotations.has(focus))rotations.set(focus,defaultAngle(focus));return rotations.get(focus);}
  function color(n,index){
    const p=palettes[n.status]||palettes.past;
    return p[index%p.length];
  }
  function changeHash(id){
    try{history.replaceState(null,"","#"+encodeURIComponent(id));}
    catch(err){location.hash=encodeURIComponent(id);}
  }
  function enter(id,animated=true){
    if(!nodes.has(id)||changing)return;
    const n=nodes.get(id);
    if(!hasChildren(id)){
      selected=id;
      if(n.parent&&n.parent!==focus)focus=n.parent;
      preview=id;
      changeHash(id);
      render();
      return;
    }
    function commit(){
      focus=id;selected=id;preview=preferredChild(id);hovering=false;
      rotation();changeHash(id);render();
      $("dial-svg").classList.remove("is-changing");
      changing=false;
    }
    if(animated&&!isReduced()){
      changing=true;$("dial-svg").classList.add("is-changing");
      setTimeout(commit,145);
    }else commit();
  }
  function out(){
    if(changing||focus==="root")return;
    const old=focus, parent=nodes.get(old)?.parent||"root";
    if(!nodes.has(parent))return;
    changing=true;
    const commit=()=>{
      focus=parent;selected=old;preview=old;hovering=false;rotation();
      changeHash(parent);
      render();$("dial-svg").classList.remove("is-changing");changing=false;
    };
    if(isReduced())commit();
    else{$("dial-svg").classList.add("is-changing");setTimeout(commit,145);}
  }
  function zoomTarget(){
    if(selected!==focus&&hasChildren(selected))return selected;
    const p=preview&&hasChildren(preview)?preview:null;
    return p&&p!==focus?p:null;
  }
  function zoomIn(){const t=zoomTarget();if(t)enter(t);}
  function gotoLevel(id){
    if(!nodes.has(id)||changing)return;
    if(hasChildren(id))enter(id);
    else{
      selected=id;
      preview=id;
      changeHash(id);render();
    }
  }
  function svgel(tag,attrs,txt){
    const e=document.createElementNS(NS,tag);
    if(attrs)for(const [k,v] of Object.entries(attrs))if(v!==undefined)e.setAttribute(k,String(v));
    if(txt!==undefined)e.textContent=txt;return e;
  }
  function append(parent,tag,cls,txt){
    const e=document.createElement(tag);if(cls)e.className=cls;
    if(txt!==undefined)e.textContent=txt;parent.appendChild(e);return e;
  }
  function button(txt,cls,fn){
    const e=document.createElement("button");e.type="button";
    if(cls)e.className=cls;e.textContent=txt;e.addEventListener("click",fn);return e;
  }
  function pos(m,r,angle){
    const a=angle*Math.PI/180;
    return [m.cx+r*Math.cos(a),m.cy+r*Math.sin(a)];
  }
  function normalize(a){return (a%360+540)%360-180;}
  function rayMax(m,angle){
    const abs=Math.abs(Math.sin(angle*Math.PI/180));
    return Math.min(m.maxR,m.boundY/Math.max(abs,.19)-12);
  }
  function shortName(name,max){
    if(name.length<=max)return name;
    let txt=name.slice(0,max-1);
    const last=txt.lastIndexOf(" ");
    if(last>max*.55)txt=txt.slice(0,last);
    return txt.trim()+"…";
  }
  function rayText(m,text,x,y,minor){
    // Keep words horizontally readable; do not rotate typography with the wheel.
    const size=minor?m.minorFont:m.majorFont;
    const avg=size*(minor?.52:.48);
    const cap=Math.max(10,Math.floor((m.w-x-19)/avg));
    const readable=shortName(text,Math.min(minor?24:29,cap));
    const tx=Math.min(m.w-18,x+11);
    return {value:readable,x:tx,y:y+(minor?0:-2),approxWidth:readable.length*avg};
  }
  function drawOne(layer,n,index,angle,minor,parentIndex,m){
    if(Math.cos(angle*Math.PI/180)<.065)return false; // only a right-hand semicircle is visible.
    const radius=rayMax(m,angle)*(minor?.61:1);
    const start=minor?17:12;
    const [x1,y1]=pos(m,start,angle),[x2,y2]=pos(m,radius,angle);
    const parentColor=minor&&nodes.has(parentIndex)?color(nodes.get(parentIndex),index):null;
    const c=minor?(parentColor||color(n,index)):color(n,index);
    const g=svgel("g",{
      class:"ray"+(selected===n.id?" selected":"")+(minor?" sub-ray":""),
      tabindex:"0",role:"button","data-ray":n.id,
      "aria-label":n.label+". "+(hasChildren(n.id)?"Select to zoom into sub-epochs":"Select to read event details")
    });
    g.appendChild(svgel("title",{},n.label+". "+(n.summary||"")));
    const style={x1,y1,x2,y2,stroke:c};
    g.appendChild(svgel("line",{...style,class:minor?"minor-stem":"stem"}));
    g.appendChild(svgel("line",{...style,class:"hit"}));
    g.appendChild(svgel("circle",{cx:x2,cy:y2,r:minor?3.2:selected===n.id?6:4.4,fill:c,class:"endpoint"}));
    const t=rayText(m,n.label,x2,y2,minor);
    // Wide invisible label hit-target; the painted label stays pointer-events:none.
    g.appendChild(svgel("rect",{x:t.x-2,y:t.y-(minor?13:22),width:Math.max(40,t.approxWidth+10),height:minor?26:37,fill:"transparent","pointer-events":"all"}));
    g.appendChild(svgel("text",{x:t.x,y:t.y,class:minor?"minor-label":"major-label","dominant-baseline":"central"},t.value));
    if(minor){
      g.appendChild(svgel("circle",{cx:x2,cy:y2,r:1.2,fill:"#fff9f0"}));
    }
    g.addEventListener("click",evt=>{
      if(suppressClick||changing)return;
      evt.stopPropagation();gotoLevel(n.id);
    });
    g.addEventListener("keydown",evt=>{
      if(evt.key==="Enter"||evt.key===" "){evt.preventDefault();gotoLevel(n.id);}
    });
    // No DOM replacement on pointer hover: ordinary taps must always reach the ray.
    layer.appendChild(g);return true;
  }
  function previewItems(n){
    if(!n)return [];
    const children=getChildren(n.id);
    if(!children.length)return [];
    const limit=5;
    if(children.length<=limit)return children;
    // Preserve first and last to expose direction and the largest transitions.
    const head=children.slice(0,3),tail=children.slice(-2);
    return [...head,...tail];
  }
  function paint(opts={}){
    if(!data)return;
    const m=metrics(),dial=$("dial-svg");
    dial.setAttribute("viewBox","0 0 "+m.w+" "+m.h);
    dial.replaceChildren();
    const backgrounds=svgel("g",{"aria-hidden":"true"});
    backgrounds.appendChild(svgel("line",{x1:m.cx,y1:55,x2:m.cx,y2:m.h-55,class:"zero-axis"}));
    [m.maxR*.36,m.maxR*.7,m.maxR].forEach(r=>{
      const d="M"+pos(m,r,-86).join(" ")+" A"+r+" "+r+" 0 0 1 "+pos(m,r,86).join(" ");
      backgrounds.appendChild(svgel("path",{d,class:"guide"}));
    });
    dial.appendChild(backgrounds);
    const layer=svgel("g",{id:"ray-layer"});
    const list=getChildren(focus),step=list.length===7?40:360/Math.max(1,list.length),rot=rotation();
    let visible=0;
    const mainArr=[];
    list.forEach((n,i)=>{
      const a=normalize(rot+i*step);
      if(Math.cos(a*Math.PI/180)<.065)return;
      mainArr.push([n,i,a]);
    });
    const minors=svgel("g",{id:"subray-layer"});
    const selectedMain=nodes.get(preview);
    const selectedIndex=list.findIndex(x=>x.id===preview);
    if(selectedMain&&selectedIndex>=0){
      const center=normalize(rot+selectedIndex*step);
      const kids=previewItems(selectedMain);
      const sector=Math.min(38,step*.72);
      kids.forEach((c,j)=>{
        const delta=(kids.length===1?0:(j-(kids.length-1)/2)*sector/(kids.length-1));
        const ang=normalize(center+delta);
        drawOne(minors,c,j,ang,true,preview,m);
      });
    }
    dial.appendChild(minors);
    for(const [n,i,a] of mainArr)if(drawOne(layer,n,i,a,false,null,m))visible++;
    dial.appendChild(layer);
    const hub=svgel("g",{"aria-hidden":"true"});
    hub.appendChild(svgel("circle",{cx:m.cx,cy:m.cy,r:21,fill:"#f6e6c7","fill-opacity":".4",class:"hub-aura"}));
    hub.appendChild(svgel("circle",{cx:m.cx,cy:m.cy,r:11,class:"hub-ring"}));
    hub.appendChild(svgel("circle",{cx:m.cx,cy:m.cy,r:4,class:"hub-dot"}));
    dial.appendChild(hub);
    $("visible-count").textContent=visible+" of "+list.length+" major rays";
    if(!opts.retainPreview)updateButtons();
  }
  function renderBreadcrumbs(){
    const b=$("breadcrumbs");b.replaceChildren();
    const ids=getParents(focus);
    ids.forEach((id,i)=>{
      if(i)append(b,"span","sep","›");
      b.appendChild(button(id==="root"?"Whole cycle":nodes.get(id).label,"",()=>{
        if(id===focus)return;enter(id);
      }));
    });
    $("level-name").textContent=focus==="root"?"The whole cosmic cycle":nodes.get(focus).label;
    $("level-subtitle").textContent=focus==="root"?"Seven great cosmic conditions, with smaller rays between":
      hasChildren(focus)?getChildren(focus).length+" intervals or events within this level":"A source-linked event";
  }
  function fillFacts(el,label,value){
    const div=append(el,"div","fact");
    append(div,"strong",null,label);append(div,"span",null,value);
  }
  function evidence(flag){
    return {P:"Relevant English passage checked",L:"Source lead — passage audit pending",
      I:"Editorial synthesis",D:"Derived or approximate date",X:"Textual / ethical caution"}[flag]||flag;
  }
  function sourceList(el,ids){
    const records=ids.map(id=>sources.get(id)).filter(Boolean).slice(0,6);
    if(!records.length)return;
    append(el,"h3",null,"FOLLOW STEINER'S SOURCES");
    records.forEach(s=>{
      const a=document.createElement("a");a.className="source-link";a.href=s.url;
      a.target="_blank";a.rel="noopener noreferrer";
      append(a,"strong",null,s.id+" · "+s.citation_name);
      append(a,"small",null,s.is_primary?"Original work / lecture ↗":"Research evidence index ↗");
      el.appendChild(a);
    });
  }
  function intervalSources(group){
    const ids=new Set();
    for(const e of data.events)if(e.parent_id===group)for(const id of e.source_ids)ids.add(id);
    return [...ids];
  }
  function relatedResearch(el,node){
    const relatedGroups=node.id==="root"
      ?["CH-1","CH-17","CH-20","CH-24","CH-25","CH-26","CH-27"]
      :node.id==="cos-earth"?["CH-5"]:[];
    if(!relatedGroups.length)return;
    const matches=data.events.filter(e=>relatedGroups.includes(e.parent_id));
    const outer=append(el,"details","related-research");
    append(outer,"summary",null,"Related cross-era research ("+matches.length+" entries)");
    append(outer,"p",null,"These claims span several epochs or recur within human lives. They are not additional consecutive stages on the wheel.");
    relatedGroups.forEach(groupId=>{
      const arr=matches.filter(e=>e.parent_id===groupId);
      if(!arr.length)return;
      append(outer,"h3",null,groups.get(groupId)?.title||groupId);
      arr.forEach(e=>{
        const d=append(outer,"details","related-entry");
        append(d,"summary",null,e.title.replace(/\.$/,""));
        append(d,"p",null,e.description);
        const sourceIds=e.source_ids.filter(id=>sources.has(id)).slice(0,2);
        sourceIds.forEach(id=>{
          const s=sources.get(id);
          const a=append(d,"a","related-source",s.id+" · Read source ↗");
          a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";
        });
      });
    });
  }
  function info(){
    const el=$("info-content");el.replaceChildren();
    const n=nodes.get(selected)||nodes.get(focus);
    $("current-id").textContent=n.group||n.id;
    const kind=n.kind==="root"?"WHOLE CYCLE":n.kind==="cosmic"?"COSMIC CONDITION":
      n.kind==="epoch"?"EARTH EPOCH":n.kind==="culture"?"CULTURAL PERIOD":"RESEARCH EVENT";
    append(el,"span","info-chip",kind);
    append(el,"h2",null,n.kind==="root"?"The whole evolution":n.label);
    if(n.kind==="event"){
      const ev=events.get(n.id);
      append(el,"p",null,ev.description);
      fillFacts(el,"Within",groups.get(ev.parent_id)?.title||"Steiner chronology");
      fillFacts(el,"Evidence",ev.evidence_flags.map(evidence).join(" · ")||"Primary-source review pending");
      fillFacts(el,"Time status",ev.chronology_status.replace(/_/g," "));
      append(el,"div","caution",
        "This is attributed to Steiner. Historical, medical and spiritual claims are not independently established.");
      sourceList(el,ev.source_ids);
      return;
    }
    append(el,"p",null,n.summary);
    fillFacts(el,"Position",n.kind==="root"?"Whole cosmic development":
      (getParents(n.id).slice(1,-1).map(id=>nodes.get(id).label).join(" › ")||"Within the whole cycle"));
    fillFacts(el,"Time",n.kind==="root"?"Past, ongoing, projected":n.status==="future"?"Projected future":n.status==="present"?"Present / ongoing":"Earlier evolutionary stage");
    fillFacts(el,"Sub-epochs",hasChildren(n.id)?getChildren(n.id).map(x=>x.label).slice(0,7).join(" · "):"No deeper stages catalogued");
    if(n.kind==="root"){
      append(el,"div","caution","Turn the wheel to reveal spokes hidden to the left. Selecting any longer spoke replaces this same wheel with its smaller epochs; zoom out to recover the parent.");
    }else if(n.id==="cos-earth"){
      append(el,"div","caution","Earth's formal seven great epochs are displayed after zooming in. Additional Earth-wide processes span several epochs and are not extra epochs.");
    }else if(n.kind==="culture"){
      append(el,"div","caution","Cultural-period dates in the research are approximate or derived, not verified archaeological boundaries.");
    }
    relatedResearch(el,n);
    if(n.group){
      const group=groups.get(n.group);
      append(el,"h3",null,"RESEARCH IN THIS INTERVAL");
      append(el,"p",null,group?.title||"Source-linked chronology");
      sourceList(el,intervalSources(n.group));
    }
    const target=zoomTarget();
    if(target){
      const b=button("Explore "+nodes.get(target).label+" →","info-cta",()=>enter(target));
      el.appendChild(b);
    }
  }
  function renderLevelList(){
    const list=$("level-list");list.replaceChildren();
    getChildren(focus).forEach((n,i)=>{
      const b=button("","level-card",()=>gotoLevel(n.id));
      b.style.setProperty("--cardcolor",color(n,i));
      if(selected===n.id)b.setAttribute("aria-current","true");
      append(b,"small",null,String(i+1).padStart(2,"0")+" · "+n.kind.toUpperCase());
      append(b,"strong",null,n.label);
      append(b,"em",null,hasChildren(n.id)?"Enter its smaller spokes ↗":"Open event information ↗");
      list.appendChild(b);
    });
  }
  function updateButtons(){
    const up=$("zoom-out"),inside=$("zoom-in");
    up.disabled=focus==="root";
    const target=zoomTarget();
    inside.disabled=!target;
    inside.title=target?"Zoom into "+nodes.get(target).label:"No deeper level selected";
  }
  function render(){
    if(!data)return;
    renderBreadcrumbs();paint();info();renderLevelList();updateButtons();
  }
  function turn(delta){if(!data||changing)return;rotations.set(focus,rotation()+delta);hovering=false;preview=selected!==focus?selected:preferredChild(focus);paint();}
  function angleAt(e){
    const svg=$("dial-svg"),m=metrics(),rect=svg.getBoundingClientRect();
    const x=rect.left+(m.cx/m.w)*rect.width,y=rect.top+(m.cy/m.h)*rect.height;
    return Math.atan2(e.clientY-y,e.clientX-x)*180/Math.PI;
  }
  const angleDiff=(a,b)=>normalize(a-b);
  function controls(){
    const svg=$("dial-svg");
    svg.addEventListener("pointerdown",e=>{
      if(e.button!==0||changing||!data)return;
      drag={id:e.pointerId,x:e.clientX,y:e.clientY,startAngle:angleAt(e),startRotation:rotation(),moved:false};
    });
    svg.addEventListener("pointermove",e=>{
      if(!drag||drag.id!==e.pointerId)return;
      if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7){
        drag.moved=true;
        try{svg.setPointerCapture(e.pointerId);}catch(err){}
      }
      if(drag.moved){
        rotations.set(focus,drag.startRotation+angleDiff(angleAt(e),drag.startAngle));
        hovering=false;preview=selected!==focus?selected:preferredChild(focus);paint();
      }
    });
    function stopDrag(e){
      if(!drag||drag.id!==e.pointerId)return;
      if(drag.moved){suppressClick=true;setTimeout(()=>{suppressClick=false;},85);}
      drag=null;
    }
    svg.addEventListener("pointerup",stopDrag);
    svg.addEventListener("pointercancel",stopDrag);
    $("turn-prev").addEventListener("click",()=>turn(-23));
    $("turn-next").addEventListener("click",()=>turn(23));
    $("zoom-out").addEventListener("click",out);
    $("zoom-in").addEventListener("click",zoomIn);
    $("go-root").addEventListener("click",()=>enter("root"));
    svg.addEventListener("wheel",e=>{
      if(!data||changing)return;
      e.preventDefault();
      if(e.ctrlKey){if(e.deltaY<0)zoomIn();else out();}
      else turn(e.deltaY>0?10:-10);
    },{passive:false});
    window.addEventListener("keydown",e=>{
      if(e.target.closest("input,textarea,select,[contenteditable=true]"))return;
      if(e.key==="Escape"||e.key==="Backspace"){e.preventDefault();out();}
      else if(e.key==="+"||e.key==="="){e.preventDefault();zoomIn();}
      else if(e.key==="-"){e.preventDefault();out();}
      else if(e.key==="ArrowLeft"){e.preventDefault();turn(-12);}
      else if(e.key==="ArrowRight"){e.preventDefault();turn(12);}
    });
    window.addEventListener("hashchange",()=>{
      const id=decodeURIComponent(location.hash.slice(1));
      if(nodes.has(id)&&id!==selected&&!changing)enter(id,false);
    });
    window.addEventListener("resize",()=>{if(data)paint();});
  }
  async function start(){
    controls();
    try{
      const res=await fetch(DATA_URL,{cache:"no-store"});
      if(!res.ok)throw Error("Research dataset: HTTP "+res.status);
      const json=await res.json();
      if(!Array.isArray(json.events)||json.events.length<180||!Array.isArray(json.sources))throw Error("Invalid research data");
      prepare(json);
      const hash=decodeURIComponent(location.hash.slice(1));
      if(nodes.has(hash)){
        const n=nodes.get(hash);
        if(hasChildren(hash)){focus=hash;selected=hash;preview=preferredChild(hash);}
        else{focus=n.parent||"root";selected=hash;preview=hash;}
      }
      rotation();render();
      window.__chronologyPOC={
        ready:true,sourceCount:json.sources.length,researchEvents:json.events.length,
        totalNodes:nodes.size,rootSpokes:getChildren("root").length,
        earthSpokes:getChildren("cos-earth").length,culturalSpokes:getChildren("earth-post").length,
        state:()=>({focus,selected,preview,rotation:rotation()}),
        enter:id=>enter(id,false),out:()=>out(),rotate:deg=>turn(deg)
      };
    }catch(err){
      const el=$("info-content");el.replaceChildren();
      append(el,"h2",null,"Chronology unavailable");
      append(el,"p",null,"The webpage could not load its source-linked research dataset: "+err.message+
        ". The public deployment must include the matching research JSON.");
      $("current-id").textContent="DATA ERROR";
    }
  }
  start();
})();