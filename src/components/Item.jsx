
import { useContext } from "react";
import { Link } from "react-router-dom";

// Importamos los contextos globales.
import { CarritoContext } from "../context/CarritoContextValue";
import { AuthContext } from "../context/AuthContextValue";

function Item({ producto }) {

  // Recuperamos la función para agregar productos al carrito.
  const { agregarAlCarrito } = useContext(CarritoContext);

  // Recuperamos los datos de autenticación.
  const { usuario, rol, cargando } = useContext(AuthContext);

  // Comprobamos la disponibilidad del producto.
  const disponible = producto.disponible !== false;

  // Formateamos el precio.
  const precioFormateado = Number(producto.precio).toLocaleString("es-AR");

  return (
    <article className="card-producto">

      {/* Contenedor de la imagen. */}
      <div className="imagen-producto">

        <img
          src={producto.imagen}
          alt={producto.nombre}
        />

        {/* Indicamos cuando el producto no está disponible. */}
        {!disponible && (
          <span className="etiqueta-agotado">
            No disponible
          </span>
        )}

      </div>

      {/* Información del producto. */}
      <div className="informacion-producto">

        <h3 className="nombre-producto">
          {producto.nombre}
        </h3>

        <p className="precio-producto">
          ${precioFormateado}
        </p>

        <p className="descripcion-producto">
          {producto.descripcion}
        </p>

      </div>

      {/* Acciones del producto. */}
      <div className="acciones-producto">

        {/* Permite consultar el detalle. */}
        <Link
          to={`/producto/${producto.id}`}
          className="boton-detalle"
        >
          Ver detalle
        </Link>

        {/* Opciones exclusivas para clientes. */}
        {!cargando && usuario && rol === "cliente" && (

          disponible ? (

            <button
              type="button"
              className="boton-agregar"
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>

          ) : (

            <p className="mensaje-no-disponible">
              Producto no disponible
            </p>

          )

        )}

        {/* Opciones para visitantes. */}
        {!cargando && !usuario && (

          disponible ? (

            <Link
              to="/login"
              className="boton-iniciar-sesion"
            >
              Iniciá sesión para comprar
            </Link>

          ) : (

            <p className="mensaje-no-disponible">
              Producto no disponible
            </p>

          )

        )}

      </div>

    </article>
  );
}

export default Item;
