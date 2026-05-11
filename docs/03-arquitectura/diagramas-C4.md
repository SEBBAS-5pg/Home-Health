# Diagramas C4 — Home-Health

## Introducción

Este documento presenta los diagramas arquitectónicos del sistema **Home-Health** utilizando el modelo **C4**, permitiendo representar la solución en diferentes niveles de abstracción.

Los diagramas describen:
- el contexto general del sistema,
- la estructura tecnológica de la solución,
- y la organización interna del backend.

La documentación se encuentra alineada con las decisiones arquitectónicas definidas en los ADR del proyecto.

---

# Índice

1. Diagrama de Contexto (C1)
2. Diagrama de Contenedores (C2)
3. Diagrama de Componentes (C3)

---

# 1. Diagrama de Contexto (C1)

## Objetivo

Representar el sistema Home-Health dentro de su entorno general, mostrando usuarios y sistemas externos.

## Diagrama

![Diagrama C1 - Contexto](../imagenes/C4_Nivel1_Contexto.drawio.png)

---

# 2. Diagrama de Contenedores (C2)

## Objetivo

Mostrar los principales contenedores tecnológicos del sistema y su comunicación.

## Diagrama

![Diagrama C2 - Contenedores](../imagenes/C4_Nivel2_Contenedores.drawio.png)

---

# 3. Diagrama de Componentes (C3)

## Objetivo

Representar la organización interna del backend mediante una arquitectura por capas basada en Clean Architecture.

## Diagrama

![Diagrama C3 - Componentes](../imagenes/C4_Nivel3_Componentes.drawio.png)

## Módulos funcionales representados

La arquitectura del backend se encuentra organizada en módulos desacoplados por dominio funcional, incluyendo:

- Authentication
- Users
- Products
- Inventory
- Orders
- Expirations
- Notifications
- Reports

