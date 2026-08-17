/**
 * NECTAR PARFUMS — PDF QUOTE GENERATOR (ULTRA STABLE & POLISHED)
 * Designed for perfect contrast, clean text rendering and exact column widths
 */

const PDFGenerator = (function() {
  function sanitizeText(str) {
    if (!str) return '';
    // Clean string to avoid any PDF encoding glitch
    return str
      .replace(/[^\x00-\x7F\u00C0-\u00FF]/g, '') // Keep standard Latin-1 / accents
      .trim();
  }

  function generateQuotePDF(customerData, items, totalCOP, storeInfo) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('La libreria para generar el PDF se esta cargando. Por favor intenta en un segundo.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Color Palette
    const cAmber = [195, 115, 30];       // #C3731E
    const cAmberDark = [160, 90, 20];
    const cBrownDark = [35, 23, 12];      // #23170C
    const cCardBg = [255, 255, 255];     // Pure white for cards
    const cBorder = [225, 215, 200];     // Soft sand border
    const cTextDark = [35, 23, 12];      // Main text
    const cTextMuted = [100, 90, 80];    // Secondary text

    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + (storeInfo?.quoteValidityDays || 3));

    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const formatD = (d) => `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
    const quoteNumber = 'NEC-' + today.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    // --- TOP HEADER (Deep Brown + Amber line) ---
    doc.setFillColor(cBrownDark[0], cBrownDark[1], cBrownDark[2]);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setFillColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.rect(0, 36, 210, 2, 'F');

    // Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('NECTAR PARFUMS', 15, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(235, 175, 105);
    doc.text('PERFUMERIA ARABE 100% ORIGINAL SELLADA', 15, 26);

    // Document Title & Folio (Right Aligned)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('COTIZACION FORMAL', 195, 16, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(220, 215, 205);
    doc.text(`No. ${quoteNumber}`, 195, 24, { align: 'right' });

    // --- TWO INFO BOXES (Customer on Left, Conditions on Right) ---
    const boxY = 44;
    const boxH = 34;
    const boxW = 87;

    // 1. Customer Box (Left)
    doc.setFillColor(cCardBg[0], cCardBg[1], cCardBg[2]);
    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(15, boxY, boxW, boxH, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.text('DATOS DEL CLIENTE', 19, boxY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
    const custName = customerData.name && customerData.name.trim() ? sanitizeText(customerData.name) : 'Cliente / Solicitante';
    doc.text(custName, 19, boxY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(cTextMuted[0], cTextMuted[1], cTextMuted[2]);
    const custCity = customerData.city ? `Ciudad: ${sanitizeText(customerData.city)}` : 'Ciudad: Envio a acordar';
    doc.text(custCity, 19, boxY + 21);

    const custAddr = customerData.address ? `Direccion: ${sanitizeText(customerData.address)}` : 'Despacho asegurado a nivel nacional';
    doc.text(custAddr, 19, boxY + 27);

    // 2. Conditions Box (Right) - Explicit clean background
    doc.setFillColor(cCardBg[0], cCardBg[1], cCardBg[2]);
    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(108, boxY, boxW, boxH, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.text('DETALLES DE COTIZACION', 112, boxY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
    doc.text(`Fecha de Emision: ${formatD(today)}`, 112, boxY + 14);
    doc.text(`Valida hasta: ${formatD(expiryDate)} (3 dias)`, 112, boxY + 20);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(cAmberDark[0], cAmberDark[1], cAmberDark[2]);
    doc.text('WhatsApp: +57 301 4972011', 112, boxY + 27);

    // --- PRODUCTS TABLE ---
    const tableStartY = boxY + boxH + 6;

    const tableBody = items.map((item, idx) => [
      (idx + 1).toString(),
      `${sanitizeText(item.name)}\nMarca: ${sanitizeText(item.brand)}`,
      item.bottleSize ? sanitizeText(item.bottleSize).replace('Botella Sellada ', '') : '100 ml',
      item.quantity.toString(),
      new Intl.NumberFormat('es-CO').format(item.price) + ' COP',
      new Intl.NumberFormat('es-CO').format(item.price * item.quantity) + ' COP'
    ]);

    doc.autoTable({
      startY: tableStartY,
      margin: { left: 15, right: 15 },
      head: [['#', 'Perfume & Referencia', 'Presentacion', 'Cant.', 'Precio Unitario', 'Subtotal']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [35, 23, 12],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        cellPadding: 3.5
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 68, fontStyle: 'bold', textColor: [35, 23, 12] },
        2: { cellWidth: 32, halign: 'center', textColor: [80, 70, 60] },
        3: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 27, halign: 'right' },
        5: { cellWidth: 27, halign: 'right', fontStyle: 'bold', textColor: [180, 100, 25] }
      },
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 3.5,
        textColor: [35, 23, 12],
        lineColor: [225, 215, 200],
        lineWidth: 0.3
      },
      alternateRowStyles: {
        fillColor: [250, 247, 242]
      }
    });

    const finalY = doc.lastAutoTable.finalY + 6;

    // --- TOTAL BOX (Aligned neatly to the right) ---
    const formattedTotal = new Intl.NumberFormat('es-CO').format(totalCOP) + ' COP';

    doc.setFillColor(cBrownDark[0], cBrownDark[1], cBrownDark[2]);
    doc.setDrawColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.setLineWidth(0.6);
    doc.roundedRect(120, finalY, 75, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(235, 175, 105);
    doc.text('TOTAL COTIZADO:', 124, finalY + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(255, 255, 255);
    doc.text(formattedTotal, 191, finalY + 13, { align: 'right' });

    // --- WHATSAPP ORDER CALLOUT (Left aligned at same level) ---
    doc.setFillColor(245, 252, 247);
    doc.setDrawColor(37, 211, 102);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, finalY, 100, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(25, 125, 55);
    doc.text('CONFIRMAR PEDIDO POR WHATSAPP', 19, finalY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
    doc.text('Envia este PDF o escribe al numero: +57 301 4972011', 19, finalY + 12.5);

    // --- TERMS & GUARANTEE SECTION ---
    const termsY = finalY + 25;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.text('TERMINOS Y GARANTIA DE LA COTIZACION:', 15, termsY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cTextMuted[0], cTextMuted[1], cTextMuted[2]);
    const terms = [
      '1. Esta cotizacion tiene una vigencia de 3 dias habiles a partir de su fecha de emision.',
      '2. La disponibilidad final se confirma al enviar este comprobante a nuestro WhatsApp (+57 301 4972011).',
      '3. Garantia de originalidad 100% en todas nuestras botellas en empaque sellado de fabrica.',
      '4. Envios nacionales asegurados a todas las ciudades de Colombia.'
    ];

    terms.forEach((t, i) => {
      doc.text(t, 15, termsY + 5 + (i * 4));
    });

    // --- FOOTER LINE & BRAND WATERMARK ---
    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.setLineWidth(0.4);
    doc.line(15, 280, 195, 280);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.text('Nectar Parfums - Experiencias Olfativas Memorables | Colombia', 105, 285, { align: 'center' });

    // Download PDF
    const filename = `Cotizacion_Nectar_${quoteNumber}.pdf`;
    doc.save(filename);
    return filename;
  }

  return {
    generateQuotePDF
  };
})();
