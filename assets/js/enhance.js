/* ------------------------------------------------------------------
   Motion + interaction layer for Nasir Pullen's portfolio.
   Plain JS, no dependencies. Loaded after the template's script.js.
   Every feature checks for its markup first, so one file serves
   every page. All motion respects the "Pause motion" toggle and the
   OS-level prefers-reduced-motion setting.
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var root = document.documentElement;
  var MOTION_KEY = 'np-motion';
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  root.classList.add('np-js');

  // ---------- tiny DOM helper ----------
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function dots() {
    var wrap = el('span', 'np-dots');
    wrap.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 3; i++) wrap.appendChild(el('i'));
    return wrap;
  }
  function copyButton(extraClass) {
    var btn = el('button', 'np-copy np-copy-sm' + (extraClass ? ' ' + extraClass : ''));
    btn.type = 'button';
    var icon = el('i', 'far fa-copy');
    icon.setAttribute('aria-hidden', 'true');
    btn.appendChild(icon);
    btn.appendChild(el('span', '', 'Copy'));
    return btn;
  }

  // ---------- motion preference ----------
  function storedMotion() {
    try { return localStorage.getItem(MOTION_KEY); } catch (e) { return null; }
  }
  var sessionOverride = null; // used when localStorage is unavailable
  function isStill() {
    if (sessionOverride !== null) return sessionOverride;
    var s = storedMotion();
    return s ? s === 'off' : reduceQuery.matches;
  }
  var motionListeners = [];
  function onMotionChange(fn) { motionListeners.push(fn); }
  function syncMotionClass() {
    root.classList.toggle('np-still', isStill());
    motionListeners.forEach(function (fn) { fn(isStill()); });
  }
  root.classList.toggle('np-still', isStill());

  function inView(target, fn, margin) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { io.disconnect(); fn(); }
      });
    }, { rootMargin: margin || '0px 0px -12% 0px' });
    io.observe(target);
  }

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  // ---------- hero: dithered, drifting light field ----------
  function initHeroDither() {
    var canvas = document.querySelector('.np-hero-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var CELL = 6;
    var bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    var w = 0, h = 0, img = null, raf = 0, visible = true, last = 0;
    var t0 = performance.now();

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.ceil(r.width / CELL));
      h = Math.max(1, Math.ceil(r.height / CELL));
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
    }

    function draw(now) {
      var t = (now - t0) / 1000 * 0.16;
      var aspect = h / w;
      var blobs = [
        [0.74 + 0.10 * Math.sin(t * 1.3), (0.42 + 0.18 * Math.cos(t * 0.9)) * aspect, 0.20],
        [0.52 + 0.16 * Math.cos(t * 0.7), (0.78 + 0.14 * Math.sin(t * 1.1)) * aspect, 0.15],
        [0.93 + 0.06 * Math.sin(t * 0.5), (0.12 + 0.10 * Math.cos(t * 1.7)) * aspect, 0.13]
      ];
      var d = img.data;
      for (var y = 0; y < h; y++) {
        var ny = y / w;
        for (var x = 0; x < w; x++) {
          var nx = x / w;
          var v = 0;
          for (var b = 0; b < 3; b++) {
            var dx = nx - blobs[b][0], dy = ny - blobs[b][1], r = blobs[b][2];
            v += Math.exp(-(dx * dx + dy * dy) / (r * r));
          }
          v += 0.12 * Math.sin(nx * 9 + ny * 6 + t * 4);
          var threshold = (bayer[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
          var i = (y * w + x) * 4;
          d[i] = 201; d[i + 1] = 243; d[i + 2] = 29;
          d[i + 3] = v > threshold ? Math.min(255, 50 + v * 120) : 0;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps is plenty for a slow drift
      last = now;
      draw(now);
    }
    function start() {
      if (raf || isStill() || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; }

    resize();
    draw(t0 + 4000);
    start();

    window.addEventListener('resize', function () { resize(); draw(performance.now()); });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }).observe(canvas);
    }
    onMotionChange(function (still) { still ? stop() : start(); });
  }

  // ---------- hero headline: decode / scramble ----------
  function initScramble() {
    var heading = document.querySelector('[data-np-scramble]');
    if (!heading || isStill()) return;
    var parts = [];
    var walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) parts.push({ node: node, text: node.nodeValue });
    var full = parts.map(function (p) { return p.text; }).join('');
    var glyphs = '01<>/_#%&*+=[]{}';

    function restore() {
      parts.forEach(function (p) { p.node.nodeValue = p.text; });
      heading.style.minHeight = '';
      heading.removeAttribute('aria-label');
    }

    function paint(revealed, now) {
      var tick = Math.floor(now / 55);
      var offset = 0;
      parts.forEach(function (p) {
        var out = '';
        for (var i = 0; i < p.text.length; i++) {
          var gi = offset + i;
          var c = p.text[i];
          out += (gi < revealed || /\s/.test(c)) ? c : glyphs[(gi * 7 + tick * 13) % glyphs.length];
        }
        offset += p.text.length;
        p.node.nodeValue = out;
      });
    }

    heading.setAttribute('aria-label', full.replace(/\s+/g, ' ').trim());
    heading.style.minHeight = heading.offsetHeight + 'px';
    paint(0, performance.now());

    var start = performance.now();
    var perChar = 26, lead = 350;
    function frame(now) {
      var revealed = Math.floor((now - start - lead) / perChar);
      if (revealed >= full.length) { restore(); return; }
      paint(revealed, now);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- animated numbers ----------
  function initCounters() {
    document.querySelectorAll('[data-np-count]').forEach(function (counter) {
      var target = parseFloat(counter.getAttribute('data-np-count')) || 0;
      if (isStill()) { counter.textContent = target; return; }
      counter.textContent = '0';
      inView(counter, function () {
        var start = performance.now(), duration = 1800;
        function frame(now) {
          var p = clamp((now - start) / duration, 0, 1);
          var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          counter.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }, '0px');
    });
  }

  // ---------- project cards: index tag + hover arrow ----------
  function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(function (card, i) {
      var media = card.querySelector('.project-card-media');
      if (!media || media.querySelector('.np-card-arrow')) return;
      // Fallback thumbnails already show a big number, so skip the tag there.
      if (!media.querySelector('.project-thumb-fallback')) {
        var tag = el('span', 'np-card-index', (i < 9 ? '0' : '') + (i + 1));
        tag.setAttribute('aria-hidden', 'true');
        media.appendChild(tag);
      }
      var arrow = el('span', 'np-card-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.appendChild(el('i', 'far fa-arrow-right'));
      media.appendChild(arrow);
    });
  }

  // ---------- scroll-linked: progress bar + timeline fill ----------
  function initScrollEffects() {
    var bar = el('div', 'np-progress');
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var timelines = Array.prototype.map.call(document.querySelectorAll('.timeline-wrap'), function (wrap) {
      var fill = el('span', 'np-tl-fill');
      fill.setAttribute('aria-hidden', 'true');
      wrap.appendChild(fill);
      return { wrap: wrap, fill: fill, items: wrap.querySelectorAll('.timeline-item') };
    });

    var queued = false;
    function update() {
      queued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0) + ')';

      var line = window.innerHeight * 0.65;
      timelines.forEach(function (tl) {
        var r = tl.wrap.getBoundingClientRect();
        var p = isStill() ? 1 : clamp((line - r.top) / r.height, 0, 1);
        tl.fill.style.transform = 'scaleY(' + p + ')';
        var reach = p * r.height;
        tl.items.forEach(function (item) {
          item.classList.toggle('is-lit', item.offsetTop + 10 <= reach);
        });
      });
    }
    function queue() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    onMotionChange(queue);
    update();
  }

  // ---------- copy to clipboard ----------
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = el('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }

  var liveRegion;
  function announce(msg) {
    if (!liveRegion) {
      liveRegion = el('div', 'np-sr-only');
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = '';
    setTimeout(function () { liveRegion.textContent = msg; }, 30);
  }

  function bindCopyButton(btn, getText) {
    var label = btn.querySelector('span');
    var original = label ? label.textContent : '';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      copyText(getText()).then(function () {
        btn.classList.add('is-copied');
        if (label) label.textContent = 'Copied';
        announce('Copied to clipboard');
        setTimeout(function () {
          btn.classList.remove('is-copied');
          if (label) label.textContent = original;
        }, 1600);
      }, function () { announce('Copy failed'); });
    });
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-np-copy]').forEach(function (btn) {
      bindCopyButton(btn, function () { return btn.getAttribute('data-np-copy'); });
    });
  }

  // ---------- case studies: code window bars ----------
  function initCodeBlocks() {
    document.querySelectorAll('.code-block').forEach(function (block) {
      if (block.querySelector('.np-code-bar')) return;
      var lang = block.querySelector('.code-lang');
      var code = block.querySelector('code');
      var bar = el('div', 'np-code-bar');
      bar.appendChild(dots());
      bar.appendChild(el('span', 'np-code-title', lang ? lang.textContent.trim() : 'code'));
      if (lang) lang.remove();
      if (code) {
        var btn = copyButton();
        bar.appendChild(btn);
        bindCopyButton(btn, function () { return code.textContent; });
      }
      block.classList.add('np-code-window');
      block.insertBefore(bar, block.firstChild);
    });

    document.querySelectorAll('.query-table pre').forEach(function (pre) {
      var cell = pre.parentElement;
      var code = pre.querySelector('code') || pre;
      var btn = copyButton('np-copy-corner');
      btn.setAttribute('aria-label', 'Copy query');
      cell.classList.add('np-copy-host');
      cell.appendChild(btn);
      bindCopyButton(btn, function () { return code.textContent; });
    });
  }

  // ---------- case studies: typed terminal walkthroughs ----------
  function initTerminals() {
    document.querySelectorAll('[data-np-terminal]').forEach(function (term) {
      if (isStill()) return;
      var lines = Array.prototype.slice.call(term.querySelectorAll('.np-t-line'));
      term.setAttribute('data-armed', '');

      inView(term, function () {
        var caret = el('span', 'np-t-caret');
        caret.setAttribute('aria-hidden', 'true');
        var i = 0;

        function next() {
          if (i >= lines.length) { caret.remove(); return; }
          var line = lines[i++];
          if (line.getAttribute('data-kind') !== 'cmd') {
            line.classList.add('is-shown');
            setTimeout(next, 260);
            return;
          }
          var text = line.textContent;
          line.textContent = '';
          line.classList.add('is-shown');
          line.appendChild(caret);
          var c = 0;
          (function type() {
            if (c >= text.length) { setTimeout(next, 380); return; }
            caret.insertAdjacentText('beforebegin', text[c++]);
            setTimeout(type, 24 + Math.random() * 30);
          })();
        }
        setTimeout(next, 250);
      }, '0px 0px -20% 0px');
    });
  }

  // ---------- case studies: "On this page" table of contents ----------
  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function initToc() {
    var content = document.querySelector('.project-details-content');
    var info = document.querySelector('.project-details-info');
    if (!content || !info) return;
    var heads = content.querySelectorAll('h3');
    if (heads.length < 3) return;

    var nav = el('nav', 'np-toc');
    nav.setAttribute('aria-label', 'On this page');
    nav.appendChild(el('span', 'np-toc-title', 'On this page'));
    var list = el('ol');
    var links = [];

    heads.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent);
      var li = el('li');
      var a = el('a', '', h.textContent);
      a.href = '#' + h.id;
      li.appendChild(a);
      list.appendChild(li);
      links.push(a);
    });
    nav.appendChild(list);
    info.parentElement.appendChild(nav);

    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  // ---------- pause-motion toggle ----------
  function initMotionToggle() {
    var btn = el('button', 'np-motion-toggle');
    btn.type = 'button';
    var dot = el('span', 'np-motion-dot');
    dot.setAttribute('aria-hidden', 'true');
    var label = el('span');
    btn.appendChild(dot);
    btn.appendChild(label);

    function render() {
      var still = isStill();
      btn.setAttribute('aria-pressed', still ? 'true' : 'false');
      label.textContent = still ? 'Play motion' : 'Pause motion';
    }
    btn.addEventListener('click', function () {
      var nextStill = !isStill();
      try {
        localStorage.setItem(MOTION_KEY, nextStill ? 'off' : 'on');
      } catch (e) {
        sessionOverride = nextStill;
      }
      syncMotionClass();
      render();
    });
    render();
    document.body.appendChild(btn);
  }

  // ---------- boot ----------
  initHeroDither();
  initScramble();
  initCounters();
  initProjectCards();
  initScrollEffects();
  initCopyButtons();
  initCodeBlocks();
  initTerminals();
  initToc();
  initMotionToggle();
})();
