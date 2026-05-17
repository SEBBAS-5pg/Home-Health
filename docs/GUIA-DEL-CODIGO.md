# Guía del código de Home-Health
### Explicada de la forma más simple posible

---

## 1. El proyecto como una pizzería

Imagínate que **Home-Health es una pizzería**:

- El **frontend** es el comedor: las mesas, los manteles, los menús, las sillas. Es lo que el cliente ve y toca.
- El **backend** (que está vacío todavía) es la cocina: donde se preparan las pizzas, donde está el chef, los ingredientes, las recetas secretas.
- La **base de datos** es la despensa: donde guardamos todo (productos, clientes, pedidos).
- La **API** es el mesero: lleva pedidos de la mesa a la cocina y trae los platos de la cocina a la mesa.

Tu proyecto tiene **dos carpetas grandes**:

```
Home-Health/
├── frontend/   ← El comedor (lo que se ve)
├── backend/    ← La cocina (vacío por ahora)
└── docs/       ← Documentación
```

---

## 2. La carpeta `frontend/` por dentro

Aquí vive toda la aplicación que se ve en el navegador. Lo importante está en `frontend/src/`:

```
frontend/src/
├── app/          ← Las pantallas (páginas) de la app
├── components/   ← Piezas reutilizables (botones, tarjetas)
├── hooks/        ← "Súper-poderes" de React reutilizables
├── lib/          ← Herramientas comunes
├── services/     ← El "mesero" que habla con la cocina
├── store/        ← La memoria global de la app
└── types/        ← Las "fichas" que describen los datos
```

Vamos una por una con analogías.

---

### 2.1 `app/` — Las pantallas

Cada subcarpeta es **una pantalla** que el usuario puede visitar. Next.js usa los nombres de las carpetas como rutas en el navegador.

```
app/
├── (auth)/          ← Pantallas de autenticación
│   ├── login/       → http://localhost:3000/login
│   └── register/    → http://localhost:3000/register
├── (client)/        ← Pantallas del cliente
│   ├── catalog/     → /catalog
│   ├── my-orders/   → /my-orders
│   ├── order/       → /order (carrito)
│   └── profile/     → /profile
└── admin/           ← Pantallas del administrador
    ├── dashboard/   → /admin/dashboard
    ├── products/    → /admin/products
    ├── inventory/   → /admin/inventory
    ├── orders/      → /admin/orders
    ├── expiry/      → /admin/expiry
    ├── users/       → /admin/users
    ├── reports/     → /admin/reports
    └── notifications/ → /admin/notifications
```

**Lo que está entre paréntesis** `(auth)` y `(client)` no se pone en la URL — son solo **grupos** para organizar las pantallas que comparten el mismo "layout" (la misma decoración alrededor).

Dentro de cada carpeta hay un archivo `page.tsx` — ese es el código de esa pantalla específica.

---

### 2.2 `components/` — Las piezas Lego

En vez de dibujar un botón 50 veces, lo dibujamos UNA vez y lo usamos donde queramos. Eso es un componente.

```
components/
├── ui/         ← Piezas pequeñas y genéricas: Button, Input, Card, Chip, Badge
├── features/   ← Piezas específicas del negocio: ProductCard, OrderTimeline
└── layout/     ← El "marco" alrededor: Sidebar, ClientShell, AdminShell
```

**Ejemplo real**: si en 5 pantallas necesitas el botón turquesa, importas `Button` y listo:

```tsx
import { Button } from "@/components/ui/Button";

<Button>Guardar</Button>
```

Si decides que el turquesa ya no te gusta y quieres cambiarlo a azul, lo cambias en UN solo archivo y las 5 pantallas se actualizan.

---

### 2.3 `hooks/` — Los súper-poderes reutilizables

Un hook es una función que le da "poderes" a un componente. Vienen integrados de React (como `useState`, `useEffect`) o los hacemos nosotros para reutilizar lógica.

En tu proyecto tienes:

- **`useAsync`** — ejecuta una función que tarda (como pedir datos a la API) y te dice si está "cargando", si terminó o si falló.
- **`useDebounce`** — espera a que el usuario deje de escribir antes de buscar. Útil para que no busque en cada letra.
- **`useToast`** — muestra esos mensajitos que aparecen en la esquina ("✓ Guardado").
- **`useLogout`** — cierra sesión: limpia el token, vacía el carrito, redirige a login.
- **`useCurrentUser`** — te dice quién es el usuario logueado y su rol.

**Analogía**: son como las apps de tu celular. No las construyes cada vez que las usas, solo las abres.

---

### 2.4 `lib/` — La caja de herramientas

Funciones y configuraciones que se usan en todo el proyecto:

- **`api.ts`** — La configuración de axios. Aquí se decide a qué servidor llamar y cómo manejar errores. **Es el corazón de las APIs**. Más sobre esto abajo.
- **`utils.ts`** — Funciones útiles: formatear precios en pesos colombianos, formatear fechas, juntar clases de CSS.
- **`validators.ts`** — Reglas que validan los formularios (ej. "el correo debe tener @", "la contraseña mínimo 8 caracteres").
- **`mock-data.ts`** — Datos falsos para desarrollar sin backend. Productos inventados, pedidos inventados, etc.
- **`order-status-machine.ts`** — La regla de qué estados puede tener un pedido y a cuáles puede cambiar (ej. "Pendiente" → "En preparación" sí se puede, pero "Pendiente" → "Entregado" directo NO).

---

### 2.5 `services/` — El mesero que habla con la cocina

Aquí está la parte que **conecta el frontend con las APIs**. Cada archivo se encarga de UN tipo de cosa:

```
services/
├── product.service.ts       ← Productos (listar, crear, editar, borrar)
├── order.service.ts         ← Pedidos
├── user.service.ts          ← Usuarios
├── inventory.service.ts     ← Inventario y movimientos
├── notification.service.ts  ← Notificaciones
└── types.ts                 ← Las "promesas" de qué función tiene cada servicio
```

**Ejemplo concreto**: si en el catálogo quieres listar productos:

```tsx
import { productService } from "@/services";

const productos = await productService.list();
```

Detrás de bambalinas, `productService.list()` decide:
- Si está en modo "demo" (sin backend), te trae datos inventados de `mock-data.ts`.
- Cuando el backend esté listo, hará una petición HTTP real al servidor.

---

### 2.6 `store/` — La memoria global

Hay datos que necesitan estar disponibles en **toda la app**, no solo en una pantalla. Por ejemplo:

- ¿Quién es el usuario logueado? — lo necesitan el sidebar, el header, el botón de cerrar sesión...
- ¿Qué hay en el carrito? — lo necesitan el catálogo (para el contador), la página del carrito, el checkout...

Para eso usamos **Zustand**, una librería que guarda esos datos en una "caja global":

```
store/
├── auth.store.ts   ← Usuario, token de sesión
└── cart.store.ts   ← Productos en el carrito
```

**Lo bueno**: estos datos también se guardan en el navegador (`localStorage`), así si cierras y vuelves a abrir la pestaña, sigue tu sesión.

---

### 2.7 `types/` — Las fichas técnicas

Aquí decimos qué forma tienen los datos. Es como rellenar una ficha de inscripción:

```ts
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  expiryDate?: string;
}
```

Esto le dice al editor: "un Product siempre tiene id, name, category, price, stock — y opcionalmente expiryDate". Si por error escribes `producto.precio` en vez de `producto.price`, el editor te avisa antes de que rompa la app.

---

## 3. Cómo funcionan las APIs (el viaje de los datos)

### 3.1 ¿Qué es una API?

API significa **Application Programming Interface**. Suena complicado pero es solo **una forma estándar de pedir y recibir datos entre dos programas**.

Piensa en un cajero automático: tú no entras al banco a sacar plata; le pides al cajero (API), él habla con el sistema del banco (backend), y te devuelve la plata (datos).

### 3.2 Las cuatro acciones básicas (CRUD)

Una API normalmente sabe hacer 4 cosas con cada tipo de dato (productos, pedidos, usuarios):

| Acción | Verbo HTTP | Ejemplo |
|--------|------------|---------|
| **C**rear | POST | "Crea este producto nuevo" |
| **R**ead (Leer) | GET | "Dame la lista de productos" |
| **U**pdate (Actualizar) | PUT/PATCH | "Cambia el precio del producto X" |
| **D**elete (Borrar) | DELETE | "Elimina el producto X" |

### 3.3 El camino de una petición

Cuando el cliente hace clic en "Confirmar pedido", esto pasa por dentro:

```
1. CLIENTE HACE CLIC
   ↓
2. La pantalla del CARRITO llama a:
   orderService.create({ items, deliveryAddress, ... })
   ↓
3. order.service.ts decide:
   - ¿Modo demo? → busca en mock-data.ts
   - ¿Modo real? → llama a api.post("/orders", { ... })
   ↓
4. api.ts (axios) construye la petición HTTP:
   POST http://localhost:4000/api/orders
   Authorization: Bearer <token-del-usuario>
   Content-Type: application/json
   { "items": [...], "deliveryAddress": "..." }
   ↓
5. El BACKEND recibe, valida, guarda en la base de datos
   y responde:
   { "id": "ord-123", "number": "PED-00129", "status": "Pendiente", ... }
   ↓
6. axios trae esa respuesta al frontend
   ↓
7. La pantalla muestra "✓ Pedido creado #PED-00129"
   y redirige a Mis Pedidos
```

### 3.4 El archivo más importante: `lib/api.ts`

Este es el archivo que prepara a **axios** (el "mensajero" que hace las peticiones HTTP):

```ts
export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",  // ← A dónde apunta el servidor
  timeout: 10000,                          // ← Esperar máximo 10 segundos
});
```

También configura dos cosas inteligentes:

**Interceptor de petición** — antes de ENVIAR cualquier llamada, le pone el token de seguridad automáticamente:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hh_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Así no tienes que acordarte de poner el token cada vez. Es como cuando entras a un edificio con tu tarjeta: el sensor la lee automáticamente.

**Interceptor de respuesta** — si el servidor responde "401 Unauthorized" (no estás logueado o tu token expiró), automáticamente cierra sesión y te lleva a `/login`:

```ts
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### 3.5 El modo "demo" vs "real"

Tu proyecto tiene un truco: puede correr **sin backend** usando datos falsos. Esto se controla con una variable:

```ts
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
```

- Si `USE_MOCK = true` → los services usan los datos de `mock-data.ts` (productos inventados).
- Si `USE_MOCK = false` → los services llaman al backend de verdad.

Esto te permite **desarrollar el frontend sin esperar al backend**, lo cual es genial para entregas universitarias.

---

## 4. Ejemplo paso a paso: cuando un admin crea un producto nuevo

Vamos a seguir el flujo COMPLETO de "el admin hace clic en + Nuevo producto":

**Paso 1** — Pantalla `app/admin/products/page.tsx`:
- El admin llena el formulario (nombre, precio, stock, categoría).
- Hace clic en "Guardar".

**Paso 2** — Validación con Zod (`lib/validators.ts`):
- Antes de enviar, se valida que el nombre no esté vacío, el precio sea positivo, etc.
- Si algo falla, aparece un toast rojo y NO se envía.

**Paso 3** — Llamada al service:

```ts
import { productService } from "@/services";

await productService.create({
  name: "Acetaminofén 500mg",
  category: "Analgesicos",
  price: 12500,
  stock: 100,
});
```

**Paso 4** — `services/product.service.ts` decide qué hacer:
- En modo demo: agrega el producto a un array en memoria.
- En modo real: llama a `api.post("/products", { ... })`.

**Paso 5** — `lib/api.ts` envía la petición HTTP al backend con el token JWT adjunto.

**Paso 6** — El backend recibe, guarda en la base de datos, responde con el producto creado (incluyendo su ID).

**Paso 7** — Vuelve al frontend. El componente:
- Muestra un toast verde: "✓ Producto creado".
- Refresca la lista con `refetch()` (gracias al hook `useAsync`).
- Cierra el modal del formulario.

Todo esto pasa en menos de un segundo.

---

## 5. Conceptos clave (mini-diccionario)

- **HTTP** — el "idioma" que hablan los navegadores con los servidores.
- **HTTP Method** — el "verbo" de la petición: GET (leer), POST (crear), PUT (cambiar), DELETE (borrar).
- **JSON** — el "formato" de los datos que viajan: parecido a un objeto JavaScript. Ej. `{ "nombre": "Karina" }`.
- **JWT (Json Web Token)** — el "tiquete" de seguridad que prueba quién eres después de iniciar sesión.
- **Endpoint** — una "puerta" específica del backend. Ej. `POST /api/products` es la puerta para crear productos.
- **Axios** — librería que facilita hacer peticiones HTTP. La alternativa nativa es `fetch()`.
- **Async/Await** — sintaxis para esperar a que algo termine sin congelar la app. `await orderService.create(...)` significa "espera el resultado y luego continúa".
- **Promise** — el "vale" que recibes mientras esperas un resultado.
- **Estado (state)** — datos que viven en un componente y cambian (ej. lo que escribe el usuario en un input).
- **Store global** — datos que viven fuera de los componentes y los puede leer toda la app.
- **Mock** — datos falsos para desarrollar sin servidor real.

---

## 6. ¿Por qué está organizado así?

Este orden no es aleatorio. Se llama **Separation of Concerns** (separación de responsabilidades) y sigue principios SOLID:

- **Las pantallas (`app/`) NO saben cómo hablar con el servidor** — solo llaman al service y muestran lo que reciba.
- **Los services NO saben cómo se ve la pantalla** — solo traen y mandan datos.
- **El api.ts NO sabe qué tipo de dato envía** — solo envía/recibe peticiones HTTP genéricas.

¿Para qué sirve esto? Si mañana decides cambiar de axios a fetch, o cambias el backend de Node a Python, **solo cambias UN archivo** (api.ts o el service correspondiente). El resto de la app sigue funcionando igual.

---

## 7. ¿Qué falta por construir?

Tu proyecto actual:
- ✅ Frontend completo con las 15 pantallas funcionando.
- ✅ Services con modo "mock" que ya funciona sin backend.
- ✅ Validaciones, estado global, autenticación simulada.
- ❌ Backend real (carpeta `backend/api/` vacía).
- ❌ Base de datos.

**Cuando construyas el backend** (típicamente con Node.js + Express + PostgreSQL/MongoDB, o Python + FastAPI), solo necesitas:

1. Hacer que cada endpoint coincida con lo que llaman los services. Ej. `GET /api/products` debe devolver una lista de productos en el formato definido en `types/index.ts`.
2. Cambiar `NEXT_PUBLIC_USE_MOCK=false` en las variables de entorno.
3. Apuntar `NEXT_PUBLIC_API_URL` a la URL de tu backend real.

Y listo, el frontend automáticamente empieza a hablar con el backend real sin cambiar una sola línea.

---

¡Espero que esta guía te haya aclarado las cosas! Si algo no quedó claro, dime qué parte y te la explico con más detalle o con otro ejemplo.
