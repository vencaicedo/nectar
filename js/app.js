/**
 * NECTAR PARFUMS — MAIN APPLICATION CONTROLLER
 * Loads catalog data reliably (works offline & online), filters, modals & cart interaction
 */

document.addEventListener('DOMContentLoaded', async () => {
  // App State
  const state = {
    catalog: null,
    products: [],
    filteredProducts: [],
    selectedSection: 'all',
    selectedGender: 'all',
    searchQuery: '',
    sortBy: 'featured',
    modalProduct: null
  };

  // DOM Elements
  const productsGrid = document.getElementById('productsGrid');
  const productsCountEl = document.getElementById('productsCount');
  const searchInput = document.getElementById('searchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const sectionsBar = document.getElementById('sectionsBar');
  const genderFilters = document.getElementById('genderFilters');
  const sortSelect = document.getElementById('sortSelect');
  
  // Modal Elements
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContentContainer = document.getElementById('modalContentContainer');
  
  // Cart Drawer Elements
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartClearBtn = document.getElementById('cartClearBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalValue = document.getElementById('cartSubtotalValue');
  const cartTotalValue = document.getElementById('cartTotalValue');
  const btnDownloadPdf = document.getElementById('btnDownloadPdf');
  const btnPdfText = document.getElementById('btnPdfText');
  const btnSendWhatsApp = document.getElementById('btnSendWhatsApp');
  const customerNameInput = document.getElementById('customerName');
  const customerCityInput = document.getElementById('customerCity');
  const customerAddressInput = document.getElementById('customerAddress');
  const customerNotesInput = document.getElementById('customerNotes');

  // Initialize Cart
  Cart.init();

  // Load Catalog Data (Fallback Strategy for 100% reliability offline/file:// & online)
  if (window.NECTAR_CATALOG) {
    state.catalog = window.NECTAR_CATALOG;
    state.products = state.catalog.products || [];
    initApp();
  } else {
    try {
      const res = await fetch('data/catalog.json');
      if (!res.ok) throw new Error('Fetch failed');
      state.catalog = await res.json();
      state.products = state.catalog.products || [];
      initApp();
    } catch (error) {
      console.warn('Could not fetch catalog.json, trying fallback...', error);
      if (productsGrid) {
        productsGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h3>Error al cargar el catálogo de fragancias</h3>
            <p>Por favor asegúrate de incluir <code>data/catalog.js</code> o estar conectado.</p>
          </div>
        `;
      }
    }
  }

  function initApp() {
    renderSections();
    applyFilters();
  }

  // --- RENDER SECTION TABS ---
  function renderSections() {
    if (!sectionsBar || !state.catalog?.sections) return;
    sectionsBar.innerHTML = state.catalog.sections.map(sec => `
      <button class="section-chip ${sec.id === state.selectedSection ? 'active' : ''}" data-section="${sec.id}">
        <span>${sec.icon || '✨'}</span>
        <span>${sec.name}</span>
      </button>
    `).join('');

    sectionsBar.querySelectorAll('.section-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        sectionsBar.querySelectorAll('.section-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedSection = btn.dataset.section;
        applyFilters();
      });
    });
  }

  // --- FILTERS & SORTING ---
  function applyFilters() {
    let result = [...state.products];

    // Section filter
    if (state.selectedSection === 'bestsellers') {
      result = result.filter(p => p.isBestseller);
    } else if (state.selectedSection === 'new') {
      result = result.filter(p => p.isNew);
    } else if (state.selectedSection === 'deals') {
      result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Gender filter
    if (state.selectedGender !== 'all') {
      result = result.filter(p => p.gender === state.selectedGender || p.gender === 'unisex');
    }

    // Search query filter
    const query = (state.searchQuery || '').toLowerCase().trim();
    if (query) {
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.notes && p.notes.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (state.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // Default: featured first, then bestsellers
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    state.filteredProducts = result;
    renderProducts();
  }

  // --- RENDER PRODUCTS GRID ---
  function renderProducts() {
    if (!productsGrid) return;

    if (productsCountEl) {
      productsCountEl.textContent = `${state.filteredProducts.length} perfumes disponibles`;
    }

    if (state.filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 8px;">No encontramos coincidencias</h3>
          <p style="color: var(--brown-600); margin-bottom: 16px;">Prueba buscando por marca (ej: Lattafa, Armaf, Afnan) o limpia los filtros.</p>
          <button class="btn-outline" id="btnResetFilters" style="padding: 8px 18px; font-size: 0.88rem;">Limpiar Filtros</button>
        </div>
      `;
      const btnReset = document.getElementById('btnResetFilters');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          state.selectedSection = 'all';
          state.selectedGender = 'all';
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (mobileSearchInput) mobileSearchInput.value = '';
          renderSections();
          if (genderFilters) {
            genderFilters.querySelectorAll('.gender-btn').forEach(b => b.classList.toggle('active', b.dataset.gender === 'all'));
          }
          applyFilters();
        });
      }
      return;
    }

    productsGrid.innerHTML = state.filteredProducts.map(product => {
      // Stock Marketing Logic
      let stockHtml = '';
      if (!product.stock || product.stock === 0) {
        stockHtml = `<div class="card-stock-indicator soldout"><span class="stock-dot"></span>Agotado temporalmente</div>`;
      } else if (product.stock <= 3) {
        stockHtml = `<div class="card-stock-indicator urgent"><span class="stock-dot pulse"></span>¡Solo quedan ${product.stock} unidades!</div>`;
      } else if (product.stock <= 7) {
        stockHtml = `<div class="card-stock-indicator available"><span class="stock-dot"></span>Pocas unidades disponibles (${product.stock})</div>`;
      } else {
        stockHtml = `<div class="card-stock-indicator available"><span class="stock-dot"></span>✓ Disponible en stock</div>`;
      }

      // Badges
      let badgeHtml = '';
      if (product.promoBadge) {
        badgeHtml += `<span class="badge-tag promo">${product.promoBadge}</span>`;
      }
      if (product.stock && product.stock <= 2) {
        badgeHtml += `<span class="badge-tag urgent">Últimas uds.</span>`;
      } else if (product.isNew) {
        badgeHtml += `<span class="badge-tag new">Novedad</span>`;
      }

      return `
        <div class="product-card" data-product-id="${product.id}">
          <div class="card-badges">${badgeHtml}</div>

          <div class="card-image-wrap" data-action="open-modal">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <button class="quick-view-overlay-btn" data-action="open-modal">Ver Detalles & Notas ✦</button>
          </div>

          <div class="card-header-meta">
            <span class="card-brand">${product.brand}</span>
            <span class="card-gender-chip">${product.gender === 'unisex' ? 'Unisex' : product.gender === 'hombre' ? 'Para Él' : 'Para Ella'}</span>
          </div>

          <h3 class="card-title" data-action="open-modal">${product.name}</h3>
          
          <div class="card-bottle-size">
            📦 ${product.bottleSize || 'Botella Sellada 100 ml'}
          </div>

          <div class="card-notes-preview">
            <strong>Notas:</strong> ${product.notes || product.description}
          </div>

          ${stockHtml}

          <div class="card-footer">
            <div class="price-container">
              <span class="current-price">$ ${new Intl.NumberFormat('es-CO').format(product.price)}</span>
              ${product.originalPrice ? `<span class="original-price">$ ${new Intl.NumberFormat('es-CO').format(product.originalPrice)}</span>` : ''}
            </div>
            <button class="btn-add-card" data-product-id="${product.id}" data-action="add-to-cart">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
              <span>Cotizar</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    attachCardEvents();
  }

  // --- CARD INTERACTION LISTENERS ---
  function attachCardEvents() {
    // Add to cart buttons
    document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.dataset.productId;
        const product = state.products.find(p => p.id === pId);
        if (!product) return;

        const res = Cart.addItem(product, 1);

        if (res.success) {
          showToast(res.message);
          btn.classList.add('added');
          btn.innerHTML = `<span>✓ Agregado</span>`;
          setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = `
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
              <span>Cotizar</span>
            `;
          }, 1400);
        } else {
          showToast(res.message, true);
        }
      });
    });

    // Open Modal Details
    document.querySelectorAll('[data-action="open-modal"]').forEach(el => {
      el.addEventListener('click', () => {
        const card = el.closest('.product-card');
        if (!card) return;
        const pId = card.dataset.productId;
        const product = state.products.find(p => p.id === pId);
        if (product) openProductModal(product);
      });
    });
  }

  // --- MODAL: PRODUCT DETAIL ---
  function openProductModal(product) {
    state.modalProduct = product;
    renderModalContent();
    if (productModal) productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (productModal) productModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderModalContent() {
    if (!modalContentContainer || !state.modalProduct) return;
    const product = state.modalProduct;

    modalContentContainer.innerHTML = `
      <div class="modal-product-layout">
        <div class="modal-image-col">
          <img src="${product.image}" alt="${product.name}" />
        </div>

        <div class="modal-info-col">
          <div>
            <div class="modal-brand-tag">${product.brand} • ${product.concentration || 'Eau de Parfum'}</div>
            <h2 class="modal-title">${product.name}</h2>
            <div class="modal-concentration">📦 ${product.bottleSize || 'Botella Sellada 100 ml'} • ${product.gender === 'unisex' ? 'Unisex' : product.gender === 'hombre' ? 'Para Hombre' : 'Para Mujer'}</div>
          </div>

          <p class="modal-description">${product.description}</p>

          <!-- Notes Card -->
          <div class="notes-highlight-box">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--amber-600); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Acordes & Notas Olfativas:</span>
            <span style="font-size: 0.92rem; color: var(--brown-900); font-weight: 500;">${product.notes || 'Especias orientales, maderas nobles y vainilla.'}</span>
          </div>

          <!-- Price & CTA -->
          <div style="margin-top: 8px; padding-top: 14px; border-top: 1px solid var(--sand-border);">
            <div style="font-family: var(--font-mono); font-size: 1.7rem; font-weight: 800; color: var(--brown-900); margin-bottom: 12px;">
              $ ${new Intl.NumberFormat('es-CO').format(product.price)} COP
            </div>

            <div class="modal-actions-row">
              <button class="btn-primary" id="btnModalAddToCart" style="flex: 1;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
                <span>Añadir a Cotización</span>
              </button>
              
              <button class="btn-outline" id="btnModalAskWA" style="border-color: #25D366; color: #1E8E44;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.18-1.31C8.61 21.49 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                <span>Consultar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add to cart from modal
    const btnAdd = document.getElementById('btnModalAddToCart');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        const res = Cart.addItem(product, 1);
        showToast(res.message, !res.success);
        if (res.success) {
          closeProductModal();
          openCartDrawer();
        }
      });
    }

    // Direct WhatsApp inquiry
    const btnWA = document.getElementById('btnModalAskWA');
    if (btnWA) {
      btnWA.addEventListener('click', () => {
        const targetWA = state.catalog?.store?.whatsappNumber || '573014972011';
        WhatsAppService.sendProductInquiry(product, targetWA);
      });
    }
  }

  // --- CART DRAWER CONTROLS ---
  function openCartDrawer() {
    renderCartDrawerItems();
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderCartDrawerItems() {
    if (!cartItemsList || !cartTotalValue) return;

    const items = Cart.getItems();
    const total = Cart.getTotal();

    if (cartSubtotalValue) {
      cartSubtotalValue.textContent = `$ ${new Intl.NumberFormat('es-CO').format(total)} COP`;
    }
    cartTotalValue.textContent = `$ ${new Intl.NumberFormat('es-CO').format(total)} COP`;

    if (cartClearBtn) {
      cartClearBtn.style.display = items.length > 0 ? 'block' : 'none';
    }

    if (items.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 48px 16px;">
          <div style="font-size: 2.8rem; margin-bottom: 10px;">🛍️</div>
          <h4 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 6px;">Tu cotización está vacía</h4>
          <p style="font-size: 0.88rem; color: var(--brown-600);">Explora el catálogo y agrega tus perfumes favoritos para generar tu cotización o pedir por WhatsApp.</p>
        </div>
      `;
      if (btnDownloadPdf) btnDownloadPdf.disabled = true;
      if (btnSendWhatsApp) btnSendWhatsApp.disabled = true;
      return;
    }

    if (btnDownloadPdf) btnDownloadPdf.disabled = false;
    if (btnSendWhatsApp) btnSendWhatsApp.disabled = false;

    cartItemsList.innerHTML = items.map(item => `
      <div class="cart-item-card" data-key="${item.key}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta">${item.brand} • ${item.bottleSize || 'Botella Sellada'}</span>
          <span class="cart-item-price">$ ${new Intl.NumberFormat('es-CO').format(item.price * item.quantity)}</span>
          <div class="cart-qty-control">
            <button class="qty-btn" data-action="decrease-qty" data-key="${item.key}">−</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" data-action="increase-qty" data-key="${item.key}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove-item" data-key="${item.key}" title="Eliminar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `).join('');

    // Attach cart item quantity events
    cartItemsList.querySelectorAll('[data-action="decrease-qty"]').forEach(btn => {
      btn.addEventListener('click', () => {
        Cart.updateQuantity(btn.dataset.key, -1);
        renderCartDrawerItems();
      });
    });

    cartItemsList.querySelectorAll('[data-action="increase-qty"]').forEach(btn => {
      btn.addEventListener('click', () => {
        Cart.updateQuantity(btn.dataset.key, 1);
        renderCartDrawerItems();
      });
    });

    cartItemsList.querySelectorAll('[data-action="remove-item"]').forEach(btn => {
      btn.addEventListener('click', () => {
        Cart.removeItem(btn.dataset.key);
        renderCartDrawerItems();
      });
    });
  }

  // Clear cart button
  if (cartClearBtn) {
    cartClearBtn.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar todos los perfumes de tu cotización?')) {
        Cart.clearCart();
        renderCartDrawerItems();
        showToast('Cotización vaciada');
      }
    });
  }

  // --- SEARCH INPUT LISTENERS ---
  function handleSearch(val) {
    state.searchQuery = val;
    applyFilters();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }

  // Gender filters
  if (genderFilters) {
    genderFilters.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        genderFilters.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedGender = btn.dataset.gender;
        applyFilters();
      });
    });
  }

  // Sort selector
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Cart open/close triggers
  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) closeCartDrawer();
    });
  }

  // Modal close triggers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCartDrawer();
    }
  });

  // Sync with Cart updates
  document.addEventListener('nectar:cart-updated', () => {
    if (cartDrawerBackdrop && cartDrawerBackdrop.classList.contains('active')) {
      renderCartDrawerItems();
    }
  });

  // --- ACTIONS: PDF & WHATSAPP EXPORT ---
  function getCustomerFormData() {
    return {
      name: customerNameInput ? customerNameInput.value.trim() : '',
      city: customerCityInput ? customerCityInput.value.trim() : '',
      address: customerAddressInput ? customerAddressInput.value.trim() : '',
      notes: customerNotesInput ? customerNotesInput.value.trim() : ''
    };
  }

  // Download PDF Quotation with feedback
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      const items = Cart.getItems();
      if (items.length === 0) return;
      
      const originalHtml = btnPdfText ? btnPdfText.textContent : 'Descargar PDF';
      if (btnPdfText) btnPdfText.textContent = 'Generando PDF...';
      btnDownloadPdf.disabled = true;

      setTimeout(() => {
        const customer = getCustomerFormData();
        const total = Cart.getTotal();
        const filename = PDFGenerator.generateQuotePDF(customer, items, total, state.catalog?.store);
        
        if (btnPdfText) btnPdfText.textContent = '✓ Descargado';
        showToast(`📄 Cotización descargada: ${filename}`);

        setTimeout(() => {
          if (btnPdfText) btnPdfText.textContent = originalHtml;
          btnDownloadPdf.disabled = false;
        }, 1500);
      }, 300);
    });
  }

  // Send order/quote via WhatsApp
  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener('click', () => {
      const items = Cart.getItems();
      if (items.length === 0) return;
      const customer = getCustomerFormData();
      const total = Cart.getTotal();
      const targetWA = state.catalog?.store?.whatsappNumber || '573014972011';
      WhatsAppService.sendQuote(customer, items, total, targetWA);
    });
  }

  // Toast Notification Helper
  function showToast(message, isError = false) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    if (isError) toast.style.borderColor = '#C0392B';
    toast.innerHTML = `
      <span>${isError ? '⚠️' : '✨'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
