#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

OUT="dist"

rm -rf "$OUT"
mkdir -p "$OUT"

for item in \
  index.html \
  sw.js \
  manifest.webmanifest \
  favicon.svg \
  icon-192.png \
  icon-512.png \
  icon-512.svg \
  perfil-junior.jpg \
  perfil-junior.webp \
  perfil-junior-320.jpg \
  perfil-junior-320.webp \
  og.jpg \
  x-banner.jpg \
  assets; do
  if [ ! -e "$item" ]; then
    echo "ERRO: item obrigatório ausente: $item" >&2
    exit 1
  fi
  cp -R "$item" "$OUT/"
done

# O bundle publicado também é usado pelo GitHub Pages em /paginapessoal/.
# No domínio principal do Render, a aplicação vive na raiz; normalize as
# referências compiladas sem alterar os artefatos versionados do repositório.
find "$OUT" -type f \
  \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.webmanifest' -o -name '*.json' \) \
  -print0 | while IFS= read -r -d '' file; do
    if grep -qF "paginapessoal" "$file"; then
      node - "$file" <<'JS'
const fs = require("node:fs");

const path = process.argv[2];
let data = fs.readFileSync(path, "utf8");

data = data.replaceAll("/paginapessoal/", "/");
data = data.replaceAll("`/paginapessoal`", "`/`");
data = data.replaceAll("`paginapessoal`", "`/`");
data = data.replaceAll("/paginapessoal", "/");
data = data.replaceAll("paginapessoal", "");

fs.writeFileSync(path, data);
JS
    fi
  done

if grep -rqF "paginapessoal" "$OUT" 2>/dev/null; then
  echo "ERRO: sobrou referência a 'paginapessoal' no build:" >&2
  grep -rlF "paginapessoal" "$OUT" >&2
  exit 1
fi

for required in "$OUT/index.html" "$OUT/sw.js" "$OUT/manifest.webmanifest" \
                "$OUT/assets/index-release-20261013-r7.js"; do
  if [ ! -f "$required" ]; then
    echo "ERRO: build incompleto, faltou $required" >&2
    exit 1
  fi
done

echo "Build concluído: página pessoal pronta para a raiz do domínio."
