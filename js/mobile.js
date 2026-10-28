/* Móbile de berço: peças penduradas num aro que gira em 3D.
   Cada peça é um pêndulo; o mouse empurra, o clique gira o aro. */
(function () {
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  // Rostinho kawaii comum às peças (olhos piscam via .pisca)
  function rosto(x, y, cor) {
    return '<g class="olhos" style="transform-origin:' + x + 'px ' + y + 'px">' +
      '<circle cx="' + (x - 9) + '" cy="' + y + '" r="3.2" fill="' + cor + '"/>' +
      '<circle cx="' + (x + 9) + '" cy="' + y + '" r="3.2" fill="' + cor + '"/></g>' +
      '<path d="M' + (x - 5) + ' ' + (y + 7) + ' q5 5 10 0" fill="none" stroke="' + cor + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<ellipse cx="' + (x - 16) + '" cy="' + (y + 6) + '" rx="4.5" ry="2.6" fill="#F49BB0" opacity=".55"/>' +
      '<ellipse cx="' + (x + 16) + '" cy="' + (y + 6) + '" rx="4.5" ry="2.6" fill="#F49BB0" opacity=".55"/>';
  }

  var PECAS = {
    lua: '<path d="M64 10a40 40 0 1 0 28 60A33 33 0 0 1 64 10z" fill="#7E5BC2"/>' +
         '<path d="M64 10a40 40 0 0 0-34 18" fill="none" stroke="#A88BE0" stroke-width="4" stroke-linecap="round" opacity=".6"/>' + rosto(42, 58, '#2A1E47'),
    nuvem: '<path d="M26 78a18 18 0 0 1-2-36 24 24 0 0 1 46-6 19 19 0 0 1 8 42z" fill="#A9DAF3"/>' +
           '<path d="M30 46a20 20 0 0 1 14-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>' + rosto(50, 56, '#1E3E56'),
    estrela: '<path d="M50 8l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z" fill="#F2B84B" stroke="#F2B84B" stroke-width="6" stroke-linejoin="round"/>' + rosto(50, 50, '#4A2E10'),
    coracao: '<path d="M50 88S12 64 12 37a20 20 0 0 1 38-9 20 20 0 0 1 38 9c0 27-38 51-38 51z" fill="#B99BEA"/>' +
             '<path d="M24 34a10 10 0 0 1 10-9" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>' + rosto(50, 50, '#2A1E47'),
    gota: '<path d="M50 10s30 32 30 52a30 30 0 0 1-60 0c0-20 30-52 30-52z" fill="#FFFDF9" stroke="#9CC9E6" stroke-width="4"/>' + rosto(50, 62, '#1E3E56'),
    pera: '<path d="M50 20c9 0 12 10 13 18 2 12 20 18 20 34a33 33 0 0 1-66 0c0-16 18-22 20-34 1-8 4-18 13-18z" fill="#F6C3A2"/>' +
          '<path d="M50 20c0-6 3-10 8-12" fill="none" stroke="#8A5A2B" stroke-width="4" stroke-linecap="round"/>' + rosto(50, 68, '#4A2416')
  };

  function Mobile(el, opts) {
    opts = opts || {};
    var nomes = opts.pecas || ['lua', 'estrela', 'nuvem', 'coracao', 'gota', 'pera'];
    var comp = opts.comprimentos || [0.5, 0.36, 0.6, 0.42, 0.54, 0.4];
    var n = nomes.length;
    var tam = opts.tamanho || 0.2;

    el.classList.add('mob');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'mob__fios');
    el.appendChild(svg);
    var gancho = document.createElementNS(NS, 'path');
    var aro = document.createElementNS(NS, 'ellipse');
    aro.setAttribute('class', 'mob__aro');
    gancho.setAttribute('class', 'mob__gancho');
    svg.appendChild(gancho);
    var bracos = [], fios = [];
    var pecas = nomes.map(function (nome, i) {
      var b = document.createElementNS(NS, 'line'); b.setAttribute('class', 'mob__braco'); svg.appendChild(b); bracos.push(b);
      var f = document.createElementNS(NS, 'line'); f.setAttribute('class', 'mob__fio'); svg.appendChild(f); fios.push(f);
      var d = document.createElement('div');
      d.className = 'mob__peca';
      d.innerHTML = '<svg viewBox="0 0 100 100">' + PECAS[nome] + '</svg>';
      el.appendChild(d);
      return { el: d, th: (i % 2 ? 0.12 : -0.1), om: 0, hop: 0, hv: 0, rev: opts.revelado === false ? 0 : 1, L: comp[i % comp.length], x: 0, y: 0 };
    });
    svg.appendChild(aro);

    var W = 0, H = 0, fase = Math.random() * 6.28, vel = 0.24, base = 0.24;
    var mx = -1e4, my = -1e4, mvx = 0, ultX = null, ultY = null, ativo = true, raf = 0, t0 = 0;

    function medir() {
      var r = el.getBoundingClientRect();
      W = r.width; H = r.height;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var s = Math.max(34, Math.min(W * tam, 110));
      pecas.forEach(function (p) { p.el.style.width = p.el.style.height = s + 'px'; p.s = s; });
    }

    function onMove(e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (ultX !== null) { mvx = x - ultX; }
      ultX = x; ultY = y; mx = x; my = y;
    }

    function girar(forca) {
      vel += forca || 3;
      pecas.forEach(function (p, i) { p.hv -= 260 + (i % 3) * 60; p.om += (Math.random() - 0.5) * 3; });
    }

    function brilho(x, y) {
      for (var k = 0; k < 7; k++) {
        var s = document.createElement('i');
        s.className = 'mob__brilho';
        s.style.left = x + 'px'; s.style.top = y + 'px';
        s.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
        s.style.setProperty('--dy', (Math.random() * 90 + 30) + 'px');
        s.style.animationDelay = (k * 30) + 'ms';
        el.appendChild(s);
        setTimeout(s.remove.bind(s), 1300);
      }
    }

    function quadro(t) {
      var dt = Math.min(0.033, t0 ? (t - t0) / 1000 : 0.016); t0 = t;
      var cx = W / 2, topo = H * 0.12, R = W * 0.33, ry = R * 0.2;
      vel += (base - vel) * Math.min(1, dt * 0.9);
      if (!reduz) fase += vel * dt;

      // gancho e aro
      gancho.setAttribute('d', 'M' + cx + ' 0 L' + cx + ' ' + (topo - 8) + ' m-6 0 a6 6 0 1 0 12 0');
      aro.setAttribute('cx', cx); aro.setAttribute('cy', topo + ry * 0.6);
      aro.setAttribute('rx', R); aro.setAttribute('ry', ry);

      var ordem = [];
      pecas.forEach(function (p, i) {
        var phi = fase + i * (Math.PI * 2 / n);
        var z = Math.cos(phi);
        var ax = cx + R * Math.sin(phi), ay = topo + ry * 0.6 + ry * z;
        var esc = 0.78 + 0.22 * (z + 1) / 2;

        // pêndulo: gravidade + amortecimento + vento do mouse
        var Lpx = p.L * H * (p.rev < 1 ? easeOutBack(p.rev) : 1);
        var acc = -9.8 / Math.max(0.3, p.L * 3) * Math.sin(p.th) - 1.1 * p.om;
        var dx = mx - p.x, dy = my - p.y, dist = Math.sqrt(dx * dx + dy * dy), raio = p.s * 1.25;
        if (!reduz && dist < raio && p.rev >= 1) acc += mvx * 2.4 * (1 - dist / raio);
        p.om += acc * dt; p.th += p.om * dt;
        p.th = Math.max(-1.1, Math.min(1.1, p.th));
        p.hv += (-p.hop * 140 - p.hv * 9) * dt; p.hop += p.hv * dt;

        p.x = ax + Math.sin(p.th) * Lpx;
        p.y = ay + Math.cos(p.th) * Lpx + p.hop;
        bracos[i].setAttribute('x1', cx); bracos[i].setAttribute('y1', topo - 8);
        bracos[i].setAttribute('x2', ax); bracos[i].setAttribute('y2', ay);
        fios[i].setAttribute('x1', ax); fios[i].setAttribute('y1', ay);
        fios[i].setAttribute('x2', p.x); fios[i].setAttribute('y2', p.y);
        fios[i].style.opacity = bracos[i].style.opacity = p.rev > 0 ? 1 : 0;
        p.el.style.transform = 'translate(' + (p.x - p.s / 2) + 'px,' + (p.y - p.s * 0.06) + 'px) rotate(' + (p.th * 57.3 * 0.8) + 'deg) scale(' + (esc * Math.min(1, p.rev * 1.4)) + ')';
        p.el.style.opacity = Math.min(1, p.rev * 2);
        p.el.style.zIndex = Math.round((z + 1) * 10);
        p.el.style.filter = z < -0.3 ? 'saturate(.85) brightness(.97)' : '';
      });
      mvx *= 0.6;
      if (ativo && !reduz) raf = requestAnimationFrame(quadro);
    }

    function easeOutBack(x) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }

    function piscar() {
      var p = pecas[Math.floor(Math.random() * n)];
      p.el.classList.add('pisca');
      setTimeout(function () { p.el.classList.remove('pisca'); }, 170);
    }

    medir();
    addEventListener('resize', function () { medir(); if (reduz) quadro(performance.now()); });
    addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('click', function (e) {
      var r = el.getBoundingClientRect();
      girar(3.2); brilho(e.clientX - r.left, e.clientY - r.top);
    });
    var pisc = reduz ? 0 : setInterval(piscar, 1400);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        ativo = es[0].isIntersecting;
        if (ativo && !reduz) { cancelAnimationFrame(raf); t0 = 0; raf = requestAnimationFrame(quadro); }
      }).observe(el);
    }
    raf = requestAnimationFrame(quadro);

    return {
      setProgresso: function (v) {
        pecas.forEach(function (p, i) { p.rev = Math.max(0, Math.min(1, v * n - i)); });
        if (reduz) quadro(performance.now());
      },
      girar: girar,
      medir: medir
    };
  }

  window.Mobile = Mobile;
})();
