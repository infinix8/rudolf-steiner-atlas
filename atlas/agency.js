"use strict";
const $=selector=>document.querySelector(selector);
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const model={matrix:null,sourceIds:new Set()};
const safeSource=url=>{try{const x=new URL(url);return x.protocol==="https:"&&["rsarchive.org","www.rsarchive.org"].includes(x.hostname)}catch{return false}};
function selectOptions(){
 const stages=[...new Set(model.matrix.rows.map(x=>x.stage))];
 const types=[...new Set(model.matrix.rows.map(x=>x.relation_kind))].sort();
 for(const [selector,items] of [["#stage-filter",stages],["#role-filter",types]]){
  for(const value of items){
   const option=document.createElement("option");option.value=value;
   option.textContent=value.replaceAll("_"," ");$(selector).append(option);
  }
 }
}
function sourceLink(x){
 const u=x.source_url;
 return safeSource(u)?'<a href="'+escapeHtml(u)+'" target="_blank" rel="noopener noreferrer">GA 110 '+escapeHtml(x.source_id.slice(-2))+
    ', '+escapeHtml(x.passage_locator)+' ↗</a>':'<span>Source link needs review</span>';
}
function render(){
 const stage=$("#stage-filter").value,kind=$("#role-filter").value,q=$("#agency-search").value.trim().toLowerCase();
 const organ=$("#organ-only").checked;
 const results=model.matrix.rows.filter(x=>{
  if(stage && x.stage!==stage)return false;
  if(kind && x.relation_kind!==kind)return false;
  if(organ && !(x.relation_kind==="anatomical_rudiment" ||
     (x.relation_kind==="symbolic_correspondence" && /heart|ribcage/i.test(x.target))))return false;
  if(q && ![x.stage,x.agent,x.target,x.predicate,x.relation_kind,x.caution,x.passage_locator].join(" ").toLowerCase().includes(q))return false;
  return true;
 });
 const organCount=model.matrix.rows.filter(x=>x.relation_kind==="anatomical_rudiment"||
     (x.relation_kind==="symbolic_correspondence"&&/heart|ribcage/i.test(x.target))).length;
 $("#agency-stats").innerHTML=[
  ["Source-linked agency statements",model.matrix.rows.length],
  ["Distinguished stage contexts",new Set(model.matrix.rows.map(x=>x.stage)).size],
  ["Distinct action classes",new Set(model.matrix.rows.map(x=>x.relation_kind)).size],
  ["Organ and organ-image cases",organCount]
 ].map(([label,v])=>'<div class="stat"><strong>'+v+'</strong><span>'+escapeHtml(label)+'</span></div>').join("");
 $("#agency-count").textContent=results.length+" entries match the current filters; original source paragraphs remain authoritative.";
 $("#agency-rows").innerHTML=results.map(x=>'<tr><td><span class="stage">'+escapeHtml(x.stage)+'</span></td>'+
  '<td><span class="agent">'+escapeHtml(x.agent)+'</span></td>'+
  '<td><span class="kind">'+escapeHtml(x.relation_kind.replaceAll("_"," "))+'</span>'+
  '<p>'+escapeHtml(x.predicate.replaceAll("_"," "))+'</p></td>'+
  '<td>'+escapeHtml(x.target)+'<br><small>Exclusive builder? No such claim established.</small></td>'+
  '<td>'+sourceLink(x)+'<details><summary>Source qualification</summary><p>'+
  escapeHtml(x.caution)+'</p><small>'+escapeHtml(x.evidence_status)+'</small></details></td></tr>').join("")||
 '<tr><td colspan="5">No source-linked statements match. Change the filters.</td></tr>';
}
async function start(){
 try{
  const r=await fetch("../research/organ-hierarchy-agency-matrix-v27.json");
  if(!r.ok)throw Error("Could not load repository-owned stage/agency data");
  model.matrix=await r.json();
  if(model.matrix.rows.length<20)throw Error("Source matrix appears incomplete");
  selectOptions();
  for(const id of ["#stage-filter","#role-filter","#agency-search","#organ-only"]){
   $(id).addEventListener(id==="#agency-search"?"input":"change",render);
  }
  $("#agency-reset").addEventListener("click",()=>{
    $("#stage-filter").value="";$("#role-filter").value="";$("#agency-search").value="";$("#organ-only").checked=false;render();
  });
  render();
 }catch(err){$("#agency-count").textContent="Could not open the agency matrix: "+String(err.message);}
}
start();