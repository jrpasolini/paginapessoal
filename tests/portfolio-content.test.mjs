import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const [html, bundle, sw, manifest] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('assets/routes-release-20261013-r7.js', root), 'utf8'),
  readFile(new URL('sw.js', root), 'utf8'),
  readFile(new URL('manifest.webmanifest', root), 'utf8'),
]);

test('the professional positioning is consistent in HTML and hydrated content', () => {
  for (const source of [html, bundle]) {
    assert.match(source, /Desenvolvedor Full Stack/);
    assert.match(source, /18 anos/);
    assert.match(source, /Retro Ghost 85/);
    assert.match(source, /credenciais verificáveis|verifiable credentials/);
  }
  assert.match(html, /class="scroll-note" href="#projetos"/);
  assert.match(bundle, /className:`scroll-note`,href:`#projetos`/);
});

test('recent credentials are present with verifiable destinations', () => {
  for (const source of [html, bundle]) {
    assert.match(source, /Bacharelado em Engenharia de Software|BSc in Software Engineering/);
    assert.match(source, /abr\. 2025|Apr\. 2025/);
    assert.match(source, /Git e Versionamento|Git and Version Control/);
    assert.match(source, /Gestão de Projetos|Project Management/);
    assert.match(source, /MongoDB Basics for Students/);
    assert.match(source, /383b6bea-fd83-4091-b413-99a0c9b08927/);
    assert.match(source, /d218bebc-1193-4ba4-bea3-8c04887c88ed/);
  }
});

test('stale or misleading portfolio claims stay out of the public build', () => {
  for (const source of [html, bundle]) {
    assert.doesNotMatch(source, /OpenMClaw|OpenClaw 2\.0/i);
    assert.doesNotMatch(source, /title:`Emulador MSX`/);
    assert.doesNotMatch(source, /id:`agente-digital-pessoal`,title:/);
    assert.doesNotMatch(source, /id="agente-digital-pessoal"/);
  }
});

test('the service worker cache is bumped for the content release', () => {
  assert.match(sw, /pasolini-flexible-release-20261122-r18/);
  assert.doesNotMatch(sw, /pasolini-flexible-release-20261122-r17/);
  assert.doesNotMatch(sw, /pasolini-flexible-release-20261105-r16/);
});

test('Ingegno is the fourth featured project and the hero counts four', () => {
  assert.match(html, /<dt>04<\/dt><dd>projetos selecionados<\/dd>/);
  assert.doesNotMatch(html, /<dt>03<\/dt><dd>projetos selecionados<\/dd>/);
  assert.match(html, /<p class="section-kicker">03<\/p><h2>Projetos<\/h2>/);
  assert.match(html, /Quatro projetos públicos que melhor demonstram desenvolvimento, testes, acessibilidade e integração responsável de IA\./);
  assert.doesNotMatch(html, /Três projetos públicos/);

  const grid = html.match(/<div class="operation-grid">([\s\S]*?)<\/div><\/section>/);
  assert.ok(grid, 'featured grid');
  const cards = [...grid[1].matchAll(/<article class="operation-card"><span>([^<]*)<\/span><h3>([^<]*)<\/h3><p>([^<]*)<\/p><\/article>/g)];
  assert.deepEqual(cards.map((card) => card[2]), ['BioFlow', 'Pocket Oracle', 'Retro Ghost 85', 'Ingegno']);
  assert.equal(cards[3][1], 'IA generativa');
  assert.equal(cards[3][3], 'Motor da Genio Academy: simulados gerados pelo NVIDIA Nemotron, no Render e via Cloudflare Worker.');

  assert.match(bundle, /\{value:`04`,label:`projetos selecionados`\}/);
  assert.match(bundle, /\{value:`04`,label:`progetti selezionati`\}/);
  assert.match(bundle, /\{value:`04`,label:`selected projects`\}/);
  assert.doesNotMatch(bundle, /value:`03`,label:`projetos selecionados`/);
  assert.doesNotMatch(bundle, /value:`03`,label:`progetti selezionati`/);
  assert.doesNotMatch(bundle, /value:`03`,label:`selected projects`/);
  assert.match(bundle, /kicker:`03`,title:`Projetos`/);
  assert.match(bundle, /kicker:`03`,title:`Progetti`/);
  assert.match(bundle, /kicker:`03`,title:`Projects`/);

  const featured = [
    'nowTitle:`Projetos em destaque`,nowIntro:`Quatro projetos públicos que melhor demonstram desenvolvimento, testes, acessibilidade e integração responsável de IA.`,now:[{title:`BioFlow`,status:`Saúde digital`,detail:`Histórico laboratorial sintético com extração assistida por IA e confirmação humana.`},{title:`Pocket Oracle`,status:`PWA acessível`,detail:`Aplicação bilíngue com modelos open-weight, fallback observável e experiência offline.`},{title:`Retro Ghost 85`,status:`Jogo narrativo`,detail:`Jogo web em TypeScript com regras locais, IA limitada à narração e 99 testes automatizados.`},{title:`Ingegno`,status:`IA generativa`,detail:`Motor da Genio Academy: simulados gerados pelo NVIDIA Nemotron, no Render e via Cloudflare Worker.`}]',
    'nowTitle:`Progetti in evidenza`,nowIntro:`Quattro esempi di applicazioni ed esperimenti che ho sviluppato. I framework utilizzati sono attribuiti ai rispettivi autori.`,now:[{title:`BioFlow`,status:`Salute digitale`,detail:`Storico di laboratorio con dati fittizi, grafici temporali ed estrazione assistita dall\'IA.`},{title:`Pocket Oracle`,status:`Oracolo Digitale`,detail:`PWA di tarocchi con interpretazione assistita da modelli open-weight e narrazione facoltativa.`},{title:`Marine`,status:`Cloud · Free Tier`,detail:`Esperimento Linux e accesso remoto sicuro progettato per i limiti gratuiti di Google Cloud.`},{title:`Ingegno`,status:`IA generativa`,detail:`Motore di Genio Academy: simulazioni generate da NVIDIA Nemotron, su Render e via Cloudflare Worker.`}]',
    'nowTitle:`Featured projects`,nowIntro:`Four examples of applications and experiments I developed. Third-party frameworks are credited in each project.`,now:[{title:`BioFlow`,status:`Digital health`,detail:`Fictional laboratory histories, longitudinal charts and AI-assisted extraction.`},{title:`Pocket Oracle`,status:`Digital oracle`,detail:`Tarot PWA with open-weight AI interpretation and optional narration.`},{title:`Marine`,status:`Cloud · Free Tier`,detail:`A Linux and secure remote-access experiment designed around Google Cloud\'s free-tier limits.`},{title:`Ingegno`,status:`Generative AI`,detail:`The engine of Genio Academy: mock exams generated by NVIDIA Nemotron, on Render via a Cloudflare Worker.`}]',
  ];
  for (const entry of featured) assert.ok(bundle.includes(entry), entry.slice(0, 48));
});

test('the hero counts thirteen verifiable Credly credentials', () => {
  assert.match(html, /<dt>13<\/dt><dd>credenciais verificáveis<\/dd>/);
  assert.doesNotMatch(html, /<dt>03<\/dt><dd>credenciais verificáveis<\/dd>/);
  assert.match(bundle, /\{value:`13`,label:`credenciais verificáveis`\}/);
  assert.match(bundle, /\{value:`13`,label:`credenziali verificabili`\}/);
  assert.match(bundle, /\{value:`13`,label:`verifiable credentials`\}/);
  assert.equal(html.match(/https:\/\/www\.credly\.com\/badges\//g).length, 13);
  assert.equal(bundle.match(/https:\/\/www\.credly\.com\/badges\//g).length, 39);
});

test('BuilderOps and Ingegno are in the project list', () => {
  for (const source of [html, bundle]) {
    assert.match(source, /BuilderOps/);
    assert.match(source, /https:\/\/github\.com\/jrpasolini\/BuilderOps/);
    assert.match(source, /https:\/\/jrpasolini\.github\.io\/BuilderOps\//);
    assert.match(source, /Ingegno/);
    assert.match(source, /https:\/\/github\.com\/jrpasolini\/ingegno/);
    assert.match(source, /https:\/\/jrpasolini\.tech\/ingegno\//);
    assert.match(source, /Auth0 Universal Login/);
    assert.match(source, /Open-Meteo/);
    assert.match(source, /Privacy-Aware RAG Bot with Auth0 FGA/);
    assert.match(source, /Genio Academy/);
    assert.match(source, /NVIDIA Nemotron/);
    assert.match(source, /NVIDIA Build API/);
  }
  assert.match(html, /id="builderops"/);
  assert.match(html, /id="ingegno"/);
  assert.match(bundle, /id:`builderops`/);
  assert.match(bundle, /id:`ingegno`/);
  assert.match(bundle, /Pannello per builder/);
  assert.match(bundle, /Motore di Genio Academy/);
  assert.match(bundle, /The engine of Genio Academy/);
  assert.match(bundle, /label:`IA generativa`/);
  assert.match(bundle, /label:`Generative AI`/);
});

test('MongoDB Credly badges keep their issue dates and the document-model title', () => {
  const ids = [
    '75dbbe25-24e2-457f-b701-413046e9e8bd',
    'ed8a4997-0f78-4c9f-9575-a7d3519c2c60',
    'a92e162d-ce6c-4296-aa66-9848182d35d5',
    'df2a7cf1-f9b5-4b7b-a3d3-3b835027023c',
    '9d1c7f4d-6d44-4a18-9a78-8459265e4da4',
    'f9f46a05-a61e-4c2a-aed5-226a5fde6b8f',
    '491dc07b-9b2f-4187-8567-16beab5a92cc',
    '426cecef-059b-4fee-af20-56d70cfe7515',
    'f3ff2e83-f3d9-4096-a2a5-8583357dba1c',
    '4d67c3d8-81be-4ea5-b97a-e8aef72ed34d',
  ];
  for (const source of [html, bundle]) {
    assert.match(source, /MongoDB's Document Model/);
    assert.doesNotMatch(source, /MongoDBs/);
    let cursor = -1;
    for (const id of ids) {
      const at = source.indexOf(id);
      assert.ok(at > cursor, id);
      cursor = at;
    }
  }
  assert.match(html, /<time>22 nov\. 2026<\/time><h3><a href="https:\/\/www\.credly\.com\/badges\/75dbbe25-24e2-457f-b701-413046e9e8bd"/);
  assert.match(html, /<time>22 nov\. 2026<\/time><h3><a href="https:\/\/www\.credly\.com\/badges\/ed8a4997-0f78-4c9f-9575-a7d3519c2c60"/);
  assert.match(html, /<time>18 nov\. 2026<\/time>/);
  assert.match(html, /<time>16 nov\. 2026<\/time>/);
  assert.match(html, /<time>14 nov\. 2026<\/time>/);
  assert.match(html, /<time>8 nov\. 2026<\/time>/);
  assert.match(html, /<time>7 nov\. 2026<\/time>/);
  assert.match(bundle, /date:`22 nov\. 2026`,title:`Building AI Agents with MongoDB`/);
  assert.match(bundle, /date:`22 nov\. 2026`,title:`Memory for AI Applications with MongoDB`/);
  assert.match(bundle, /date:`Nov 22, 2026`,title:`Building AI Agents with MongoDB`/);
  assert.match(bundle, /date:`Nov 18, 2026`,title:`Building RAG Apps Using MongoDB`/);
  assert.match(bundle, /date:`Nov 16, 2026`,title:`Building an App with Code Agents and MongoDB`/);
  assert.match(bundle, /date:`14 nov\. 2026`,title:`Building AI-Powered Search with MongoDB Vector Search`/);
  assert.match(bundle, /date:`Nov 8, 2026`,title:`MongoDB Schema Design Patterns and Anti-patterns Skill Badge`/);
  assert.match(bundle, /date:`7 nov\. 2026`,title:`CRUD Operations in MongoDB`/);
});

test('Ada Tech School Node.js courses follow the existing course format', () => {
  for (const title of [
    'Introdução ao Node.js com Express — Ada Tech School',
    'Introdução à plataforma Node.js — Ada Tech School',
    'Programação orientada a objetos com JavaScript (Node.js) — Ada Tech School',
    'Lógica de programação com JavaScript (Node.js) — Ada Tech School',
  ]) {
    assert.ok(html.includes(title), title);
    assert.ok(bundle.includes(title), title);
  }
  assert.match(html, /<time>jan\. 2025<\/time><h3>Introdução ao Node\.js com Express — Ada Tech School<\/h3>/);
  assert.match(html, /<time>dez\. 2024<\/time><h3>Lógica de programação com JavaScript \(Node\.js\) — Ada Tech School<\/h3>/);
  assert.match(bundle, /date:`gen\. 2025`,title:`Introduzione a Node\.js con Express — Ada Tech School`/);
  assert.match(bundle, /date:`dic\. 2024`,title:`Logica di programmazione con JavaScript \(Node\.js\) — Ada Tech School`/);
  assert.match(bundle, /date:`Jan\. 2025`,title:`Introduction to Node\.js with Express — Ada Tech School`/);
  assert.match(bundle, /date:`Dec\. 2024`,title:`Programming Logic with JavaScript \(Node\.js\) — Ada Tech School`/);
});

test('browser and PWA share the high-resolution celestial icon', () => {
  assert.match(html, /rel="icon" type="image\/png" sizes="512x512" href="icon-512\.png"/);
  assert.match(manifest, /"src": "icon-512\.png"/);
  assert.match(sw, /"\/icon-512\.png"/);
  assert.doesNotMatch(sw, /"\/favicon\.svg"/);
});

test('social previews declare a publicly accessible Open Graph image', () => {
  assert.match(html, /<html lang="pt-BR" prefix="og: https:\/\/ogp\.me\/ns#">/);
  for (const tag of [
    'property="og:type" content="website"',
    'property="og:url" content="https://jrpasolini.tech/"',
    'property="og:image" content="https://jrpasolini.tech/og.jpg"',
    'property="og:image:width" content="1200"',
    'property="og:image:height" content="630"',
    'name="twitter:card" content="summary_large_image"',
    'name="twitter:image" content="https://jrpasolini.tech/og.jpg"',
  ]) assert.match(html, new RegExp(tag));
});
