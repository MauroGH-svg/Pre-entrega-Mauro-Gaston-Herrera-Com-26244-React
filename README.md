# 🎉 FiestaBox

## 📌 Descripción

**FiestaBox** es una aplicación web desarrollada con React para una empresa ficticia de organización y servicios para eventos.

El proyecto permite visualizar un catálogo de servicios, consultar el detalle de cada producto y navegar por las diferentes secciones de la aplicación mediante React Router.

Este proyecto forma parte del proceso de aprendizaje y práctica de **React JS**. como pre - entrega
del proyecto final del curso de Reacto del programa Talento-Tech 2026

---

## 🚀 Tecnologías utilizadas

* ⚛️ React
* ⚡ Vite
* 🧭 React Router DOM
* 🟨 JavaScript
* 🎨 HTML y CSS
* 📄 JSON
* 📦 pnpm
* 🖼️ ImgBB para las imágenes de los productos

---

## 🛍️ Funcionalidades

Actualmente, FiestaBox cuenta con:

* 🏠 Página de inicio.
* 🛍️ Catálogo de 8 servicios.
* 🖼️ Imagen para cada producto.
* 💰 Precio y descripción de cada servicio.
* 🔎 Página de detalle individual para cada producto.
* 🧭 Navegación mediante React Router.
* 🛒 Botón "Agregar al carrito" preparado para la futura implementación.
* 📱 Diseño responsive para diferentes tamaños de pantalla.
* 🦶 Footer con información de la empresa y equipo de trabajo.

> La funcionalidad completa del carrito será incorporada en la etapa final del proyecto.

---

## 📂 Estructura del proyecto

```text
fiestabox/
│
├── public/
│   └── productos.json
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── NavBar.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── ItemListContainer.jsx
│   │   └── Item.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Productos.jsx
│   │   ├── DetalleProducto.jsx
│   │   └── Carrito.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧭 Rutas disponibles

| Ruta            | Descripción                  |
| --------------- | ---------------------------- |
| `/`             | Página de inicio             |
| `/productos`    | Catálogo de servicios        |
| `/producto/:id` | Detalle de un producto       |
| `/carrito`      | Sección destinada al carrito |

---

## 📦 Productos

El catálogo actualmente cuenta con 8 servicios:

1. Decoración temática
2. Animación infantil
3. Juegos infantiles
4. Servicio de DJ
5. Catering para eventos
6. Fotografía para eventos
7. Transporte para invitados
8. Organización integral del evento

Los productos se encuentran almacenados en un archivo `productos.json` y son cargados mediante `fetch()`.

---

## ⚛️ Conceptos de React utilizados

Durante el desarrollo del proyecto se aplicaron diferentes conceptos fundamentales de React:

* Componentes reutilizables.
* Props.
* `useState`.
* `useEffect`.
* Renderizado dinámico con `map()`.
* Navegación con React Router.
* Parámetros dinámicos mediante `useParams()`.
* Consumo de datos desde un archivo JSON.
* Organización del proyecto mediante componentes y páginas.

---

## 💻 Instalación y ejecución

Para ejecutar el proyecto de manera local:

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Ingresar al proyecto

```bash
cd fiestabox
```

### 3. Instalar las dependencias

```bash
pnpm install
```

### 4. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Luego abrir en el navegador la dirección indicada por Vite.

---

## 👥 Equipo

### Mauro Herrera

Desarrollador

### Integrante 2

Desarrollador

### Integrante 3

Desarrollador

---

## 🔮 Próximas mejoras

Para la etapa final del proyecto se prevé incorporar:

* 🛒 Funcionalidad completa del carrito.
* 🧠 Context API para manejar el estado global del carrito.
* ➕ Agregar y eliminar productos.
* 💰 Cálculo del total de la compra.
* 🔢 Control de cantidades.
* 💾 Persistencia de datos cuando corresponda.

---

## 📚 Proyecto académico

Proyecto desarrollado como parte del curso de **React JS**, con el objetivo de aplicar los conceptos aprendidos durante la cursada mediante el desarrollo de una aplicación web funcional y componentizada.
