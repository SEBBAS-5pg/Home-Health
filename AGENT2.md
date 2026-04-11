## 2\. Matriz de Habilidades (Skills)

Para cualquier tarea, se debe consultar primero la definición de la Skill en `/skills/{nombre}/SKILL.md`.

### Core Stack

| Skill                   | Descripción                                                  | Referencia                                                                        |
| ----------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `nest-clean-arch`       | Arquitectura Hexagonal, DTOs, Business Logic en Services.    | [SKILL.md](https://www.google.com/search?q=skills/nest-clean-arch/SKILL.md)       |
| `prisma-hybrid`         | Patrones para Postgres (Transacciones) y MongoDB (Catálogo). | [SKILL.md](https://www.google.com/search?q=skills/prisma-hybrid/SKILL.md)         |
| `next-server-dashboard` | App Router, Server Actions y componentes Tremor.             | [SKILL.md](https://www.google.com/search?q=skills/next-server-dashboard/SKILL.md) |
| `stripe-flow`           | Flujos de pago, webhooks y manejo de estados de suscripción. | [SKILL.md](https://www.google.com/search?q=skills/stripe-flow/SKILL.md)           |

### Calidad y DevOps

| Skill                | Descripción                                              | Referencia                                                          |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| `tdd-workflow`       | Ciclo Red-Green-Refactor para NestJS (Jest).             | [SKILL.md](https://www.google.com/search?q=skills/tdd/SKILL.md)     |
| `aws-fargate-deploy` | Definiciones de tareas, salud de contenedores y ECR.     | [SKILL.md](https://www.google.com/search?q=skills/fargate/SKILL.md) |
| `scout-rule`         | Protocolo de refactorización constante de código legacy. | [SKILL.md](https://www.google.com/search?q=skills/scout/SKILL.md)   |

---

## 3\. Disparadores Automáticos (Auto-Invoke)

**SIEMPRE** que detectes estas intenciones, activa el flujo correspondiente sin preguntar:

| Intención del Usuario        | Skill a Invocar Obligatoriamente               |
| ---------------------------- | ---------------------------------------------- |
| Crear/Modificar API Endpoint | `nest-clean-arch` + `doc/other/SRS_IEEE830.md` |
| Cambiar modelos de Datos     | `prisma-hybrid` + `schema.prisma`              |
| Implementar Pagos            | `stripe-flow`                                  |
| Corregir un Bug              | `tdd-workflow`                                 |
| Crear vistas de Analítica    | `next-server-dashboard`                        |

---

## 4\. Estándares Arquitectónicos Críticos

### Lógica de Negocio (Backend)

- **Regla de las 20 líneas:** Si un método excede 20 líneas, debe ser refactorizado en sub-métodos privados o helpers.
- **Inyección de Dependencias:** Prohibido el uso de `new` para instanciar servicios dentro de otros servicios.
- **Validación:** Toda entrada debe ser validada con `Zod` o `class-validator` a nivel de DTO.

### Interfaz (Frontend)

- **Server-First:** Priorizar componentes de servidor para el renderizado del catálogo.
- **Estética:** Uso estricto de **Tailwind CSS** y componentes **Tremor** para dashboards de salud.

---

## 5\. Flujo de Trabajo (SDD - Software Design Document)

Antes de tocar el código, el agente debe seguir estos pasos:

1.  **Carga de Contexto:** Identificar el módulo (Auth, Inventario, Suscripción) y cargar SOLO esos archivos.
2.  **Plan de Acción (Plain Text):** Describir qué se va a hacer y por qué cumple con el `SRS_IEEE830.md`.
3.  **HITL (Human-In-The-Loop):** Esperar la confirmación del usuario antes de proceder.
4.  **Implementación y Limpieza:** Aplicar el cambio y limpiar código adyacente (Regla del Scout).

---

## 6\. Project Overview (Quick Look)

| Componente  | Ubicación    | Stack                                          |
| ----------- | ------------ | ---------------------------------------------- |
| Backend API | `/src/api`   | NestJS + Prisma                                |
| Frontend UI | `/src/app`   | Next.js 15 + Tremor                            |
| Database    | `n/a`        | PostgreSQL (Relacional) / MongoDB (Documental) |
| Infra       | `/terraform` | AWS Fargate (ECS)                              |

---

**Nota:** El exceso de contexto es el enemigo. Si estás trabajando en el motor de stock, ignora los estilos de la UI. Sé preciso, sé eficiente.
