
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      {/* CONTENIDO PRINCIPAL */}
      <div className="footer-contenido">

        {/* IDENTIDAD DE LA TIENDA */}
        <section className="footer-marca">

          <h2>FiestaBox</h2>

          <p>
            Productos para hacer especial cada celebración.
          </p>

        </section>


        {/* NAVEGACIÓN */}
        <section className="footer-seccion">

          <h3>Explorá FiestaBox</h3>

          <nav className="footer-enlaces">
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Registrarse</Link>
          </nav>

        </section>


        {/* INFORMACIÓN DE CONTACTO */}
        <section className="footer-seccion">

          <h3>Información</h3>

          <a href="mailto:contacto@fiestabox.com">
            contacto@fiestabox.com
          </a>

          <p>
            Protegemos la información de nuestros clientes.
          </p>

        </section>


        {/* EQUIPO */}
        <section className="footer-seccion">

          <h3>Nuestro equipo</h3>

          <div className="equipo">

            <article className="miembro">
              <h4>Mauro Herrera</h4>
              <p>Desarrollador</p>
            </article>

            <article className="miembro">
              <h4>Integrante 2</h4>
              <p>Desarrollador</p>
            </article>

            <article className="miembro">
              <h4>Integrante 3</h4>
              <p>Desarrollador</p>
            </article>

          </div>

        </section>

      </div>


      {/* PIE FINAL */}
      <div className="footer-base">

        <p>
          © {new Date().getFullYear()} FiestaBox - Todos los derechos reservados.
        </p>

      </div>

    </footer>
  );
}

export default Footer;
