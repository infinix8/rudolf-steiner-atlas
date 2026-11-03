"use strict";
// The organ browser loads original editorial records, not the original lecture texts.
const $=q=>document.querySelector(q);
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={dossiers:null,ledger:null,phase16:null,selected:null};
function allowed(url){
  try{const u=new URL(url);return u.protocol==="https:"&&["rsarchive.org","www.rsarchive.org"].includes(u.hostname)}catch{return false}
}
function srcLink(url,label="Read original source ↗"){
  return allowed(url)?'<a target="_blank" rel="noopener noreferrer" href="'+safe(url)+'">'+safe(label)+'</a>':
    '<span class="organ-empty">No verified original source link for this record</span>';
}
function getPhases(d){
  return Object.entries(d)
    .filter(([key,val])=>/^phase\d+_refinements$/.test(key)&&Array.isArray(val))
    .sort(([a],[b])=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
}
function allRefinements(d){return getPhases(d).flatMap(([phase,list])=>list.map(value=>({phase,record:value})))}
function searchText(d){
  return [d.id,d.organ,...(d.aliases||[]),...d.relations.map(x=>[x.relation,x.original_editorial_summary]),
    ...allRefinements(d).map(x=>[x.record.relation,x.record.relation_type,x.record.note])].flat(Infinity).join(" ").toLowerCase();
}
function showStats(){
  const list=state.dossiers.dossiers;
  const withLegacy=list.filter(d=>d.relations.length).length;
  const withPhase=list.filter(d=>allRefinements(d).length).length;
  const noEvidence=list.filter(d=>!d.relations.length&&!allRefinements(d).length).length;
  const stats=[["Organ dossiers",list.length],["Original comparative relations",withLegacy],
    ["With later claim annotations",withPhase],["No linked records yet",noEvidence]];
  $("#organ-stats").innerHTML=stats.map(([label,num])=>'<div class="stat"><strong>'+num+
    '</strong><span>'+safe(label)+'</span></div>').join("");
}
function nav(){
  const q=$("#organ-query").value.trim().toLowerCase(),filter=$("#organ-filter").value;
  const items=state.dossiers.dossiers.filter(d=>{
    const later=allRefinements(d).length;
    if(filter==="relations"&&!d.relations.length)return false;
    if(filter==="refinement"&&!later)return false;
    if(filter==="gap"&&(d.relations.length||later))return false;
    return !q||q.split(/\s+/).every(x=>searchText(d).includes(x));
  }).sort((a,b)=>a.organ.localeCompare(b.organ));
  $("#organ-nav").innerHTML=items.map(d=>{
    const later=allRefinements(d).length;
    return '<button type="button" class="organ-item'+(state.selected===d.id?" active":"")+
      '" data-organ="'+safe(d.id)+'"><strong>'+safe(d.organ)+'</strong>'+
      '<small>'+d.relations.length+' comparative · '+later+' later annotations</small></button>';
  }).join("")||'<p class="organ-empty">No organ dossier matches this search.</p>';
}
function legacyHtml(r){
  const fields=[r.relation||r.relation_type||"relation",r.source_basis,r.german_collation].filter(Boolean);
  return '<article class="organ-record"><h3>'+safe(fields[0].replaceAll("_"," "))+'</h3>'+
    (r.original_editorial_summary?'<p>'+safe(r.original_editorial_summary)+'</p>':"")+
    '<p class="meta">'+safe(r.passage_cue||"Passage cue not supplied")+' · '+
    safe((fields.slice(1).join(" · ")||"Legacy source association"))+'</p>'+
    srcLink(r.source_url)+'</article>';
}
function refinementHtml(phase,r){
  const type=r.relation||r.relation_type||"selected claim";
  const cue=r.passage_cue||r.source_section||r.paragraph||"Passage cue not recorded";
  return '<article class="organ-record"><h3>'+safe(type.replaceAll("_"," "))+'</h3>'+
    (r.note?'<p>'+safe(r.note)+'</p>':"")+
    '<p class="meta">'+safe(phase.replaceAll("_"," "))+' · '+safe(r.claim_ref_id||r.claim_id||"editorial record")+
    ' · '+safe(cue)+'</p>'+
    (r.review_scope?'<p class="flag">'+safe(r.review_scope)+'</p>':"")+
    srcLink(r.source_url)+'</article>';
}
function showOrgan(id){
  const d=state.dossiers.dossiers.find(x=>x.id===id);if(!d)return;
  state.selected=id;
  const later=allRefinements(d);
  const tags='<div class="organ-badges"><span class="organ-tag">'+d.relations.length+
      ' original comparative relations</span><span class="organ-tag">'+later.length+
      ' versioned claim annotations</span></div>';
  const legacy=d.relations.length?'<div class="organ-records">'+d.relations.map(legacyHtml).join("")+'</div>':
    '<p class="organ-empty">No first-pass comparison records are attached to this dossier. It is a research gap, not a claim that Steiner did not discuss it.</p>';
  const laterHtml=later.length?
    '<div class="organ-records">'+later.map(x=>refinementHtml(x.phase,x.record)).join("")+'</div>':
    '<p class="organ-empty">No later selected-claim refinements are attached yet.</p>';
  $("#organ-detail").innerHTML=
    '<p class="organ-label">Canonical organ dossier · '+safe(d.id)+'</p><h2>'+safe(d.organ)+'</h2>'+
    '<p class="muted">Alternate terms: '+safe((d.aliases||[]).join(" · ")||"none recorded")+'</p>'+
    tags+
    '<div class="organ-note">Different historical assertions may describe an analogy, a transformation, a current bodily function, a named spiritual agent or a therapeutic conjecture. Do not equate these merely because they refer to the same organ. Source records are not clinical evidence.</div>'+
    '<section class="organ-detail-section"><h3>Earlier comparative source references</h3>'+legacy+'</section>'+
    '<section class="organ-detail-section"><h3>Later passage-linked annotations</h3>'+laterHtml+'</section>'+
    '<section class="organ-detail-section"><h3>Research questions and caveats</h3>'+
    ((d.open_questions||[]).length?'<ul>'+d.open_questions.map(q=>'<li>'+safe(q)+'</li>').join("")+'</ul>':
    '<p class="organ-empty">Further translation and detailed source review needed.</p>')+
    (Object.entries(d).filter(([k,v])=>k.endsWith("scope_note")&&typeof v==="string").map(([k,v])=>
      '<p class="organ-empty"><strong>'+safe(k.replaceAll("_"," "))+':</strong> '+safe(v)+'</p>').join(""))+
    '</section>';
  const query=new URLSearchParams(location.search);query.set("organ",id);
  history.replaceState(null,"",location.pathname+"?"+query.toString());
  nav();
}
function cases(){
  const r=state.phase16;
  const source=r.source.source_url;
  const issues=r.textual_issues;
  const count=r.records.length;
  $("#case-summary").innerHTML=
    '<div class="organ-badges"><span class="organ-tag">'+count+' selected passage cards</span>'+
    '<span class="organ-tag">'+issues.length+' translation discrepancies</span>'+
    '<span class="organ-tag">NOT a full numbered-section review</span></div>'+
    '<p>'+srcLink(source,"Read original GA 317 lecture VIII ↗")+'</p>'+
    '<details><summary>Review specific case themes and source cautions ('+count+')</summary><div class="case-grid">'+
    r.records.map(x=>'<article><h3>'+safe(x.paragraph)+'</h3><p>'+safe(x.summary)+'</p>'+
      '<p class="organ-empty">'+safe(x.classification.replaceAll("_"," "))+'</p><p class="flag">'+
      safe(x.editorial_caution)+'</p></article>').join("")+
    '</div></details>'+
    '<details><summary>Two unresolved numerical English / German discrepancies</summary><div class="case-grid">'+
    issues.map(issue=>'<article><h3>'+safe(issue.cue)+'</h3>'+
      '<p><strong>English displayed:</strong> '+safe(issue.english_1972_rendering)+'</p>'+
      '<p><strong>German displayed:</strong> '+safe(issue.german_record)+'</p>'+
      '<p class="flag">'+safe(issue.warning)+'</p></article>').join("")+'</div></details>';
}
async function init(){
 try{
  const [a,b,c]=await Promise.all([fetch("../research/organ-comparative-dossiers-v16.json"),
    fetch("../research/organ-corpus-ledger-ga313-317-v16.json"),
    fetch("../research/organ-selected-reading-ga317-viii-v16.json")]);
  if([a,b,c].some(x=>!x.ok))throw Error("Cannot load local organ concordance data: serve from repository root.");
  [state.dossiers,state.ledger,state.phase16]=await Promise.all([a.json(),b.json(),c.json()]);
  if(state.dossiers.dossiers.length!==state.dossiers.dossier_count)throw Error("Organ dossier count mismatch.");
  showStats();cases();
  $("#organ-query").addEventListener("input",nav);
  $("#organ-filter").addEventListener("change",nav);
  $("#organ-reset").addEventListener("click",()=>{
    $("#organ-query").value="";$("#organ-filter").value="";nav();
  });
  $("#organ-nav").addEventListener("click",event=>{
    const button=event.target.closest("[data-organ]");if(button)showOrgan(button.dataset.organ);
  });
  const param=new URLSearchParams(location.search).get("organ");
  nav();
  if(state.dossiers.dossiers.some(d=>d.id===param))showOrgan(param);
  else showOrgan("organ-heart");
 }catch(e){$("#organ-detail").innerHTML='<p class="empty">'+safe(e.message)+'</p>';}
}
init();