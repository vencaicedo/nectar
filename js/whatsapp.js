/**
 * NECTAR PARFUMS — WHATSAPP INTEGRATION
 * Formats structured quote orders and opens WhatsApp conversation
 */

const WhatsAppService = (function() {
  const DEFAULT_NUMBER = '573014972011';

  function formatCOP(amount) {
    return new Intl.NumberFormat('es-CO').format(amount) + ' COP';
  }

  function sendQuote(customerData, items, totalCOP, targetNumber = DEFAULT_NUMBER) {
    if (!items || items.length === 0) {
      alert('Tu carrito de cotización está vacío.');
      return;
    }

    let message = `✨ *COTIZACIÓN DE PERFUMES — NECTAR PARFUMS* ✨\n\n`;
    message += `Hola, quiero confirmar la disponibilidad de las siguientes botellas originales:\n\n`;

    items.forEach((item, idx) => {
      const subtotal = item.price * item.quantity;
      message += `▫️ *${idx + 1}. ${item.name}* (${item.brand})\n`;
      message += `   • Presentación: ${item.bottleSize || 'Botella Sellada'}\n`;
      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Subtotal: $ ${formatCOP(subtotal)}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL ESTIMADO:* $ ${formatCOP(totalCOP)}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (customerData.name) {
      message += `👤 *Cliente:* ${customerData.name}\n`;
    }
    if (customerData.city) {
      message += `📍 *Ciudad de Envío:* ${customerData.city}\n`;
    }
    if (customerData.address) {
      message += `🏠 *Dirección:* ${customerData.address}\n`;
    }
    if (customerData.notes) {
      message += `📝 *Nota adicional:* ${customerData.notes}\n`;
    }

    message += `\n¿Me confirmas disponibilidad para despacho y medios de pago? ¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    window.open(url, '_blank');
  }

  function sendProductInquiry(product, targetNumber = DEFAULT_NUMBER) {
    let message = `✨ *CONSULTA — NECTAR PARFUMS* ✨\n\n`;
    message += `Hola! Me interesa la botella original de *${product.name}* (${product.brand}) de *${product.bottleSize || '100 ml'}* por *$ ${formatCOP(product.price)}*.\n\n`;
    message += `¿Tienen unidades disponibles para envío inmediato?`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    window.open(url, '_blank');
  }

  return {
    sendQuote,
    sendProductInquiry
  };
})();
