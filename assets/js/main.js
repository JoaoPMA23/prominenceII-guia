// Intersection Observer para animação das seções
const sections = document.querySelectorAll('.section');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.08 });
sections.forEach(s => obs.observe(s));

// Anima barras de progressão quando ficam visíveis
const fills = document.querySelectorAll('.prog-fill');
const fillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('animate'); }
  });
}, { threshold: 0.5 });
fills.forEach(f => fillObs.observe(f));
