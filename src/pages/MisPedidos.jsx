
import { useState, useEffect, useContext } from "react";

// Importamos el contexto de autenticación.
import { AuthContext } from "../context/AuthContextValue";

// Importamos las funciones de Firestore.
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

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

// Convertimos el estado interno en un texto visible.
const mostrarEstado = (estado) => {

  const estados = {
    pendiente: "Pendiente",
    preparando: "En preparación",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado"
  };

  return estados[estado] || estado;
};

function MisPedidos() {

  // Recuperamos el usuario autenticado.
  const { usuario, cargando: cargandoAuth } = useContext(AuthContext);

  // Estados de los pedidos.
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Consultamos solamente los pedidos del cliente actual.
  useEffect(() => {

    let cancelado = false;

    const obtenerPedidos = async () => {

      if (cargandoAuth) {
        return;
      }

      if (!usuario) {
        setPedidos([]);
        setCargando(false);
        return;
      }

      setCargando(true);
      setError("");

      try {

        // Filtramos los pedidos utilizando el UID del cliente.
        const consulta = query(
          collection(db, "pedidos"),
          where("usuarioId", "==", usuario.uid)
        );

        const resultado = await getDocs(consulta);

        const pedidosObtenidos = resultado.docs.map((documento) => ({
          ...documento.data(),
          id: documento.id
        }));

        // Ordenamos desde el pedido más reciente.
        pedidosObtenidos.sort(
          (a, b) =>
            (b.fecha?.seconds ?? 0) - (a.fecha?.seconds ?? 0)
        );

        if (!cancelado) {
          setPedidos(pedidosObtenidos);
        }

      } catch (error) {

        console.error("Error al obtener los pedidos:", error);

        if (!cancelado) {
          setError("No se pudieron cargar tus pedidos.");
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

  }, [usuario, cargandoAuth]);


  // Indicador de carga.
  if (cargando || cargandoAuth) {
    return <p>Cargando tus pedidos...</p>;
  }

  // Mensaje de error.
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="mis-pedidos">

      <h1>Mis pedidos</h1>

      <p>Consultá tus compras y el estado de cada pedido.</p>

      {pedidos.length === 0 ? (

        <p>Todavía no realizaste ninguna compra.</p>

      ) : (

        <>

          <h2>Mis compras: {pedidos.length}</h2>

          {pedidos.map((pedido) => (

            <article key={pedido.id} className="pedido-cliente">

              <h3>Pedido: {pedido.id}</h3>

              <p>
                <strong>Fecha:</strong> {formatearFecha(pedido.fecha)}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                <span className={`estado-${pedido.estado}`}>
                  {mostrarEstado(pedido.estado)}
                </span>
              </p>

              <h4>Productos</h4>

              <ul>

                {pedido.productos.map((producto, indice) => (

           
    <li
      key={`${producto.productoId}-${indice}`}
      className="producto-pedido-cliente"
      >

      {/* Miniatura del producto. */}
      {producto.imagen ? (

        <img
        src={producto.imagen}
        alt={producto.nombre}
        className="miniatura-pedido"
        />

      ) : (

        <div className="miniatura-pedido-vacia">
          Sin imagen
        </div>

      )}

  {/* Información del producto. */}
  <div className="datos-producto-pedido">

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
                Total de la compra: {formatearPrecio(pedido.total)}
              </h3>

            </article>

          ))}

        </>

      )}

    </section>
  );
}

export default MisPedidos;
