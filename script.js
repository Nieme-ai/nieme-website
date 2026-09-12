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

    const ctxEl      = thcEl.querySelector('.thc-context-val');
    const modeEl     = thcEl.querySelector('.hero-composer-mode');
    const youTurn    = thcEl.querySelector('.thc-turn--you');
    const youTextEl  = thcEl.querySelector('.thc-you-text');
    const theonTurn  = thcEl.querySelector('.thc-turn--theon');
    const mdEl       = thcEl.querySelector('.thc-md');
    const artName    = thcEl.querySelector('.thc-artifact-name');
    const artMeta    = thcEl.querySelector('.thc-artifact-meta');
    const artPrev    = thcEl.querySelector('.thc-artifact-preview');
    const draftEl    = thcEl.querySelector('.composer-draft-unfold');

    const isPortuguese = document.documentElement.lang === 'pt-BR';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Three chat interactions, each showing a different Composer capability:
    //   0  a thread summarised, answered in structured markdown
    //   1  a request that produces an Artifact, previewed in the chat
    //   2  the Composer armed as an Operation surface, producing a draft.on
    const scenes = isPortuguese
      ? [
          {
            mode: 'Resumir uma conversa',
            context: 'Acme Payments · #receita',
            prompt: 'Resuma a thread do #receita de hoje de manhã.',
            md: '<strong>Três coisas se moveram.</strong><ul>'
              + '<li>Os termos de renovação da Acme Payments fecharam com 18% de aumento</li>'
              + '<li>O Financeiro quer a previsão do T3 refeita sobre os novos termos</li>'
              + '<li>Ninguém assumiu o brief da liderança ainda</li></ul>'
              + '<em>34 mensagens em #receita, 07:12–09:40.</em>',
          },
          {
            mode: 'Produzir um entregável',
            context: 'Northstar Revenue · 3 fontes',
            prompt: 'Monte a previsão de receita do T3 sobre os termos aprovados.',
            md: '<strong>Pronto.</strong> Cinco abas, com os termos de renovação aplicados em todos os trimestres.',
            artifact: {
              name: 'previsao-receita-T3.xlsx',
              meta: 'Planilha · 5 abas · 48 KB',
              rows: ['Trimestre','Contratado','Δ renovação','T1','1.240.000','—','T2','1.310.000','—','T3','1.546.000','+18%'],
            },
          },
          {
            mode: 'Lançar uma Operação',
            context: 'Northstar Revenue · 3 fontes',
            operation: true,
            slash: '/operation',
            prompt: 'Atualizar a previsão de receita do T3 e preparar o brief da liderança',
            draft: true,
          },
        ]
      : [
          {
            mode: 'Summarize a thread',
            context: 'Acme Payments · #revenue',
            prompt: 'Summarize the #revenue thread from this morning.',
            md: '<strong>Three things moved.</strong><ul>'
              + '<li>Renewal terms for Acme Payments closed at an 18% uplift</li>'
              + '<li>Finance wants the Q3 forecast reworked on the new terms</li>'
              + '<li>Nobody has owned the leadership brief yet</li></ul>'
              + '<em>34 messages in #revenue, 07:12–09:40.</em>',
          },
          {
            mode: 'Produce a deliverable',
            context: 'Northstar Revenue · 3 sources',
            prompt: 'Build the Q3 revenue forecast on the approved terms.',
            md: '<strong>Done.</strong> Five sheets, with the renewal terms carried into every quarter.',
            artifact: {
              name: 'q3-revenue-forecast.xlsx',
              meta: 'Spreadsheet · 5 sheets · 48 KB',
              rows: ['Quarter','Contracted','Renewal Δ','Q1','1,240,000','—','Q2','1,310,000','—','Q3','1,546,000','+18%'],
            },
          },
          {
            mode: 'Launch an Operation',
            context: 'Northstar Revenue · 3 sources',
            operation: true,
            slash: '/operation',
            prompt: 'Update the Q3 revenue forecast and prepare a leadership brief',
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
      if (mdEl) mdEl.innerHTML = s.md || '';
      if (s.artifact) {
        if (artName) artName.textContent = s.artifact.name;
        if (artMeta) artMeta.textContent = s.artifact.meta;
        if (artPrev) artPrev.innerHTML = s.artifact.rows.map((r) => '<span>' + r + '</span>').join('');
      }
    };

    const resetStage = () => {
      textEl.textContent = '';
      if (youTextEl) youTextEl.textContent = '';
      youTurn && youTurn.classList.remove('is-visible');
      theonTurn && theonTurn.classList.remove('is-visible');
      draftEl && draftEl.classList.remove('is-visible');
      thcEl.classList.add('is-empty');
      thcEl.classList.remove('is-armed');
    };

    if (prefersReducedMotion) {
      dress(2);
      if (youTextEl) youTextEl.textContent = scenes[2].prompt;
      youTurn && youTurn.classList.add('is-visible');
      draftEl && draftEl.classList.add('is-visible');
      thcEl.classList.remove('is-empty');
      return;
    }

    let sceneIdx = 0;

    const runScene = () => {
      clearAll();
      resetStage();
      dress(sceneIdx);
      const s = scenes[sceneIdx];

      // 1. someone types. An Operation starts by arming the Composer with a
      //    slash command, which the OPERATION strip then consumes — the field
      //    is left carrying only the objective, exactly as the product does.
      const runType = (str, done) => {
        let ch = 0;
        const step = () => {
          if (ch < str.length) {
            ch += 1;
            textEl.textContent = str.slice(0, ch);
            thcEl.classList.remove('is-empty');
            thcEl.classList.add('is-armed');
            timers.push(setTimeout(step, rand(38, 62)));
          } else {
            at(done.delay, done.fn);
          }
        };
        step();
      };

      const type = () => {
        if (s.slash) {
          thcEl.dataset.scene = '';               // un-armed while the command is typed
          runType(s.slash, { delay: 520, fn: () => {
            thcEl.dataset.scene = String(sceneIdx);  // the strip takes the command
            textEl.textContent = '';
            thcEl.classList.add('is-empty');
            at(420, () => runType(s.prompt, { delay: 620, fn: send }));
          } });
        } else {
          runType(s.prompt, { delay: 620, fn: send });
        }
      };

      // 2. it is sent: the prompt leaves the field and enters the transcript
      const send = () => {
        if (youTextEl) youTextEl.textContent = s.prompt;
        youTurn && youTurn.classList.add('is-visible');
        textEl.textContent = '';
        thcEl.classList.add('is-empty');
        thcEl.classList.remove('is-armed');

        if (s.operation) {
          // the Composer is the Operation surface — the draft.on extends it
          at(900, () => draftEl && draftEl.classList.add('is-visible'));
          at(6200, next);
        } else {
          at(800, () => theonTurn && theonTurn.classList.add('is-visible'));
          at(s.artifact ? 6400 : 5600, next);
        }
      };

      const next = () => {
        youTurn && youTurn.classList.remove('is-visible');
        theonTurn && theonTurn.classList.remove('is-visible');
        draftEl && draftEl.classList.remove('is-visible');
        at(560, () => { sceneIdx = (sceneIdx + 1) % scenes.length; runScene(); });
      };

      at(500, type);
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
