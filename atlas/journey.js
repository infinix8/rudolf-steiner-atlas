'use strict';
(() => {
  const view = document.querySelector('#journey-view');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nodes = new Map();
  let paths = [];
  let models = [];
  let activePath;
  let activeStep = 0;
  const urlFor = (id, step = 0) => 'journey.html?path=' + encodeURIComponent(id) + '&step=' + (step + 1);
  const conceptUrl = id => 'index.html?journey=' + encodeURIComponent(activePath.id) + '&step=' + (activeStep + 1) + '#node=' + encodeURIComponent(id);
  const safeSource = url => { try {const u = new URL(url);return u.protocol === 'https:' && ['rsarchive.org','www.rsarchive.org','www.rudolf-steiner.com','rudolf-steiner.com'].includes(u.hostname);} catch {return false;} };
  async function json(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error('A reading resource is unavailable.');
    return response.json();
  }
  function render() {
    const params = new URLSearchParams(location.search);
    activePath = paths.find(p => p.id === params.get('path'));
    if (!activePath) {
      document.title = 'Guided reading · Rudolf Steiner Atlas';
      view.innerHTML = '<div class="journey-heading"><p class="eyebrow">Editorial reading journeys</p><h1>Follow a thread of thought.</h1><p class="lede">Eight short routes through connected ideas. Choose a question, explore one concept at a time, and follow its sources when you want to go deeper.</p></div>' +
        (params.has('path') ? '<p class="error">That journey was not found. Choose one of the routes below.</p>' : '') +
        '<div class="trail-grid">' + paths.map(p => '<a class="trail-card" href="' + urlFor(p.id) + '"><small>' + p.nodes.length + ' concepts · Guided reading</small><h3>' + escape(p.title) + '</h3><p>' + escape(p.description) + '</p><span class="enter">Begin this journey →</span></a>').join('') + '</div>' + notice();
      return;
    }
    const requested = Number(params.get('step'));
    activeStep = Number.isInteger(requested) && requested >= 1 && requested <= activePath.nodes.length ? requested - 1 : 0;
    document.title = activePath.title + ' · Guided reading';
    view.innerHTML = '<div class="journey-heading"><p class="eyebrow">Guided reading · One idea at a time</p><h1>' + escape(activePath.title) + '</h1><p class="lede">' + escape(activePath.description) + '</p><a class="text-link" href="journey.html">Choose a different journey →</a></div>' +
      '<div class="trail-layout"><nav class="trail-outline" aria-label="Journey steps"><h2>Your path through the ideas</h2><ol>' + activePath.nodes.map((id,i) => '<li><button class="trail-step" type="button" data-step="' + i + '"' + (i === activeStep ? ' aria-current="step"' : '') + '><span class="step-dot">' + (i + 1) + '</span><span>' + escape(nodes.get(id).title) + '</span></button></li>').join('') + '</ol></nav><div id="journey-step" tabindex="-1" aria-live="polite">' + stepContent() + '</div></div>' + notice();
  }
  function notice() {
    return '<p class="trail-notice">These sequences are editorial suggestions, not Steiner-authored lessons. The position indicator shows your place in this route, not research verification or learning completion. Original works and evidence notes remain on the concept pages.</p>';
  }
  function stepContent() {
    const n = nodes.get(activePath.nodes[activeStep]);
    const relevant = models.filter(m => m.topic_ids.includes(n.id)).slice(0,1);
    const last = activeStep === activePath.nodes.length - 1;
    return '<article class="step-sheet fade-in"><div class="step-position"><span>Concept ' + (activeStep + 1) + ' of ' + activePath.nodes.length + '</span><progress aria-label="Position in reading journey" value="' + (activeStep + 1) + '" max="' + activePath.nodes.length + '"></progress></div><p class="step-context">' + escape(n.region.title) + '</p><h2>' + escape(n.title) + '</h2><p>' + (n.children?.length ? 'Begin with this organising idea. The related concepts below show the branches included in the Atlas.' : 'Explore this concept in the source-linked Atlas, then return here to continue the journey.') + '</p>' +
      (n.children?.length ? '<div class="step-topics" aria-label="Concepts to explore">' + n.children.slice(0,6).map(c => '<a href="' + conceptUrl(c.id) + '">' + escape(c.title) + ' →</a>').join('') + '</div>' : '') +
      relevant.map(m => '<section class="step-model"><p class="eyebrow">From the existing research</p><h3>' + escape(m.title) + '</h3><p>' + escape(m.summary) + '</p><p><small>' + escape(m.status) + '</small></p>' + (safeSource(m.source_url) ? '<a href="' + escape(m.source_url) + '" target="_blank" rel="noopener noreferrer">Read the original passage →</a>' : '') + '</section>').join('') +
      '<p class="step-source-note">' + (relevant.length ? 'This summary belongs to a documented conceptual comparison. Follow the original passage to check its context.' : 'This stop is a topic guide. It does not substitute an explanation for a verified original passage; the concept page distinguishes source leads from checked relationships.') + '</p>' +
      '<a class="primary" href="' + conceptUrl(n.id) + '">Explore this concept & its sources →</a></article>' +
      '<nav class="step-controls" aria-label="Move through the journey"><button type="button" data-step="' + (activeStep - 1) + '"' + (!activeStep ? ' disabled' : '') + '>← Previous</button>' + (last ? '<a href="journey.html">Explore another journey →</a>' : '<button type="button" data-step="' + (activeStep + 1) + '">Next concept →</button>') + '</nav>' +
      (last ? '<section class="step-finish"><h3>A starting point for further reading.</h3><p>You have reached the last stop in this route. Revisit a concept, follow an original source, or explore another theme.</p><a href="explore.html?region=' + n.region.id + '">Explore this wider theme →</a></section>' : '');
  }
  view.addEventListener('click', e => {
    const button = e.target.closest('[data-step]');
    if (!button || button.disabled || !activePath) return;
    const index = Number(button.dataset.step);
    if (!Number.isInteger(index) || index < 0 || index >= activePath.nodes.length || index === activeStep) return;
    history.pushState(null, '', urlFor(activePath.id, index));
    activeStep = index;
    document.querySelectorAll('.trail-step').forEach(b => {if(Number(b.dataset.step) === index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    const panel = document.querySelector('#journey-step');
    panel.innerHTML = stepContent();
    panel.focus({preventScroll:true});
    panel.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  window.addEventListener('popstate', () => {if(paths.length)render();});
  Promise.all([json('../taxonomy/taxonomy-v1.json'),json('study-paths.json'),json('../research/concept-models.json')]).then(([taxonomy, routes, comparisons]) => {
    function visit(n, region) {nodes.set(n.id,{...n,region});(n.children||[]).forEach(c => visit(c,region));}
    taxonomy.tree.forEach(r => visit(r,r));
    paths = routes.paths.filter(p => p.nodes.length && p.nodes.every(id => nodes.has(id)));
    models = comparisons.models || [];
    render();
  }).catch(() => {view.innerHTML = '<div class="error"><h1>The reading journeys could not load.</h1><p>Please reload, or <a class="text-link" href="index.html">browse the full Atlas →</a>.</p></div>';});
})();
