(function () {
  var C = window.CONFIG;
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- dados do CONFIG ---------- */
  $$('[data-wa]').forEach(function (a) { a.href = linkWA(); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-ig]').forEach(function (a) { a.href = 'https://www.instagram.com/' + C.instagram + '/'; });
  if (C.crn) $$('[data-crn]').forEach(function (s) { s.textContent = C.crn; });
  $$('[data-cidade]').forEach(function (s) { s.textContent = C.cidade; });
  if (C.endereco) $$('[data-endereco]').forEach(function (s) { s.textContent = ', na ' + C.endereco; });

  /* ---------- menu ---------- */
  var btn = $('.menu-btn'), nav = $('#nav');
  btn.addEventListener('click', function () {
    var aberto = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!aberto));
    btn.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
    nav.classList.toggle('aberto', !aberto);
  });
  $$('a', nav).forEach(function (a) {
    a.addEventListener('click', function () { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('aberto'); });
  });
  var topo = $('#topo');
  addEventListener('scroll', function () { topo.classList.toggle('rolou', scrollY > 20); }, { passive: true });

  /* menu: marca a seção visível */
  var links = $$('.nav a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var obsNav = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['fases', 'sobre', 'consulta', 'duvidas'].forEach(function (id) { obsNav.observe(document.getElementById(id)); });
  }

  /* ---------- móbiles ---------- */
  var mobAbertura = new Mobile($('[data-mobile="abertura"]'), { revelado: false, tamanho: 0.2, comprimentos: [0.5, 0.36, 0.58, 0.42, 0.54, 0.4] });
  var mobHero = new Mobile($('[data-mobile="hero"]'), { revelado: false, tamanho: 0.24 });
  new Mobile($('[data-mobile="manifesto"]'), { pecas: ['estrela', 'lua', 'nuvem'], comprimentos: [0.42, 0.58, 0.5], tamanho: 0.26 });
  new Mobile($('[data-mobile="contato"]'), { pecas: ['coracao', 'gota', 'estrela', 'lua'], comprimentos: [0.5, 0.38, 0.6, 0.44], tamanho: 0.24 });

  /* ---------- abertura 0 → 100% ---------- */
  var ab = $('#abertura'), num = $('#contador'), barra = $('#barra');
  var dur = reduz ? 700 : 3400;
  try { if (sessionStorage.getItem('bc-visto')) dur = reduz ? 400 : 1700; sessionStorage.setItem('bc-visto', '1'); } catch (e) {}
  var ini = null;
  function suave(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function carregar(t) {
    if (!ini) ini = t;
    var p = Math.min(1, (t - ini) / dur), v = suave(p);
    num.textContent = Math.round(v * 100);
    barra.style.transform = 'scaleX(' + v + ')';
    mobAbertura.setProgresso(v);
    if (p < 1) return requestAnimationFrame(carregar);
    mobAbertura.girar(4.5);
    setTimeout(abrir, reduz ? 100 : 750);
  }
  function abrir() {
    ab.classList.add('abertura--fim');
    document.body.classList.remove('is-loading');
    descerHero();
    setTimeout(function () { ab.remove(); }, 1100);
  }
  function descerHero() {
    var t1 = null, d = reduz ? 1 : 1500;
    (function passo(t) {
      if (!t1) t1 = t;
      var p = Math.min(1, (t - t1) / d);
      mobHero.setProgresso(p);
      if (p < 1) requestAnimationFrame(passo);
    })(performance.now());
  }
  requestAnimationFrame(carregar);

  /* ---------- fases (abas) ---------- */
  var FASES = {
    gestacao: {
      titulo: 'Gestação', ic: 'ic-lua',
      texto: 'Do positivo ao parto: comer bem sem medo, sem passar fome e com o ganho de peso no lugar certo para você e para o bebê.',
      temas: ['Ajustes ao descobrir a gravidez', 'Enjoo no 1º trimestre', 'Ganho de peso', 'Diabetes gestacional', 'Anemia', 'Proteína na medida', 'Suplementação', 'Intestino e imunidade', 'Frutas e doces'],
      cta: 'Falar sobre a minha gestação',
      msg: 'Olá, Bruna! Estou grávida e quero agendar uma consulta.'
    },
    posparto: {
      titulo: 'Pós-parto', ic: 'ic-coracao',
      texto: 'O bebê chegou e o corpo pede outra atenção. Fome, cansaço e recuperação também passam pelo prato.',
      temas: ['Fome de leoa', 'Cansaço e energia', 'Alimentação na amamentação', 'Recuperação do peso com calma', 'Peixes e atum'],
      cta: 'Falar sobre o meu pós-parto',
      msg: 'Olá, Bruna! Estou no pós-parto e quero agendar uma consulta.'
    },
    introducao: {
      titulo: 'Introdução alimentar', ic: 'ic-gota',
      texto: 'Os primeiros alimentos do bebê, sem pânico: o que oferecer, quando e como, para evitar arrependimentos depois.',
      temas: ['Primeiras papinhas', 'Glúten', 'O que assusta no começo', 'Texturas e quantidades', 'Rotina da família'],
      cta: 'Falar sobre a introdução alimentar',
      msg: 'Olá, Bruna! Meu bebê vai começar (ou começou) a introdução alimentar e quero agendar uma consulta.'
    },
    infancia: {
      titulo: 'Infância', ic: 'ic-estrela',
      texto: 'Criança que come melhor, sem briga na mesa: lancheira, doces e hábitos que a família inteira consegue manter.',
      temas: ['Lancheira', 'Criança que não come', 'Doces e chocolate', 'Alimentação da família'],
      cta: 'Falar sobre a alimentação do meu filho',
      msg: 'Olá, Bruna! Quero agendar uma consulta para a alimentação do meu filho(a).'
    }
  };
  var tabs = $$('.fases__tabs [role="tab"]'), painel = $('#painel-fase'), bolinha = $('.fases__bolinha');
  function mostrar(tab, foco) {
    var f = FASES[tab.dataset.fase];
    tabs.forEach(function (t) {
      var sel = t === tab;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
    });
    painel.setAttribute('aria-labelledby', tab.id);
    painel.dataset.fase = tab.dataset.fase;
    $('[data-f="titulo"]', painel).textContent = f.titulo;
    $('[data-f="texto"]', painel).textContent = f.texto;
    $('[data-f="temas"]', painel).innerHTML = f.temas.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    var cta = $('[data-f="cta"]', painel);
    cta.textContent = f.cta; cta.href = linkWA(f.msg); cta.target = '_blank'; cta.rel = 'noopener';
    $('.fase__icone use', painel).setAttribute('href', '#' + f.ic);
    painel.classList.remove('troca'); void painel.offsetWidth; painel.classList.add('troca');
    bolinha.style.transform = 'translateX(' + (tab.offsetLeft + tab.offsetWidth / 2 - 7) + 'px)';
    if (foco) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { mostrar(t); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return;
      e.preventDefault();
      mostrar(tabs[(j + tabs.length) % tabs.length], true);
    });
  });
  mostrar(tabs[0]);
  addEventListener('resize', function () { mostrar($('.fases__tabs [aria-selected="true"]')); });

  /* ---------- revelações no scroll ---------- */
  var alvos = $$('.cabeca, .reel, .manifesto blockquote, .mapa, .passos li, .acordeao details, .contato__texto, .sobre__fecho');
  alvos.forEach(function (a) { a.classList.add('rev'); });
  if (reduz || !('IntersectionObserver' in window)) {
    alvos.forEach(function (a) { a.classList.add('visto'); });
  } else {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    alvos.forEach(function (a) { obs.observe(a); });
  }
})();
