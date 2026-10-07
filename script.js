const state = {
  activeView: 'landing',
  unitPrice: 4999,
  cart: [
    {
      id: 1,
      name: "Air Zoom Nitro Runner X",
      price: 4999,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80"
    }
  ],
  discountPercentage: 0
};

function navigateTo(viewId) {
  document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));
  const target = document.getElementById(`${viewId}-view`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    state.activeView = viewId;
  }
  renderCart();
  updateCalculations();
}

function changeQuantity(delta) {
  const input = document.getElementById('productQtyInput');
  let currentVal = parseInt(input.value) || 1;
  currentVal += delta;
  if (currentVal < 1) currentVal = 1;
  input.value = currentVal;
}

function switchMainImage(element, newSrc) {
  document.getElementById('mainProductImg').src = newSrc;
  document.querySelectorAll('.gallery-thumb').forEach(th => th.classList.remove('active'));
  element.classList.add('active');
}

function addProductToCart() {
  const qty = parseInt(document.getElementById('productQtyInput').value) || 1;
  const existingItem = state.cart.find(item => item.id === 1);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    state.cart.push({
      id: 1,
      name: "Air Zoom Nitro Runner X",
      price: state.unitPrice,
      quantity: qty,
      image: document.getElementById('mainProductImg').src
    });
  }

  updateNavBadge();
  navigateTo('cart');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  updateNavBadge();
  renderCart();
  updateCalculations();
}

function updateNavBadge() {
  const totalCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById('navCartCount').textContent = totalCount;
}

function renderCart() {
  const tbody = document.getElementById('cartTableBody');
  tbody.innerHTML = '';

  if (state.cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #64748b;">Your cart is currently empty.</td></tr>`;
    return;
  }

  state.cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="cart-prod-cell">
          <img src="${item.image}" alt="${item.name}" />
          <strong>${item.name}</strong>
        </div>
      </td>
      <td>${item.quantity}</td>
      <td>₹${item.price * item.quantity}</td>
      <td>
        <button class="remove-btn" title="Remove" onclick="removeFromCart(${item.id})">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateCalculations() {
  const subTotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = Math.round(subTotal * 0.18); // 18% GST[span_25](start_span)[span_25](end_span)[span_26](start_span)[span_26](end_span)
  const discount = Math.round(subTotal * state.discountPercentage);
  const total = subTotal + taxes - discount;

  document.getElementById('subTotalDisplay').textContent = subTotal;
  document.getElementById('taxesDisplay').textContent = taxes;
  document.getElementById('discountDisplay').textContent = discount;
  document.getElementById('totalDisplay').textContent = Math.max(0, total);

  document.getElementById('checkoutSubTotal').textContent = subTotal;
  document.getElementById('checkoutTaxes').textContent = taxes;
  document.getElementById('checkoutDiscount').textContent = discount;
  document.getElementById('checkoutTotal').textContent = Math.max(0, total);
  document.getElementById('payNowBtnAmount').textContent = Math.max(0, total);
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const feedback = document.getElementById('couponFeedback');
  if (code === 'SAVE10') {
    state.discountPercentage = 0.10;
    feedback.style.color = '#059669';
    feedback.textContent = 'Coupon SAVE10 applied! 10% discount activated.';
  } else {
    state.discountPercentage = 0;
    feedback.style.color = '#dc2626';
    feedback.textContent = 'Invalid Coupon Code. Try: SAVE10';
  }
  updateCalculations();
}

function applyCheckoutCoupon() {
  const code = document.getElementById('checkoutCouponInput').value.trim().toUpperCase();
  if (code === 'SAVE10') {
    state.discountPercentage = 0.10;
    alert('Coupon SAVE10 applied! 10% discount activated.');
  } else {
    state.discountPercentage = 0;
    alert('Invalid Coupon Code. Try: SAVE10');
  }
  updateCalculations();
}

function switchPayMethod(button, method) {
  document.querySelectorAll('.pay-tab-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

function triggerPayment() {
  const email = document.getElementById('customerEmail').value;
  if (!email) {
    alert('Please enter a valid Email ID to complete checkout.');
    return;
  }
  if (state.cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  alert(`Payment successful via Razorpay for ${email}! Order placed.`);
  state.cart = [];
  updateNavBadge();
  navigateTo('landing');
}

updateNavBadge();
renderCart();
updateCalculations();