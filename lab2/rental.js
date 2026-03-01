// =============================================================
//  rental.js — Логіка сторінки "Мої оренди"
//  Завдання 1: do..while + querySelectorAll + if-else
//  Завдання 2: Toggle форми, обробники вкладок, скасування
//  Завдання 3: Форма нової оренди, валідація, DOM-оновлення
// =============================================================

// ─────────────────────────────────────────────────────
// 1. ДАНІ ОРЕНД
// ─────────────────────────────────────────────────────
let rentals = [
  { id: 1, icon: '🚴', name: 'Гірський велосипед', dateStart: '2024-06-01', dateEnd: '2024-06-05', price: 150, active: true,  comment: '' },
  { id: 2, icon: '🏕', name: 'Туристичний намет',  dateStart: '2024-06-03', dateEnd: '2024-06-08', price: 120, active: true,  comment: 'Похід у Карпати' },
  { id: 3, icon: '⛷',  name: 'Гірські лижі',       dateStart: '2024-01-15', dateEnd: '2024-01-22', price: 250, active: false, comment: '' },
  { id: 4, icon: '🏄', name: 'Серфборд',            dateStart: '2023-07-10', dateEnd: '2023-07-14', price: 200, active: false, comment: 'Одеса' },
];
let nextId = 5;

// ─────────────────────────────────────────────────────
// 2. УТИЛІТИ
// ─────────────────────────────────────────────────────
function daysBetween(start, end) {
  return Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000));
}

function formatDate(str) {
  const [y, m, d] = str.split('-');
  return `${d}.${m}.${y}`;
}

function dayWord(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дні';
  return 'днів';
}

function calcProgress(start, end) {
  const now = Date.now();
  const s   = new Date(start).getTime();
  const e   = new Date(end).getTime();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

// ─────────────────────────────────────────────────────
// 3. РЕНДЕР СТАТИСТИКИ — do..while (Завдання 1)
// ─────────────────────────────────────────────────────
function renderStats() {
  const active       = rentals.filter(r => r.active).length;
  const completed    = rentals.filter(r => !r.active).length;
  const totalSpent   = rentals.reduce((sum, r) => !r.active ? sum + daysBetween(r.dateStart, r.dateEnd) * r.price : sum, 0);
  const totalActive  = rentals.reduce((sum, r) =>  r.active ? sum + daysBetween(r.dateStart, r.dateEnd) * r.price : sum, 0);

  const stats = [
    { val: active,              label: 'Активних оренд',  color: '#00c864' },
    { val: completed,           label: 'Завершених',       color: 'var(--gray)' },
    { val: totalActive + ' ₴',  label: 'Поточні витрати', color: 'var(--orange)' },
    { val: totalSpent  + ' ₴',  label: 'Всього витрачено', color: 'var(--white)' },
  ];

  const bar = document.getElementById('statsBar');
  bar.innerHTML = '';

  // ── do..while для виведення статистичних карток ──
  let i = 0;
  do {
    const s   = stats[i];
    const div = document.createElement('div');
    div.className = 'stat-card';
    div.innerHTML = `
      <div class="stat-card__val" style="color:${s.color}">${s.val}</div>
      <div class="stat-card__label">${s.label}</div>
    `;
    bar.appendChild(div);
    i++;
  } while (i < stats.length);
}

// ─────────────────────────────────────────────────────
// 4. РЕНДЕР СПИСКІВ ОРЕНД — do..while + for (Завдання 1, 2)
// ─────────────────────────────────────────────────────
function renderRentals() {
  const active    = rentals.filter(r =>  r.active);
  const completed = rentals.filter(r => !r.active);

  document.getElementById('activeCount').textContent = `(${active.length})`;
  document.getElementById('pastCount').textContent   = `(${completed.length})`;

  renderList('activeList', active,    true);
  renderList('pastList',   completed, false);
  renderStats();
}

function renderList(containerId, list, isActive) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `<p style="color:var(--gray); text-align:center; padding:32px 0;">
      ${isActive ? 'Активних оренд немає' : 'Завершених оренд немає'}</p>`;
    return;
  }

  // ── do..while для виведення карток оренд (Завдання 1) ──
  let i = 0;
  do {
    const r    = list[i];
    const days = daysBetween(r.dateStart, r.dateEnd);
    const total= days * r.price;
    const prog = isActive ? calcProgress(r.dateStart, r.dateEnd) : 100;

    const article = document.createElement('article');
    article.className  = 'rental-card';
    article.dataset.id = r.id;

    // if-else: різний вміст для активних і завершених (Завдання 1, крок 3)
    let actionsBtns;
    if (isActive) {
      actionsBtns = `
        <span class="badge badge--available">Активна</span>
        <a href="payment.html" class="btn btn--outline">Продовжити</a>
        <button class="btn btn--danger cancel-btn" data-id="${r.id}">Скасувати</button>
      `;
    } else {
      actionsBtns = `
        <span class="badge" style="background:rgba(138,155,176,0.15); color:var(--gray);">Завершена</span>
        <button class="btn btn--outline renew-btn"
          data-name="${r.name}" data-price="${r.price}" data-icon="${r.icon}">
          Орендувати знову
        </button>
      `;
    }

    article.innerHTML = `
      <div class="rental-card__icon">${r.icon}</div>
      <div class="rental-card__info">
        <p class="rental-card__name">${r.name}</p>
        <p class="rental-card__dates">
          📅 ${formatDate(r.dateStart)} — ${formatDate(r.dateEnd)} &nbsp;|&nbsp; ${days} ${dayWord(days)}
        </p>
        <p style="color:var(--gray); font-size:0.85rem; margin-top:4px;">
          ${isActive ? 'Поточна вартість' : 'Сплачено'}:
          <strong style="color:${isActive ? 'var(--orange)' : 'var(--white)'};">${total} грн</strong>
          ${r.comment ? `<span style="margin-left:8px; color:var(--gray);">// ${r.comment}</span>` : ''}
        </p>
        ${isActive ? `
          <div class="rental-progress">
            <div class="rental-progress__bar" style="width:${prog}%"></div>
          </div>
          <p style="color:var(--gray);font-size:0.75rem;margin-top:3px;">${prog}% завершено</p>
        ` : ''}
      </div>
      <div class="rental-card__actions">${actionsBtns}</div>
      ${isActive ? `
        <div class="confirm-cancel" id="confirm-${r.id}">
          <p>⚠ Справді скасувати цю оренду?</p>
          <button class="btn btn--danger confirm-yes" data-id="${r.id}" style="min-width:90px;">Так</button>
          <button class="btn btn--outline confirm-no"  data-id="${r.id}" style="min-width:90px;">Ні</button>
        </div>` : ''}
    `;

    container.appendChild(article);
    i++;
  } while (i < list.length);

  // ── ЗАВДАННЯ 2: for для обробників скасування ──
  const cancelBtns = document.querySelectorAll(`#${containerId} .cancel-btn`);
  for (let k = 0; k < cancelBtns.length; k++) {
    cancelBtns[k].addEventListener('click', function () {
      const id         = parseInt(this.dataset.id);
      const confirmBox = document.getElementById(`confirm-${id}`);
      // if-else: toggle підтвердження (Завдання 2, крок 2)
      if (confirmBox.classList.contains('show')) {
        confirmBox.classList.remove('show');
      } else {
        confirmBox.classList.add('show');
      }
    });
  }

  const confirmYes = document.querySelectorAll(`#${containerId} .confirm-yes`);
  for (let y = 0; y < confirmYes.length; y++) {
    confirmYes[y].addEventListener('click', function () {
      const rental = rentals.find(r => r.id === parseInt(this.dataset.id));
      if (rental) rental.active = false;
      renderRentals();
    });
  }

  const confirmNo = document.querySelectorAll(`#${containerId} .confirm-no`);
  for (let n = 0; n < confirmNo.length; n++) {
    confirmNo[n].addEventListener('click', function () {
      document.getElementById(`confirm-${this.dataset.id}`).classList.remove('show');
    });
  }

  // Кнопки "Орендувати знову"
  const renewBtns = document.querySelectorAll(`#${containerId} .renew-btn`);
  for (let rv = 0; rv < renewBtns.length; rv++) {
    renewBtns[rv].addEventListener('click', function () {
      openNewRentalForm();
      const sel        = document.getElementById('nrEquipment');
      const targetName = this.dataset.name;
      for (let s = 0; s < sel.options.length; s++) {
        if (sel.options[s].text.includes(targetName)) { sel.selectedIndex = s; break; }
      }
      updateNrCost();
      document.querySelector('.new-rental-section').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// ─────────────────────────────────────────────────────
// 5. ФОРМА НОВОЇ ОРЕНДИ — ЗАВДАННЯ 3
// ─────────────────────────────────────────────────────
function openNewRentalForm() {
  document.getElementById('newRentalToggle').classList.add('open');
  document.getElementById('newRentalBody').classList.add('open');
  document.getElementById('newRentalToggle').setAttribute('aria-expanded', 'true');
}

// Toggle показу/приховання форми (Завдання 2, крок 1)
document.getElementById('newRentalToggle').addEventListener('click', function () {
  const body = document.getElementById('newRentalBody');
  if (body.classList.contains('open')) {
    body.classList.remove('open');
    this.classList.remove('open');
    this.setAttribute('aria-expanded', 'false');
  } else {
    body.classList.add('open');
    this.classList.add('open');
    this.setAttribute('aria-expanded', 'true');
  }
});

// Розрахунок вартості при зміні полів (Завдання 3, крок 3)
function updateNrCost() {
  const sel   = document.getElementById('nrEquipment').value;
  const start = document.getElementById('nrDateStart').value;
  const end   = document.getElementById('nrDateEnd').value;
  const prev  = document.getElementById('nrCostPreview');

  if (!sel || !start || !end) { prev.textContent = ''; return; }

  const price  = parseInt(sel.split('|')[1]);
  const startD = new Date(start);
  const endD   = new Date(end);

  if (endD <= startD) {
    prev.style.color = '#e74c3c';
    prev.textContent = '⚠ Дата закінчення має бути пізніше початку';
    return;
  }

  const days  = Math.ceil((endD - startD) / 86400000);
  const total = days * price;
  prev.style.color = 'var(--gray)';
  prev.textContent = `Тривалість: ${days} ${dayWord(days)} | Вартість: ${total} грн`;
}

['nrEquipment', 'nrDateStart', 'nrDateEnd'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateNrCost);
});

// Мінімальна дата — сьогодні
const today = new Date().toISOString().split('T')[0];
document.getElementById('nrDateStart').min = today;
document.getElementById('nrDateEnd').min   = today;

// Відправка форми — збір даних, if-else валідація, DOM-оновлення (Завдання 3)
document.getElementById('nrSubmitBtn').addEventListener('click', function () {
  const selVal   = document.getElementById('nrEquipment').value;
  const name     = document.getElementById('nrName').value.trim();
  const start    = document.getElementById('nrDateStart').value;
  const end      = document.getElementById('nrDateEnd').value;
  const comment  = document.getElementById('nrComment').value.trim();
  const feedback = document.getElementById('nrFeedback');

  // ── ЗАВДАННЯ 3: if-else валідація всіх полів ──
  if (!selVal) { showFeedback(feedback, 'error', '⚠ Оберіть обладнання');         return; }
  if (!name)   { showFeedback(feedback, 'error', '⚠ Введіть ваше ім\'я');          return; }
  if (!start)  { showFeedback(feedback, 'error', '⚠ Вкажіть дату початку');        return; }
  if (!end)    { showFeedback(feedback, 'error', '⚠ Вкажіть дату закінчення');     return; }
  if (new Date(end) <= new Date(start)) {
    showFeedback(feedback, 'error', '⚠ Дата закінчення має бути пізніше початку');
    return;
  }

  const parts     = selVal.split('|');
  const itemName  = parts[0];
  const itemPrice = parseInt(parts[1]);
  const itemIcon  = parts[2];

  // ── ЗАВДАННЯ 3: DOM-оновлення — додаємо нову оренду до масиву ──
  rentals.unshift({
    id: nextId++, icon: itemIcon, name: itemName,
    dateStart: start, dateEnd: end, price: itemPrice,
    active: true, comment,
  });

  showFeedback(feedback, 'success', `✓ Оренду «${itemName}» для ${name} успішно додано!`);

  // Скидаємо форму
  ['nrEquipment', 'nrName', 'nrDateStart', 'nrDateEnd', 'nrComment'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('nrCostPreview').textContent = '';

  renderRentals();

  setTimeout(() => {
    feedback.className   = 'form-feedback';
    feedback.textContent = '';
  }, 3000);
});

function showFeedback(el, type, msg) {
  el.className   = `form-feedback ${type}`;
  el.textContent = msg;
}

// ─────────────────────────────────────────────────────
// 6. ВКЛАДКИ — ЗАВДАННЯ 2: for для обробників подій
// ─────────────────────────────────────────────────────
const tabs = [
  { btn: 'tabActive', panel: 'panelActive' },
  { btn: 'tabPast',   panel: 'panelPast'   },
];

for (let t = 0; t < tabs.length; t++) {
  document.getElementById(tabs[t].btn).addEventListener('click', function () {
    for (let x = 0; x < tabs.length; x++) {
      document.getElementById(tabs[x].btn).classList.remove('active');
      document.getElementById(tabs[x].panel).hidden = true;
    }
    this.classList.add('active');
    document.getElementById(tabs[t].panel).hidden = false;
  });
}

// ─────────────────────────────────────────────────────
// 7. БУРГЕР-МЕНЮ
// ─────────────────────────────────────────────────────
document.getElementById('burgerBtn').addEventListener('click', function () {
  const isOpen = document.getElementById('mainNav').classList.toggle('open');
  this.classList.toggle('open', isOpen);
});

// ─────────────────────────────────────────────────────
// 8. ІНІЦІАЛІЗАЦІЯ
// ─────────────────────────────────────────────────────
renderRentals();
