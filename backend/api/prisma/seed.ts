import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Seed inicial:
// - 1 administrador (cuenta seed)
// - 6 categorías base del dominio farmacéutico
// - 3 productos demo
// Pensado para entornos dev/staging. En producción solo se siembra el admin.

const prisma = new PrismaClient();

// Aplicamos los CHECK constraints como SQL idempotente.
// Cada bloque DO captura la excepción si el constraint ya existe.
// Prisma.$executeRawUnsafe solo acepta UNA sentencia por llamada, así que
// los enviamos uno a uno.
const CHECK_CONSTRAINTS: string[] = [
  `DO $$ BEGIN
    ALTER TABLE "products" ADD CONSTRAINT "chk_product_stock_non_negative" CHECK ("stock" >= 0);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "products" ADD CONSTRAINT "chk_product_price_non_negative" CHECK ("price" >= 0);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "order_items" ADD CONSTRAINT "chk_orderitem_quantity_positive" CHECK ("quantity" > 0);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "order_items" ADD CONSTRAINT "chk_orderitem_price_non_negative" CHECK ("unit_price" >= 0);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "inventory_movements" ADD CONSTRAINT "chk_invmov_quantity_positive" CHECK ("quantity" > 0);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "inventory_movements" ADD CONSTRAINT "chk_invmov_stock_non_negative" CHECK ("resulting_stock" >= 0);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "chk_password_token_validity" CHECK ("expires_at" > "created_at");
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "notifications" ADD CONSTRAINT "chk_notification_source" CHECK (
      ("type" IN ('NEW_ORDER', 'STATE_CHANGE') AND "related_order_id" IS NOT NULL)
      OR ("type" IN ('LOW_STOCK', 'EXPIRATION') AND "related_product_id" IS NOT NULL)
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
];

async function main() {
  // 1. CHECK constraints (defensa en profundidad a nivel de BD).
  // Un statement por llamada porque Prisma usa prepared statements.
  for (const sql of CHECK_CONSTRAINTS) {
    await prisma.$executeRawUnsafe(sql);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@home-health.app';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin12345!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      fullName: 'Admin Home-Health',
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const categorias = [
    'Analgésicos',
    'Antibióticos',
    'Vitaminas',
    'Cuidado personal',
    'Primeros auxilios',
    'Equipos',
  ];
  for (const name of categorias) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }

  const analgesicos = await prisma.category.findUniqueOrThrow({ where: { name: 'Analgésicos' } });
  const vitaminas = await prisma.category.findUniqueOrThrow({ where: { name: 'Vitaminas' } });

  const demoProducts = [
    {
      name: 'Acetaminofén 500mg',
      sku: 'HH-ACE-500',
      categoryId: analgesicos.id,
      description: 'Caja x 20 tabletas',
      price: 12500,
      stock: 248,
      expirationDate: new Date('2026-12-15'),
    },
    {
      name: 'Ibuprofeno 400mg',
      sku: 'HH-IBU-400',
      categoryId: analgesicos.id,
      description: 'Caja x 30 cápsulas',
      price: 9800,
      stock: 132,
      expirationDate: new Date('2026-07-15'),
    },
    {
      name: 'Vitamina C 1000mg',
      sku: 'HH-VTC-1K',
      categoryId: vitaminas.id,
      description: 'Frasco x 30',
      price: 28000,
      stock: 46,
      expirationDate: new Date('2026-06-03'),
    },
  ];

  for (const p of demoProducts) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  console.log(`✓ Seed listo. Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
