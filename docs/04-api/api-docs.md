# API Documentation — Home-Health

## Introducción

La API de **Home-Health** está documentada utilizando **Swagger (OpenAPI 3.0)** y expone todos los servicios del sistema de gestión de farmacia.

Permite la gestión de:

- Autenticación y usuarios
- Catálogo de productos
- Inventario y movimientos
- Órdenes de compra
- Notificaciones del sistema
- Reportes
- Estado del sistema

---

## Acceso a la documentación

### Swagger UI (modo desarrollo)

```
http://localhost:4000/docs
```

> Disponible únicamente cuando `NODE_ENV=development`

---

# Servicios de la API

---

## 1. Auth Service

Gestiona autenticación y seguridad del sistema.

### Endpoints:

- `POST /auth/register` → Registro de usuario
- `POST /auth/login` → Inicio de sesión
- `POST /auth/refresh` → Renovación de token JWT
- `POST /auth/forgot-password` → Solicitud de recuperación
- `POST /auth/reset-password` → Restablecimiento de contraseña

### Funcionalidad:
- JWT authentication
- Refresh token rotation
- Seguridad de sesión

---

## 2. Users Service

Gestión de usuarios del sistema.

### Endpoints:

- `GET /users/me` → Perfil del usuario autenticado
- `PATCH /users/me` → Actualización de perfil
- `GET /users` → Listado de usuarios (admin)
- `GET /users/{id}` → Usuario por ID
- `PATCH /users/{id}` → Actualización de usuario

### Funcionalidad:
- Control de roles
- Gestión administrativa de usuarios

---

## 3. Categories Service

Gestión de categorías de productos.

### Endpoints:

- `GET /categories`
- `POST /categories`
- `PATCH /categories/{id}`
- `DELETE /categories/{id}`

### Funcionalidad:
- Clasificación del catálogo farmacéutico

---

## 4. Products Service

Gestión del catálogo de productos.

### Endpoints:

- `GET /products`
- `POST /products`
- `GET /products/{id}`
- `PATCH /products/{id}`
- `DELETE /products/{id}`
- `GET /products/expiring`

### Funcionalidad:
- Control de inventario base
- Productos con fecha de vencimiento
- Validación de stock

---

## 5. Inventory Service

Control de movimientos de inventario.

### Endpoints:

- `GET /inventory/movements`
- `POST /inventory/movements`

### Funcionalidad:
- Registro de entradas y salidas
- Trazabilidad de stock
- Integración con auditoría

---

## 6. Orders Service

Gestión de pedidos de clientes.

### Endpoints:

- `GET /orders`
- `POST /orders`
- `GET /orders/{id}`
- `PATCH /orders/{id}/status`

### Funcionalidad:
- Creación de pedidos
- Máquina de estados (PENDING → DELIVERED)
- Historial de pedidos

---

## 7. Notifications Service

Sistema de notificaciones internas.

### Endpoints:

- `POST /notifications/sync`
- `GET /notifications`
- `PATCH /notifications/{id}/read`
- `PATCH /notifications/read-all`

### Funcionalidad:
- Alertas de stock bajo
- Vencimientos
- Cambios de estado en pedidos

---

## 8. Reports Service

Generación de reportes del sistema.

### Endpoints:

- `GET /reports/{type}`
- `GET /reports/{type}/export`

### Funcionalidad:
- Exportación de datos
- Reportes de ventas, inventario y usuarios

---

## Health Service (Sistema)

Endpoints de monitoreo:

- `GET /health`
- `GET /health/ready`

### Funcionalidad:
- Verificación de estado del backend
- Readiness probe para despliegue

---

# Schemas Documentados

La API incluye DTOs validados mediante class-validator:

- RegisterDto
- LoginDto
- CreateOrderDto
- CreateProductDto
- UpdateProductDto
- CreateMovementDto
- ChangeStatusDto
- CategoryDto
- UpdateUserDto

---

# Seguridad

- Autenticación basada en JWT
- Guards por roles (ADMIN / CLIENT)
- Protección de rutas sensibles
- Refresh token rotation

---

# Observaciones Técnicas

- Arquitectura modular basada en NestJS
- Documentación generada con Swagger (OpenAPI 3.0)
- Validación de DTOs en capa de entrada
- Separación clara entre servicios de dominio

---

# Conclusión

La API de Home-Health cubre completamente los módulos funcionales del sistema:

✔ Autenticación segura  
✔ Gestión de usuarios  
✔ Catálogo de productos  
✔ Control de inventario  
✔ Gestión de pedidos  
✔ Sistema de notificaciones  
✔ Generación de reportes  
✔ Monitoreo del sistema  

