class CanvasAnimation {
  constructor(block, config) {
    this.block = block;
    this.canvas = block.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.config = config;
    this.images = new Array(config.frameCount);
    this.currentMode = null;
    this.init();
  }

  async init() {
    this.updateDimensions();
    this.setupCanvas();
    await this.loadAllPasses();
    this.bindScroll();
    this.bindResize();
  }

  updateDimensions() {
    this.isMobile = window.innerWidth <= 768;
  }

  async loadAllPasses() {
    performance.mark('canvas-animation-start');
    await this.loadSequence(2, 0);
    this.render(0);
    await this.loadSequence(2, 1);
    performance.mark('canvas-animation-end');
    performance.measure('Moving Canvas Total Load', 'canvas-animation-start', 'canvas-animation-end');
    const measure = performance.getEntriesByName('Moving Canvas Total Load')[0];
    // eslint-disable-next-line no-console
    console.log(`Moving Canvas loaded in ${measure.duration.toFixed(2)}ms`);
  }

  async loadSequence(step, offset) {
    const promises = [];
    const base = this.config.baseUrl;

    for (let i = offset; i < this.config.frameCount; i += step) {
      if (!this.images[i]) {
        const img = new Image();
        const promise = new Promise((res) => {
          img.onload = res;
          img.src = `${base}${(i + 1).toString().padStart(4, '0')}.jpg`;
        });
        this.images[i] = img;
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  }

  render(index) {
    let img = this.images[index];
    if (!img) img = this.images[Math.floor(index / 2) * 2];
    if (!img) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isMobile) {
      const zoom = 1.1;
      const sW = 1080 * zoom;
      const sH = 1080 * zoom;
      const sX = (1080 - sW) / 2;
      const sY = (1080 - sH) / 2;
      this.ctx.drawImage(img, sX, sY, sW, sH, 0, 0, 1080, 1080);
    } else {
      this.ctx.drawImage(img, 0, 0, 1080, 1080);
    }
  }

  bindScroll() {
    const track = this.block;
    const content1 = this.block.querySelector('.content-1');
    const content2 = this.block.querySelector('.content-2');
    const {
      c1Start,
      c2Start,
      fadeDuration,
      panStartFrame,
      panStartPos,
      panEndPos,
      frameCount,
    } = this.config;

    window.addEventListener('scroll', () => {
      const rect = track.getBoundingClientRect();
      const scrollFraction = Math.max(0, Math.min(1, Math.abs(rect.top)
      / (rect.height - window.innerHeight)));

      const eased = scrollFraction < 0.5
        ? 16 * (scrollFraction ** 5)
        : 1 - ((-2 * scrollFraction + 2) ** 5) / 2;

      const frameIndex = Math.floor(eased * (frameCount - 1));

      // 1. Fully Customizable Desktop Panning
      if (!this.isMobile) {
        this.canvas.style.transform = `translateX(${panStartPos}%)`;
        if (frameIndex >= panStartFrame) {
          // Progress from the pan start frame to the end of the sequence
          const panProgress = Math.max(
            0,
            Math.min(1, (frameIndex - panStartFrame) / (frameCount - panStartFrame)),
          );

          // Linear interpolation between start and end position
          const currentPan = panStartPos + (panProgress * (panEndPos - panStartPos));
          this.canvas.style.transform = `translateX(${currentPan}%)`;
        } else {
          // Hold at start position
          this.canvas.style.transform = `translateX(${panStartPos}%)`;
        }
      } else {
        this.canvas.style.transform = 'translateX(0%)';
      }

      // 2. Opacity Logic
      const c1Fade = (frameIndex - c1Start) / fadeDuration;
      content1.style.opacity = frameIndex <= c1Start ? 1 : Math.max(0, 1 - c1Fade);

      const c2Fade = (frameIndex - c2Start) / fadeDuration;
      content2.style.opacity = frameIndex <= c2Start ? 0 : Math.min(1, c2Fade);

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        requestAnimationFrame(() => this.render(frameIndex));
      }
    });
  }

  bindResize() {
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.updateDimensions();
      if (wasMobile !== this.isMobile) {
        this.setupCanvas();
        this.render(0);
      }
    });
  }

  setupCanvas() {
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = 1080 * ratio;
    this.canvas.height = 1080 * ratio;
    this.ctx.scale(ratio, ratio);
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  const getNum = (row) => (row ? parseInt(row.lastElementChild.textContent.trim(), 10) : 0);

  const config = {
    baseUrl: rows[0].lastElementChild.textContent.trim(),
    frameCount: getNum(rows[1]) || 60,
    c1Start: getNum(rows[2]) || 25,
    c2Start: getNum(rows[3]) || 45,
    fadeDuration: getNum(rows[4]) || 10,
    panStartFrame: getNum(rows[5]) || 20,
    panStartPos: getNum(rows[6]) || 30,
    panEndPos: getNum(rows[7]) || -30,
  };

  const content1 = rows[8].lastElementChild.innerHTML;
  const content2 = rows[9].lastElementChild.innerHTML;

  block.innerHTML = `
    <div class="spotlight-sticky-scene">
      <canvas></canvas>
      <div class="spotlight-content content-1">${content1}</div>
      <div class="spotlight-content content-2">${content2}</div>
    </div>
  `;

  const animation = new CanvasAnimation(block, config);
  return animation;
}
