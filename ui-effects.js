function showSimulation(message, tone = 'neutral') {
  const room = document.querySelector('.event-copy');
  if (!room) return;
  const signal = document.createElement('div');
  signal.className = `simulation-signal ${tone}`;
  signal.innerHTML = `<span class="signal-pulse"></span><strong>선택의 기록</strong><span>${message}</span>`;
  room.appendChild(signal);
  requestAnimationFrame(() => signal.classList.add('visible'));
  window.setTimeout(() => {
    signal.classList.remove('visible');
    window.setTimeout(() => signal.remove(), 350);
  }, 2200);
}

function pulseChoice(button) {
  if (!button) return;
  button.classList.add('selected');
  window.setTimeout(() => button.classList.remove('selected'), 500);
}
