/* pajoma® Landing Page – kleine Interaktionen, ohne Abhängigkeiten */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navigation: Scroll-Zustand & Mobilmenü ---------- */
  var nav = document.querySelector('[data-nav]');
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-menu]');

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    if (open) {
      // Menü direkt unter der Navigation beginnen lassen (Ankündigungsleiste kann darüber liegen)
      doc.style.setProperty('--nav-bottom', Math.round(nav.getBoundingClientRect().bottom) + 'px');
    }
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger && nav && menu) {
    burger.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
    });
    window.matchMedia('(min-width: 1181px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Aktiver Menüpunkt beim Scrollen ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links > a[href^="#"]'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Wechselnde Zielgruppe im Hero ---------- */
  var rotator = document.querySelector('[data-rotator] .rotator__word');
  if (rotator && !reduceMotion) {
    var words = ['Concept Stores', 'Geschenkeläden', 'Floristen', 'Gartencenter', 'Einrichtungshäuser', 'Onlinehändler'];
    var i = 0;
    setInterval(function () {
      rotator.classList.add('is-out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        rotator.textContent = words[i];
        rotator.classList.remove('is-out');
      }, 300);
    }, 2600);
  }

  /* ---------- Sanftes Einblenden beim Scrollen ---------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var targets = document.querySelectorAll(
      '.hcard, .section__head, .split, .timeline li, .tile, .quality__copy, .quality__media, ' +
      '.features li, .pl__media, .pl__copy, .brand, .leader, .person, .depts, .career, .showroom, .b2b__head, .b2b__card, .contactbar'
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('is-in');
          io.unobserve(el);
          // Verzögerung danach entfernen, damit Hover-Effekte nicht nachhängen
          setTimeout(function () { el.style.transitionDelay = ''; }, 1200);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) {
      // kleine Staffelung innerhalb einer Gruppe
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(el.tagName.toLowerCase() + '.' + el.classList[0]); });
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
      el.setAttribute('data-reveal', '');
      io.observe(el);
    });
  }

  /* ---------- Jahr im Footer ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
