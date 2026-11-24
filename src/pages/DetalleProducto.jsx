
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

// Importamos las funciones de Firestore.
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Importamos los contextos globales.
import { AuthContext } from "../context/AuthContextValue";
import { CarritoContext } from "../context/CarritoContextValue";

function DetalleProducto() {

  const { id } = useParams();

  // Datos del producto.
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Cantidad seleccionada y mensaje de confirmación.
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");

  // Recuperamos los datos de autenticación.
  const { usuario, rol, cargando: cargandoAuth } = useContext(AuthContext);

  // Recuperamos la función para agregar productos al carrito.
  const { agregarAlCarrito, carritoListo } = useContext(CarritoContext);

  useEffect(() => {

    let cancelado = false;

    const obtenerProducto = async () => {

      setCargando(true);
      setError("");
      setProducto(null);
      setCantidad(1);
      setMensaje("");

      try {
        // Buscamos el documento utilizando su ID de Firestore.
        const referencia = doc(db, "productos", id);
        const documento = await getDoc(referencia);

        if (!cancelado) {
          if (documento.exists()) {

            setProducto({
              ...documento.data(),
              id: documento.id
            });

          } else {
            setError("No se encontró el producto solicitado.");
          }
        }

      } catch (error) {
        console.error("Error al obtener el producto:", error);

        if (!cancelado) {
          setError("No se pudo cargar el producto. Intentá nuevamente.");
        }

      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    obtenerProducto();

    return () => {
      cancelado = true;
    };

  }, [id]);


  // Agregamos la cantidad seleccionada al carrito.
  const manejarAgregarAlCarrito = () => {

    agregarAlCarrito(producto, cantidad);

    setMensaje(
      `Agregaste ${cantidad} unidad${cantidad > 1 ? "es" : ""} de ${producto.nombre} al carrito.`
    );

  };


  // Indicador de carga.
  if (cargando) {
    return <p>Cargando producto...</p>;
  }

  // Mensaje de error.
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="detalle-producto">

      <h1>{producto.nombre}</h1>

      <img
        src={producto.imagen}
        alt={producto.nombre}
      />

      <p className="detalle-precio">
        ${producto.precio}
      </p>

      <p>{producto.descripcion}</p>

      {/* Opciones de compra exclusivas para clientes. */}
      {!cargandoAuth && usuario && rol === "cliente" && carritoListo && (

        <div className="acciones-compra">

          {producto.disponible === false ? (

            <p>Producto no disponible actualmente.</p>

          ) : (

            <>
              <p>Seleccioná la cantidad:</p>

              <div className="selector-cantidad">

                <button
                  type="button"
                  onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                  disabled={cantidad <= 1}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>

                <span>{cantidad}</span>

                <button
                  type="button"
                  onClick={() => setCantidad((prev) => prev + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>

              </div>

              <button
                type="button"
                onClick={manejarAgregarAlCarrito}
              >
                Agregar al carrito
              </button>

              {mensaje && (
                <p role="status">{mensaje}</p>
              )}

            </>

          )}

        </div>

      )}

      {/* Los visitantes pueden iniciar sesión para comprar. */}
      {!cargandoAuth && !usuario && (
        <Link to="/login">
          Iniciá sesión para comprar
        </Link>
      )}

      <div>
        <Link to="/productos">
          Volver a productos
        </Link>
      </div>

    </div>
  );
}

export default DetalleProducto;

