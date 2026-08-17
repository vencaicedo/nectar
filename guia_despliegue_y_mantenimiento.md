# 🌿 Guía Maestra: Despliegue, Mantenimiento y Dominio Gratis — Nectar Parfums

¡Hola! Esta guía fue creada especialmente para ti, paso a paso y con explicaciones sencillas para que no tengas ninguna duda, aunque sea tu primera vez publicando una página web.

---

## 📑 Tabla de Contenidos
1. [Cómo alojar tu web 100% GRATIS en GitHub Pages (Paso a Paso)](#1-cómo-alojar-tu-web-100-gratis-en-github-pages)
2. [¿Cómo tener un dominio personalizado gratis y sobrio?](#2-cómo-tener-un-dominio-personalizado-gratis-y-sobrio)
3. [Cómo administrar y actualizar tu catálogo fácilmente](#3-cómo-administrar-y-actualizar-tu-catálogo-fácilmente)
4. [Preguntas Frecuentes y Solución de Problemas](#4-preguntas-frecuentes-y-solución-de-problemas)

---

## 🚀 1. Cómo alojar tu web 100% GRATIS en GitHub Pages

GitHub es la plataforma donde se alojan millones de sitios web en el mundo. Con **GitHub Pages**, tu web de perfumes estará en línea las 24 horas del día, cargará a velocidad ultrarrápida y tendrá **certificado de seguridad SSL (candado verde `https://`)** sin pagar un solo peso.

### Paso 1: Crear tu cuenta en GitHub
1. Entra a [https://github.com](https://github.com).
2. Haz clic en **"Sign up"** y crea tu cuenta gratuita (solo necesitas tu correo y una contraseña).

### Paso 2: Crear el repositorio de tu tienda
1. Una vez dentro de tu cuenta, haz clic en el botón verde **"New"** (o en el ícono **+** arriba a la derecha -> *New repository*).
2. En **Repository name**, pon el nombre de tu web. Por ejemplo: `nectar` o `nectar-parfums`.
3. Asegúrate de que esté marcado como **Public** (Público).
4. No necesitas marcar ninguna otra casilla. Haz clic en el botón verde **"Create repository"**.

### Paso 3: Subir los archivos de Nectar
1. En la pantalla que aparece, verás una opción en azul que dice: **"uploading an existing file"** (subir un archivo existente). Haz clic en ella.
2. Abre la carpeta `nectar/` en tu computadora.
3. Arrastra **todos los archivos y carpetas** que están dentro de `nectar/` hacia la ventana de GitHub:
   - 📄 `index.html`
   - 📁 `assets/` (con el logo e ícono)
   - 📁 `css/` (con style.css)
   - 📁 `data/` (con catalog.js y catalog.json)
   - 📁 `js/` (con app.js, cart.js, pdf-generator.js, whatsapp.js)
4. Espera a que se carguen todos los archivos y haz clic en el botón verde abajo que dice **"Commit changes"**.

### Paso 4: Activar GitHub Pages (Publicar en Vivo)
1. En tu repositorio, entra en la pestaña **Settings** (Configuración ⚙️) en el menú superior.
2. En la columna izquierda, busca la opción **Pages**.
3. En la sección **Build and deployment -> Branch**:
   - Cambia el desplegable de `None` a **`main`** (o `master`).
   - Deja la carpeta en `/ (root)`.
   - Haz clic en el botón **Save** (Guardar).
4. ¡Listo! Espera de 1 a 2 minutos, recarga la pestaña y verás un recuadro verde con tu enlace oficial en vivo:
   👉 **`https://tu-usuario.github.io/nectar/`**

---

## 🌐 2. ¿Cómo tener un dominio personalizado gratis y sobrio?

Esta es una pregunta muy común. Te explico las opciones reales, transparentes y profesionales:

### Opción A: El dominio gratuito de GitHub Pages (La más recomendada y sobria)
Por defecto, GitHub te da:
`https://tu-usuario.github.io/nectar/`

> 💡 **Truco para tener la URL más corta y limpia gratis:**
> Si al crear el repositorio en GitHub le pones como nombre exactamente:  
> `nectar-parfums.github.io`  
> Tu dirección web quedará directa y elegante:  
> 👉 **`https://nectar-parfums.github.io`** (sin subcarpetas, corta, profesional y con SSL seguro).

### Opción B: Subdominios gratuitos alternativos (Vercel / Netlify)
Plataformas como **Vercel** o **Netlify** (también 100% gratuitas) te permiten conectar tu repositorio de GitHub y elegir un subdominio personalizado sobrio como:
- `https://nectarparfums.vercel.app`
- `https://nectar-perfumes.netlify.app`

### Opción C: ¿Qué pasa con los dominios gratuitos como `.tk`, `.ml`, `.ga`?
Antiguamente existían servicios como *Freenom* que regalaban extensiones `.tk` o `.ml`. **No son recomendables para un negocio** porque:
- Fueron suspendidos por problemas de seguridad internacional.
- Los navegadores y antivirus los marcan como sospechosos, restando confianza a tus clientes.

### Opción D: Dominio profesional propio por solo ~$1 - $3 USD al año
Si en el futuro quieres un dominio propio como `nectarparfums.store`, `nectarparfums.shop` o `nectar.co`:
- En registradores como **Porkbun**, **Namecheap** o **Hostinger**, las extensiones comerciales como `.store` o `.shop` suelen costar menos de **$2 dólares el primer año** ($8.000 COP aprox).
- Lo puedes conectar gratis a tu GitHub Pages en **Settings -> Pages -> Custom domain**.

---

## 🛠️ 3. Cómo administrar y actualizar tu catálogo fácilmente

Toda tu tienda se actualiza modificando un solo archivo:  
👉 [`data/catalog.js`](file:///c:/Users/vensi/OneDrive/Escritorio/Antigravity/Monitor%20BTC/nectar/data/catalog.js)

### ¿Cómo editarlo directamente desde internet sin instalar nada?
1. Entra a tu repositorio en GitHub desde tu celular o computadora.
2. Entra a la carpeta **`data`** y haz clic en **`catalog.js`**.
3. Haz clic en el ícono del **lápiz (Edit this file)** ✏️ arriba a la derecha.
4. Modifica los precios, fotos o textos que quieras.
5. Haz clic en el botón verde **"Commit changes"**.
6. En 30 a 60 segundos, tus cambios estarán en vivo en tu página web automáticamente.

---

### 📝 Estructura de un Perfume (Guía de Campos):

```javascript
{
  "id": "nec-001",                           // Identificador único (nec-001, nec-002...)
  "name": "Khamrah Qahwa",                   // Nombre exacto del perfume
  "brand": "Lattafa",                        // Marca (Lattafa, Armaf, Afnan, Rasasi, etc.)
  "gender": "unisex",                        // "unisex", "hombre" o "mujer"
  "bottleSize": "Botella Sellada 100 ml",    // Presentación
  "concentration": "Eau de Parfum",          // Eau de Parfum / Extrait / etc.
  "description": "Café árabe tostado, praliné dulce, canela y licor de vainilla.",
  "notes": "Café Tostado, Praliné, Canela, Vainilla Bourbon", // Notas olfativas
  "price": 265000,                           // 💰 Precio de venta en COP (solo números)
  "originalPrice": 300000,                   // Precio anterior tachado (pon 0 si no hay oferta)
  "stock": 4,                                // 📦 Unidades disponibles
  "isFeatured": true,                        // true = aparece de primero, false = normal
  "isNew": true,                             // true = muestra badge de "Novedad"
  "isBestseller": true,                      // true = sale en la pestaña "Más Vendidos"
  "promoBadge": "12% OFF",                   // Cartelito promocional (o déjalo vacío "")
  "image": "https://enlace-a-tu-foto.jpg"     // Dirección de la foto en internet
}
```

---

### 💡 Casos Prácticos de Mantenimiento:

#### A. Cambiar el precio de un perfume:
Busca el producto y cambia el número en `price`:
```javascript
"price": 240000,
```

#### B. Activar una oferta con precio tachado:
```javascript
"price": 210000,           // Precio con descuento
"originalPrice": 250000,   // Precio normal que saldrá tachado
"promoBadge": "16% OFF",   // Cartelito en la tarjeta
```

#### C. Activar la alerta de stock ("¡Solo quedan 2 unidades!"):
- Si pones `"stock": 2`, la página mostrará automáticamente en rojo pulsante: **`🔥 ¡Solo quedan 2 unidades!`** y el badge **`Últimas uds.`**.
- Si pones `"stock": 0`, mostrará **`Agotado temporalmente`**.

#### D. Agregar un perfume nuevo:
1. Copia el bloque de cualquier perfume (desde `{` hasta `}`).
2. Pégalo al final de la lista antes del corchete `]`.
3. Asegúrate de poner una coma `,` entre cada perfume.
4. Cámbiale el `"id"` (ej: `"nec-025"`), el nombre, precio y foto.

#### E. Cambiar o agregar fotos de perfumes:
1. Busca la foto del frasco en Google Imágenes o en la tienda de la marca.
2. Haz clic derecho en la foto -> **"Copiar dirección de imagen"**.
3. Pégala en el campo `"image"`:
```javascript
"image": "https://m.media-amazon.com/images/I/71xyz...jpg"
```

#### F. Cambiar tu número de WhatsApp:
Al inicio de `data/catalog.js`:
```javascript
"store": {
  "whatsappNumber": "573014972011",   // Código país (57) + número sin espacios ni signos
  "whatsappDisplay": "+57 301 4972011"
}
```

---

## ❓ 4. Preguntas Frecuentes y Solución de Problemas

### 1. ¿Hice un cambio en GitHub pero en mi celular sigo viendo lo anterior?
Los navegadores guardan memoria caché para cargar más rápido.
- En computadora: Presiona `Ctrl + F5` (o `Cmd + Shift + R` en Mac) para forzar la recarga.
- En celular: Cierra la pestaña y vuelve a abrirla, o abre la página en una pestaña de incógnito.

### 2. ¿Cómo pruebo la web en mi computadora sin internet?
Simplemente haz doble clic en el archivo `index.html`. Como incluimos `catalog.js`, todo el catálogo, buscador y carrito funcionarán de inmediato.

### 3. ¿El cliente puede comprar directamente con tarjeta o siempre es por WhatsApp?
Tu página está diseñada con el modelo de **Cotización y Asesoría Directa**: el cliente arma su carrito, genera su cotización en PDF formal y te envía el pedido directo a WhatsApp. Así tienes el control total para acordar el pago (transferencia Bancolombia, Nequi, Daviplata, contraentrega, etc.) y coordinar el despacho sin comisiones de pasarelas de pago.
