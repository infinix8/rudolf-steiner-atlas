"use strict";

// This app never downloads the full texts or scrapes the source sites.
// It indexes the project's *own classification* and opens original source pages.
const $ = (selector) => document.querySelector(selector);
const state = { data: null, paths: null, nodes: new Map(), parents: new Map(), regions: new Map(), domains: new Map(), selected: null, query: "", domainFilter: "", anchors: null, crosswalk: null, models: null, vocabulary: null, evidenceGraph: null, legacyAudit: null, trajectories: null };
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
      const synonyms = (state.vocabulary?.terms || []).filter((term) => term.target_id === n.id)
        .map((term) => term.term.toLowerCase());
      const haystack = (n.id + " " + title + " " + synonyms.join(" ") + " " +
        ancestors(n.id).map((a) => a.title).join(" ")).toLowerCase();
      if (!tokens.every((token) => haystack.includes(token))) return null;
      const score = (synonyms.includes(q) ? 85 : 0) + (title === q ? 100 : 0) + (title.startsWith(q) ? 40 : 0) +
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
  const curated = (state.anchors?.records || []).filter((rec) => lineage.some((n) => n.id === rec.topic_id));
  const located = lineage.flatMap((n) => (state.data.anchor_evidence || {})[n.id] || [])
    .filter((rec) => !curated.some((r) => r.url === rec.url));
  const sourcePanels = [];
  if (curated.length) {
    sourcePanels.push('<h3>Located original source pages <span class="badge warn">Page located</span></h3>' +
      '<p class="muted">These URLs have been opened, but the passage has not been exhaustively reviewed against the topic and translation.</p>' +
      curated.map((s) => '<div class="source"><strong>' + html(s.title) + '</strong><div class="count">' +
        html(s.source_type) + ' · GA ' + html(s.ga) +
        (s.lecture_date ? ' · ' + html(s.lecture_date) : '') + '</div>' +
        '<p class="muted">' + html(s.subject_cue) + '</p>' +
        '<div>' + link(s.url, 'Read at the original archive') + '</div></div>').join(''));
  }
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
  const matchingTopics = (state.crosswalk?.topics || []).filter((topic) =>
    topic.atlas_domains.includes(domainOf(node.id)?.id));
  if (matchingTopics.length) {
    sourcePanels.push('<h3>Existing RS Archive subject lists</h3>' +
      '<p class="muted">The archive already curates these topic bibliographies. They remain on the original site.</p>' +
      '<p>' + matchingTopics.map((topic) => link(topic.url, topic.title)).join(' · ') + '</p>');
  }
  if (!sourcePanels.length) sourcePanels.push("<p class='muted'>No specific source has yet been attached to this node. Follow its domain and the original archives as research leads.</p>");
  sourcePanels.push('<div class="line"></div><p>' + link(officialCatalog, "Official Complete Works editorial catalogue") +
    "</p><p>" + link(sourceTopicIndex, "RS Archive topic index") + "</p>");
  return sourcePanels.join("");
}
function relatedBlock(id) {
  const contextIds = new Set(ancestors(id).map((n) => n.id));
  const confirmedPairs = new Set((state.legacyAudit?.relations || [])
    .filter((audit) => audit.review_status === "matched_exact_nodes")
    .map((audit) => [audit.from,audit.to].sort().join("|")));
  const edges = (state.data.crosslinks || []).filter((edge) =>
    (contextIds.has(edge.from) || contextIds.has(edge.to)) &&
    !confirmedPairs.has([edge.from,edge.to].sort().join("|")));
  if (!edges.length) {
    const parent = parentId(id);
    return '<p class="muted">No curated direct crosslink at this level yet.' +
      (parent ? ' Explore the parent topic for broader connections.' : "") + "</p>";
  }
  return '<p class="muted">These links describe an editorially proposed relationship; each still requires passage-level support.</p><div class="related">' +
    edges.map((edge) => {
      const other = contextIds.has(edge.from) ? edge.to : edge.from;
      const inherited = edge.from !== id && edge.to !== id;
      const node = byId(other);
      return node ? '<div class="panel"><strong>' + action(other, node.title) +
        '</strong><small>' + (inherited ? 'From broader topic · ' : '') +
          html(edge.relationship || 'Related') + '</small></div>' : '';
    }).join("") + "</div>";
}
function modelBlock(id) {
  const matches = (state.models?.models || []).filter((model) => model.topic_ids.includes(id));
  if (!matches.length) return "";
  return '<section><h2>Conceptual structure & distinctions</h2>' +
    matches.map((model) => '<article class="panel concept-model"><div class="eyebrow">Original teaching · structured comparison</div>' +
      '<h3>' + html(model.title) + '</h3>' +
      '<p>' + html(model.summary) + '</p>' +
      '<p><span class="badge warn">' + html(model.status) + '</span></p>' +
      model.sections.map((section) => '<div class="table-wrap"><h3>' + html(section.title) + '</h3>' +
        '<table><thead><tr>' + section.columns.map((col) => '<th scope="col">' +
        html(col) + '</th>').join("") + '</tr></thead><tbody>' +
        section.rows.map((row) => '<tr>' + row.map((item) => '<td>' + html(item) +
        '</td>').join("") + '</tr>').join("") + '</tbody></table></div>').join("") +
      '<h3>Do not conflate</h3><ul>' + model.distinctions.map((note) => '<li>' +
      html(note) + '</li>').join("") + '</ul>' +
      '<p>' + link(model.source_url, "Read the original Steiner passage") + '</p></article>').join("") +
    '</section>';
}
function checkedGraphBlock(id) {
  const lineageIds = new Set(ancestors(id).map((n) => n.id));
  const direct = (state.evidenceGraph?.edges || []).filter((edge) =>
    edge.from === id || edge.to === id);
  const contextual = (state.evidenceGraph?.edges || []).filter((edge) =>
    !direct.includes(edge) && (lineageIds.has(edge.from) || lineageIds.has(edge.to)));
  const relevant = [...direct, ...contextual].slice(0,12);
  if (!relevant.length) return '<p class="muted">No checked passage-level relationship has been assigned directly to this topic yet. The graph is a carefully reviewed subset, not the whole taxonomy.</p>' +
    '<p><a href="graph.html">Explore the passage-linked graph →</a></p>';
  const parts = relevant.map((edge) => {
    const other = edge.from === id ? edge.to : edge.from;
    const title = byId(other)?.title || other;
    const linkId = edge.from === id ? edge.from : edge.to;
    const evidence = edge.evidence.map((e) => (state.evidenceGraph.sources.find(s => s.id === e.source_id)))
      .filter(Boolean);
    const ref = evidence.map((s) => 'GA '+s.ga).join(', ');
    return '<div class="panel" style="margin-bottom:9px">' +
      '<strong>' + action(other,title) + '</strong>' +
      '<div class="count">' + html(edge.type.replace(/_/g,' ')) + ' · '+html(ref)+'</div>'+
      '<p class="muted" style="font-size:.83rem">' + html(edge.claim) + '</p>' +
      '<a href="graph.html?focus='+encodeURIComponent(linkId)+'">Inspect sources and context ↗</a>' +
      (direct.includes(edge) ? '' : '<p class="count">Relation inherited from a broader topic</p>') +
      '</div>';
  });
  return parts.join('')+'<p><a href="graph.html?focus='+encodeURIComponent(id)+'">Explore this topic in the evidence graph →</a></p>';
}
function trajectoryLinks(id) {
  const items = (state.trajectories?.trajectories || []).filter(t =>
    t.topic_ids.includes(id));
  if (!items.length) return "";
  return '<section><h2>Compare across original works</h2>' +
    '<p class="muted">Source-context comparisons, not assumed changes in doctrine.</p>' +
    '<div class="grid">' + items.map(t =>
      '<a class="tile" href="trajectories.html?id=' + encodeURIComponent(t.id) +
      '"><span class="id">COMPARATIVE RESEARCH</span><strong>' + html(t.title) +
      '</strong><small>' + html(t.question) + '</small></a>').join("") +
    '</div></section>';
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
    '<div class="panel" style="margin-top:16px"><h2>Passage-linked relationships</h2>' + checkedGraphBlock(id) +
    '</div><div class="panel" style="margin-top:16px"><h2>Unverified proposed links</h2>' + relatedBlock(id) + "</div></aside>";
  const inside = '<div><div class="stats">' +
    '<div class="stat"><strong>' + html(id) + '</strong><span>Stable concept ID</span></div>' +
    '<div class="stat"><strong>' + countDescendants(node) + '</strong><span>Descendant entries</span></div>' +
    (domain ? '<div class="stat"><strong>Domain ' + html(domain.id) + '</strong><span>' + html(domain.title) + "</span></div>" : "") +
    '</div><div class="node-actions">' +
    (parentId(id) ? '<button class="btn" data-node="' + html(parentId(id)) + '">↑ Parent topic</button>' : "") +
    '<button class="btn" data-copy>Copy topic link</button></div>' + modelBlock(id) + trajectoryLinks(id) + hierarchy +
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
    '<p><a href="graph.html" class="btn">Explore evidence-linked knowledge graph →</a> · <a href="sources.html" class="btn">Browse the original-source guide →</a> · <a href="organs.html" class="btn">Explore organ evolution concordance →</a></p>' +
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
    '<section><h2>Bridge to the archive’s own topic lists</h2>' +
    '<p class="muted">The original archive already maintains these bibliographies. The atlas adds finer categories and cross-domain relationships, not substitute reading lists.</p>' +
    '<div class="grid">' + (state.crosswalk?.topics || []).map((topic) =>
      '<div class="panel"><strong>' + link(topic.url, topic.title) + '</strong>' +
      '<p class="count">Atlas domain links: ' + html(topic.atlas_domains.join(', ')) +
      '</p></div>').join('') + '</div></section>' +
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
    const [taxResponse, pathsResponse, anchorsResponse, crosswalkResponse, modelsResponse, vocabularyResponse, evidenceResponse, auditResponse, trajectoryResponse] = await Promise.all([
      fetch("../taxonomy/taxonomy-v1.json"),
      fetch("study-paths.json"),
      fetch("../research/primary-source-anchors.json"),
      fetch("../research/archive-topic-crosswalk.json"),
      fetch("../research/concept-models.json"),
      fetch("../research/search-vocabulary.json"),
      fetch("../research/knowledge-graph-v1.json"),
      fetch("../research/legacy-crosslink-audit.json"),
      fetch("../research/concept-trajectories-v1.json")
    ]);
    if ([taxResponse, pathsResponse, anchorsResponse, crosswalkResponse, modelsResponse, vocabularyResponse, evidenceResponse, auditResponse, trajectoryResponse].some((r) => !r.ok))
      throw new Error("One of the local data files could not be loaded.");
    [state.data, state.paths, state.anchors, state.crosswalk, state.models, state.vocabulary, state.evidenceGraph, state.legacyAudit, state.trajectories] = await Promise.all([
      taxResponse.json(), pathsResponse.json(), anchorsResponse.json(), crosswalkResponse.json(), modelsResponse.json(), vocabularyResponse.json(), evidenceResponse.json(), auditResponse.json(), trajectoryResponse.json()
    ]);
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
