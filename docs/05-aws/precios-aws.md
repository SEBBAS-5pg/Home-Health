# Costos estimados en AWS — Home-Health

## 1. Introducción

Este documento presenta una estimación de costos asociados al despliegue del sistema **Home-Health** en Amazon Web Services (AWS). La arquitectura implementada se basa en una instancia única EC2 con contenedores Docker para backend, frontend y base de datos PostgreSQL.

El objetivo es mantener una infraestructura de **bajo costo**, adecuada para un entorno académico, pero alineada con prácticas reales de despliegue en la nube.

---

## 2. Enfoque de arquitectura y su impacto en costos

La arquitectura del sistema se basa en los siguientes principios:

- Uso de una única instancia EC2 (monolito contenerizado)
- Base de datos alojada localmente en contenedor Docker
- Sin servicios administrados adicionales (RDS, ECS, EKS)
- Uso de VPC por defecto
- Exposición controlada mediante Security Groups

Este enfoque reduce significativamente los costos al evitar servicios gestionados adicionales.

---

## 3. Servicios AWS utilizados

### 3.1 Amazon EC2 (Servicio principal)

Es el recurso central donde se ejecuta toda la aplicación.

#### Configuración utilizada:

- Tipo de instancia: t2.micro o t3.micro (Free Tier si está disponible)
- Sistema operativo: Ubuntu Server 22.04 LTS
- Uso: Backend, frontend y base de datos en contenedores Docker

#### Costo estimado:

- Free Tier: 750 horas/mes gratuitas (primer año)
- Posterior al Free Tier: entre 0.010 USD y 0.013 USD por hora

#### Estimación mensual:

- Uso continuo 24/7:
  - Aproximadamente 7 a 10 USD/mes (instancia pequeña)

---

### 3.2 Amazon EBS (Elastic Block Storage)

Almacenamiento asociado a la instancia EC2.

#### Uso:

- Sistema operativo
- Código fuente del proyecto
- Volúmenes Docker (persistencia de PostgreSQL)

#### Configuración estimada:

- 8 GB a 30 GB de almacenamiento general

#### Costo estimado:

- Aproximadamente 0.08 USD por GB/mes

#### Estimación mensual:

- Entre 1 USD y 3 USD/mes dependiendo del tamaño del volumen

---

### 3.3 Transferencia de datos (Data Transfer)

Corresponde al tráfico de red generado por el uso de la aplicación.

#### Incluye:

- Acceso al frontend web
- Consumo de API backend
- Comunicación cliente-servidor

#### Costo estimado:

- Primer GB mensual gratuito en muchos casos
- Posteriormente: aproximadamente 0.09 USD por GB transferido

#### Estimación mensual:

- Proyecto académico: bajo consumo
- Aproximadamente 0 a 2 USD/mes

---

## 4. Servicios NO utilizados (ahorro de costos)

Para mantener la infraestructura económica, no se utilizan los siguientes servicios:

- Amazon RDS (base de datos administrada)
- AWS ECS / EKS (orquestación avanzada)
- Elastic Load Balancer
- AWS Lambda
- CloudFront
- S3 (para hosting frontend o archivos estáticos)

Esto reduce significativamente el costo mensual total.

---

## 5. Estimación total de costos

### Escenario 1: Free Tier activo

- EC2: 0 USD
- EBS: 0 a 1 USD
- Transferencia: 0 USD (bajo uso)

**Costo total estimado: 0 a 1 USD/mes**

---

### Escenario 2: Sin Free Tier

- EC2: 7 a 10 USD
- EBS: 1 a 3 USD
- Transferencia: 0 a 2 USD

**Costo total estimado: 8 a 15 USD/mes**

---

## 6. Optimización de costos

Se aplican las siguientes estrategias para mantener bajos los costos:

- Uso de instancia pequeña (t2/t3 micro)
- Contenedorización en una sola máquina
- Eliminación de servicios administrados innecesarios
- Uso de almacenamiento mínimo requerido
- Evitar tráfico de red excesivo
- Despliegue académico sin escalamiento automático

---

## 7. Escalabilidad futura (impacto en costos)

Si el sistema evoluciona a producción, los costos pueden incrementarse debido a:

- Migración a RDS (base de datos administrada)
- Uso de ECS o Kubernetes (EKS)
- Balanceadores de carga (ELB)
- Almacenamiento S3 para archivos
- CDN con CloudFront

Esto podría aumentar el costo mensual entre 30 USD y 150+ USD dependiendo de la carga.

---

## 8. Conclusión

La arquitectura actual de Home-Health está optimizada para mantener costos mínimos sin comprometer funcionalidad.

El uso de EC2 con Docker permite:

- Control total del entorno
- Bajo costo operativo
- Simplicidad en el despliegue
- Adecuación para entornos académicos

En su estado actual, el sistema puede operar prácticamente de forma gratuita bajo el Free Tier de AWS o con costos muy reducidos fuera de él.