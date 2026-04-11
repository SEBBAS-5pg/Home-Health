# SKILL: AWS Infrastructure & CI/CD (DevOps)

## CONTEXTO

Despliegue de contenedores Docker en AWS Fargate y automatización con GitHub Actions.

## REGLAS DE DOCKERIZACIÓN

- Usar imágenes base `node:18-alpine` para minimalismo.
- Multi-stage builds: Stage 1 (Build), Stage 2 (Runner).
- Inyectar secretos de entorno (`.env`) exclusivamente vía AWS Secrets Manager.

## PIPELINE CI/CD (GITHUB ACTIONS)

1. **Lint & Test:** Validar Clean Code y cobertura de pruebas.
2. **Build & Push:** Construir imagen y subir a Amazon ECR.
3. **Deploy:** Actualizar el servicio en el clúster de ECS (Fargate) con zero-downtime.

## MONITOREO

- Configurar logs en CloudWatch con retención de 14 días.
- Implementar Health Checks en la ruta `/api/health`.# SKILL: AWS Infrastructure & CI/CD (DevOps)

## CONTEXTO

Despliegue de contenedores Docker en AWS Fargate y automatización con GitHub Actions.

## REGLAS DE DOCKERIZACIÓN

- Usar imágenes base `node:18-alpine` para minimalismo.
- Multi-stage builds: Stage 1 (Build), Stage 2 (Runner).
- Inyectar secretos de entorno (`.env`) exclusivamente vía AWS Secrets Manager.

## PIPELINE CI/CD (GITHUB ACTIONS)

1. **Lint & Test:** Validar Clean Code y cobertura de pruebas.
2. **Build & Push:** Construir imagen y subir a Amazon ECR.
3. **Deploy:** Actualizar el servicio en el clúster de ECS (Fargate) con zero-downtime.

## MONITOREO

- Configurar logs en CloudWatch con retención de 14 días.
- Implementar Health Checks en la ruta `/api/health`.
