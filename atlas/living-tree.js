const get = (id) => document.getElementById(id);
const detail = get('tree-detail');
const navigation = get('tree-concepts');
const search = get('tree-search');
const layer = get('tree-layer');
const evidence = get('tree-evidence');
const dimensions = {
  origins: 'Spiritual origins',
  cosmos: 'The differentiated cosmos',
  human: 'Manifestation and the human being',
  evolution: 'Cosmic evolution and spiritual biography',
  participation: 'Freedom, love and creative participation',
};
const grades = { 'D-S': 'Direct Steiner account', S: 'Contextual reading', C: 'Comparative reading' };
let data;
let concepts;
let selectedLane;
let localIndex;

function element(tag, label, className) {
  const node = document.createElement(tag);
  if (label) node.textContent = label;
  if (className) node.className = className;
  return node;
}

function link(label, href, className) {
  const node = element('a', label, className);
  node.href = href;
  return node;
}

function conceptURL(id) {
  const params = new URLSearchParams({ concept: id });
  if (layer.value === 'comparison' || id === 'TIP') params.set('layer', 'comparison');
  return '?' + params + '#tree-detail';
}

function visibleRelations() {
  const active = data.layers.find((item) => item.id === layer.value);
  return data.relations.filter((r) =>
    active.traditions.includes(r.tradition) && (!evidence.value || evidence.value === r.grade));
}

function queryTerms(text) {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/\bga\s*(0*)(\d+)/g, 'ga$2').trim().split(/\s+/).filter(Boolean);
}

function rebuildNavigation(visible, id) {
  navigation.replaceChildren();
  const terms = queryTerms(search.value);
  const eligible = new Set(visible.flatMap((relation) => relation.concepts));
  const results = data.concepts.filter((concept) => eligible.has(concept.id) &&
    terms.every((term) => localIndex.get(concept.id).includes(term)));
  for (const [key, title] of Object.entries(dimensions)) {
    const matches = results.filter((concept) => concept.dimension === key);
    if (!matches.length) continue;
    const group = element('ul');
    for (const concept of matches) {
      const item = element('li');
      const target = link(concept.label, conceptURL(concept.id));
      if (concept.id === id) target.setAttribute('aria-current', 'page');
      item.append(target);
      group.append(item);
    }
    navigation.append(element('h3', title), group);
  }
  if (!results.length) navigation.append(element('p', 'No concepts match these filters.'));
  get('tree-status').textContent = results.length + (results.length === 1 ? ' concept shown' : ' concepts shown');
}

function relationshipStep(relation) {
  const item = element('li', null, 'tree-step');
  item.dataset.predicate = relation.predicate;
  const fields = element('dl');
  for (const [label, value] of [
    ...(relation.origin ? [['Origin of what is received', relation.origin]] : []),
    [relation.role_label || 'Acting or receiving participant', relation.actor],
    ['Recipient or field', relation.recipient],
    ['Result described', relation.result],
  ]) {
    const field = element('div');
    field.append(element('dt', label), element('dd', value));
    fields.append(field);
  }
  item.append(fields, element('p', [relation.stage, relation.locator, grades[relation.grade], relation.id].filter(Boolean).join(' · '), 'hint'));
  return item;
}

function showLane(target, lane, relations) {
  const source = data.sources[lane.source];
  const title = [source.ga, source.date].filter(Boolean).join(' · ') || 'Published reference';
  target.replaceChildren(element('h3', lane.label), element('p', lane.stage, 'hint'));
  target.dataset.tradition = relations[0].tradition;
  const list = element('ul', null, 'tree-steps');
  list.append(...relations.map(relationshipStep));
  target.append(list, element('p', lane.limitation, 'hint'), link(title + ' · ' + source.title, source.url, 'tree-link'));
  const related = [...new Set(relations.flatMap((relation) => relation.concepts))]
    .filter((id) => id !== currentConcept().id);
  if (!related.length) return;
  const links = element('div', null, 'picks');
  links.append(...related.map((id) => link(concepts.get(id).label, conceptURL(id), 'pick')));
  target.append(element('h3', 'Follow a related concept', 'tree-related'), links);
}

function currentConcept() {
  const id = new URLSearchParams(location.search).get('concept');
  const concept = concepts.get(id);
  return concept && (concept.id !== 'TIP' || layer.value === 'comparison') ? concept : concepts.get('thrones');
}

function render() {
  const concept = currentConcept();
  const visible = visibleRelations();
  rebuildNavigation(visible, concept.id);
  const title = element('h2', concept.label);
  detail.replaceChildren(title, element('p', concept.overview, 'tree-overview'),
    element('p', concept.explanation, 'tree-explanation'));
  if (concept.route) detail.append(link('Open the Atlas dossier', concept.route, 'tree-link'));
  const relevant = new Set(visible.filter((relation) => relation.concepts.includes(concept.id)).map((r) => r.lane));
  const lanes = data.lanes.filter((lane) => relevant.has(lane.id));
  detail.append(element('h3', 'Explore the source accounts'));
  if (!lanes.length) {
    detail.append(element('p', 'No source accounts match the current evidence filter.'));
    return;
  }
  if (!relevant.has(selectedLane)) selectedLane = lanes[0].id;
  const controls = element('div', null, 'picks tree-lanes');
  const panel = element('section', null, 'tree-lane');
  panel.id = 'tree-account';
  for (const lane of lanes) {
    const button = element('button', lane.label, 'pick');
    button.type = 'button';
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-pressed', String(lane.id === selectedLane));
    button.addEventListener('click', () => {
      selectedLane = lane.id;
      for (const sibling of controls.children) sibling.setAttribute('aria-pressed', String(sibling === button));
      showLane(panel, lane, visible.filter((r) => r.lane === lane.id));
    });
    controls.append(button);
  }
  const lane = lanes.find((item) => item.id === selectedLane);
  showLane(panel, lane, visible.filter((r) => r.lane === lane.id));
  detail.append(controls, panel);
  if (concept.open_question) {
    const question = element('details', null, 'tree-question');
    question.append(element('summary', 'Open question'), element('p', concept.open_question));
    detail.append(question);
  }
}

function indexConcept(concept) {
  const relationships = data.relations.filter((r) => r.concepts.includes(concept.id));
  const terms = relationships.flatMap((r) => {
    const lane = data.lanes.find((entry) => entry.id === r.lane);
    const source = data.sources[lane.source];
    return [r.id, ...r.inherited_ids, r.predicate.replaceAll('_', ' '), r.actor, r.recipient,
      lane.label, lane.stage, source.ga, source.date, source.title];
  });
  return queryTerms([concept.id, concept.label, ...concept.aliases, ...terms].join(' ')).join(' ');
}

async function start() {
  const response = await fetch('data/living-tree-public.json');
  if (!response.ok) throw new Error('Missing Living Tree data');
  data = await response.json();
  concepts = new Map(data.concepts.map((concept) => [concept.id, concept]));
  localIndex = new Map(data.concepts.map((concept) => [concept.id, indexConcept(concept)]));
  const params = new URLSearchParams(location.search);
  layer.append(...data.layers.map((item) => new Option(item.label, item.id)));
  layer.value = params.get('layer') === 'comparison' || params.get('concept') === 'TIP' ? 'comparison' : 'steiner';
  search.addEventListener('input', () => rebuildNavigation(visibleRelations(), currentConcept().id));
  evidence.addEventListener('change', render);
  layer.addEventListener('change', () => {
    history.replaceState(null, '', conceptURL(currentConcept().id));
    render();
  });
  render();
  if (location.hash === '#tree-detail') detail.scrollIntoView({block: 'start'});
}

start().catch(() => {
  navigation.replaceChildren(element('p', 'The Living Tree data could not be loaded.'));
  detail.append(link('Continue in the Living Cosmos', 'living-cosmos.html', 'tree-link'));
});
