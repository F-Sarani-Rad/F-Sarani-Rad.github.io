
const menuBtn = document.querySelector('.menu-button');
const nav = document.getElementById('site-nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

const toast = document.getElementById('toast');
let toastTimer;
document.querySelectorAll('.cite-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.cite || '';
    try {
      await navigator.clipboard.writeText(text);
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
    } catch {
      window.prompt('Copy citation:', text);
    }
  });
});

const svg = document.getElementById('loop-svg');
const traveler = document.getElementById('traveler');
const mainPath = document.getElementById('main-path');
const returnPath = document.getElementById('return-path');
const reward = document.getElementById('reward-group');
const moveReward = document.getElementById('move-reward');

if (svg && traveler && mainPath && returnPath && reward && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let phase = 0;
  let rewardX = 420;
  let rewardY = 174;
  let last = performance.now();

  function placeOnPath(path, t) {
    const len = path.getTotalLength();
    const p = path.getPointAtLength(Math.max(0, Math.min(1, t)) * len);
    traveler.setAttribute('cx', p.x);
    traveler.setAttribute('cy', p.y);
  }

  function animate(now) {
    const dt = (now - last) / 1000;
    last = now;
    phase = (phase + dt * 0.16) % 1;

    if (phase < 0.68) {
      placeOnPath(mainPath, phase / 0.68);
    } else if (phase < 0.82) {
      const t = (phase - 0.68) / 0.14;
      const env = {x: 775, y: 146};
      const x = env.x + (rewardX - env.x) * t;
      const y = env.y + (rewardY - env.y) * t;
      traveler.setAttribute('cx', x);
      traveler.setAttribute('cy', y);
    } else {
      placeOnPath(returnPath, (phase - 0.82) / 0.18);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  const positions = [
    {x: 420, y: 174},
    {x: 355, y: 188},
    {x: 500, y: 187},
    {x: 445, y: 160}
  ];
  let rewardIndex = 0;

  function setReward(pos) {
    rewardX = pos.x;
    rewardY = pos.y;
    reward.setAttribute('transform', `translate(${rewardX} ${rewardY})`);
  }

  moveReward.addEventListener('click', () => {
    rewardIndex = (rewardIndex + 1) % positions.length;
    setReward(positions[rewardIndex]);
  });

  svg.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('#move-reward')) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const local = pt.matrixTransform(ctm.inverse());
    if (local.x > 250 && local.x < 620 && local.y > 150 && local.y < 208) {
      setReward({x: local.x, y: local.y});
    }
  });
}
