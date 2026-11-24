
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

// Imágenes y textos del carrusel.
const eventos = [
  {
    titulo: "Celebraciones inolvidables",
    descripcion: "Cada cumpleaños merece un momento especial.",
    imagen: `${import.meta.env.BASE_URL}eventos/evento-1.jpg`
  },
  {
    titulo: "Decoraciones que sorprenden",
    descripcion: "Dale color y alegría a cada celebración.",
    imagen: `${import.meta.env.BASE_URL}eventos/evento-2.jpg`
  },
  {
    titulo: "Momentos para compartir",
    descripcion: "Prepará una fiesta llena de recuerdos.",
    imagen: `${import.meta.env.BASE_URL}eventos/evento-3.jpg`
  }
];

function Home() {

  // Controlamos la diapositiva actual.
  const [eventoActual, setEventoActual] = useState(0);

  // Guardamos la posición inicial del dedo.
  const inicioDeslizamiento = useRef(null);

  // Detectamos dónde comienza el movimiento.
    const iniciarDeslizamiento = (e) => {
    inicioDeslizamiento.current = e.changedTouches[0].clientX;
    };

  // Detectamos dónde termina el movimiento.
  const finalizarDeslizamiento = (e) => {

  if (inicioDeslizamiento.current === null) {
    return;
  }

  const posicionFinal = e.changedTouches[0].clientX;

  const diferencia =
    posicionFinal - inicioDeslizamiento.current;

  // Evitamos cambios por movimientos demasiado pequeños.
  if (Math.abs(diferencia) > 50) {

    cambiarEvento(diferencia < 0 ? 1 : -1);

  }

  inicioDeslizamiento.current = null;
};

  // Avanzamos o retrocedemos en el carrusel.
  const cambiarEvento = (direccion) => {
    setEventoActual((actual) =>
      (actual + direccion + eventos.length) % eventos.length
    );
  };

  // Seleccionamos directamente una diapositiva.
  const evento = eventos[eventoActual];

  return (
    <main className="w-full overflow-hidden">


{/* BIENVENIDA CON IMAGEN DE FONDO */}
<section
  className="relative flex min-h-[460px] items-center justify-center
    overflow-hidden bg-[#29235c] bg-cover bg-center
    px-5 py-16 text-center text-white
    sm:min-h-[520px] sm:py-24 lg:min-h-[580px]"
  style={{
    backgroundImage:
      `linear-gradient(115deg, rgba(33, 27, 80, 0.88), rgba(55, 48, 111, 0.75), rgba(41, 35, 92, 0.68)), url('${import.meta.env.BASE_URL}eventos/fondo-inicio.jpg')`
  }}
>

  <div className="mx-auto max-w-4xl">

    <p className="mb-4 text-sm font-bold uppercase
      tracking-[0.2em] text-[#dcd8ff]">
      Bienvenidos a FiestaBox
    </p>

    <h1 className="mb-6 text-4xl font-extrabold
      leading-tight sm:text-5xl lg:text-6xl">
      Cada celebración merece ser especial
    </h1>

    <p className="mx-auto mb-9 max-w-2xl text-base
      leading-relaxed text-[#eeeaff] sm:text-lg">
      Encontrá todo lo que necesitás para decorar,
      sorprender y crear momentos inolvidables.
    </p>

    <Link
      to="/productos"
      className="inline-block rounded-xl bg-white
        px-8 py-4 font-bold text-[#29235c] shadow-lg
        transition duration-200 hover:-translate-y-1
        hover:bg-[#eeeaff] active:scale-95
        focus-visible:outline focus-visible:outline-4
        focus-visible:outline-white"
    >
      Explorar productos
    </Link>

  </div>

</section>



      {/* CARRUSEL DE EVENTOS */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">

        <div className="mb-8 text-center">

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#6c63ff]">
            Encontrá inspiración
          </p>

          <h2 className="text-3xl font-extrabold text-[#29235c] sm:text-4xl">
            Ideas para celebrar
          </h2>

          <p className="mt-3 text-gray-600">
            Descubrí diferentes formas de hacer especial tu fiesta.
          </p>

        </div>


           <div
             className="relative overflow-hidden rounded-3xl bg-[#29235c] shadow-xl"
             role="region"
              aria-roledescription="carrusel"
              aria-label="Galería de eventos e inspiración de FiestaBox"
            >


          {/* IMAGEN ACTUAL */}
          <div
            key={eventoActual}
            className="imagen-carrusel relative aspect-[4/3] sm:aspect-[16/9]"
            aria-live="polite"
            aria-atomic="true"
            onTouchStart={iniciarDeslizamiento}
            onTouchEnd={finalizarDeslizamiento}
            onTouchCancel={() => {
            inicioDeslizamiento.current = null;
            }}
          >

          <img
              src={evento.imagen}
               alt={`${evento.titulo}. ${evento.descripcion}`}
               decoding="async"
               draggable={false}
               className="h-full w-full object-cover"
            />


            {/* CAPA DE TEXTO */}
            <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent px-6 pb-10 text-center sm:pb-14">

              <h3 className="mb-3 text-2xl font-bold text-white sm:text-4xl">
                {evento.titulo}
              </h3>

              <p className="max-w-xl text-sm text-white sm:text-lg">
                {evento.descripcion}
              </p>

            </div>

          </div>


         
            {/* BOTÓN ANTERIOR */}
            <button
                type="button"
                onClick={() => cambiarEvento(-1)}
                aria-label="Evento anterior"
                className="absolute left-3 top-1/2 flex h-10 w-10
                -translate-y-1/2 items-center justify-center rounded-full
                bg-white/90 text-xl font-bold text-[#29235c] shadow-lg
                transition hover:bg-white active:scale-95
                focus-visible:outline focus-visible:outline-4
                focus-visible:outline-[#b7b0ff] focus-visible:outline-offset-2
                motion-reduce:transition-none sm:left-5 sm:h-12 sm:w-12"
              >
      ‹
            </button>


          {/* BOTÓN SIGUIENTE */}
          <button
              type="button"
              onClick={() => cambiarEvento(1)}
              aria-label="Evento siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10
              -translate-y-1/2 items-center justify-center rounded-full
              bg-white/90 text-xl font-bold text-[#29235c] shadow-lg
              transition hover:bg-white active:scale-95
              focus-visible:outline focus-visible:outline-4
              focus-visible:outline-[#b7b0ff] focus-visible:outline-offset-2
              motion-reduce:transition-none sm:right-5 sm:h-12 sm:w-12"
          >
            ›
            </button>

        </div>


        {/* INDICADORES DEL CARRUSEL */}
        <div className="mt-6 flex justify-center gap-3">

          {eventos.map((item, indice) => (

            <button
              key={indice}
              type="button"
              onClick={() => setEventoActual(indice)}
              aria-label={`Mostrar evento ${indice + 1}`}
              aria-current={eventoActual === indice ? "true" : undefined}
              className={`h-3 rounded-full transition-all duration-200 ${
                eventoActual === indice
                  ? "w-9 bg-[#6c63ff]"
                  : "w-3 bg-[#d8d3ef] hover:bg-[#a9a0ed]"
              }`}
            />

          ))}

        </div>

      </section>


      {/* ACCESO AL CATÁLOGO */}
      <section className="bg-[#f0edff] px-5 py-14 text-center sm:py-16">

        <div className="mx-auto max-w-3xl">

          <h2 className="mb-4 text-3xl font-extrabold text-[#29235c]">
            Todo para tu próxima fiesta
          </h2>

          <p className="mb-8 leading-relaxed text-gray-600">
            Explorá nuestro catálogo y encontrá los productos
            ideales para darle vida a tu celebración.
          </p>

          <Link
            to="/productos"
            className="inline-block rounded-xl bg-[#29235c] px-8 py-4 font-bold text-white shadow-md transition duration-200 hover:-translate-y-1 hover:bg-[#6c63ff]"
          >
            Ver catálogo completo
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;
