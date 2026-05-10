# 💊 Home-Health

**Home-Health** es una plataforma web para la gestión de inventario y pedidos en farmacias y droguerías. Permite a los administradores controlar el stock de medicamentos, gestionar fechas de vencimiento y generar reportes, mientras que los clientes pueden consultar el catálogo de productos y registrar solicitudes de pedidos de forma sencilla.

> 📍 Proyecto de Aula — Arquitectura de Software | Semestre 2026-1  
> Corporación Universitaria del Huila — CORHUILA · Facultad de Ingeniería · Ingeniería de Sistemas

---

## 👥 Equipo

| Nombre | Correo institucional |
|--------|----------------------|
| Sebastian Puentes Gonzales | spuentes-2022b@corhuila.edu.co |
| Karina Cantillo Plaza | kcantillo-2032b@corhuila.edu.co |
| Danay Mariana Pereira Ospina | dmpereira-2032b@corhuila.edu.co |

---

## 🎯 Problema que resuelve

Las farmacias y droguerías gestionan grandes volúmenes de productos farmacéuticos sin herramientas digitales adecuadas. Esto genera:

- Descontrol en el inventario y pérdidas por exceso o falta de stock
- Productos vencidos que no fueron detectados a tiempo
- Dificultad para atender y hacer seguimiento a solicitudes de clientes

**Home-Health** centraliza esta gestión en una sola plataforma web, accesible para administradores y clientes con distintos niveles de acceso.

---

## 🚀 Funcionalidades

El sistema cuenta con **8 servicios REST** independientes:

| # | Servicio | Descripción |
|---|----------|-------------|
| 1 | **Autenticación** | Registro, login y control de acceso mediante JWT |
| 2 | **Usuarios** | Gestión de perfiles y datos de clientes y administradores |
| 3 | **Productos** | Gestión del catálogo de medicamentos, categorías y búsqueda |
| 4 | **Inventario** | Control de stock, entradas y salidas de productos |
| 5 | **Pedidos** | Registro y seguimiento de solicitudes con estados |
| 6 | **Vencimientos** | Monitoreo y alertas de productos próximos a vencer |
| 7 | **Reportes** | Informes de movimientos, stock e historial de pedidos |
| 8 | **Notificaciones** | Avisos internos por stock bajo, vencimientos y pedidos |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 15, Tailwind CSS |
| Backend | NestJS, Prisma ORM |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Contenedores | Docker, Docker Compose |
| Infraestructura | AWS (ECS Fargate, RDS, S3) |

---

## 🏗️ Arquitectura

El sistema aplica principios de **Arquitectura Limpia** con separación clara de responsabilidades:

- Principios **SOLID** y **Clean Code** en toda la base de código
- Patrones de diseño: **Repository**, **State** y **Strategy**
- Modelado arquitectónico mediante el marco **C4** (niveles 1, 2 y 3)
- Contenedores Docker para la contenerización y despliegue de la solución

La solución se implementa inicialmente como un **monolito modular**, organizado por dominios funcionales mediante módulos REST desacoplados.

Esta aproximación permite mantener simplicidad en el despliegue del MVP, facilitando al mismo tiempo la escalabilidad y una futura evolución hacia arquitecturas más distribuidas si el dominio del sistema lo requiere.

> Ver documentación completa en [`/docs/03-arquitectura/`](./docs/03-arquitectura/)

---

## 📁 Estructura del repositorio

```text
home-health/
├── frontend/                      # Aplicación web cliente (Next.js)
│   ├── src/
│   └── public/
├── backend/                       # API REST — 8 servicios (NestJS + Prisma)
│   ├── src/
│   └── tests/
├── docs/                          # Documentación técnica y académica
│   ├── Informe-Proyecto-Aula.xlsx
│   ├── 01-historias-de-usuario/   # HU con criterios de aceptación y storymaps
│   ├── 02-base-de-datos/          # MER
│   ├── 03-arquitectura/           # ADR, C4, infraestructura AWS
│   ├── 04-api/                    # Documentación de los 8 servicios
│   ├── 05-aws/                    # Permisos IAM y precios
│   ├── 06-mockups/                # Vistas renderizadas
│   └── imagenes/                  # Soporte visual de la documentación
└── docker-compose.yml
```

---

## ⚙️ Instalación y ejecución local

**Requisitos:** Node.js 20+, Docker y Docker Compose

```bash
# 1. Clonar el repositorio
git clone https://github.com/SEBBAS-5pg/Home-Health.git
cd Home-Health

# 2. Levantar todos los servicios con Docker
docker-compose up --build
```

> 🚧 Las variables de entorno y configuración detallada se documentarán conforme avance el desarrollo.

---

## 📚 Documentación

| Documento | Ruta |
|-----------|------|
| 📊 Informe de Proyecto de Aula | [`/docs/INFORME DE PROYECTO DE AULA.xlsx`](./docs/INFORME%20DE%20PROYECTO%20DE%20AULA.xlsx) |
| 📖 Historias de Usuario y Storymaps | [`/docs/01-historias-de-usuario/`](./docs/01-historias-de-usuario/) |
| 🗃️ Modelo Entidad-Relación | [`/docs/02-base-de-datos/`](./docs/02-base-de-datos/) |
| 🏛️ ADR, C4 e Infraestructura | [`/docs/03-arquitectura/`](./docs/03-arquitectura/) |
| 🔌 Documentación de API | [`/docs/04-api/`](./docs/04-api/) |
| ☁️ AWS: Permisos y Precios | [`/docs/05-aws/`](./docs/05-aws/) |
| 🎨 Mockups | [`/docs/06-mockups/`](./docs/06-mockups/) |

---

## 📌 Hitos de entrega

| Hito | Entregables | Fecha | Estado |
|------|-------------|-------|--------|
| **Hito 1** | ADR · MER · HU · Storymaps · API docs | 11 de mayo de 2026 | ⏳ En progreso |
| **Hito 2** | Sistema funcional desplegado en AWS | 20–25 de mayo de 2026 | 🔜 Pendiente |
