import { Link } from "react-router-dom";

function Item({ producto }) {
  return (
    <div className="card-producto">

      <img 
        src={producto.imagen} 
        alt={producto.nombre} 
      />

      <h3>{producto.nombre}</h3>

      <p>${producto.precio}</p>

      <p>{producto.descripcion}</p>

      <div className="acciones-producto"></div>

      <Link to={`/producto/${producto.id}`}>
        Ver detalle
        <button>
           🛒 Agregar al carrito
        </button>
      </Link>

    </div>
  );
}

export default Item;