
import { useState, useEffect } from "react";

// Importamos las funciones de Firestore.
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Formateamos los importes en pesos argentinos.
const formatearPrecio = (precio) => {
  return Number(precio ?? 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
};

// Formateamos la fecha del pedido.
const formatearFecha = (fecha) => {
  if (!fecha?.toDate) {
    return "Fecha no disponible";
  }

  return fecha.toDate().toLocaleString("es-AR");
};

function AdminPedidos() {

  // Estados para controlar los pedidos.
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Controlamos qué pedido se está actualizando.
    const [actualizandoId, setActualizandoId] = useState(null);

  // Mensaje de confirmación.
    const [mensaje, setMensaje] = useState("");

    // Actualizamos el estado de un pedido en Firestore.
    const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {

  setActualizandoId(pedidoId);
  setMensaje("");
  setError("");

  try {

    await updateDoc(
      doc(db, "pedidos", pedidoId),
      {
        estado: nuevoEstado
      }
    );

    // Actualizamos la lista sin volver a consultar Firestore.
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === pedidoId
          ? { ...pedido, estado: nuevoEstado }
          : pedido
      )
    );

    setMensaje("Estado del pedido actualizado correctamente.");

    } catch (error) {

    console.error("Error al actualizar el pedido:", error);
    setError("No se pudo actualizar el estado del pedido.");

     } finally {

    setActualizandoId(null);

     }
    };

  // Consultamos los pedidos registrados en Firestore.
  useEffect(() => {

    let cancelado = false;

    const obtenerPedidos = async () => {

      try {
        const consulta = await getDocs(collection(db, "pedidos"));

        const pedidosObtenidos = consulta.docs.map((documento) => ({
          ...documento.data(),
          id: documento.id
        }));

        // Ordenamos los pedidos desde el más reciente.
        pedidosObtenidos.sort(
          (a, b) => (b.fecha?.seconds ?? 0) - (a.fecha?.seconds ?? 0)
        );

        if (!cancelado) {
          setPedidos(pedidosObtenidos);
        }

      } catch (error) {
        console.error("Error al obtener los pedidos:", error);

        if (!cancelado) {
          setError("No se pudieron cargar los pedidos.");
        }

      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    obtenerPedidos();

    return () => {
      cancelado = true;
    };

  }, []);

  // Indicador de carga.
  if (cargando) {
    return <p>Cargando pedidos...</p>;
  }

  // Mensaje de error.
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="admin-pedidos">

      <h1>Administración de pedidos</h1>

      <p>Pedidos recibidos en FiestaBox.</p>

        {mensaje && <p role="status">{mensaje}</p>}
        {error && <p role="alert">{error}</p>}

      {/* Comprobamos si existen pedidos. */}
      {pedidos.length === 0 ? (

        <p>Todavía no hay pedidos registrados.</p>

      ) : (

        <>

          <h2>Pedidos recibidos: {pedidos.length}</h2>

          {/* Recorremos todos los pedidos. */}
          {pedidos.map((pedido) => (

            <article key={pedido.id} className="pedido-admin">

              <h3>Pedido: {pedido.id}</h3>

              <p>
                <strong>Cliente:</strong> {pedido.email}
              </p>

              <p>
                <strong>Fecha:</strong> {formatearFecha(pedido.fecha)}
              </p>

             <div className="estado-pedido">

     <label htmlFor={`estado-${pedido.id}`}>
     Estado del pedido:
     </label>

    <select
    id={`estado-${pedido.id}`}
    value={pedido.estado}
    onChange={(e) =>
      cambiarEstadoPedido(pedido.id, e.target.value)
    }
    disabled={actualizandoId === pedido.id}
    >

    <option value="pendiente">Pendiente</option>
    <option value="preparando">En preparación</option>
    <option value="enviado">Enviado</option>
    <option value="entregado">Entregado</option>
    <option value="cancelado">Cancelado</option>

    </select>

    {actualizandoId === pedido.id && (
        <p>Actualizando estado...</p>
    )}

    </div>

              <h4>Productos del pedido</h4>

              <ul>

                {pedido.productos.map((producto, indice) => (


      <li
         key={`${producto.productoId}-${indice}`}
         className="producto-pedido-admin"
        >

        {/* Miniatura del producto. */}
          {producto.imagen ? (

        <img
         src={producto.imagen}
         alt={producto.nombre}
         className="miniatura-pedido-admin"
        />

       ) : (

       <div className="miniatura-pedido-admin-vacia">
       Sin imagen
       </div>

        )}

       {/* Información del producto. */}
      <div className="datos-producto-pedido-admin">

       <strong>{producto.nombre}</strong>

      <p>Cantidad: {producto.cantidad}</p>

      <p>
        Precio unitario: {formatearPrecio(producto.precio)}
      </p>

      <p>
       Subtotal: {formatearPrecio(producto.subtotal)}
     </p>

     </div>

    </li>


                ))}

              </ul>

              <h3>
                Total del pedido: {formatearPrecio(pedido.total)}
              </h3>

            </article>

          ))}

        </>

      )}

    </section>
  );
}

export default AdminPedidos;
