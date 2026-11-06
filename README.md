# Antonio Pasolini Junior

Portfólio pessoal: **https://jrpasolini.tech/**

Este repositório contém os arquivos públicos do portfólio, hospedados pelo GitHub Pages. O domínio personalizado é o endereço principal e a branch **`main`** é a referência oficial para novas alterações.

## Conteúdo e navegação

- Posicionamento profissional alinhado ao perfil do LinkedIn: desenvolvimento full stack, integração responsável de IA e experiência em melhoria de processos na saúde pública.
- Projetos selecionados com escopo verificável: BioFlow, Pocket Oracle e Retro Ghost 85.
- Certificados recentes da MongoDB e Cisco com links públicos de validação no Credly.
- Biblioteca editorial com links para textos no X e no DEV.to, preservando os popups dos artigos do X.
- Grafo semântico interativo que relaciona projetos, conceitos e artigos, além do mapa compacto de navegação.
- Alternância entre português, italiano e inglês, temas claro/escuro e recursos PWA.

## Validação e manutenção

Os testes de consistência editorial e do conteúdo público podem ser executados com:

```bash
node --test tests/portfolio-content.test.mjs
```

O conjunto verifica o posicionamento profissional, as credenciais públicas, a ausência de alegações antigas ou enganosas e a atualização do cache da PWA. A revisão visual em navegadores reais, dispositivos móveis e instalações PWA continua recomendada após alterações.

Os registros de decisões, auditoria factual e evolução do grafo permanecem na pasta `docs/` como histórico. Os avisos anteriores de "branch em revisão" nesses documentos refletem o estado da época, não o status atual da `main`.

## Identidade visual

O favicon e os ícones PWA seguem o conceito **Filósofo Celestial**, escolhido pelo autor. A aba do navegador e o manifesto usam a mesma arte raster de alta resolução (`icon-512.png`), com `icon-192.png` como tamanho complementar, preservando uma identidade visual consistente. A fonte visual foi produzida especificamente para este projeto.
