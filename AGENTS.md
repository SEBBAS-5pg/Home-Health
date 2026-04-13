# Home-Health Orchestrator Guide

Este archivo es la fuente de verdad para cualquier agente de IA que trabaje en este repositorio. Define el contexto, las reglas de arquitectura y las capacidades disponibles.

## ORCHESTRATION

Para tareas específicas, carga el contexto de los archivos en `/skills`. No intentes procesar todo el proyecto a la vez.

## How to Use This Guide

- Start here for cross-project norms. Home-Health is a monorepo.
- Each component has an `AGENTS.md` file with specific guidelines (e.g., `api/AGENTS.md`, `ui/AGENTS.md`).
- Component docs override this file when guidance conflicts.

## Guardrail Skills

| Skill                            | Description                                                                              | URL                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Global Compliance Guardrails** | Reglas críticas de cumplimiento, prohibiciones y estándares de calidad para Home-Health. | [SKILL.md](skills/compliance-guardrails/SKILL.md) |
| **Security Secrets Guardrail**   | Protección contra fuga de credenciales y validación de variables de entorno.             | [SKILL.md](skills/security-secrets/SKILL.md)      |

## Generic Skills

| Skill                            | Description                                                               | URL                                           |
| -------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------- |
| **Architecture Clean Standards** | Estándares globales de arquitectura, SOLID y Clean Code para Home-Health. | [SKILL.md](skills/general-standards/SKILL.md) |

## Auto-invoke Skills

when performing these actions, Always invoke the corresponding skill first:

| Action                         | Description                                                                       | Skill                                                |
| ------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Documentation Automation**   | Protocolo para la actualización orgánica y sincronización de la carpeta doc/.     | [SKILL.md](skills/documentation-automation/SKILL.md) |
| **Frontend UI Strategy**       | Estrategia de renderizado Server-First y estándares visuales con Tailwind/Tremor. | [SKILL.md](skills/frontend-ui-strategy/SKILL.md)     |
| **SDD Workflow**               | Protocolo de pensamiento y ejecución basado en Software Design Development (SDD). | [SKILL.md](skills/sdd-workflow/SKILL.md)             |
| **Infrastructure Fargate Ops** | Protocolo de modificación de infraestructura, Docker y AWS Fargate.               | [SKILL.md](skills/infrastructure-fargate/SKILL.md)   |

## Commit & Pull Request Guidelines

Follow conventional-commit style: `<type>[scope]: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

Before creating a PR:

1. Complete checklist in `.github/pull_request_template.md`
2. Run all relevant tests and linters
3. Link screenshots for UI changes

## WORKFLOW (SDD)

Antes de escribir código, debes:

1. Leer la Skill relevante en `/skills`.
2. Proponer un Plan de Acción en texto plano.
3. Esperar la aprobación del humano (HITL).
4. Ejecutar la implementación siguiendo la Matriz de Trazabilidad.

## Router Logic

Si el usuario solicita una tarea de Backend, identifica qué módulo es (Auth, Inventario o Suscripción). Carga ÚNICAMENTE la Skill correspondiente y el schema.prisma. No intentes leer archivos de Frontend si estás trabajando en el motor de stock. El exceso de contexto es tu enemigo; la precisión es tu aliada.

## Project Overview

Home-Health es una farmacia web escalable sobre AWS Fargate.

| Component   | Location | Tech Stack                         |
| ----------- | -------- | ---------------------------------- |
| Backend API | `api/`   | NestJS + Prisma                    |
| Frontend UI | `ui/`    | Next.js 15 + Tailwind CSS + Tremor |

## 📝 5. Fase de Cierre (Session Memory Handover)

Al finalizar la tarea y antes de despedirse, el agente DEBE:

1. **Resumir cambios:** Qué se hizo y por qué (Architectural Decisions).
2. **Actualizar Deuda Técnica:** Si se dejó algo pendiente por falta de tiempo o alcance, anotarlo.
3. **Próximos Pasos:** Sugerir qué debería hacer el siguiente agente que tome el relevo.
4. **Log de Sesión:** (Opcional) Guardar un resumen breve en `doc/session-logs/YYYY-MM-DD-task-name.md`.

> **Propósito:** Evitar que el usuario tenga que re-explicar el contexto en la siguiente sesión.
