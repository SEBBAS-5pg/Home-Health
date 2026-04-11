# SKILL: Inventory & Substitution Engine

## CONTEXTO

Control de stock en PostgreSQL y búsqueda de metadatos/relaciones en MongoDB.

## PATRONES APLICADOS

- **Chain of Responsibility:** Para encontrar sustitutos genéricos.
- **Observer:** Para actualizar el estado de "Disponible" en tiempo real.

## LÓGICA DE SUSTITUCIÓN (CADENA)

1. **Eslabón 1 (Directo):** Verificar `stock > 0` en tabla `Inventory`.
2. **Eslabón 2 (Categoría):** Si stock es 0, consultar MongoDB por productos con igual `categoryId` y `active: true`.
3. **Eslabón 3 (Tags):** Si no hay en categoría, buscar por `tags` similares (ej. "Ibuprofeno", "Analgesico").
4. **Eslabón 4 (Fallback):** Notificar `Out of Stock`.

## INTEGRIDAD

- Usar **Optimistic Locking** en Postgres (columna `version`) para prevenir la "Doble Venta" en picos de tráfico.
