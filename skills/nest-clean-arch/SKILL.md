# SKILL: SOLID Principles & Clean Architecture

## Contexto

Esta skill define cómo aplicar los principios SOLID en el ecosistema NestJS/TypeScript para el proyecto home-health, basándose en los estándares de Clean Code de Robert C. Martin.

## Principios Aplicados

### 1. Single Responsibility Principle (SRP)

- **Regla:** Cada clase/servicio debe tener una única razón para cambiar.
- **En home-health:** No mezcles lógica de Stripe con lógica de persistencia de base de datos. Crea un `StripeService` y un `PaymentRepository`.

### 2. Open/Closed Principle (OCP)

- **Regla:** Entidades abiertas para extensión, cerradas para modificación.
- **En home-health:** Usa interfaces para los tipos de productos. Si añades "Medicamentos Controlados", no deberías modificar el motor de búsqueda existente, sino extenderlo.

### 3. Liskov Substitution Principle (LSP)

- **Regla:** Las subclases deben ser sustituibles por sus clases base.
- **En home-health:** Si tienes una interfaz `StorageProvider`, tanto `S3Service` como `LocalStorageService` deben comportarse igual sin romper el sistema.

### 4. Interface Segregation Principle (ISP)

- **Regla:** Los clientes no deben ser forzados a depender de interfaces que no usan.
- **En home-health:** No crees una interfaz `PharmacyActions` gigante. Divídela en `IInventoryActions`, `ISalesActions` y `IReportActions`.

### 5. Dependency Inversion Principle (DIP)

- **Regla:** Depender de abstracciones, no de implementaciones concretas.
- **En home-health:** Los servicios de NestJS deben inyectar interfaces (`@Inject('ProductRepository')`) en lugar de clases concretas de Prisma para permitir el intercambio de BD (Postgres/Mongo).

## Checklist de Revisión (Guardrail)

- [ ] ¿La función tiene más de 20 líneas? (Si sí, extraer método).
- [ ] ¿El servicio está inyectando más de 3-4 dependencias? (Posible violación de SRP).
- [ ] ¿Hay lógica de negocio en el Controller? (Mover a Service).
- [ ] ¿Los nombres de variables son descriptivos y revelan intención? (Evitar `data`, `info`, `temp`).

## Ejemplo de Refactorización (Scout Rule)

❌ **Mal:** `async createOrder(data) { ... logic + stripe + email + db ... }`  
✅ **Bien:** 1. `this.validationService.validate(data)`  
2. `this.paymentService.process(data.total)`  
3. `this.repository.save(data)`
