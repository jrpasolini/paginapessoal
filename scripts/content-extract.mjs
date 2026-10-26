import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = process.argv[2];
const out = join(repo, 'content');
mkdirSync(join(out, 'projetos'), { recursive: true });
mkdirSync(join(out, 'artigos'), { recursive: true });
const html = readFileSync(join(repo, 'index.html'), 'utf8');

const blocks = {};
for (const m of html.matchAll(/<section[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)) {
  blocks[m[1]] = m[2];
}
// artigos ficam fora de <section id>: captura artigos individuais por id
for (const m of html.matchAll(/<article[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)) {
  if (!blocks[m[1]]) blocks[m[1]] = m[2];
}

function toText(fragment) {
  let s = fragment
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<\/(p|div|li|h1|h2|h3|h4|blockquote|figcaption|td|tr)>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&hellip;/g, '…');
  return s.split('\n').map(l => l.replace(/\s+/g, ' ').replace(/ ([,.;:!?])/g, '$1').trim()).filter(Boolean).join('\n\n');
}

const sections = {
  'inicio': ['perfil', 'Perfil — hero e números'],
  'trajetoria': ['trajetoria', 'Trajetória'],
  'carreira': ['carreira', 'Carreira (introdução)'],
  'atuacao': ['carreira-atuacao', 'Carreira — Atuação'],
  'especialidade': ['carreira-areas', 'Carreira — Áreas de interesse e atuação'],
  'abordagem': ['carreira-abordagem', 'Carreira — Abordagem'],
  'projetos': ['projetos', 'Projetos — introdução'],
  'engineering-notes-title': ['artigos', 'Artigos — introdução'],
  'contato': ['contato', 'Contato'],
};
const projects = {
  bioflow: 'BioFlow', 'pocket-oracle': 'Pocket Oracle', marine: 'Marine',
  'memory-wiki': 'Memory Wiki', 'projeto-automacao': 'Automação RBE',
  'ia-aplicada': 'IA Aplicada', blog: 'Blog Pessoal', 'pasolini-bbs': 'Pasolini BBS',
  'emulador-msx': 'Emulador MSX', 'agente-digital-pessoal': 'Agente Digital Pessoal',
  'vault-commander': 'Vault-Commander', lenormand: 'Oráculo Lenormand', tarot: 'Tarot Rider-Waite',
};
const articles = {
  'dev-bioflow': 'DEV.to — BioFlow (Week 3)', 'dev-hermes-memory': 'DEV.to — 7 camadas de memória',
  'dev-pocket-oracle': 'DEV.to — Pocket Oracle', epicteto: 'X — Ser filósofo pelo exemplo',
  pessoa: 'X — O campo e o império', vesperas: 'X — Uma conversa com quem fui',
  mapa: 'X — O mapa ou o tesouro', singularidade: 'X — A singularidade suave',
  percepcao: 'X — A realidade depende de quem olha?',
};

let written = 0;
function emit(rel, title, id) {
  const raw = blocks[id];
  const body = raw ? toText(raw) : '*(conteúdo não localizado automaticamente — preencher)*';
  const fm = `---\ntitle: "${title}"\norigin: "index.html#${id}"\nstatus: rascunho\n---\n`;
  writeFileSync(join(out, rel), fm + '\n' + body + '\n');
  written++;
}

for (const [id, [file, title]] of Object.entries(sections)) emit(file + '.md', title, id);
for (const [id, title] of Object.entries(projects)) emit(join('projetos', id + '.md'), title, id);
for (const [id, title] of Object.entries(articles)) emit(join('artigos', id + '.md'), title, id);
console.log('arquivos gerados:', written);
console.log('seções encontradas:', Object.keys(blocks).length);
