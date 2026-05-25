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
┌─────────────┐     HTTP      ┌──────────────┐     TCP/5432     ┌──────────────┐
│   web       │  ───────────▶ │     api      │ ──────────────▶  │      db      │
│ Next.js 15  │   JWT Bearer  │  NestJS 11   │   Prisma + pool  │ Postgres 16  │
│ :3000       │   { data,     │  :4000/api   │                  │   :5432      │
│             │     meta }    │              │                  │              │
└─────────────┘               └──────────────┘                  └──────────────┘
```

Los tres viven en una red Docker interna llamada `hh_net`. El navegador del usuario solo sale por los puertos publicados (3000 y 4000). La BD nunca queda expuesta a Internet.

## Arrancar todo con un comando

Requisitos: Docker Desktop 4.x (o docker + docker compose).

```bash
git clone <repo>
cd Home-Health
cp .env.example .env          # editar JWT_*_SECRET con valores fuertes
docker compose up --build -d
```

A los ~2 min:
- Frontend → http://localhost:3000
- API → http://localhost:4000/api
- Swagger API → http://localhost:4000/docs (solo en NODE_ENV=development)
- Postgres → `localhost:5432` (user `hh_user`, db `home_health`)

La primera vez, el backend ejecuta automáticamente `prisma migrate deploy` antes de servir tráfico, así que la BD queda lista sin pasos manuales.

**Credenciales del seed**:
- admin@home-health.app / `Admin12345!`

Para sembrar el admin la primera vez:
```bash
docker compose exec api npm run prisma:seed
```

## Estructura del repo

```
Home-Health/
├── docker-compose.yml           Orquesta db + api + web en la red hh_net
├── .env.example                 Una sola fuente de verdad para configurar
├── frontend/                    Next.js 15 + Tailwind + Zustand
│   ├── Dockerfile               Multi-stage standalone (~120 MB)
│   └── README.md
├── backend/api/                 NestJS 11 + Prisma + PostgreSQL
│   ├── Dockerfile               Multi-stage Node 20 alpine (~150 MB)
│   ├── prisma/                  Schema + migrations + seed
│   └── README.md
├── docs/                        Documentación académica
│   ├── INFORME-PROYECTO-AULA.md
│   ├── 01-historias-de-usuario/
│   ├── 02-base-de-datos/
│   ├── 03-arquitectura/         (ADR + C4)
│   ├── 04-api/
│   ├── 05-aws/
│   └── 06-mockups/              Prototipo HTML navegable y link Figma
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

**Total**: ~520 MB de imágenes. Apto para instancia EC2 `t2.micro` (capa gratuita de AWS).

## Despliegue en AWS EC2

El sistema se despliega sobre una instancia **EC2 Ubuntu** usando Docker Compose directamente. No se requieren servicios adicionales de orquestación.

### 1. Preparar la instancia EC2

```bash
# Conectarse por SSH
ssh ubuntu@<IP_PUBLICA_EC2>

# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker y Docker Compose
sudo apt install -y docker.io docker-compose

# Iniciar Docker y habilitarlo al arranque
sudo systemctl start docker
sudo systemctl enable docker

# Agregar el usuario al grupo docker (evita usar sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clonar el repositorio y configurar

```bash
git clone <repo>
cd Home-Health
cp .env.example .env
# Editar .env con los secretos de producción (JWT_*_SECRET, contraseñas, etc.)
```

### 3. Levantar los contenedores

```bash
docker compose up -d --build
```

### 4. Sembrar el admin

```bash
docker compose exec api npm run prisma:seed
```

### 5. Configurar el Security Group de EC2

En la consola de AWS, agregar las siguientes reglas de entrada al Security Group de la instancia:

| Puerto | Protocolo | Descripción |
|--------|-----------|-------------|
| 22 | TCP | SSH (administración) |
| 3000 | TCP | Frontend |
| 4000 | TCP | API backend |

La aplicación queda accesible en:
- Frontend → `http://<IP_PUBLICA_EC2>:3000`
- API → `http://<IP_PUBLICA_EC2>:4000/api`

### Actualizar después de cambios

```bash
ssh ubuntu@<IP_PUBLICA_EC2>
cd Home-Health
git pull
docker compose down
docker compose up -d --build
```

CI/CD en GitHub Actions (ADR-010 lo documenta) automatiza este proceso al hacer push a `main` vía SSH con `appleboy/ssh-action`.

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

