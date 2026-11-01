"use strict";

// This app never downloads the full texts or scrapes the source sites.
// It indexes the project's *own classification* and opens original source pages.
const $ = (selector) => document.querySelector(selector);
const state = { data: null, paths: null, nodes: new Map(), parents: new Map(), regions: new Map(), domains: new Map(), selected: null, query: "", domainFilter: "" };
const html = (input) => String(input ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const knownSource = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && (
      parsed.hostname === "rsarchive.org" || parsed.hostname === "www.rsarchive.org" ||
      parsed.hostname === "www.rudolf-steiner.com" || parsed.hostname === "rudolf-steiner.com"
    );
  } catch (_) { return false; }
};
const link = (url, label) => knownSource(url)
  ? '<a href="' + html(url) + '" target="_blank" rel="noopener noreferrer">' + html(label) + ' ↗</a>'
  : '<span class="muted">' + html(label) + " (link requires verification)</span>";
const action = (id, label, className = "inline-link") => '<button type="button" class="' + className + '" data-node="' + html(id) + '">' + html(label) + "</button>";
const byId = (id) => state.nodes.get(id);
const parentId = (id) => state.parents.get(id);
const ancestors = (id) => {
  const result = [];
  let cursor = id;
  while (cursor && state.nodes.has(cursor)) {
    result.unshift(state.nodes.get(cursor));
    cursor = parentId(cursor);
  }
  return result;
};
const domainOf = (id) => ancestors(id).find((node) => /^[0-9]{2}$/.test(node.id));
const regionOf = (id) => ancestors(id)[0] ?? null;
const countDescendants = (node) => (node.children || []).reduce((sum, child) => sum + 1 + countDescendants(child), 0);
const sourceTopicIndex = "https://rsarchive.org/Topics.html";
const sourceGAIndex = "https://rsarchive.org/Volumes.html";
const officialCatalog = "https://www.rudolf-steiner.com/en/edition-englisch/complete-works/";

function indexData(data) {
  function visit(node, parent = null, region = null, domain = null) {
    if (!node || !node.id || state.nodes.has(node.id)) throw new Error("Invalid or repeated taxonomy ID: " + node?.id);
    state.nodes.set(node.id, node);
    state.parents.set(node.id, parent);
    if (region) state.regions.set(node.id, region);
    if (domain) state.domains.set(node.id, domain);
    const nextRegion = !parent ? node.id : region;
    const nextDomain = /^[0-9]{2}$/.test(node.id) ? node.id : domain;
    for (const child of node.children || []) visit(child, node.id, nextRegion, nextDomain);
  }
  data.tree.forEach((node) => visit(node));
}
function setLocation(kind, id = "") {
  const value = kind === "home" ? "" : kind + "=" + encodeURIComponent(id);
  if (window.location.hash.slice(1) !== value) window.location.hash = value;
  else render();
}
function readLocation() {
  const hash = location.hash.slice(1);
  try {
    const sep = hash.indexOf("=");
    if (sep < 0) return { kind: "home" };
    return { kind: hash.slice(0, sep), id: decodeURIComponent(hash.slice(sep + 1)) };
  } catch (_) { return { kind: "home" }; }
}
function card(id, extra = "") {
  const node = byId(id);
  if (!node) return "";
  const childCount = countDescendants(node);
  return '<button type="button" class="tile" data-node="' + html(id) + '">' +
    '<span class="id">' + html(id) + "</span>" +
    "<strong>" + html(node.title) + "</strong>" +
    (extra ? "<small>" + html(extra) + "</small>" : childCount ? '<small>' + childCount + ' nested concepts</small>' : "") +
    "</button>";
}
function renderNav() {
  $("#domain-filter").innerHTML = '<option value="">All 26 domains</option>' +
    [...state.nodes.values()].filter((n) => /^[0-9]{2}$/.test(n.id)).map((n) =>
      '<option value="' + html(n.id) + '">' + html(n.id + " · " + n.title) + "</option>").join("");
  $("#region-nav").innerHTML = state.data.tree.map((node) =>
    '<button type="button" class="region-link" data-node="' + html(node.id) +
    '"><span class="region-index">' + html(node.id) + "</span>" + html(node.title) + "</button>").join("");
}
function renderSearch() {
  const container = $("#search-results");
  const q = state.query.trim().toLowerCase();
  if (!q) { container.innerHTML = ""; return; }
  const tokens = q.split(/\s+/).filter(Boolean);
  const hits = [...state.nodes.values()]
    .filter((n) => !state.domainFilter || n.id === state.domainFilter || state.domains.get(n.id) === state.domainFilter)
    .map((n) => {
      const title = n.title.toLowerCase();
      const haystack = (n.id + " " + title + " " + ancestors(n.id).map((a) => a.title).join(" ")).toLowerCase();
      if (!tokens.every((token) => haystack.includes(token))) return null;
      const score = (title === q ? 100 : 0) + (title.startsWith(q) ? 40 : 0) +
        (title.includes(q) ? 15 : 0) + (n.id.toLowerCase() === q ? 150 : 0) -
        Math.max(0, ancestors(n.id).length - 2);
      return { node: n, score };
    })
    .filter(Boolean).sort((a, b) => b.score - a.score || a.node.title.localeCompare(b.node.title))
    .slice(0, 50);
  container.innerHTML = hits.length
    ? '<div class="count">' + hits.length + ' displayed' + (hits.length === 50 ? " (limit 50)" : "") + '</div>' +
      hits.map(({ node }) => '<button type="button" class="result-button" data-node="' + html(node.id) + '">' +
        html(node.title) + "<small>" + html(node.id + " · " + (domainOf(node.id)?.title || "Knowledge region")) + "</small></button>").join("")
    : '<p class="empty">No matching concepts. Try a shorter phrase.</p>';
}
function sourceBlock(node) {
  const lineage = ancestors(node.id);
  const leads = lineage.filter((n) => /^[0-9]{2}$/.test(n.id)).flatMap((n) => n.ga || []);
  const uniqueLeads = [...new Set(leads)];
  const located = lineage.flatMap((n) => (state.data.anchor_evidence || {})[n.id] || []);
  const sourcePanels = [];
  if (located.length) {
    sourcePanels.push('<h3>Located passage links <span class="badge warn">Not fully audited</span></h3>' +
      '<p class="muted">These are recorded exact-page links associated with this topic or an ancestor. Exact passages and translations still require review.</p>' +
      located.map((s) => '<div class="source"><strong>' + html(s.section || "Source chapter / lecture") +
      '</strong><small>GA ' + html(s.ga) + " · " + html(s.type || "record") + '</small><div>' +
      link(s.url, "Read at RS Archive") + "</div></div>").join(""));
  }
  if (uniqueLeads.length) {
    sourcePanels.push("<h3>GA research leads</h3><p class='muted'>These are candidate volumes associated with this domain, <strong>not verified citations for this individual concept</strong>.</p>" +
      '<p>' + uniqueLeads.map((ga) => '<span class="badge grey">GA ' + html(ga) + "</span>").join(" ") + "</p>" +
      "<p>" + link(sourceGAIndex, "Browse GA volumes at RS Archive") + "</p>");
  }
  if (!sourcePanels.length) sourcePanels.push("<p class='muted'>No specific source has yet been attached to this node. Follow its domain and the original archives as research leads.</p>");
  sourcePanels.push('<div class="line"></div><p>' + link(officialCatalog, "Official Complete Works editorial catalogue") +
    "</p><p>" + link(sourceTopicIndex, "RS Archive topic index") + "</p>");
  return sourcePanels.join("");
}
function relatedBlock(id) {
  const edges = (state.data.crosslinks || []).filter((edge) => edge.from === id || edge.to === id);
  if (!edges.length) {
    const parent = parentId(id);
    return '<p class="muted">No curated direct crosslink at this level yet.' +
      (parent ? ' Explore the parent topic for broader connections.' : "") + "</p>";
  }
  return '<p class="muted">These links describe an editorially proposed relationship; each still requires passage-level support.</p><div class="related">' +
    edges.map((edge) => {
      const other = edge.from === id ? edge.to : edge.from;
      const node = byId(other);
      return node ? '<div class="panel"><strong>' + action(other, node.title) +
        "</strong><small>" + html(edge.relationship || "Related") + "</small></div>" : "";
    }).join("") + "</div>";
}
function nodePage(id) {
  const node = byId(id);
  const lineage = ancestors(id);
  const children = node.children || [];
  const domain = domainOf(id);
  const region = regionOf(id);
  const heading = '<p class="eyebrow">' + html(region?.title || "Knowledge map") +
    '</p><h1>' + html(node.title) + '</h1><p class="intro">Explore the hierarchy around this concept and use the source leads to continue reading in Rudolf Steiner’s own texts.</p>';
  const hierarchy = children.length
    ? '<section><div class="section-heading"><h2>Explore deeper</h2><span class="badge">' +
      children.length + " branches</span></div><div class='grid'>" + children.map((n) => card(n.id)).join("") + "</div></section>"
    : "<section class='caution'>This is a classification entry, not a rewritten lecture. Further explanation will be attached only when a specific original passage has been checked.</section>";
  const siblings = parentId(id) ? (byId(parentId(id))?.children || []).filter((n) => n.id !== id).slice(0, 7) : [];
  const aside = '<aside><div class="panel"><h2>Read at the source</h2>' + sourceBlock(node) + '</div>' +
    '<div class="panel" style="margin-top:16px"><h2>Connections</h2>' + relatedBlock(id) + "</div></aside>";
  const inside = '<div><div class="stats">' +
    '<div class="stat"><strong>' + html(id) + '</strong><span>Stable concept ID</span></div>' +
    '<div class="stat"><strong>' + countDescendants(node) + '</strong><span>Descendant entries</span></div>' +
    (domain ? '<div class="stat"><strong>Domain ' + html(domain.id) + '</strong><span>' + html(domain.title) + "</span></div>" : "") +
    '</div><div class="node-actions">' +
    (parentId(id) ? '<button class="btn" data-node="' + html(parentId(id)) + '">↑ Parent topic</button>' : "") +
    '<button class="btn" data-copy>Copy topic link</button></div>' + hierarchy +
    (siblings.length ? '<section><h2>Nearby concepts</h2><div class="grid">' + siblings.map((s) => card(s.id)).join("") + "</div></section>" : "") + "</div>";
  return heading + '<div class="two-col">' + inside + aside + "</div>";
}
function homePage() {
  const nodes = [...state.nodes.values()];
  const domains = nodes.filter((n) => /^[0-9]{2}$/.test(n.id));
  const paths = state.paths?.paths || [];
  return '<p class="eyebrow">Explore · Connect · Return to Steiner</p>' +
    "<h1>Find the teaching, then read the original.</h1>" +
    '<p class="intro">This atlas complements the existing archives: it classifies concepts at finer depth and reveals relationships between subjects. It does not reproduce their full books, lectures, or independent bibliographic work.</p>' +
    '<div class="stats"><div class="stat"><strong>6</strong><span>Knowledge regions</span></div>' +
    '<div class="stat"><strong>' + domains.length + '</strong><span>Thematic domains</span></div>' +
    '<div class="stat"><strong>' + nodes.length.toLocaleString() + '</strong><span>Indexed nodes</span></div>' +
    '<div class="stat"><strong>' + (state.data.crosslinks || []).length + '</strong><span>Initial crosslinks</span></div></div>' +
    '<div class="caution"><strong>Research status:</strong> This is a breadth-first, editor-created classification. Volume references are research leads; not all links or proposed relationships have been checked at passage level.</div>' +
    '<section><div class="section-heading"><h2>Six knowledge regions</h2><span class="badge">Browse the hierarchy</span></div>' +
    '<div class="grid">' + state.data.tree.map((n) => card(n.id)).join("") + "</div></section>" +
    '<section><div class="section-heading"><h2>Guided connections</h2><span class="badge warn">Editorial routes</span></div>' +
    '<p class="muted">These pathways help you discover connections across domains; they are not presented as Steiner-authored sequences.</p>' +
    '<div class="grid">' + paths.map((p) => '<button type="button" class="tile" data-path="' + html(p.id) + '">' +
    '<span class="id">STUDY PATH</span><strong>' + html(p.title) + '</strong><small>' +
    html(p.description) + "</small></button>").join("") + "</div></section>" +
    '<section><h2>Where the original texts live</h2><div class="grid">' +
    '<div class="panel"><h3>Rudolf Steiner Archive</h3><p>Read texts, browse existing topics, search works, GA numbers and lecture dates.</p>' +
    "<p>" + link(sourceGAIndex, "Browse source volumes") + "</p></div>" +
    '<div class="panel"><h3>Rudolf Steiner Archiv (Dornach)</h3><p>Consult editorial, bibliographic and Complete Works context; distinguish primary manuscripts and recorded lectures.</p>' +
    "<p>" + link(officialCatalog, "Open Complete Works catalogue") + "</p></div></div></section>";
}
function pathPage(id) {
  const path = (state.paths?.paths || []).find((p) => p.id === id);
  if (!path) return '<p class="empty">Study path not found.</p>';
  return '<p class="eyebrow">Editorial study route · not a Steiner-authored sequence</p><h1>' +
    html(path.title) + "</h1><p class='intro'>" + html(path.description) + "</p>" +
    '<div class="caution">This path is a navigational hypothesis. Visit the linked concepts and follow their original-source leads before treating a relationship as a documented teaching.</div>' +
    '<div class="two-col"><section><h2>Follow the concepts</h2><ol class="route-steps">' +
    path.nodes.filter((id) => byId(id)).map((id) => '<li>' + action(id, byId(id).title) +
    "<small>" + html(id + " · " + (domainOf(id)?.title || "Knowledge region")) + "</small></li>").join("") +
    '</ol><button class="btn" data-home>← All regions and routes</button></section>' +
    '<aside class="panel"><h2>Primary source resources</h2>' + link(sourceGAIndex, "GA volume catalogue") +
    "<p>" + link(officialCatalog, "Editorial Complete Works") + "</p></aside></div>";
}
function renderBreadcrumbs(mode) {
  if (mode.kind === "node" && byId(mode.id)) {
    $("#breadcrumbs").innerHTML = '<button data-home>Atlas</button> / ' +
      ancestors(mode.id).map((n) => '<button data-node="' + html(n.id) + '">' + html(n.title) + "</button>").join(" / ");
    return;
  }
  $("#breadcrumbs").innerHTML = mode.kind === "path" ? '<button data-home>Atlas</button> / Study path' : "";
}
function render() {
  const mode = readLocation();
  renderBreadcrumbs(mode);
  for (const element of document.querySelectorAll(".region-link")) {
    const selectedRegion = mode.kind === "node" && byId(mode.id) ? regionOf(mode.id)?.id : "";
    element.classList.toggle("active", element.dataset.node === selectedRegion);
  }
  const view = $("#main-view");
  if (mode.kind === "node" && byId(mode.id)) view.innerHTML = nodePage(mode.id);
  else if (mode.kind === "path") view.innerHTML = pathPage(mode.id);
  else view.innerHTML = homePage();
  document.title = (mode.kind === "node" && byId(mode.id) ? byId(mode.id).title + " · " : "") + "Rudolf Steiner Atlas";
}
async function initialize() {
  try {
    const [taxResponse, pathsResponse] = await Promise.all([
      fetch("../taxonomy/taxonomy-v1.json"),
      fetch("study-paths.json")
    ]);
    if (!taxResponse.ok || !pathsResponse.ok) throw new Error("One of the local JSON files could not be loaded.");
    state.data = await taxResponse.json();
    state.paths = await pathsResponse.json();
    indexData(state.data);
    renderNav();
    renderSearch();
    render();
    window.addEventListener("hashchange", render);
    $("#search").addEventListener("input", (e) => { state.query = e.target.value; renderSearch(); });
    $("#domain-filter").addEventListener("change", (e) => { state.domainFilter = e.target.value; renderSearch(); });
    document.addEventListener("click", (e) => {
      const node = e.target.closest("[data-node]");
      const path = e.target.closest("[data-path]");
      if (node) { setLocation("node", node.dataset.node); document.querySelector("#content")?.focus(); }
      else if (path) { setLocation("path", path.dataset.path); document.querySelector("#content")?.focus(); }
      else if (e.target.closest("[data-home]")) setLocation("home");
      else if (e.target.closest("[data-copy]")) {
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(location.href).then(() => {
          const button = document.querySelector("[data-copy]");
          if (button) button.textContent = "Link copied";
        }).catch(() => {});
      }
    });
  } catch (error) {
    $("#main-view").innerHTML = '<h1>Could not load the atlas</h1><p>' + html(error.message) +
      '</p><p>Run a local HTTP server from the repository root: <code>python -m http.server 8000</code>, then open <code>http://localhost:8000/atlas/</code>.</p>';
  }
}
initialize();
