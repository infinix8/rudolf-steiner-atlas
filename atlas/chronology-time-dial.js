"use strict";
(() => {
  const DATA_URL = "../research/steiner-hierarchical-chronology-events-v05.json";
  const $ = id => document.getElementById(id);
  const model = new Map(), remembered = new Map(), byGroup = new Map(), recordMap = new Map(), sourceMap = new Map();
  let dataset = null, scope = "root", selected = "cos-sun", focusedRecord = null, researchLimit = 9, drag = null, ignoreClick = false;
  const initial = [
    ["cos-saturn","Old Saturn","root","cosmic","CH-2","The first great condition: a germ of the physical organization exists in a warmth state.","Physical-body germ","Warmth","✧"],
    ["cos-sun","Old Sun","root","cosmic","CH-3","Spirits of Wisdom impart the etheric or life-body germ; warmth and air characterize this condition.","Etheric-body germ","Warmth and air","☼"],
    ["cos-moon","Old Moon","root","cosmic","CH-4","The astral organization enters the evolving human constitution, with an image-like mode of consciousness.","Astral-body germ","Warmth, air, water","☾"],
    ["cos-earth","Earth","root","cosmic","CH-5","Human self-consciousness and the I become central within the fourth great cosmic condition.","Human I","Earthly solidity","⊕"],
    ["cos-jupiter","Future Jupiter","root","cosmic","CH-21","A projected future planetary condition associated in Steiner's account with new spiritual capacities.","Spirit-Self","Future condition","✦"],
    ["cos-venus","Future Venus","root","cosmic","CH-22","A further future condition in Steiner's account of humanity's spiritual transformation.","Life-Spirit","Future condition","✧"],
    ["cos-vulcan","Future Vulcan","root","cosmic","CH-23","The seventh projected condition of the evolutionary sequence.","Spirit-Man","Future condition","✺"]
  ];
  const earth = [
    ["earth-polar","Polar","CH-6","A first great Earth epoch, described in terms of formative, pre-mineral development.","✧"],
    ["earth-hyper","Hyperborean","CH-7","A second great Earth epoch and its changing cosmic conditions.","✧"],
    ["earth-lemur","Lemurian","CH-8","Lunar separation, changes in embodiment and the beginnings of independent inwardness.","♨"],
    ["earth-atlant","Atlantean","CH-9","A period of pictorial memory, life-forces, oracle traditions and a gradual change toward outer perception.","≋"],
    ["earth-post","Post-Atlantean","", "The ongoing fifth great Earth epoch with seven successive cultural periods.","♜"],
    ["earth-sixth","Sixth Earth Epoch","CH-18","A future great epoch described with the imagery of seven seals.","✶"],
    ["earth-seventh","Seventh Earth Epoch","CH-19","A future great epoch described with the imagery of seven trumpets.","✺"]
  ];
  const cultures = [
    ["period-10","Ancient Indian","CH-10","The first post-Atlantean culture, characterized in Steiner's narrative by recollection of spiritual origins.","❀"],
    ["period-11","Ancient Persian","CH-11","The second culture: work within the sensory world and its spiritual meaning.","☀"],
    ["period-12","Egypto-Chaldean","CH-12","The third culture: study of cosmic order and its relation to life on Earth.","△"],
    ["period-13","Greco-Roman","CH-13","The fourth culture: the intellectual or mind-soul, the Christ turning point and its long aftermath.","⌂"],
    ["period-14","Consciousness-Soul Age","CH-14","The present fifth period: independent judgment, moral intuition and the task of conscious freedom.","✧"],
    ["period-15","Sixth Cultural Period","CH-15","The sixth post-Atlantean period, projected in Steiner's scheme.","✦"],
    ["period-16","Seventh Cultural Period","CH-16","The seventh projected post-Atlantean period.","✺"]
  ];
  const specialIds = {
    "earth-atlant":["CH-9.01","CH-9.02","CH-9.03","CH-9.04","CH-9.05","CH-9.06","CH-9.07"],
    "period-13":["CP08","CP09","CP10"]
  };
  function add(id,label,parent,kind,group,summary,soul="",element="",symbol="✧",record=null) {
    model.set(id,{id,label,parent,kind,group,summary,soul,element,symbol,record});
    if(group)byGroup.set(group,id);
  }
  function setup(data) {
    dataset = data;
    for(const s of data.sources || [])sourceMap.set(s.id,s);
    for(const e of data.events || [])recordMap.set(e.id,e);
    add("root","Seven planetary conditions",null,"root",null,"Steiner describes seven great planetary conditions, with Earth the fourth.");
    initial.forEach(([id,name,parent,kind,group,summary,soul,element,symbol]) => add(id,name,parent,kind,group,summary,soul,element,symbol));
    earth.forEach(([id,name,group,summary,symbol]) => add(id,name,"cos-earth","epoch",group,summary,"Great Earth epoch","",symbol));
    cultures.forEach(([id,name,group,summary,symbol]) => add(id,name,"earth-post","culture",group,summary,"Cultural period","",symbol));
    for(const [parent,ids] of Object.entries(specialIds)){
      for(const id of ids){
        const e=recordMap.get(id);
        if(!e)continue;
        const clean=e.title.replace(/[.]$/,"");
        add(e.id,clean,parent,"phase",null,e.description,"Source-named subdivision","",parent==="earth-atlant"?"◈":"✧",e);
      }
    }
    for(const node of [...model.values()]){
      if(!node.group || children(node.id).length)continue;
      for(const e of data.events.filter(x=>x.parent_id===node.group)){
        add(e.id,e.title.replace(/[.]$/,""),node.id,"event",null,e.description,"Research event","", "✧",e);
      }
    }
    for(const n of model.values()){
      const note=data.stage_notes && data.stage_notes[n.id];
      if(note)n.contextNote=note;
    }
  }
  const children=id=>[...model.values()].filter(n=>n.parent===id);
  const node=id=>model.get(id);
  const pathTo=id=>{const arr=[];let current=id;while(current && model.has(current)){arr.unshift(current);current=node(current).parent;}return arr;};
  const siblings=()=>children(scope);
  const index=()=>siblings().findIndex(n=>n.id===selected);
  const orderFor=id=>{const s=children(id);if(!s.length)return null;const prefers={"root":"cos-sun","cos-earth":"earth-atlant","earth-post":"period-14","earth-atlant":"CH-9.01","period-13":"CP08"};const preferred=remembered.get(id)||prefers[id];return s.find(n=>n.id===preferred)?.id||s[0].id;};
  const current=()=>node(selected);
  function updateUrl(){try{history.replaceState(null,"","#"+encodeURIComponent(selected));}catch(e){}}
  function activate(id,write=true){
    if(!model.has(id))return;
    const n=node(id);
    if(n.parent)scope=n.parent;
    else scope="root";
    selected=id;
    remembered.set(scope,id);
    focusedRecord=null;researchLimit=9;render();
    if(write)updateUrl();
  }
  function descend(){
    if(!children(selected).length){showResearch();return;}
    scope=selected;selected=orderFor(scope);remembered.set(scope,selected);focusedRecord=null;researchLimit=9;render();updateUrl();
  }
  function ascend(){
    if(scope==="root")return;
    const parent=node(scope);
    if(!parent)return;
    selected=scope;scope=parent.parent||"root";remembered.set(scope,selected);focusedRecord=null;researchLimit=9;render();updateUrl();
  }
  function goScope(id){
    const c=children(id);
    if(!c.length)return;
    scope=id;selected=orderFor(scope);remembered.set(scope,selected);focusedRecord=null;researchLimit=9;render();updateUrl();
  }
  function chooseDepth(depth){
    if(depth==="cosmic")goScope("root");
    else if(depth==="epoch")goScope("cos-earth");
    else if(depth==="culture")goScope("earth-post");
    else if(depth==="detail"){
      let d=pathTo(selected).reverse().find(id=>id==="earth-atlant"||id==="period-13"||(id!=="root"&&id!=="cos-earth"&&id!=="earth-post"&&children(id).length>0));
      if(!d)d=remembered.get("detailScope")||"earth-atlant";
      remembered.set("detailScope",d);
      goScope(d);
    }
  }
  function move(delta){const list=siblings();const i=index();const j=Math.max(0,Math.min(list.length-1,i+delta));if(i!==j)activate(list[j].id);}
  function recordsFor(n){
    if(!n)return[];
    if(n.record)return[n.record];
    if(n.group && dataset)return dataset.events.filter(e=>e.parent_id===n.group);
    return[];
  }
  function sourcesFor(n){
    const records=recordsFor(n);const result=[];
    for(const e of records){for(const s of (e.source_ids||[])){if(!result.includes(s))result.push(s);}}
    return result.map(s=>sourceMap.get(s)).filter(Boolean);
  }
  function themeFor(id) {
    const p=pathTo(id);
    if(p.includes("cos-saturn"))return"saturn";
    if(p.includes("cos-sun"))return"sun";
    if(p.includes("cos-moon"))return"moon";
    if(p.includes("cos-jupiter")||p.includes("cos-venus")||p.includes("cos-vulcan")||p.includes("earth-sixth")||p.includes("earth-seventh"))return"future";
    if(p.includes("earth-atlant"))return"atlantean";
    if(p.includes("earth-lemur"))return"lemurian";
    if(p.includes("period-13"))return"greco";
    if(p.some(x=>x.startsWith("period-")))return"culture";
    return"earth";
  }
  const h=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;};
  function clear(e){e.replaceChildren();}
  function renderBreadcrumbs(){
    const host=$("breadcrumbs");clear(host);
    const path=pathTo(selected);
    path.forEach((id,i)=>{
      if(i)host.append(h("span","separator","›"));
      const n=node(id);
      if(i===path.length-1){const s=h("span","",n.label);s.setAttribute("aria-current","page");host.append(s);}
      else {const b=h("button","",id==="root"?"Whole chronology":n.label);b.type="button";b.addEventListener("click",()=>{if(id==="root")goScope("root");else activate(id);});host.append(b);}
    });
  }
  function renderFacts(n){
    const arr=[
      ["✧","POSITION",String(index()+1)+" of "+siblings().length],
      ["◈","LEVEL",({cosmic:"Cosmic condition",epoch:"Earth epoch",culture:"Cultural period",phase:"Sub-epoch",event:"Research entry"})[n.kind]||"Chronology"],
      ["☼","KEY DEVELOPMENT",n.soul||n.element||"Steiner's account"]
    ];
    const host=$("fact-row");clear(host);
    arr.forEach(([icon,label,value])=>{const b=h("div","fact");b.append(h("span","",icon),h("small","",label),h("strong","",value));host.append(b);});
  }
  function eventButton(e,i){
    const card=h("button","theme-card");card.type="button";
    card.title=e.title;card.append(h("span","theme-icon",["✦","☼","◈"][i%3]));
    card.append(h("b","",e.title.replace(/[.]$/,"")),h("small","",e.description));
    card.addEventListener("click",()=>openRecord(e));
    return card;
  }
  function renderThemes(n){
    const host=$("theme-cards");clear(host);
    const all=recordsFor(n).filter(e=>!/^Editorial restraint|^Source limitation|^Source note/i.test(e.title));
    const sample=all.length?all.slice(0,3):children(n.id).slice(0,3).map(c=>({id:c.id,title:c.label,description:c.summary}));
    if(!sample.length){host.append(h("p","","No finer source entries are yet indexed for this stage."));return;}
    for(const [i,e]of sample.entries()){
      if(recordMap.has(e.id))host.append(eventButton(e,i));
      else{const b=h("button","theme-card");b.type="button";b.append(h("span","theme-icon","✦"),h("b","",e.title),h("small","",e.description));b.addEventListener("click",()=>activate(e.id));host.append(b);}
    }
  }
  function renderNeighbors(){
    const host=$("neighbor-cards");clear(host);
    const list=siblings(),i=index(),choices=[];
    if(i>0)choices.push({item:list[i-1],role:"PREVIOUS"});
    if(i<list.length-1)choices.push({item:list[i+1],role:"NEXT"});
    if(i+2<list.length)choices.push({item:list[i+2],role:"FURTHER"});
    for(const {item,role}of choices){
      const b=h("button","neighbor");b.type="button";b.setAttribute("aria-label",role+" stage: "+item.label);
      const img=h("span","neighbor-img "+themeFor(item.id));
      const copy=h("span","neighbor-copy");copy.append(h("small","",role),h("strong","",item.label),h("em","",item.summary));
      b.append(img,copy,h("span","neighbor-arrow",role==="PREVIOUS"?"‹":"›"));
      b.addEventListener("click",()=>activate(item.id));host.append(b);
    }
    if(!choices.length)host.append(h("p","neighbor-empty","No neighboring entries at this level."));
  }
  function renderSources(n){
    const host=$("source-links");clear(host);
    const sources=sourcesFor(n);
    for(const s of sources.slice(0,3)){
      const a=h("a","source-chip",s.citation_name||s.id);a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";host.append(a);
    }
    if(!sources.length)host.append(h("span","source-chip","Source links appear when indexed for this stage."));
  }
  function stageDescriptor(n){
    const pos=index()+1,tot=siblings().length;
    if(scope==="root")return"COSMIC EVOLUTION · CONDITION "+pos+" OF "+tot;
    if(scope==="cos-earth")return"EARTH EVOLUTION · EPOCH "+pos+" OF "+tot;
    if(scope==="earth-post")return"POST-ATLANTEAN · PERIOD "+pos+" OF "+tot;
    if(scope==="earth-atlant")return"ATLANTEAN · SOURCE-NAMED PHASE "+pos+" OF "+tot;
    if(scope==="period-13")return"GRECO-ROMAN · SUBPERIOD "+pos+" OF "+tot;
    return"RESEARCH DETAIL · ENTRY "+pos+" OF "+tot;
  }
  function renderOverview(){
    const n=current();
    $("art-panel").dataset.theme=themeFor(n.id);
    $("artwork").setAttribute("aria-label","Original symbolic illustration for "+n.label+", not documentary evidence");
    $("stage-kind").textContent=stageDescriptor(n);
    $("stage-title").textContent=n.label;
    $("stage-subtitle").textContent=n.kind==="cosmic"?(n.label+" condition · "+(n.soul||"spiritual evolution")):(n.kind==="epoch"?"Within the Earth condition":n.kind==="culture"?"A post-Atlantean cultural period":n.kind==="phase"?"A source-described subdivision":"A source-linked chronological observation");
    $("stage-summary").textContent=(n.contextNote||n.summary)+(themeFor(n.id)==="atlantean"?" Historical phase names are quoted source terminology, not valid classifications of present-day peoples.":"");
    renderFacts(n);renderThemes(n);renderNeighbors();renderSources(n);
    $("enter-stage").disabled=children(n.id).length===0;
    $("enter-stage").innerHTML=children(n.id).length?"Explore its "+(n.kind==="cosmic"?"epochs / entries":n.kind==="epoch"?"subdivisions":"research entries")+" <span>→</span>":"Lowest indexed level";
  }
  function renderDial(){
    const host=$("dial-items");clear(host);
    const list=siblings(),active=index(),small=window.matchMedia("(max-width:670px)").matches;
    const step=small?20:14.5, visible=small?2:3;
    list.forEach((n,i)=>{
      const diff=i-active;
      if(Math.abs(diff)>visible+1)return;
      const b=h("button","dial-stage"+(diff===0?" current":"")+(Math.abs(diff)>visible?" hidden-stage":""));b.type="button";
      b.style.left=(50+diff*step)+"%";
      b.style.top=(small?47:49)+(diff*diff)*(small?23:15)+"px";
      b.setAttribute("aria-label",n.label+"; "+(diff===0?"selected, tap to explore":"tap to select"));
      b.setAttribute("aria-pressed",String(diff===0));
      const orb=h("span","orb "+themeFor(n.id),n.symbol);orb.setAttribute("aria-hidden","true");
      b.append(orb,h("strong","",n.label),h("small","",String(i+1).padStart(2,"0")+" / "+String(list.length).padStart(2,"0")));
      b.addEventListener("click",()=>{if(ignoreClick)return;if(n.id===selected)descend();else activate(n.id);});
      host.append(b);
    });
    $("dial-rotor").style.setProperty("--spin",((active-1)*32)+"deg");
    $("dial-selection").textContent=current().label;
    $("dial-context").textContent=(active+1)+" / "+list.length+" · Drag the arc or use ← →";
    $("previous").disabled=active<=0;
    $("next").disabled=active>=list.length-1;
    $("up-level").disabled=scope==="root";
    const depth=scope==="root"?"cosmic":scope==="cos-earth"?"epoch":scope==="earth-post"?"culture":"detail";
    document.querySelectorAll("[data-depth]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.depth===depth)));
    $("level-description").textContent=depth==="cosmic"?"Seven planetary conditions: equal spacing is symbolic, not a calendar scale.":depth==="epoch"?"Seven great Earth epochs within the Earth condition.":depth==="culture"?"Seven post-Atlantean cultural periods. Dates, where supplied, require source qualification.":"Selected detailed level: "+node(scope).label+". Indexed entries are not all equally timed.";
  }
  function makeResearchCard(e){
    const d=h("article","research-item");d.id="note-"+e.id.replace(/[^A-Za-z0-9-]/g,"-");
    const flag=(e.evidence_flags||[]).join(", ");
    const head=h("small","",e.id+" · "+(e.time_scale||"research"));
    if(flag)head.append(h("span","flag"," · evidence "+flag));
    d.append(head,h("h3","",e.title),h("p","",e.description));
    const refs=(e.source_ids||[]).map(id=>sourceMap.get(id)).filter(Boolean);
    refs.slice(0,3).forEach((src,i)=>{
      if(i)d.append(h("span",""," · "));
      const a=h("a","",src.citation_name||src.id);a.href=src.url;a.target="_blank";a.rel="noopener noreferrer";d.append(a);
    });
    return d;
  }
  function renderResearch(){
    const n=current(),host=$("research-list");clear(host);
    const list=recordsFor(n);
    const extras=focusedRecord && !list.some(x=>x.id===focusedRecord.id)?[focusedRecord]:[];
    const shown=[...extras,...list].slice(0,researchLimit);
    for(const r of shown)host.append(makeResearchCard(r));
    if(!shown.length)host.append(h("p","","The published research index does not yet contain a separate atomic entry for this stage."));
    $("research-heading").textContent=n.label+" · research notes";
    $("research-intro").textContent=(n.contextNote||"These short records summarize and link to primary passages.")+" · "+list.length+" source-indexed entries in this context.";
    const more=$("research-more");more.hidden=researchLimit>=[...extras,...list].length;
    more.textContent="Show more ("+Math.min(9,[...extras,...list].length-researchLimit)+" additional) ↓";
    if(focusedRecord){const card=$("note-"+focusedRecord.id.replace(/[^A-Za-z0-9-]/g,"-"));if(card){card.style.borderColor="#ad7743";}}
  }
  function showResearch(){
    const r=$("research-detail");r.setAttribute("aria-collapsed","false");$("research-collapse").textContent="Collapse −";$("research-collapse").setAttribute("aria-expanded","true");r.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});
  }
  function openRecord(e){
    if(model.has(e.id) && node(e.id).parent===scope){activate(e.id);showResearch();return;}
    focusedRecord=e;researchLimit=9;renderResearch();showResearch();
  }
  function render(){if(!current())return;renderBreadcrumbs();renderOverview();renderDial();renderResearch();}
  function searchResults(){
    const q=$("search-input").value.trim().toLowerCase(),host=$("search-results");clear(host);
    if(!q){host.append(h("p","","Search across stages and the source-indexed research records."));return;}
    const stageHits=[...model.values()].filter(n=>n.kind!=="event" && (n.label+" "+n.summary).toLowerCase().includes(q)).slice(0,7);
    const eventHits=[...recordMap.values()].filter(e=>(e.title+" "+e.description).toLowerCase().includes(q)).slice(0,15);
    const hits=[...stageHits.map(n=>({label:n.label,description:n.summary,act:()=>activate(n.id)})),...eventHits.map(e=>({label:e.title,description:e.description,act:()=>{if(model.has(e.id))activate(e.id);else{const context=byGroup.get(e.parent_id);if(context)activate(context);focusedRecord=e;renderResearch();showResearch();}}}))].slice(0,19);
    for(const x of hits){const b=h("button","");b.type="button";b.append(h("b","",x.label),h("small","",x.description));b.addEventListener("click",()=>{$("search-dialog").close();x.act();});host.append(b);}
    if(!hits.length)host.append(h("p","","No matching indexed stage or event."));
  }
  function restoreHash(){
    const key=decodeURIComponent(location.hash.slice(1));
    if(!key)return false;
    if(model.has(key)){activate(key,false);return true;}
    const e=recordMap.get(key);
    if(e){const context=byGroup.get(e.parent_id);if(context)activate(context,false);focusedRecord=e;renderResearch();return true;}
    return false;
  }
  function controls(){
    $("enter-stage").addEventListener("click",descend);
    $("up-level").addEventListener("click",ascend);
    $("previous").addEventListener("click",()=>move(-1));
    $("next").addEventListener("click",()=>move(1));
    document.querySelectorAll("[data-depth]").forEach(b=>b.addEventListener("click",()=>chooseDepth(b.dataset.depth)));
    $("show-research").addEventListener("click",showResearch);
    $("research-more").addEventListener("click",()=>{researchLimit+=9;renderResearch();});
    $("research-collapse").addEventListener("click",()=>{
      const r=$("research-detail"),collapsed=r.getAttribute("aria-collapsed")==="true";
      r.setAttribute("aria-collapsed",String(!collapsed));
      $("research-collapse").textContent=collapsed?"Collapse −":"Expand +";
      $("research-collapse").setAttribute("aria-expanded",String(collapsed));
    });
    $("copy-stage").addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText(location.href);toast("Link copied for "+current().label);}catch(e){toast("Copy the URL from your address bar.");}
    });
    $("open-search").addEventListener("click",()=>{$("search-dialog").showModal();$("search-input").focus();searchResults();});
    $("close-search").addEventListener("click",()=>$("search-dialog").close());
    $("search-input").addEventListener("input",searchResults);
    const dial=$("dial-viewport");
    dial.addEventListener("keydown",e=>{
      if(e.key==="ArrowLeft"){e.preventDefault();move(-1);}
      else if(e.key==="ArrowRight"){e.preventDefault();move(1);}
      else if(e.key==="Enter" && e.target===dial){e.preventDefault();descend();}
      else if(e.key==="Backspace" && e.target===dial){e.preventDefault();ascend();}
      else if(e.key==="Home"){e.preventDefault();activate(siblings()[0].id);}
      else if(e.key==="End"){e.preventDefault();activate(siblings()[siblings().length-1].id);}
    });
    dial.addEventListener("pointerdown",e=>{
      if(e.button!==0)return;
      drag={startX:e.clientX,startIndex:index(),moved:false,pointerId:e.pointerId};
      if(!e.target.closest("button")){try{dial.setPointerCapture(e.pointerId);}catch(err){}}
    });
    dial.addEventListener("pointermove",e=>{
      if(!drag||e.pointerId!==drag.pointerId)return;
      const dx=e.clientX-drag.startX;
      if(Math.abs(dx)>13){drag.moved=true;dial.classList.add("dragging");}
      if(!drag.moved)return;
      const step=Math.max(65,Math.min(155,dial.clientWidth/6));
      const j=Math.max(0,Math.min(siblings().length-1,drag.startIndex-Math.round(dx/step)));
      if(j!==index()){ignoreClick=true;activate(siblings()[j].id);}
    });
    const stop=()=>{if(drag){drag=null;dial.classList.remove("dragging");if(ignoreClick)setTimeout(()=>{ignoreClick=false;},150);}};
    dial.addEventListener("pointerup",stop);dial.addEventListener("pointercancel",stop);
    dial.addEventListener("lostpointercapture",stop);
    window.addEventListener("resize",()=>{if(model.size)renderDial();});
    window.addEventListener("hashchange",restoreHash);
  }
  let toastTimer;
  function toast(msg){const n=$("notification");n.textContent=msg;n.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.hidden=true,2200);}
  async function initialize(){
    controls();
    try{
      const response=await fetch(DATA_URL,{cache:"no-cache"});
      if(!response.ok)throw Error("HTTP "+response.status);
      setup(await response.json());
      if(!restoreHash())render();
    }catch(e){
      setup({sources:[],events:[],stage_notes:{}});
      render();
      $("research-intro").textContent="Source-linked details could not be loaded. Stage navigation is available, but the research index needs the live website or an HTTP server.";
      toast("Research data unavailable; structural dial loaded.");
    }
  }
  document.addEventListener("DOMContentLoaded",initialize);
})();