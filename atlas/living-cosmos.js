const byId = (id) => document.getElementById(id);
const viewPanel = byId('view');
const inspector = byId('inspect');
const state = { view: 'spheres', node: 'jupiter', filter: 'all', shown: 8, inspectShown: 8 };

const views = {
  cosmic: ['Cosmic evolution', 'Seven embodiments of Earth evolution, from Old Saturn to Future Vulcan.'],
  spheres: ['Planetary spheres', 'Choose a present spiritual sphere. GA 110 uses the planets as markers of spiritual domains.'],
  hierarchies: ['The nine hierarchies', 'Explore how each rank develops and what Steiner describes it doing.'],
  human: ['Human microcosm', 'Choose an organ, a bodily system or an aspect of human consciousness.'],
  graph: ['Relationships', 'Follow a connection in either direction. The evidence panel gives its original direction and context.'],
  history: ['Historical evolution', 'Follow the sequence in Steiner’s esoteric chronology.'],
  evidence: ['Evidence', 'Filter connections involving the selected topic by the kind of textual support.'],
};

const planetaryLayout = [
  ['moon', 49, 70], ['mercury', 28, 58], ['venus', 32, 29],
  ['sun', 50, 50], ['mars', 69, 30], ['jupiter', 76, 57], ['saturn', 70, 79],
];
const rankGroups = [
  ['First Hierarchy', ['seraphim', 'cherubim', 'thrones']],
  ['Second Hierarchy', ['kyriotetes', 'dynamis', 'exusiai']],
  ['Third Hierarchy', ['archai', 'archangeloi', 'angeloi']],
];
const highlights = {
  jupiter: ['PS06', 'PS09', 'PS16', 'SF03', 'SF05', 'AJ09'],
  heart: ['OC01', 'OC12', 'OC17', 'OC18'],
  lungs: ['OC07', 'OC15', 'CL12'],
  liver: ['OC04', 'OC08', 'OC19'],
};
const kindLabels = {
  stage: 'Cosmic embodiment', sphere: 'Present spiritual sphere', hierarchy: 'Spiritual hierarchy',
  member: 'Human organization', organ: 'Organ or tissue', faculty: 'Soul faculty',
  process: 'Process', being: 'Spiritual being or figure', system: 'Bodily system',
  epoch: 'Epoch in Steiner’s account', zodiac: 'Zodiacal structure', oracle: 'Initiatory tradition',
};
const organLabels = { brain: 'B', lungs: 'Lu', heart: 'H', liver: 'Li' };
let graph;
let nodes;
let sources;
let adjacency;

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function link(label, href, className = '') {
  const node = element('a', className, label);
  node.href = href;
  return node;
}

function button(label, className = '') {
  const node = element('button', className, label);
  node.type = 'button';
  return node;
}

function nodeButton(id, label = nodes.get(id).label) {
  const pick = button(label, 'pick');
  pick.dataset.node = id;
  pick.setAttribute('aria-pressed', String(state.node === id));
  return pick;
}

function picks(ids) {
  const group = element('div', 'picks');
  group.append(...ids.map((id) => nodeButton(id)));
  return group;
}

function membersOf(...kinds) {
  return graph.nodes.filter((node) => kinds.includes(node.kind)).map((node) => node.id);
}

function addGroup(label, ids) {
  const section = element('section', 'rank');
  section.append(element('h3', '', label), picks(ids));
  viewPanel.append(section);
}

function renderTimeline() {
  const stageKey = state.node.replace(/^(old|future)-/, '');
  if (nodes.get(state.node).kind === 'stage') {
    const artwork = element('div', 'diagram stage-art');
    artwork.style.setProperty('--scene', `url("story-scenes/cos-${stageKey}-eight-scenes.webp")`);
    artwork.setAttribute('aria-hidden', 'true');
    viewPanel.append(artwork);
  }
  viewPanel.append(picks(membersOf('stage')));
}

function renderSpheres() {
  const diagram = element('div', 'diagram orbits');
  const star = element('span', 'focus-star', '✧');
  star.setAttribute('aria-hidden', 'true');
  diagram.append(star);
  for (const width of [32, 52, 73, 94]) {
    const ring = element('span', 'orbit');
    ring.style.setProperty('--orbit', `${width}%`);
    ring.setAttribute('aria-hidden', 'true');
    diagram.append(ring);
  }
  for (const [id, x, y] of planetaryLayout) {
    const pick = nodeButton(id);
    pick.style.setProperty('--x', `${x}%`);
    pick.style.setProperty('--y', `${y}%`);
    diagram.append(pick);
  }
  viewPanel.append(diagram);
  addGroup('Vulcan in three contexts', ['hidden-vulcan', 'vulcan-beings', 'future-vulcan']);
  addGroup('The zodiac', membersOf('zodiac'));
}

function renderHuman() {
  const figure = element('div', 'diagram figure');
  const image = element('img');
  image.src = 'media/dbcls-human-anatomy-organs.svg';
  image.alt = 'Front-view anatomy plate with interactive markers for the brain, lungs, heart and liver.';
  image.addEventListener('error', () => {
    image.addEventListener('error', () => { figure.hidden = true; }, { once: true });
    image.src = 'https://upload.wikimedia.org/wikipedia/commons/0/00/202403_human_anatomy_organs.svg';
  }, { once: true });
  figure.append(image);
  for (const node of graph.nodes.filter((item) => item.figure)) {
    const pin = nodeButton(node.id, organLabels[node.id]);
    pin.setAttribute('aria-label', node.label);
    pin.title = node.label;
    pin.style.setProperty('--x', `${node.figure[0]}%`);
    // The figure shows the upper 465 units of the 1000-unit anatomy plate.
    pin.style.setProperty('--y', `${node.figure[1] / .465}%`);
    figure.append(pin);
  }
  const credit = element('p', 'figure-caption');
  credit.append('Anatomy illustration by ', link('DBCLS / Togo Picture Gallery', 'https://commons.wikimedia.org/wiki/File:202403_human_anatomy_organs.svg'),
    ' under ', link('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'), '. Cropped, with interactive markers.');
  viewPanel.append(figure, credit);
  addGroup('Organs and tissues', membersOf('organ'));
  addGroup('Constitution', membersOf('member'));
  addGroup('Bodily systems', membersOf('system'));
  addGroup('Soul faculties', membersOf('faculty'));
}

function renderHistory() {
  const periods = membersOf('epoch');
  const atlantean = periods.filter((id) => /^atlantis-\d+$/.test(id));
  viewPanel.append(picks(periods.filter((id) => !atlantean.includes(id))));
  addGroup('Atlantean subperiods', atlantean);
  addGroup('Mystery traditions', membersOf('oracle'));
}

function orderedEdges() {
  const edges = adjacency.get(state.node) ?? [];
  const order = highlights[state.node] ?? [];
  const priority = ({ id, class: level }) => order.includes(id) ? order.indexOf(id) : order.length + (level === 'D' ? 1 : 0);
  return [...edges].sort((first, second) => priority(first) - priority(second));
}

function opposite(edge) {
  return edge.from === state.node ? edge.to : edge.from;
}

function renderGraph() {
  const diagram = element('div', 'diagram graph');
  const next = element('div', 'neighbours');
  const connections = [...new Set(orderedEdges().map(opposite))];
  next.append(...connections.slice(0, state.shown).map((id) => nodeButton(id)));
  diagram.append(element('div', 'focus-node', nodes.get(state.node).label), next);
  viewPanel.append(diagram);
  if (connections.length > state.shown) {
    const more = button('Show more connected topics', 'pick');
    more.dataset.more = 'view';
    viewPanel.append(more);
  }
}

function sourceList(edge) {
  const list = element('ul');
  for (const citation of edge.evidence) {
    const source = sources.get(citation.source);
    const item = element('li');
    const section = /[–,]/.test(citation.location) ? '§§' : '§';
    const anchor = link(`GA ${source.ga} · ${section}${citation.location}`, source.url);
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    item.append(anchor, element('div', 'citation-note', [source.title, source.date, source.language === 'de' ? 'German' : 'English'].filter(Boolean).join(' · ')));
    list.append(item);
  }
  return list;
}

function edgeDetails(edge, inEvidenceView) {
  const detail = element('details', 'edge');
  detail.id = `${inEvidenceView ? 'evidence' : 'topic'}-${edge.id}`;
  detail.dataset.class = edge.class;
  const title = `${nodes.get(edge.from).label} · ${edge.type.replaceAll('_', ' ')} · ${nodes.get(edge.to).label}`;
  const summary = element('summary', '', title);
  const body = element('div', 'edge-body');
  body.append(element('div', 'edge-class', `${graph.evidence_classes[edge.class]} · ${edge.context}`),
    element('p', '', edge.claim), element('p', 'qualifier', edge.qualification), sourceList(edge),
    nodeButton(opposite(edge), `Explore ${nodes.get(opposite(edge)).label}`));
  detail.append(summary, body);
  return detail;
}

function showEdges(panel, edges, limit, inEvidenceView) {
  const list = element('div', 'edge-list');
  list.append(...edges.slice(0, limit).map((edge) => edgeDetails(edge, inEvidenceView)));
  panel.append(list);
  if (!edges.length) panel.append(element('p', 'hint', 'No relationships in this selection.'));
  if (edges.length > limit) {
    const more = button(`Show more of ${edges.length} relationships`, 'pick more');
    more.dataset.more = inEvidenceView ? 'view' : 'inspector';
    panel.append(more);
  }
}

function renderEvidence() {
  const filters = element('div', 'filter-row');
  const select = element('select', 'filter');
  select.id = 'class-filter';
  const label = element('label', '', 'Textual support');
  label.htmlFor = select.id;
  for (const [key, title] of Object.entries({ all: 'All relationships', ...graph.evidence_classes })) {
    const option = element('option', '', title);
    option.value = key;
    select.append(option);
  }
  select.value = state.filter;
  select.addEventListener('change', () => {
    state.filter = select.value;
    state.shown = 8;
    renderView();
    byId(select.id).focus();
  });
  filters.append(label, select);
  viewPanel.append(filters);
  showEdges(viewPanel, orderedEdges().filter((edge) => state.filter === 'all' || edge.class === state.filter), state.shown, true);
}

const renderers = {
  cosmic: renderTimeline,
  spheres: renderSpheres,
  hierarchies: () => rankGroups.forEach(([label, ids]) => addGroup(label, ids)),
  human: renderHuman,
  graph: renderGraph,
  history: renderHistory,
  evidence: renderEvidence,
};

function renderView() {
  const [title, hint] = views[state.view];
  const open = new Set([...viewPanel.querySelectorAll('details[open]')].map((node) => node.id));
  viewPanel.replaceChildren(element('h2', '', title), element('p', 'hint', hint));
  renderers[state.view]();
  for (const id of open) {
    const item = byId(id);
    if (item) item.open = true;
  }
}

function renderInspector() {
  const node = nodes.get(state.node);
  const open = new Set([...inspector.querySelectorAll('details[open]')].map((item) => item.id));
  inspector.replaceChildren(element('div', 'edge-class', kindLabels[node.kind]), element('h2', '', node.label));
  if (node.route) inspector.append(link('Open the related Atlas page ↗', node.route, 'route'));
  if (state.view === 'evidence') {
    inspector.append(element('p', 'hint', 'Open a relationship to read the claim, its context and the underlying Steiner passages.'));
    return;
  }
  showEdges(inspector, orderedEdges(), state.inspectShown, false);
  for (const id of open) {
    const item = byId(id);
    if (item) item.open = true;
  }
}

function render() {
  for (const tab of document.querySelectorAll('[data-view]')) {
    tab.href = `?view=${tab.dataset.view}&node=${state.node}#explorer`;
    if (tab.dataset.view === state.view) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  byId('selection').textContent = nodes.get(state.node).label;
  renderView();
  renderInspector();
  byId('status').textContent = `${nodes.get(state.node).label}. ${orderedEdges().length} documented relationships.`;
}

function readLocation() {
  const params = new URLSearchParams(location.search);
  const view = params.get('view');
  const node = params.get('node');
  state.view = Object.hasOwn(views, view) ? view : 'spheres';
  state.node = adjacency.has(node) ? node : 'jupiter';
  state.shown = state.inspectShown = 8;
  state.filter = 'all';
}

function navigate(view, node) {
  if (view === state.view && node === state.node) return;
  Object.assign(state, { view, node, filter: 'all', shown: 8, inspectShown: 8 });
  const url = new URL(location.href);
  url.searchParams.set('view', view);
  url.searchParams.set('node', node);
  url.hash = 'explorer';
  history.pushState(null, '', url);
  render();
}

function focusPanelHeading() {
  const heading = inspector.querySelector('h2');
  heading.tabIndex = -1;
  heading.focus();
}

function handleClick(event) {
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  const tab = event.target.closest('[data-view]');
  const pick = event.target.closest('[data-node]');
  const more = event.target.closest('[data-more]');
  if (tab) {
    event.preventDefault();
    navigate(tab.dataset.view, state.node);
  } else if (pick) {
    const fromDetails = Boolean(pick.closest('.edge'));
    navigate(state.view, pick.dataset.node);
    const candidates = [...viewPanel.querySelectorAll('[data-node]')];
    const replacement = candidates.find((item) => item.dataset.node === state.node);
    if (fromDetails || !replacement) focusPanelHeading();
    else replacement.focus({ preventScroll: true });
  } else if (more) {
    const inInspector = more.dataset.more === 'inspector';
    const panel = inInspector ? inspector : viewPanel;
    const firstNew = inInspector ? state.inspectShown : state.shown;
    if (inInspector) state.inspectShown += 8;
    else state.shown += 8;
    if (inInspector) renderInspector();
    else renderView();
    const newItems = panel.querySelectorAll('.edge summary, .neighbours .pick');
    newItems[firstNew]?.focus();
  }
}

function setUpSearch() {
  const input = byId('jump');
  const options = graph.nodes.filter((node) => adjacency.has(node.id));
  byId('topics').append(...options.map((node) => {
    const option = element('option');
    option.value = node.label;
    return option;
  }));
  input.addEventListener('input', () => input.setCustomValidity(''));
  byId('jump-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim().toLowerCase();
    const result = options.find((node) => node.label.toLowerCase() === query || node.id === query)
      ?? options.find((node) => query && node.label.toLowerCase().includes(query));
    if (!result) {
      input.setCustomValidity('Try one of the topics in the suggestion list.');
      input.reportValidity();
      return;
    }
    input.value = '';
    navigate(state.view, result.id);
    focusPanelHeading();
  });
}

async function start() {
  const response = await fetch('../docs/research/unified-macrocosm-microcosm/KNOWLEDGE_GRAPH.json');
  if (!response.ok) throw Error(`Graph request failed (${response.status})`);
  graph = await response.json();
  nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  sources = new Map(graph.sources.map((source) => [source.id, source]));
  adjacency = new Map();
  for (const edge of graph.edges) {
    for (const id of new Set([edge.from, edge.to])) {
      if (!adjacency.has(id)) adjacency.set(id, []);
      adjacency.get(id).push(edge);
    }
  }
  readLocation();
  render();
  setUpSearch();
  byId('explorer').addEventListener('click', handleClick);
  window.addEventListener('popstate', () => {
    readLocation();
    render();
  });
}

start().catch((error) => {
  console.error(error);
  viewPanel.replaceChildren(element('h2', '', 'Explorer unavailable'),
    element('p', '', 'Reload to try again, or open the research manuscript below.'));
});
