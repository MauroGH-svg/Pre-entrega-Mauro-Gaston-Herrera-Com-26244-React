
import { useState, useEffect } from "react";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase/config";

/*---------------------- ADMINISTRACIÓN DE PRODUCTOS ----------------------*/

function AdminProductos() {

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: "",
    disponible: true
  });


  // Recuperamos los productos desde Firestore.
  useEffect(() => {

    const obtenerProductos = async () => {

      try {
        const consulta = await getDocs(collection(db, "productos"));

        const productosObtenidos = consulta.docs.map((documento) => ({
          ...documento.data(),
          id: documento.id
        }));

        setProductos(productosObtenidos);

      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("No se pudieron cargar los productos.");

      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();

  }, []);


  // Controlamos los cambios en los campos del formulario.
  const manejarCambio = (e) => {

    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value
    });

  };


  // Limpiamos el formulario.
  const limpiarFormulario = () => {

    setFormulario({
      nombre: "",
      precio: "",
      descripcion: "",
      imagen: "",
      disponible: true
    });

    setProductoEditando(null);
  };


  // Cargamos los datos del producto seleccionado.
  const editarProducto = (producto) => {

    setProductoEditando(producto.id);

    setFormulario({
      nombre: producto.nombre,
      precio: String(producto.precio),
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      disponible: producto.disponible
    });

    setMensaje("");
    setError("");
  };


  /*---------------------- CREATE / UPDATE ----------------------*/

  const guardarProducto = async (e) => {

    e.preventDefault();

    setGuardando(true);
    setMensaje("");
    setError("");

    if (!formulario.nombre.trim()) {
      setError("El nombre del producto es obligatorio.");
      setGuardando(false);
      return;
    }

    if (Number(formulario.precio) <= 0) {
      setError("El precio debe ser mayor que cero.");
      setGuardando(false);
      return;
    }

    if (!formulario.descripcion.trim()) {
      setError("La descripción del producto es obligatoria.");
      setGuardando(false);
      return;
    }

// Validamos la URL de la imagen.
const urlValida = (() => {
  try {
    const url = new URL(formulario.imagen.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
})();

if (!urlValida) {
  setError("Ingresá una URL válida para la imagen.");
  setGuardando(false);
  return;
}
    try {

      const productoActualizado = {
        ...formulario,
        precio: Number(formulario.precio)
      };

      if (productoEditando) {

        await updateDoc(
          doc(db, "productos", productoEditando),
          productoActualizado
        );

        setProductos((prevProductos) =>
          prevProductos.map((producto) =>
            producto.id === productoEditando
              ? { ...producto, ...productoActualizado }
              : producto
          )
        );

        setMensaje("Producto actualizado correctamente.");

      } else {

        const documento = await addDoc(
          collection(db, "productos"),
          productoActualizado
        );

        setProductos((prevProductos) => [
          ...prevProductos,
          { ...productoActualizado, id: documento.id }
        ]);

        setMensaje("Producto creado correctamente.");
      }

      limpiarFormulario();

    } catch (error) {

      console.error("Error al guardar el producto:", error);
      setError("No se pudo guardar el producto.");

    } finally {

      setGuardando(false);

    }
  };


  /*---------------------- DELETE ----------------------*/

  const eliminarProducto = async (producto) => {

    const confirmar = window.confirm(
      `¿Estás seguro de que querés eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    setMensaje("");
    setError("");
    setEliminandoId(producto.id);

    try {

      await deleteDoc(doc(db, "productos", producto.id));

      setProductos((prevProductos) =>
        prevProductos.filter((item) => item.id !== producto.id)
      );

      if (productoEditando === producto.id) {
        limpiarFormulario();
      }

      setMensaje("Producto eliminado correctamente.");

    } catch (error) {

      console.error("Error al eliminar el producto:", error);
      setError("No se pudo eliminar el producto.");

    } finally {

      setEliminandoId(null);

    }
  };


  // Indicador de carga.
  if (cargando) {
    return (
      <p className="mensaje-cargando-admin">
        Cargando productos...
      </p>
    );
  }

  if (error && productos.length === 0) {
    return (
      <p className="mensaje-error-admin">
        {error}
      </p>
    );
  }


  return (

    <section className="admin-productos">

      {/* ENCABEZADO DEL PANEL */}
      <div className="encabezado-admin-productos">

        <h1>Panel de administración</h1>

        <p>
          Administrá los productos de FiestaBox.
        </p>

      </div>


      {/* FORMULARIO DE PRODUCTOS */}
      <div className="panel-formulario-admin">

        <h2>
          {productoEditando
            ? "Editar producto"
            : "Agregar nuevo producto"}
        </h2>

        <form
          className="formulario-admin-productos"
          onSubmit={guardarProducto}
          noValidate
        >

          <div className="campo-admin">
            <label htmlFor="nombre-producto">
              Nombre del producto
            </label>

            <input
              type="text"
              id="nombre-producto"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
              placeholder="Ejemplo: Globos metalizados"
            />
          </div>


          <div className="campo-admin">
            <label htmlFor="precio-producto">
              Precio
            </label>

            <input
              type="number"
              id="precio-producto"
              name="precio"
              value={formulario.precio}
              onChange={manejarCambio}
              min="1"
              required
              placeholder="Ingresá el precio"
            />
          </div>


          <div className="campo-admin">
            <label htmlFor="descripcion-producto">
              Descripción
            </label>

            <textarea
              id="descripcion-producto"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Describí las características del producto..."
            />
          </div>


          <div className="campo-admin">
            <label htmlFor="imagen-producto">
              URL de la imagen
            </label>

            <input
              type="text"
              id="imagen-producto"
              name="imagen"
              value={formulario.imagen}
              onChange={manejarCambio}
              required
              placeholder="Pegá la URL de la imagen"
            />
          </div>


          <div className="campo-disponibilidad-admin">

            <label htmlFor="disponible-producto">
              <input
                type="checkbox"
                id="disponible-producto"
                name="disponible"
                checked={formulario.disponible}
                onChange={manejarCambio}
              />

              Producto disponible

            </label>

          </div>


          {/* BOTONES DEL FORMULARIO */}
          <div className="acciones-formulario-admin">

            <button
              type="submit"
              className="boton-guardar-admin"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : productoEditando
                  ? "Guardar cambios"
                  : "Agregar producto"}
            </button>

            {productoEditando && (

              <button
                type="button"
                className="boton-cancelar-admin"
                onClick={limpiarFormulario}
              >
                Cancelar edición
              </button>

            )}

          </div>

        </form>

      </div>


      {/* MENSAJES DEL SISTEMA */}
      {mensaje && (
        <p className="mensaje-exito-admin" role="status">
          {mensaje}
        </p>
      )}

      {error && (
        <p className="mensaje-error-admin" role="alert">
          {error}
        </p>
      )}


      {/* LISTADO DE PRODUCTOS */}
      <div className="seccion-productos-admin">

        <h2>
          Productos registrados ({productos.length})
        </h2>

        {productos.length === 0 ? (

          <p>Todavía no hay productos registrados.</p>

        ) : (

          <div className="lista-productos-admin">

            {productos.map((producto) => (

              <article
                key={producto.id}
                className="tarjeta-admin-producto"
              >

                {/* IMAGEN */}
                <div className="imagen-admin-producto">

                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                </div>


                {/* INFORMACIÓN */}
                <div className="informacion-admin-producto">

                  <h3>{producto.nombre}</h3>

                  <p className="precio-admin-producto">
                    ${Number(producto.precio).toLocaleString("es-AR")}
                  </p>

                  <p className="descripcion-admin-producto">
                    {producto.descripcion}
                  </p>

                  <span className={
                    producto.disponible
                      ? "estado-producto-admin disponible"
                      : "estado-producto-admin no-disponible"
                  }>
                    {producto.disponible
                      ? "Disponible"
                      : "No disponible"}
                  </span>

                </div>


                {/* ACCIONES */}
                <div className="acciones-producto-admin">

                  <button
                    type="button"
                    className="boton-editar-admin"
                    onClick={() => editarProducto(producto)}
                  >
                    Editar producto
                  </button>

                  <button
                    type="button"
                    className="boton-eliminar-admin"
                    onClick={() => eliminarProducto(producto)}
                    disabled={eliminandoId !== null}
                  >
                    {eliminandoId === producto.id
                      ? "Eliminando..."
                      : "Eliminar producto"}
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default AdminProductos;

