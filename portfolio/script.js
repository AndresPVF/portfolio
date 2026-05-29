(function () {
  'use strict';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (reduce) {
    reveals.forEach((el) => el.classList.add('in'));
  } else if (hasST) {
    reveals.forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 86%', once: true, onEnter: () => el.classList.add('in') }));
  } else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = Array.from(document.querySelectorAll('.work-card'));
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    workCards.forEach((c) => c.classList.toggle('hidden', !(f === 'all' || c.dataset.category === f)));
    if (hasGSAP && !reduce) {
      const vis = workCards.filter((c) => !c.classList.contains('hidden'));
      gsap.fromTo(vis, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', overwrite: true });
    }
  }));

  const toast = document.getElementById('toast');
  let toastT;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 1900);
  }
  function legacyCopy(txt, ok) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.top = '-9999px'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); ok(); } catch (e) {}
    document.body.removeChild(ta);
  }
  function copyText(txt, ok) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok).catch(() => legacyCopy(txt, ok));
    } else legacyCopy(txt, ok);
  }
  document.querySelectorAll('[data-copy]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    copyText(el.getAttribute('data-copy'), () => showToast('✓ Copied: ' + el.getAttribute('data-copy')));
  }));

  const SEQ = { dir: 'frames/', prefix: 'frame_', pad: 4, exts: ['jpg', 'jpeg', 'png', 'webp'], max: 59 };

  const canvas = document.getElementById('seqCanvas');
  const ctx = canvas.getContext('2d');
  const down = document.getElementById('seqDown');
  const vignette = document.querySelector('.seq-vignette');
  const hero = document.getElementById('hero');
  const heroCopy = document.getElementById('heroCopy');
  const titleSpans = heroCopy.querySelectorAll('.hero-title [data-rv]');
  const eyebrow = heroCopy.querySelector('.eyebrow[data-rv]');
  const desc = heroCopy.querySelector('.hero-desc');
  const cta = heroCopy.querySelector('.hero-cta');
  heroCopy.style.opacity = '0';
  let frames = [];
  let cur = -1;
  let frameFrac = 0.7;
  let rT;

  function pad(n) { return SEQ.pad > 0 ? String(n).padStart(SEQ.pad, '0') : String(n); }
  function url(i, ext) { return SEQ.dir + SEQ.prefix + pad(i) + '.' + ext; }
function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.decoding = 'async';

    img.onload = () => resolve(img);

    img.onerror = reject;

    img.src = src;
  });
}
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
  }

  function drawCover(img) {
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    const ir = img.width / img.height, cr = cw / ch;
    let w, h;
    if (ir > cr) { h = ch; w = ch * ir; } else { w = cw; h = cw / ir; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

function draw(i) {
  if (!frames[i]) return;

  drawCover(frames[i]);
}
  function placeholder() {
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    ctx.clearRect(0, 0, cw, ch);
    
     ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 2;
    for (let x = -ch; x < cw; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + ch, ch); ctx.stroke(); }
    ctx.fillStyle = '#ff3b3b'; ctx.textAlign = 'center';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('▶  ADD YOUR FRAME SEQUENCE', cw / 2, ch / 2 - 14);
    ctx.fillStyle = '#5d6571'; ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.fillText('drop images in  /frames/  named  frame_0001.jpg, frame_0002.jpg …', cw / 2, ch / 2 + 14);
  }

  async function detect() {
    for (const ext of SEQ.exts) { try { const im = await loadImg(url(1, ext)); return { ext, first: im }; } catch (e) {} }
    return null;
  }

async function loadAll() {
  const d = await detect();

  if (!d) return 0;

  frames = [];

  frames[0] = d.first;

  draw(0);

  let loaded = 1;

  for (let i = 2; i <= SEQ.max; i++) {
    loadImg(url(i, d.ext))
      .then(img => {
        frames[i - 1] = img;
        loaded++;
      })
      .catch(() => {});
  }

  return loaded;
}

  function showText() {
    gsap.set([eyebrow, desc, cta], { opacity: 1, y: 0 });
    gsap.set(titleSpans, { yPercent: 0, opacity: 1 });
    vignette.style.opacity = '0.9';
  }

  function setupScroll() {
   const last = SEQ.max - 1;
    const state = { f: 0 };
    const vh = innerHeight;
    const framesDur = Math.max(vh * 1.1, frames.length * 14);
    const holdDur = vh * 0.9;
    frameFrac = framesDur / (framesDur + holdDur);

    gsap.set([eyebrow, desc, cta], { opacity: 0, y: 24 });
    gsap.set(titleSpans, { yPercent: 118, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero, start: 'top top',
        end: () => '+=' + (framesDur + holdDur),
        scrub: 0.22, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const hide = self.progress > 0.03;
          down.style.opacity = hide ? '0' : '1';
          down.style.pointerEvents = hide ? 'none' : 'auto';
        }
      }
    });
    tl.to(state, { f: last, ease: 'none', duration: framesDur, onUpdate: () => { const i = Math.round(state.f); if (i !== cur) {
  cur = i;

 if (frames[i]) {
  draw(i);
} else {
  let back = i;

  while (back >= 0 && !frames[back]) {
    back--;
  }

  if (back >= 0) draw(back);
}
} } }, 0);
    tl.to(vignette, { opacity: 0.9, ease: 'none', duration: framesDur * 0.32 }, framesDur * 0.30);
    tl.to(eyebrow, { opacity: 1, y: 0, duration: framesDur * 0.12 }, framesDur * 0.30);
    tl.to(titleSpans, { yPercent: 0, opacity: 1, stagger: framesDur * 0.05, duration: framesDur * 0.18 }, framesDur * 0.40);
    tl.to(desc, { opacity: 1, y: 0, duration: framesDur * 0.14 }, framesDur * 0.62);
    tl.to(cta, { opacity: 1, y: 0, duration: framesDur * 0.14 }, framesDur * 0.74);
    tl.to({}, { duration: holdDur });
  }

  function smoothTo(to, dur) {
    const from = scrollY, t0 = performance.now();
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      scrollTo(0, Math.round(from + (to - from) * p));
      if (p < 1) requestAnimationFrame(step);
      else document.documentElement.style.scrollBehavior = prev;
    })(performance.now());
  }

  if (down) down.addEventListener('click', () => {
    const t = hasST && ScrollTrigger.getAll().find((s) => s.trigger === hero && s.pin);
    if (t) smoothTo(Math.round(t.start + (t.end - t.start) * Math.min(1, frameFrac + 0.02)), Math.max(1300, frames.length * 28));
    else { const w = document.getElementById('work'); smoothTo(Math.round(w.getBoundingClientRect().top + scrollY), 1100); }
  });

  function fit() {
    resize();
    if (frames.length) draw(cur < 0 ? 0 : cur); else placeholder();
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => fit()).observe(canvas);
  addEventListener('resize', () => {
    if (rT) return;
    rT = requestAnimationFrame(() => { rT = 0; if (hasST) ScrollTrigger.refresh(); fit(); });
  }, { passive: true });

async function start() {
  resize();

  const d = await detect();

  if (!d) {
    placeholder();
    return;
  }

  frames = [];
  frames[0] = d.first;

  draw(0);

requestAnimationFrame(() => {
  canvas.classList.add('ready');
  hero.classList.add('ready');

  heroCopy.style.opacity = '1';
  down.style.opacity = '1';
});

  for (let i = 2; i <= SEQ.max; i++) {
    loadImg(url(i, d.ext))
      .then(img => {
        frames[i - 1] = img;
      })
      .catch(() => {});
  }

  if (reduce || !hasST) {
    showText();
    return;
  }

  setupScroll();

  ScrollTrigger.refresh();
}

  start();
})();
