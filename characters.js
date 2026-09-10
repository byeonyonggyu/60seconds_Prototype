const characterArt = {
  dad: { name: '민우', role: '아빠 · 생존과 효율', image: 'assets/minwoo.png' },
  mom: { name: '수경', role: '엄마 · 인도주의와 연대', image: 'assets/sugyeong.png' },
  son: { name: '준호', role: '아들 · 미래 세대', image: 'assets/junho.png' },
  daughter: { name: '서연', role: '딸 · 기후 멘탈', image: 'assets/seoyeon.png' }
};

function applyCharacterPresentation() {
  if (typeof state === 'undefined' || !document.querySelector('.family')) return;
  const lowMorality = state.morality < 35;
  const highSelfishness = state.selfishness > 65;
  document.querySelectorAll('.family').forEach((family) => {
    family.classList.toggle('morality-low', lowMorality);
    family.classList.toggle('selfish-high', highSelfishness);
  });
  const allocation = document.querySelector('.allocation');
  if (allocation && !allocation.querySelector('.character-ethics')) {
    allocation.insertAdjacentHTML('beforeend', '<div class="character-ethics"><div class="alloc-row"><span>가족 도덕심</span><span class="ethics-morality"></span></div><div class="alloc-row"><span>가족 이기심</span><span class="ethics-selfishness"></span></div></div>');
  }
  const morality = document.querySelector('.ethics-morality');
  const selfishness = document.querySelector('.ethics-selfishness');
  if (morality && morality.textContent !== `${state.morality} / 100`) morality.textContent = `${state.morality} / 100`;
  if (selfishness && selfishness.textContent !== `${state.selfishness} / 100`) selfishness.textContent = `${state.selfishness} / 100`;
  if (typeof canAfford === 'function') {
    const eventIndex = state.event % events.length;
    document.querySelectorAll('.choice').forEach((choice, index) => {
      const unavailable = state.started && !canAfford(eventIndex, index);
      choice.disabled = !state.started || isGameOver() || state.paused || state.transitioning || unavailable;
      choice.classList.toggle('unaffordable', unavailable);
      if (unavailable) choice.title = affordabilityText(eventIndex, index);
    });
  }
}

const characterObserver = new MutationObserver(() => window.setTimeout(applyCharacterPresentation, 0));
characterObserver.observe(document.getElementById('app'), { childList: true, subtree: true });

