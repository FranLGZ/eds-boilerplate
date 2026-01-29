import { loadScript } from '../../scripts/aem.js';

async function initGSAP(block) {
  // Load GSAP and ScrollTrigger from CDN
  // We use loadScript helper from aem.js to handle external dependencies cleanly
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Use the block as the container
  const svg = block.querySelector('svg');
  if (!svg) return;

  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  // Create the timeline scoped to THIS block
  const runAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: block,      // Use the block itself as the trigger
      start: 'top top',    // Starts when block top hits viewport top
      end: '+=2500',       // 2500px of scrolling
      scrub: true,
      pin: true,           // Keeps the SVG fixed while animating
      anticipatePin: 1,
    },
  });

  // Scoped selectors: we look INSIDE the block for the IDs
  // This prevents conflicts if you use the block twice on one page
  const select = (s) => block.querySelector(s);

  runAnimation
    .add([
      gsap.to(svg, { scale: 1.5, duration: 2 }),
      gsap.to(select('#full_city'), { opacity: 0, duration: 2 }),
    ])
    .add([
      gsap.to(select('#building_top'), { y: -200, opacity: 0, duration: 2 }),
      gsap.to(select('#wall_side'), { x: -200, opacity: 0, duration: 2 }),
      gsap.to(select('#wall_front'), { x: 200, y: 200, opacity: 0, duration: 2 }),
    ])
    .add([
      gsap.to(select('#interior_wall_side'), { x: -200, opacity: 0, duration: 2 }),
      gsap.to(select('#interior_wall_top'), { y: -200, opacity: 0, duration: 2 }),
      gsap.to(select('#interior_wall_side_2'), { opacity: 0, duration: 2 }),
      gsap.to(select('#interior_wall_front'), { opacity: 0, duration: 2 }),
    ]);
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  if (link && link.href.endsWith('.svg')) {
    const response = await fetch(link.href);
    if (response.ok) {
      const svgText = await response.text();
      // Important: Wrap the SVG in a div that GSAP can pin easily
      block.innerHTML = `<div class="gsap-container">${svgText}</div>`;
      initGSAP(block);
    }
  }
}