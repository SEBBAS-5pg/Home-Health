---
name: documentation-automation
description: Protocolo para la actualización orgánica y sincronización de la carpeta doc/
triggers: "Al finalizar un hito de desarrollo, al modificar el esquema de base de datos o al cambiar el stack tecnológico."
---

# 📝 Skill: Sincronización y Automatización de Documentación

Esta habilidad asegura que la documentación técnica de **Home-Health** sea una "Fuente de Verdad Viva" (Living Documentation).

## 🏗️ 1. Estándares de Formato

Todo archivo dentro de `doc/` debe cumplir:

- **Formato:** Markdown estándar con soporte para **Mermaid.js** para diagramas.
- **Relatividad:** Todos los enlaces entre documentos deben ser relativos (ej: `[Arquitectura](../arc/C4-Model.md)`).
- **Frontmatter:** Los documentos de diseño deben incluir:
  - `status`: [Draft | In-Review | Approved]
  - `last_updated`: YYYY-MM-DD
  - `related_components`: [api, ui, db]
  - `relese_version`: [0.0.0]

## 🧱 2. Matriz de Responsabilidad Documental

El agente debe identificar qué archivo actualizar según la acción realizada:

| Acción Técnica         | Documento a Actualizar  | Ubicación                    |
| :--------------------- | :---------------------- | :--------------------------- |
| Crear nuevo Endpoint   | C4 Model (Componentes)  | `doc/arc/C4-Model.md`        |
| Cambiar Tabla/Campo DB | Modelo Entidad-Relación | `doc/arc/MER-Model.md`       |
| Agregar Librería/SDK   | Stack Tecnológico       | `doc/action-plan/Stak.md`    |
| Cumplir Requerimiento  | Matriz de Trazabilidad  | `doc/manual/trazabilidad.md` |

## 📜 3. Protocolo de Actualización (Flujo Lógico)

1. **Análisis de Impacto:** Antes de confirmar un cambio de código, el agente debe leer el archivo `doc/action-plan/plan.md`.
2. **Drafting:** Si el cambio es estructural, generar un bloque de texto en formato "ADR" (Architecture Decision Record).
3. **Validación:** El agente debe verificar que los nombres de las clases/entidades en la documentación coincidan exactamente con el código generado.

## 🦅 4. Reglas Específicas para Home-Health

- **User Stories:** Si se completa una funcionalidad, marcar como `[DONE]` en `doc/manual/HU.md`.
- **Diagramas:** Si se modifica la relación entre tablas, el agente **debe** actualizar el bloque de código Mermaid en `doc/arc/MER-Model.md`.
- **Clean Docs:** Evitar explicaciones redundantes. Si el código es "Clean Code", la documentación debe explicar el **POR QUÉ**, no el qué.

## ✨ 5. Recomendación de Automatización

- **Conventional Commits:** Usar el prefijo `docs:` para cualquier cambio en esta carpeta.
- **Sync Command:** Si se detecta un desajuste entre `api/src/` y `doc/arc/`, el agente debe notificarlo inmediatamente.
