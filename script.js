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

  const boot = () => {
    initInviteForm();
    initReveal();
    initBeforeAfter();
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
