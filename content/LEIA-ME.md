# Camada de conteúdo

Esta pasta é a **fonte da verdade do texto** do site. O `index.html` publicado continua sendo
um artefato pronto (React compilado, sem código-fonte no repositório) — por isso o conteúdo foi
extraído para cá em formato editável.

## Como foi gerado

```bash
node scripts/content-extract.mjs .
```

O script lê o `index.html`, separa as seções por `id` e escreve um arquivo markdown por seção,
projeto e artigo. Rodar de novo **sobrescreve** estes arquivos — a partir do momento em que a
edição começar aqui, o extrator deixa de ser a origem.

## Estrutura

- `perfil.md` — hero, subtítulo e os três números
- `trajetoria.md`, `carreira*.md` — as seções narrativas
- `projetos/*.md` — um arquivo por projeto (id do projeto = id da seção na página)
- `artigos/*.md` — um arquivo por publicação
- `AUDITORIA.md` — inconsistências encontradas na extração

## Regras

1. **Nada de texto solto no HTML.** Correção de conteúdo entra aqui primeiro.
2. Um arquivo por unidade publicável — é o mesmo formato que o Quartz consome depois.
3. O campo `origin` guarda de onde o texto veio; não apagar.
4. Três idiomas (PT/IT/EN) ainda não estão nesta camada: hoje vivem dentro do bundle compilado.
