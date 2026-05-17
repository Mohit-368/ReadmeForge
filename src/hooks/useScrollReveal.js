import { useEffect, useRef } from 'react';

/**
 * Hook to apply 'visible' class to elements when they enter the viewport.
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} ref - React ref to attach to the container or element
 */
export default function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Once revealed, we can unobserve if we want it to stay revealed
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const elements = containerRef.current?.querySelectorAll('.reveal') || [];
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [options]);

  return containerRef;
}
