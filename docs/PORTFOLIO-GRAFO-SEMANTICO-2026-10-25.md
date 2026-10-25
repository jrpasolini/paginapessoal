# Grafo semântico do portfólio — versão candidata (25/10/2026)

## Problema identificado

O grafo compacto da lateral é um mapa de navegação hierárquica. Ele permite navegar e aplicar zoom, mas **não relaciona projetos, ferramentas e artigos** e ainda não continha BioFlow e Marine. O usuário pediu o grafo semântico planejado anteriormente.

## Solução nesta branch

- **Mapa compacto** preservado, com zoom e links para a própria página.
- **Explorador de conhecimento** no botão de ampliar: 24 nós com tipos **projeto, conceito e publicação**, vinculados por 28 relações curadas a partir do portfólio e dos artigos publicados.
- Busca por nome ou resumo; filtros de projetos, artigos e conceitos **mantêm os vizinhos imediatos**, para não criar nós desconectados.
- Seleção e destaque visual das relações; navegação por teclado (Enter/Espaço).
- Detalhes do nó com lista de relações e ação **Abrir item**. Projetos levam à seção da página; artigos abrem o **mesmo modal existente**, preservando texto integral do X e link ao original.
- PT-BR, italiano e inglês para instruções e nós, interface responsiva e respeito a movimento reduzido.
- Cache do service worker atualizado para `r14`, garantindo uma nova versão do bundle após publicação.

## Relações editoriais e atribuições

BioFlow → Gemma, MongoDB Atlas, Cloudflare, proveniência, Hacktoberfest e artigo de submissão Week 3. A demo é fictícia e exige revisão humana; **não é diagnóstico**.

Pocket Oracle → Gemma, ElevenLabs (narração **opcional**), Cloudflare, acessibilidade, Hacktoberfest e artigo Week 2.

Marine → infraestrutura cloud. Memory Wiki e artigo das sete camadas → memória/proveniência. Textos filosóficos do X → percepção, realidade e filosofia.

**O Cline CLI permanece mencionado apenas como ferramenta de terceiros no portfólio**, sem divulgar rascunho, trabalho de memória não publicado ou atribuir autoria do framework.

## Escopo da validação

`node --test tests/semantic-graph.test.mjs` verifica a estrutura de nós, relações, busca/filtros, navegação para artigos e projetos, idioma e atualização do cache. A sintaxe do bundle foi checada separadamente.

**Ainda depende de QA visual real**, principalmente: layout em celular, Chrome/Edge, visualização ampliada, navegação para modais do X e DEV.to, zoom do mapa compacto, PWA previamente instalado e navegação por teclado. Não fazer merge sem essa revisão.

Participar das semanas 2 e 3 do Hacktoberfest **não significa ter recebido prêmio**.
