

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Item from "./Item";

/*---------------------- READ (CRUD) ----------------------*/

function ItemListContainer() {

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Recuperamos el término de búsqueda desde la URL.
  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get("buscar") || "";

  // Normalizamos el texto para ignorar acentos y mayúsculas.
  const normalizarTexto = (texto) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Filtramos los productos utilizando los textos normalizados.
  const productosFiltrados = productos.filter((producto) =>
    normalizarTexto(producto.nombre).includes(normalizarTexto(busqueda))
  );

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
        setError("No se pudieron cargar los productos. Intentá nuevamente más tarde.");

      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();

  }, []);

  if (cargando) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (productos.length === 0) {
    return <p>No hay productos disponibles en este momento.</p>;
  }

  return (
    <div>

      <h2>Productos</h2>

      {busqueda && (
        <p>Resultados para: "{busqueda}"</p>
      )}

      {productosFiltrados.length === 0 ? (

        <p>No se encontraron productos que coincidan con tu búsqueda.</p>

      ) : (

        <div className="contenedor-productos">

          {productosFiltrados.map((producto) => (
            <Item
              key={producto.id}
              producto={producto}
            />
          ))}

        </div>

      )}

    </div>
  );
}

export default ItemListContainer;
