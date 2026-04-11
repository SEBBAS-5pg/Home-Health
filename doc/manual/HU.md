# HU.md (Historias de Usuario)

## Control de Versiones

| Versión | Fecha      | Descripción                                                   | Responsables    |
| :------ | :--------- | :------------------------------------------------------------ | :-------------- |
| 1.0     | 10/04/2026 | Estructura inicial de HUs.                                    | [Sebastian Gol] |
| 1.1     | 11/04/2026 | Inclusión de notificaciones para invitados y formato Gherkin. | [Sebastian Gol] |

---

## 1. Tabla de Historias de Usuario (HU)

| ID       | Como (rol)         | Quiero (objetivo)                                          | Para (beneficio)                                                   | Prioridad | RF/RNF Relacionados |
| :------- | :----------------- | :--------------------------------------------------------- | :----------------------------------------------------------------- | :-------- | :------------------ |
| **HU01** | Usuario Invitado   | Proporcionar mi email y celular en el checkout             | Recibir notificaciones de mi pedido sin estar registrado.          | Alta      | RF01, RNF03         |
| **HU02** | Sistema            | Enviar alertas automáticas al cambiar el estado del pedido | Mantener al cliente informado sobre el despacho y entrega.         | Alta      | RF04, RNF04         |
| **HU03** | Usuario Registrado | Suscribirme a suministros mensuales                        | Automatizar mis compras recurrentes de salud.                      | Alta      | RF02                |
| **HU04** | Usuario Registrado | Congelar mi suscripción activa                             | Pausar entregas y cobros sin perder mi historial de configuración. | Media     | RF02                |
| **HU05** | Admin (Inventario) | Configurar reglas de sustitución                           | No perder ventas cuando el stock de un producto llegue a cero.     | Alta      | RF03, RNF02         |
| **HU06** | Admin (Comercial)  | Visualizar gráficos de ingresos en tiempo real             | Monitorear la salud económica de la farmacia.                      | Media     | RF05                |

---

## 2. Criterios de Aceptación (Formato Gherkin)

### HU01: Notificaciones para Invitados

**Escenario: Registro de datos de contacto en compra anónima**

- **Dado** que un usuario invitado está en la pantalla de "Checkout".
- **Cuando** ingresa sus productos, correo electrónico y número de celular válido.
- **Y** completa el pago exitosamente a través de la pasarela de Stripe.
- **Entonces** el sistema debe asociar el email y celular al registro de la orden en PostgreSQL.
- **Y** enviar un correo inicial de "Confirmación de Compra".

### HU02: Alerta de Pedido Enviado

**Escenario: Notificación automática por cambio de estado**

- **Dado** que existe un pedido con ID `123` y datos de contacto asociados.
- **Cuando** el administrador cambia el estado del pedido a `EN_CAMINO`.
- **Entonces** el **Notification Service** debe disparar un correo electrónico (AWS SES) y un mensaje de texto (AWS SNS).
- **Y** el mensaje debe contener el ID del pedido y un enlace de seguimiento.

### HU05: Sustitución de Producto

**Escenario: Aplicación de Chain of Responsibility por falta de stock**

- **Dado** que un cliente intenta comprar el "Producto A" que tiene `stock: 0`.
- **Cuando** el sistema ejecuta el motor de sustitución.
- **Entonces** debe buscar el "Producto B" con la misma `category_id` y `tags` similares.
- **Y** mostrar al usuario la sugerencia de sustitución antes de procesar el pago.

---

## 3. Matriz de Trazabilidad Técnica

Para asegurar que estas HU se implementen según lo diseñado en la carpeta `Architecture`:

- **Notificaciones:** Se utilizará el **Patrón Observer**. El `OrderService` notificará al `NotificationService` cada vez que el estado cambie.
- **Privacidad:** Los datos de contacto de invitados en `HU01` se manejarán bajo el principio de **Mínimo Privilegio**, usándose solo para el ciclo de vida del pedido.

---

> [!Observaciones] Finales
> La inclusión de **Gherkin** es una excelente práctica de ingeniería, ya que elimina la ambigüedad para el equipo de desarrollo. He configurado la **HU01** y **HU02** para que trabajen en conjunto: una captura los datos y la otra los consume.
>
> Sugiero que en la implementación usemos **AWS SES** para los correos (es muy económico y profesional) y **Twilio o AWS SNS** para los SMS. Esto le dará un peso técnico enorme a tu proyecto frente al docente.
