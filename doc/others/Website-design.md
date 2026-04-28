# Website Design Document - Home-Health

## Control de Versiones

|  Versión  |     Fecha      |     Autor     | Descripción de Cambios                                             |
| :-------: | :------------: | :-----------: | :----------------------------------------------------------------- |
|   1.0.0   |   2026-04-21   |   SDD Agent   | Creación del documento base de UI/UX y Diseño                      |
| **1.1.0** | **2026-04-27** | **Da vincii** | **Actualización de paleta de colores (Estrategia High-end Clean)** |

---

## 2. Identidad Visual

### 2.1 Paleta de Colores (Brand Palette)

La selección cromática busca transmitir modernidad, exclusividad y confianza, alejándose de los verdes tradicionales de salud para adoptar un tono "Boutique Wellness".

```mermid
graph LR
    subgraph "Brand Palette"
        C1[Action: #7D18E5]
        C2[Soft Accent: #B085F5]
        C3[Text/Dark: #1E293B]
        C4[Surface/BG: #F1F5F9]
    end



    style C1 fill:#7D18E5,color:#fff,stroke:#333,stroke-width:2px
    style C2 fill:#B085F5,color:#000,stroke:#333,stroke-width:1px
    style C3 fill:#1E293B,color:#fff,stroke:#333,stroke-width:1px
    style C4 fill:#F1F5F9,color:#000,stroke:#333,stroke-width:1px
```

- **Brand / Primario (Action):** `#7D18E5`
  - _Uso:_ Botones de compra (CTA), estados activos, elementos de marca destacados. Representa la tecnología y la salud premium.
- **Brand / Secundario (Soft Accent):** `#B085F5`
  - _Uso:_ Fondos de badges, estados de hover (pasado de ratón), acentos sutiles en tarjetas de producto.
- **Textos / Primario (Slate Dark):** `#1E293B`
  - _Uso:_ Títulos, cuerpo de texto principal y navegación. Asegura una lectura descansada y profesional.
- **Fondos / Superficies (Surface):** `#F1F5F9`
  - _Uso:_ Fondo general de la aplicación. Proporciona limpieza visual y permite que los productos resalten sin ruido.

### 2.2 Estados de Feedback (Semantic Colors)

_Se mantienen los colores estándar de la industria para garantizar la curva de aprendizaje del usuario._

- **Éxito (Success):** `#10B981` (Venta completada, receta validada).
- **Error (Danger):** `#EF4444` (Stock agotado, error en pago).
- **Advertencia (Warning):** `#F59E0B` (Envío retrasado).
- **Información (Info):** `#3B82F6` (Nuevas políticas).
