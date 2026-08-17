/**
 * NECTAR PARFUMS — CART CONTROLLER
 * Handles reactive cart management, localStorage persistence & stock checks
 */

const Cart = (function() {
  const STORAGE_KEY = 'nectar_cart_v2';
  let cartItems = [];

  function init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      cartItems = saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
      cartItems = [];
    }
    updateBadge();
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
    updateBadge();
    document.dispatchEvent(new CustomEvent('nectar:cart-updated', { detail: { items: cartItems, total: getTotal() } }));
  }

  function getItems() {
    return [...cartItems];
  }

  function addItem(product, quantity = 1) {
    const key = product.id;
    const existingIndex = cartItems.findIndex(item => item.key === key);

    if (existingIndex > -1) {
      const newQty = cartItems[existingIndex].quantity + quantity;
      if (product.stock && newQty > product.stock) {
        return { success: false, message: `Solo hay ${product.stock} unidades disponibles en stock.` };
      }
      cartItems[existingIndex].quantity = newQty;
    } else {
      if (product.stock && quantity > product.stock) {
        return { success: false, message: `Solo hay ${product.stock} unidades disponibles en stock.` };
      }
      cartItems.push({
        key,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        bottleSize: product.bottleSize || 'Botella Sellada 100 ml',
        price: product.price,
        image: product.image,
        quantity: quantity,
        maxStock: product.stock || 99
      });
    }

    save();
    return { success: true, message: `¡${product.name} agregado a tu cotización!` };
  }

  function updateQuantity(key, delta) {
    const item = cartItems.find(i => i.key === key);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeItem(key);
      return;
    }

    if (item.maxStock && newQty > item.maxStock) {
      alert(`Lo sentimos, solo disponemos de ${item.maxStock} unidades en stock.`);
      return;
    }

    item.quantity = newQty;
    save();
  }

  function removeItem(key) {
    cartItems = cartItems.filter(i => i.key !== key);
    save();
  }

  function clearCart() {
    cartItems = [];
    save();
  }

  function getCount() {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  function getTotal() {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    
    badge.classList.remove('bump');
    void badge.offsetWidth;
    if (count > 0) badge.classList.add('bump');
  }

  function formatCOP(amount) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount) + ' COP';
  }

  return {
    init,
    getItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCount,
    getTotal,
    formatCOP
  };
})();
