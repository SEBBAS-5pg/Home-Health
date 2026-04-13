---
name: security-secrets-guardrail
description: Protección contra fuga de credenciales y validación de variables de entorno.
triggers: "Invocada siempre que se manejen APIs externas, bases de datos o servicios de AWS."
---

# 🔐 Skill: Guardrail de Seguridad y Secretos

## 🚫 Reglas de Oro (Zero Tolerance)

1. **PROHIBIDO:** Escribir API Keys, Tokens o Passwords en el código fuente o archivos de documentación.
2. **PROHIBIDO:** Incluir archivos `.env` en los commits (deben estar en `.gitignore`).
3. **PROHIBIDO:** Generar ejemplos de código con datos reales de producción.

## ✅ Protocolo de Implementación

- **Acceso:** Usa siempre `process.env.VARIABLE_NAME` en Node.js.
- **Validación:** Toda variable de entorno DEBE ser validada en el arranque de la app usando **Zod** o `class-validator` para asegurar que no falte nada crítico.
- **Secrets Manager:** Para el entorno de AWS, la recomendación técnica es recuperar secretos mediante **AWS Secrets Manager** en tiempo de ejecución, no inyectarlos todos en el plano de control.

## 📋 Checklist de Seguridad

- [ ] ¿El archivo modificado está en el `.gitignore`?
- [ ] ¿He usado un nombre semántico para la variable (ej. `DB_PASSWORD`)?
- [ ] ¿He actualizado el archivo `.env.example` con el nuevo nombre de la variable?
