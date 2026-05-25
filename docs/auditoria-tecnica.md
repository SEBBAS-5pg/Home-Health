# 📋 Auditoría Técnica y Funcional — Home Health

## Objetivo

Realizar una revisión integral del sistema backend y frontend comparando la implementación actual contra:

- Historias de Usuario (HU)
- Requisitos Funcionales (RF)
- Reglas de Negocio (RN)
- MER y arquitectura definida
- Requisitos de exportación y auditoría

---

# ✅ Hallazgos Generales

El proyecto presenta una buena base arquitectónica:

- Arquitectura modular correcta
- JWT implementado correctamente
- Roles y guards funcionales
- Máquina de estados de pedidos bien estructurada
- Uso de transacciones y `FOR UPDATE`
- DTOs y validaciones básicas presentes
- Reportes y exportadores parcialmente implementados
- Zustand + Axios + App Router correctamente integrados

Sin embargo, existen inconsistencias importantes entre documentación y código, además de problemas críticos de seguridad, integridad de datos, auditoría y UX.

---

# 🔴 Problemas Críticos

---

# 1. Sincronización incorrecta del token JWT (Frontend)

## Problema

El token JWT se almacena en dos lugares distintos:

- Zustand persist (`hh-auth`)
- localStorage (`hh_token`)

Axios usa `hh_token`, pero la store usa `hh-auth`.

## Riesgo

Después de refrescar la página:

- usuario aparentemente logueado
- requests sin Authorization header
- errores 401/403 aleatorios

## Archivos afectados

- `frontend/src/lib/api.ts`
- `frontend/src/store/auth.store.ts`

## Recomendación

Centralizar la autenticación:

- una sola fuente de verdad
- interceptor leyendo desde Zustand
- o sincronización automática segura

## Prioridad

🔴 CRÍTICA

---

# 2. Refresh Tokens no revocables

## Problema

Los refresh tokens:

- no se almacenan
- no se revocan
- no tienen rotación

## Riesgo

Si un refresh token es robado:

- el atacante puede renovar sesión indefinidamente

## Archivo

- `backend/auth/auth.service.ts`

## Recomendación

Implementar:

- refresh token rotation
- almacenamiento hash
- revocación
- logout real

## Prioridad

🔴 CRÍTICA

---

# 3. Número de pedido generado usando count()

## Problema

El número de pedido se genera usando:

```ts
count() + 1
````

## Riesgo

Bajo concurrencia:

* números duplicados
* corrupción lógica
* inconsistencias contables

## Archivo

* `orders.service.ts`

## Recomendación

Usar:

* SEQUENCE de PostgreSQL
* contador atómico
* unique constraint + retry

## Prioridad

🔴 CRÍTICA

---

# 4. Stock puede modificarse sin InventoryMovement

## Problema

`PATCH /products/:id`

permite modificar stock directamente sin:

* InventoryMovement
* AuditLog

## Riesgo

* desincronización inventario
* pérdida de trazabilidad
* incumplimiento RN07

## Archivo

* `products.service.ts`

## Recomendación

Prohibir cambios directos o forzar:

* movimiento de inventario
* audit log
* validación transaccional

## Prioridad

🔴 CRÍTICA

---

# 5. Token de recuperación logueado en texto plano

## Problema

`forgotPassword` imprime el token raw en logs.

## Riesgo

Fuga crítica de credenciales.

## Archivo

* `auth.service.ts`

## Recomendación

Nunca loguear tokens sensibles.

## Prioridad

🔴 CRÍTICA

---

# 🟠 Problemas de Alta Prioridad

---

# 6. AuditLog incompleto

## Problema

Falta auditoría en:

* Product CRUD
* login/logout
* register
* edición usuarios
* exportación reportes

## Impacto

Incumplimiento RN09.

## Recomendación

Centralizar helper:

```ts
createAudit()
```

con:

* beforeData
* afterData
* ip
* userAgent
* traceId

## Prioridad

🟠 ALTA

---

# 7. Throttler mal configurado

## Problema

TTL multiplicado incorrectamente.

## Riesgo

Rate limiting puede no funcionar.

## Archivo

* `app.module.ts`

## Recomendación

Corregir configuración oficial NestJS.

## Prioridad

🟠 ALTA

---

# 8. Constraints del MER no garantizados

## Problema

CHECK constraints definidos en MER no parecen asegurados vía migrations.

Ejemplos:

* stock >= 0
* expiration_date > created_at

## Riesgo

Integridad depende únicamente del backend.

## Recomendación

Aplicar constraints reales en DB.

## Prioridad

🟠 ALTA

---

# 9. Manejo incorrecto de stock y expiración

## Problema

Frontend y backend permiten:

* productos vencidos
* fechas inválidas
* inconsistencias stock

## Recomendación

Validación frontend + backend + DB.

## Prioridad

🟠 ALTA

---

# 🟡 Problemas Medios

---

# 10. UX deficiente en login y errores

## Problema

Errores genéricos o silenciosos:

* login inválido
* usuario inexistente
* stock insuficiente

## Impacto

Confusión del usuario.

## Recomendación

Mostrar errores específicos de negocio.

## Prioridad

🟡 MEDIA

---

# 11. Loading states inexistentes

## Problema

Muchas vistas no muestran loading.

## Impacto

Pantallas vacías y mala experiencia.

## Archivos

* AdminOrders
* AdminProducts
* Reports

## Recomendación

Agregar:

* skeletons
* spinners
* disabled states

## Prioridad

🟡 MEDIA

---

# 12. Exportaciones incompletas

## Problema

HU18 exige:

* logo
* firma admin
* formatos Excel correctos

No implementado completamente.

## Recomendación

Mejorar:

* PDF formatter
* Excel formatter
* tipos monetarios y fechas

## Prioridad

🟡 MEDIA

---

# 13. markAsRead devuelve éxito falso

## Problema

Endpoint responde éxito aunque no actualice filas.

## Riesgo

Falsos positivos UI.

## Recomendación

Devolver:

* 404
* 403
* validación ownership

## Prioridad

🟡 MEDIA

---

# 14. Manejo incorrecto de 401

## Problema

Frontend hace:

```ts
window.location.href
```

## Impacto

Recarga completa SPA.

## Recomendación

Usar logout centralizado + router push.

## Prioridad

🟡 MEDIA

---

# 15. Export button sin implementación

## Problema

Botón Exportar existe pero no hace nada.

## Archivo

* AdminProductsPage

## Prioridad

🟡 MEDIA

---

# ⚪ Problemas Menores

---

# 16. Servicios mezclados en componentes

## Problema

Algunos componentes llaman API directamente.

## Recomendación

Separar:

* UI
* services
* lógica negocio

## Prioridad

⚪ BAJA

---

# 17. Riesgos SSR / hydration

## Problema

Hooks client-only usados en zonas sensibles SSR.

## Recomendación

Revisar boundaries server/client.

## Prioridad

⚪ BAJA

---

# 18. Mejoras accesibilidad

## Problema

Faltan labels y confirmaciones accesibles.

## Prioridad

⚪ BAJA

---

# 📌 Inconsistencias entre documentación y código

---

# Password Reset eliminado pero implementado

## Problema

MER/HU indican eliminación de HU17:

* PasswordResetToken
* forgot-password
* reset-password

Pero el código sí lo implementa.

## Riesgo

Desalineación documentación ↔ código.

## Recomendación

Decidir oficialmente:

* mantener funcionalidad
* o eliminar código/documentación

---

# 📌 Funcionalidades Correctamente Implementadas

---

## ✅ JWT Strategy

* validación correcta
* usuario activo
* integración guards

---

## ✅ Máquina de estados pedidos

* evita retrocesos
* transición centralizada

---

## ✅ Inventory FOR UPDATE

* manejo concurrente correcto

---

## ✅ DTO validations base

* class-validator correctamente usado

---

## ✅ Roles y guards

* arquitectura correcta

---

# 📌 Recomendación de Corrección por Bloques

---

# BLOQUE 1 — Seguridad y autenticación

## Corregir primero

* token sync
* refresh tokens
* throttler
* logout
* logs sensibles

---

# BLOQUE 2 — Pedidos e inventario

## Corregir

* stock
* InventoryMovement
* estados pedidos
* número pedido
* expiración productos

---

# BLOQUE 3 — AuditLog

## Corregir

* Product CRUD
* login/logout
* users
* reportes

---

# BLOQUE 4 — UX Frontend

## Corregir

* mensajes error
* loaders
* validaciones
* feedback usuario

---

# BLOQUE 5 — Exportaciones

## Corregir

* PDF
* Excel
* logo
* firma
* formatos

---

# 📌 Conclusión

El sistema tiene una arquitectura sólida y funcional, pero requiere una etapa importante de estabilización antes de considerarse completamente alineado con:

* HUs
* MER
* reglas de negocio
* requisitos de seguridad
* requisitos de auditoría

Los problemas más críticos se concentran en:

* autenticación
* sincronización de tokens
* integridad del inventario
* trazabilidad
* concurrencia
* seguridad de sesión

La recomendación es corregir el sistema por bloques pequeños y controlados, probando cada cambio antes de avanzar al siguiente.
