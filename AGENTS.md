# Home-Health Orchestrator Guide

## How to Use This Guide

- Start here for cross-project norms. Home-Health is a monorepo.
- Each component has an `AGENTS.md` file with specific guidelines (e.g., `api/AGENTS.md`, `ui/AGENTS.md`).
- Component docs override this file when guidance conflicts.

## Available Skills

Use these skills for detailed patterns on-demand:

### Generic Skills

| Skill | Description | URL |
| ----- | ----------- | --- |

|

## CRITICAL RULES (PROHIBICIONES)

1. PROHIBIDO: Escribir funciones de más de 20 líneas (Clean Code).
2. PROHIBIDO: Generar código sin consultar los requerimientos en `doc/other/SRS_IEEE830.md`.
3. PROHIBIDO: Mezclar lógica de negocio con controladores. Usa Services y Patrones GoF.
4. REGLA DEL SCOUT: Todo archivo que toques debe quedar más limpio de como lo encontraste.

## WORKFLOW (SDD)

Antes de escribir código, debes:

1. Leer la Skill relevante en `/skills`.
2. Proponer un Plan de Acción en texto plano.
3. Esperar la aprobación del humano (HITL).
4. Ejecutar la implementación siguiendo la Matriz de Trazabilidad.

## ORCHESTRATION

Para tareas específicas, carga el contexto de los archivos en `/skills`. No intentes procesar todo el proyecto a la vez.

## Router Logic

Si el usuario solicita una tarea de Backend, identifica qué módulo es (Auth, Inventario o Suscripción). Carga ÚNICAMENTE la Skill correspondiente y el schema.prisma. No intentes leer archivos de Frontend si estás trabajando en el motor de stock. El exceso de contexto es tu enemigo; la precisión es tu aliada.

## Project Overview

Home-Health es una farmacia web escalable sobre AWS Fargate.

| Component   | Location | Tech Stack                         |
| ----------- | -------- | ---------------------------------- |
| Backend API | `api/`   | NestJS + Prisma                    |
| Frontend UI | `ui/`    | Next.js 15 + Tailwind CSS + Tremor |
