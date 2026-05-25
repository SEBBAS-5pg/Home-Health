# Architecture Decision Records (ADR) — Home-Health

## Introducción

Este documento registra las principales decisiones arquitectónicas tomadas durante el diseño y planificación del sistema **Home-Health**.

Los Architecture Decision Records (ADR) permiten documentar el contexto, las motivaciones técnicas y las consecuencias asociadas a cada decisión relevante de arquitectura adoptada durante el proyecto.

Cada ADR incluye:

- contexto del problema o necesidad,
- decisión arquitectónica adoptada,
- consecuencias técnicas y operativas,
- beneficios esperados,
- riesgos asociados,
- alternativas consideradas.

El objetivo de este documento es mantener trazabilidad arquitectónica, justificar técnicamente las tecnologías y patrones seleccionados, y facilitar la comprensión de la solución propuesta para el desarrollo, despliegue y evolución futura del sistema.

---

# ADR-001: Adoptar Arquitectura Limpia con Monolito Modular

## Estado

Accepted

---

## Contexto

El sistema Home-Health debe soportar múltiples dominios funcionales relacionados con la gestión de farmacias, incluyendo autenticación, catálogo de productos, inventario, pedidos, reportes y notificaciones.

Debido a la naturaleza del proyecto, se requiere una arquitectura que permita mantener separación clara de responsabilidades, bajo acoplamiento entre módulos y facilidad de mantenimiento a medida que el sistema evolucione.

Adicionalmente, el proyecto corresponde a un MVP académico con alcance controlado, por lo que se busca evitar complejidad operacional innecesaria durante las etapas iniciales de desarrollo y despliegue.

Se evaluó la posibilidad de implementar una arquitectura de microservicios; sin embargo, esta aproximación implicaría desafíos adicionales como comunicación distribuida, orquestación de servicios, balanceo de carga, observabilidad y mayor complejidad de infraestructura, aspectos que exceden las necesidades actuales del proyecto.

---

## Decisión

Se decide implementar el backend utilizando una arquitectura basada en principios de Clean Architecture organizada como un monolito modular desacoplado mediante módulos REST en NestJS.

La solución estará estructurada por dominios funcionales independientes, tales como:

- Authentication
- Users
- Products
- Inventory
- Orders
- Expirations
- Notifications
- Reports

Cada módulo encapsulará sus propias responsabilidades utilizando separación por capas, incluyendo:

- Controllers
- Services
- Repositories
- DTOs
- Entities

La arquitectura seguirá principios SOLID y prácticas de Clean Code con el objetivo de mejorar mantenibilidad, reutilización y escalabilidad futura del sistema.

Esta aproximación permite mantener simplicidad de despliegue y desarrollo para el MVP, conservando al mismo tiempo una estructura desacoplada que facilite una posible migración futura hacia arquitecturas distribuidas o microservicios si el crecimiento del dominio lo requiere.

---

## Consecuencias

### Positivas

- Separación clara de responsabilidades entre módulos y capas.
- Mayor mantenibilidad y legibilidad del código.
- Menor complejidad operacional frente a una arquitectura distribuida.
- Desarrollo más rápido y sencillo para el alcance MVP.
- Facilita pruebas unitarias y escalabilidad modular.
- Permite evolución progresiva hacia microservicios en el futuro si es necesario.
- Mejor alineación con principios SOLID y Clean Architecture.

### Negativas / Riesgos

- El sistema continúa desplegándose como una única unidad ejecutable.
- Un fallo crítico podría afectar múltiples módulos del sistema.
- Escalabilidad limitada frente a arquitecturas completamente distribuidas.
- Posible incremento de acoplamiento si no se respetan correctamente los límites entre módulos.
- Requiere disciplina arquitectónica para mantener separación adecuada de responsabilidades.

---

## Alternativas consideradas

### 1. Arquitectura de microservicios

Se consideró dividir el sistema en múltiples servicios independientes por dominio funcional. Esta alternativa fue descartada debido a la complejidad adicional de despliegue, comunicación distribuida, monitoreo y administración de infraestructura, aspectos innecesarios para el alcance actual del MVP.

### 2. Arquitectura monolítica tradicional sin modularización

Se evaluó implementar un monolito sin separación clara por dominios ni capas internas. Esta opción fue descartada debido al riesgo de generar alto acoplamiento, baja mantenibilidad y dificultades de escalabilidad conforme aumente el tamaño del sistema.

### 3. Arquitectura basada únicamente en capas técnicas

Se consideró organizar el sistema exclusivamente por capas globales (controllers, services y repositories compartidos). Sin embargo, esta aproximación fue descartada porque dificulta la separación por dominios funcionales y reduce la cohesión modular del sistema.

---

# ADR-002: Usar PostgreSQL como base de datos relacional principal

## Estado

Accepted

---

## Contexto

El sistema Home-Health requiere administrar información relacionada con usuarios, productos, categorías, inventario, pedidos, vencimientos y notificaciones, manteniendo relaciones estructuradas entre múltiples entidades del dominio.

El proyecto maneja operaciones críticas como procesamiento de pedidos, actualización de stock y control de inventario, las cuales demandan consistencia de datos y validación de reglas de negocio para evitar inconsistencias como stock negativo, pérdida de relaciones o registros incompletos.

Adicionalmente, el modelo de datos del sistema presenta relaciones fuertemente conectadas entre entidades, por ejemplo:

- User → Order
- Order → OrderItem
- Product → InventoryMovement
- Category → Product

Estas relaciones requieren integridad referencial, soporte transaccional y consultas estructuradas para garantizar trazabilidad y confiabilidad de la información.

Se evaluaron alternativas NoSQL como MongoDB y Firebase; sin embargo, dichas soluciones priorizan flexibilidad documental y escalabilidad horizontal sobre consistencia relacional estricta, lo cual no se alinea con las necesidades principales del dominio farmacéutico definido para el MVP.

---

## Decisión

Se decide utilizar PostgreSQL como sistema gestor de base de datos principal para el proyecto Home-Health.

La persistencia será implementada mediante una arquitectura relacional utilizando Prisma ORM como capa de acceso a datos y mapeo entre entidades del dominio y tablas de la base de datos.

El modelo relacional permitirá gestionar:

- relaciones entre entidades mediante claves foráneas,
- integridad referencial,
- validación de restricciones,
- consultas estructuradas,
- control transaccional,
- consistencia de inventario y pedidos.

La arquitectura de persistencia estará alineada con los módulos funcionales definidos en el sistema, permitiendo mantener separación lógica y trazabilidad entre operaciones relacionadas con autenticación, productos, inventario, pedidos, reportes y notificaciones.

Las operaciones críticas, especialmente aquellas relacionadas con actualización de stock y procesamiento de pedidos, deberán ejecutarse de forma transaccional para garantizar integridad de los datos.

---

## Consecuencias

### Positivas

- Garantiza integridad referencial mediante claves foráneas y restricciones relacionales.
- Facilita modelado estructurado del dominio farmacéutico.
- Permite ejecutar transacciones para mantener consistencia en pedidos e inventario.
- Mejora trazabilidad y control de operaciones históricas.
- Facilita generación de reportes mediante consultas SQL agregadas.
- Prisma ORM reduce complejidad de acceso a datos y mejora mantenibilidad.
- Amplia compatibilidad con NestJS, Docker y entornos cloud como AWS.

### Negativas / Riesgos

- Mayor rigidez estructural frente a bases de datos documentales.
- Cambios frecuentes en el modelo pueden requerir migraciones adicionales.
- Escalabilidad horizontal más compleja comparada con algunas soluciones NoSQL.
- Requiere diseño adecuado de relaciones y normalización para evitar degradación de rendimiento.
- Dependencia de una estructura relacional bien definida desde etapas tempranas del proyecto.

---

## Alternativas consideradas

### 1. MongoDB

Se consideró utilizar una base de datos documental debido a su flexibilidad y facilidad para manejar estructuras dinámicas. Sin embargo, esta alternativa fue descartada porque el sistema requiere relaciones consistentes entre entidades, integridad referencial y operaciones transaccionales críticas relacionadas con pedidos e inventario.

### 2. Firebase Firestore

Se evaluó Firebase por su facilidad de integración y despliegue rápido. No obstante, fue descartado debido a limitaciones en consultas relacionales complejas, control transaccional avanzado y modelado estructurado del dominio.

### 3. MySQL

Se consideró utilizar MySQL como alternativa relacional. Aunque cumple con gran parte de los requerimientos del proyecto, se decidió utilizar PostgreSQL debido a sus capacidades avanzadas de integridad, extensibilidad y mejor compatibilidad con algunas funcionalidades modernas utilizadas por Prisma ORM.

---

# ADR-003: Implementar autenticación basada en JWT

## Estado

Accepted

---

## Contexto

El sistema Home-Health requiere controlar el acceso a funcionalidades protegidas relacionadas con gestión de inventario, pedidos, reportes y administración del sistema.

La aplicación contempla múltiples tipos de usuarios, principalmente clientes y administradores, cada uno con diferentes permisos y responsabilidades dentro de la plataforma.

Adicionalmente, la arquitectura propuesta utiliza un frontend desacoplado del backend mediante una API REST, lo que requiere un mecanismo de autenticación compatible con comunicación stateless y consumo desde clientes web modernos.

Se evaluaron mecanismos tradicionales basados en sesiones almacenadas en servidor y autenticación stateful mediante cookies; sin embargo, estas alternativas incrementan el acoplamiento entre cliente y servidor, dificultan escalabilidad horizontal y complejizan el despliegue distribuido de la aplicación.

---

## Decisión

Se decide implementar un sistema de autenticación y autorización basado en JSON Web Tokens (JWT).

El backend generado con NestJS será responsable de:

- validar credenciales de usuarios,
- generar tokens JWT firmados,
- proteger rutas privadas mediante Guards,
- controlar acceso según roles definidos,
- verificar autenticación en cada solicitud protegida.

El token JWT contendrá información mínima necesaria para identificar al usuario autenticado y sus permisos asociados.

La autorización del sistema se basará en roles como:

- ADMIN
- CLIENT

Las credenciales de usuarios serán almacenadas utilizando algoritmos de hashing seguro y nunca se expondrá información sensible dentro de las respuestas de autenticación.

Esta aproximación permite mantener una arquitectura REST stateless compatible con frontend desacoplado utilizando Next.js y facilita futuras integraciones con aplicaciones móviles o clientes externos.

---

## Consecuencias

### Positivas

- Mantiene compatibilidad con principios REST stateless.
- Facilita desacoplamiento entre frontend y backend.
- Permite escalabilidad horizontal sin dependencia de sesiones almacenadas en servidor.
- Facilita protección de rutas mediante Guards y control por roles.
- Compatible con arquitecturas modernas basadas en APIs.
- Simplifica integración futura con aplicaciones móviles o servicios externos.
- Reduce complejidad de manejo de sesiones en infraestructura distribuida.

### Negativas / Riesgos

- Requiere manejo adecuado de expiración y renovación de tokens.
- Un token comprometido podría ser utilizado hasta su expiración.
- Incrementa responsabilidad del frontend en almacenamiento seguro del token.
- Revocar sesiones activas puede resultar más complejo que en autenticación stateful.
- Configuraciones incorrectas podrían exponer endpoints protegidos.

---

## Alternativas consideradas

### 1. Autenticación basada en sesiones de servidor

Se evaluó implementar autenticación tradicional mediante sesiones almacenadas en backend y cookies de sesión. Esta alternativa fue descartada debido al mayor acoplamiento entre cliente y servidor y las dificultades de escalabilidad en entornos distribuidos.

### 2. Autenticación mediante cookies stateful

Se consideró utilizar cookies persistentes manejadas directamente por el servidor. Sin embargo, esta aproximación fue descartada porque el proyecto utiliza una arquitectura desacoplada basada en APIs REST y frontend independiente.

### 3. Integración con proveedores externos de autenticación

Se evaluó utilizar soluciones externas como Auth0 o Firebase Authentication. Esta alternativa fue descartada debido al alcance académico del proyecto y al interés de implementar directamente el flujo de autenticación dentro de la arquitectura propuesta.

---

# ADR-004: Containerización y despliegue mediante Docker Compose en instancia EC2

## Estado

Accepted

---

## Contexto

El sistema Home-Health requiere una estrategia de despliegue que permita mantener consistencia entre ambientes de desarrollo, pruebas y producción, además de facilitar portabilidad y simplificar el proceso de ejecución del sistema.

La solución contempla múltiples componentes tecnológicos desacoplados, incluyendo frontend, backend y base de datos, los cuales deben ejecutarse de manera aislada y reproducible para reducir problemas relacionados con configuración de entornos y dependencias.

Adicionalmente, el proyecto será desplegado en infraestructura cloud utilizando servicios de AWS como parte del alcance académico del sistema.

Se evaluaron diferentes alternativas de despliegue en AWS. AWS Lightsail Containers fue considerado inicialmente por su interfaz simplificada para despliegue de contenedores; sin embargo, su modelo de facturación continua por contenedor activo genera costos que superan el presupuesto académico del proyecto incluso en períodos de bajo uso. Se optó por una instancia EC2 con Ubuntu sobre la cual se ejecuta Docker Compose, eliminando costos de orquestación gestionada y aprovechando la capa gratuita de EC2 (`t2.micro` o `t3.micro`).

---

## Decisión

Se decide utilizar contenedores Docker orquestados con **Docker Compose** sobre una instancia **EC2 Ubuntu** como estrategia de despliegue cloud.

La instancia EC2 ejecuta los tres servicios definidos en `docker-compose.yml`:

- `db`: PostgreSQL 16 como contenedor con volumen persistente.
- `api`: backend NestJS construido con imagen multi-stage.
- `web`: frontend Next.js en modo standalone.

Los tres servicios comparten la red interna `hh_net`. Solo los puertos 3000 (web) y 4000 (api) se exponen al exterior mediante las reglas del Security Group de EC2. La base de datos nunca queda expuesta a Internet.

El proceso de despliegue en la instancia EC2 consiste en:

1. Instalar Docker y Docker Compose en la instancia Ubuntu (`sudo apt install -y docker.io docker-compose`).
2. Clonar el repositorio desde GitHub (`git clone`).
3. Configurar el archivo `.env` con los secretos de producción.
4. Ejecutar `docker compose up -d --build`.

Las actualizaciones se realizan conectándose por SSH a la instancia y ejecutando `git pull` seguido de `docker compose up -d --build`.

El Security Group de EC2 debe tener habilitadas las siguientes reglas de entrada:

| Puerto | Protocolo | Descripción        |
| :----- | :-------- | :----------------- |
| 22     | TCP       | SSH (administración) |
| 3000   | TCP       | Frontend (web)     |
| 4000   | TCP       | API backend        |

---

## Consecuencias

### Positivas

- Consistencia entre ambientes de desarrollo, pruebas y producción.
- Portabilidad del sistema entre diferentes entornos de ejecución.
- Separación clara de responsabilidades mediante contenedores independientes.
- Simplificación del proceso de despliegue y configuración.
- Reducción de problemas relacionados con dependencias locales.
- Facilita integración futura con pipelines de integración y despliegue continuo.
- EC2 con Docker Compose aprovecha la capa gratuita de AWS, eliminando costos de orquestación gestionada durante el período académico.

### Negativas / Riesgos

- Requiere aprendizaje inicial de Docker y administración básica de instancias EC2.
- Incrementa complejidad frente a ejecución completamente local sin contenedores.
- La base de datos corre en el mismo host que la aplicación; en producción real se recomendaría migrar a RDS para separación de responsabilidades y backups gestionados.
- Configuraciones incorrectas del Security Group pueden afectar despliegue y seguridad.

---

## Alternativas consideradas

### 1. AWS Lightsail Containers

Se consideró inicialmente por su interfaz simplificada para despliegue de contenedores. Fue descartado debido a su modelo de facturación continua por contenedor activo, que genera costos que superan el presupuesto académico del proyecto incluso en períodos de bajo uso.

### 2. Uso de Kubernetes o Amazon ECS

Se evaluaron soluciones de orquestación avanzada de contenedores. Sin embargo, estas alternativas fueron descartadas debido a la complejidad operacional adicional y porque exceden las necesidades actuales del MVP académico.

### 3. Ejecución local sin contenedores

Se consideró ejecutar directamente frontend y backend sobre entornos locales sin Docker. Esta alternativa fue descartada debido al riesgo de inconsistencias entre ambientes y dificultades para garantizar reproducibilidad del sistema.

---

# ADR-005: Adoptar Prisma ORM como capa de acceso a datos

## Estado

Accepted

---

## Contexto

El backend del sistema Home-Health requiere una capa de acceso a datos sobre PostgreSQL que cumpla con tres requisitos no negociables:

1. **Type-safety end-to-end** entre TypeScript y la base de datos, evitando errores de mapeo entre columnas y campos que solo se detectan en runtime.
2. **Migraciones versionables** que permitan al equipo evolucionar el esquema de manera reproducible entre ambientes (dev, staging, producción).
3. **Buen soporte de transacciones** para operaciones críticas del dominio farmacéutico, especialmente la transición `Pendiente → En preparación` que debe descontar stock en la misma transacción.

Las dos alternativas principales en el ecosistema NestJS + TypeScript son **Prisma** y **TypeORM**. Bass, Clements & Kazman (2021) en *Software Architecture in Practice* recomiendan que las decisiones sobre ORM se evalúen contra **atributos de calidad** específicos: *modifiability*, *testability* y *deployability*, en lugar de preferencias estilísticas del equipo.

---

## Decisión

Se adopta **Prisma ORM (v5.x)** como capa de acceso a datos del backend.

Razones específicas:

- **Schema declarativo único** (`schema.prisma`) que actúa como fuente de verdad y genera tipos TypeScript automáticamente, eliminando duplicación entre `entities` y modelos de base de datos.
- **`prisma migrate`** ofrece migraciones declarativas con rollback, versionadas en git, ejecutables en CI/CD sin scripts manuales.
- **API explícita y fluida** (`prisma.order.create({ data, include })`) reduce el riesgo de queries N+1 frente a TypeORM, donde las relaciones lazy/eager se configuran a nivel de entidad y son propensas a sobre-cargar resultados.
- **Soporte transaccional de primera clase** con `prisma.$transaction([...])` para operaciones atómicas, requerido por reglas como RN02 (stock nunca negativo) y RN01 (no retroceder estados de pedido).
- **Velocidad de desarrollo medida**: estudios empíricos del ecosistema (Prisma Data Platform Report 2024) reportan reducción del 30-40% en tiempo de implementación de capas de datos comparado con TypeORM en proyectos similares.

---

## Consecuencias

### Positivas

- Eliminación de la divergencia entre modelo de dominio y modelo persistente.
- Migraciones reproducibles y revisables en pull requests.
- Tipos generados en tiempo de build previenen errores de runtime.
- Transacciones explícitas mejoran legibilidad del código crítico.
- Reducción de boilerplate frente a TypeORM (decoradores en entidades + DTOs).

### Negativas / Riesgos

- Acoplamiento al cliente de Prisma; salir de Prisma requeriría reescribir queries.
- El runtime de Prisma incluye un binario Rust (`query-engine`) que añade ~20MB al contenedor.
- Soporte para casos avanzados (raw SQL, particionado, replicación) es más limitado que TypeORM.
- Curva de aprendizaje del DSL `schema.prisma` para miembros nuevos.

---

## Alternativas consideradas

### 1. TypeORM

Maduro y con amplia adopción en NestJS, pero los decoradores `@Entity` esparcen el esquema en múltiples archivos, las relaciones lazy/eager son fuente común de bugs N+1 y el ecosistema de migraciones es menos disciplinado. Descartado por riesgo de mantenibilidad a mediano plazo.

### 2. Drizzle ORM

Excelente type-safety pero el ecosistema es más joven (2024+) y las integraciones con NestJS aún son comunitarias, no oficiales. Descartado por madurez insuficiente para un proyecto académico evaluable.

### 3. Knex.js + clase Repository manual

Mayor control pero implica escribir manualmente la capa de tipos, lo cual es contraproducente en un MVP con plazo ajustado. Descartado por costo de oportunidad.

---

# ADR-006: Adoptar Next.js 15 (App Router) como framework frontend

## Estado

Accepted

---

## Contexto

El frontend del sistema requiere:

- Renderizado del lado del servidor (SSR) y generación estática (SSG) para optimizar tiempo a primer byte y SEO en la página pública del catálogo.
- Sistema de rutas que soporte agrupación de layouts (los flujos `(auth)`, `(client)` y `admin` comparten chrome distintos).
- Capacidad de Server Actions y Server Components para reducir el JavaScript enviado al cliente.
- Compatibilidad con el ecosistema React 19 y Tailwind CSS 4.
- Soporte de despliegue contenedorizado en AWS (no atado a Vercel).

Fowler (2018) en *Patterns of Enterprise Application Architecture* y Richardson (2018) en *Microservices Patterns* enfatizan que la elección del framework frontend debe alinearse con la **estrategia de composición de UI** del producto: en proyectos con UI rica, dashboards y formularios complejos, los frameworks meta (Next.js, Nuxt, Remix) reducen el costo arquitectónico de decisiones que de otra manera quedarían dispersas.

---

## Decisión

Se adopta **Next.js 15 con App Router** y React 19 como framework frontend.

Características clave aprovechadas:

- **App Router con grupos de rutas** (`(auth)`, `(client)`, `admin`) que mapean naturalmente a los tres layouts del producto.
- **React Server Components** para listados pesados (catálogo, tabla de productos admin) reduciendo bundle del cliente.
- **Middleware de autenticación** ejecutado en el edge para proteger rutas `/admin/*` sin viajar al backend en cada navegación.
- **Built-in image optimization** para fotos de productos del catálogo.
- **Build estático** del catálogo público (regenerado on-demand mediante revalidate).

---

## Consecuencias

### Positivas

- Reducción significativa del JavaScript del cliente vs SPA pura.
- Separación natural entre layouts por rol mediante grupos de rutas.
- Excelente experiencia de desarrollo (HMR, error overlay, type-safety con TypeScript).
- Imágenes optimizadas automáticamente para diferentes viewports.
- Compatible con despliegue en contenedor Docker (no requiere infraestructura propietaria).

### Negativas / Riesgos

- Next.js 15 es una versión reciente; algunos paquetes del ecosistema React (especialmente librerías UI) pueden tener incompatibilidades temporales.
- La curva de aprendizaje de Server Components vs Client Components requiere disciplina del equipo para evitar enviar lógica innecesaria al cliente.
- El build time crece con el número de rutas estáticas; en escala mayor requeriría incremental static regeneration.

---

## Alternativas consideradas

### 1. Vite + React Router 6

Ligero y rápido, pero exige construir manualmente SSR, generación estática, middleware de auth y optimización de imágenes. Costoso para el alcance del MVP.

### 2. Remix

Excelente filosofía de loaders/actions, pero menor madurez del ecosistema de UI y experiencia del equipo con Remix es nula. Descartado por riesgo de adopción.

### 3. Angular

Maduro y completo, pero más opinado y con curva de aprendizaje superior; el equipo ya tiene experiencia con React.

---

# ADR-007: Aplicar patrones Strategy y State en el dominio

## Estado

Accepted

---

## Contexto

Dos áreas del dominio Home-Health presentan **variabilidad de comportamiento** que tiende a degenerar en condicionales anidados (`if/else` o `switch`) si no se aborda con un patrón explícito:

1. **Estados del pedido**: un `Order` puede estar en `Pendiente | En preparación | En camino | Entregado | Rechazado` y cada estado define qué transiciones son válidas, qué acciones puede ejecutar el admin y qué efectos secundarios genera (ej. `Pendiente → En preparación` descuenta stock).
2. **Tipos de reporte**: el admin puede generar reportes de `Ventas | Inventario | Productos top` y exportarlos en `PDF | Excel | CSV`. Cada combinación tiene su propio query, columnas y formato.

Gamma et al. (1994) en *Design Patterns: Elements of Reusable Object-Oriented Software* describen ambos patrones explícitamente: **State** para encapsular el comportamiento dependiente del estado del objeto y **Strategy** para parametrizar algoritmos intercambiables.

---

## Decisión

### Patrón State para `OrderStatus`

Se modela cada estado del pedido como una clase que implementa la interfaz `IOrderState`, con métodos `canTransitionTo(next)`, `onEnter(order)` y `onExit(order)`. La máquina de transiciones se centraliza en `lib/order-status-machine.ts` y es la única fuente de verdad para las reglas RN01 y RN02.

### Patrón Strategy para reportes

Cada tipo de reporte implementa la interfaz `IReportStrategy<T>` con métodos `generate(filters)` y `columns`. El controlador de reportes selecciona la estrategia en runtime según el parámetro `type`, y un segundo nivel de Strategy elige el `IExportFormatter` (PdfFormatter, ExcelFormatter, CsvFormatter).

---

## Consecuencias

### Positivas

- Cumplimiento explícito del **Open/Closed Principle**: agregar un nuevo estado o un nuevo tipo de reporte no modifica el código existente, solo agrega una clase.
- Las reglas de negocio quedan localizadas y testeables unitariamente.
- Reduce ciclomatic complexity de los servicios `OrderService` y `ReportService`.

### Negativas / Riesgos

- Mayor número de archivos (una clase por estado, una clase por strategy).
- Riesgo de sobre-ingeniería si el dominio nunca crece: para 2 estados y 1 tipo de reporte el patrón es excesivo.

---

## Alternativas consideradas

### 1. Switch / if-else explícito

Más simple inicialmente pero crece linealmente con cada nuevo estado o reporte, violando OCP.

### 2. Tabla de transición como objeto literal

Funciona para State trivial pero no permite encapsular efectos secundarios (descuento de stock, emisión de notificaciones).

---

# ADR-008: Definir estrategia de pruebas en tres niveles

## Estado

Accepted

---

## Contexto

El profesor observó ausencia de estrategia de pruebas en la primera entrega. Bass et al. (2021) clasifican *testability* como uno de los atributos de calidad de mayor impacto a largo plazo. Sin una estrategia explícita el equipo cae en pruebas ad-hoc, baja cobertura crítica y degradación silenciosa.

---

## Decisión

Se adopta la **pirámide de pruebas de Cohn (2009)** con tres niveles:

| Nivel | Framework         | Cobertura objetivo                                              | Responsabilidad |
| :---- | :---------------- | :-------------------------------------------------------------- | :-------------- |
| **Unit**        | Jest (backend), Vitest (frontend) | **70%** sobre servicios, máquinas de estado, strategies, validators. | Desarrollador  |
| **Integration** | Jest + Supertest + Testcontainers (PostgreSQL real)              | **40%** sobre endpoints REST críticos (auth, orders, inventory).      | Desarrollador  |
| **E2E**         | Playwright (frontend completo contra backend real en Docker)     | Los **7 flujos** del walking skeleton.                               | QA / dev rotativo |

Se establece pipeline en GitHub Actions que ejecuta los tres niveles en cada PR. Una PR no puede mezclarse a `main` sin verde en los tres niveles.

---

## Consecuencias

### Positivas

- Defectos en lógica de dominio se detectan en unit tests (rápido feedback).
- Defectos de integración (contratos API, queries Prisma) se detectan antes de despliegue.
- Flujos críticos protegidos por E2E que ejercitan todo el stack.

### Negativas / Riesgos

- Inversión inicial de tiempo en setup de Testcontainers y Playwright.
- Tests E2E lentos requieren paralelización para no bloquear PRs.
- Mantenimiento de fixtures y data factories requiere disciplina.

---

# ADR-009: Implementar observabilidad básica con logging estructurado

## Estado

Accepted

---

## Contexto

El sistema desplegado en AWS EC2 no tiene visibilidad nativa de qué ocurre en producción. Una falla en un endpoint, una transacción que se queda colgada o un stock que queda inconsistente pueden permanecer ocultos hasta que un usuario reporta el problema.

Richardson (2018) en *Microservices Patterns* enfatiza que la observabilidad es un **prerrequisito de despliegue en producción**, no una característica opcional. Aunque Home-Health no es un sistema de microservicios, las mismas prácticas aplican: *structured logging*, *health checks* y *audit trail*.

---

## Decisión

Se implementa observabilidad en tres capas:

1. **Logging estructurado con Pino** (NestJS): cada log incluye `level`, `traceId`, `userId`, `module`, `action`, `payload`. Salida en JSON a stdout, accesible mediante `docker compose logs -f api` en la instancia EC2; para persistencia se pueden redirigir a un archivo o integrar con CloudWatch Logs Agent opcionalmente.
2. **Health checks**: `GET /health` (liveness) y `GET /health/ready` (readiness con check a Postgres). Configurados en la instancia EC2; el endpoint `/health/ready` es verificado por el script de despliegue tras cada `docker compose up`.
3. **Audit trail** en base de datos (ver ADR-011): cada acción crítica (creación/cambio de estado de pedido, ajuste de stock, login admin) genera un registro en la entidad `AuditLog`.

---

## Consecuencias

### Positivas

- Trazabilidad por `traceId` desde request HTTP hasta queries SQL.
- Los logs en stdout son inmediatamente accesibles vía `docker compose logs` sin configuración adicional.
- Audit trail satisface requisitos regulatorios del dominio farmacéutico.

### Negativas / Riesgos

- Sin CloudWatch por defecto, los logs no persisten si el contenedor se reinicia; requiere configuración adicional para retención a largo plazo.
- Logs en JSON son menos legibles directamente; se requiere herramienta o filtros para análisis manual.

---

# ADR-010: Configurar pipeline CI/CD en GitHub Actions

## Estado

Accepted

---

## Contexto

Sin pipeline automatizado las desplegadas dependen de pasos manuales, son frecuentes los olvidos (correr migraciones, hacer build optimizado, taggear imágenes) y se introducen defectos al entorno productivo.

---

## Decisión

Se configura un pipeline con tres etapas en GitHub Actions:

1. **CI** (en cada PR): lint, type-check, unit tests, integration tests con Testcontainers.
2. Build (en push a `main`): validación y construcción de las imágenes Docker del frontend y backend para verificar integridad del despliegue antes de producción.
3. CD (en push a `main` exitoso): despliegue automatizado en la instancia EC2 vía SSH (usando `appleboy/ssh-action`) ejecutando:

`git pull`
`docker compose down`
`docker compose up -d --build`

El despliegue reconstruye localmente las imágenes Docker en la instancia EC2 utilizando el código más reciente del repositorio.

Secretos manejados en GitHub Secrets, no en código.

---

## Consecuencias

### Positivas

- Cero pasos manuales para llegar a producción.
- Cada commit a `main` es desplegable y reproducible.
- Reduce riesgo de divergencia entre ambientes.

### Negativas / Riesgos

- GitHub Actions tiene cuota mensual gratuita; proyecto activo puede agotarla en cuentas free.
- Errores en el pipeline pueden bloquear el flujo del equipo si no hay un *break-glass* manual.
- La clave SSH privada para acceder a EC2 debe manejarse como secreto en GitHub con rotación periódica.

---

# ADR-011: Incorporar entidad AUDIT_LOG y constraints CHECK en el MER

## Estado

Accepted

---

## Contexto

El profesor identificó dos debilidades estructurales en el MER de la primera entrega:

- **Falta de AUDIT_LOG** en un dominio farmacéutico regulado por el Decreto 2200 del Ministerio de Salud (Colombia), que exige trazabilidad de medicamentos y de las personas que ejecutan acciones administrativas.
- **Ausencia de constraints CHECK** que garanticen invariantes a nivel de base de datos: `stock >= 0`, `quantity > 0`, `price >= 0`, `expiration_date > created_at`.

Ambas observaciones son válidas y tienen impacto regulatorio y de integridad de datos.

---

## Decisión

Se incorpora la entidad **AuditLog** al MER con la siguiente estructura:

```
AuditLog
  id           UUID PK
  user_id      UUID FK → User.id
  action       ENUM(CREATE, UPDATE, DELETE, STATE_CHANGE, LOGIN, LOGOUT)
  entity       VARCHAR(50)
  entity_id    UUID
  before_data  JSONB
  after_data   JSONB
  ip_address   INET
  user_agent   VARCHAR
  created_at   TIMESTAMP
```

Se agregan los siguientes constraints CHECK a nivel de base de datos:

- `Product.stock >= 0`
- `Product.price >= 0`
- `OrderItem.quantity > 0`
- `InventoryMovement.quantity > 0`
- `InventoryMovement.resulting_stock >= 0`

Se documentan **índices** explícitos en el MER (ver `MER.md` actualizado): `Product(name)`, `Order(customer_id, status)`, `Order(created_at DESC)`, `InventoryMovement(product_id, created_at DESC)`, `Notification(user_id, read, created_at DESC)`.

---

## Consecuencias

### Positivas

- Cumplimiento de requisito regulatorio del dominio farmacéutico.
- Invariantes garantizadas a nivel de motor de base de datos (defensa en profundidad: no dependen solo del backend).
- Performance de queries críticos asegurado mediante índices.

### Negativas / Riesgos

- Tamaño de la tabla `AuditLog` crece rápido; requiere política de retención o particionado.
- Constraints CHECK pueden generar errores 500 si el backend no los maneja explícitamente; se debe envolver con manejo de errores específico.

---

# ADR-012: Resolver redundancia stock con trigger y transacción

## Estado

Accepted

---

## Contexto

El profesor identificó que `Product.stock` e `InventoryMovement.resulting_stock` mantienen información redundante (el stock actual y el stock resultante de cada movimiento), lo cual viola la regla de **3FN** estricta.

El equipo había justificado la redundancia por performance de lectura (mostrar stock en catálogo sin agregar movimientos), pero no formalizó cómo se mantiene la consistencia.

---

## Decisión

Se mantiene la redundancia controlada y se formaliza la consistencia mediante dos mecanismos complementarios:

### 1. Transacción atómica explícita

Toda operación que modifica stock se ejecuta dentro de `prisma.$transaction([...])` que:

1. Adquiere bloqueo pesimista sobre el producto: `SELECT ... FOR UPDATE`.
2. Calcula nuevo stock: `current_stock ± quantity`.
3. Valida invariante: `nuevo_stock >= 0` (si Salida); aborta con `StockInsuficienteException` si falla.
4. Actualiza `Product.stock` y crea `InventoryMovement` con `resulting_stock` calculado.
5. Inserta registro en `AuditLog`.

### 2. Trigger de verificación nightly

Un job programado mediante el módulo `@nestjs/schedule` (cron integrado en el contenedor `api`) compara cada noche `Product.stock` con la agregación `SUM(entradas) - SUM(salidas)` desde `InventoryMovement`. Si hay discrepancia, genera notificación de auditoría.

---

## Consecuencias

### Positivas

- Stock siempre consistente bajo concurrencia (bloqueo pesimista).
- Lectura de stock en catálogo es O(1) sin agregaciones.
- Detector de inconsistencias actúa como red de seguridad.

### Negativas / Riesgos

- Bloqueo pesimista puede generar contención si múltiples pedidos concurrentes tocan el mismo producto.
- El cron de verificación corre dentro del mismo contenedor `api`; si el contenedor está caído, el job no se ejecuta.

---

## Referencias Bibliográficas (aplicables a todos los ADRs)

- Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
- Richardson, C. (2018). *Microservices Patterns*. Manning.
- Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.
- Cohn, M. (2009). *Succeeding with Agile: Software Development Using Scrum*. Addison-Wesley. (Pirámide de pruebas).
- Brown, S. (2018). *The C4 Model for Visualising Software Architecture*. Leanpub.
- Nygard, M. (2018). *Release It! Design and Deploy Production-Ready Software* (2nd ed.). Pragmatic Bookshelf. (Health checks, observabilidad).
- Ministerio de Salud y Protección Social de Colombia. (2005). *Decreto 2200 de 2005*. (Marco regulatorio del dominio farmacéutico).