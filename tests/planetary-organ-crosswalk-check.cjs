const fs=require("node:fs"), assert=require("node:assert/strict");
const x=JSON.parse(fs.readFileSync("research/planetary-organ-crosswalk-v1.json","utf8"));
const p=JSON.parse(fs.readFileSync("research/planetary-spheres-v1.json","utf8"));
const body=JSON.parse(fs.readFileSync("research/organ-body-map-v1.json","utf8"));
const ds=JSON.parse(fs.readFileSync("research/organ-comparative-dossiers-v29.json","utf8"));
const allOrganIds=new Set(ds.dossiers.map(d=>d.id));
const sourceIds=new Set(Object.keys(x.sources));
assert.equal(x.mappings.length,7);assert.equal(new Set(x.mappings.map(m=>m.planet)).size,7);
assert.equal(new Set(x.mappings.map(m=>m.organId)).size,7);
assert(x.mappings.every(m=>p.planets.some(y=>y.id===m.planet)&&allOrganIds.has(m.organId)));
assert.equal(x.mappings.filter(m=>m.organId==="organ-gallbladder"&&m.route.startsWith("organs.html")).length,1);
for(const m of x.mappings){for(const s of m.sourceIds)assert(sourceIds.has(s));assert(m.route.includes("organ="+m.organId));assert(m.body.length>=2);}
assert(!x.mappings.some(m=>m.planet==="vulcan"));
assert.equal(x.systemFrameworks.length,4);
for(const s of x.systemFrameworks){for(const id of s.sourceIds)assert(sourceIds.has(id));for(const planet of s.planetIds)assert(p.planets.some(z=>z.id===planet));}
for(const u of Object.values(x.sources))assert(/^https:\/\/rsarchive\.org\//.test(u.url));
assert.equal(x.mappings.filter(m=>body.organs.some(o=>o.id===m.organId)).length,6);
for(const path of ["atlas/planetary-organs.html","atlas/planetary-organs.js","atlas/planetary-organs.css","docs/PLANETARY_ORGAN_RESEARCH_V1.md"])assert(fs.statSync(path).size>500);
const js=fs.readFileSync("atlas/planetary-organs.js","utf8");assert(js.includes('id=>"')===false);
console.log("Planetary–organ integrity: seven pairs, four systems, seven canonical organ dossiers, no Vulcan invention; checked.");