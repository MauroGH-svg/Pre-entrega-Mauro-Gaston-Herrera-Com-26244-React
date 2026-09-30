function Footer() {
  return (
    <footer className="footer">
      <h2>FiestaBox</h2>

      <p>Productos para hacer especial cada celebración.</p>

      <h3>Información</h3>

      <p>Contacto: contacto@fiestabox.com</p>
      <p>Privacidad: Protegemos la información de nuestros clientes.</p>
      <p>© 2026 FiestaBox - Todos los derechos reservados.</p>
      <p>Newsletter: Suscribite para recibir novedades y promociones.</p>

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
    </footer>
  );
}

export default Footer;