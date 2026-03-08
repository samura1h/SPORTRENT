
// ─────────────────────────────────────────────────────
// 1. МАСИВ ДАНИХ ОБЛАДНАННЯ
// ─────────────────────────────────────────────────────
const equipmentData = [
  { id: 1, icon: '🚴', name: 'Гірський велосипед',   desc: 'Надійний велосипед для гірських трас і міських маршрутів. Амортизатори, 21 швидкість.',  price: 150, available: true  },
  { id: 2, icon: '⛷',  name: 'Гірські лижі',         desc: 'Комплект лиж для середнього рівня підготовки. Включає черевики та палиці.',                price: 250, available: true  },
  { id: 3, icon: '🛹', name: 'Роликові ковзани',     desc: 'Професійні ролики з захисним спорядженням. Розміри 36–46.',                               price: 90,  available: false },
  { id: 4, icon: '🏄', name: 'Серфборд',              desc: 'Дошка для серфінгу, довжина 7 футів. Підходить для початківців.',                         price: 200, available: true  },
  { id: 5, icon: '🏕', name: 'Туристичний намет',    desc: 'Двомісний намет, водонепроникний, легкий — 1.8 кг. Ідеальний для походів.',               price: 120, available: true  },
  { id: 6, icon: '🎿', name: 'Сноуборд',              desc: 'Сноуборд з кріпленнями та черевиками. Підходить для фрістайлу та трас.',                 price: 220, available: true  },
  { id: 7, icon: '🧗', name: 'Спорядження для скелі', desc: 'Набір для скелелазіння: обвʼязка, каска, карабіни, мотузка 50 м.',                       price: 180, available: true  },
  { id: 8, icon: '🚣', name: 'Байдарка',               desc: 'Двомісна надувна байдарка. Включає весла та рятувальні жилети.',                        price: 300, available: false },
];

// ─────────────────────────────────────────────────────
// 2. СТАН КОШИКА
// ─────────────────────────────────────────────────────
let cart = [];           // { item, dateStart, dateEnd, days, total }
let activeFilter = 'all';

// ─────────────────────────────────────────────────────
// 3. УТИЛІТИ
// ─────────────────────────────────────────────────────
function dayWord(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дні';
  return 'днів';
}

function formatDate(str) {
  const [y, m, d] = str.split('-');
  return `${d}.${m}.${y}`;
}

// ─────────────────────────────────────────────────────
// 4. РЕНДЕР КАРТОК — ЗАВДАННЯ 1: цикл do..while
//    + querySelectorAll + умовна зміна кольору/стилю
// ─────────────────────────────────────────────────────
function renderCards(filter) {
  const grid = document.getElementById('equipmentGrid');
  grid.innerHTML = '';

  const filtered = equipmentData.filter(item => {
    if (filter === 'available') return item.available;
    if (filter === 'rented')    return !item.available;
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--gray); grid-column:1/-1;">Нічого не знайдено.</p>';
    return;
  }

  // ── ЗАВДАННЯ 1: do..while для виведення карток ──
  let i = 0;
  do {
    const item   = filtered[i];
    const inCart = cart.some(c => c.item.id === item.id);

    // if-else для стану кнопки (Завдання 1, крок 3)
    let btnHtml;
    if (!item.available) {
      btnHtml = `<button class="btn btn--outline" style="margin-top:12px;width:100%;" disabled>Недоступно</button>`;
    } else if (inCart) {
      btnHtml = `<button class="btn btn--added" style="margin-top:12px;width:100%;" disabled>✓ У кошику</button>`;
    } else {
      btnHtml = `<button class="btn btn--primary rent-btn" style="margin-top:12px;" data-id="${item.id}">Орендувати</button>`;
    }

    const card = document.createElement('article');
    card.className  = 'equipment-card';
    card.dataset.id = item.id;
    card.innerHTML  = `
      <div class="equipment-card__img-placeholder">${item.icon}</div>
      <div class="equipment-card__body">
        <h3 class="equipment-card__title">${item.name}</h3>
        <p class="equipment-card__desc">${item.desc}</p>
        <div class="equipment-card__meta">
          <span class="badge ${item.available ? 'badge--available' : 'badge--rented'}">
            ${item.available ? 'Доступний' : 'Орендовано'}
          </span>
          <p class="price">${item.price} <small>грн/день</small></p>
        </div>
        ${btnHtml}
      </div>`;

    grid.appendChild(card);
    i++;
  } while (i < filtered.length);

  // ── ЗАВДАННЯ 1: querySelectorAll — колір рамки по індексу ──
  const allCards = document.querySelectorAll('.equipment-card');
  for (let j = 0; j < allCards.length; j++) {
    const c = allCards[j];
    // if-else: парні/непарні картки (Завдання 1, крок 2)
    if (j % 2 === 0) {
      c.style.setProperty('--hover-border', 'var(--orange)');
    } else {
      c.style.setProperty('--hover-border', '#00c864');
    }

    // Ефект наведення (Завдання 2, крок 4)
    c.addEventListener('mouseenter', function () {
      const badge = this.querySelector('.badge');
      if (badge) badge.style.transform = 'scale(1.08)';
    });
    c.addEventListener('mouseleave', function () {
      const badge = this.querySelector('.badge');
      if (badge) badge.style.transform = 'scale(1)';
    });
  }

  // ── ЗАВДАННЯ 2: обробники кнопки "Орендувати" ──
  const rentBtns = document.querySelectorAll('.rent-btn');
  for (let k = 0; k < rentBtns.length; k++) {
    rentBtns[k].addEventListener('click', function () {
      openModal(parseInt(this.dataset.id));
    });
  }
}

// ─────────────────────────────────────────────────────
// 5. КОЛЬОРОВА АНІМАЦІЯ ПЕРЕВАГ — do..while (Завдання 1, крок 2)
// ─────────────────────────────────────────────────────
const featureColors = [
  'rgba(244,112,10,0.12)',
  'rgba(0,200,100,0.10)',
  'rgba(52,152,219,0.10)',
  'rgba(155,89,182,0.10)',
  'rgba(241,196,15,0.10)',
  'rgba(231,76,60,0.10)',
];

function colorFeatures() {
  const items = document.querySelectorAll('.features-list li');
  let idx = 0;
  do {
    // if-else: колір за індексом (Завдання 1, крок 3)
    if (idx < featureColors.length) {
      items[idx].style.background   = featureColors[idx];
      items[idx].style.borderColor  = featureColors[idx].replace('0.1', '0.4').replace('0.12', '0.5');
    } else {
      items[idx].style.background   = 'var(--card-bg)';
    }
    idx++;
  } while (idx < items.length);
}

// ─────────────────────────────────────────────────────
// 6. МОДАЛЬНЕ ВІКНО — ЗАВДАННЯ 3: вибір дат, валідація
// ─────────────────────────────────────────────────────
let currentItemId = null;

function openModal(itemId) {
  const item = equipmentData.find(e => e.id === itemId);
  if (!item) return;
  currentItemId = itemId;

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateStart').min   = today;
  document.getElementById('dateEnd').min     = today;
  document.getElementById('dateStart').value = '';
  document.getElementById('dateEnd').value   = '';

  document.getElementById('modalItemName').textContent  = `${item.icon} ${item.name} — ${item.price} грн/день`;
  document.getElementById('modalCostInfo').innerHTML    = 'Оберіть дати для розрахунку вартості';
  document.getElementById('modalError').textContent     = '';
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  currentItemId = null;
}

// Перерахунок вартості (Завдання 3, крок 3)
function recalcCost() {
  const start  = document.getElementById('dateStart').value;
  const end    = document.getElementById('dateEnd').value;
  const errEl  = document.getElementById('modalError');
  const costEl = document.getElementById('modalCostInfo');

  if (!start || !end) { costEl.innerHTML = 'Оберіть дати для розрахунку вартості'; return; }

  const startDate = new Date(start);
  const endDate   = new Date(end);

  // if-else валідація дат (Завдання 3, крок 2)
  if (endDate <= startDate) {
    errEl.textContent = '⚠ Дата закінчення має бути пізніше дати початку';
    costEl.innerHTML  = 'Некоректні дати';
    return;
  }

  errEl.textContent = '';
  const days  = Math.ceil((endDate - startDate) / 86400000);
  const item  = equipmentData.find(e => e.id === currentItemId);
  const total = days * item.price;

  // Динамічне оновлення DOM (Завдання 3, крок 3)
  costEl.innerHTML = `
    Тривалість: <strong>${days} ${dayWord(days)}</strong> &nbsp;|&nbsp;
    Вартість: <strong>${total} грн</strong>
  `;
}

document.getElementById('dateStart').addEventListener('change', recalcCost);
document.getElementById('dateEnd').addEventListener('change', recalcCost);

// Підтвердження — додавання до кошика (Завдання 2, крок 2)
document.getElementById('modalConfirmBtn').addEventListener('click', function () {
  const start = document.getElementById('dateStart').value;
  const end   = document.getElementById('dateEnd').value;
  const errEl = document.getElementById('modalError');

  // if-else валідація порожніх полів (Завдання 3, крок 2)
  if (!start) { errEl.textContent = '⚠ Вкажіть дату початку оренди';    return; }
  if (!end)   { errEl.textContent = '⚠ Вкажіть дату закінчення оренди'; return; }

  const startDate = new Date(start);
  const endDate   = new Date(end);
  if (endDate <= startDate) {
    errEl.textContent = '⚠ Дата закінчення має бути пізніше дати початку';
    return;
  }

  const item  = equipmentData.find(e => e.id === currentItemId);
  const days  = Math.ceil((endDate - startDate) / 86400000);
  const total = days * item.price;

  cart.push({ item, dateStart: start, dateEnd: end, days, total });
  closeModal();

  // ── ЗАВДАННЯ 2: зміна кольору кнопки після натискання ──
  const btn = document.querySelector(`.rent-btn[data-id="${item.id}"]`);
  if (btn) {
    btn.textContent = '✓ У кошику';
    btn.classList.remove('btn--primary', 'rent-btn');
    btn.classList.add('btn--added');
    btn.disabled = true;
  }

  updateCartUI();
  showCartPanel();
});

document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ─────────────────────────────────────────────────────
// 7. UI КОШИКА
// ─────────────────────────────────────────────────────
function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const itemsEl = document.getElementById('cartItems');

  countEl.textContent = cart.length;

  // Анімація лічильника
  countEl.classList.add('bump');
  setTimeout(() => countEl.classList.remove('bump'), 250);

  const grandTotal = cart.reduce((sum, c) => sum + c.total, 0);
  totalEl.textContent = grandTotal + ' грн';

  itemsEl.innerHTML = '';

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Кошик порожній</p>';
    return;
  }

  // do..while для рендеру елементів кошика (Завдання 1)
  let ci = 0;
  do {
    const entry = cart[ci];
    const div   = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item__icon">${entry.item.icon}</div>
      <div class="cart-item__info">
        <p class="cart-item__name">${entry.item.name}</p>
        <p class="cart-item__dates">
          ${formatDate(entry.dateStart)} — ${formatDate(entry.dateEnd)}
          (${entry.days} ${dayWord(entry.days)})
        </p>
        <p class="cart-item__price">${entry.total} грн</p>
      </div>
      <button class="cart-item__remove" data-cart-idx="${ci}" aria-label="Видалити">✕</button>
    `;
    itemsEl.appendChild(div);
    ci++;
  } while (ci < cart.length);

  // Обробники видалення (Завдання 2)
  const removeBtns = document.querySelectorAll('.cart-item__remove');
  for (let r = 0; r < removeBtns.length; r++) {
    removeBtns[r].addEventListener('click', function () {
      const idx       = parseInt(this.dataset.cartIdx);
      const removedId = cart[idx].item.id;
      cart.splice(idx, 1);

      // Повертаємо кнопку "Орендувати"
      const card = document.querySelector(`.equipment-card[data-id="${removedId}"]`);
      if (card) {
        const addedBtn = card.querySelector('.btn--added');
        if (addedBtn) {
          addedBtn.textContent = 'Орендувати';
          addedBtn.classList.remove('btn--added');
          addedBtn.classList.add('btn--primary', 'rent-btn');
          addedBtn.disabled    = false;
          addedBtn.dataset.id  = removedId;
          addedBtn.addEventListener('click', function () {
            openModal(parseInt(this.dataset.id));
          });
        }
      }
      updateCartUI();
    });
  }
}

// ─────────────────────────────────────────────────────
// 8. ПАНЕЛЬ КОШИКА — ЗАВДАННЯ 2: toggle видимості
// ─────────────────────────────────────────────────────
function showCartPanel() {
  document.getElementById('cartPanel').classList.add('open');
}

document.getElementById('cartToggleBtn').addEventListener('click', function () {
  const panel = document.getElementById('cartPanel');
  // if-else: перевірка стану (Завдання 2, крок 2)
  if (panel.classList.contains('open')) {
    panel.classList.remove('open');
  } else {
    panel.classList.add('open');
  }
});

document.getElementById('cartCloseBtn').addEventListener('click', function () {
  document.getElementById('cartPanel').classList.remove('open');
});

// ─────────────────────────────────────────────────────
// 9. ФІЛЬТР — ЗАВДАННЯ 2: for для обробників подій
// ─────────────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
for (let f = 0; f < filterBtns.length; f++) {
  filterBtns[f].addEventListener('click', function () {
    for (let x = 0; x < filterBtns.length; x++) {
      filterBtns[x].classList.remove('active');
    }
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    renderCards(activeFilter);
  });
}

// ─────────────────────────────────────────────────────
// 10. БУРГЕР-МЕНЮ
// ─────────────────────────────────────────────────────
const burgerBtn = document.getElementById('burgerBtn');
const mainNav   = document.getElementById('mainNav');
burgerBtn.addEventListener('click', function () {
  const isOpen = mainNav.classList.toggle('open');
  this.classList.toggle('open', isOpen);
  this.setAttribute('aria-expanded', isOpen);
});

// ─────────────────────────────────────────────────────
// 11. ІНІЦІАЛІЗАЦІЯ
// ─────────────────────────────────────────────────────
renderCards('all');
colorFeatures();
