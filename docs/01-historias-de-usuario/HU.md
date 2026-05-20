# Historias de Usuario — Home-Health

## Control de Versiones

| Versión | Fecha      | Descripción                                                                                                                                     | Responsables                                      |
| :------ | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ |
| 1.0     | 01/05/2026 | Levantamiento inicial de necesidades de usuarios y definición de historias de usuario.                                                          | Sebastian Puentes, Karina Cantillo, Danay Pereira |
| 1.1     | 09/05/2026 | Refinamiento de historias de usuario, criterios de aceptación y reorganización de módulos funcionales.                                          | Sebastian Puentes, Karina Cantillo, Danay Pereira |
| 1.2     | 10/05/2026 | Ajuste de reglas de negocio, refinamiento del flujo de pedidos y alineación de historias de usuario con el modelo de dominio y la arquitectura. | Sebastian Puentes, Karina Cantillo, Danay Pereira |
| 2.0     | 12/05/2026 | Adición de HU15, HU16 y HU18 (admin edita perfil, cancelar pedido, exportar reportes) y HU19-HU22 técnicas/spike. Story points en escala Fibonacci, asignación a sprint y matriz de trazabilidad HU↔Módulo↔Endpoint↔MER. | Sebastian Puentes, Karina Cantillo, Danay Pereira |
| 2.1     | 20/05/2026 | Se retira del alcance del MVP la recuperación de contraseña por correo (HU17) por dependencia de un servicio de correo transaccional externo. La recuperación de acceso se gestiona manualmente por el administrador. | Sebastian Puentes, Karina Cantillo, Danay Pereira |

---

## Marco Conceptual

Las Historias de Usuario siguen el formato propuesto por **Mike Cohn (2004)** en *User Stories Applied*: *"Como [rol], quiero [objetivo] para [beneficio]"*. Los criterios de aceptación se redactan en **Gherkin** (Dado/Cuando/Entonces) siguiendo la práctica de **Behaviour-Driven Development** introducida por **Dan North (2006)**.

Cada HU incluye:

- **ID y rol responsable**.
- **Story points** estimados en escala **Fibonacci modificada** (1, 2, 3, 5, 8, 13) según Cohn (2005), *Agile Estimating and Planning*.
- **Sprint asignado** según el plan de releases del Story Map.
- **Categoría MoSCoW** y **prioridad operacional**.
- **Trazabilidad** al módulo de software, al endpoint REST y a la(s) entidad(es) del MER.

---

## 1. Roles del sistema

| Rol               | Descripción                                                                                                          |
| :---------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Administrador** | Personal autorizado de la farmacia. Creado mediante seed inicial. Gestiona productos, inventario, pedidos y reportes.|
| **Cliente**       | Usuario registrado desde la plataforma. Consulta el catálogo y registra solicitudes de pedidos.                     |

---

## 2. Tabla de Historias de Usuario

### 2.1 Historias funcionales (HU01–HU18)

| ID       | Como (rol)              | Quiero (objetivo)                                                                                              | Para (beneficio)                                                                  | SP | Sprint | MoSCoW    | Prioridad |
| :------- | :---------------------- | :------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :-: | :----: | :-------- | :-------- |
| **HU01** | Cliente                 | Registrarme con nombre, correo, teléfono y contraseña                                                          | Tener una cuenta y realizar pedidos.                                              | 5  | 1      | Must      | Alta      |
| **HU02** | Cliente / Admin         | Iniciar sesión con correo y contraseña                                                                          | Acceder al rol correspondiente.                                                   | 5  | 1      | Must      | Alta      |
| **HU03** | Cliente / Admin         | Cerrar sesión desde cualquier vista                                                                            | Proteger mi cuenta al terminar.                                                   | 2  | 2      | Should    | Alta      |
| **HU04** | Cliente                 | Ver y editar mis datos de perfil (nombre y teléfono)                                                           | Mantener mis datos al día.                                                        | 3  | 2      | Could     | Media     |
| **HU05** | Administrador           | Listar usuarios registrados con filtros por rol                                                                | Control y visibilidad.                                                            | 3  | 2      | Could     | Media     |
| **HU06** | Cliente                 | Explorar el catálogo de productos                                                                              | Encontrar y comparar medicamentos.                                                | 3  | 1      | Must      | Alta      |
| **HU07** | Administrador           | Crear, editar y eliminar productos del catálogo                                                                | Mantener catálogo actualizado.                                                    | 5  | 1      | Must      | Alta      |
| **HU08** | Administrador           | Registrar movimientos de inventario (entradas y salidas)                                                       | Historial preciso del stock.                                                      | 5  | 2      | Should    | Alta      |
| **HU09** | Cliente                 | Confirmar pedido seleccionando productos y dirección de entrega                                                 | Que la farmacia procese mi solicitud.                                             | 8  | 1      | Must      | Alta      |
| **HU10** | Cliente                 | Ver historial de mis pedidos con estado actual                                                                 | Hacer seguimiento.                                                                | 3  | 1      | Must      | Alta      |
| **HU11** | Administrador           | Gestionar todos los pedidos y cambiar su estado                                                                 | Operar el ciclo de despacho.                                                      | 8  | 1      | Must      | Alta      |
| **HU12** | Administrador           | Ver productos con vencimiento ≤30 días                                                                          | Actuar antes de pérdidas.                                                         | 5  | 2      | Should    | Alta      |
| **HU13** | Administrador           | Generar reportes de inventario y pedidos por periodo                                                            | Información consolidada para decisiones.                                          | 5  | 3      | Could     | Media     |
| **HU14** | Administrador           | Recibir notificaciones sobre stock bajo, vencimientos y nuevos pedidos                                          | Estar informado sin revisar cada módulo.                                          | 5  | 2      | Should    | Alta      |
| **HU15** | Administrador           | Editar el perfil de cualquier usuario (nombre, teléfono, rol, estado activo/inactivo)                          | Soporte y corrección de datos por el área administrativa.                         | 3  | 3      | Could     | Media     |
| **HU16** | Cliente                 | Cancelar un pedido propio en estado "Pendiente"                                                                 | Reducir fricción y carga al admin cuando me arrepiento del pedido.                | 3  | 2      | Should    | Media     |
| **HU18** | Administrador           | Exportar reportes en formato PDF, Excel (.xlsx) y CSV                                                           | Integrar reportes con flujos contables externos.                                  | 5  | 3      | Could     | Media     |

### 2.2 Historias técnicas y spikes (HU19–HU22)

Las **HU técnicas** y **spikes** son aquellas que no aportan valor directo al usuario final pero son necesarias para reducir incertidumbre técnica o construir habilitadores arquitectónicos (Cohn, 2009).

| ID       | Tipo   | Como (rol)        | Quiero (objetivo)                                                                                          | Para (beneficio)                                                       | SP | Sprint | Prioridad |
| :------- | :----- | :---------------- | :--------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- | :-: | :----: | :-------- |
| **HU19** | Spike  | Equipo dev        | Investigar e implementar prueba de concepto de autenticación JWT con NestJS Guards y refresh tokens        | Reducir incertidumbre técnica antes del Sprint 1.                      | 3  | 0      | Alta      |
| **HU20** | Spike  | Equipo dev        | Investigar upload de imágenes de productos vía presigned URLs de S3                                        | Validar costo y latencia antes de exponerlo al usuario.                | 3  | 0      | Media     |
| **HU21** | Técnica| Equipo dev        | Configurar pipeline CI/CD en GitHub Actions con lint + tests + build + push a Lightsail Container Registry | Habilitar despliegues automatizados desde el primer commit.            | 2  | 0      | Alta      |
| **HU22** | Técnica| Equipo dev        | Implementar logging estructurado con Pino y health checks (`/health`, `/health/ready`)                     | Tener observabilidad mínima antes de la sustentación AWS.              | 3  | 3      | Media     |

**Total story points del proyecto**: **87 SP** distribuidos en Sprint 0 (8 SP) + Sprint 1 (37 SP) + Sprint 2 (26 SP) + Sprint 3 (16 SP).

---

## 3. Criterios de Aceptación

### HU01 — Registro de usuario

```gherkin
Escenario: Registro exitoso
  Dado que el usuario está en la pantalla de registro (/register)
  Cuando completa los campos nombre completo, correo electrónico, teléfono, contraseña y confirmación de contraseña
  Y hace clic en el botón "Crear cuenta"
  Entonces el sistema crea la cuenta asignando el rol "cliente" por defecto
  Y almacena la contraseña encriptada
  Y redirige al usuario a /login
  Y muestra el mensaje "Cuenta creada exitosamente"

Escenario: Correo ya registrado
  Dado que el usuario completa el formulario de registro en /register
  Cuando ingresa un correo electrónico que ya existe en la base de datos
  Y hace clic en "Crear cuenta"
  Entonces el sistema muestra el mensaje "El correo ya está registrado"
  Y no crea ningún registro nuevo

Escenario: Las contraseñas no coinciden
  Dado que el usuario completa el formulario de registro
  Cuando ingresa valores distintos en los campos "contraseña" y "confirmar contraseña"
  Y hace clic en "Crear cuenta"
  Entonces el sistema muestra el mensaje "Las contraseñas no coinciden"
  Y mantiene el formulario visible para corrección

Escenario: Contraseña muy corta
  Dado que el usuario completa el formulario de registro
  Cuando ingresa una contraseña con menos de 8 caracteres
  Y hace clic en "Crear cuenta"
  Entonces el sistema muestra el mensaje "La contraseña debe tener mínimo 8 caracteres"
  Y no crea la cuenta

Escenario: Campo obligatorio vacío
  Dado que el usuario está en el formulario de registro
  Cuando deja uno o más campos obligatorios sin completar
  Y hace clic en "Crear cuenta"
  Entonces el sistema resalta los campos vacíos
  Y muestra el mensaje "Todos los campos son obligatorios"
```

---

### HU02 — Inicio de sesión

```gherkin
Escenario: Login exitoso como cliente
  Dado que el usuario tiene una cuenta activa con rol "cliente"
  Y se encuentra en la pantalla de inicio de sesión (/login)
  Cuando ingresa su correo electrónico y contraseña correctos
  Y hace clic en "Iniciar sesión"
  Entonces el sistema valida las credenciales
  Y genera un token JWT con el rol "cliente" embebido
  Y redirige al usuario a /catalog

Escenario: Login exitoso como administrador
  Dado que existe una cuenta con rol "administrador" creada por seed inicial
  Y el administrador se encuentra en /login
  Cuando ingresa su correo electrónico y contraseña correctos
  Y hace clic en "Iniciar sesión"
  Entonces el sistema genera un token JWT con el rol "administrador" embebido
  Y redirige al usuario a /admin/dashboard

Escenario: Credenciales incorrectas
  Dado que el usuario se encuentra en /login
  Cuando ingresa un correo no registrado o una contraseña incorrecta
  Y hace clic en "Iniciar sesión"
  Entonces el sistema muestra el mensaje "Correo o contraseña incorrectos"
  Y no genera ningún token
  Y no redirige al usuario

Escenario: Campos vacíos en el formulario de login
  Dado que el usuario se encuentra en /login
  Cuando deja el campo correo o contraseña vacío
  Y hace clic en "Iniciar sesión"
  Entonces el sistema resalta el campo vacío
  Y muestra el mensaje "Todos los campos son obligatorios"
```

---

### HU03 — Cierre de sesión

```gherkin
Escenario: Cierre de sesión exitoso
  Dado que el usuario está autenticado y se encuentra en cualquier vista del sistema
  Cuando hace clic en el botón "Cerrar sesión" ubicado en la barra de navegación
  Entonces el sistema elimina el token JWT del cliente
  Y redirige al usuario a /login

Escenario: Intento de acceso a vista protegida sin sesión activa
  Dado que el usuario ha cerrado sesión
  Cuando intenta acceder directamente a una ruta protegida como /catalog o /admin/dashboard
  Entonces el sistema lo redirige automáticamente a /login
```

---

### HU04 — Gestión de perfil

```gherkin
Escenario: Visualización del perfil
  Dado que el cliente está autenticado
  Cuando accede a /profile
  Entonces el sistema muestra los campos nombre completo, correo electrónico, teléfono y rol
  Y los campos correo electrónico y rol se muestran deshabilitados y no son editables

Escenario: Actualización exitosa de perfil
  Dado que el cliente está en /profile
  Cuando modifica el campo nombre completo o teléfono
  Y hace clic en "Guardar cambios"
  Entonces el sistema actualiza los datos en la base de datos
  Y muestra el mensaje "Perfil actualizado correctamente"

Escenario: Guardar sin realizar cambios
  Dado que el cliente está en /profile
  Cuando no modifica ningún campo
  Y hace clic en "Guardar cambios"
  Entonces el sistema no realiza ninguna operación
  Y muestra el mensaje "No hay cambios para guardar"
```

---

### HU05 — Consulta de usuarios (Administrador)

```gherkin
Escenario: Listado de usuarios registrados
  Dado que el administrador está autenticado
  Cuando accede a /admin/users
  Entonces el sistema muestra una tabla con los campos nombre completo, correo electrónico, teléfono, rol y fecha de registro de cada usuario

Escenario: Acceso denegado a clientes
  Dado que un usuario con rol "cliente" intenta acceder a /admin/users directamente
  Entonces el sistema retorna un error HTTP 403
  Y muestra el mensaje "No tienes permisos para acceder a esta sección"
```

---

### HU06 — Consulta del catálogo

```gherkin
Escenario: Visualización del catálogo completo
  Dado que el cliente está autenticado
  Cuando accede a /catalog
  Entonces el sistema muestra todos los productos con stock mayor a 0
  Y cada tarjeta de producto muestra nombre, categoría, descripción, precio unitario y stock disponible

Escenario: Filtro por categoría
  Dado que el cliente está en /catalog
  Cuando selecciona una categoría desde el selector desplegable
  Entonces el sistema muestra únicamente los productos que pertenecen a esa categoría

Escenario: Búsqueda por nombre de producto
  Dado que el cliente está en /catalog
  Cuando escribe un término en el campo de búsqueda
  Entonces el sistema muestra los productos cuyo nombre contenga el término ingresado
  Y si no hay coincidencias muestra el mensaje "No se encontraron productos con ese nombre"

Escenario: Producto sin stock no visible para el cliente
  Dado que un producto tiene stock igual a 0
  Cuando el cliente accede a /catalog
  Entonces ese producto no aparece en el listado
```

---

### HU07 — Gestión de productos (Administrador)

```gherkin
Escenario: Creación exitosa de producto
  Dado que el administrador está en /admin/products
  Cuando hace clic en "Nuevo producto"
  Y completa los campos nombre, categoría, descripción, precio unitario, stock inicial y fecha de vencimiento
  Y hace clic en "Guardar"
  Entonces el sistema registra el producto en la base de datos
  Y lo muestra en la tabla del panel de productos
  Y queda visible en /catalog si el stock inicial es mayor a 0

Escenario: Edición de producto existente
  Dado que el administrador está en /admin/products
  Cuando selecciona un producto de la tabla y hace clic en "Editar"
  Y modifica uno o más campos del formulario
  Y hace clic en "Guardar"
  Entonces el sistema actualiza los datos del producto en la base de datos
  Y los cambios se reflejan inmediatamente en /catalog

Escenario: Eliminación de producto
  Dado que el administrador está en /admin/products
  Cuando hace clic en "Eliminar" sobre un producto
  Y confirma la acción en el diálogo "¿Estás seguro de eliminar este producto?"
  Entonces el sistema elimina el producto de la base de datos
  Y deja de mostrarse en el panel y en /catalog

Escenario: Campo obligatorio vacío en el formulario de producto
  Dado que el administrador está en el formulario de creación o edición de producto
  Cuando deja uno o más campos obligatorios sin completar
  Y hace clic en "Guardar"
  Entonces el sistema resalta los campos vacíos
  Y muestra el mensaje "Todos los campos obligatorios deben estar completos"
```

---

### HU08 — Control de stock

```gherkin
Escenario: Registro de entrada de stock
  Dado que el administrador está en /admin/inventory
  Cuando selecciona un producto del listado, elige el tipo "Entrada", ingresa la cantidad y opcionalmente una observación
  Y hace clic en "Registrar"
  Entonces el sistema suma la cantidad ingresada al stock actual del producto
  Y registra el movimiento en el historial con tipo, cantidad, observación, fecha, hora y stock resultante
  Y muestra el mensaje "Movimiento registrado correctamente"

Escenario: Registro de salida de stock con stock suficiente
  Dado que el administrador está en /admin/inventory
  Cuando selecciona un producto, elige el tipo "Salida" e ingresa una cantidad menor o igual al stock actual
  Y hace clic en "Registrar"
  Entonces el sistema descuenta la cantidad del stock actual del producto
  Y registra el movimiento en el historial con tipo, cantidad, observación, fecha, hora y stock resultante

Escenario: Intento de salida con stock insuficiente
  Dado que el administrador está en /admin/inventory
  Cuando selecciona un producto, elige el tipo "Salida" e ingresa una cantidad mayor al stock disponible
  Y hace clic en "Registrar"
  Entonces el sistema muestra el mensaje "Stock insuficiente. Stock actual: [X] unidades"
  Y no realiza ningún cambio en el inventario

Escenario: Visualización del historial de movimientos
  Dado que el administrador está en /admin/inventory
  Entonces el sistema muestra una tabla con el historial de todos los movimientos registrados
  Y cada fila contiene producto, tipo de movimiento, cantidad, observación, fecha y hora, y stock resultante
```

---

### HU09 — Registro de pedido

```gherkin
Escenario: Seleccionar productos para pedido
  Dado que el cliente está autenticado y se encuentra en /catalog
  Cuando selecciona un producto con stock disponible, indica la cantidad deseada
  Y hace clic en "Agregar al carrito"
  Entonces el sistema agrega el producto al resumen temporal del pedido
  Y actualiza el contador del carrito en la barra de navegación

Escenario: Confirmación exitosa de pedido
  Dado que el cliente tiene al menos un producto en el carrito
  Cuando accede a /order/new, ingresa la dirección de entrega
  Y hace clic en "Confirmar pedido"
  Entonces el sistema crea el pedido en la base de datos con estado "Pendiente"
  Y registra cliente, lista de productos con cantidades y precios unitarios, dirección de entrega, y fecha y hora de la solicitud
  Y muestra el mensaje "Tu pedido fue registrado correctamente"
  Y vacía el carrito

Escenario: Intento de agregar producto sin stock
  Dado que un producto tiene stock igual a 0
  Cuando el cliente visualiza ese producto en /catalog
  Entonces el botón "Agregar al carrito" aparece deshabilitado
  Y el producto muestra la etiqueta "No disponible"

Escenario: Confirmar pedido sin ingresar dirección de entrega
  Dado que el cliente está en /order/new con productos en el carrito
  Cuando deja el campo dirección de entrega vacío
  Y hace clic en "Confirmar pedido"
  Entonces el sistema muestra el mensaje "La dirección de entrega es obligatoria"
  Y no registra el pedido
```

---

### HU10 — Seguimiento de pedido

```gherkin
Escenario: Visualización del historial de pedidos
  Dado que el cliente está autenticado
  Cuando accede a /my-orders
  Entonces el sistema muestra todos sus pedidos con número de pedido, fecha de solicitud, productos con cantidades, dirección de entrega y estado actual

Escenario: Estados posibles y flujo de un pedido
  Dado que existe un pedido registrado en el sistema
  Entonces su estado sigue únicamente el flujo: Pendiente → En preparación → En camino → Entregado
  Y puede tener el estado Rechazado si el administrador lo rechaza desde el estado Pendiente

Escenario: Sin pedidos registrados
  Dado que el cliente no ha realizado ningún pedido
  Cuando accede a /my-orders
  Entonces el sistema muestra el mensaje "Aún no tienes pedidos registrados"
```

---

### HU11 — Gestión de pedidos (Administrador)

```gherkin
Escenario: Listado de todos los pedidos
  Dado que el administrador está autenticado
  Cuando accede a /admin/orders
  Entonces el sistema muestra todos los pedidos con número de pedido, nombre del cliente, estado actual y fecha de solicitud

Escenario: Ver detalle de un pedido
  Dado que el administrador está en /admin/orders
  Cuando hace clic en "Ver detalle" sobre un pedido
  Entonces el sistema muestra los productos con cantidades y precios, la dirección de entrega y el historial de cambios de estado con fecha y hora de cada uno

Escenario: Cambio de estado de Pendiente a En preparación con descuento de stock
  Dado que el administrador está en el detalle de un pedido con estado "Pendiente"
  Cuando hace clic en "Cambiar estado" y selecciona "En preparación"
  Entonces el sistema actualiza el estado del pedido a "En preparación"
  Y descuenta del stock la cantidad de cada producto incluido en el pedido
  Y registra la fecha y hora del cambio
  Y genera una notificación interna sobre el cambio de estado

Escenario: Cambio de estado de En preparación a En camino
  Dado que el pedido tiene estado "En preparación"
  Cuando el administrador selecciona "En camino" y confirma el cambio
  Entonces el sistema actualiza el estado del pedido
  Y registra la fecha y hora del cambio

Escenario: Cambio de estado de En camino a Entregado
  Dado que el pedido tiene estado "En camino"
  Cuando el administrador selecciona "Entregado" y confirma el cambio
  Entonces el sistema marca el pedido como finalizado
  Y registra la fecha y hora del cambio

Escenario: Rechazo de pedido desde estado Pendiente
  Dado que el pedido tiene estado "Pendiente"
  Cuando el administrador hace clic en "Rechazar" y confirma la acción
  Entonces el sistema cambia el estado a "Rechazado"
  Y no realiza ningún descuento de stock
  Y registra la fecha y hora del rechazo

Escenario: Intento de retroceder el estado de un pedido
  Dado que un pedido tiene un estado avanzado como "En camino"
  Cuando el administrador intenta asignarle un estado anterior como "Pendiente"
  Entonces el sistema no permite la operación
  Y muestra el mensaje "No es posible retroceder el estado de un pedido"
```

---

### HU12 — Control de fechas de vencimiento

```gherkin
Escenario: Listado de productos próximos a vencer
  Dado que existen productos cuya fecha de vencimiento es igual o menor a 30 días desde la fecha actual
  Cuando el administrador accede a /admin/expiry
  Entonces el sistema muestra esos productos con nombre, categoría, stock actual y fecha de vencimiento
  Y cada uno aparece con la etiqueta "Por vencer"

Escenario: Producto ya vencido
  Dado que la fecha de vencimiento de un producto ya pasó respecto a la fecha actual
  Cuando el administrador accede a /admin/expiry
  Entonces el sistema muestra ese producto con la etiqueta "Vencido"

Escenario: Sin productos por vencer ni vencidos
  Dado que ningún producto cumple las condiciones anteriores
  Cuando el administrador accede a /admin/expiry
  Entonces el sistema muestra el mensaje "No hay productos próximos a vencer ni vencidos en este momento"
```

---

### HU13 — Generación de reportes

```gherkin
Escenario: Generación de reporte de inventario actual
  Dado que el administrador está en /admin/reports
  Cuando selecciona el tipo de reporte "Inventario actual"
  Y hace clic en "Generar reporte"
  Entonces el sistema muestra una tabla con nombre del producto, categoría, stock actual, precio unitario y estado de vencimiento

Escenario: Generación de reporte de pedidos por período
  Dado que el administrador está en /admin/reports
  Cuando selecciona el tipo "Pedidos por período", define una fecha de inicio y una fecha de fin
  Y hace clic en "Generar reporte"
  Entonces el sistema muestra los pedidos del período con número de pedido, nombre del cliente, productos, fecha de solicitud y estado final

Escenario: Exportar reporte en PDF
  Dado que el administrador tiene un reporte generado en pantalla
  Cuando hace clic en "Exportar PDF"
  Entonces el sistema descarga un archivo .pdf con los datos del reporte visualizado

Escenario: Exportar reporte en Excel
  Dado que el administrador tiene un reporte generado en pantalla
  Cuando hace clic en "Exportar Excel"
  Entonces el sistema descarga un archivo .xlsx con los datos del reporte visualizado

Escenario: Rango de fechas inválido
  Dado que el administrador está generando un reporte de pedidos por período
  Cuando ingresa una fecha de fin anterior a la fecha de inicio
  Y hace clic en "Generar reporte"
  Entonces el sistema muestra el mensaje "El rango de fechas no es válido"
  Y no genera ningún reporte
```

---

### HU14 — Centro de notificaciones

```gherkin
Escenario: Notificación automática por stock bajo
  Dado que el stock de un producto cae a 5 unidades o menos como resultado de un movimiento de salida o de la aceptación de un pedido
  Entonces el sistema genera automáticamente una notificación con el mensaje "Stock bajo: [nombre del producto] tiene [X] unidades disponibles"
  Y el ícono de notificaciones en la barra de navegación muestra el contador actualizado

Escenario: Notificación automática por producto vencido
  Dado que existe un producto cuya fecha de vencimiento ya expiró
  Entonces el sistema genera una notificación con el mensaje "Producto vencido: [nombre del producto] venció el [fecha]"
  Y el ícono de notificaciones en la barra de navegación muestra el contador actualizado

Escenario: Notificación automática por nuevo pedido
  Dado que un cliente confirma un nuevo pedido desde /order/new
  Entonces el sistema genera una notificación con el mensaje "Nuevo pedido recibido: Pedido #[número] de [nombre del cliente]"
  Y el ícono de notificaciones en la barra de navegación muestra el contador actualizado

Escenario: Visualización del centro de notificaciones
  Dado que el administrador hace clic en el ícono de notificaciones en la barra de navegación
  Cuando accede a /admin/notifications
  Entonces el sistema muestra todas las notificaciones ordenadas de más reciente a más antigua
  Y las notificaciones no leídas se distinguen visualmente de las leídas mediante un fondo resaltado

Escenario: Marcar notificación como leída
  Dado que el administrador está en /admin/notifications y visualiza una notificación no leída
  Cuando hace clic sobre ella
  Entonces el sistema cambia su estado a "Leída"
  Y actualiza el contador del ícono de notificaciones en la barra de navegación
```

---

### HU15 — Edición de perfil de cualquier usuario (Admin)

```gherkin
Escenario: Edición exitosa del perfil de un usuario
  Dado que el administrador está autenticado y en /admin/users
  Cuando selecciona un usuario y hace clic en "Editar"
  Y modifica nombre, teléfono o rol del usuario
  Y hace clic en "Guardar cambios"
  Entonces el sistema actualiza los datos en la base de datos
  Y registra un AuditLog con before_data y after_data
  Y muestra el mensaje "Usuario actualizado correctamente"

Escenario: Cambio de estado a inactivo
  Dado que el administrador está editando un usuario
  Cuando cambia el estado de "Activo" a "Inactivo"
  Y confirma
  Entonces el sistema marca al usuario como inactivo
  Y el usuario inactivo ya no puede iniciar sesión
  Y se muestra el mensaje "Usuario desactivado"

Escenario: Restricción de cambio de rol del propio admin
  Dado que el administrador edita su propio perfil
  Cuando intenta cambiar su rol de "Administrador" a "Cliente"
  Entonces el sistema muestra el mensaje "No puedes cambiar tu propio rol"
  Y mantiene el rol original
```

---

### HU16 — Cancelación de pedido por el cliente

```gherkin
Escenario: Cancelación exitosa de un pedido pendiente
  Dado que el cliente está en /my-orders
  Y un pedido propio tiene estado "Pendiente"
  Cuando hace clic en "Cancelar pedido"
  Y confirma en el diálogo "¿Estás seguro de cancelar este pedido?"
  Entonces el sistema cambia el estado a "Cancelado"
  Y registra fecha y hora de la cancelación
  Y genera notificación para el administrador
  Y muestra el mensaje "Pedido cancelado correctamente"

Escenario: Intento de cancelar un pedido no cancelable
  Dado que un pedido tiene estado "En preparación", "En camino" o "Entregado"
  Cuando el cliente intenta cancelarlo
  Entonces el botón "Cancelar pedido" aparece deshabilitado
  Y al pasar el cursor se muestra el tooltip "Solo se pueden cancelar pedidos pendientes"

Escenario: Cliente intenta cancelar pedido ajeno
  Dado que un cliente intenta cancelar un pedido que no le pertenece (por manipulación de URL)
  Entonces el sistema retorna error HTTP 403
  Y registra el intento en AuditLog
```

---

### HU18 — Exportación de reportes en múltiples formatos

```gherkin
Escenario: Exportar reporte en PDF
  Dado que el administrador tiene un reporte generado en /admin/reports
  Cuando hace clic en "Exportar PDF"
  Entonces el sistema genera un archivo PDF con el contenido completo del reporte
  Y descarga el archivo con nombre "{tipo}_{YYYYMMDD}.pdf"
  Y el PDF incluye encabezado con logo, fecha de generación y firma del admin

Escenario: Exportar reporte en Excel (.xlsx)
  Dado que el administrador tiene un reporte generado
  Cuando hace clic en "Exportar Excel"
  Entonces el sistema genera un archivo .xlsx con hoja de cálculo formateada
  Y los números numéricos quedan como `number`, las fechas como `date`, los precios con formato moneda COP
  Y descarga el archivo con nombre "{tipo}_{YYYYMMDD}.xlsx"

Escenario: Exportar reporte en CSV
  Dado que el administrador tiene un reporte generado
  Cuando hace clic en "Exportar CSV"
  Entonces el sistema genera un archivo CSV con separador coma y encoding UTF-8 BOM
  Y descarga el archivo con nombre "{tipo}_{YYYYMMDD}.csv"
  Y el archivo es legible directamente desde Excel y Google Sheets

Escenario: Reporte vacío
  Dado que el filtro de un reporte no devuelve filas
  Cuando el admin intenta exportar
  Entonces el sistema muestra el mensaje "El reporte no contiene datos para exportar"
  Y no genera archivo
```

---

# 📊 Matriz de Trazabilidad HU ↔ Módulo ↔ Endpoint ↔ MER

Esta matriz garantiza la **trazabilidad bidireccional** entre las Historias de Usuario, los módulos de software, los endpoints REST del backend y las entidades del Modelo Entidad-Relación. Es indispensable para evaluación, auditoría y mantenimiento futuro del sistema.

| HU       | Módulo          | Endpoints REST involucrados                                  | Entidades MER afectadas                  | Reglas de Negocio |
| :------- | :-------------- | :----------------------------------------------------------- | :--------------------------------------- | :---------------- |
| **HU01** | Auth            | `POST /auth/register`                                        | `User`, `AuditLog`                       | RN05              |
| **HU02** | Auth            | `POST /auth/login`                                           | `User`, `AuditLog`                       | RN05              |
| **HU03** | Auth            | `POST /auth/logout`                                          | `AuditLog`                               | —                 |
| **HU04** | Users           | `GET /users/me`, `PATCH /users/me`                           | `User`, `AuditLog`                       | —                 |
| **HU05** | Users           | `GET /users`, `GET /users?role=...`                          | `User`                                   | RN04              |
| **HU06** | Products        | `GET /products`, `GET /products/:id`                         | `Product`, `Category`                    | RN03              |
| **HU07** | Products        | `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` | `Product`, `Category`, `AuditLog`     | RN04              |
| **HU08** | Inventory       | `POST /inventory/movements`, `GET /inventory/movements`      | `InventoryMovement`, `Product`, `AuditLog` | RN02, RN07     |
| **HU09** | Orders          | `POST /orders`                                               | `Order`, `OrderItem`, `Product`, `AuditLog`, `Notification` | RN02, RN03, RN06 |
| **HU10** | Orders          | `GET /orders/me`, `GET /orders/me/:id`                       | `Order`, `OrderItem`                     | —                 |
| **HU11** | Orders          | `GET /orders`, `PATCH /orders/:id/status`                    | `Order`, `OrderStatusHistory`, `Product`, `InventoryMovement`, `AuditLog`, `Notification` | RN01, RN02, RN04 |
| **HU12** | Expirations     | `GET /products/expiring`, `GET /products/expired`            | `Product`                                | RN06              |
| **HU13** | Reports         | `GET /reports/inventory`, `GET /reports/sales`               | `Product`, `Order`, `OrderItem`, `InventoryMovement` | RN04 |
| **HU14** | Notifications   | `GET /notifications`, `PATCH /notifications/:id/read`        | `Notification`, `User`                   | RN04, RN08        |
| **HU15** | Users           | `PATCH /users/:id`                                           | `User`, `AuditLog`                       | RN04              |
| **HU16** | Orders          | `PATCH /orders/:id/cancel`                                   | `Order`, `OrderStatusHistory`, `AuditLog`, `Notification` | RN01, RN04 |
| **HU18** | Reports         | `GET /reports/:type/export?format=pdf|xlsx|csv`              | `Product`, `Order`, `OrderItem`          | RN04              |
| **HU19** | Spike Auth      | (spike — no produce endpoints permanentes)                   | —                                        | —                 |
| **HU20** | Spike S3        | `POST /products/:id/image` (presigned)                       | `Product`                                | —                 |
| **HU21** | Técnica CI/CD   | (configuración de pipeline)                                  | —                                        | —                 |
| **HU22** | Técnica Obs.    | `GET /health`, `GET /health/ready`                           | —                                        | —                 |

---

# 📌 Reglas de Negocio

| ID    | Regla                                                                                                          |
| :---- | :------------------------------------------------------------------------------------------------------------- |
| RN01  | Un pedido no puede retroceder de estado una vez avanzado en el flujo definido.                                 |
| RN02  | El stock de un producto nunca puede quedar en valores negativos (validado por constraint CHECK y transacción). |
| RN03  | Los productos con stock igual a 0 no deben mostrarse disponibles en el catálogo del cliente.                   |
| RN04  | Solo usuarios con rol administrador pueden gestionar productos, inventario y pedidos.                          |
| RN05  | Las contraseñas de usuarios deben almacenarse cifradas con bcrypt (cost factor ≥ 12).                          |
| RN06  | Los productos vencidos no pueden formar parte de nuevos pedidos.                                               |
| RN07  | El sistema debe registrar trazabilidad completa de movimientos de inventario en `InventoryMovement` y `AuditLog`. |
| RN08  | Las notificaciones del MVP serán visibles únicamente para administradores.                                     |
| RN09  | Toda acción crítica (CRUD de Product, cambio de estado de Order, edición de User, ajuste de stock, login admin) debe quedar registrada en `AuditLog`. |
| RN10  | El cliente solo puede cancelar pedidos cuyo estado sea "Pendiente" y cuyo `customer_id` coincida con su `user_id`. |

---

## Referencias

- **Cohn, M.** (2004). *User Stories Applied: For Agile Software Development*. Addison-Wesley.
- **Cohn, M.** (2005). *Agile Estimating and Planning*. Prentice Hall.
- **Cohn, M.** (2009). *Succeeding with Agile: Software Development Using Scrum*. Addison-Wesley.
- **North, D.** (2006). *Introducing BDD*. Better Software Magazine.
- **Patton, J.** (2014). *User Story Mapping: Discover the Whole Story, Build the Right Product*. O'Reilly Media.