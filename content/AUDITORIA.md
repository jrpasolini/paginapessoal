# Auditoria de conteúdo — 25/10/2026

Extraído do `index.html` em produção (`32b4622`). Cada item precisa da confirmação do autor:
**corrigir**, **manter** ou **remover**.

## Inconsistências verificáveis

1. **Rótulo do mapa compacto.** O nó do grafo diz *Especialidade*, mas o título da seção é
   *Áreas de interesse e atuação*. Um dos dois precisa mudar.
2. **"03 plataformas de publicação".** O site lista X e DEV.to como plataformas ativas; o blog
   pessoal (WordPress) está descrito como acervo encerrado em 2015. Se ele não conta como ativa,
   o número está errado.
3. **"12+ iniciativas apresentadas".** A página descreve 13 projetos na lista secundária + 3 em
   destaque. O número precisa de critério explícito, ou sai.
4. **"10+ anos no serviço público".** Confere com o texto da Carreira ("mais de uma década"), mas
   é um número que envelhece sozinho — vale trocar por ano de início.
5. **Modelos citados.** *Gemma 4* e *fallback Llama 3.3* no Pocket Oracle: confirmar se ainda são
   os modelos em uso. Modelo é fato mutável; o texto não pode envelhecer sem aviso.
6. **Status dos projetos.** *Memory Wiki — Em evolução*, *Automação RBE — Em uso*. São os únicos
   com etiqueta de status; os demais não têm. Ou todos têm, ou nenhum.

## Estrutura do mapa compacto

O mapa tem 34 nós; a página tem 23 seções com `id`. Os nós extras são externos (Blog, LinkedIn,
GitHub, X, Instagram, Facebook, DEV) e artigos — coerente, mas o mapa **não tem nó** para
*Stack pessoal* nem para *Caderno de engenharia*. Verificar se é intencional.

## Textos que precisam de decisão editorial

- **BioFlow:** "Projeto inscrito na Week 3" — passado. O texto fala no presente em alguns trechos.
- **Pocket Oracle:** diz "Week 2" no card de destaque e descreve o projeto como publicado.
- **Artigos:** 9 cards, entre 25/08 e 23/10/2026. Falta um critério de "quantos ficam visíveis".
- **Contato:** "Este site mostra apenas a primeira página" — metáfora boa, mas pode confundir.

## O que falta na camada (a criar)

- Traduções PT/IT/EN em arquivos, hoje presas no bundle.
- Metadados de publicação (data, plataforma, URL canônica) por artigo.
- Lista de links externos por seção (hoje espalhados no HTML).
