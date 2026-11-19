
const fs=require("node:fs");
const assert=require("node:assert/strict");
const data=JSON.parse(fs.readFileSync("research/planetary-spheres-v1.json","utf8"));
assert.equal(data.planets.length,8);assert.equal(new Set(data.planets.map(p=>p.id)).size,8);
const sources=new Set(Object.keys(data.sources));
for(const p of data.planets){assert.equal(p.lenses.length,3);assert.equal(p.insights.length,3);for(const lens of p.lenses)for(const id of lens.refs)assert(sources.has(id));for(const note of p.insights)for(const id of note.sourceIds)assert(sources.has(id));}
for(const c of data.connections){assert(data.planets.some(p=>p.id===c.from));assert(data.planets.some(p=>p.id===c.to));assert(["direct","synthesis"].includes(c.kind));for(const id of c.refs)assert(sources.has(id));}
for(const route of data.studyGuide.pathways){for(const id of route.planets)assert(data.planets.some(p=>p.id===id));for(const id of route.refs)assert(sources.has(id));}
for(const name of ["planetary-spheres.html","planetary-sphere.html","planetary-comparison.html"]){const h=fs.readFileSync("atlas/"+name,"utf8");assert(h.includes("planetary-spheres.js"));assert(h.includes("planetary-spheres.css"));}
console.log("Planetary Atlas v2: 8 spheres, 3 lenses each, "+data.planets.reduce((n,p)=>n+p.insights.length,0)+" evidence notes, "+data.connections.length+" links, "+data.studyGuide.pathways.length+" paths; schema okay.");
