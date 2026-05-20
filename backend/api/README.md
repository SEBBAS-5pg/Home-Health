# Home-Health · API Backend

API REST de Home-Health: gestión de farmacia con catálogo, inventario, pedidos, vencimientos, reportes y notificaciones.

## Stack

| Capa | Herramienta |
|---|---|
| Framework | NestJS 11 + TypeScript |
| ORM | Prisma 5 sobre PostgreSQL 16 |
| Auth | JWT (access 15min + refresh 7d) con Passport |
| Hashing | bcrypt cost 12 |
| Logs | Pino estructurado JSON |
| Validación | class-validator + zod (env) |
| Seguridad | Helmet + CORS + Rate limiting |
| Reportes | PDFKit + ExcelJS + CSV |
| Tests | Jest |
| Despliegue | Docker multi-stage → AWS Lightsail Containers |

## Cómo arrancar en local

```bash
cd backend/api
cp .env.example .env             # editar JWT_*_SECRET con valores reales
npm install
docker compose up -d db          # postgres en :5432
npx prisma migrate dev           # crea tablas + corre 00000000000000_init_constraints
npm run prisma:seed              # crea admin y categorías
npm run start:dev                # http://localhost:4000/api
```

Swagger en desarrollo: [http://localhost:4000/docs](http://localhost:4000/docs)
Health: `GET /health` y `GET /health/ready`

**Credenciales del seed**:
- email: `admin@home-health.app`
- password: `Admin12345!`

## Estructura

```
src/
├── auth/                login, registro, recuperación, JWT strategy
├── users/               perfil + admin de usuarios
├── categories/          CRUD simple de categorías
├── products/            catálogo público + CRUD admin + expiring
├── inventory/           movimientos con bloqueo pesimista
├── orders/              ciclo de pedido + máquina de estados + cancelación
├── notifications/       centro de notificaciones del usuario
├── reports/             reportes con Strategy + formatters PDF/Excel/CSV
├── health/              liveness y readiness
├── common/
│   ├── guards/          JwtAuthGuard, RolesGuard
│   ├── decorators/      @Public, @Roles, @CurrentUser
│   ├── interceptors/    TransformInterceptor (envuelve { data, meta })
│   ├── filters/         HttpExceptionFilter (mapea Prisma + dominio → HTTP)
│   └── exceptions/      StockInsuficiente, InvalidTransition, etc.
├── config/              validación de env con zod
├── prisma/              PrismaService (cliente compartido)
├── app.module.ts
└── main.ts
```

## Decisiones que vale la pena explicar

**Repository pattern dentro de cada módulo.** Los services no llaman a Prisma directamente — pasan por un Repository que es la única capa que conoce el ORM. Si mañana cambia Prisma por Drizzle, solo se reescriben los repositorios. Lo aplican `users`, `products`. En módulos pequeños (categories, notifications) el service usa Prisma directo porque envolverlos sería sobre-ingeniería.

**Stock con bloqueo pesimista.** Las operaciones que tocan stock (`InventoryService.registerMovement`, `OrdersService.changeStatus` cuando pasa a `PREPARING`) hacen `SELECT ... FOR UPDATE` dentro de una transacción. Eso previene race conditions cuando dos pedidos quieren el último producto al mismo tiempo. Si el stock no alcanza, `StockInsuficienteException` aborta la transacción antes de tocar nada.

**Máquina de estados de pedidos.** `OrderStateMachine` declara las transiciones válidas en un mapa estático. Una sola fuente de verdad para `changeStatus()`, para construir botones en el frontend y para los tests unitarios. RN01 (no retroceder) sale gratis del diseño del mapa.

**Strategy pattern en reportes.** Cada reporte (`ventas`, `inventario`, `productos`) implementa `ReportStrategy` con `columns` y `generate(prisma, filters)`. El controller resuelve la strategy en runtime por path param. Para agregar un nuevo reporte basta crear el archivo y registrarlo en el map de `strategies/index.ts`. Cero cambios al controller.

**Formatters intercambiables.** PDF, Excel y CSV implementan `ReportFormatter` con `render({ columns, rows })`. El query param `?format=...` elige cuál usar. Si mañana entra "Markdown" o "ODS", el resto del código no se entera.

**JWT en dos tokens.** Access token corto (15 min) + refresh largo (7d). El access se envía en cada request; el refresh solo se usa para pedir un nuevo access. Esto reduce la ventana de exposición si el access se filtra.

**Tokens de recuperación de contraseña hasheados.** En `PasswordResetToken` se guarda el SHA-256 del token, nunca el plano. Si la BD se filtra, los enlaces de reset no son utilizables.

**AuditLog en todas las acciones críticas.** `OrdersService.create`, `OrdersService.changeStatus`, `InventoryService.registerMovement` y los CRUD admin escriben en `audit_logs` con `beforeData`/`afterData` en JSONB. Cumple el requisito regulatorio del Decreto 2200/2005.

**Constraints CHECK a nivel de BD.** Definidos en `prisma/migrations/00000000000000_init_constraints/migration.sql`. Garantizan `stock >= 0`, `quantity > 0`, `expires_at > created_at`, etc. Si el backend tuviera un bug, la BD se planta y rechaza la operación.

**Respuestas API uniformes.** `TransformInterceptor` envuelve toda respuesta exitosa en `{ data, meta: { timestamp } }`. Los errores van por `HttpExceptionFilter` en `{ error: { code, message, traceId, path } }`. El frontend siempre sabe qué leer.

## Tests

```bash
npm test           # corre todos los .spec.ts
npm run test:cov   # con cobertura
```

Tests incluidos:
- `order-state-machine.spec.ts` — todas las transiciones válidas e inválidas
- `reports/strategies/strategies.spec.ts` — contratos de las 3 estrategias

## Despliegue en AWS Lightsail Containers

```bash
npm run build
docker build -t home-health-api .
# tag y push a Lightsail Container Registry
```

El contenedor expone el puerto 4000. En producción `Dockerfile` hace `prisma migrate deploy` antes de arrancar Node para mantener la BD al día.

Variables de entorno mínimas:
- `DATABASE_URL` apuntando a RDS Postgres
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (>= 16 caracteres)
- `CORS_ORIGIN` con la URL del frontend

## API en resumen

| Método | Ruta | Quién | Qué hace |
|---|---|---|---|
| POST | `/api/auth/register` | público | Crea cliente |
| POST | `/api/auth/login` | público | Devuelve access + refresh + user |
| POST | `/api/auth/refresh` | público | Renueva access token |
| POST | `/api/auth/forgot-password` | público | Envía link de reset |
| POST | `/api/auth/reset-password` | público | Cambia contraseña con token |
| GET | `/api/users/me` | autenticado | Mi perfil |
| PATCH | `/api/users/me` | autenticado | Edita mi nombre/teléfono |
| GET | `/api/users` | ADMIN | Lista usuarios |
| PATCH | `/api/users/:id` | ADMIN | Edita usuario |
| GET | `/api/products` | público | Catálogo |
| GET | `/api/products/expiring` | ADMIN | Próximos a vencer |
| POST/PATCH/DELETE | `/api/products(/:id)` | ADMIN | Gestión catálogo |
| GET/POST | `/api/categories` | público/ADMIN | Categorías |
| GET | `/api/inventory/movements` | ADMIN | Historial |
| POST | `/api/inventory/movements` | ADMIN | Entrada/salida |
| GET | `/api/orders` | autenticado | Mis pedidos (cliente) o todos (admin) |
| POST | `/api/orders` | CLIENT | Crear pedido |
| PATCH | `/api/orders/:id/status` | ADMIN/CLIENT | Cambiar estado / cancelar |
| GET | `/api/notifications` | autenticado | Mis notificaciones |
| PATCH | `/api/notifications/:id/read` | autenticado | Marcar leída |
| GET | `/api/reports/:type` | ADMIN | Generar reporte |
| GET | `/api/reports/:type/export?format=pdf\|xlsx\|csv` | ADMIN | Descargar |
| GET | `/health` y `/health/ready` | público | Status |

## Próximos pasos

1. Conectar el frontend cambiando `NEXT_PUBLIC_USE_MOCK=false` y apuntando `NEXT_PUBLIC_API_URL` a esta URL.
2. Configurar Amazon SES en `AuthService.forgotPassword` (hoy hace `logger.log` del link).
3. Job nightly de verificación de stock (cron) que compara `Product.stock` con el agregado de `InventoryMovement` (ver ADR-012).
4. CloudWatch Logs como destino del logger Pino en producción.

---

Hecho por Karina Cantillo, Sebastian Puentes y Danay Pereira para la asignatura de Arquitectura de Software · CORHUILA · 2026-A.
