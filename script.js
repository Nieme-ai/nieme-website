(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const addMotionReady = () => {
    document.body.classList.add('motion-ready');
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

  const initRuntimeCycle = () => {
    if (prefersReducedMotion) {
      return;
    }

    const lines = Array.from(document.querySelectorAll('.log p'));
    if (!lines.length) {
      return;
    }

    const events = [
      ['08:16', 'Quarterly report generated.'],
      ['08:24', 'Contract ready for review.'],
      ['08:37', 'Supplier update summarized.'],
      ['08:45', 'Morning briefing prepared.'],
      ['08:52', 'Customer replies drafted.'],
      ['09:04', 'One renewal needs attention.'],
      ['09:12', 'Board presentation ready for review.']
    ];

    let index = 0;

    const rotateLine = () => {
      const line = lines[index % lines.length];
      const event = events[index % events.length];
      const timeNode = line.querySelector('time');
      const textNode = line.childNodes[1];

      line.classList.add('is-changing');

      window.setTimeout(() => {
        if (timeNode) {
          timeNode.textContent = event[0];
        }

        if (textNode) {
          textNode.textContent = ` ${event[1]}`;
        }

        line.classList.remove('is-changing');
      }, 320);

      index += 1;
    };

    window.setTimeout(() => {
      rotateLine();
      window.setInterval(rotateLine, 9000);
    }, 1500);
  };

  const boot = () => {
    initReveal();
    initRuntimeCycle();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(addMotionReady);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
