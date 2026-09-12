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
    const textEl = document.querySelector('.thc-text');
    const statusEls = Array.from(document.querySelectorAll('.hero-status-line'));
    const labelEls = Array.from(document.querySelectorAll('.hero-status-label'));
    if (!textEl) return;

    const entryModes = isPortuguese
      ? ['Alguém pede', 'Algo muda', 'Alguém pede', 'Algo muda', 'Alguém pede', 'Algo muda']
      : ['Someone asks', 'Something changes', 'Someone asks', 'Something changes', 'Someone asks', 'Something changes'];

    const prompts = isPortuguese
      ? [
          'Prepare o relatório de receita do terceiro trimestre para a liderança.',
          'Um documento mudou numa pasta conectada do Drive.',
          'Revise tudo o que o time entregou enquanto eu estava fora.',
          'Uma mensagem foi observada num canal selecionado do Slack.',
          'Organize o handoff de implantação da conta nova.',
          'Um pagamento foi confirmado no ERP.',
        ]
      : [
          'Prepare the Q3 revenue brief for leadership.',
          'A document changed in a connected Drive folder.',
          'Review everything the team shipped while I was away.',
          'A message was observed in a selected Slack channel.',
          'Organize the implementation handoff for the new account.',
          'A payment was confirmed in the ERP.',
        ];

    // every prompt carries its own Context and becomes its own draft.on
    const contexts = isPortuguese
      ? [
          'Northstar Revenue · 3 fontes',
          'Acme Payments · Drive',
          'Northstar Revenue · 12 decisões',
          'Acme Payments · #receita',
          'Meridian Rollout · 5 fontes',
          'Acme Payments · Faturamento',
        ]
      : [
          'Northstar Revenue · 3 sources',
          'Acme Payments · Drive',
          'Northstar Revenue · 12 decisions',
          'Acme Payments · #revenue',
          'Meridian Rollout · 5 sources',
          'Acme Payments · Billing',
        ];

    const drafts = isPortuguese
      ? [
          ['Atualizar a previsão de receita do T3 e preparar o brief da liderança', 'Northstar Revenue · Acme Payments', 'Autorizado'],
          ['Reconciliar o anexo de preços alterado', 'Acme Payments · Drive', 'Aguardando uma pessoa'],
          ['Resumo semanal de entregas a partir dos resultados aceitos', 'Northstar Revenue · Acme Payments', 'Autorizado'],
          ['Relacionar a atualização de renovação ao Northstar Revenue', 'Acme Payments · #receita', 'Aguardando uma pessoa'],
          ['Plano de handoff de implantação', 'Meridian Rollout · Acme Payments', 'Autorizado'],
          ['Registrar a confirmação de pagamento no registro de receita', 'Acme Payments · Faturamento', 'Aguardando uma pessoa'],
        ]
      : [
          ['Update the Q3 revenue forecast and prepare a leadership brief', 'Northstar Revenue · Acme Payments', 'Authorized'],
          ['Reconcile the changed pricing appendix', 'Acme Payments · Drive', 'Waiting on a person'],
          ['Weekly delivery summary from accepted outcomes', 'Northstar Revenue · Acme Payments', 'Authorized'],
          ['Relate the renewal update to Northstar Revenue', 'Acme Payments · #revenue', 'Waiting on a person'],
          ['Implementation handoff plan', 'Meridian Rollout · Acme Payments', 'Authorized'],
          ['Post the payment confirmation to the revenue record', 'Acme Payments · Billing', 'Waiting on a person'],
        ];

    const statusSequences = isPortuguese
      ? [
          ['Contexto reunido', 'Trabalho governado preparado', 'Autorizado', 'Executando'],
          ['Observado, não autorizado', 'Contexto reunido', 'Trabalho governado preparado', 'Aguardando uma pessoa'],
          ['Contexto reunido', 'Trabalho governado preparado', 'Autorizado', 'Executando'],
          ['Observado, não autorizado', 'Relacionado ao Projeto', 'Trabalho governado preparado', 'Aguardando uma pessoa'],
          ['Contexto reunido', 'Trabalho governado preparado', 'Autorizado', 'Executando'],
          ['Observado, não autorizado', 'Contexto reunido', 'Trabalho governado preparado', 'Aguardando uma pessoa'],
        ]
      : [
          ['Context assembled', 'Governed work prepared', 'Authorized', 'Executing'],
          ['Observed, not authorized', 'Context assembled', 'Governed work prepared', 'Waiting on a person'],
          ['Context assembled', 'Governed work prepared', 'Authorized', 'Executing'],
          ['Observed, not authorized', 'Related to Project', 'Governed work prepared', 'Waiting on a person'],
          ['Context assembled', 'Governed work prepared', 'Authorized', 'Executing'],
          ['Observed, not authorized', 'Context assembled', 'Governed work prepared', 'Waiting on a person'],
        ];

    const thcEl = document.querySelector('.thc');
    const ctxEl = document.querySelector('.thc-context-val');
    const draftEl = document.querySelector('.thc-draft');
    const draftTitleEl = document.querySelector('.thc-draft-title');
    const draftMetaEl = document.querySelector('.thc-draft-meta');
    const draftStateEl = document.querySelector('.thc-draft-state');

    const paintDraft = (idx) => {
      const d = drafts[idx];
      if (!d) return;
      if (draftTitleEl) draftTitleEl.textContent = d[0];
      if (draftMetaEl) draftMetaEl.textContent = d[1];
      if (draftStateEl) draftStateEl.textContent = d[2];
      if (draftEl) draftEl.classList.toggle('is-live', idx % 2 === 0);
    };

    if (prefersReducedMotion) {
      textEl.textContent = prompts[0];
      if (ctxEl) ctxEl.textContent = contexts[0];
      paintDraft(0);
      if (draftEl) draftEl.classList.add('is-visible');
      if (thcEl) thcEl.classList.add('is-armed');
      const m0 = document.querySelector('.hero-composer-mode');
      if (m0) m0.textContent = entryModes[0];
      labelEls.forEach((el, i) => { el.textContent = statusSequences[0][i] || ''; });
      if (statusEls[0]) {
        statusEls[0].classList.add('is-visible');
        const dotEl = statusEls[0].querySelector('.hero-status-dot');
        if (dotEl) dotEl.classList.add('is-done');
      }
      return;
    }

    let promptIdx = 0;
    let charIdx = 0;
    let phase = 'type';
    let frameTimer = null;
    let statusTimer = null;
    let dotTimer = null;
    let draftTimer = null;

    const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

    const modeEl = document.querySelector('.hero-composer-mode');
    const loadSequence = (idx) => {
      const seq = statusSequences[idx];
      labelEls.forEach((el, i) => { el.textContent = seq[i] || ''; });
      if (modeEl) modeEl.textContent = entryModes[idx] || '';
      if (ctxEl) ctxEl.textContent = contexts[idx] || '';
      paintDraft(idx);
      // the two entry modes read differently: a request is typed, an observation arrives
      if (thcEl) thcEl.classList.toggle('is-observed', idx % 2 === 1);
    };

    const showStatuses = () => {
      let i = 0;
      const step = () => {
        if (i >= statusEls.length || phase === 'erase' || phase === 'gap') return;
        const dotEl = statusEls[i].querySelector('.hero-status-dot');
        statusEls[i].classList.add('is-visible');
        i++;
        dotTimer = setTimeout(() => {
          if (dotEl && i < statusEls.length && phase !== 'erase' && phase !== 'gap') dotEl.classList.add('is-done');
          statusTimer = setTimeout(step, 280);
        }, 420);
      };
      statusTimer = setTimeout(step, 300);
    };

    const hideStatuses = () => {
      clearTimeout(statusTimer);
      clearTimeout(dotTimer);
      clearTimeout(draftTimer);
      if (draftEl) draftEl.classList.remove('is-visible');
      statusEls.forEach((el) => {
        el.classList.remove('is-visible');
        const dotEl = el.querySelector('.hero-status-dot');
        if (dotEl) dotEl.classList.remove('is-done');
      });
    };

    const tick = () => {
      const prompt = prompts[promptIdx];

      if (phase === 'type') {
        if (charIdx === 0) {
          loadSequence(promptIdx);
          showStatuses();
        }
        if (charIdx < prompt.length) {
          charIdx++;
          textEl.textContent = prompt.slice(0, charIdx);
          if (thcEl) { thcEl.classList.remove('is-empty'); thcEl.classList.add('is-armed'); }
          frameTimer = setTimeout(tick, rand(44, 70));
        } else {
          phase = 'pause';
          // the prompt has become a draft.on — show what it turned into
          draftTimer = setTimeout(() => {
            if (phase === 'pause' && draftEl) draftEl.classList.add('is-visible');
          }, 900);
          frameTimer = setTimeout(tick, 3600);
        }
      } else if (phase === 'pause') {
        hideStatuses();
        phase = 'erase';
        frameTimer = setTimeout(tick, 80);
      } else if (phase === 'erase') {
        if (charIdx > 0) {
          charIdx--;
          textEl.textContent = prompt.slice(0, charIdx);
          frameTimer = setTimeout(tick, rand(22, 32));
        } else {
          if (thcEl) { thcEl.classList.add('is-empty'); thcEl.classList.remove('is-armed'); }
          phase = 'gap';
          promptIdx = (promptIdx + 1) % prompts.length;
          frameTimer = setTimeout(tick, 520);
        }
      } else {
        phase = 'type';
        tick();
      }
    };

    frameTimer = setTimeout(tick, 900);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(frameTimer);
        clearTimeout(statusTimer);
      } else {
        frameTimer = setTimeout(tick, 200);
      }
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
