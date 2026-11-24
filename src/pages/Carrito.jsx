
import { useContext, useState } from "react";

// Importamos los contextos globales.
import { CarritoContext } from "../context/CarritoContextValue";
import { AuthContext } from "../context/AuthContextValue";

// Importamos las funciones de Firestore.
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

function Carrito() {

  // Obtenemos los datos y funciones del carrito.
  const {
    carrito,
    eliminarDelCarrito,
    cambiarCantidad,
    vaciarCarrito,
    total,
    carritoListo
  } = useContext(CarritoContext);

  // Obtenemos los datos del usuario autenticado.
  const { usuario } = useContext(AuthContext);

  // Estados para controlar el proceso de compra.
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Registramos el pedido en Firestore.
// Registramos el pedido en Firestore.
const realizarCompra = async () => {

  // Evitamos ejecutar dos compras al mismo tiempo.
  if (procesando) return;

  // Limpiamos los mensajes anteriores.
  setMensaje("");
  setError("");

  // Verificamos que el carrito tenga productos.
  if (!Array.isArray(carrito) || carrito.length === 0) {
    setError("El carrito está vacío.");
    return;
  }

  // Verificamos que el usuario haya iniciado sesión.
  if (!usuario) {
    setError("Necesitás iniciar sesión para realizar una compra.");
    return;
  }

  // Comprobamos que todos los productos tengan datos válidos.
  const carritoInvalido = carrito.some((producto) => {
    if (!producto) return true;

    const precio = Number(producto.precio);
    const cantidad = Number(producto.cantidad);

    return (
      typeof producto.id !== "string" ||
      producto.id.trim() === "" ||
      typeof producto.nombre !== "string" ||
      producto.nombre.trim() === "" ||
      !Number.isFinite(precio) ||
      precio <= 0 ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    );
  });

  // Si encontramos datos incorrectos, detenemos la compra.
  if (carritoInvalido) {
    setError("Hay productos con datos inválidos en el carrito.");
    return;
  }

  // Activamos el estado de procesamiento.
  setProcesando(true);
  setMensaje("");
  setError("");

    try {

      
      // Preparamos los productos que formarán parte del pedido.
  const productosPedido = carrito.map((producto) => {
  const precio = Number(producto.precio);
  const cantidad = Number(producto.cantidad);

    return {
      productoId: producto.id,
       nombre: producto.nombre,
      imagen: producto.imagen,
       precio,
       cantidad,
       subtotal: precio * cantidad
          };
      });

// Calculamos el total sumando los subtotales.
const totalPedido = productosPedido.reduce(
  (acumulador, producto) => acumulador + producto.subtotal,
  0
);

// Verificamos que el total sea un número válido y positivo.

if (!Number.isFinite(totalPedido) || totalPedido <= 0) {
  throw new Error("El total calculado no es válido.");
}

      // Guardamos el pedido en Firestore.
      const documento = await addDoc(collection(db, "pedidos"), {

        usuarioId: usuario.uid,
        email: usuario.email,
        productos: productosPedido,
        total: totalPedido,
        estado: "pendiente",
        fecha: serverTimestamp()

      });

      // Confirmamos el pedido y mostramos su identificador.
      setMensaje(
        `¡Compra registrada correctamente! Número de pedido: ${documento.id}`
      );

      // Vaciamos el carrito únicamente después de guardar el pedido.
      vaciarCarrito();

    } catch (error) {

      console.error("Error al registrar el pedido:", error);

      setError(
        "No se pudo registrar tu pedido. Intentá nuevamente."
      );

    } finally {

      setProcesando(false);

    }
  };


  // Esperamos a que se recupere el carrito.
  if (!carritoListo) {
    return <p>Cargando carrito...</p>;
  }

  return (
    <div className="carrito">

      <h2>Carrito de compras</h2>

      {/* Mensaje de confirmación del pedido. */}
      {mensaje && <p role="status">{mensaje}</p>}

      {/* Mensaje de error. */}
      {error && <p role="alert">{error}</p>}

      {/* Comprobamos si el carrito está vacío. */}
      {carrito.length === 0 ? (

        <p>Tu carrito está vacío.</p>

      ) : (

        <>

          {/* Recorremos el array para mostrar cada producto. */}
          {carrito.map((producto) => (

            <div key={producto.id} className="item-carrito">

              {/* Imagen del producto. */}
              <img
                src={producto.imagen}
                alt={producto.nombre}
              />

              {/* Nombre y precio unitario. */}
              <h3>{producto.nombre}</h3>

              <p>Precio unitario: ${producto.precio}</p>

              {/* Controles para modificar la cantidad. */}
              <div className="controles-cantidad">

                <button
                  type="button"
                  onClick={() => cambiarCantidad(producto.id, -1)}
                  disabled={procesando}
                >
                  -
                </button>

                <span>Cantidad: {producto.cantidad}</span>

                <button
                  type="button"
                  onClick={() => cambiarCantidad(producto.id, 1)}
                  disabled={procesando}
                >
                  +
                </button>

              </div>

              {/* Calculamos el subtotal del producto. */}
              <p>
                Subtotal: ${producto.precio * producto.cantidad}
              </p>

              {/* Eliminamos completamente el producto. */}
              <button
                type="button"
                onClick={() => eliminarDelCarrito(producto.id)}
                disabled={procesando}
              >
                Eliminar
              </button>

            </div>

          ))}

          {/* Mostramos el total de la compra. */}
          <h3>Total de la compra: ${total}</h3>

          {/* Procesamos la compra. */}
          <button
            type="button"
            onClick={realizarCompra}
            disabled={procesando || carrito.length === 0}
          >
            {procesando ? "Procesando compra..." : "Realizar compra"}
          </button>

          {/* Vaciamos todos los productos del carrito. */}
          <button
            type="button"
            onClick={vaciarCarrito}
            disabled={procesando}
          >
            Vaciar carrito
          </button>

        </>

      )}

    </div>
  );
}

export default Carrito;
