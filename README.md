# Antonio Pasolini Junior

Portfólio pessoal: **https://jrpasolini.tech/**

Este repositório contém os arquivos públicos do portfólio, hospedados pelo GitHub Pages. O domínio personalizado é o endereço principal e a branch **`main`** é a referência oficial para novas alterações.

## Conteúdo e navegação

- Apresentação de projetos, experimentos com agentes e publicações.
- Biblioteca editorial com links para textos no X e no DEV.to, preservando os popups dos artigos do X.
- Grafo semântico interativo que relaciona projetos, conceitos e artigos, além do mapa compacto de navegação.
- Alternância entre português, italiano e inglês, temas claro/escuro e recursos PWA.

## Validação e manutenção

O teste automatizado do grafo pode ser executado com:

```bash
node --test tests/semantic-graph.test.mjs
```

O workflow **Portfolio knowledge graph smoke tests** passou antes da integração do PR #2 em 25/10/2026. A revisão visual em navegadores reais, dispositivos móveis e instalações PWA continua recomendada após alterações.

Os registros de decisões, auditoria factual e evolução do grafo permanecem na pasta `docs/` como histórico. Os avisos anteriores de "branch em revisão" nesses documentos refletem o estado da época, não o status atual da `main`.

## Identidade visual

O favicon e os ícones PWA seguem o conceito **Filósofo Celestial**, escolhido pelo autor. Os arquivos principais são `favicon.svg`, `icon-192.png` e `icon-512.svg`; o SVG maior incorpora uma imagem de 192 pixels e permanece provisório até eventual exportação raster de alta resolução. A fonte visual foi produzida especificamente para este projeto.
