# 💊 Home-Health

Plataforma web para la gestión de inventario y pedidos en farmacias y droguerías. Los administradores controlan stock, vencimientos y reportes; los clientes consultan el catálogo y registran pedidos.

> Proyecto de Aula — Arquitectura de Software · 2026-1
> Corporación Universitaria del Huila (CORHUILA) · Ingeniería de Sistemas

## Equipo

| Nombre | Correo |
|---|---|
| Sebastian Puentes Gonzales | spuentes-2022b@corhuila.edu.co |
| Karina Cantillo Plaza | kcantillo-2032b@corhuila.edu.co |
| Danay Pereira | dpereira@corhuila.edu.co |

## Arquitectura en 30 segundos

```
┌─────────────┐     HTTPS     ┌──────────────┐     TCP/5432     ┌──────────────┐
│   web       │  ───────────▶ │     api      │ ──────────────▶  │      db      │
│ Next.js 14  │   JWT Bearer  │  NestJS 11   │   Prisma + pool  │ Postgres 16  │
│ :3000       │   { data,     │  :4000/api   │                  │   :5432      │
│             │     meta }    │              │                  │              │
└─────────────┘               └──────────────┘                  └──────────────┘
```

Los tres viven en una red Docker interna llamada `hh_net`. El navegador del usuario solo sale por los puertos publicados (3000 y 4000). La BD nunca queda expuesta a Internet en producción.

## Arrancar todo con un comando

Requisitos: Docker Desktop 4.x (o docker + docker compose).

```bash
git clone <repo>
cd Home-Health
cp .env.example .env          # editar JWT_*_SECRET con valores fuertes
docker compose up --build
```

A los ~2 min:
- Frontend → http://localhost:3000
- API → http://localhost:4000/api
- Swagger API → http://localhost:4000/docs (solo en NODE_ENV=development)
- Postgres → `localhost:5432` (user `hh_user`, db `home_health`)

La primera vez, el backend ejecuta automáticamente `prisma migrate deploy` antes de servir tráfico, así que la BD queda lista sin pasos manuales.

**Credenciales del seed**:
- admin@home-health.app / `Admin12345!`

Para crear el admin la primera vez:
```bash
docker compose exec api npm run prisma:seed
```

## Estructura del repo

```
Home-Health/
├── docker-compose.yml           Orquesta db + api + web en la red hh_net
├── .env.example                 Una sola fuente de verdad para configurar
├── frontend/                    Next.js 14 + Tailwind + Zustand
│   ├── Dockerfile               Multi-stage standalone (~120 MB)
│   └── README.md
├── backend/api/                 NestJS 11 + Prisma + PostgreSQL
│   ├── Dockerfile               Multi-stage Node 20 alpine (~150 MB)
│   ├── prisma/                  Schema + migrations + seed
│   └── README.md
├── docs/                        Documentación académica (Hito 1 completo)
│   ├── INFORME-PROYECTO-AULA.md
│   ├── 01-historias-de-usuario/
│   ├── 02-base-de-datos/
│   ├── 03-arquitectura/        (ADR + C4)
│   ├── 04-api/
│   ├── 05-aws/
│   └── 06-mockups/
└── mockup-interactivo.html      Prototipo HTML navegable
```

## Comandos útiles

```bash
docker compose up -d              # arrancar en background
docker compose logs -f api        # seguir logs del backend
docker compose logs -f web        # seguir logs del frontend
docker compose down               # detener todo
docker compose down -v            # detener y borrar volumen de BD (CUIDADO)

# Dentro del contenedor del backend:
docker compose exec api npm run prisma:studio   # abre Prisma Studio
docker compose exec api npm run prisma:seed     # re-siembra datos demo
docker compose exec api npm test                # corre los tests
```

## Stack y peso de imágenes

| Servicio | Imagen base | Tamaño | Recurso |
|---|---|---|---|
| **db** | `postgres:16-alpine` | ~250 MB | 1 vCPU / 512 MB RAM |
| **api** | `node:20-alpine` (multi-stage) | ~150 MB | 1 vCPU / 512 MB RAM |
| **web** | `node:20-alpine` (standalone) | ~120 MB | 1 vCPU / 256 MB RAM |

**Total**: ~520 MB de imágenes. Apto para AWS Lightsail Containers en plan nano (`small` para tener holgura).

## Despliegue en AWS Lightsail Containers

1. Crear instancia de **Amazon RDS PostgreSQL** (`db.t4g.micro`) o usar Lightsail Database.
2. Crear servicio de **Lightsail Containers** con dos contenedores: `api` y `web`.
3. Subir las imágenes:
   ```bash
   docker build -t home-health-api ./backend/api
   docker build -t home-health-web ./frontend \
     --build-arg NEXT_PUBLIC_API_URL=https://api.home-health.app/api
   aws lightsail push-container-image --service-name home-health \
     --label api --image home-health-api
   aws lightsail push-container-image --service-name home-health \
     --label web --image home-health-web
   ```
4. Configurar variables de entorno en cada contenedor (ver `.env.example`).
5. Apuntar el dominio público a Lightsail; abrir puerto 80 → web:3000 y 80/api → api:4000.

CI/CD en GitHub Actions (ADR-010 lo documenta) hace todo esto automáticamente al hacer push a `main`.

## Documentación

| Documento | Qué cubre |
|---|---|
| [Informe Proyecto de Aula](docs/INFORME-PROYECTO-AULA.md) | Contexto, RF/RNF (ISO 25010), matriz de riesgos, cronograma |
| [Historias de Usuario](docs/01-historias-de-usuario/HU.md) | 22 HU con Gherkin, story points y trazabilidad |
| [Story Map](docs/01-historias-de-usuario/storymap.md) | Backbone, walking skeleton, releases, MoSCoW |
| [MER](docs/02-base-de-datos/MER.md) | 10 entidades, constraints CHECK, índices, concurrencia |
| [ADR](docs/03-arquitectura/ADR.md) | 12 decisiones arquitectónicas con citas académicas |
| [C4](docs/03-arquitectura/diagramas-C4.md) | Contexto, Contenedores, Componentes con Mermaid |
| [Guía del código](docs/GUIA-DEL-CODIGO.md) | Explicación carpeta por carpeta del frontend |

## Modo desarrollo sin Docker

Si prefieres trabajar fuera de Docker:

```bash
# Terminal 1 — postgres en docker
docker compose up -d db

# Terminal 2 — backend
cd backend/api
cp .env.example .env
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev          # http://localhost:4000

# Terminal 3 — frontend
cd frontend
cp .env.example .env.local   # poner NEXT_PUBLIC_USE_MOCK=false
npm install
npm run dev                # http://localhost:3000
```

## Licencia

Uso académico. Corporación Universitaria del Huila (CORHUILA) · 2026-A.
