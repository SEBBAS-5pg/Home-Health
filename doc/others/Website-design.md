# Website Design Document - Home-Health

## Control de Versiones

| Versión | Fecha | Autor | Descripción de Cambios |
| :---: | :---: | :---: | :--- |
| **1.0.0** | 2026-04-21 | SDD Agent | Creación del documento base de UI/UX y Diseño |

---

## 1. Introducción
Este documento define las directrices y requerimientos de diseño de interfaces de usuario (UI) y experiencia de usuario (UX) para el proyecto Home-Health. Su objetivo es mantener la consistencia visual, accesibilidad y estandarización de componentes a lo largo de toda la plataforma web.

## 2. Identidad Visual

### 2.1 Paleta de Colores
*Consolidar aquí los colores que darán vida a la plataforma. Definir códigos HEX y su propósito.*

- **Brand / Primario:** `#000000` (Ejm: Botones principales, enlaces relevantes)
- **Secundario:** `#000000` (Ejm: Elementos de apoyo, badges)
- **Fondos (Backgrounds):** Principal `#FFFFFF`, Secundario `#F3F4F6`
- **Textos (Typography):** Principal `#111827`, Secundario `#6B7280`
- **Estados (Feedback):** 
  - Éxito (Success): `#10B981`
  - Error (Danger): `#EF4444`
  - Advertencia (Warning): `#F59E0B`
  - Información (Info): `#3B82F6`

### 2.2 Tipografía
*Especificar las familias tipográficas, jerarquías, pesos y tamaños recomendados.*

- **Fuente Principal (Sans-serif):** (Ej. Inter, Roboto, u Outfit) - Uso general de UI y lectura.
- **Fuente Secundaria / Monospace:** (Ej. Fira Code) - Snippets y datos tabulares.
- **Jerarquía:**
  - H1: Bold, 2rem (32px)
  - H2: SemiBold, 1.5rem (24px)
  - Párrafo/Body: Regular, 1rem (16px)
  - Small: Regular, 0.875rem (14px)

## 3. Requerimientos de UI/UX

### 3.1 Disposición y Responsive Design
*Detallar el comportamiento de la interfaz adaptativa.*

- **Breakpoints (Tailwind por defecto):**
  - **sm:** 640px (Móviles en apaisado)
  - **md:** 768px (Tablets)
  - **lg:** 1024px (Laptops)
  - **xl:** 1280px (Escritorio)
- **Espaciado y Márgenes:** Uso del sistema de espaciado estándar (ej. escala de 4px: `p-4`, `m-2`).

### 3.2 Sistema de Componentes
*Especificación de componentes recurrentes.*

- **Botones:** Estados requeridos (Default, Hover, Active, Disabled, Loading).
- **Entradas de Datos (Inputs):** Estilos de 'Focus', validaciones (Error/Success), placeholders.
- **Navegación:** Comportamiento del Navbar (Sticky/Fixed) y menús laterales (Mobile drawer).
- **Tarjetas (Cards):** Sombras e interacciones por defecto, bordes y paddings uniformes.

## 4. Interacciones y Animaciones
*Describir la "vida" de la aplicación, cómo responde el sistema fluidamente a las acciones del usuario.*

- **Micro-interacciones:** Hover en botones/links, outline focus para navegación con teclado.
- **Transiciones y Tiempos:** Duración recomendada de `150ms` a `300ms` usando curvas `ease-in-out` para suavidad.
- **Estados de Carga (Loading States):** Preferencia por Skeletons (Tremor/Tailwind) antes que el uso excesivo de spinners completos, dando la sensación de mayor velocidad.
- **Notificaciones (Toasts):** Aparición desde la esquina superior/inferior derecha con auto-dismiss a los 3-5 segundos.

## 5. Accesibilidad (a11y)
*Lineamientos necesarios para asegurar que la app sea utilizable por todos.*

- **Contraste de Color:** Asegurar que los textos sobre fondos cumplan la norma WCAG AA (Mínimo 4.5:1).
- **Navegación Asistida:** Soporte completo de uso mediante tecla `TAB` (Tabindex visible y lógico).
- **Lectores de Pantallas:** Uso de etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<article>`) y atributos `aria-label` en controles donde el icono es la única información visual.

## 6. Recursos, Assets e Integración
*Configuración y bibliotecas base del frontend basadas en los lineamientos (Tailwind CSS, Tremor).*

- **Íconos:** Biblioteca definida (Ej. Lucide React, Heroicons).
- **Imágenes:** Definir formato de imágenes (WebP) y política de tamaños.
- **UI Kits externos:** (Ej. Tremor para dashboards y analíticas).

---

## 7. Mejoras Futuras / Backlog de Diseño
*Sección abierta para listar propuestas visuales o refactorizaciones de componentes pendientes para próximas versiones.*

- [ ] Aprobar y rellenar la paleta de colores.
- [ ] Definir biblioteca de iconos.
- [ ] Diseñar el componente Skeleton Global.

> **Nota de Evolución:** Este documento forma parte de la documentación viva. Cualquier iteración, rediseño o ajuste estratégico en la interfaz, deberá sumarse mediante nuevas versiones documentadas en la tabla inicial para garantizar el control sobre la experiencia del usuario de todo el equipo de desarrollo.
