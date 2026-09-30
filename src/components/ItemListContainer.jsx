import { useState, useEffect } from "react";
import Item from "./Item";

function ItemListContainer() {

  const [productos, setProductos] = useState([]);

  useEffect(() => {

    fetch("/productos.json")
      .then(response => response.json())
      .then(data => {
        setProductos(data);
      });

  }, []);

  return (
    <div>
      <h2>Productos</h2>

      <div className="contenedor-productos">
        {productos.map(producto => (
          <Item
            key={producto.id}
            producto={producto}
          />
        ))}
      </div>
    </div>
  );
}

export default ItemListContainer;