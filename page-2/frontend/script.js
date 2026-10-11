/* Product page data and cart state are intentionally held in memory only. */
const CONFIG = window.MW75_CONFIG || {};
const API_BASE_URL = CONFIG.apiBaseUrl || '';
const PRODUCT_ID = CONFIG.productId || '';
let PRODUCT_DATA = null;
let ACTIVE_VARIANT = null;
let gallery = null;

const money = (minor, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);
const required = (condition, message) => { if (!condition) throw new Error(message); };
const escapeAttr = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);

const CartStore = {
  item: null, isOpen: false, lastFocusedEl: null,
  addItem(variant) {
    const error = document.getElementById('product-error');
    if (this.item) { error.hidden = false; return; }
    error.hidden = true;
    this.item = { name: PRODUCT_DATA.name, price: PRODUCT_DATA.price, currency: PRODUCT_DATA.currency,
      color: variant.value, image: variant.images.find(i => i.role === 'hero') || variant.images[0] };
    this.openDrawer(); this.render();
  },
  removeItem() { this.item = null; this.render(); },
  openDrawer() {
    this.lastFocusedEl = document.activeElement; this.isOpen = true; this.render();
    requestAnimationFrame(() => document.querySelector('#cart-close-btn')?.focus());
  },
  closeDrawer(target) {
    this.isOpen = false; this.render();
    (target || this.lastFocusedEl)?.focus?.();
  },
  render() {
    const count = this.item ? 1 : 0;
    const badge = document.getElementById('cart-badge');
    if (badge) { badge.textContent = count; badge.setAttribute('aria-label', `Cart, ${count} items`); }
    document.getElementById('cart-icon-btn')?.setAttribute('aria-label', `Open cart, ${count} items`);
    document.getElementById('cart-drawer')?.classList.toggle('is-open', this.isOpen);
    document.querySelector('.overlay')?.classList.toggle('is-visible', this.isOpen);
    document.getElementById('cart-drawer-title').textContent = `Cart (${count})`;
    const body = document.getElementById('cart-drawer-body');
    if (!this.item) {
      body.innerHTML = '<div class="cart-drawer__empty"><p>Your cart is empty</p><a href="#" class="btn btn--secondary js-placeholder">Continue shopping</a></div>';
      return;
    }
    const item = this.item;
    body.innerHTML = `<ul class="cart-items"><li class="cart-item"><img src="${escapeAttr(item.image.url)}" alt="${escapeAttr(item.image.alt)}" class="cart-item__img"><div class="cart-item__details"><p class="cart-item__name">${escapeAttr(item.name)}</p><p class="cart-item__color">${escapeAttr(item.color)}</p><p class="cart-item__price">${money(item.price, item.currency)}</p><p class="cart-item__qty">Quantity: 1</p></div><button class="cart-item__remove" data-action="remove" aria-label="Remove ${escapeAttr(item.color)} ${escapeAttr(item.name)}">Remove</button></li></ul><div class="cart-drawer__footer"><div class="cart-drawer__totals"><span>Total</span><span>${money(item.price, item.currency)} ${escapeAttr(item.currency)}</span></div><p class="cart-drawer__note">Taxes and shipping calculated at checkout</p><a href="#" class="btn btn--secondary js-placeholder">View Cart</a><a href="#" class="btn btn--primary js-placeholder">Checkout</a></div>`;
  }
};

function GalleryController(el) { this.el = el; this.index = 0; this.images = []; }
GalleryController.prototype.goTo = function (index) {
  if (!this.images.length) return;
  this.index = (index + this.images.length) % this.images.length;
  const track = this.el.querySelector('#gallery-track');
  if (track) track.style.transform = `translateX(calc(-100% * ${this.index}))`;
  this.el.querySelectorAll('.gallery__dot').forEach((dot, i) => {
    dot.classList.toggle('is-active', i === this.index);
    i === this.index ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current');
  });
};
GalleryController.prototype.loadVariant = function (variant) {
  this.images = [...variant.images].sort((a, b) => ['hero','front','engraving','straight'].indexOf(a.role) - ['hero','front','engraving','straight'].indexOf(b.role));
  const track = this.el.querySelector('#gallery-track'); track.replaceChildren();
  this.images.forEach((image, index) => {
    const li = document.createElement('li'); li.className = 'gallery__slide';
    const img = document.createElement('img'); img.className = 'gallery__img'; img.src = image.url; img.alt = image.alt; img.fetchPriority = index === 0 ? 'high' : 'auto';
    li.append(img); track.append(li);
  });
  const dots = this.el.querySelector('.gallery__dots');
  if (dots) {
    dots.replaceChildren();
    this.images.forEach((image, i) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button'; button.className = `gallery__dot${i === 0 ? ' is-active' : ''}`;
      button.setAttribute('aria-label', `Show photo: ${image.alt}`);
      if (!i) button.setAttribute('aria-current', 'true');
      const thumb = document.createElement('img'); thumb.src = image.url; thumb.alt = ''; thumb.loading = 'lazy';
      button.append(thumb); button.addEventListener('click', () => this.goTo(i));
      li.append(button); dots.append(li);
    });
  }
  this.goTo(0);
};

function assertProduct(data) {
  required(data && typeof data === 'object', 'Product data is missing.');
  ['name','subtitle','brand','description','currency'].forEach(k => required(typeof data[k] === 'string' && data[k].trim(), `Product field “${k}” is missing.`));
  required(Number.isFinite(data.price) && data.price >= 0, 'Product price is invalid.');
  required(Array.isArray(data.variants) && data.variants.length > 0, 'Product variants are missing.');
  data.variants.forEach(v => {
    required(v.value && Array.isArray(v.images) && v.images.length, 'A product variant is incomplete.');
    v.images.forEach(image => required(typeof image.url === 'string' && image.url && typeof image.alt === 'string' && image.alt, 'A product image is missing its URL or alt text.'));
  });
  ['highlights','services','specificationGroups','boxItems'].forEach(k => required(Array.isArray(data[k]) && data[k].length > 0, `Product field “${k}” is missing.`));
  data.specificationGroups.forEach(group => required(group.title && Array.isArray(group.items) && group.items.length > 0, 'A specification group is incomplete.'));
  data.boxItems.forEach(item => required(item.name && item.image && typeof item.imageAlt === 'string', 'An in-the-box item is incomplete.'));
  required(data.collaboration && typeof data.collaboration === 'object', 'Collaboration details are missing.');
}

function setText(selector, value) { const el = document.querySelector(selector); if (el) el.textContent = value ?? ''; }
function setImage(selector, src, alt) { const el = document.querySelector(selector); if (el && src) { el.src = src; el.alt = alt || ''; } }
function renderProduct(data) {
  PRODUCT_DATA = data;
  setText('.product__name', data.name); setText('.product__subtitle', data.subtitle); setText('.product__price', money(data.price, data.currency));
  setText('.product-description__body', data.description);
  const galleryEl = document.querySelector('.product__gallery'); gallery = new GalleryController(galleryEl);
  const variants = data.variants.filter(v => v.type === 'color');
  required(variants.length > 0, 'No color variants are available.');
  const fieldset = document.getElementById('color-fieldset'); const list = fieldset.querySelector('.product__swatches-list'); list.replaceChildren();
  variants.forEach((variant, index) => {
    const label = document.createElement('label'); label.className = 'swatch'; label.title = variant.value; label.dataset.colorId = variant.value.toLowerCase();
    const input = document.createElement('input'); input.type = 'radio'; input.name = 'color'; input.value = variant.value; input.checked = index === 0; input.setAttribute('aria-label', variant.value);
    label.append(input); list.append(label);
  });
  ACTIVE_VARIANT = variants[0]; setText('#color-name', `(${ACTIVE_VARIANT.value})`); gallery.loadVariant(ACTIVE_VARIANT);
  fieldset.addEventListener('change', e => { const variant = variants.find(v => v.value === e.target.value); if (!variant) return; ACTIVE_VARIANT = variant; setText('#color-name', `(${variant.value})`); gallery.loadVariant(variant); });
  document.getElementById('gallery-prev').addEventListener('click', () => gallery.goTo(gallery.index - 1));
  document.getElementById('gallery-next').addEventListener('click', () => gallery.goTo(gallery.index + 1));

  const features = document.querySelector('.features__list');
  // Keep the six locally-authored icon elements while replacing only their labels
  // with API text. API icon identifiers are optional and must never supply markup.
  const localFeatureIcons = [...features.querySelectorAll('.features__icon')].map(icon => icon.cloneNode(true));
  features.replaceChildren();
  data.highlights.forEach((h, index) => {
    const li = document.createElement('li'); li.className = 'features__item';
    if (localFeatureIcons[index]) li.append(localFeatureIcons[index]);
    const span = document.createElement('span'); span.textContent = h.description || h.title || h.name || '';
    li.append(span); features.append(li);
  });
  const serviceList = document.querySelector('.service-info__list'); serviceList.replaceChildren();
  const serviceCopy = {
    'free shipping': 'Free ground shipping on orders of $99 or more in the U.S.',
    'free returns': 'We offer a 14-day return policy, allowing you to shop with confidence.',
    'product protection': 'Rest easy with our manufacturer warranty, ensuring that your product is protected against any manufacturing defects or issues.'
  };
  data.services.forEach(s => {
    const li = document.createElement('li'); li.className = 'service-info__item';
    const title = document.createElement('h3'); title.className = 'service-info__title'; title.textContent = s.title;
    const desc = document.createElement('p'); desc.className = 'service-info__desc';
    desc.textContent = serviceCopy[String(s.title).toLowerCase()] || s.description;
    li.append(title, desc); serviceList.append(li);
  });
  const collaboration = data.collaboration;
  setText('.brand-tumi__eyebrow', 'Master & Dynamic for');
  setText('.brand-tumi__heading', 'TUMI');
  setText('.brand-tumi__desc', "A collection of active noise-cancelling sound tools created in partnership with the international travel and lifestyle brand built to enhance any journey. Featuring TUMI's iconic 19 Degree design details, the headphones and earphones are seamless blend of engineering precision and artistic expression.");
  setImage('.brand-tumi__img', 'assets/images/sections/TUMI_Brand.png', 'TUMI and Master & Dynamic collaboration design');
  const productImage = collaboration.productImage || 'assets/images/sections/MW75B_TUMI_Feature.png';
  setImage('.product-description__img', productImage, collaboration.productImageAlt || 'MW75 TUMI headphones');
  setText('.product-description__heading', `Active ${data.subtitle.replace(/^active\s+/i, '')}`);
  setText('.product-description__body', 'The MW75 Active Noise-Cancelling Wireless Headphones deliver detailed, serious acoustics and custom-tailored sound with 40mm Beryllium drivers and Adaptive Active Noise Cancellation for the perfect combination of sound and silence. Experience effortless all-day listening with lightweight anodized aluminum and soft lambskin leather in a distinct, refined silhouette.');
  const specs = document.querySelector('.tech-specs__accordions'); specs.replaceChildren();
  data.specificationGroups.forEach(group => {
    const details = document.createElement('details'); details.className = 'tech-specs__group';
    const summary = document.createElement('summary'); summary.className = 'tech-specs__summary';
    const title = document.createElement('span'); title.textContent = group.title;
    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('class', 'tech-specs__chevron'); chevron.setAttribute('width', '20'); chevron.setAttribute('height', '20'); chevron.setAttribute('viewBox', '0 0 20 20'); chevron.setAttribute('fill', 'none'); chevron.setAttribute('aria-hidden', 'true');
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    arrow.setAttribute('points', '5 8 10 13 15 8'); arrow.setAttribute('stroke', 'currentColor'); arrow.setAttribute('stroke-width', '1.5'); arrow.setAttribute('stroke-linecap', 'round'); arrow.setAttribute('stroke-linejoin', 'round'); chevron.append(arrow);
    summary.append(title, chevron); details.append(summary);
    const table = document.createElement('table'); table.className = 'tech-specs__table'; const tbody = document.createElement('tbody');
    group.items.forEach(item => { const tr = document.createElement('tr'); const th = document.createElement('th'); th.scope = 'row'; th.textContent = item.label; const td = document.createElement('td'); td.textContent = item.value; tr.append(th, td); tbody.append(tr); });
    table.append(tbody); details.append(table); specs.append(details);
  });
  const box = document.querySelector('.in-the-box__grid'); box.replaceChildren(); data.boxItems.forEach(item => { const li = document.createElement('li'); li.className = 'in-the-box__item'; const img = document.createElement('img'); img.src = item.image; img.alt = item.imageAlt; img.className = 'in-the-box__img'; img.loading = 'lazy'; const name = document.createElement('p'); name.className = 'in-the-box__name'; name.textContent = item.name; li.append(img, name); box.append(li); });
  document.querySelectorAll('[data-product-content]').forEach(el => el.hidden = false);
  document.getElementById('product-loading').hidden = true;
}

async function loadProduct() {
  required(API_BASE_URL && PRODUCT_ID, 'API configuration is missing. Set VITE_API_BASE_URL and VITE_PRODUCT_ID.');
  let response;
  try { response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/products/${encodeURIComponent(PRODUCT_ID)}`); }
  catch { throw new Error('We could not reach the product service. Check your connection and try again.'); }
  if (response.status === 404) throw new Error('Product not found. Check the product ID and try again.');
  if (!response.ok) throw new Error(`We could not load this product (HTTP ${response.status}). Please try again.`);
  let payload; try { payload = await response.json(); } catch { throw new Error('The product service returned invalid JSON. Please try again.'); }
  if (!payload || !('data' in payload) || !payload.meta) throw new Error('The product service returned an invalid response. Please try again.');
  assertProduct(payload.data); renderProduct(payload.data);
}

function initInteractions() {
  document.getElementById('add-to-cart-btn').addEventListener('click', () => CartStore.addItem(ACTIVE_VARIANT));
  document.getElementById('cart-icon-btn').addEventListener('click', () => CartStore.openDrawer());
  document.getElementById('cart-close-btn').addEventListener('click', () => CartStore.closeDrawer(document.getElementById('cart-icon-btn')));
  document.querySelector('.overlay').addEventListener('click', () => CartStore.closeDrawer(document.getElementById('cart-icon-btn')));
  const drawer = document.getElementById('cart-drawer');
  drawer.addEventListener('click', e => { if (e.target.closest('[data-action="remove"]')) CartStore.removeItem(); if (e.target.closest('.js-placeholder')) e.preventDefault(); });
  drawer.addEventListener('keydown', e => { if (e.key !== 'Tab' || !CartStore.isOpen) return; const items = [...drawer.querySelectorAll('a[href],button:not([disabled])')]; if (!items.length) return; if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1).focus(); } else if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0].focus(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && CartStore.isOpen) CartStore.closeDrawer(CartStore.lastFocusedEl); });
  document.addEventListener('click', e => { if (e.target.closest('a.js-placeholder')) e.preventDefault(); });
  CartStore.render();
}

function showLoadError(message) {
  document.getElementById('product-loading').hidden = true;
  document.querySelectorAll('[data-product-content]').forEach(el => el.hidden = true);
  const panel = document.getElementById('product-load-error'); panel.hidden = false;
  panel.querySelector('[data-error-message]').textContent = message;
}
document.addEventListener('DOMContentLoaded', async () => {
  initInteractions();
  const retry = async () => { const panel = document.getElementById('product-load-error'); panel.hidden = true; document.getElementById('product-loading').hidden = false; try { await loadProduct(); } catch (error) { showLoadError(error.message || 'Unable to load product. Please try again.'); } };
  document.getElementById('product-retry').addEventListener('click', retry);
  await retry();
});
