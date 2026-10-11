/* =============================================================================
   MW75 TUMI — Product Detail Page
   script.js
   ============================================================================= */

/* -----------------------------------------------------------------------------
   PRODUCT DATA
   All product information is hard-coded here; no API or external fetch is used.
   (Requirement 22.1)
----------------------------------------------------------------------------- */

const PRODUCT_DATA = {
  name: 'MW75 TUMI',
  subtitle: 'Noise-Cancelling Wireless Headphones',
  price: 750.00,
  priceFormatted: '$750.00',
  priceTotalFormatted: '$750.00 USD',

  colors: [
    {
      id: 'black',
      name: 'Black',
      swatchHex: '#000000',
      images: [
        { src: 'assets/images/gallery/MW75B_Hero.png',      alt: 'MW75 TUMI Black — Hero view' },
        { src: 'assets/images/gallery/MW75B_Front.png',     alt: 'MW75 TUMI Black — Front view' },
        { src: 'assets/images/gallery/MW75B_Engraving.png', alt: 'MW75 TUMI Black — Engraving detail' },
        { src: 'assets/images/gallery/MW75B_Straight.png',  alt: 'MW75 TUMI Black — Side view' },
      ],
    },
    {
      id: 'silver',
      name: 'Silver',
      swatchHex: '#e1e1e1',
      images: [
        { src: 'assets/images/gallery/MW75S_Hero.png',      alt: 'MW75 TUMI Silver — Hero view' },
        { src: 'assets/images/gallery/MW75S_Front.png',     alt: 'MW75 TUMI Silver — Front view' },
        { src: 'assets/images/gallery/MW75S_Engraving.png', alt: 'MW75 TUMI Silver — Engraving detail' },
        { src: 'assets/images/gallery/MW75S_Straight.png',  alt: 'MW75 TUMI Silver — Side view' },
      ],
    },
  ],

  features: [
    { text: 'ANC (Active Noise Cancellation)',                        icon: 'icon-anc' },
    { text: 'Anodized aluminum, tempered glass and lambskin leather',  icon: 'icon-material' },
    { text: '40mm beryllium drivers',                                  icon: 'icon-driver' },
    { text: '32 hours of listening',                                   icon: 'icon-battery' },
    { text: 'Bluetooth® 5.1',                                          icon: 'icon-bluetooth' },
    { text: '4 beamforming microphones',                               icon: 'icon-mic' },
  ],

  techSpecs: [
    {
      group: 'Materials and Design',
      rows: [
        { attr: 'Materials',    value: 'Lambskin leather headband and ear pads; anodized aluminum controls' },
        { attr: 'Dimensions',   value: '160.75mm x 197.83mm x 83.57mm' },
        { attr: 'Weight',       value: '338g' },
        { attr: 'Ear Coupling', value: 'Over-Ear' },
        { attr: 'Ear Pads',     value: 'Memory foam with lambskin leather, magnetic and replaceable' },
      ],
    },
    {
      group: 'Sound and Features',
      rows: [
        { attr: 'Drivers',          value: '40mm beryllium' },
        { attr: 'Impedance',        value: '32 Ohms' },
        { attr: 'Talk Microphones', value: '4 microphones with wind protection' },
        { attr: 'ANC Microphones',  value: '4 microphones' },
        { attr: 'Voice Assistant',  value: 'Compatible with built-in device voice assistants' },
      ],
    },
    {
      group: 'Connectivity and Charging',
      rows: [
        { attr: 'Battery Life',                        value: 'Up to 32 hours, or up to 28 hours with ANC on' },
        { attr: 'Bluetooth Profile',                   value: 'Bluetooth® 5.1, 100ft/30m range, AAC, aptX™ Adaptive up to 24bit/48kHz, and SBC' },
        { attr: 'Wired Digital Headphone Connection',  value: 'Hi-res audio up to 24-bit/96kHz via included USB-C to USB-C cable on supported devices' },
        { attr: 'Analog Headphone Connection',         value: 'USB-C to 3.5mm cable for analog audio (optional)' },
        { attr: 'Cables',                              value: 'USB-C to 3.5mm audio cable and USB-C to USB-C charging cable' },
        { attr: 'Antenna',                             value: 'Internal antenna' },
      ],
    },
  ],

  inTheBox: [
    { name: 'Wireless Headphones',           img: 'assets/images/in-the-box/ITB_Headphones.png' },
    { name: 'USB-C to USB-C Charging Cable', img: 'assets/images/in-the-box/ITB_USB_C_to_C.png' },
    { name: 'USB-C to 3.5mm Audio Cable',    img: 'assets/images/in-the-box/ITB_USB_C_to_35mm.png' },
    { name: 'USB-C to USB-A Adapter',        img: 'assets/images/in-the-box/ITB_USB_C_to_A.png' },
    { name: '3.5mm to 1/4" Adapter',         img: 'assets/images/in-the-box/ITB_35mm_to_quarter.png' },
    { name: 'Flight Adapter',                img: 'assets/images/in-the-box/ITB_Flight_Adapter.png' },
    { name: 'Hard Shell Travel Case',        img: 'assets/images/in-the-box/ITB_Hard_Case.png' },
  ],
};

/* -----------------------------------------------------------------------------
   CART STORE
   Plain object acting as a state machine for cart state.
   (Requirements 8.1, 8.2, 9.1–9.8, 10.1–10.4, 11.1–11.3, 22.2–22.5)
----------------------------------------------------------------------------- */

const CartStore = {
  // --- State ---
  items: new Map(),   // key: colorId (string), value: CartItem
  isOpen: false,
  lastFocusedEl: null,

  /**
   * Add an item to the cart by colorId.
   * If already present, show the error message and do not open the drawer.
   * (Requirements 8.1, 8.2, 22.2)
   * @param {string} colorId
   */
  addItem(colorId) {
    const errorEl = document.getElementById('product-error');

    if (this.items.has(colorId)) {
      // Duplicate: show error, do NOT open drawer (Requirement 8.2)
      if (errorEl) errorEl.hidden = false;
      return;
    }

    // Hide error (Requirement 8.6)
    if (errorEl) errorEl.hidden = true;

    // Build cart item from PRODUCT_DATA
    const color = PRODUCT_DATA.colors.find(c => c.id === colorId);
    if (!color) return;

    /** @type {CartItem} */
    const item = {
      colorId:   color.id,
      colorName: color.name,
      name:      PRODUCT_DATA.name,
      price:     PRODUCT_DATA.price,
      qty:       1,
      imgSrc:    color.images[0].src,
      imgAlt:    color.images[0].alt,
    };

    this.items.set(colorId, item);
    this.openDrawer();
    this.render();
  },

  /**
   * Remove a specific item from the cart by colorId.
   * (Requirements 11.1, 11.2)
   * @param {string} colorId
   */
  removeItem(colorId) {
    this.items.delete(colorId);
    this.render();
  },

  /**
   * Open the cart drawer and move keyboard focus into it.
   * (Requirements 10.1, 21.2)
   */
  openDrawer() {
    this.lastFocusedEl = document.activeElement;
    this.isOpen = true;
    this.render();

    // Move focus to first focusable element after transition (Requirement 21.2)
    requestAnimationFrame(() => {
      const drawerEl = document.getElementById('cart-drawer');
      if (!drawerEl) return;
      const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const firstFocusable = drawerEl.querySelector(focusableSelectors);
      if (firstFocusable) firstFocusable.focus();
    });
  },

  /**
   * Close the cart drawer and return keyboard focus to the given element.
   * (Requirements 10.2, 10.3, 21.3)
   * @param {Element|null} returnFocusEl
   */
  closeDrawer(returnFocusEl) {
    this.isOpen = false;
    this.render();
    const target = returnFocusEl || this.lastFocusedEl;
    if (target && typeof target.focus === 'function') target.focus();
  },

  /**
   * Return the total number of distinct items in the cart.
   * @returns {number}
   */
  getTotalCount() {
    return this.items.size;
  },

  /**
   * Return the total cart price (always $750.00 per item, qty always 1).
   * (Requirement 22.3)
   * @returns {number}
   */
  getTotalPrice() {
    return this.items.size * 750.00;
  },

  /**
   * Sync the DOM to the current cart state:
   *   - update #cart-badge textContent + aria-label
   *   - toggle .is-open on .cart-drawer and .is-visible on .overlay
   *   - update the cart drawer title
   *   - rebuild #cart-drawer-body innerHTML
   * (Requirements 9.1, 9.6, 10.2)
   */
  render() {
    const count = this.getTotalCount();

    // Update cart badge (Requirement 3.5)
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.setAttribute('aria-label', 'Cart, ' + count + ' items');
    }

    // Update cart icon button aria-label
    const cartIconBtn = document.getElementById('cart-icon-btn');
    if (cartIconBtn) {
      cartIconBtn.setAttribute('aria-label', 'Open cart, ' + count + ' items');
    }

    // Toggle drawer open state (Requirement 9.1, 10.2)
    const drawerEl = document.getElementById('cart-drawer');
    if (drawerEl) {
      drawerEl.classList.toggle('is-open', this.isOpen);
    }

    // Toggle overlay visibility (Requirement 9.7)
    const overlayEl = document.querySelector('.overlay');
    if (overlayEl) {
      overlayEl.classList.toggle('is-visible', this.isOpen);
    }

    // Update drawer title (Requirement 9.1)
    const titleEl = document.getElementById('cart-drawer-title');
    if (titleEl) {
      titleEl.textContent = 'Cart (' + count + ')';
    }

    // Rebuild drawer body (Requirements 9.2–9.6)
    const body = document.getElementById('cart-drawer-body');
    if (!body) return;

    if (this.items.size === 0) {
      // Empty state (Requirement 9.6)
      body.innerHTML = `
        <div class="cart-drawer__empty">
          <p>Your cart is empty</p>
          <a href="#" class="btn btn--secondary js-placeholder">Continue shopping</a>
        </div>`;
    } else {
      // Items state (Requirements 9.2, 9.3, 9.4, 9.5)
      let itemsHTML = '<ul class="cart-items">';
      for (const item of this.items.values()) {
        itemsHTML += `
          <li class="cart-item" data-color-id="${item.colorId}">
            <img src="${item.imgSrc}" alt="${item.imgAlt}" class="cart-item__img">
            <div class="cart-item__details">
              <p class="cart-item__name">${item.name}</p>
              <p class="cart-item__color">${item.colorName}</p>
              <p class="cart-item__price">$${item.price.toFixed(2)}</p>
              <p class="cart-item__qty">Quantity: ${item.qty}</p>
            </div>
            <button class="cart-item__remove" data-action="remove" data-color-id="${item.colorId}" aria-label="Remove ${item.colorName} ${item.name}">Remove</button>
          </li>`;
      }
      itemsHTML += '</ul>';

      const total = this.getTotalPrice();
      itemsHTML += `
        <div class="cart-drawer__footer">
          <div class="cart-drawer__totals">
            <span>Total</span>
            <span>$${total.toFixed(2)} USD</span>
          </div>
          <p class="cart-drawer__note">Taxes and shipping calculated at checkout</p>
          <a href="#" class="btn btn--secondary js-placeholder">View Cart</a>
          <a href="#" class="btn btn--primary js-placeholder">Checkout</a>
        </div>`;

      body.innerHTML = itemsHTML;
    }
  },
};

/* -----------------------------------------------------------------------------
   GALLERY CONTROLLER
   Per-instance controller for the photo gallery carousel.
   (Requirements 5.2, 5.3, 5.4, 6.3)
----------------------------------------------------------------------------- */

/**
 * @param {Element} galleryEl  The .product__gallery container element
 */
function GalleryController(galleryEl) {
  this.currentIndex = 0;
  this.galleryEl = galleryEl;
}

/**
 * Navigate to a specific slide index (0–3).
 * Updates the track transform and the aria-current dot.
 * (Requirements 5.3, 5.4)
 * @param {number} index
 */
GalleryController.prototype.goTo = function (index) {
  this.currentIndex = index;

  // Move the track
  const track = this.galleryEl.querySelector('#gallery-track');
  if (track) {
    track.style.transform = 'translateX(calc(-100% * ' + index + '))';
  }

  // Update dots
  const dots = this.galleryEl.querySelectorAll('.gallery__dot');
  dots.forEach(function (dot, i) {
    const isActive = i === index;
    dot.classList.toggle('is-active', isActive);
    if (isActive) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
};

/**
 * Advance to the next slide, wrapping from the last back to the first.
 * (Requirement 5.3)
 */
GalleryController.prototype.next = function () {
  this.goTo((this.currentIndex + 1) % 4);
};

/**
 * Go back to the previous slide, wrapping from the first to the last.
 * (Requirement 5.4)
 */
GalleryController.prototype.prev = function () {
  this.goTo((this.currentIndex + 3) % 4);
};

/**
 * Swap all four slide images to the given colorId's images from PRODUCT_DATA,
 * then reset to index 0.
 * (Requirement 6.3)
 * @param {string} colorId
 */
GalleryController.prototype.loadColor = function (colorId) {
  const color = PRODUCT_DATA.colors.find(function (c) { return c.id === colorId; });
  if (!color) return;

  const slides = this.galleryEl.querySelectorAll('.gallery__slide img');
  slides.forEach(function (img, i) {
    if (color.images[i]) {
      img.src = color.images[i].src;
      img.alt = color.images[i].alt;
    }
  });

  this.goTo(0);
};

/* -----------------------------------------------------------------------------
   INIT
   Bootstraps all event listeners and performs the initial render.
   Called from DOMContentLoaded.
   (Requirements 6.3, 7.1, 21.1–21.4, 22.6)
----------------------------------------------------------------------------- */

function init() {
  // --- Gallery setup (Task 3.3) ---
  const galleryEl = document.querySelector('.product__gallery');
  const gallery = new GalleryController(galleryEl);

  // Prev / Next buttons
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { gallery.prev(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { gallery.next(); });

  // Dot buttons
  const dots = document.querySelectorAll('.gallery__dot');
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { gallery.goTo(i); });
  });

  // --- Color swatch change handler (Task 4.2) ---
  const colorFieldset = document.getElementById('color-fieldset');
  if (colorFieldset) {
    colorFieldset.addEventListener('change', function (e) {
      const input = e.target;
      if (input.type !== 'radio') return;
      const colorId = input.value;
      const color = PRODUCT_DATA.colors.find(function (c) { return c.id === colorId; });
      if (!color) return;

      // Update color label (Requirement 6.3)
      const colorNameEl = document.getElementById('color-name');
      if (colorNameEl) colorNameEl.textContent = '(' + color.name + ')';

      // Update gallery (Requirement 6.3)
      gallery.loadColor(colorId);

      // Cart contents must remain unchanged (Requirement 6.5) — no cart mutation here
    });
  }

  // --- Add to Cart button (Task 5.2) ---
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      // Determine currently selected color
      const checkedInput = document.querySelector('#color-fieldset input[type="radio"]:checked');
      if (!checkedInput) return;
      CartStore.addItem(checkedInput.value);
    });
  }

  // --- Cart icon opens drawer (Task 6.3) ---
  const cartIconBtn = document.getElementById('cart-icon-btn');
  if (cartIconBtn) {
    cartIconBtn.addEventListener('click', function () {
      CartStore.openDrawer();
    });
  }

  // --- Cart close button (Task 6.3) ---
  const cartCloseBtn = document.getElementById('cart-close-btn');
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', function () {
      CartStore.closeDrawer(document.getElementById('cart-icon-btn'));
    });
  }

  // --- Overlay click closes drawer (Task 6.3) ---
  const overlayEl = document.querySelector('.overlay');
  if (overlayEl) {
    overlayEl.addEventListener('click', function () {
      CartStore.closeDrawer(document.getElementById('cart-icon-btn'));
    });
  }

  // --- Escape key closes drawer (Requirements 10.3, 21.3) ---
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && CartStore.isOpen) {
      CartStore.closeDrawer(CartStore.lastFocusedEl);
    }
  });

  // --- Event delegation on cart drawer for Remove + placeholder links (Task 6.2) ---
  const drawerEl = document.getElementById('cart-drawer');
  if (drawerEl) {
    drawerEl.addEventListener('click', function (e) {
      // Remove button
      const removeBtn = e.target.closest('[data-action="remove"]');
      if (removeBtn) {
        CartStore.removeItem(removeBtn.dataset.colorId);
        return;
      }
      // Placeholder links inside drawer
      const placeholder = e.target.closest('.js-placeholder');
      if (placeholder) {
        e.preventDefault();
      }
    });

    // --- Focus trap inside cart drawer (Task 7.1, Requirement 21.2) ---
    drawerEl.addEventListener('keydown', function (e) {
      if (!CartStore.isOpen) return;
      const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = [...drawerEl.querySelectorAll(focusableSelectors)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // --- Prevent default on all static placeholder links ---
  document.querySelectorAll('a.js-placeholder').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  // --- Initial render (Task 6.2) ---
  CartStore.render();
}

/* -----------------------------------------------------------------------------
   BOOTSTRAP
   Wrap init() so that a runtime error during initialisation never causes a
   blank page — the static HTML always remains visible. (Requirement 22.6)
----------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  try {
    init();
  } catch (err) {
    console.error('[MW75 PDP] Init error:', err);
  }
});
