function updateAnimation(block, progress) {
  const duration = 2.5;
  const paths = block.querySelectorAll('.anim-path');
  const delay = (progress * duration * -1).toFixed(3);
  
  paths.forEach((path) => {
    path.style.animationDelay = `${delay}s`;
  });
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  if (link && link.href.endsWith('.svg')) {
    const response = await fetch(link.href);
    const svgText = await response.text();
    block.innerHTML = svgText;
  }

  const svg = block.querySelector('svg');
  if (!svg) return;

  svg.querySelectorAll('path').forEach((p) => {
    p.classList.add('anim-path');
    p.style.animationPlayState = 'paused';
    p.style.animationFillMode = 'both';
  });

  window.addEventListener('scroll', () => {
    const rect = block.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const centerOfScreen = windowHeight / 2;

    // The 'distance' is how far the top of the block is from the center of the screen
    // When blockTop == centerOfScreen, progress is 0.
    const distanceToCenter = centerOfScreen - rect.top;

    // Define the scroll "zone" (e.g., the animation takes 500px of scrolling to finish)
    const scrollRange = 500;

    let progress = distanceToCenter / scrollRange;

    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    updateAnimation(block, progress);
  }, { passive: true });
}