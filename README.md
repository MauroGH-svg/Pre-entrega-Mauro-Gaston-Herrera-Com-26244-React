# FiestaBox

## Descripción

FiestaBox es una aplicación web desarrollada con React que simula una tienda online de productos para fiestas y eventos.

El proyecto permite explorar un catálogo de productos, consultar sus detalles, gestionar un carrito de compras, registrar pedidos y acceder a diferentes funcionalidades según el rol del usuario.

La aplicación utiliza Firebase para la autenticación de usuarios y el almacenamiento de información mediante Cloud Firestore.

Este proyecto forma parte del trabajo final del curso de React JS del programa Talento Tech 2026.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- React Router DOM
- Context API
- Firebase Authentication
- Cloud Firestore
- Tailwind CSS
- CSS
- HTML
- pnpm
- ImgBB para el alojamiento de imágenes de productos

## Estructura del proyecto

fiestabox/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Item.jsx
│   │   ├── ItemListContainer.jsx
│   │   ├── Layout.jsx
│   │   ├── NavBar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CarritoContext.jsx
│   │
│   ├── data/
│   │
│   ├── firebase/
│   │   └── config.js
│   │
│   ├── pages/
│   │   ├── AdminPedidos.jsx
│   │   ├── AdminProductos.jsx
│   │   ├── CargarProductos.jsx
│   │   ├── Carrito.jsx
│   │   ├── DetalleProducto.jsx
│   │   ├── Home.jsx
│   │   ├── InicioSesion.jsx
│   │   ├── MisPedidos.jsx
│   │   ├── Productos.jsx
│   │   └── Registro.jsx
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── vite.config.js

## Funcionalidades

### Catálogo de productos

- Visualización de productos para fiestas y eventos.
- Imágenes, nombres, descripciones y precios.
- Consulta del detalle individual de cada producto.
- Búsqueda de productos por nombre.
- Obtención de información desde Cloud Firestore.

### Carrito de compras

- Agregar productos al carrito.
- Eliminar productos.
- Modificar cantidades.
- Calcular subtotales y total de compra.
- Vaciar el carrito.
- Persistencia del carrito mediante localStorage.

### Autenticación de usuarios

- Registro de nuevos usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante Firebase Authentication.
- Diferenciación de permisos según el rol del usuario.
- Protección de rutas privadas.

### Panel de administración

- Acceso exclusivo para usuarios con rol administrador.
- Visualización de productos registrados.
- Creación de nuevos productos.
- Edición de productos existentes.
- Eliminación de productos.
- Validación de los datos ingresados en los formularios.

### Gestión de pedidos

- Registro de compras en Cloud Firestore.
- Consulta del historial de pedidos por parte del cliente.
- Visualización y administración de pedidos desde el panel administrativo.
- Actualización del estado de los pedidos.
- Seguimiento de los estados de cada compra.

### Diseño y navegación

- Página de inicio.
- Diseño responsive.
- Navegación mediante React Router DOM.
- Componentes reutilizables.
- Interfaz adaptada a las funcionalidades de la tienda.

## Cuentas de demostración

La aplicación dispone de dos perfiles de usuario para probar las diferentes funcionalidades:

**Administrador**
- Rol: `admin`
- Permisos: gestión de productos y administración de pedidos.

**Cliente**
- Rol: `cliente`
- Permisos: navegación por el catálogo, utilización del carrito, realización de compras y consulta del historial de pedidos.

Las credenciales de acceso corresponden a usuarios ficticios creados exclusivamente para la evaluación y se proporcionan por separado, sin publicarse en este repositorio por razones de seguridad.

## Rutas disponibles

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/productos` | Catálogo de productos |
| `/producto/:id` | Detalle individual del producto |
| `/carrito` | Carrito de compras |
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuarios |
| `/mis-pedidos` | Historial de pedidos del cliente |
| `/admin` | Panel de administración de productos |
| `/admin/pedidos` | Administración de pedidos |

Las rutas administrativas están protegidas y requieren un usuario autenticado con rol de administrador.

## Base de datos y servicios de Firebase

El proyecto utiliza Firebase para gestionar la autenticación y almacenar la información de la aplicación.

**Firebase Authentication**
- Registro e inicio de sesión mediante correo electrónico y contraseña.

**Cloud Firestore**
- Colección `usuarios`: información de los usuarios y sus roles.
- Colección `productos`: catálogo de productos de la tienda.
- Colección `pedidos`: compras registradas por los clientes.

Las reglas de seguridad de Firestore establecen permisos de lectura y escritura según la autenticación y el rol del usuario.

## Instalación y ejecución

Para ejecutar el proyecto localmente:

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Ingresar a la carpeta del proyecto

```bash
cd fiestabox
```

### 3. Instalar las dependencias

```bash
pnpm install
```

### 4. Configurar Firebase

Crear o utilizar un proyecto de Firebase, habilitar Authentication con correo electrónico y contraseña, configurar Cloud Firestore y completar la configuración de conexión en:

`src/firebase/config.js`

### 5. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Luego abrir en el navegador la dirección local indicada por Vite.

### 6. Generar la versión de producción

```bash
pnpm build
```

### 7. Visualizar la versión de producción localmente

```bash
pnpm preview
```

## Conceptos de React aplicados

Durante el desarrollo se utilizaron diferentes conceptos y herramientas:

- Componentes reutilizables.
- Props.
- Hooks `useState`, `useEffect` y `useContext`.
- Context API para el manejo del estado global.
- Renderizado dinámico de listas.
- Manejo de eventos.
- Formularios controlados y validaciones.
- React Router DOM.
- Parámetros dinámicos mediante `useParams`.
- Rutas protegidas.
- Consumo de datos desde Firestore.
- Operaciones CRUD.
- Manejo de estados de carga y errores.
- Persistencia de información mediante localStorage.

## Proyecto académico

FiestaBox fue desarrollado como proyecto final del curso de React JS del programa Talento Tech 2026.

El objetivo es aplicar los conocimientos adquiridos durante la cursada mediante la construcción de una aplicación web funcional, organizada y conectada a servicios de Firebase.