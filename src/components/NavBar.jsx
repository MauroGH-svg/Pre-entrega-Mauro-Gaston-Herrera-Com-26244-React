
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Importamos los contextos.
import { AuthContext } from "../context/AuthContextValue";
import { CarritoContext } from "../context/CarritoContextValue";

// Importamos Firestore.
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// Normalizamos los textos para ignorar acentos y mayúsculas.
const normalizarTexto = (texto) => {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

function NavBar() {

  // Recuperamos los datos de autenticación.
  const { usuario, rol, cargando } = useContext(AuthContext);

  // Recuperamos los datos del carrito.
  const { totalProductos, carritoListo } = useContext(CarritoContext);

  // Estados del buscador y del menú.
  const [busqueda, setBusqueda] = useState(() => {
  if (window.location.pathname === "/productos") {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("buscar") || "";
  }

  return "";
    });
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productos, setProductos] = useState([]);

  // Herramientas de navegación.
  const navigate = useNavigate();


  // Obtenemos los productos de Firestore.
  useEffect(() => {

    let cancelado = false;

    const obtenerProductos = async () => {

      try {
        const consulta = await getDocs(collection(db, "productos"));

        const productosObtenidos = consulta.docs.map((documento) => ({
          ...documento.data(),
          id: documento.id
        }));

        if (!cancelado) {
          setProductos(productosObtenidos);
        }

      } catch (error) {
        console.error("Error al cargar productos para el buscador:", error);
      }

    };

    obtenerProductos();

    return () => {
      cancelado = true;
    };

  }, []);



  // Filtramos las sugerencias mientras el usuario escribe.
  const productosSugeridos = busqueda.trim().length >= 2
    ? productos
        .filter((producto) =>
          normalizarTexto(producto.nombre || "").includes(
            normalizarTexto(busqueda.trim())
          )
        )
        .sort((a, b) => {

          const textoBuscado = normalizarTexto(busqueda.trim());

          const empiezaA = normalizarTexto(a.nombre || "").startsWith(textoBuscado);
          const empiezaB = normalizarTexto(b.nombre || "").startsWith(textoBuscado);

          return Number(empiezaB) - Number(empiezaA);
        })
        .slice(0, 6)
    : [];


  // Cerramos el menú.
  const cerrarMenu = () => {
    setMenuAbierto(false);
    setBuscadorAbierto(false);
  };


  // Procesamos la búsqueda completa.
  const manejarBusqueda = (e) => {

    e.preventDefault();

    const termino = busqueda.trim();

    setBuscadorAbierto(false);
    setMenuAbierto(false);

    if (termino) {
      navigate(`/productos?buscar=${encodeURIComponent(termino)}`);
    } else {
      navigate("/productos");
    }

  };


  // Seleccionamos un producto de las sugerencias.
  const seleccionarProducto = (producto) => {

    setBusqueda("");
    setBuscadorAbierto(false);
    setMenuAbierto(false);

    navigate(`/producto/${producto.id}`);

  };


  return (
    <nav
      className={`navbar ${menuAbierto ? "menu-abierto" : ""}`}
      aria-label="Navegación principal"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setMenuAbierto(false);
          setBuscadorAbierto(false);
        }
      }}
    >

      {/* BOTÓN DEL MENÚ HAMBURGUESA */}
      <button
        type="button"
        className={`boton-menu ${menuAbierto ? "activo" : ""}`}
        onClick={() => {
          setMenuAbierto((prev) => !prev);
          setBuscadorAbierto(false);
        }}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
      >
        <span className="linea-menu"></span>
        <span className="linea-menu"></span>
        <span className="linea-menu"></span>
      </button>


      {/* ENLACES DE NAVEGACIÓN */}
      <div
        className="navbar-enlaces"
        id="menu-principal"
      >

        {!cargando && (
          <>

            <Link to="/" onClick={cerrarMenu}>
              Inicio
            </Link>

            {/* Visitantes */}
            {!usuario && (
              <Link to="/productos" onClick={cerrarMenu}>
                Productos
              </Link>
            )}

            {/* Clientes */}
            {usuario && rol === "cliente" && (
              <>
                <Link to="/productos" onClick={cerrarMenu}>
                  Productos
                </Link>

                <Link to="/mis-pedidos" onClick={cerrarMenu}>
                  Mis pedidos
                </Link>
              </>
            )}

            {/* Administradores */}
            {usuario && rol === "admin" && (
              <>
                <Link to="/admin" onClick={cerrarMenu}>
                  Panel de administración
                </Link>

                <Link to="/admin/pedidos" onClick={cerrarMenu}>
                  Pedidos
                </Link>
              </>
            )}

          </>
        )}

      </div>


      {/* CONTROLES DEL NAVBAR */}
      <div className="navbar-controles">

        {/* CARRITO DEL CLIENTE */}
        {!cargando && usuario && rol === "cliente" && carritoListo && (

          <Link
            to="/carrito"
            className="enlace-carrito"
            aria-label={`Carrito de compras: ${totalProductos} unidades`}
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            {totalProductos > 0 && (
              <span className="contador-carrito">
                {totalProductos}
              </span>
            )}

          </Link>

        )}


        {/* BUSCADOR GLOBAL */}
        <div className={`contenedor-buscador ${buscadorAbierto ? "abierto" : ""}`}>

          <button
            type="button"
            className="boton-lupa"
            onClick={() => {
              setBuscadorAbierto((prev) => !prev);
              setMenuAbierto(false);
            }}
            aria-label={buscadorAbierto ? "Cerrar buscador" : "Abrir buscador"}
            aria-expanded={buscadorAbierto}
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

          </button>


          <form
            className="formulario-buscador"
            onSubmit={manejarBusqueda}
          >

            <input
              type="search"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar productos"
              autoComplete="off"
            />

            <button type="submit">
              Buscar
            </button>

          </form>


          {/* SUGERENCIAS PREDICTIVAS */}
          {productosSugeridos.length > 0 && (

            <div className="lista-sugerencias">

              {productosSugeridos.map((producto) => (

                <button
                  type="button"
                  key={producto.id}
                  onClick={() => seleccionarProducto(producto)}
                  className="sugerencia-producto"
                >

                  <img
                    src={producto.imagen}
                    alt=""
                  />

                  <span className="sugerencia-info">

                    <span className="sugerencia-nombre">
                      {producto.nombre}
                    </span>

                    <span className="sugerencia-precio">
                      ${Number(producto.precio).toLocaleString("es-AR")}
                    </span>

                  </span>

                </button>

              ))}

            </div>

          )}

        </div>

      </div>

    </nav>
  );
}

export default NavBar;
