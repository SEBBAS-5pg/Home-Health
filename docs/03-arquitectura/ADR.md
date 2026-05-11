# Architecture Decision Records (ADR) — Home-Health

## Introducción

Este documento registra las principales decisiones arquitectónicas tomadas durante el diseño y planificación del sistema **Home-Health**.

Los Architecture Decision Records (ADR) permiten documentar el contexto, las motivaciones técnicas y las consecuencias asociadas a cada decisión relevante de arquitectura adoptada durante el proyecto.

Cada ADR incluye:

- contexto del problema o necesidad,
- decisión arquitectónica adoptada,
- consecuencias técnicas y operativas,
- beneficios esperados,
- riesgos asociados,
- alternativas consideradas.

El objetivo de este documento es mantener trazabilidad arquitectónica, justificar técnicamente las tecnologías y patrones seleccionados, y facilitar la comprensión de la solución propuesta para el desarrollo, despliegue y evolución futura del sistema.

---

# ADR-001: Adoptar Arquitectura Limpia con Monolito Modular

## Estado

Accepted

---

## Contexto

El sistema Home-Health debe soportar múltiples dominios funcionales relacionados con la gestión de farmacias, incluyendo autenticación, catálogo de productos, inventario, pedidos, reportes y notificaciones.

Debido a la naturaleza del proyecto, se requiere una arquitectura que permita mantener separación clara de responsabilidades, bajo acoplamiento entre módulos y facilidad de mantenimiento a medida que el sistema evolucione.

Adicionalmente, el proyecto corresponde a un MVP académico con alcance controlado, por lo que se busca evitar complejidad operacional innecesaria durante las etapas iniciales de desarrollo y despliegue.

Se evaluó la posibilidad de implementar una arquitectura de microservicios; sin embargo, esta aproximación implicaría desafíos adicionales como comunicación distribuida, orquestación de servicios, balanceo de carga, observabilidad y mayor complejidad de infraestructura, aspectos que exceden las necesidades actuales del proyecto.

---

## Decisión

Se decide implementar el backend utilizando una arquitectura basada en principios de Clean Architecture organizada como un monolito modular desacoplado mediante módulos REST en NestJS.

La solución estará estructurada por dominios funcionales independientes, tales como:

- Authentication
- Users
- Products
- Inventory
- Orders
- Expirations
- Notifications
- Reports

Cada módulo encapsulará sus propias responsabilidades utilizando separación por capas, incluyendo:

- Controllers
- Services
- Repositories
- DTOs
- Entities

La arquitectura seguirá principios SOLID y prácticas de Clean Code con el objetivo de mejorar mantenibilidad, reutilización y escalabilidad futura del sistema.

Esta aproximación permite mantener simplicidad de despliegue y desarrollo para el MVP, conservando al mismo tiempo una estructura desacoplada que facilite una posible migración futura hacia arquitecturas distribuidas o microservicios si el crecimiento del dominio lo requiere.

---

## Consecuencias

### Positivas

- Separación clara de responsabilidades entre módulos y capas.
- Mayor mantenibilidad y legibilidad del código.
- Menor complejidad operacional frente a una arquitectura distribuida.
- Desarrollo más rápido y sencillo para el alcance MVP.
- Facilita pruebas unitarias y escalabilidad modular.
- Permite evolución progresiva hacia microservicios en el futuro si es necesario.
- Mejor alineación con principios SOLID y Clean Architecture.

### Negativas / Riesgos

- El sistema continúa desplegándose como una única unidad ejecutable.
- Un fallo crítico podría afectar múltiples módulos del sistema.
- Escalabilidad limitada frente a arquitecturas completamente distribuidas.
- Posible incremento de acoplamiento si no se respetan correctamente los límites entre módulos.
- Requiere disciplina arquitectónica para mantener separación adecuada de responsabilidades.

---

## Alternativas consideradas

### 1. Arquitectura de microservicios

Se consideró dividir el sistema en múltiples servicios independientes por dominio funcional. Esta alternativa fue descartada debido a la complejidad adicional de despliegue, comunicación distribuida, monitoreo y administración de infraestructura, aspectos innecesarios para el alcance actual del MVP.

### 2. Arquitectura monolítica tradicional sin modularización

Se evaluó implementar un monolito sin separación clara por dominios ni capas internas. Esta opción fue descartada debido al riesgo de generar alto acoplamiento, baja mantenibilidad y dificultades de escalabilidad conforme aumente el tamaño del sistema.

### 3. Arquitectura basada únicamente en capas técnicas

Se consideró organizar el sistema exclusivamente por capas globales (controllers, services y repositories compartidos). Sin embargo, esta aproximación fue descartada porque dificulta la separación por dominios funcionales y reduce la cohesión modular del sistema.

---



# ADR-002: Usar PostgreSQL como base de datos relacional principal

## Estado

Accepted

---

## Contexto

El sistema Home-Health requiere administrar información relacionada con usuarios, productos, categorías, inventario, pedidos, vencimientos y notificaciones, manteniendo relaciones estructuradas entre múltiples entidades del dominio.

El proyecto maneja operaciones críticas como procesamiento de pedidos, actualización de stock y control de inventario, las cuales demandan consistencia de datos y validación de reglas de negocio para evitar inconsistencias como stock negativo, pérdida de relaciones o registros incompletos.

Adicionalmente, el modelo de datos del sistema presenta relaciones fuertemente conectadas entre entidades, por ejemplo:

- User → Order
- Order → OrderItem
- Product → InventoryMovement
- Category → Product

Estas relaciones requieren integridad referencial, soporte transaccional y consultas estructuradas para garantizar trazabilidad y confiabilidad de la información.

Se evaluaron alternativas NoSQL como MongoDB y Firebase; sin embargo, dichas soluciones priorizan flexibilidad documental y escalabilidad horizontal sobre consistencia relacional estricta, lo cual no se alinea con las necesidades principales del dominio farmacéutico definido para el MVP.

---

## Decisión

Se decide utilizar PostgreSQL como sistema gestor de base de datos principal para el proyecto Home-Health.

La persistencia será implementada mediante una arquitectura relacional utilizando Prisma ORM como capa de acceso a datos y mapeo entre entidades del dominio y tablas de la base de datos.

El modelo relacional permitirá gestionar:

- relaciones entre entidades mediante claves foráneas,
- integridad referencial,
- validación de restricciones,
- consultas estructuradas,
- control transaccional,
- consistencia de inventario y pedidos.

La arquitectura de persistencia estará alineada con los módulos funcionales definidos en el sistema, permitiendo mantener separación lógica y trazabilidad entre operaciones relacionadas con autenticación, productos, inventario, pedidos, reportes y notificaciones.

Las operaciones críticas, especialmente aquellas relacionadas con actualización de stock y procesamiento de pedidos, deberán ejecutarse de forma transaccional para garantizar integridad de los datos.

---

## Consecuencias

### Positivas

- Garantiza integridad referencial mediante claves foráneas y restricciones relacionales.
- Facilita modelado estructurado del dominio farmacéutico.
- Permite ejecutar transacciones para mantener consistencia en pedidos e inventario.
- Mejora trazabilidad y control de operaciones históricas.
- Facilita generación de reportes mediante consultas SQL agregadas.
- Prisma ORM reduce complejidad de acceso a datos y mejora mantenibilidad.
- Amplia compatibilidad con NestJS, Docker y entornos cloud como AWS.

### Negativas / Riesgos

- Mayor rigidez estructural frente a bases de datos documentales.
- Cambios frecuentes en el modelo pueden requerir migraciones adicionales.
- Escalabilidad horizontal más compleja comparada con algunas soluciones NoSQL.
- Requiere diseño adecuado de relaciones y normalización para evitar degradación de rendimiento.
- Dependencia de una estructura relacional bien definida desde etapas tempranas del proyecto.

---

## Alternativas consideradas

### 1. MongoDB

Se consideró utilizar una base de datos documental debido a su flexibilidad y facilidad para manejar estructuras dinámicas. Sin embargo, esta alternativa fue descartada porque el sistema requiere relaciones consistentes entre entidades, integridad referencial y operaciones transaccionales críticas relacionadas con pedidos e inventario.

### 2. Firebase Firestore

Se evaluó Firebase por su facilidad de integración y despliegue rápido. No obstante, fue descartado debido a limitaciones en consultas relacionales complejas, control transaccional avanzado y modelado estructurado del dominio.

### 3. MySQL

Se consideró utilizar MySQL como alternativa relacional. Aunque cumple con gran parte de los requerimientos del proyecto, se decidió utilizar PostgreSQL debido a sus capacidades avanzadas de integridad, extensibilidad y mejor compatibilidad con algunas funcionalidades modernas utilizadas por Prisma ORM.

---


# ADR-003: Implementar autenticación basada en JWT

## Estado

Accepted

---

## Contexto

El sistema Home-Health requiere controlar el acceso a funcionalidades protegidas relacionadas con gestión de inventario, pedidos, reportes y administración del sistema.

La aplicación contempla múltiples tipos de usuarios, principalmente clientes y administradores, cada uno con diferentes permisos y responsabilidades dentro de la plataforma.

Adicionalmente, la arquitectura propuesta utiliza un frontend desacoplado del backend mediante una API REST, lo que requiere un mecanismo de autenticación compatible con comunicación stateless y consumo desde clientes web modernos.

Se evaluaron mecanismos tradicionales basados en sesiones almacenadas en servidor y autenticación stateful mediante cookies; sin embargo, estas alternativas incrementan el acoplamiento entre cliente y servidor, dificultan escalabilidad horizontal y complejizan el despliegue distribuido de la aplicación.

---

## Decisión

Se decide implementar un sistema de autenticación y autorización basado en JSON Web Tokens (JWT).

El backend generado con NestJS será responsable de:

- validar credenciales de usuarios,
- generar tokens JWT firmados,
- proteger rutas privadas mediante Guards,
- controlar acceso según roles definidos,
- verificar autenticación en cada solicitud protegida.

El token JWT contendrá información mínima necesaria para identificar al usuario autenticado y sus permisos asociados.

La autorización del sistema se basará en roles como:

- ADMIN
- CLIENT

Las credenciales de usuarios serán almacenadas utilizando algoritmos de hashing seguro y nunca se expondrá información sensible dentro de las respuestas de autenticación.

Esta aproximación permite mantener una arquitectura REST stateless compatible con frontend desacoplado utilizando Next.js y facilita futuras integraciones con aplicaciones móviles o clientes externos.

---

## Consecuencias

### Positivas

- Mantiene compatibilidad con principios REST stateless.
- Facilita desacoplamiento entre frontend y backend.
- Permite escalabilidad horizontal sin dependencia de sesiones almacenadas en servidor.
- Facilita protección de rutas mediante Guards y control por roles.
- Compatible con arquitecturas modernas basadas en APIs.
- Simplifica integración futura con aplicaciones móviles o servicios externos.
- Reduce complejidad de manejo de sesiones en infraestructura distribuida.

### Negativas / Riesgos

- Requiere manejo adecuado de expiración y renovación de tokens.
- Un token comprometido podría ser utilizado hasta su expiración.
- Incrementa responsabilidad del frontend en almacenamiento seguro del token.
- Revocar sesiones activas puede resultar más complejo que en autenticación stateful.
- Configuraciones incorrectas podrían exponer endpoints protegidos.

---

## Alternativas consideradas

### 1. Autenticación basada en sesiones de servidor

Se evaluó implementar autenticación tradicional mediante sesiones almacenadas en backend y cookies de sesión. Esta alternativa fue descartada debido al mayor acoplamiento entre cliente y servidor y las dificultades de escalabilidad en entornos distribuidos.

### 2. Autenticación mediante cookies stateful

Se consideró utilizar cookies persistentes manejadas directamente por el servidor. Sin embargo, esta aproximación fue descartada porque el proyecto utiliza una arquitectura desacoplada basada en APIs REST y frontend independiente.

### 3. Integración con proveedores externos de autenticación

Se evaluó utilizar soluciones externas como Auth0 o Firebase Authentication. Esta alternativa fue descartada debido al alcance académico del proyecto y al interés de implementar directamente el flujo de autenticación dentro de la arquitectura propuesta.

---


# ADR-004: Containerización y despliegue mediante Docker y AWS Lightsail Containers

## Estado

Accepted

---

## Contexto

El sistema Home-Health requiere una estrategia de despliegue que permita mantener consistencia entre ambientes de desarrollo, pruebas y producción, además de facilitar portabilidad y simplificar el proceso de ejecución del sistema.

La solución contempla múltiples componentes tecnológicos desacoplados, incluyendo frontend, backend y base de datos, los cuales deben ejecutarse de manera aislada y reproducible para reducir problemas relacionados con configuración de entornos y dependencias.

Adicionalmente, el proyecto será desplegado en infraestructura cloud utilizando servicios de AWS como parte del alcance académico del sistema.

Se evaluaron diferentes alternativas de despliegue en AWS, incluyendo instancias EC2 tradicionales y plataformas más avanzadas orientadas a microservicios. Sin embargo, varias de estas opciones introducen complejidad operacional adicional relacionada con administración manual de infraestructura, balanceadores de carga, orquestación avanzada o configuraciones distribuidas innecesarias para el alcance actual del MVP.

---

## Decisión

Se decide utilizar contenedores Docker como estrategia principal de empaquetado y ejecución del sistema.

La solución será desplegada utilizando una arquitectura basada en contenedores separados para:

- frontend,
- backend.

Durante el desarrollo local se utilizará Docker Compose para facilitar la ejecución coordinada de los servicios y mantener consistencia entre entornos.

Como infraestructura objetivo de despliegue cloud, se utilizará AWS Lightsail Containers para la ejecución de los contenedores de aplicación y Amazon RDS PostgreSQL como servicio administrado de base de datos relacional.

La administración y despliegue de recursos cloud se realizará mediante AWS CLI y configuración de permisos utilizando IAM.

Esta aproximación permite mantener simplicidad operativa para el MVP, reduciendo complejidad de infraestructura mientras se conservan beneficios de portabilidad, aislamiento y reproducibilidad del entorno de ejecución.

---

## Consecuencias

### Positivas

- Consistencia entre ambientes de desarrollo, pruebas y producción.
- Portabilidad del sistema entre diferentes entornos de ejecución.
- Separación clara de responsabilidades mediante contenedores independientes.
- Simplificación del proceso de despliegue y configuración.
- Reducción de problemas relacionados con dependencias locales.
- Facilita integración futura con pipelines de integración y despliegue continuo.
- Uso de RDS permite delegar administración de base de datos a servicios administrados de AWS.
- Lightsail Containers reduce complejidad operacional frente a soluciones más avanzadas de orquestación.

### Negativas / Riesgos

- Requiere aprendizaje inicial de Docker y herramientas de AWS.
- Incrementa complejidad frente a ejecución completamente local sin contenedores.
- Posibles costos asociados al uso de infraestructura cloud.
- Configuraciones incorrectas de IAM o redes pueden afectar despliegue y seguridad.
- Limitaciones de escalabilidad frente a plataformas más avanzadas de orquestación de contenedores.

---

## Alternativas consideradas

### 1. Despliegue tradicional en instancia EC2

Se consideró desplegar manualmente el sistema sobre una máquina virtual EC2. Esta alternativa fue descartada debido a la mayor responsabilidad administrativa sobre configuración del servidor, dependencias y mantenimiento del entorno.

### 2. Uso de Kubernetes o Amazon ECS

Se evaluaron soluciones de orquestación avanzada de contenedores. Sin embargo, estas alternativas fueron descartadas debido a la complejidad operacional adicional y porque exceden las necesidades actuales del MVP académico.

### 3. Ejecución local sin contenedores

Se consideró ejecutar directamente frontend y backend sobre entornos locales sin Docker. Esta alternativa fue descartada debido al riesgo de inconsistencias entre ambientes y dificultades para garantizar reproducibilidad del sistema.