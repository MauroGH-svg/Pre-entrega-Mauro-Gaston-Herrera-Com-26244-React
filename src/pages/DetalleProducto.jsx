import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function DetalleProducto() {

  const { id } = useParams();

  const [producto, setProducto] = useState(null);

  useEffect(() => {

    fetch("/productos.json")
      .then(response => response.json())
      .then(data => {

        const productoEncontrado = data.find(
          producto => producto.id === Number(id)
        );

        setProducto(productoEncontrado);

      });

  }, [id]);

  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  return (
  <div className="detalle-producto">
    <h1>{producto.nombre}</h1>

    <p className="detalle-precio">
      ${producto.precio}
    </p>

    <p>{producto.descripcion}</p>

    <Link to="/productos">
      Volver a productos
    </Link>
  </div>
);
}

export default DetalleProducto;