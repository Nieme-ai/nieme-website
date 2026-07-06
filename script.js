(() => {
  // Create a free Formspree or Basin endpoint and paste it here.
  const FORM_ENDPOINT = "https://formspree.io/f/xkolkqqn";
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        status.textContent = 'You are on the list. Invites go out in waves.';
      } catch {
        status.textContent = 'Something went wrong. Try again in a minute.';
      } finally {
        button.disabled = false;
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
    const textEl = document.querySelector('.hero-composer-text');
    const statusEls = Array.from(document.querySelectorAll('.hero-status-line'));
    if (!textEl) return;

    const prompts = [
      'Archive all my completed operations.',
      'Summarize today\'s discussion in #sales on Slack.',
      'Move Operation 3 from Project X to Project Z.',
      'Prepare the Q3 report using last year\'s template.',
      'Start Sprint 3 and assign the operations.',
      'Review what the team shipped while I was out.',
    ];

    if (prefersReducedMotion) {
      textEl.textContent = prompts[0];
      if (statusEls[0]) statusEls[0].classList.add('is-visible');
      return;
    }

    let promptIdx = 0;
    let charIdx = 0;
    let phase = 'type';
    let frameTimer = null;
    let statusTimer = null;

    const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

    const showStatuses = () => {
      let i = 0;
      const next = () => {
        if (i < statusEls.length && phase === 'type') {
          statusEls[i].classList.add('is-visible');
          i++;
          statusTimer = setTimeout(next, 560);
        }
      };
      statusTimer = setTimeout(next, 300);
    };

    const hideStatuses = () => {
      clearTimeout(statusTimer);
      statusEls.forEach((el) => el.classList.remove('is-visible'));
    };

    const tick = () => {
      const prompt = prompts[promptIdx];

      if (phase === 'type') {
        if (charIdx === 0) showStatuses();
        if (charIdx < prompt.length) {
          charIdx++;
          textEl.textContent = prompt.slice(0, charIdx);
          frameTimer = setTimeout(tick, rand(44, 70));
        } else {
          phase = 'pause';
          frameTimer = setTimeout(tick, 2200);
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
          phase = 'gap';
          promptIdx = (promptIdx + 1) % prompts.length;
          frameTimer = setTimeout(tick, 380);
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
