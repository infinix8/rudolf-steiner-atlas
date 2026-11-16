"use strict";
(function(){
  const DATA_URL="../research/steiner-hierarchical-chronology-events-v01.json";
  const byId=id=>document.getElementById(id);
  const NS="http://www.w3.org/2000/svg";
  let data=null,entries=new Map(),nodes=new Map(),groups=new Map(),sources=new Map();
  let focus="root",selection=null,rotation=-18,theme="all",agency="all",strand="CH-24",drag=null,suppressClick=false;
  const palette={past:["#cd9876","#b57f68","#d1ab87","#a47e79","#a78b78"],present:["#72b6ac","#a0cfb9"],future:["#989ac5","#bdb6d5","#8e9bb6"]};
  const timeDesc={root:"The whole cycle",cosmic:"Cosmic condition",epoch:"Great Earth epoch",culture:"Post-Atlantean cultural period",event:"Chronology event",strand:"Research strand"};
  const themeTests={
    cosmos:/cosmic|saturn|old sun|old moon|spirit|warmth|etheric|planet|jupiter|venus|vulcan|astral|light|water|air|earth/i,
    human:/human|bod(y|ies)|organ|blood|physical|etheric|astral|ego|^i | I\/|soul|sens(ory|es)|reproduction|consciousness|heart|kidney|lung|brain/i,
    hierarchies:/hierarch|throne|cherub|seraph|spirits of|angel|archangel|archai|exusiai|kyriotetes|dynamis/i,
    christ:/christ|golgotha|michael|jordan|jesus|resurrect/i,
    adversaries:/lucifer|ahriman/i,
    culture:/indian|persian|egypt|chaldean|greek|roman|atlant|lemuri|culture|social|civil|rishi|oracle|zarathustra|consciousness soul/i,
    future:/future|project|sixth|seventh|will |later |eventual|jupiter|venus|vulcan|trumpet|seal|postmortem/i
  };
  const agencyTests={
    thrones:/throne|spirits of will/i,wisdom:/spirits of wisdom|kyriotetes/i,movement:/spirits of movement|dynamis/i,
    form:/spirits of form|exusiai/i,angels:/angel|archangel|archai|fire spirits|spirits of personality/i,
    lucifer:/lucifer/i,ahriman:/ahriman/i,christ:/christ|golgotha|jesus|jordan/i,michael:/michael/i
  };
  function add(id,label,kind,parent,groupId,status,subtitle){
    const n={id,label,kind,parent:parent||null,groupId:groupId||null,status:status||"past",subtitle:subtitle||""};
    nodes.set(id,n);return n;
  }
  function childNodes(id){return Array.from(nodes.values()).filter(n=>n.parent===id);}
  function makeModel(raw){
    data=raw;
    raw.groups.forEach(g=>groups.set(g.id,g));
    raw.sources.forEach(s=>sources.set(s.id,s));
    raw.events.forEach(e=>entries.set(e.id,e));
    add("root","The full chronology","root",null,null,"past","Seven great conditions");
    const cosmic=[
      ["cos-saturn","Old Saturn","CH-2","past","Warmth · physical germ"],
      ["cos-sun","Old Sun","CH-3","past","Life · etheric germ"],
      ["cos-moon","Old Moon","CH-4","past","Sentience · astral germ"],
      ["cos-earth","Earth","CH-5","present","The human I"],
      ["cos-jupiter","Future Jupiter","CH-21","future","Next condition"],
      ["cos-venus","Future Venus","CH-22","future","Further metamorphosis"],
      ["cos-vulcan","Future Vulcan","CH-23","future","Seventh condition"]
    ];
    for(const [id,label,groupId,status,subtitle] of cosmic)add(id,label,"cosmic","root",groupId,status,subtitle);
    const earth=[
      ["earth-polar","Polar","CH-6","past","First epoch"],["earth-hyper","Hyperborean","CH-7","past","Second epoch"],
      ["earth-lemur","Lemurian","CH-8","past","Third epoch"],["earth-atlant","Atlantean","CH-9","past","Fourth epoch"],
      ["earth-post","Post-Atlantean",null,"present","Fifth great epoch"],
      ["earth-sixth","Sixth great epoch","CH-18","future","Seven seals"],["earth-seventh","Seventh great epoch","CH-19","future","Seven trumpets"]
    ];
    for(const [id,label,groupId,status,subtitle] of earth)add(id,label,"epoch","cos-earth",groupId,status,subtitle);
    const names=["Ancient Indian","Ancient Persian","Egypto-Chaldean","Greco-Roman","Consciousness-soul age","Sixth period","Seventh period"];
    for(let i=10;i<=16;i++)add("period-"+i,names[i-10],"culture","earth-post","CH-"+i,i<14?"past":i===14?"present":"future",i===14?"Since approx. 1413":"Period "+(i-9)+" of seven");
    for(const n of Array.from(nodes.values())){
      if(!n.groupId)continue;
      const records=raw.events.filter(e=>e.parent_id===n.groupId);
      records.forEach(e=>add(e.id,e.title.replace(/\.$/,""),"event",n.id,null,
        n.status==="future"?"future":n.status==="present"&&n.id!=="cos-earth"?"present":"past",e.description));
    }
    // These research strands are concurrent overlays, never extra consecutive cosmic stages.
    for(const id of ["CH-1","CH-17","CH-20","CH-24","CH-25","CH-26","CH-27"]){
      raw.events.filter(e=>e.parent_id===id).forEach(e=>add(e.id,e.title.replace(/\.$/,""),"strand",null,id,id==="CH-17"||id==="CH-20"?"future":"past",e.description));
    }
    // CH-17, CH-20 are transitions after a stage, not invented eighth and ninth epochs.
  }
  function ancestors(id){const a=[];while(id&&nodes.has(id)){a.unshift(id);id=nodes.get(id).parent;}return a;}
  function setFocus(id){
    if(!nodes.has(id))return;
    const node=nodes.get(id);
    if(node.kind==="event"||node.kind==="strand"){selection=id;const par=node.parent;if(par)focus=par;}
    else{focus=id;selection=null;}
    writeHash(selection||focus);render();
  }
  function writeHash(id){try{history.replaceState(null,"","#"+encodeURIComponent(id));}catch(e){location.hash=encodeURIComponent(id);}}
  function normalizeText(e){return (e.title+" "+e.description).toLowerCase();}
  function matches(node){
    if(node.kind!=="event"&&node.kind!=="strand")return true;
    const e=entries.get(node.id);if(!e)return true;
    const s=normalizeText(e);
    return (theme==="all"||themeTests[theme].test(s))&&(agency==="all"||agencyTests[agency].test(s));
  }
  function svg(tag,attrs,text){const el=document.createElementNS(NS,tag);if(attrs)for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;return el;}
  function xy(r,degree){const rad=(degree-90)*Math.PI/180;return [430+r*Math.cos(rad),430+r*Math.sin(rad)];}
  function arc(r,w,a,b){const po=xy(r+w/2,a),pe=xy(r+w/2,b),qi=xy(r-w/2,b),qs=xy(r-w/2,a),lg=b-a>180?1:0;return "M "+po[0]+" "+po[1]+" A "+(r+w/2)+" "+(r+w/2)+" 0 "+lg+" 1 "+pe[0]+" "+pe[1]+" L "+qi[0]+" "+qi[1]+" A "+(r-w/2)+" "+(r-w/2)+" 0 "+lg+" 0 "+qs[0]+" "+qs[1]+" Z";}
  function ringConfig(n){if(n===1)return [[275,72]];if(n===2)return [[207,45],[322,37]];if(n===3)return [[153,29],[247,37],[347,27]];return [[135,22],[212,30],[285,29],[365,20]];}
  function fillFor(node,i){let arr=palette[node.status]||palette.past;return arr[i%arr.length];}
  function shortLabel(node){const t=node.label;
    return t.length>24?t.slice(0,23)+"…":t;
  }
  function renderDial(){
    const dial=byId("dial");dial.replaceChildren();
    const path=ancestors(focus);
    const parents=path.filter(id=>id==="root"||childNodes(id).length>0);
    const rings=parents.map((pid)=>({parent:pid,children:childNodes(pid)})).filter(r=>r.children.length>0);
    const cfg=ringConfig(rings.length);
    const layer=svg("g",{id:"spin",transform:"rotate("+rotation+" 430 430)"});
    const defs=svg("defs");
    const filter=svg("filter",{id:"warm-glow",x:"-50%",y:"-50%",width:"200%",height:"200%"});
    filter.appendChild(svg("feGaussianBlur",{stdDeviation:"3"}));defs.appendChild(filter);dial.appendChild(defs);
    rings.forEach((r,k)=>{
      const [rad,w]=cfg[k];
      dial.appendChild(svg("circle",{cx:"430",cy:"430",r:rad,"class":"orbit-guide"}));
      const n=r.children.length,unit=360/n;
      r.children.forEach((node,i)=>{
        const start=-90+i*unit+0.75, end=-90+(i+1)*unit-0.75;
        const active=node.id===selection||path.includes(node.id);
        const dim=!matches(node);
        const g=svg("g",{"data-node":node.id,role:"button",tabindex:"0","aria-label":node.label+" — "+timeDesc[node.kind]+". "+(node.kind==="event"?"Open details":"Explore interval")});
        const seg=svg("path",{d:arc(rad,w,start,end),fill:fillFor(node,i),"fill-opacity":active?".97":dim?".32":".73",class:"dial-segment"+(active?" selected":"")+(dim?" dimmed":"")+(path.includes(node.id)?" ancestor":"")});
        if(node.status==="future")seg.setAttribute("stroke-dasharray","4 2");
        g.appendChild(seg);
        const title=svg("title",{},node.label+" — "+node.subtitle);g.appendChild(title);
        if(n<=9){
          const xyPos=xy(rad,(start+end)/2);
          const label=svg("text",{x:xyPos[0],y:xyPos[1],class:"arc-label"+(k>1?" small":""),"dominant-baseline":"middle"},shortLabel(node));g.appendChild(label);
        }else if(n<=19 && w>=20){
          const mid=(start+end)/2,pp=xy(rad+w/2-4,mid);
          g.appendChild(svg("circle",{cx:pp[0],cy:pp[1],r:2.5,fill:"#f7e6c3",opacity:dim?".35":".78"}));
        }
        layer.appendChild(g);
      });
    });
    dial.appendChild(layer);
    // Decorative cardinal points do not imply absolute astronomical directions.
    const center=svg("circle",{cx:430,cy:430,r:87,fill:"none",stroke:"#d9bc8866","stroke-width":"1"});
    dial.appendChild(center);
  }
  function append(parent,tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;parent.appendChild(e);return e;}
  function button(label,cls,func){const el=document.createElement("button");el.type="button";el.className=cls;el.textContent=label;el.addEventListener("click",func);return el;}
  function sourcesFor(groupId){if(!data||!groupId)return [];
    const ids=new Set();data.events.filter(e=>e.parent_id===groupId).forEach(e=>e.source_ids.forEach(s=>ids.add(s)));
    return Array.from(ids).map(s=>sources.get(s)).filter(Boolean).slice(0,6);
  }
  function referenceList(parent,ids){
    const rr=ids.map(id=>sources.get(id)).filter(Boolean);
    if(!rr.length)return;
    append(parent,"h3",null,"FOLLOW THE ORIGINAL WORK");
    rr.forEach(s=>{
      const a=document.createElement("a");a.className="source-link";a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";
      append(a,"strong",null,s.id+" · "+s.citation_name.replace(/^GA /,"GA "));
      append(a,"small",null,s.is_primary?"Original work / lecture ↗":"Internal research index ↗");
      parent.appendChild(a);
    });
  }
  function detailsForEvent(e){
    const root=byId("detail-content");root.replaceChildren();
    const status=e.evidence_flags.join(" / ")||"L";
    const lookup={P:"Relevant passage checked",L:"Source lead · verify exact passage",I:"Editorial synthesis",D:"Derived dating",X:"Textual / ethical caution"};
    const intro=append(root,"div","detail-intro");
    append(intro,"span","status",status+" · "+e.time_scale.replace(/_/g," "));
    append(intro,"h2",null,e.title.replace(/\.$/,""));
    append(intro,"p",null,e.description);
    const context=groups.get(e.parent_id);
    addMeta(root,"Location",context?context.title.replace(/\s*\(.*\)$/,""):"Cross-cutting research strand");
    addMeta(root,"Evidence",e.evidence_flags.map(x=>lookup[x]||x).join(" · "));
    addMeta(root,"Time status",e.chronology_status.replace(/_/g," "));
    append(root,"h3",null,"INTERPRETATION CAUTION");
    append(root,"p",null,e.evidence_flags.includes("X")?"This entry is flagged for source, historical, scientific or ethical caution; follow the primary text in context.":"This is an attributed account from Steiner's work. Dates and spiritual events are not independent scientific verification.");
    referenceList(root,e.source_ids);
    const actions=append(root,"div","detail-actions");
    const ref=document.createElement("a");ref.className="action";ref.href="../docs/STEINER_HIERARCHICAL_CHRONOLOGY_MASTER_V01.md";ref.textContent="Master document ↗";actions.appendChild(ref);
    const copy=button("Copy entry link","action",()=>navigator.clipboard?.writeText(location.href).catch(()=>{}));actions.appendChild(copy);
    byId("record-id").textContent=e.id;
  }
  function addMeta(parent,label,value){const r=append(parent,"div","meta-row");append(r,"span",null,label);append(r,"span",null,value);}
  function summaryFor(node){
    const root=byId("detail-content");root.replaceChildren();
    const intro=append(root,"div","detail-intro");
    append(intro,"span","status",node.status==="future"?"PROJECTED FUTURE":node.id==="root"?"THE WHOLE CYCLE":(timeDesc[node.kind]||"INTERVAL").toUpperCase());
    append(intro,"h2",null,node.id==="root"?"A world within a world.":node.label);
    let info=node.id==="root"?"Begin with seven great cosmic conditions. Select a colored arc, then continue inward through Earth epochs, cultural periods and specific claims. Each detail links to Steiner's texts.":node.subtitle+". "+(childNodes(node.id).length>0?"Choose an arc in the next ring to go deeper.":"Explore this stage's source-linked research entries.");
    if(node.id==="cos-earth")info="The fourth cosmic condition: Earth. Its seven great epochs form the next ring; individual processes occur within and across those epochs.";
    if(node.id==="earth-post")info="The fifth great Earth epoch unfolds through seven post-Atlantean cultural periods. Choose one to examine its claims and transitions.";
    if(node.id==="period-14")info="Steiner's current fifth post-Atlantean age, beginning approximately 1413, emphasizes independent consciousness and moral freedom.";
    append(intro,"p",null,info);
    const count=childNodes(node.id).length;
    addMeta(root,"This level",count+(count===1?" nested item":" nested intervals / events"));
    addMeta(root,"Timescale",timeDesc[node.kind]||"Research group");
    addMeta(root,"View","Click an arc · drag the dial · select a card");
    if(node.groupId){const related=data.events.filter(e=>e.parent_id===node.groupId);
      const evidence=Array.from(new Set(related.flatMap(e=>e.source_ids)));
      append(root,"h3",null,"RESEARCH IN THIS ERA");
      append(root,"p",null,related.length+" source-linked entries available. "+(node.status==="future"?"This is a projected stage, not a measured future date.":"Developmental orders are attributed to Steiner, not confirmed historical measurements."));
      referenceList(root,evidence.slice(0,5));
    }else if(node.id==="earth-post"){
      append(root,"h3",null,"ABOUT THE PERIOD DATES");
      append(root,"p",null,"The seven cultural periods use approximate and partly derived boundaries. Their equal dial arcs are a navigation choice, not a statement of equal verified historical duration.");
    }else if(node.id==="cos-earth"){
      append(root,"h3",null,"ALSO WITHIN EARTH");
      const b=button("Earth-wide evolutionary processes ("+data.events.filter(e=>e.parent_id==="CH-5").length+")","action",()=>showGroupRecords("CH-5"));root.appendChild(b);
      const after=append(root,"p",null,"Separate cross-era transitions include the war of all against all and Earth's eventual reintegration. These are not added as eighth or ninth great epochs.");after.style.marginTop="16px";
    }else if(node.id==="root"){
      append(root,"h3",null,"HOW TO READ THE DIAL");
      append(root,"p",null,"Each ring is a different scale of the same chronology. Large arcs represent parent eras. Deeper, smaller marks represent the events contained within them. Related spiritual influences can run across many intervals.");
    }
    byId("record-id").textContent=node.id==="root"?"THE WHOLE":node.id.toUpperCase();
  }
  function showGroupRecords(gid){
    const root=byId("detail-content");root.replaceChildren();
    append(root,"span","status","CROSS-ERA EVENTS");
    append(root,"h2",null,groups.get(gid)?.title||"Related processes");
    append(root,"p",null,"These descriptions apply to the wider stage and are not forced into a single dated subperiod. Select one to read sources.");
    data.events.filter(e=>e.parent_id===gid).forEach(e=>root.appendChild(button(e.title.replace(/\.$/,""),"source-link",()=>selectRecord(e.id))));
    byId("record-id").textContent=gid;
  }
  function selectRecord(id){if(!entries.has(id))return;selection=id;const n=nodes.get(id);if(n&&n.parent)focus=n.parent;writeHash(id);render();byId("detail-content").scrollIntoView({behavior:"smooth",block:"nearest"});}
  function renderCrumbs(){
    const crumbs=byId("breadcrumbs");crumbs.replaceChildren();
    ancestors(focus).forEach((id,i)=>{
      if(i)append(crumbs,"span","slash","/");
      crumbs.appendChild(button(id==="root"?"Whole cycle":nodes.get(id).label,"",()=>setFocus(id)));
    });
    byId("up").hidden=focus==="root";
    const node=nodes.get(focus);
    byId("heart-kicker").textContent=focus==="root"?"THE COMPLETE CYCLE":(node.kind==="cosmic"?"COSMIC CONDITION":node.kind==="epoch"?"EARTH EPOCH":node.kind==="culture"?"CULTURAL PERIOD":"EXPLORE");
    byId("heart-title").textContent=focus==="root"?"Seven world stages":node.label;
    byId("heart-subtitle").textContent=focus==="root"?"From Old Saturn to Future Vulcan":node.subtitle||"Explore this interval";
  }
  function renderBrowse(){
    const sub=childNodes(focus),panel=byId("browse-list");panel.replaceChildren();
    const named=nodes.get(focus);
    byId("list-title").textContent=focus==="root"?"Seven cosmic conditions":"Within "+named.label;
    byId("list-count").textContent=sub.length+" "+(sub[0]?.kind==="event"?"events":"intervals");
    sub.forEach((node,i)=>{
      const card=button("","browse-card "+node.status,()=>setFocus(node.id));card.textContent="";
      append(card,"span","browse-index",String(i+1).padStart(2,"0")+" / "+String(sub.length).padStart(2,"0"));
      append(card,"span","browse-title",node.label);
      append(card,"span","browse-sub",node.kind==="event"?(matches(node)?"Read source-linked entry ↗":"Filtered · select to inspect"):node.subtitle+" ↗");
      if(!matches(node))card.style.opacity=".5";
      panel.appendChild(card);
    });
  }
  function renderStrands(){
    document.querySelectorAll("[data-strand]").forEach(b=>{const active=b.dataset.strand===strand;b.classList.toggle("active",active);b.setAttribute("aria-pressed",active?"true":"false");});
    const panel=byId("strand-list");panel.replaceChildren();
    const ev=data.events.filter(e=>e.parent_id===strand);
    ev.forEach((e,i)=>{
      const b=button("","strand-card",()=>selectRecord(e.id));b.textContent="";
      append(b,"span","browse-index",e.id);
      append(b,"span","browse-title",e.title.replace(/\.$/,""));
      if(!matches(nodes.get(e.id)))b.style.opacity=".48";
      panel.appendChild(b);
    });
  }
  function render(){
    if(!data)return;
    renderDial();renderCrumbs();renderBrowse();renderStrands();
    if(selection&&entries.has(selection))detailsForEvent(entries.get(selection));else summaryFor(nodes.get(focus));
  }
  function jump(id){if(nodes.has(id)){const n=nodes.get(id);if(n.parent)focus=n.parent;selection=id;writeHash(id);render();}else if(groups.has(id))showGroupRecords(id);}
  function renderSearch(){
    const q=byId("search").value.trim().toLowerCase(),p=byId("search-results");
    byId("clear-search").hidden=!q;
    if(q.length<2){p.hidden=true;return;}
    const matchesAll=data.events.filter(e=>(e.title+" "+e.description+" "+e.id).toLowerCase().includes(q)).slice(0,15);
    p.replaceChildren();append(p,"h3",null,matchesAll.length+" MATCHES · CLICK TO OPEN");
    if(!matchesAll.length)append(p,"p",null,"No matching research entries. Try a broader word.");
    matchesAll.forEach(e=>{
      const b=button("","result",()=>{p.hidden=true;byId("search").value="";byId("clear-search").hidden=true;jump(e.id);byId("dial-title").scrollIntoView({behavior:"smooth"});});
      append(b,"strong",null,e.title.replace(/\.$/,""));append(b,"small",null,e.id+" · "+(groups.get(e.parent_id)?.title||"Research strand"));p.appendChild(b);
    });p.hidden=false;
  }
  function attach(){
    const dial=byId("dial");
    dial.addEventListener("click",e=>{
      if(suppressClick){suppressClick=false;return;}
      const el=e.target.closest("[data-node]");
      if(el)setFocus(el.getAttribute("data-node"));
    });
    dial.addEventListener("keydown",e=>{
      if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-node]")){e.preventDefault();setFocus(e.target.getAttribute("data-node"));}
      else if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();rotate(e.key==="ArrowLeft"?-15:15);}
    });
    dial.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,start:rotation,px:e.clientX,moved:false};try{dial.setPointerCapture(e.pointerId);}catch(err){}});
    dial.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>7)drag.moved=true;if(drag.moved){rotation=drag.start+dx*.33;byId("spin")?.setAttribute("transform","rotate("+rotation+" 430 430)");}});
    dial.addEventListener("pointerup",e=>{if(drag?.moved)suppressClick=true;drag=null;});
    dial.addEventListener("pointercancel",()=>{drag=null;suppressClick=false;});
    byId("up").addEventListener("click",()=>{const p=nodes.get(focus)?.parent;if(p)setFocus(p);});
    byId("reset").addEventListener("click",()=>setFocus("root"));
    function rotate(delta){rotation+=delta;byId("spin")?.setAttribute("transform","rotate("+rotation+" 430 430)");}
    byId("turn-left").addEventListener("click",()=>rotate(-24));
    byId("turn-right").addEventListener("click",()=>rotate(24));
    byId("theme").addEventListener("change",e=>{theme=e.target.value;render();renderSearch();});
    byId("agency").addEventListener("change",e=>{agency=e.target.value;render();renderSearch();});
    byId("search").addEventListener("input",renderSearch);
    byId("clear-search").addEventListener("click",()=>{byId("search").value="";renderSearch();byId("search").focus();});
    document.querySelectorAll("[data-strand]").forEach(b=>b.addEventListener("click",()=>{strand=b.dataset.strand;renderStrands();}));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){byId("search-results").hidden=true;byId("search").blur();}});
    window.addEventListener("hashchange",()=>{const id=decodeURIComponent(location.hash.slice(1));if(nodes.has(id))setFocus(id);});
  }
  async function boot(){
    attach();
    try{
      const res=await fetch(DATA_URL,{cache:"no-cache"});if(!res.ok)throw Error("HTTP "+res.status);
      const d=await res.json();
      if(!Array.isArray(d.events)||!Array.isArray(d.sources))throw Error("Invalid chronology data");
      makeModel(d);
      const requested=decodeURIComponent(location.hash.slice(1));
      if(nodes.has(requested)){const n=nodes.get(requested);if(n.kind==="event"||n.kind==="strand"){focus=n.parent||"root";selection=requested;}else focus=requested;}
      render();
      window.__chronologyDiagnostics={entryCount:d.events.length,sourceCount:d.sources.length,nodeCount:nodes.size,cosmicCount:childNodes("root").length,earthEpochCount:childNodes("cos-earth").length,periodCount:childNodes("earth-post").length,ready:true};
    }catch(err){
      const el=byId("detail-content");el.replaceChildren();
      append(el,"h2",null,"Chronology data unavailable.");
      append(el,"p",null,"The interface loaded, but could not read the published chronology dataset. "+err.message+". Please check the repository publication status.");
      byId("record-id").textContent="DATA ERROR";
    }
  }
  boot();
})();