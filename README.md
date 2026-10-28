# Site · Bruna Cavallaro, Nutricionista Materno Infantil

Site de uma página, em HTML, CSS e JavaScript puros. Não precisa instalar nada nem rodar build.

## Estrutura
```
index.html          a página
css/styles.css      todo o visual (cores e fontes no topo, em :root)
js/config.js        dados editáveis: WhatsApp, Instagram, CRN, cidade, endereço
js/mobile.js        o móbile de berço interativo (física das peças)
js/main.js          abertura 0→100%, menu, abas das fases, animações de scroll
assets/img/         fotos
assets/favicon.svg  ícone da aba
_originais/         arquivos recebidos (não publicar)
qa/                 scripts de screenshot (não publicar)
```

## Trocar dados
Abra `js/config.js`:
- **WhatsApp**: `whatsapp: '5512988980863'` (55 + DDD + número, só dígitos). Todos os botões usam esse número.
- **Mensagem padrão**: `mensagem`. As mensagens de cada fase ficam em `js/main.js`, no bloco `FASES` (campo `msg`).
- **CRN**: `crn: 'CRN-3 00000'`. Aparece no hero e no rodapé.
- **Endereço**: `endereco`. Aparece na pergunta "Onde é o atendimento?".
- **Instagram**: `instagram` (só o @, sem a arroba).

O telefone escrito no fim da página fica no `index.html` (procure `data-fone`). O JSON-LD no `<head>` também tem o telefone.

## Trocar fotos
Substitua o arquivo em `assets/img/` **com o mesmo nome**; não precisa mexer no código. Se o arquivo faltar, aparece um placeholder com o nome esperado.

## Logo
Hoje a marca é a lua lilás + o nome (no `<header>` do `index.html`, classe `marca`). Para usar um logo em imagem, troque o `<svg class="marca__lua">` por `<img src="assets/img/logo.svg" alt="" width="34" height="34">`.

## Publicar
Envie a pasta inteira (sem `_originais/`, `qa/`, `README.md` e `PENDENCIAS.md`) para qualquer hospedagem estática: GitHub Pages, Hostinger, Netlify. Depois do domínio definitivo, troque `fnaime13-max.github.io/brunacavallaro/` no `index.html`, `robots.txt` e `sitemap.xml`.

**A cada alteração em CSS/JS, mude o `?v=20261028a` nas tags do `index.html`** (ex.: `?v=20261102a`), senão o navegador mostra a versão antiga.

## Decisões de implementação
- O móbile é DOM + SVG, com física de pêndulo simples. Ele pausa quando sai da tela e fica parado com `prefers-reduced-motion`.
- Na abertura, as peças descem uma a uma enquanto o contador vai de 0 a 100%. Na segunda visita da mesma sessão, ela dura metade do tempo.
- As abas de fase são acessíveis por teclado (setas, Home, End), e o botão de cada fase abre o WhatsApp com a mensagem daquela fase.
- Sem depoimentos nem antes/depois (CFN 856/2026, Art. 69).
