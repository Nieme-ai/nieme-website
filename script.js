(() => {
  // Create a free Formspree or Basin endpoint and paste it here.
  const FORM_ENDPOINT = "https://formspree.io/f/xkolkqqn";
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPortuguese = document.documentElement.lang.toLowerCase() === 'pt-br';
  const interfaceCopy = isPortuguese
    ? {
        inviteSuccess: 'Você está na lista. Os convites são enviados em etapas.',
        inviteError: 'Algo deu errado. Tente novamente em um minuto.',
      }
    : {
        inviteSuccess: 'You are on the list. Invites go out in waves.',
        inviteError: 'Something went wrong. Try again in a minute.',
      };

  const initInviteForm = () => {
    const form = document.querySelector('#invite-form');
    const email = form?.querySelector('input[type="email"]');
    const button = form?.querySelector('button[type="submit"]');
    const status = form?.querySelector('.invite-status');

    document.querySelectorAll('[data-invite-trigger]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        form?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        email?.focus({ preventScroll: true });
      });
    });

    if (!form || !button || !status) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }

      button.disabled = true;
      status.textContent = '';

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Invite request failed');
        }

        form.reset();
        status.textContent = interfaceCopy.inviteSuccess;
      } catch {
        status.textContent = interfaceCopy.inviteError;
      } finally {
        button.disabled = false;
      }
    });
  };

  const initNavToggle = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav nav');
    if (!toggle || !nav) {
      return;
    }

    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a, button').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        close();
      }
    });
  };

  const addMotionReady = () => {
    document.body.classList.add('motion-ready');
  };

  const initAnimationActivity = () => {
    const animatedRegions = Array.from(document.querySelectorAll('.hero, .nav, .runtime-intelligence'));

    const syncDocumentMotion = () => {
      document.body.classList.toggle('animations-paused', document.hidden);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-animation-active', entry.isIntersecting);
        });
      }, { threshold: 0.01 });
      animatedRegions.forEach((region) => observer.observe(region));
    } else {
      animatedRegions.forEach((region) => region.classList.add('is-animation-active'));
    }

    document.addEventListener('visibilitychange', syncDocumentMotion);
    syncDocumentMotion();
  };

  const initReveal = () => {
    const sections = Array.from(document.querySelectorAll('main > section:not(.hero)'));
    if (!sections.length) {
      return;
    }

    sections.forEach((section) => section.classList.add('reveal'));

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);

        if (!document.querySelector('main > section.reveal:not(.is-visible)')) {
          observer.disconnect();
        }
      }
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
  };

  const initBeforeAfter = () => {
    const section = document.querySelector('.before-after');
    if (section) section.classList.add('is-arguing');
  };

  const initHeroComposer = () => {
    const thcEl = document.querySelector('.rtc');
    const textEl = document.querySelector('.thc-text');
    if (!thcEl || !textEl) return;

    const ctxEl     = thcEl.querySelector('.thc-context-val');
    const modeEl    = thcEl.querySelector('.hero-composer-mode');
    const entryEl   = thcEl.querySelector('.stg-entry');
    const entryKind = thcEl.querySelector('.stg-entry-kind');
    const entryText = thcEl.querySelector('.stg-entry-text');
    const rowEls    = Array.from(thcEl.querySelectorAll('.stg-row'));
    const artEl     = thcEl.querySelector('.thc-artifact');
    const artName   = thcEl.querySelector('.thc-artifact-name');
    const artMeta   = thcEl.querySelector('.thc-artifact-meta');
    const artPrev   = thcEl.querySelector('.thc-artifact-preview');
    const draftEl   = thcEl.querySelector('.composer-draft-unfold');

    const isPortuguese = document.documentElement.lang === 'pt-BR';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Both entry modes run the same arc: Context -> governed work -> authority -> execution.
    // What differs is where authority comes from, and therefore whether anything runs.
    const scenes = isPortuguese
      ? [          {
            mode: 'Algo muda', kind: 'Algo mudou', observed: true,
            context: 'Acme Payments · #receita',
            entry: 'Slack · #receita · termos de renovação acordados',
            rows: [['Observado, não autorizado','a observação não implica promoção','done'],
                   ['Contexto reunido','relacionado a Northstar Revenue','done'],
                   ['Trabalho governado preparado','Operação draft.on · aguardando','done'],
                   ['Aguardando uma pessoa','nada roda sem autoridade','held']],
            draft: true,
          },

          {
            mode: 'Alguém pede', kind: 'Alguém pediu',
            context: 'Northstar Revenue · 3 fontes',
            prompt: 'Refaça a previsão de receita do T3 sobre os termos de renovação aprovados e prepare o brief da liderança.',
            entry: 'Refazer a previsão de receita do T3 e preparar o brief da liderança',
            rows: [['Contexto reunido','Northstar Revenue · 3 fontes','done'],
                   ['Trabalho governado preparado','Operação draft.on · 2 entregáveis','done'],
                   ['Autorizado','por uma pessoa · Financeiro','done'],
                   ['Executando','previsão e brief em produção','running']],
            artifact: {name:'previsao-receita-T3.xlsx', meta:'Planilha · 5 abas · 48 KB',
              rows:['Trimestre','Contratado','Δ renovação','T1','1.240.000','—','T2','1.310.000','—','T3','1.546.000','+18%']},
          },
        ]
      : [          {
            mode: 'Something changes', kind: 'Something changed', observed: true,
            context: 'Acme Payments · #revenue',
            entry: 'Slack · #revenue · renewal terms agreed',
            rows: [['Observed, not authorized','observation does not imply promotion','done'],
                   ['Context assembled','related to Northstar Revenue','done'],
                   ['Governed work prepared','Operation draft.on · awaiting','done'],
                   ['Waiting on a person','nothing runs without authority','held']],
            draft: true,
          },

          {
            mode: 'Someone asks', kind: 'Someone asked',
            context: 'Northstar Revenue · 3 sources',
            prompt: 'Rework the Q3 revenue forecast on the approved renewal terms and brief leadership.',
            entry: 'Rework the Q3 revenue forecast and brief leadership',
            rows: [['Context assembled','Northstar Revenue · 3 sources','done'],
                   ['Governed work prepared','Operation draft.on · 2 deliverables','done'],
                   ['Authorized','by a person · Finance','done'],
                   ['Executing','forecast and brief in production','running']],
            artifact: {name:'q3-revenue-forecast.xlsx', meta:'Spreadsheet · 5 sheets · 48 KB',
              rows:['Quarter','Contracted','Renewal Δ','Q1','1,240,000','—','Q2','1,310,000','—','Q3','1,546,000','+18%']},
          },
        ];

    const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
    let timers = [];
    const at = (ms, fn) => { timers.push(setTimeout(fn, ms)); };
    const clearAll = () => { timers.forEach(clearTimeout); timers = []; };

    const dress = (i) => {
      const s = scenes[i];
      thcEl.dataset.scene = String(i);
      if (modeEl) modeEl.textContent = s.mode;
      if (ctxEl) ctxEl.textContent = s.context;
      if (entryKind) entryKind.textContent = s.kind;
      if (entryText) entryText.textContent = s.entry;
      rowEls.forEach((el, n) => {
        const r = s.rows[n] || ['', '', ''];
        el.querySelector('.stg-label').textContent = r[0];
        el.querySelector('.stg-meta').textContent = r[1];
        el.dataset.end = r[2];
      });
      if (s.artifact) {
        if (artName) artName.textContent = s.artifact.name;
        if (artMeta) artMeta.textContent = s.artifact.meta;
        if (artPrev) artPrev.innerHTML = s.artifact.rows.map((x) => '<span>' + x + '</span>').join('');
      }
    };

    const clearStage = () => {
      entryEl && entryEl.classList.remove('is-visible');
      rowEls.forEach((el) => el.classList.remove('is-visible', 'is-done', 'is-running', 'is-held'));
      artEl && artEl.classList.remove('is-visible');
      draftEl && draftEl.classList.remove('is-visible');
      textEl.textContent = '';
      thcEl.classList.add('is-empty');
      thcEl.classList.remove('is-armed');
    };

    if (prefersReducedMotion) {
      dress(0);
      entryEl && entryEl.classList.add('is-visible');
      rowEls.forEach((el) => el.classList.add('is-visible', el.dataset.end === 'running' ? 'is-running' : 'is-done'));
      artEl && artEl.classList.add('is-visible');
      return;
    }

    let sceneIdx = 0;

    const runScene = () => {
      clearAll();
      clearStage();
      dress(sceneIdx);
      const s = scenes[sceneIdx];

      // the arc: one row at a time, each settling into its real end state
      const runRows = () => {
        rowEls.forEach((el, n) => {
          at(300 + n * 780, () => {
            el.classList.add('is-visible');
            at(430, () => {
              const end = el.dataset.end;
              el.classList.add(end === 'running' ? 'is-running' : end === 'held' ? 'is-held' : 'is-done');
            });
          });
        });
        const after = 300 + rowEls.length * 780;
        // execution produces something; an unauthorized observation produces a Draft and stops
        if (s.artifact) {
          at(after + 500, () => artEl && artEl.classList.add('is-visible'));
          at(after + 3900, () => artEl && artEl.classList.remove('is-visible'));
        }
        if (s.draft) at(after + 400, () => draftEl && draftEl.classList.add('is-visible'));
        at(after + (s.artifact ? 4800 : 4600), next);
      };

      const send = () => {
        textEl.textContent = '';
        thcEl.classList.add('is-empty');
        thcEl.classList.remove('is-armed');
        entryEl && entryEl.classList.add('is-visible');
        at(420, runRows);
      };

      if (s.prompt) {
        // someone asks: it is typed, then sent
        let ch = 0;
        const type = () => {
          if (ch < s.prompt.length) {
            ch += 1;
            textEl.textContent = s.prompt.slice(0, ch);
            thcEl.classList.remove('is-empty');
            thcEl.classList.add('is-armed');
            timers.push(setTimeout(type, rand(30, 48)));
          } else {
            at(620, send);
          }
        };
        at(500, type);
      } else {
        // something changes: nobody typed anything — the observation simply arrives
        at(600, () => {
          entryEl && entryEl.classList.add('is-visible');
          at(460, runRows);
        });
      }

      const next = () => {
        entryEl && entryEl.classList.remove('is-visible');
        rowEls.forEach((el) => el.classList.remove('is-visible'));
        artEl && artEl.classList.remove('is-visible');
        draftEl && draftEl.classList.remove('is-visible');
        at(620, () => { sceneIdx = (sceneIdx + 1) % scenes.length; runScene(); });
      };
    };

    at(700, runScene);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearAll();
      else at(200, runScene);
    });
  };


  // ==========================================================================
  // The Runtime orb. A real 3D projection on a 2D canvas — no library.
  // Work streams IN from the systems it already lives in, is processed inside
  // the core, and leaves again as governed work. The loop is the point: Nieme
  // is not a sink, it is an incubator.
  // ==========================================================================
  const initOrb = () => {
    const host = document.querySelector('[data-orb]');
    if (!host) return;
    const canvas = host.querySelector('.orb-canvas');
    const nodeEls = Array.from(host.querySelectorAll('[data-orb-node]'));
    const outEls = Array.from(host.querySelectorAll('[data-orb-out]'));
    if (!canvas || !nodeEls.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, R = 0, LR = 1.95;

    const fit = () => {
      const r = host.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(320, r.width); H = Math.max(320, r.height);
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx = W / 2; cy = H / 2;
      R = Math.min(W, H) * 0.305;            // the sphere
      // labels orbit further out than the shell — pull them in on narrow screens
      // or they swing past the edge and widen the page
      LR = W < 560 ? 1.42 : W < 820 ? 1.68 : 1.95;
      return true;
    };

    // ---- a fibonacci sphere: the Runtime's own surface ----
    const SHELL = 460;
    const shell = [];
    for (let i = 0; i < SHELL; i++) {
      const k = i + 0.5;
      const phi = Math.acos(1 - 2 * k / SHELL);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      shell.push([Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)]);
    }

    // ---- the systems sit on a wider sphere and orbit with it ----
    const ringPoint = (i, n, lift) => {
      const a = (i / n) * Math.PI * 2;
      return [Math.cos(a), lift, Math.sin(a)];
    };
    const nodes = nodeEls.map((el, i) => ({ el, p: ringPoint(i, nodeEls.length, i % 2 ? 0.34 : -0.34) }));
    const outs = outEls.map((el, i) => ({ el, p: ringPoint(i + 0.5, outEls.length, i % 2 ? 0.72 : -0.72) }));

    const rot = (p, a, b) => {                 // yaw then pitch
      const [x, y, z] = p;
      const x1 = x * Math.cos(a) - z * Math.sin(a);
      const z1 = x * Math.sin(a) + z * Math.cos(a);
      const y1 = y * Math.cos(b) - z1 * Math.sin(b);
      const z2 = y * Math.sin(b) + z1 * Math.cos(b);
      return [x1, y1, z2];
    };
    const project = (p, radius) => {
      const d = 3.1;                            // perspective
      const s = d / (d - p[2]);
      return { x: cx + p[0] * radius * s, y: cy + p[1] * radius * s, s, z: p[2] };
    };

    // ---- traffic: in from a system, processed, out as governed work ----
    const TRAFFIC = 46;
    const traffic = [];
    const spawn = (seed) => {
      const inbound = Math.random() < 0.58;
      const from = nodes[(Math.random() * nodes.length) | 0];
      const to = outs[(Math.random() * outs.length) | 0];
      return {
        t: seed ? Math.random() : 0,
        speed: 0.0022 + Math.random() * 0.0026,
        inbound,
        a: inbound ? from.p : [0, 0, 0],
        b: inbound ? [0, 0, 0] : to.p,
        wob: Math.random() * Math.PI * 2,
      };
    };
    for (let i = 0; i < TRAFFIC; i++) traffic.push(spawn(true));

    let yaw = 0.6, pitch = -0.22, t0 = 0, raf = 0, visible = true;

    const draw = (ms) => {
      const dt = t0 ? Math.min(48, ms - t0) : 16; t0 = ms;
      if (!reduce) yaw += dt * 0.00011;
      const beat = 0.5 + 0.5 * Math.sin(ms * 0.0016);   // the core's pulse

      ctx.clearRect(0, 0, W, H);

      // sphere shell, depth-sorted so the far side reads as far
      const pts = shell.map((p) => project(rot(p, yaw, pitch), R)).sort((a, b) => a.z - b.z);
      for (const p of pts) {
        const near = (p.z + 1) / 2;
        ctx.globalAlpha = 0.09 + near * 0.52;
        ctx.fillStyle = near > 0.55 ? '#b9a6ff' : '#5f4dbd';
        ctx.beginPath(); ctx.arc(p.x, p.y, 0.6 + near * 1.7, 0, 6.283); ctx.fill();
      }

      // the core, breathing
      ctx.globalAlpha = 1;
      const coreR = R * (0.42 + beat * 0.06);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.6);
      g.addColorStop(0, 'rgba(168,140,255,' + (0.55 + beat * 0.26) + ')');
      g.addColorStop(0.34, 'rgba(120,92,240,0.24)');
      g.addColorStop(0.66, 'rgba(70,190,190,0.09)');
      g.addColorStop(1, 'rgba(96,74,214,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 2.6, 0, 6.283); ctx.fill();

      // the sphere's own horizon
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(150,120,255,' + (0.16 + beat * 0.1) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.02, 0, 6.283); ctx.stroke();

      // traffic in and out
      for (const m of traffic) {
        m.t += reduce ? 0 : m.speed * (dt / 16);
        if (m.t >= 1) { Object.assign(m, spawn(false)); continue; }
        const e = m.inbound ? m.t * m.t : 1 - (1 - m.t) * (1 - m.t);   // accelerate in, ease out
        const w = Math.sin(m.t * Math.PI) * 0.12;
        const p = [
          m.a[0] + (m.b[0] - m.a[0]) * e + Math.cos(m.wob) * w,
          m.a[1] + (m.b[1] - m.a[1]) * e + Math.sin(m.wob) * w,
          m.a[2] + (m.b[2] - m.a[2]) * e,
        ];
        const q = project(rot(p, yaw, pitch), R * LR);
        const near = (q.z + 1) / 2;
        const fade = Math.sin(m.t * Math.PI);
        ctx.globalAlpha = (0.25 + near * 0.75) * fade;
        ctx.fillStyle = m.inbound ? '#7ee7ff' : '#c4b5fd';
        ctx.shadowBlur = 8 + near * 8; ctx.shadowColor = m.inbound ? '#7ee7ff' : '#c4b5fd';
        ctx.beginPath(); ctx.arc(q.x, q.y, 1.5 + near * 1.9, 0, 6.283); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // labels ride the same rotation, and dim when they go behind
      for (const n of nodes.concat(outs)) {
        const q = project(rot(n.p, yaw, pitch), R * LR);
        const near = (q.z + 1) / 2;
        n.el.style.transform = 'translate(-50%,-50%) translate(' + q.x.toFixed(1) + 'px,' + q.y.toFixed(1) + 'px)';
        n.el.style.opacity = (0.1 + near * 0.9).toFixed(2);
        // a label on the far side belongs BEHIND the core, not across its name
        n.el.style.zIndex = String(near > 0.52 ? 12 + Math.round(near * 8) : 4);
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!raf && visible) raf = requestAnimationFrame(draw); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; t0 = 0; };

    fit();
    if (reduce) { draw(0); stop(); } else { start(); }

    let rt = null;
    window.addEventListener('resize', () => {
      clearTimeout(rt); rt = setTimeout(() => { fit(); if (reduce) { stop(); draw(0); stop(); } }, 160);
    });
    // never burn a frame off-screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
        if (!reduce) { visible ? start() : stop(); }
      }, { threshold: 0.05 }).observe(host);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else if (!reduce) start();
    });
  };

  const boot = () => {
    initInviteForm();
    initNavToggle();
    initReveal();
    initBeforeAfter();
    initHeroComposer();
    initOrb();
    initAnimationActivity();

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(addMotionReady, { timeout: 500 });
    } else {
      window.setTimeout(addMotionReady, 0);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
