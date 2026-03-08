
// ─────────────────────────────────────────────────────
// 1. ДАНІ ЗАМОВЛЕННЯ
// ─────────────────────────────────────────────────────
let orderItems = [
  { icon: '🚴', name: 'Гірський велосипед', days: 7, pricePerDay: 150 },
];

function dayWord(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дні';
  return 'днів';
}

// ─────────────────────────────────────────────────────
// 2. РЕНДЕР ЗАМОВЛЕННЯ — do..while (Завдання 1)
// ─────────────────────────────────────────────────────
function renderOrder() {
  const listEl  = document.getElementById('orderItemsList');
  const linesEl = document.getElementById('summaryLines');
  const totalEl = document.getElementById('summaryTotal');

  listEl.innerHTML  = '';
  linesEl.innerHTML = '';

  if (orderItems.length === 0) {
    listEl.innerHTML    = '<p style="color:var(--gray);">Замовлення порожнє. Додайте товари на сторінці обладнання.</p>';
    totalEl.textContent = '0 грн';
    return;
  }

  let grandTotal = 0;

  // ── ЗАВДАННЯ 1: do..while для позицій замовлення ──
  let i = 0;
  do {
    const item  = orderItems[i];
    const total = item.days * item.pricePerDay;
    grandTotal += total;

    // Картка позиції
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <div class="order-item__icon">${item.icon}</div>
      <div class="order-item__info">
        <p class="order-item__name">${item.name}</p>
        <p class="order-item__dates">${item.days} ${dayWord(item.days)} × ${item.pricePerDay} грн</p>
      </div>
      <p class="order-item__price">${total} грн</p>
      <button class="cart-item__remove" data-order-idx="${i}"
        style="margin-left:4px;background:none;border:none;color:var(--gray);cursor:pointer;
               font-size:1rem;min-width:32px;min-height:32px;display:flex;align-items:center;
               justify-content:center;border-radius:6px;transition:color .2s,background .2s;"
        aria-label="Видалити">✕</button>
    `;
    listEl.appendChild(div);

    // Рядок підсумку — if-else виділення > 1000 грн (Завдання 1, крок 3)
    const lineDiv = document.createElement('div');
    lineDiv.className = 'summary-item';
    if (total > 1000) lineDiv.style.color = 'var(--orange)';
    lineDiv.innerHTML = `<span>${item.icon} ${item.name}</span><span>${total} грн</span>`;
    linesEl.appendChild(lineDiv);

    i++;
  } while (i < orderItems.length);

  // Страховий депозит 10%
  const deposit = Math.round(grandTotal * 0.1);
  const depDiv  = document.createElement('div');
  depDiv.className = 'summary-item';
  depDiv.innerHTML = `<span>Страховий депозит (10%)</span><span>${deposit} грн</span>`;
  linesEl.appendChild(depDiv);

  totalEl.textContent = (grandTotal + deposit) + ' грн';

  // Обробники видалення (Завдання 2)
  const removeBtns = document.querySelectorAll('[data-order-idx]');
  for (let r = 0; r < removeBtns.length; r++) {
    removeBtns[r].addEventListener('click', function () {
      orderItems.splice(parseInt(this.dataset.orderIdx), 1);
      renderOrder();
    });
  }
}

// ─────────────────────────────────────────────────────
// 3. ДОДАВАННЯ ВРУЧНУ — ЗАВДАННЯ 3
// ─────────────────────────────────────────────────────
document.getElementById('addManualBtn').addEventListener('click', function () {
  const selVal  = document.getElementById('manualItem').value;
  const daysVal = parseInt(document.getElementById('manualDays').value);
  const errEl   = document.getElementById('manualError');

  // if-else валідація (Завдання 3, крок 2)
  if (!selVal)                   { errEl.textContent = '⚠ Оберіть обладнання';             return; }
  if (!daysVal || daysVal < 1)   { errEl.textContent = '⚠ Кількість днів має бути ≥ 1';    return; }

  errEl.textContent = '';
  const parts = selVal.split('|');
  orderItems.push({ icon: parts[2], name: parts[0], days: daysVal, pricePerDay: parseInt(parts[1]) });
  document.getElementById('manualItem').value = '';
  document.getElementById('manualDays').value = '1';
  renderOrder();
});

// ─────────────────────────────────────────────────────
// 4. ВИБІР МЕТОДУ ОПЛАТИ — for для обробників (Завдання 2)
// ─────────────────────────────────────────────────────
let selectedMethod = 'card';

const payBtns = document.querySelectorAll('.pay-method-btn');
for (let p = 0; p < payBtns.length; p++) {
  payBtns[p].addEventListener('click', function () {
    for (let x = 0; x < payBtns.length; x++) {
      payBtns[x].classList.remove('selected');
    }
    this.classList.add('selected');
    selectedMethod = this.dataset.method;

    const cardFields = document.getElementById('cardFields');
    const altMsg     = document.getElementById('altPayMsg');

    // if-else: показ/приховання полів картки (Завдання 2, крок 2)
    if (selectedMethod === 'card') {
      cardFields.style.display = 'block';
      altMsg.style.display     = 'none';
    } else {
      cardFields.style.display = 'none';
      altMsg.style.display     = 'block';
      const icons = { apple: '🍎 Apple Pay', google: '🟢 Google Pay', privat: '🏦 ПриватБанк' };
      document.getElementById('altPayName').textContent = icons[selectedMethod] || '';
      document.getElementById('altPayIcon').textContent =
        selectedMethod === 'apple' ? '🍎' : selectedMethod === 'google' ? '🟢' : '🏦';
    }
  });
}

// ─────────────────────────────────────────────────────
// 5. ВАЛІДАЦІЯ КАРТКИ В РЕАЛЬНОМУ ЧАСІ (Завдання 3)
// ─────────────────────────────────────────────────────
function setFieldState(inputEl, hintEl, isValid, okMsg, errMsg) {
  // if-else зміна стилю поля (Завдання 1, крок 3)
  if (isValid) {
    inputEl.classList.remove('invalid');
    inputEl.classList.add('valid');
    hintEl.className   = 'field-hint ok';
    hintEl.textContent = okMsg;
  } else {
    inputEl.classList.remove('valid');
    inputEl.classList.add('invalid');
    hintEl.className   = 'field-hint err';
    hintEl.textContent = errMsg;
  }
}

document.getElementById('cardHolder').addEventListener('input', function () {
  setFieldState(this, document.getElementById('hintHolder'),
    this.value.trim().length >= 3,
    '✓ Виглядає добре', 'Введіть ім\'я власника картки'
  );
});

document.getElementById('cardNumber').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const digits = this.value.replace(/\s/g, '');
  setFieldState(this, document.getElementById('hintNumber'),
    digits.length === 16,
    '✓ Номер картки коректний',
    digits.length > 0 ? `${digits.length}/16 цифр` : 'Введіть 16-значний номер'
  );
});

document.getElementById('cardExpiry').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
  const month = parseInt(this.value.split('/')[0]);
  setFieldState(this, document.getElementById('hintExpiry'),
    this.value.length === 5 && month >= 1 && month <= 12,
    '✓ Коректний термін',
    this.value.length > 0 ? 'Формат ММ/РР' : ''
  );
});

document.getElementById('cardCvv').addEventListener('input', function () {
  setFieldState(this, document.getElementById('hintCvv'),
    this.value.length === 3, '✓', this.value.length > 0 ? '3 цифри' : ''
  );
});

// ─────────────────────────────────────────────────────
// 6. НАВІГАЦІЯ КРОКІВ — ЗАВДАННЯ 2: toggle показу панелей
// ─────────────────────────────────────────────────────
let currentStep = 1;

function goToStep(n) {
  // Оновлення індикатора кроків (for + if-else) (Завдання 1, крок 3)
  const steps = document.querySelectorAll('.step');
  for (let s = 0; s < steps.length; s++) {
    const sNum = parseInt(steps[s].dataset.step);
    steps[s].classList.remove('active', 'done');
    if (sNum === n)     steps[s].classList.add('active');
    else if (sNum < n)  steps[s].classList.add('done');
  }

  // Показ/приховання панелей (Завдання 2, крок 1)
  const panels = document.querySelectorAll('.step-panel');
  for (let p = 0; p < panels.length; p++) {
    panels[p].classList.remove('active');
  }
  document.getElementById(`panel${n}`).classList.add('active');
  currentStep = n;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('toStep2Btn').addEventListener('click', function () {
  if (orderItems.length === 0) {
    alert('⚠ Додайте хоча б одну позицію до замовлення');
    return;
  }
  goToStep(2);
});

document.getElementById('backTo1Btn').addEventListener('click', () => goToStep(1));

document.getElementById('toStep3Btn').addEventListener('click', function () {
  // if-else: валідація картки (Завдання 3, крок 2)
  if (selectedMethod === 'card') {
    const holder = document.getElementById('cardHolder').value.trim();
    const number = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry').value;
    const cvv    = document.getElementById('cardCvv').value;

    if (holder.length < 3)   { document.getElementById('cardHolder').focus(); return; }
    if (number.length !== 16) { document.getElementById('cardNumber').focus(); return; }
    if (expiry.length !== 5)  { document.getElementById('cardExpiry').focus(); return; }
    if (cvv.length !== 3)     { document.getElementById('cardCvv').focus();    return; }
  }

  // ── ЗАВДАННЯ 3: DOM-оновлення повідомлення про успіх ──
  const total = document.getElementById('summaryTotal').textContent;
  document.getElementById('successMsg').textContent =
    `Ваша оренда підтверджена. Сплачено: ${total}. Дякуємо за вибір SportRent!`;

  goToStep(3);
});

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
renderOrder();
