"use strict";
(() => {
const $=id=>document.getElementById(id), DATA="../research/steiner-hierarchical-chronology-events-v05.json", GA13="https://rsarchive.org/Books/GA013/English/RSP1969/GA013_c04.html";
const stages=[
["cos-saturn","Old Saturn","CH-2","The Warmth Condition — Earliest Physical Germ","Steiner describes a first cosmic condition of warmth and spiritual activity. The earliest physical-body germ is prepared, not a solid body like ours.","Warmth","Physical germ","✶"],
["cos-sun","Old Sun","CH-3","The Sun Condition — Life and Etheric Organization","Old Sun reworks earlier Saturn achievements. In Steiner's account, Spirits of Wisdom impart the germ of the etheric body; warmth, air, light and plant-like life-processes characterize a new kind of living organization.","Life-body germ","Warmth and air","☼"],
["cos-moon","Old Moon","CH-4","The Moon Condition — Astrality and Image-Consciousness","Steiner describes an astral organization being added to earlier physical and etheric inheritances, accompanied by an image-like condition of consciousness.","Astral-body germ","Picture consciousness","☾"],
["cos-earth","Earth","CH-5","The Earth Condition — Human I and Moral Freedom","Earth is the fourth of seven cosmic conditions. The development of the I, independent self-consciousness and the possibility of moral freedom are central themes.","Human I","Self-consciousness","⊕"],
["cos-jupiter","Future Jupiter","CH-21","The Fifth Condition — A Projected Future","A future condition in Steiner's scheme, associated with Spirit-Self and further spiritual capacities; not a claim about the present astronomical Jupiter.","Spirit-Self","Projected future","♃"],
["cos-venus","Future Venus","CH-22","The Sixth Condition — Further Transformation","Steiner places Future Venus after Future Jupiter, associating it with Life-Spirit and the continued spiritual development of humanity.","Life-Spirit","Projected future","♀"],
["cos-vulcan","Future Vulcan","CH-23","The Seventh Condition — Spirit-Man","Future Vulcan is the seventh projected cosmic condition in Steiner's account and is associated with Spirit-Man.","Spirit-Man","Projected future","✺"]
].map(([id,title,group,tagline,intro,trait,quality,symbol])=>({id,title,group,tagline,intro,trait,quality,symbol}));
const SUN=[
["CH-3.01","Recapitulation of Saturn","Earlier foundations","The Old Saturn condition is recapitulated and its earlier achievements are developed anew.","The inherited physical germ undergoes a transformed repetition of the previous condition before the new gift of life. This is recapitulation, not a replay of an ordinary astronomical event."],
["CH-3.02","The Gift of Life","Etheric organization","Spirits of Wisdom impart the germ of a life-body to the inherited human organization.","The etheric or life body brings a capacity for growth and inner organization. In Steiner's cosmology it acts upon a previously prepared physical germ, not on modern physical anatomy."],
["CH-3.03","Warmth Becomes Air","Elemental differentiation","A new air- or gas-like condition is described alongside inherited warmth.","This refers to stages in Steiner's spiritual cosmology. It is not a scientific description of atmospheric gas formation in the present Sun."],
["CH-3.04","The Appearance of Light","Radiance","Steiner's account places the emergence of light alongside the developing life processes.","Light belongs to the transformed condition of Old Sun. The depiction of a sunrise is illustrative symbolism, not a depiction of a dated physical event."],
["CH-3.05","Plant-like Life Processes","Living growth","The evolving human germ begins plant-like internal activity and formative growth.","Steiner's comparison concerns the action of life processes; it does not identify early human beings with present-day plants."],
["CH-3.07","The Hierarchies at Work","Formative agencies","Different spiritual hierarchies continue their contributions to the evolving constitution.","Steiner discusses the Spirits of Wisdom along with other hierarchies engaged in elaborating and ordering the human germ. Their activity is layered, not a series in which one replaces all earlier influences."],
["CH-3.09","Sleep-like Consciousness","Different awareness","The state of consciousness is compared with sleep rather than today's waking awareness.","Sleep is an analogy for the kind of awareness attributed to the Old Sun human germ, not a modern adult sleeping on an astronomical sun."],
["CH-3.10","The Germ of Life-Spirit","Future potential","A first germ of what Steiner calls Life-Spirit (Buddhi) is attributed to this condition.","This is a beginning for later development, not a claim that the finished future spiritual member is already fully present on Old Sun."]
];
const state={selected:1,events:[],sources:new Map(),expanded:new Set(),drag:null,suppress:false};
const node=(tag,cls,value)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=String(value);return e;};
function current(){return stages[state.selected];}
function dataFor(){return state.events.filter(e=>e.parent_id===current().group);}
function cards(){if(state.selected===1)return SUN.map(([id,title,label,summary,detail],i)=>({id,title,label,summary,detail,index:i,refs:state.events.find(e=>e.id===id)?.source_ids||["S01"],sourceText:state.events.find(e=>e.id===id)?.description||""}));return dataFor().filter(e=>!/^Editorial restraint|^Source limitation/i.test(e.title)).slice(0,8).map((e,i)=>({id:e.id,title:e.title.replace(/\.$/,""),label:"Indexed theme",summary:e.description,detail:e.description,index:i,refs:e.source_ids||[],sourceText:""}));}
function urlFor(s){const u=new URL(location.href);u.searchParams.set("stage",s.id);return u.toString();}
function go(i,opts={}){if(i<0||i>=stages.length)return;if(i===state.selected&&!opts.force)return;state.selected=i;state.expanded.clear();if(!opts.history)history.pushState({stage:current().id},"",urlFor(current()));render();if(!opts.stay)window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
function themeArt(i,abstract=false){
 const shades=[["#57345a","#bd6c5f","#ffca78"],["#51315c","#d18e6b","#ffe7a5"],["#273c72","#a36a94","#ffd9a4"],["#4e3467","#d9a16b","#ffedbc"],["#25464e","#519e8c","#ffe2a0"],["#44346f","#9888c2","#ffe0b1"],["#37385e","#847fc3","#efd4e6"],["#54356a","#a276ba","#ffe3a4"]];
 const [dark,mid,light]=shades[i%8],u="a"+i+"-"+state.selected;
 const stars=Array.from({length:24},(_,j)=>'<circle cx="'+((j*149+41)%595)+'" cy="'+((j*71+22)%335)+'" r="'+(j%7===0?2:1)+'" fill="#fff5d4" opacity=".7"/>').join("");
 const ring='<g fill="none" stroke="'+light+'" opacity=".65"><ellipse cx="300" cy="165" rx="250" ry="77" transform="rotate(-23 300 165)" stroke-width="4"/><ellipse cx="300" cy="165" rx="220" ry="103" transform="rotate(25 300 165)" stroke-width="2"/></g>';
 const circle='<circle cx="300" cy="165" r="115" fill="url(#'+u+'glow)" stroke="#f8cf92" stroke-width="2"/>';
 const person='<g stroke="#ffe8c2" stroke-linecap="round" fill="none"><ellipse cx="300" cy="86" rx="22" ry="28" stroke-width="4"/><path d="M280 123Q253 157 190 211M318 122Q366 175 409 208M280 129Q266 196 280 242M320 128Q345 188 325 241M280 241L240 308M325 240L365 309" stroke-width="9"/></g>';
 const waves='<g fill="none" stroke-linecap="round"><path d="M-50 70C110 -20 156 255 300 95S499 35 650 145" stroke="#ffcf7f" stroke-width="29" opacity=".7"/><path d="M-40 200C120 50 206 322 345 167S552 115 640 263" stroke="#c9c6ed" stroke-width="24" opacity=".72"/></g>';
 const rays='<g stroke="#fff0c6" opacity=".85">'+Array.from({length:20},(_,j)=>{const a=j*Math.PI/10;return '<path d="M'+(300+60*Math.cos(a))+' '+(165+60*Math.sin(a))+'L'+(300+250*Math.cos(a))+' '+(165+200*Math.sin(a))+'" stroke-width="5"/>';}).join("")+'</g>'+circle;
 const leaves='<g stroke="#ffe9a4" stroke-width="4" fill="#f1e09c" fill-opacity=".3"><path d="M299 310Q277 220 309 102" fill="none" stroke-width="6"/><path d="M293 237Q239 239 210 180Q272 168 293 237ZM300 200Q347 183 370 125Q314 143 300 200ZM302 155Q277 126 308 67Q347 121 302 155Z"/></g>';
 const powers='<g>'+[176,300,424].map((x,j)=>'<circle cx="'+x+'" cy="'+(98+j%2*10)+'" r="21" fill="#ffedbc"/><path d="M'+x+' '+(123+j%2*10)+'Q'+(x-60)+' 190 '+(x-58)+' 270Q'+x+' 236 '+(x+58)+' 270Q'+(x+58)+' 180 '+x+' '+(123+j%2*10)+'Z" fill="'+light+'" opacity=".5"/>').join("")+'</g>'+ring;
 const sleep='<path d="M135 256Q180 173 263 203Q288 216 343 207Q363 229 314 249Q218 295 135 256Z" fill="#f0d9ec" opacity=".84"/><path d="M297 228Q306 220 318 224" stroke="#594679" fill="none" stroke-width="4"/><path d="M371 54A61 61 0 1 0 438 127A44 44 0 1 1 371 54Z" fill="#ffefb5"/>';
 const seedArt='<g>'+Array.from({length:7},(_,j)=>'<ellipse cx="300" cy="170" rx="49" ry="113" transform="rotate('+(j*51.4)+' 300 170)" stroke="#ffe3ba" stroke-width="2" fill="'+light+'" fill-opacity=".12"/>').join("")+'</g>'+leaves;
 const motifs=[circle+ring,person+ring,waves,rays,leaves,powers,sleep,seedArt];
 const motif=abstract?circle+ring+'<text x="300" y="193" text-anchor="middle" fill="#fff2cd" font-size="100">'+current().symbol+'</text>':motifs[i%8];
 return '<svg viewBox="0 0 600 340" role="img" aria-label="Original symbolic illustration, not documentary evidence" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="'+u+'bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+dark+'"/><stop offset=".55" stop-color="'+mid+'"/><stop offset="1" stop-color="'+dark+'"/></linearGradient><radialGradient id="'+u+'glow"><stop stop-color="#fffbe8"/><stop offset=".35" stop-color="'+light+'"/><stop offset="1" stop-color="'+mid+'" stop-opacity=".04"/></radialGradient></defs><rect width="600" height="340" fill="url(#'+u+'bg)"/><circle cx="300" cy="160" r="230" fill="url(#'+u+'glow)" opacity=".66"/>'+stars+motif+'<path d="M0 314Q130 269 292 316T600 290V340H0Z" fill="'+dark+'" opacity=".55"/></svg>';
}
function renderCards(list){
 const host=$("story-grid");host.replaceChildren();
 list.forEach((c,i)=>{
  const card=node("article","moment-card");card.dataset.chapter=c.id;
  const visual=node("div","moment-visual");visual.innerHTML=themeArt(i,state.selected!==1);
  const trigger=node("button","marker");trigger.type="button";trigger.setAttribute("aria-expanded",String(state.expanded.has(c.id)));trigger.append(node("span","plus",state.expanded.has(c.id)?"−":"+"),node("span","",c.label));trigger.addEventListener("click",()=>toggle(c.id,i));
  visual.append(trigger);
  const details=node("div","details");details.hidden=!state.expanded.has(c.id);details.append(node("p","",c.detail));
  if(c.sourceText&&c.sourceText!==c.detail)details.append(node("p","source-note","Research index: "+c.sourceText));
  const sourceRow=node("div","card-sources");const refs=c.refs.map(id=>state.sources.get(id)).filter(Boolean);
  if(!refs.length && state.selected===1)refs.push({citation_name:"GA 13 · Chapter IV",url:GA13});
  refs.slice(0,3).forEach(s=>{const a=node("a","",s.citation_name||"Original source");a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";sourceRow.append(a);});
  if(!refs.length)sourceRow.append(node("small","","Source-index entry pending."));
  details.append(sourceRow);
  card.append(visual,node("h3","",(i+1)+". "+c.title),node("p","short-summary",c.summary),details);
  if(state.expanded.has(c.id))card.classList.add("expanded");
  host.append(card);
 });
}
function toggle(id,i,scroll=false){
 if(state.expanded.has(id))state.expanded.delete(id);else state.expanded.add(id);
 const card=document.querySelector('[data-chapter="'+id+'"]');
 if(!card)return;
 const open=state.expanded.has(id);card.classList.toggle("expanded",open);card.querySelector(".details").hidden=!open;card.querySelector(".marker").setAttribute("aria-expanded",String(open));card.querySelector(".plus").textContent=open?"−":"+";
 renderGuide(cards());
 if(scroll)card.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"center"});
}
function renderGuide(list){
 const host=$("chapter-links");host.replaceChildren();
 list.forEach((c,i)=>{const b=node("button","aspect"+(state.expanded.has(c.id)?" opened":""));b.type="button";b.append(node("span","",state.expanded.has(c.id)?"−":"+"),node("span","",c.title));b.addEventListener("click",()=>toggle(c.id,i,true));host.append(b);});
}
function renderSources(list){
 const host=$("source-links");host.replaceChildren();const ids=[...new Set(list.flatMap(c=>c.refs))];let refs=ids.map(id=>state.sources.get(id)).filter(Boolean);
 if(!refs.length && state.selected===1)refs=[{citation_name:"GA 13 · Occult Science · Chapter IV",url:GA13}];
 refs.slice(0,6).forEach(s=>{const a=node("a","source-link",s.citation_name);a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";host.append(a);});
}
function renderDial(){
 const host=$("dial-marks");host.replaceChildren();
 stages.forEach((s,i)=>{const diff=i-state.selected,b=node("button","dial-stage"+(!diff?" active":""));b.type="button";b.style.setProperty("--dist",diff);b.style.setProperty("--curve",diff*diff);b.setAttribute("aria-pressed",String(!diff));b.setAttribute("aria-label",s.title+(!diff?", selected":", select stage"));b.append(node("span","dial-symbol",s.symbol),node("span","dial-name",s.title));b.addEventListener("click",()=>{if(!state.suppress)go(i);});host.append(b);});
 $("dial-back").disabled=$("aside-prev").disabled=state.selected===0;
 $("dial-forward").disabled=$("aside-next").disabled=state.selected===stages.length-1;
 $("aside-prev").textContent=state.selected>0?"← "+stages[state.selected-1].title:"← Beginning";
 $("aside-next").textContent=state.selected<6?stages[state.selected+1].title+" →":"End →";
 $("dock-title").textContent=current().title;
}
function render(){
 const s=current(),list=cards();
 $("story-title").textContent=s.title;$("story-tagline").textContent=s.tagline;$("story-intro").textContent=s.intro;
 $("story-heading").textContent=state.selected===1?"The Story of Old Sun":s.title+" · Illustrated Research Themes";
 $("section-eyebrow").textContent=state.selected===1?"EIGHT KEY MOMENTS":list.length+" INDEXED THEMES";
 $("story-guidance").textContent=state.selected===1?"Tap the + marker on any illustration for a deeper explanation and its original source.":"These source-linked themes are not an exhaustive dated sequence. Tap the + marker for notes and references.";
 $("about-title").textContent="About "+s.title;$("about-text").textContent=s.intro;
 $("next-description").textContent=state.selected<6?"Turn the time dial to move between conditions. Next: "+stages[state.selected+1].title+".":"The seventh condition of Steiner's projected sequence.";
 const facts=$("quick-facts");facts.replaceChildren();[s.trait,s.quality,"Condition "+(state.selected+1)+" of 7"].forEach((label,i)=>{const box=node("div","quick-fact");box.append(node("span","fact-icon",["✧","♧","◈"][i]),node("span","",label));facts.append(box);});
 const side=$("stage-navigation");side.replaceChildren();stages.forEach((a,i)=>{const b=node("button","stage-option"+(i===state.selected?" selected":""),a.title);b.type="button";if(i===state.selected)b.setAttribute("aria-current","step");b.addEventListener("click",()=>go(i));side.append(b);});
 renderCards(list);renderGuide(list);renderSources(list);renderDial();
}
function connect(){
 $("dial-back").addEventListener("click",()=>go(state.selected-1));$("dial-forward").addEventListener("click",()=>go(state.selected+1));$("aside-prev").addEventListener("click",()=>go(state.selected-1));$("aside-next").addEventListener("click",()=>go(state.selected+1));
 $("share").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(urlFor(current()));const t=$("toast");t.textContent="Stage link copied";t.hidden=false;setTimeout(()=>t.hidden=true,2000);}catch(e){}});
 const track=$("dial-track");
 track.addEventListener("keydown",e=>{const dir=e.key==="ArrowLeft"?-1:e.key==="ArrowRight"?1:0;if(dir){e.preventDefault();go(state.selected+dir);}else if(e.key==="Home"){e.preventDefault();go(0);}else if(e.key==="End"){e.preventDefault();go(6);}});
 track.addEventListener("pointerdown",e=>{if(e.button!==0)return;state.drag={x:e.clientX,initial:state.selected,id:e.pointerId,moved:false};});
 track.addEventListener("pointermove",e=>{if(!state.drag||state.drag.id!==e.pointerId)return;const dx=e.clientX-state.drag.x;if(Math.abs(dx)>15)state.drag.moved=true;if(!state.drag.moved)return;try{if(!track.hasPointerCapture(e.pointerId))track.setPointerCapture(e.pointerId);}catch(err){}track.classList.add("dragging");state.suppress=true;const step=Math.max(65,Math.min(144,track.clientWidth/5));const i=Math.max(0,Math.min(6,state.drag.initial-Math.round(dx/step)));if(i!==state.selected)go(i,{stay:true});});
 const end=()=>{state.drag=null;track.classList.remove("dragging");if(state.suppress)setTimeout(()=>state.suppress=false,220);};
 track.addEventListener("pointerup",end);track.addEventListener("pointercancel",end);
 window.addEventListener("popstate",()=>{const p=new URLSearchParams(location.search).get("stage");const n=stages.findIndex(s=>s.id===p);go(n<0?1:n,{history:true,stay:true,force:true});});
}
async function boot(){const p=new URLSearchParams(location.search).get("stage");const n=stages.findIndex(s=>s.id===p);if(n>=0)state.selected=n;connect();render();try{const r=await fetch(DATA,{cache:"no-cache"});if(!r.ok)throw Error(r.status);const d=await r.json();state.events=d.events||[];(d.sources||[]).forEach(s=>state.sources.set(s.id,s));render();}catch(e){$("source-caution").textContent+=" Some source details could not be loaded; try the live site."}}
document.addEventListener("DOMContentLoaded",boot);
})();