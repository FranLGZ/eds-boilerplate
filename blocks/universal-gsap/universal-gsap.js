import { loadScript } from '../../scripts/aem.js';

async function runUniversalAnimation(block, animationRows) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Initialize the timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: block,
      start: 'top top',
      end: '+=2500', // You can also pull this from a "settings" sheet if needed
      scrub: 1,
      pin: true,
    },
  });

  // Loop through spreadsheet rows
  animationRows.forEach((row) => {
    const target = block.querySelector(row.Selector);
    if (target) {
      // Build the GSAP props object dynamically from sheet columns
      const props = {
        duration: parseFloat(row.Duration) || 1,
        ease: row.Easing || 'power1.inOut',
      };

      // Only add props if the spreadsheet cell isn't empty
      if (row.X) props.x = parseFloat(row.X);
      if (row.Y) props.y = parseFloat(row.Y);
      if (row.Scale) props.scale = parseFloat(row.Scale);
      if (row.Opacity !== '') props.opacity = parseFloat(row.Opacity);

      // Add to timeline at the specified 'Position' (offset)
      // row.Position could be 0, 0.5, or GSAP strings like "+=0.2"
      tl.to(target, props, row.Position || '0');
    }
  });
}

export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const svgLink = links.find((a) => a.href.endsWith('.svg'));
  // EDS publishes spreadsheets as .json URLs
  const configLink = links.find((a) => a.href.includes('.json'));

  if (svgLink && configLink) {
    try {
      const [svgRes, configRes] = await Promise.all([
        fetch(svgLink.href),
        fetch(configLink.href),
      ]);

      const svgText = await svgRes.text();
      const configJson = await configRes.json();

      // EDS spreadsheets always wrap data in a .data array
      const animationRows = configJson.data;

      block.innerHTML = `<div class="gsap-wrapper">${svgText}</div>`;

      // Ensure the SVG is actually there before running
      const svgEl = block.querySelector('svg');
      if (svgEl) {
        runUniversalAnimation(block, animationRows, svgEl);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Universal GSAP Block failed to load:', err);
    }
  }
}
