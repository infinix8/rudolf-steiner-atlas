const researchRoot = '../docs/research/unified-macrocosm-microcosm/';
const groups = [
  ['spirit', 'Spiritual hierarchies and beings', ['spheres', 'intelligence', 'hierarchies']],
  ['cosmic', 'Cosmic evolution', ['cosmic']],
  ['history', 'Human history and mysteries', ['history', 'sun-christ']],
  ['journey', 'Life between death and rebirth', ['journey']],
  ['faculties', 'Human faculties and soul life', ['constitution', 'soul']],
  ['body', 'Body systems and organs', ['organs', 'comparisons']],
  ['blood', 'Blood and warmth', []],
  ['metals', 'Metals and substances', []],
];

function element(tag, label, className) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (label) item.textContent = label;
  return item;
}

function anchor(label, href) {
  const item = element('a', label);
  item.href = href;
  return item;
}

async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error('Failed to load ' + path);
  return response.json();
}

function sourceDisclosure(references) {
  const disclosure = element('details');
  const list = element('ul');
  disclosure.append(element('summary', 'Original sources'), list);
  for (const { ga, location, url, title, date } of references) {
    const li = element('li');
    const locator = /[–,]/.test(location) ? '§§' : '§';
    li.append(anchor('GA ' + ga + ' · ' + locator + ' ' + location, url),
      ' · ' + title + (date ? ' · ' + date : ''));
    list.append(li);
  }
  return disclosure;
}

function renderClaim({ title, body, context, kind, qualification, references, link }) {
  const article = element('article', '', 'guide-claim');
  article.append(element('h3', title), element('p', kind + ' · ' + context, 'guide-meta'), element('p', body));
  if (qualification) article.append(element('p', qualification));
  if (link) {
    const relatedPage = element('p');
    relatedPage.append(anchor(link.label, link.href));
    article.append(relatedPage);
  }
  article.append(sourceDisclosure(references));
  return article;
}

function concerns(edge, subjects) {
  return [edge.from, edge.to, ...edge.matrix_context].some((id) => subjects.has(id));
}

function renderGroups(host, id, graph, guide) {
  const nodes = new Map(graph.nodes.map((item) => [item.id, item]));
  const sources = new Map(graph.sources.map((item) => [item.id, item]));
  const edges = new Map(graph.edges.map((item) => [item.id, item]));
  const subjects = new Set(guide.subjects[id] ?? [id]);
  const related = guide.related[id] ?? {};
  const relatedIds = new Set(Object.values(related).flat());
  const explicit = graph.edges.filter((item) => concerns(item, subjects));
  const fieldNotes = guide.notes[id] ?? {};
  const sectionList = element('div', '', 'guide-topics');

  for (const [key, label, datasets] of groups) {
    const additions = (related[key] ?? []).map((claimId) => edges.get(claimId)).filter(Boolean);
    const records = [...new Set([...additions, ...explicit.filter((edge) => datasets.includes(edge.dataset) && !relatedIds.has(edge.id))])];
    const notes = fieldNotes[key] ?? [];
    if (!records.length && !notes.length) continue;

    const section = element('details', '', 'guide-topic');
    section.id = 'topic-' + key;
    section.open = sectionList.childElementCount === 0;
    const body = element('div', '', 'guide-topic-body');
    section.append(element('summary', label), body);
    for (const edge of records) {
      const from = nodes.get(edge.from);
      const to = nodes.get(edge.to);
      const other = subjects.has(from.id) ? to : from;
      const directTopic = concerns(edge, subjects);
      const referenceLabel = graph.evidence_classes[edge.class];
      body.append(renderClaim({
        title: directTopic ? other.label : from.label + ' · ' + to.label,
        body: edge.claim,
        kind: directTopic ? referenceLabel : 'Related study · ' + referenceLabel,
        context: edge.context,
        qualification: edge.qualification,
        references: edge.evidence.map((cite) => ({ ...sources.get(cite.source), location: cite.location })),
        link: other.route ? { label: 'Explore ' + other.label, href: other.route } : null,
      }));
    }
    for (const note of notes) {
      body.append(renderClaim({
        ...note,
        kind: 'Direct source',
        references: note.refs.map((sourceId) => guide.sources[sourceId]),
      }));
    }
    sectionList.append(section);
  }
  host.replaceChildren(element('h2', 'Explore by topic'), sectionList);
  const hash = location.hash.slice(1);
  const target = [...sectionList.children].find((section) => section.id === hash);
  if (target) {
    target.open = true;
    target.scrollIntoView();
  }
}

export async function loadPlanetaryGuide(host, id) {
  try {
    const [graph, guide] = await Promise.all([
      readJson(researchRoot + 'KNOWLEDGE_GRAPH.json'),
      readJson('../research/planetary-tree-v1.json'),
    ]);
    renderGroups(host, id, graph, guide);
  } catch {
    host.replaceChildren(element('h2', 'Explore by topic'), anchor('Open the source-linked Living Cosmos guide', 'living-cosmos.html'));
  }
}

export function renderEarth(root) {
  document.title = 'Earth · Planetary Tree of Life · Rudolf Steiner Atlas';
  root.innerHTML = '<section class="hero detail-hero"><div class="wrap"><div class="orb orb--earth" aria-hidden="true"></div>' +
    '<div><a class="back" href="planetary-tree.html">← Planetary Tree of Life</a><h1>Earth</h1>' +
    '<p class="lede">In Steiner’s account, Earth is the fourth great cosmic embodiment and the setting for the development of the independent human “I”.</p>' +
    '</div></div></section><div class="wrap detail-main"><section class="guide-hierarchy" id="planetary-guide" aria-label="Earth topics"></section>' +
    '<p><a href="living-cosmos.html?view=history&amp;node=earth">Explore Earth in The Living Cosmos →</a></p></div>';
  return loadPlanetaryGuide(document.getElementById('planetary-guide'), 'earth');
}
