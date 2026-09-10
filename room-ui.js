const resourceIcon = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const roomResourceMeta = {
  food: { label: '식량', unit: '캔', icon: resourceIcon('<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 4 14 4 14 0V5M5 10c3 3 11 3 14 0M8 15h8"/>'), detail: '가족의 비상 식량입니다. 나눔과 이동 등의 선택에 사용됩니다.' },
  water: { label: '식수', unit: '병', icon: resourceIcon('<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z"/><path d="M9 15c0 2 1 3 3 3"/>'), detail: '저장해 둔 깨끗한 물입니다. 이웃을 돕거나 공동 시설을 수리할 때 사용됩니다.' },
  medicine: { label: '약품', unit: '팩', icon: resourceIcon('<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M9 6V3h6v3m-3 5v6m-3-3h6"/>'), detail: '가족을 위한 응급 처치 물품입니다. 현재 비축량을 확인할 수 있습니다.' },
  battery: { label: '배터리', unit: '칸', icon: resourceIcon('<rect x="3" y="6" width="17" height="12" rx="2"/><path d="M20 10h2v4h-2M12 8l-3 5h5l-3 4"/>'), detail: '시민 패스, 통신 장비, 구조 활동에 사용되는 전력입니다.' },
  money: { label: '비상금', unit: '크레딧', icon: resourceIcon('<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 9V5l14-3v4m-1 6h5v5h-5Z"/>'), detail: '플랫폼 노동으로 모은 비상금입니다. 계정 구매와 이동 비용 등에 사용됩니다.' }
};

function resourceDetailMarkup(key){
  const meta=roomResourceMeta[key];
  return meta ? `<span class="inspect-icon">${meta.icon}</span><div><strong>${meta.label} <b>${state[key]}</b><em>${meta.unit}</em></strong><small>${meta.detail}</small></div><button class="inspect-close" aria-label="자원 설명 닫기" onclick="selectResource(null)">×</button>` : '<span class="inventory-hint">보급품 아이콘을 눌러 비축량과 용도를 확인하세요.</span>';
}
function selectResource(key){
  state.selectedResource=state.selectedResource===key?null:key;
  const detail=document.querySelector('.resource-inspect');
  if(detail) detail.innerHTML=resourceDetailMarkup(state.selectedResource);
  document.querySelectorAll('.room-resource').forEach(button=>{
    const active=button.dataset.resource===state.selectedResource;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
}
function bindResourceUI(){ decorateRoom(); }
function decorateRoom(){
  const room=document.querySelector('.living-room');
  if(!room || document.querySelector('.inventory-panel')) return;
  room.insertAdjacentHTML('beforebegin',`<section class="inventory-panel" aria-label="보급품 확인"><div class="inventory-top"><div class="inventory-toolbar" role="group" aria-label="자원 아이콘">${Object.entries(roomResourceMeta).map(([key,meta])=>`<button class="room-resource ${state.selectedResource===key?'active':''}" data-resource="${key}" aria-label="${meta.label} 확인" aria-pressed="${state.selectedResource===key}" onclick="selectResource('${key}')">${meta.icon}<span>${meta.label}</span><b>${state[key]}</b></button>`).join('')}</div><span class="inventory-code">INVENTORY / 05</span></div><div class="resource-inspect" role="status" aria-live="polite">${resourceDetailMarkup(state.selectedResource)}</div></section>`);
}

document.addEventListener('keydown',event=>{
  if(event.repeat || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
  if(event.key==='Escape' && state.selectedResource){ selectResource(null); return; }
  if(event.code==='Space' && event.target.tagName!=='BUTTON') { event.preventDefault(); togglePause(); return; }
  const index='abc'.indexOf(event.key.toLowerCase());
  if(index>=0 && event.key.length===1) choose(index);
});

function showDayTransition(day, afterTransition) {
  const transition = document.createElement('div');
  transition.className = 'day-transition';
  transition.setAttribute('role', 'status');
  transition.setAttribute('aria-live', 'polite');
  transition.innerHTML = `<div class="transition-rule"></div><span>DAY</span><strong>${String(day).padStart(2, '0')}</strong><small>${day === 1 ? '첫 번째 아침 · 가족의 생존이 시작됩니다' : '새로운 아침 · 오늘의 선택이 기다립니다'}</small></div>`;
  document.body.appendChild(transition);
  requestAnimationFrame(() => transition.classList.add('visible'));
  window.setTimeout(() => {
    transition.classList.remove('visible');
    window.setTimeout(() => {
      transition.remove();
      if (afterTransition) afterTransition();
    }, 450);
  }, 1450);
}

const roomObserver = new MutationObserver(bindResourceUI);
roomObserver.observe(document.getElementById('app'), { childList: true });
