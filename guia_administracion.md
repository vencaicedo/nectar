# 🌿 Manual de Administración Sencilla — Nectar Parfums

Este manual está diseñado para que puedas **administrar tu tienda tú mismo**, de forma rápida y sin saber programación.

---

## ⚡ 1. ¿Por qué ahora funciona al 100% en tu computadora y en internet?

Creamos el archivo `data/catalog.js` (y `data/catalog.json`). 
- Cuando abres `index.html` con doble clic en tu computadora, el catálogo y el buscador cargan **de inmediato** sin problemas de bloqueos de seguridad del navegador.
- Y cuando lo subas a **GitHub Pages**, funcionará igual de rápido.

---

## 🛍️ 2. Cómo Agregar, Modificar o Quitar Perfumes

El archivo donde está todo es:
👉 [`data/catalog.js`](file:///c:/Users/vensi/OneDrive/Escritorio/Antigravity/Monitor%20BTC/nectar/data/catalog.js) (y también [`data/catalog.json`](file:///c:/Users/vensi/OneDrive/Escritorio/Antigravity/Monitor%20BTC/nectar/data/catalog.json))

Puedes abrirlo con cualquier editor (Bloc de notas, VS Code o directamente en la web de GitHub con el botón ✏️).

---

### 📝 Estructura de cada Perfume (Ejemplo Simple)

Dentro de la lista `"products"`, cada perfume se ve así:

```javascript
{
  "id": "nec-001",                           // Identificador único (ej: nec-001, nec-002...)
  "name": "Khamrah Qahwa",                   // Nombre del perfume
  "brand": "Lattafa",                        // Marca (Lattafa, Armaf, Afnan, Rasasi, etc.)
  "gender": "unisex",                        // Opciones: "unisex", "hombre", "mujer"
  "bottleSize": "Botella Sellada 100 ml",    // Presentación
  "concentration": "Eau de Parfum",          // Concentración (Eau de Parfum, Extrait, etc.)
  "description": "Café árabe tostado, praliné dulce, canela y licor de vainilla.",
  "notes": "Café Tostado, Praliné, Canela, Vainilla", // Notas olfativas
  "price": 265000,                           // 💰 Precio en COP (sin puntos ni signos)
  "originalPrice": 300000,                   // Precio anterior tachado (pon 0 si no hay descuento)
  "stock": 4,                                // 📦 Unidades disponibles
  "isFeatured": true,                        // true para que aparezca primero, false si no
  "isNew": true,                             // true para mostrar badge de "Novedad"
  "isBestseller": true,                      // true para mostrar en "Más Vendidos"
  "promoBadge": "12% OFF",                   // Texto del badge (ej: "15% OFF", "MÁS VENDIDO", etc.)
  "image": "https://enlace-a-tu-foto.jpg"     // Link directo a la foto de internet
}
```

---

## 💡 Ejemplos Prácticos de lo que vas a querer hacer:

### 1. ¿Cómo cambiar un precio?
Buscas el perfume en `data/catalog.js` y cambias el número:
```javascript
"price": 250000,
```
*(No le pongas puntos ni el signo $, solo el número).*

---

### 2. ¿Cómo poner un perfume en Promoción con precio tachado?
```javascript
"price": 220000,           // Precio con descuento
"originalPrice": 250000,   // Precio original que saldrá tachado
"promoBadge": "15% OFF",   // Cartelito que saldrá en la tarjeta
```

---

### 3. ¿Cómo activar la urgencia de stock ("¡Solo quedan 2 unidades!")?
El sistema lo hace solo según el número de `"stock"`:
- Si pones `"stock": 2`, saldrá en rojo pulsante: **`¡Solo quedan 2 unidades!`** y un badge de `Últimas uds.`.
- Si pones `"stock": 5`, saldrá: **`Pocas unidades disponibles (5)`**.
- Si pones `"stock": 10`, saldrá: **`✓ Disponible en stock`**.
- Si pones `"stock": 0`, saldrá: **`Agotado temporalmente`**.

---

### 4. ¿Cómo agregar un perfume nuevo?
Simplemente copia uno existente, pégalo al final de la lista de `products`, cambia el `"id"` (ej: `"nec-025"`), y pon los datos y la foto del nuevo perfume.

---

### 5. ¿Cómo poner tus fotos de internet?
1. Buscas la foto del perfume en Google Imágenes o en la tienda del fabricante.
2. Haces clic derecho en la imagen y eliges **"Copiar dirección de la imagen"**.
3. La pegas en el campo `"image"`:
```javascript
"image": "https://m.media-amazon.com/images/I/71xyz...jpg"
```

---

## 🚀 3. Cómo Publicar Gratis en GitHub Pages

1. Entra a [github.com](https://github.com) con tu cuenta.
2. Crea un repositorio público llamado `nectar` (o como prefieras).
3. Sube los archivos de la carpeta `nectar/` (`index.html`, `data/`, `css/`, `js/`, `assets/`).
4. Entra a **Settings -> Pages**.
5. En **Branch**, selecciona `main` y la carpeta `/ (root)` y haz clic en **Save**.
6. En 1 minuto tu tienda estará en vivo con dirección:
   `https://tu-usuario.github.io/nectar/`

---

## 💬 4. ¿Cómo cambiar tu número de WhatsApp?
En la parte superior de `data/catalog.js` tienes:
```javascript
"store": {
  "whatsappNumber": "573014972011",   // Código país (57) + tu número
  "whatsappDisplay": "+57 301 4972011"
}
```
Cualquier cambio aquí se refleja automáticamente en toda la web.
