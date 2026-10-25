import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bundle = readFileSync(new URL('../assets/routes-release-20261013-r7.js', import.meta.url), 'utf8');
const start = bundle.indexOf('var kgLabels=');
const end = bundle.indexOf('function wc({label:e', start);
assert.ok(start >= 0 && end > start, 'Knowledge graph module exists in the compiled route bundle');
const isolated = bundle.slice(start, end);

function render(states = [null, '', 'all'], lang = 'pt-BR') {
  const events = [], scrolled = [];
  let exits = 0, hook = 0;
  const g = {
    useState: initial => [states[hook++] ?? initial, () => {}],
    createElement: (tag, props, ...children) => ({
      tag, props: props || {}, children: children.flat(Infinity).filter(x => x != null)
    })
  };
  const document = {
    documentElement: { lang },
    getElementById: id => ({ scrollIntoView: () => scrolled.push(id) })
  };
  const window = {
    setTimeout: fn => fn(),
    dispatchEvent: event => events.push({ type: event.type, detail: event.detail })
  };
  class CustomEvent {
    constructor(type, options) { this.type = type; this.detail = options.detail; }
  }
  const api = new Function('g', 'document', 'window', 'CustomEvent',
    isolated + 'return { nodes:kgNodes, links:kgPairs, graph:KnowledgeGraph }'
  )(g, document, window, CustomEvent);
  const root = api.graph({ onExit: () => exits++ });
  const flat = [];
  const walk = node => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.tag === 'string') flat.push(node);
    for (const child of node.children || []) walk(child);
  };
  walk(root);
  return { api, flat, events, scrolled, get exits() { return exits; } };
}

test('24 valid unique nodes and 28 evidence-backed connections', () => {
  const { api } = render();
  assert.equal(api.nodes.length, 24);
  assert.equal(api.links.length, 28);
  const ids = new Set(api.nodes.map(node => node.id));
  assert.equal(ids.size, 24);
  for (const [a, b] of api.links) assert.ok(ids.has(a) && ids.has(b), a + ' -> ' + b);
  assert.ok(api.links.some(([a, b]) => a === 'bioflow' && b === 'dev-bioflow'));
  assert.ok(api.links.some(([a, b]) => a === 'pocket-oracle' && b === 'elevenlabs'));
  assert.ok(api.links.some(([a, b]) => a === 'dev-hermes-memory' && b === 'memoria'));
  assert.ok(!api.nodes.some(node => node.id === 'cline-memory'), 'Unpublished Cline study remains excluded');
});

test('default, project filter, search, and empty state all render', () => {
  const all = render(), filtered = render([null, '', 'project']);
  assert.equal(all.flat.filter(x => x.tag === 'g' && x.props.className?.includes('kg-node')).length, 24);
  assert.equal(all.flat.filter(x => x.tag === 'line').length, 28);
  assert.ok(filtered.flat.some(x => x.tag === 'line'), 'Project filters keep relationships');
  assert.ok(render([null, 'Gemma', 'all']).flat.some(x => x.tag === 'line'));
  assert.ok(render([null, 'unlikely-no-match', 'all']).flat.some(x => x.props.className === 'kg-empty'));
});

test('articles open the existing portfolio popup through an event', () => {
  const ui = render(['dev-bioflow', '', 'all']);
  const open = ui.flat.find(x => x.tag === 'button' && x.props.className === 'kg-open');
  assert.ok(open, 'Selected article has an open button');
  open.props.onClick();
  assert.equal(ui.exits, 1);
  assert.deepEqual(ui.events, [{
    type: 'portfolio:open-article', detail: { id: 'dev-bioflow' }
  }]);
  assert.match(bundle, /addEventListener\("portfolio:open-article"/);
});

test('projects scroll to the matching page section', () => {
  const ui = render(['bioflow', '', 'all']);
  ui.flat.find(x => x.tag === 'button' && x.props.className === 'kg-open').props.onClick();
  assert.equal(ui.exits, 1);
  assert.deepEqual(ui.scrolled, ['bioflow']);
});

test('English and Italian labels come from translations', () => {
  assert.ok(render([null, '', 'all'], 'en').flat.some(x => x.tag === 'h3' && x.children.includes('Explore connections')));
  assert.ok(render([null, '', 'all'], 'it').flat.some(x => x.tag === 'h3' && x.children.includes('Esplora le connessioni')));
});

test('the source remains coherent with the project cards', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.match(html, /Hacktoberfest · Week 3/);
  assert.match(html, /narração opcional com ElevenLabs/);
  assert.match(bundle, /Hacktoberfest · Week 3/);
  assert.match(bundle, /KnowledgeGraph/);
  assert.match(sw, /pasolini-flexible-release-20261025-r14/);
});
