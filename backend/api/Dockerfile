# ──── builder ────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# OpenSSL es requisito de Prisma sobre alpine.
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
# Si no hay package-lock.json (proyecto recién clonado) o el lock está
# desactualizado, npm ci falla; npm install resuelve el árbol desde cero.
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps || npm install --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

COPY . .
RUN npx prisma generate && npm run build
# Verificación: si dist/main.js no existe, fallar el build ahora (no en runtime).
RUN test -f dist/main.js || (echo "❌ dist/main.js no fue generado por el build" && ls -la dist/ && exit 1)

# ──── runner ─────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl curl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Arranque:
# 1. `prisma db push` sincroniza el schema con la BD (crea tablas si no existen).
# 2. `tsx prisma/seed.ts` aplica CHECK constraints + crea admin (idempotente).
# 3. `node dist/main.js` arranca la API.
# Si el seed falla, igual arrancamos el API (no rompemos por datos faltantes).
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && (npx tsx prisma/seed.ts || echo 'seed: omitido') && node dist/main.js"]
