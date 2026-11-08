# Cafeta TiPum — Frontend (React + Vite)

Frontend de la tienda online **Cafeta TiPum** (Evaluación Parcial 3 — Desarrollo Fullstack II). Consume la API REST del backend Spring Boot mediante `fetch`, con autenticación JWT y restricciones de acceso por rol.

## Tecnologías

- React 19 + Vite
- React Router DOM, React-Bootstrap, Bootstrap
- `fetch` (módulo `src/api/client.js`) para consumir la API

## Requisitos

- Node.js 18+ y npm
- Backend Spring Boot corriendo en `http://localhost:8080` (ver `tipum-backend`)

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`.

> La URL de la API se configura en el archivo `.env` mediante `VITE_API_URL` (por defecto `http://localhost:8080`).

Otros comandos:

```bash
npm run build     # compila para producción (carpeta dist/)
npm run test      # ejecuta las pruebas con Vitest
npm run lint      # lint con ESLint
```

## Características (Fase 3)

- **Consumo de API REST**: catálogo, detalle, carrito, checkout, órdenes y usuarios provienen del backend.
- **Autenticación JWT**: login contra `/api/auth/login`; el token se guarda en `localStorage`.
- **Persistencia de sesión**: el estado de autenticación sobrevive a la recarga de página (`AuthContext`).
- **Restricciones por rol**: rutas y opciones de menú visibles según el rol (`ADMIN`, `VENDEDOR`, `CLIENTE`).

## Estructura

```
src/
├── api/
│   └── client.js              # Cliente HTTP + definición de endpoints
├── context/
│   └── AuthContext.jsx        # Autenticación, sesión y persistencia (JWT)
├── components/
│   ├── Navbar.jsx             # Menú según rol + resumen del carrito
│   ├── RutaProtegida.jsx      # Protege rutas por rol
│   ├── Producto.jsx           # Tarjeta de producto
│   └── Footer.jsx
├── pages/
│   ├── Inicio.jsx, Productos.jsx, Categorias.jsx, Ofertas.jsx, DetalleProducto.jsx
│   ├── Login.jsx, Registro.jsx
│   ├── Carrito.jsx, Checkout.jsx
│   ├── MisPedidos.jsx         # Historial del cliente
│   ├── PanelVendedor.jsx      # Vista de solo lectura (productos + órdenes)
│   └── AdminPanel.jsx         # CRUD de productos/usuarios + órdenes + dashboard
└── data/
    └── database.js            # Datos geográficos, validaciones y carrito local
```

## Roles y acceso

| Rol | Acceso en el frontend |
|-----|------------------------|
| **Administrador** | Todo: panel admin (CRUD productos, usuarios, órdenes, métricas) |
| **Vendedor** | Panel vendedor (ver productos y órdenes); sin acciones de escritura |
| **Cliente** | Tienda (productos, carrito, checkout) y "Mis Pedidos" |

## Usuarios de prueba

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | vendedor123 |
| Cliente | juan.perez@duoc.cl | cliente123 |
