# Revisão editorial do portfólio — 25/10/2026

> Rascunho de implementação. A branch de trabalho **não deve ser mesclada** até aprovação editorial, revisão visual e testes no navegador.

## Objetivo

Transformar jrpasolini.tech em um índice autoral de projetos, pesquisas, experimentos e publicações externas. O site apresenta e conecta conteúdos; não precisa republicar integralmente os artigos hospedados no X, DEV.to e outras plataformas.

## Princípios editoriais

- Mostrar **o que foi desenvolvido** e **por que**, evitando inventários de infraestrutura.
- Não atribuir a autoria de frameworks de terceiros (OpenClaw, Hermes Agent).
- Distinguir projetos próprios, experimentos com ferramentas existentes, artigos e tecnologias.
- Não usar títulos profissionais/credenciais ("minha especialidade") sem contexto apropriado.
- Preservar a identidade filosófica e pessoal junto ao conteúdo técnico.
- Não prometer custos zero incondicionalmente em serviços com limites gratuitos.
- BioFlow é demonstração com dados **fictícios**, sem diagnóstico nem substituição de documentos médicos.

## Implementado nesta branch

1. Painel "Em operação agora" substituído por **Projetos em destaque**: BioFlow, Pocket Oracle e Marine (PT/IT/EN).
2. BioFlow e Marine acrescentados ao catálogo de projetos.
3. "Especialidade" substituída por "Áreas de interesse e atuação".
4. "Stack & Agentes" simplificado e reescrito como **Experimentos com agentes e memória**, sem detalhes de máquinas e com atribuição correta.
5. Cartões de artigos DEV.to adicionados à biblioteca, com prévias curtas, URLs originais e links de navegação relacionados:
   - BioFlow — 23/10/2026
   - Beyond Context (memória do Hermes) — 18/10/2026
   - Pocket Oracle — 17/10/2026
6. Biblioteca ordenada por data, com filtros **Todos / X / DEV.to** e indicação da origem em cada cartão; popups originais do X e ação "Responder" foram preservados.
7. Caderno de engenharia resumido e excesso de medições históricas retirado da apresentação inicial.
8. Caminhos estáticos, fontes, roteador, PWA e service worker ajustados para a raiz do domínio personalizado. Nome do cache atualizado.
9. A `main` e o DNS não foram alterados.

## Publicações: arquitetura de referência

O objetivo futuro é manter apenas metadados leves no repositório: id, título, data, resumo, plataforma, URL canônica, temas e relações com outros conteúdos. A leitura e a participação acontecem no X ou DEV.to. A implementação atual ainda inclui texto integral legado de alguns artigos do X no bundle antigo; sua remoção e a extração do catálogo para uma fonte de dados própria são tarefas pendentes.

## Próxima etapa: grafo

Substituir posições fixas por layout de forças, com nós para projeto, artigo, tema e área; conexões semânticas justificadas e navegação acessível. A estrutura deverá trabalhar com as mesmas IDs do catálogo, sem repetir dados. **O grafo de força ainda não foi implementado nesta branch.**

## Qualidade e validação

- Verificação sintática dos bundles JavaScript, manifesto JSON e presença dos elementos HTML principais.
- Pendente: navegação interativa real, testes visuais, responsividade, idiomas, cache PWA, links e ações dos popups em uma URL de preview.
- Fonte original do projeto não está disponível na raiz do repositório atual (site publicado como bundles compilados). É preferível recuperar/estabelecer o projeto-fonte antes de grandes alterações no grafo.
- Verificar o domínio personalizado em **Settings → Pages** antes do merge. Isso não é alteração de DNS.

## Critério de aprovação

- A página inicial deve apresentar projetos de autoria própria sem reivindicar frameworks externos.
- A biblioteca deve permitir navegar pelas publicações técnicas e filosóficas, com fontes claramente identificadas.
- Nenhum artigo original deve ser perdido; links devem abrir fontes canônicas.
- O site e o PWA devem carregar a partir de `https://jrpasolini.tech/`.
- **Merge apenas após inspeção e aceite do proprietário.**
