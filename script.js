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
    const thcEl = document.querySelector('.thc');
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
      ? [
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
          {
            mode: 'Algo muda', kind: 'Algo mudou', observed: true,
            context: 'Acme Payments · #receita',
            entry: 'Slack · #receita · termos de renovação acordados',
            rows: [['Observado, não autorizado','a observação não implica promoção','done'],
                   ['Contexto reunido','relacionado a Northstar Revenue','done'],
                   ['Trabalho governado preparado','Operação draft.on · aguardando','done'],
                   ['Aguardando uma pessoa','nada roda sem autoridade','held']],
            draft: true,
          },
        ]
      : [
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
          {
            mode: 'Something changes', kind: 'Something changed', observed: true,
            context: 'Acme Payments · #revenue',
            entry: 'Slack · #revenue · renewal terms agreed',
            rows: [['Observed, not authorized','observation does not imply promotion','done'],
                   ['Context assembled','related to Northstar Revenue','done'],
                   ['Governed work prepared','Operation draft.on · awaiting','done'],
                   ['Waiting on a person','nothing runs without authority','held']],
            draft: true,
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
        if (s.artifact) at(after + 500, () => artEl && artEl.classList.add('is-visible'));
        if (s.draft) at(after + 400, () => draftEl && draftEl.classList.add('is-visible'));
        at(after + (s.artifact ? 4600 : 4400), next);
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

  const boot = () => {
    initInviteForm();
    initNavToggle();
    initReveal();
    initBeforeAfter();
    initHeroComposer();
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
