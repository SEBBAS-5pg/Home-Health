# Árbol de permisos de acceso — AWS IAM (Home-Health)

## 1. Introducción

Este documento define la estructura de permisos de acceso a la consola de AWS para el proyecto **Home-Health**, con el objetivo de garantizar una administración segura de la infraestructura desplegada en Amazon EC2.

La estrategia se basa en el principio de **mínimo privilegio (Least Privilege)**, separando claramente los roles de administración, auditoría y control de la cuenta raíz.

---

## 2. Principios de seguridad

La gestión de permisos en AWS se estructura bajo las siguientes reglas:

- La cuenta **root no se utiliza para tareas operativas**
- Cada usuario IAM tiene permisos limitados según su rol
- Se separan responsabilidades entre despliegue y auditoría
- Se evita cualquier permiso innecesario que pueda comprometer la infraestructura
- Se recomienda el uso de **MFA (Multi-Factor Authentication)** en todos los accesos críticos

---

## 3. Estructura de usuarios

### 3.1 Usuario Root (Cuenta principal AWS)

El usuario root es el propietario de la cuenta AWS y tiene acceso total a todos los servicios.

#### Uso permitido:

- Creación inicial de usuarios IAM
- Configuración de facturación
- Activación de MFA
- Configuración inicial de seguridad de la cuenta

#### Restricciones:

- No se utiliza para despliegues
- No se utiliza para administración diaria
- No se utiliza para acceso a EC2 ni infraestructura
- No se comparten credenciales del usuario root

---

### 3.2 Usuario IAM Administrador (Despliegue / DevOps)

Usuario encargado de la administración completa de la infraestructura del proyecto.

**Nombre sugerido:** `home-health-admin`

#### Permisos asignados:

- AmazonEC2FullAccess
- AmazonVPCFullAccess (si aplica)
- AmazonS3FullAccess (opcional para backups)
- CloudWatchFullAccess
- IAMReadOnlyAccess

#### Responsabilidades:

- Creación y administración de instancias EC2
- Configuración de Security Groups
- Despliegue de contenedores Docker
- Clonación y actualización del repositorio
- Monitoreo básico de logs y estado del sistema

---

### 3.3 Usuario IAM Auditor (Evaluación / Profesor)

Usuario creado específicamente para revisión y evaluación del proyecto.

**Nombre sugerido:** `home-health-auditor`

#### Permisos asignados:

- EC2ReadOnlyAccess
- CloudWatchReadOnlyAccess
- IAMReadOnlyAccess

#### Restricciones:

- No puede crear ni modificar recursos
- No puede eliminar instancias o configuraciones
- No tiene permisos de escritura en la infraestructura

#### Responsabilidades:

- Verificar la arquitectura desplegada
- Consultar logs del sistema
- Validar el estado de la instancia EC2
- Revisar configuración general de seguridad

---

## 4. Árbol de permisos (estructura jerárquica)

```text
ROOT (AWS Account)
│
├── IAM Users
│   │
│   ├── home-health-admin
│   │   ├── AmazonEC2FullAccess
│   │   ├── CloudWatchFullAccess
│   │   ├── IAMReadOnlyAccess
│   │   └── (otros permisos de administración según necesidad)
│   │
│   ├── home-health-auditor
│   │   ├── EC2ReadOnlyAccess
│   │   ├── CloudWatchReadOnlyAccess
│   │   └── IAMReadOnlyAccess
│   │
│   └── (otros usuarios futuros si se requiere escalamiento)
│
└── Root Account
    ├── Configuración de seguridad inicial
    ├── Gestión de facturación
    └── Creación de usuarios IAM
````

---

## 5. Flujo correcto de uso de la cuenta AWS

### 5.1 Configuración inicial (Root - una sola vez)

Desde el usuario root se realizan únicamente las siguientes acciones:

1. Activar MFA (Multi-Factor Authentication)
2. Crear usuario IAM administrador (`home-health-admin`)
3. Configurar alertas de facturación
4. Definir políticas básicas de seguridad

---

### 5.2 Despliegue del sistema (Usuario IAM Admin)

Todo el despliegue se realiza desde el usuario administrador:

1. Creación de instancia EC2
2. Configuración de Security Groups
3. Acceso por SSH a la instancia
4. Instalación de Docker y dependencias
5. Clonación del repositorio

```bash
git clone <repo-url>
cd Home-Health
```

6. Despliegue de la aplicación

```bash
docker compose up -d --build
```

7. Verificación de servicios

```bash
docker ps
```

---

### 5.3 Revisión del sistema (Usuario IAM Auditor)

El usuario auditor tiene acceso únicamente de lectura para:

* Ver instancias EC2
* Consultar logs en CloudWatch
* Ver configuración de seguridad
* Validar estado general del sistema

---

## 6. Buenas prácticas implementadas

* Separación clara de roles (root, admin, auditor)
* Aplicación del principio de mínimo privilegio
* Uso de MFA en usuarios críticos
* Evitar uso del usuario root para tareas operativas
* Control de acceso basado en permisos IAM
* Reducción del riesgo de modificaciones accidentales o maliciosas

---

## 7. Conclusión

La estructura de permisos definida permite una administración segura y organizada de la infraestructura AWS del proyecto Home-Health.

Este modelo garantiza:

* Seguridad en la cuenta principal
* Control de acceso por roles
* Separación de responsabilidades
* Protección contra acciones no autorizadas
* Cumplimiento de buenas prácticas en la nube


