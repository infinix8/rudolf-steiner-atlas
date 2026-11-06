"use strict";
/* Curated source-linked visual guides; no archive content is fetched or mirrored. */
(function () {
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = value => String(value == null ? "" : value)
    .replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const validUrl = value => {
    try { const u = new URL(value); return u.protocol === "https:" && ["rsarchive.org","www.rsarchive.org"].includes(u.hostname); }
    catch (_) { return false; }
  };
  const state = {data:null, guide:null, organ:"organ-heart", layer:"overview", connection:0};
  const layersSet = new Set(["overview","body","interpretation","evolution","agencies","connections","sources","questions"]);

  function sourceById(id) { return state.guide.sources.find(s => s.id === id); }
  function sourceLinks(ids) {
    const items = (Array.isArray(ids) ? ids : []).map(id => sourceById(id)).filter(Boolean).filter(s => validUrl(s.url));
    if (!items.length) return '<span class="small-aside">No specific source link for this editorial item</span>';
    return '<div class="source-links">' + items.map(s =>
      '<a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener noreferrer" ' +
      'title="' + escapeHtml(s.title + " · " + s.cue) + '">GA ' + escapeHtml(s.ga) + ' · ' +
      escapeHtml(s.cue.length > 47 ? s.cue.slice(0,44) + "…" : s.cue) + ' ↗</a>'
    ).join("") + "</div>";
  }
  function header(kicker,title,intro) {
    return '<div class="panel-header"><div><p class="section-kicker">' + escapeHtml(kicker) +
      '</p><h2>' + escapeHtml(title) + '</h2></div></div>' +
      (intro ? '<p class="panel-intro">' + escapeHtml(intro) + '</p>' : "");
  }
  function ideaCards(items,label) {
    return '<div class="tile-grid">' + items.map((c,i) =>
      '<article class="info-card' + (c.type === "modern_anatomy" ? " modern" : "") + '">' +
      '<div class="number" aria-hidden="true">' + String(i+1).padStart(2,"0") + '</div>' +
      (c.type === "modern_anatomy" ? '<div class="type-tag">Modern anatomical orientation</div>' : "") +
      '<h3>' + escapeHtml(c.title) + '</h3><p>' + escapeHtml(c.body) + '</p>' +
      (c.sources && c.sources.length ? sourceLinks(c.sources) : "") +
      "</article>"
    ).join("") + "</div>" + (label ? '<p class="small-aside">' + escapeHtml(label) + '</p>' : "");
  }
  function overview() {
    const g=state.guide;
    return header("01 / Begin here","Three ideas to remember",g.intro) +
      ideaCards(g.quick_takeaways) +
      '<div class="note-box"><strong>One organ, several explanatory contexts</strong>Steiner may be speaking about a primordial organ disposition, present organismic rhythm, a spiritual analogy or a historical therapeutic theory. These are not interchangeable. Every source-specific card takes you to the exact original lecture.</div>' +
      '<div class="actions"><button type="button" class="action button" data-jump-layer="evolution">See the evolution view →</button> ' +
      '<button type="button" class="action button secondary" data-jump-layer="sources">Read the original sources ↗</button></div>';
  }
  function bodilyContext() {
    const g=state.guide;
    return header("02 / Find the organ","Where the organ is — and what kind of explanation is being given",
      g.body.note) + ideaCards(g.body.cards,"The selected organ is highlighted in the body locator above. Anatomical facts are separated from attributed historical spiritual-scientific claims.") +
      '<div class="note-box"><strong>A distinction worth keeping</strong>The body map is a schematic navigation tool, not a medical scan. Human bodily organization in Steiner is a research topic; present physical physiology should not be inferred from his historical esoteric lectures.</div>';
  }
  function interpretation() {
    const g=state.guide;
    return header("03 / Read the different meanings","Steiner's interpretations",g.interpretation.intro) +
      ideaCards(g.interpretation.cards) +
      '<div class="note-box"><strong>Read the relationship type first</strong>Rhythmic organization, etheric association, inward sense, I-organization and symbolic imagery are separate predicates. They must not be turned into one unqualified causal mechanism.</div>';
  }
  function evolution() {
    const v=state.guide.evolution;
    const timeline='<div class="evo-line" aria-label="Evidence-grounded evolutionary and interpretive contexts">' +
      v.timeline.map((x,i) => '<article class="evo-step ' + escapeHtml(x.kind) + '">' +
        '<small>' + String(i+1).padStart(2,"0") + ' · ' + escapeHtml(x.stage) + '</small>' +
        '<h3>' + escapeHtml(x.title) + '</h3><p>' + escapeHtml(x.body) + '</p>' +
        (x.sources.length ? sourceLinks(x.sources) : '<p class="small-aside">Further research required; no asserted passage here.</p>') +
      '</article>').join("") + '</div>';
    const c=v.compare;
    const compare='<h2 style="font:normal 25px Georgia,serif;margin:18px 0 14px">Compare two different contexts</h2>' +
      '<div class="compare-block"><article class="compare-pane"><small>' + escapeHtml(c.left.label) + '</small><h3>' +
      escapeHtml(c.left.detail) + '</h3>' + sourceLinks(c.left.sources) + '</article>' +
      '<article class="compare-pane"><small>' + escapeHtml(c.right.label) + '</small><h3>' + escapeHtml(c.right.detail) +
      '</h3>' + sourceLinks(c.right.sources) + '</article>' +
      '<div class="compare-caption">' + escapeHtml(c.conclusion) + '</div></div>';
    return header("04 / Contexts through time","Evolution without conflating stages",v.lead) + timeline + compare;
  }
  function agencies() {
    const a=state.guide.agencies;
    return header("05 / Spiritual beings and organization","Who or what is said to act?",a.intro) +
      '<div class="agency-scroll"><table class="agency-table"><thead><tr>' +
      '<th scope="col">Agent or member</th><th scope="col">Attributed activity</th><th scope="col">Target / context</th><th scope="col">Original passage</th>' +
      '</tr></thead><tbody>' + a.rows.map(r =>
        '<tr><td data-label="Agent / member"><strong>' + escapeHtml(r.agent) + '</strong><small>' + escapeHtml(r.stage) + '</small></td>' +
        '<td data-label="Kind of activity">' + escapeHtml(r.role) + '</td>' +
        '<td data-label="Scope">' + escapeHtml(r.target) + '<small>' + escapeHtml(r.caveat) + '</small></td>' +
        '<td data-label="Source">' + sourceLinks(r.sources) + '</td></tr>'
      ).join("") + '</tbody></table></div>' +
      '<div class="claim-warning"><strong>Not an exclusive organ-builder table</strong>A hierarchy may be described as donating, ordering, preserving or guiding in a particular stage. A symbolic planet or the human I should not automatically be relabeled a named spiritual hierarchy or the sole builder of a finished organ.</div>';
  }
  function connectionDetail(index) {
    const x=state.guide.connections.nodes[index];
    if (!x) return "";
    return '<p class="section-kicker">' + escapeHtml(x.relation.replaceAll("_"," ")) + '</p>' +
      '<h3>' + escapeHtml(x.label) + '</h3><p>' + escapeHtml(x.detail) + '</p>' +
      sourceLinks(x.sources) +
      '<p class="small-aside">Explore the original passage to distinguish this relationship from other sorts of association.</p>';
  }
  function connections() {
    const c=state.guide.connections;
    const buttons=c.nodes.map((x,i) => '<button type="button" class="orbit-node pos'+i+'" data-connection="'+i+'" ' +
      'aria-pressed="'+(i===state.connection?'true':'false')+'" title="'+escapeHtml(x.detail)+'">' +
      escapeHtml(x.label)+'</button>').join("");
    const links=c.nodes.map((x,i) => '<button type="button" data-connection="'+i+'" aria-pressed="'+(i===state.connection?'true':'false')+'">' +
      escapeHtml(x.label) + '</button>').join("");
    return header("06 / Connected meanings","A source-linked constellation",c.intro) +
      '<div class="conn-layout"><div class="orbit-diagram" aria-label="Interactive connection network; the text buttons below show the same relationships">' +
      '<div class="orbit"><div class="orbit-center">' + escapeHtml(state.guide.slug) + '</div>' + buttons + '</div></div>' +
      '<div><div class="conn-detail" id="connection-detail" aria-live="polite">' + connectionDetail(state.connection) + '</div>' +
      '<div class="conn-list" aria-label="Connections as accessible buttons">' + links + '</div>' +
      '<p class="conn-legend">Select any concept to see its precise relation and original Steiner source.</p></div></div>';
  }
  function sourceList() {
    const g=state.guide;
    return header("07 / Return to the primary works","Original passages behind the visuals",
      "The Atlas gives concise original editorial summaries and links outward to Steiner's actual books and recorded lectures. A checked passage is not a full German or independent second review.") +
      '<div class="sources-list">' + g.sources.map(s =>
        '<article class="source-entry"><div class="source-ga">GA ' + escapeHtml(s.ga) + '</div><div><h3>' + escapeHtml(s.title) +
        '</h3><small>' + escapeHtml(s.cue) + '</small><p>' + escapeHtml(s.context) + '</p>' +
        (validUrl(s.url) ? '<a class="button secondary" href="' + escapeHtml(s.url) +
          '" target="_blank" rel="noopener noreferrer">Read the original passage ↗</a>' : '<p>Original link pending verification</p>') +
        '</div></article>'
      ).join("") + '</div>' +
      '<div class="claim-warning"><strong>Source checking is not scientific validation</strong>These links establish the historical context for attributed teachings, not whether their physiological, medical, cosmological or spiritual assertions are factually correct. Alternate translations are not separate original lecture events.</div>';
  }
  function questions() {
    return header("08 / Keep uncertainty visible","Open research questions",
      "These issues remain visible instead of being silently reconciled or dropped from a polished visual presentation.") +
      '<div class="question-grid">' + state.guide.questions.map((q,i) =>
        '<details class="question"' + (i===0 ? ' open' : '') + '><summary>' + escapeHtml(q.title) + '</summary>' +
        '<div class="answer"><p>' + escapeHtml(q.body) + '</p>' +
        (q.sources.length ? sourceLinks(q.sources) : '<p class="small-aside">Corpus-level audit or comparison remains open.</p>') +
        '</div></details>').join("") + '</div>' +
      '<div class="note-box"><strong>Research continuation</strong>The canonical research checkpoint remains phase 29. The wider GA 107, GA 205, GA 208 and GA 218 work, whole-German collation, comprehensive claim extraction and independent second review are ongoing. This visual page is a curated guide, not a completed concordance.</div>';
  }
  const renderLayer={overview,body:bodilyContext,interpretation,evolution,agencies,connections,sources:sourceList,questions};

  function navButton(layer) {
    return '<button type="button" role="tab" aria-controls="layer-panel" class="layer-tab" tabindex="' +
      (layer.id === state.layer ? '0' : '-1') + '" aria-selected="' + (layer.id===state.layer?'true':'false') +
      '" data-layer="' + escapeHtml(layer.id) + '">' +
      '<span class="tab-symbol" aria-hidden="true">' + escapeHtml(layer.icon) + '</span>' +
      '<span class="tab-copy"><span class="tab-title">' + escapeHtml(layer.label) + '</span>' +
      '<span class="tab-sub">' + escapeHtml(layer.short) + '</span></span></button>';
  }
  function updateUrl(push) {
    const url = new URL(window.location.href);
    url.searchParams.set("organ",state.organ);
    url.searchParams.set("layer",state.layer);
    if (url.href !== location.href) (push ? history.pushState : history.replaceState).call(history,{organ:state.organ,layer:state.layer},"",url);
  }
  function updateLayer(next, push=true, focusPanel=false) {
    if (!layersSet.has(next)) next="overview";
    state.layer=next;
    $$("#layer-tabs [data-layer]").forEach(b=>{
      const on = b.dataset.layer===next;
      b.setAttribute("aria-selected",String(on));
      b.tabIndex=on?0:-1;
    });
    if(next==="connections") state.connection=0;
    const body=$("#layer-panel");
    body.innerHTML=renderLayer[next]();
    body.setAttribute("aria-label",state.data.layers.find(x=>x.id===next)?.label||"Organ explanation");
    $("[data-organ-switch]").forEach(a=>{
      const org=a.dataset.organSwitch;
      a.href="organ-detail.html?organ="+encodeURIComponent(org)+"&layer="+encodeURIComponent(state.layer);
      if(org===state.organ)a.setAttribute("aria-current","page");
      else a.removeAttribute("aria-current");
    });
    updateUrl(push);
    if(focusPanel)body.focus();
  }
  function setConnection(i){
    const n=Number(i);
    if (!Number.isInteger(n)||n<0||n>=state.guide.connections.nodes.length)return;
    state.connection=n;
    const detail=$("#connection-detail");
    if(detail)detail.innerHTML=connectionDetail(n);
    $$("#layer-panel [data-connection]").forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.connection)===n)));
  }
  function readRoute() {
    const p = new URLSearchParams(location.search);
    return {organ:p.get("organ")==="organ-liver"?"organ-liver":"organ-heart",layer:layersSet.has(p.get("layer"))?p.get("layer"):"overview"};
  }
  function applyGuide(organ,layer,push=false){
    const g=state.data.guides.find(x=>x.id===organ) || state.data.guides[0];
    state.guide=g;state.organ=g.id;state.connection=0;
    document.body.classList.toggle("organ-heart",g.id==="organ-heart");
    document.body.classList.toggle("organ-liver",g.id==="organ-liver");
    $("#organ-title").textContent=g.title;
    $("#crumb-organ").textContent=g.title;
    $("#organ-subtitle").textContent=g.subtitle;
    $("#organ-intro").textContent=g.one_liner;
    $("#organ-keywords").innerHTML=g.keywords.map(k=>"<span>"+escapeHtml(k)+"</span>").join("");
    $("#research-phase").textContent="Research phase "+state.data.research_phase;
    $("#dossier-link").href=g.dossier_url;
    $("#layer-tabs").innerHTML=state.data.layers.map(navButton).join("");
    updateLayer(layer,push);
    document.title=g.title+" · Visual Organ Atlas";
  }
  function init(){
    const requested=readRoute();
    fetch("../research/organ-atlas-guides-v1.json").then(r=>{if(!r.ok)throw Error("Cannot load organ guide data. Open the published site or serve the repository root.");return r.json();})
      .then(data=>{
        if(!Array.isArray(data.guides)||data.guides.length!==2||!Array.isArray(data.layers)||data.layers.length!==8)throw Error("Invalid organ-guide schema.");
        for(const g of data.guides){
          const keys=new Set(g.sources.map(s=>s.id));
          const arrays=[g.quick_takeaways,g.body.cards,g.interpretation.cards,g.evolution.timeline,g.agencies.rows,g.connections.nodes,g.questions];
          for(const item of arrays.flat())for(const id of (item.sources||[]))if(!keys.has(id))throw Error("Missing citation: "+id);
        }
        state.data=data;
        applyGuide(requested.organ,requested.layer,false);
      })
      .catch(e=>{$("#layer-tabs").innerHTML="";$("#layer-panel").innerHTML='<div class="error"><strong>Unable to load this source-linked guide.</strong><p>'+escapeHtml(e.message)+'</p><p><a href="body.html">Return to the human body map</a> or <a href="organs.html">browse existing dossiers</a>.</p></div>';});
  }
  $("#layer-tabs").addEventListener("click",e=>{const t=e.target.closest("[data-layer]");if(t)updateLayer(t.dataset.layer,true,false);});
  $("#layer-tabs").addEventListener("keydown",e=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
    const buttons=$$("#layer-tabs [data-layer]");
    let i=buttons.findIndex(b=>b.dataset.layer===state.layer);
    if(e.key==="Home")i=0;else if(e.key==="End")i=buttons.length-1;
    else i=(i+(e.key==="ArrowRight"?1:-1)+buttons.length)%buttons.length;
    updateLayer(buttons[i].dataset.layer,true,false);buttons[i].focus();e.preventDefault();
  });
  $("#layer-panel").addEventListener("click",e=>{
    const t=e.target.closest("[data-jump-layer]");
    if(t){updateLayer(t.dataset.jumpLayer,true,true);return;}
    const c=e.target.closest("[data-connection]");
    if(c)setConnection(c.dataset.connection);
  });
  window.addEventListener("popstate",()=>{if(!state.data)return;const r=readRoute();if(r.organ!==state.organ)applyGuide(r.organ,r.layer,false);else updateLayer(r.layer,false);});
  init();
})();
