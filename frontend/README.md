# Home-Health · Frontend

App web del MVP de Home-Health (gestión de farmacia con cliente y admin). Hecha en Next.js 14 con App Router, TypeScript y Tailwind.

## Stack

| Capa | Herramienta |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS 3.4 + `clsx` + `tailwind-merge` |
| Estado global | Zustand 4 (con `persist`) |
| Formularios | react-hook-form + zod |
| HTTP | axios con interceptors |

Sin librerías UI pesadas: cada componente (`Button`, `Input`, `Card`, `DataTable`, `Chip`, `Badge`, etc.) está hecho a mano para que el bundle pese poco al subir a AWS.

## Cómo correrlo en local

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La app arranca en `/login`.

**Credenciales demo** (modo mock, sin backend):
- Cualquier correo con `admin` en el dominio (`admin@hh.com`) entra como **administrador**.
- Cualquier otro correo entra como **cliente**.
- La contraseña no se valida en modo demo.

## Scripts

```bash
npm run dev          # arranca en modo desarrollo (HMR)
npm run build        # build de producción
npm run start        # sirve el build (después de build)
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

## Estructura

```
src/
├── app/                  rutas (Next.js App Router)
│   ├── (auth)/           login y registro
│   ├── (client)/         catálogo, carrito, mis pedidos, perfil
│   └── admin/            dashboard, productos, inventario, pedidos, etc.
├── components/
│   ├── ui/               botón, input, card, tabla, badge, chip…
│   ├── features/         componentes específicos del dominio
│   └── layout/           Sidebar, ClientShell, AdminShell, AuthLayout
├── hooks/                useAsync, useDebounce, useToast, useLogout, useCurrentUser
├── lib/                  api (axios), validators (zod), utils, mocks, order-status-machine
├── services/             un service por dominio (Product, Order, User, Inventory, Notification)
├── store/                Zustand stores: auth y carrito
└── types/                tipos del dominio (User, Product, Order, etc.)
```

## Decisiones de diseño

**Un service por dominio.** Cada service expone una interfaz (`IProductService`, `IOrderService`…) y devuelve modelos del dominio. Las páginas dependen de la interfaz, no de la implementación. Así puedo correr la app en modo mock (datos en memoria) o real (HTTP al backend) cambiando un flag de env:

```ts
// src/lib/api.ts
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
```

**Por qué Zustand y no Context.** Necesitaba dos cosas que viven fuera del árbol de componentes: la sesión y el carrito. Zustand pesa 1 KB, trae `persist` listo y no tengo que pelear con providers anidados.

**Por qué hice los componentes UI desde cero.** Probé `shadcn/ui` y `radix` pero para 15 pantallas era demasiado. Mis componentes (`Button`, `Input`, `Card`, `Chip`, `Badge`, `Modal`, `DataTable`) suman menos de 700 líneas y cubren exactamente mi sistema visual (turquesa + coral).

**Máquina de estados para el pedido.** Las transiciones (`Pendiente → En preparación → En camino → Entregado`, con bifurcación a `Rechazado` desde `Pendiente`) tienen reglas duras (no retroceder). Las puse en `lib/order-status-machine.ts` para que tanto el service como la UI consulten la misma fuente.

**Strategy en reportes.** Tres tipos de reporte (ventas, inventario, productos top) con columnas y queries distintas. Antes tenía un `switch` gigante en la página. Lo refactoré para que cada tipo sea un objeto `ReportStrategy` con sus columnas y su `generate()`. Para agregar un cuarto reporte ya no toco la página: sumo una entrada al map `STRATEGIES`.

**Validación con zod.** Cada formulario tiene su schema en `lib/validators.ts`. react-hook-form lo consume con `zodResolver`. Mensajes de error en español.

**Auth con JWT (cuando haya backend).** Hoy es mock. El `api.ts` ya tiene interceptors que adjuntan el token a cada request y redirigen a `/login` si el backend devuelve 401. Al conectar el backend solo cambio `NEXT_PUBLIC_USE_MOCK=false`.

## Conectar al backend real (cuando esté listo)

1. En `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://api.home-health.app
   NEXT_PUBLIC_USE_MOCK=false
   ```
2. Asegurarse que el backend exponga los endpoints que esperan los services (están listados en cada `*.service.ts` como llamadas a `api.get/post/patch/delete`).
3. Hacer login con un usuario real; el token JWT se guarda en `localStorage` con la key `hh_token`.

## Despliegue en AWS Lightsail Containers

```bash
npm run build
docker build -t home-health-web .
# tag y push a Lightsail Container Registry
```

El build de Next.js es standalone (configurado en `next.config.mjs`), así la imagen Docker queda en ~120 MB. Variables de entorno se inyectan al contenedor desde el panel de Lightsail.

## Reglas para mantener el código sano

- Cualquier nuevo endpoint del backend pasa por su service correspondiente. **No hacer fetch directo desde las páginas.**
- Cualquier nuevo formulario debe tener su schema zod en `lib/validators.ts`.
- Cualquier nuevo estado de pedido debe agregarse a la máquina en `lib/order-status-machine.ts` y a las transiciones válidas. Si no, romperá HU11.
- Los toasts (`toast.success`, `toast.error`) son globales — no hace falta importar un `<Toaster>`, ya está montado en el root.

---

Hecho por Karina Cantillo, Sebastian Puentes y Danay Pereira para la asignatura de Arquitectura de Software · CORHUILA · 2026-A.
