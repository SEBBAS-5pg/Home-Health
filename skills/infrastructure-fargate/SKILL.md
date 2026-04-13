---
name: infrastructure-fargate-ops
description: Protocolo de modificación de infraestructura, Docker y AWS Fargate.
triggers: "Al detectar cambios en Dockerfile, docker-compose, terraform/, o configuración de red."
---

# 🏗️ Skill: Operaciones de Infraestructura (Fargate)

Esta Skill es obligatoria para cualquier cambio que afecte el despliegue o el empaquetado de la aplicación.

## 🚫 Prohibiciones Críticas

1. **No Hardcoded Values:** PROHIBIDO escribir IDs de subredes, VPCs o ARNs directamente en el código o scripts. Usa variables de entorno.
2. **Persistence Check:** Antes de modificar un contenedor, valida si requiere almacenamiento persistente. Recuerda: Fargate requiere **Amazon EFS** para persistencia de datos [1].
3. **IAM Least Privilege:** No solicites permisos de `AdministratorAccess`. Los agentes deben proponer roles con el "Principio de Menor Privilegio".

## 📦 Estándares de Contenedor (Dockerfile)

- **Base Image:** Usa imágenes ligeras (ej. `node:20-alpine`).
- **Multi-stage Build:** Obligatorio para separar dependencias de desarrollo de las de producción.
- **Security:** El contenedor debe correr como un usuario no-root.

## ☁️ Reglas de AWS Fargate

- **Networking:** Los servicios deben estar en subredes privadas. El acceso público solo se permite a través del Application Load Balancer (ALB).
- **Resources:** Valida siempre el ratio CPU/Memoria admitido por Fargate antes de proponer cambios en la definición de la tarea.
