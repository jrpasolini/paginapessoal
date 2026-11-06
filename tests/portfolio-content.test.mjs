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
  assert.match(sw, /pasolini-flexible-release-20261105-r16/);
});

test('browser and PWA share the high-resolution celestial icon', () => {
  assert.match(html, /rel="icon" type="image\/png" sizes="512x512" href="icon-512\.png"/);
  assert.match(manifest, /"src": "icon-512\.png"/);
  assert.match(sw, /"\/icon-512\.png"/);
  assert.doesNotMatch(sw, /"\/favicon\.svg"/);
});
