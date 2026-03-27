---

## Páginas y Rutas

### Públicas (sin autenticación)

| Ruta | Componente | Tipo | Descripción |
|------|------------|------|-------------|
| `/` | `Page` | Server | Página de inicio con secciones: hero, categorías, productos destacados, etc. |
| `/about` | `AboutPage` | Client | Información sobre la plataforma. |
| `/products` | `ProductsPage` | Server | Catálogo de productos con filtros por categoría. |
| `/products/[slug]` | `ProductDetailPage` | Server | Detalle de un producto. |
| `/initiatives` | `InitiativesPage` | Server | Listado de iniciativas (con búsqueda/filtros). |
| `/initiatives/[initiative]` | `InitiativeDetailPage` | Server | Detalle de una iniciativa, con botón para unirse. |
| `/foundations` | `FoundationsPage` | Server | Listado de fundaciones. |
| `/foundations/[siglas]` | `FoundationDetailPage` | Server | Perfil de una fundación (información + sus iniciativas). |
| `/login` | `LoginPage` | Client | Formulario de inicio de sesión. |
| `/user/register` | `UserRegisterPage` | Client | Registro de usuario (emprendedor o miembro). |
| `/foundations/register` | `RegisterFoundationPage` | Client | Registro de fundación (formulario multi-paso). |

### Protegidas (requieren autenticación y rol específico)

| Ruta | Rol requerido | Componente | Descripción |
|------|---------------|------------|-------------|
| `/dashboard` | Cualquiera | `DashboardPage` (Client) | Redirige al dashboard correspondiente según el rol del usuario. |
| `/dashboard/entrepreneur` | `entrepreneur` | `EntrepreneurDashboard` (Client) | Gestión de productos: listar, crear, editar, eliminar. |
| `/dashboard/foundation` | `foundation` | `FoundationDashboard` (Client) | Gestión de iniciativas y productos de la fundación. |
| `/dashboard/member` | `member` | `MemberDashboard` (Client) | Ver iniciativas a las que se ha unido, estadísticas. |

### ⚠️ Rutas obsoletas/erróneas

- `/entrepeneur` y `/entrepeneur/name` – aparentemente páginas sin contenido, probablemente un error de ortografía (deberían ser `/entrepreneur`).  
- `/test.tsx` – archivo de prueba que puede eliminarse.

---

## Autenticación y Autorización

El sistema de autenticación está implementado con `AuthContext` que maneja:

- `user`: datos del usuario autenticado (incluye `role`).
- `jwt`: token JWT almacenado en `localStorage`.
- `login(user, jwt)`: guarda los datos y el token.
- `logout()`: limpia la sesión.

**Flujo típico:**

1. El usuario accede a una ruta protegida → se verifica `authLoading`.
2. Si no hay `jwt` o `user`, se redirige a `/login`.
3. Si hay usuario pero el rol no coincide con el requerido, se redirige a `/dashboard` (que a su vez redirige al dashboard correcto según el rol).
4. Los componentes que requieren datos del backend (ej. `EntrepreneurDashboard`) usan el `jwt` para hacer peticiones autenticadas a Strapi.

---

## Roles y Funcionalidades

### Emprendedor (entrepreneur)

- **Panel:** `/dashboard/entrepreneur`
- **Acciones:**
  - Ver, crear, editar y eliminar productos propios.
  - Marcar productos como destacados.
  - Subir imágenes a los productos.
- **Datos:** Se obtienen productos filtrados por `usuario.id`.

### Fundación (foundation)

- **Panel:** `/dashboard/foundation`
- **Acciones:**
  - Gestionar iniciativas (crear, editar, eliminar).
  - Gestionar productos (similar a emprendedor, pero asociados a la fundación).
  - Ver estadísticas de miembros unidos a sus iniciativas.
- **Datos:** Se obtienen iniciativas y productos vinculados a la fundación.

### Miembro (member)

- **Panel:** `/dashboard/member`
- **Acciones:**
  - Ver las iniciativas a las que se ha unido.
  - Ver estadísticas de participación.
  - Posibilidad de unirse a nuevas iniciativas desde la página de detalle de iniciativa (pública).
- **Datos:** Se obtienen inscripciones del miembro a iniciativas.

---

## Modelos de Datos (inferidos)

Los tipos están definidos en `types/`:

```typescript
// Product
interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  stock?: number;
  featured?: boolean;
  images?: { url: string }[];
  usuario?: User; // Relación con usuario (emprendedor)
  foundation?: Foundation; // Relación con fundación (si aplica)
}

// Foundation
interface Foundation {
  id: number;
  documentId: string;
  name: string;
  siglas: string;
  description?: string;
  logo?: { url: string };
  initiatives?: Initiative[];
  products?: Product[];
}

// Initiative
interface Initiative {
  id: number;
  documentId: string;
  name: string;
  description?: string;
  image?: { url: string };
  foundation: Foundation;
  members?: User[];
}

// User (autenticación)
interface User {
  id: number;
  username: string;
  email: string;
  role: { name: string }; // 'entrepreneur', 'foundation', 'member'
  // ...
}
```
