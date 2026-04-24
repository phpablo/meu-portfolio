export function initSkills() {
  const fills = document.querySelectorAll('.skill__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = `${fill.dataset.width}%`;
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach(fill => observer.observe(fill));
}
