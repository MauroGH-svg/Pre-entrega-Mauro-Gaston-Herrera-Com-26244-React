
import { useState, useEffect, useContext } from "react";

// Importamos los contextos.
import { AuthContext } from "./AuthContextValue";
import { CarritoContext } from "./CarritoContextValue";

export function CarritoProvider({ children }) {

  // Recuperamos el usuario y el estado de autenticación.
  const { usuario, cargando: cargandoAuth } = useContext(AuthContext);

  // Creamos una clave diferente para cada usuario.
  const claveCarrito = usuario
    ? `carrito_${usuario.uid}`
    : "carrito_invitado";

  // Renderizamos el carrito correspondiente a cada usuario.
  return (
    <CarritoInterno
      key={claveCarrito}
      claveCarrito={claveCarrito}
      cargandoAuth={cargandoAuth}
    >
      {children}
    </CarritoInterno>
  );
}

function CarritoInterno({ children, claveCarrito, cargandoAuth }) {

  // Recuperamos el carrito directamente al inicializar el estado.
  const [carrito, setCarrito] = useState(() => {

    try {
      const carritoGuardado = localStorage.getItem(claveCarrito);

      if (carritoGuardado) {
        const carritoParseado = JSON.parse(carritoGuardado);

        return Array.isArray(carritoParseado)
          ? carritoParseado
          : [];
      }

      return [];

    } catch (error) {
      console.error("Error al recuperar el carrito:", error);
      return [];
    }

  });

  // Indicamos si el carrito puede utilizarse.
  const carritoListo = !cargandoAuth;

  // Mientras se verifica la autenticación, no mostramos datos anteriores.
  const carritoActual = carritoListo ? carrito : [];

  // Guardamos el carrito correspondiente al usuario.
  useEffect(() => {

    if (!carritoListo) {
      return;
    }

    try {
      localStorage.setItem(
        claveCarrito,
        JSON.stringify(carrito)
      );

    } catch (error) {
      console.error("Error al guardar el carrito:", error);
    }

  }, [carrito, claveCarrito, carritoListo]);


  // Agregamos un producto con la cantidad seleccionada.
  const agregarAlCarrito = (producto, cantidad = 1) => {

    const cantidadAgregar = Math.max(
      1,
      Math.floor(Number(cantidad) || 1)
    );

    setCarrito((prevCarrito) => {

      const productoExistente = prevCarrito.find(
        (item) => item.id === producto.id
      );

      if (productoExistente) {

        return prevCarrito.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidadAgregar
              }
            : item
        );

      }

      return [
        ...prevCarrito,
        { ...producto, cantidad: cantidadAgregar }
      ];

    });
  };


  // Eliminamos un producto según su ID.
  const eliminarDelCarrito = (id) => {

    setCarrito((prevCarrito) =>
      prevCarrito.filter((producto) => producto.id !== id)
    );

  };


  // Aumentamos o disminuimos la cantidad.
  const cambiarCantidad = (id, cambio) => {

    setCarrito((prevCarrito) =>
      prevCarrito
        .map((producto) =>
          producto.id === id
            ? { ...producto, cantidad: producto.cantidad + cambio }
            : producto
        )
        .filter((producto) => producto.cantidad > 0)
    );

  };


  // Vaciamos completamente el carrito.
  const vaciarCarrito = () => {

    setCarrito([]);

  };


  // Calculamos la cantidad total de unidades.
  const totalProductos = carritoActual.reduce(
    (acumulador, producto) =>
      acumulador + producto.cantidad,
    0
  );


  // Calculamos el importe total de la compra.
  const total = carritoActual.reduce(
    (acumulador, producto) =>
      acumulador + producto.precio * producto.cantidad,
    0
  );


  // Compartimos los datos y funciones con los componentes hijos.
  return (
    <CarritoContext.Provider
      value={{
        carrito: carritoActual,
        agregarAlCarrito,
        eliminarDelCarrito,
        cambiarCantidad,
        vaciarCarrito,
        total,
        totalProductos,
        carritoListo
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
