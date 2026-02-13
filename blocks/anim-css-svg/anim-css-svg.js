// export default async function decorate(block) {
//   const link = block.querySelector('a');
//   if (!link) return;

//   const response = await fetch(link.href);
//   const svgText = await response.text();
//   block.innerHTML = `<div class="sticky-wrapper">${svgText}</div>`;

//   const svg = block.querySelector('svg');

//   // Set up the intersection observer to only run logic when visible
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         window.addEventListener('scroll', handleScroll);
//       } else {
//         window.removeEventListener('scroll', handleScroll);
//       }
//     });
//   });
//   observer.observe(block);

//   function handleScroll() {
//     const rect = block.getBoundingClientRect();
//     const scrollDistance = block.offsetHeight - window.innerHeight;
//     let progress = -rect.top / scrollDistance;
//     progress = Math.max(0, Math.min(1, progress));

//     // Map 0-1 progress to -0s to -1s delay
//     const seek = `${(progress * -1).toFixed(3)}s`;
//     svg.style.setProperty('--scroll-seek', seek);
//   }
// }
