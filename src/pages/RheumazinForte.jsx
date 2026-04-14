import { useEffect, useMemo, useState } from "react";

const CHECKOUT_URL =
  "https://cuidafy.mitiendanube.com/checkout/v3/start/1946360514/edf3aea18ae621df31bdfa255f22dcc5aa0cce10?from_store=1&country=AR";
const OFFER_STORAGE_KEY = "rf_offer_end";
const OFFER_DURATION_MS = 24 * 60 * 60 * 1000;

const reviews = [
  {
    name: "María Elena G.",
    image: "/cliente1.png",
    rating: 5,
    city: "CABA",
    date: "hace 2 semanas",
    text:
      "Tengo 62 años y llevaba 3 años con dolor constante en las rodillas. A la tercera semana ya podía subir las escaleras de mi casa sin apoyarme del pasamanos. Volví a caminar con mi perra todas las mañanas.",
  },
  {
    name: "Roberto C.",
    image: "/cliente2.png",
    rating: 5,
    city: "Córdoba",
    date: "hace 1 mes",
    text:
      "Soy albañil y después de 30 años de oficio tenía las manos y la espalda destruidas. Lo tomé un ciclo completo y pude volver a trabajar jornada entera sin tener que parar cada dos horas.",
  },
  {
    name: "Susana P.",
    image: "/cliente3.png",
    rating: 4,
    city: "Rosario",
    date: "hace 3 semanas",
    text:
      "Al principio pensé que no me iba a hacer nada, pero a la segunda semana empecé a notar que me levantaba sin ese dolor horrible en las caderas. No es magia, hay que tomarlo todos los días, pero funciona.",
  },
  {
    name: "Jorge A.",
    image: "/cliente4.png",
    rating: 5,
    city: "Mendoza",
    date: "hace 5 semanas",
    text:
      "Mi mujer me insistió porque ya no sabía qué probar. Llevo el segundo ciclo y puedo volver a trabajar en la huerta los fines de semana. Lo que más me sorprendió fue dormir toda la noche sin despertarme por el dolor.",
  },
  {
    name: "Patricia D.",
    image: "/cliente5.png",
    rating: 5,
    city: "La Plata",
    date: "hace 2 meses",
    text:
      "Después de mi operación de cadera quedé con mucha rigidez. La kinesióloga me recomendó complementar con algo natural y probé Rheumatizin Forte. A los 20 días sentí la diferencia en la flexibilidad al agacharme.",
  },
  {
    name: "Héctor M.",
    image: "/cliente6.png",
    rating: 4,
    city: "Mar del Plata",
    date: "hace 1 mes",
    text:
      "Sirve, pero hay que ser constante. Yo lo dejé una semana y volvió el dolor. Desde que lo tomo todos los días, más la caminata por la costanera, volví a sentirme activo. A mis 67 años no es poco.",
  },
  {
    name: "Marta L.",
    image: "/cliente7.png",
    rating: 5,
    city: "San Miguel de Tucumán",
    date: "hace 3 semanas",
    text:
      "Tengo artrosis en la columna y ya no podía ni tender la ropa sin parar. Mi hija me lo compró y me convenció de probarlo. Al mes ya dormía de un tirón y volví a cocinar para mis nietos los domingos.",
  },
];

const buyers = [
  { name: "Noemí", phone: "+54 9 3816 21-1474" },
  { name: "David", phone: "+54 9 3815 78-6377" },
  { name: "Rubén", phone: "+54 9 2355 48-3585" },
  { name: "José", phone: "+54 9 11 2741-6152" },
  { name: "Lore", phone: "+54 9 11 3621-2572" },
  { name: "Marta", phone: "+54 9 11 3762-9760" },
  { name: "Marcelina", phone: "+54 9 3413 11-3218" },
  { name: "Rubén", phone: "+54 9 2612 40-3947" },
  { name: "Patricia", phone: "+54 9 3404 63-9221" },
  { name: "Sara", phone: "+54 9 3435 01-6372" },
  { name: "Héctor", phone: "+54 9 2923 44-9004" },
];

const maskPhone = (phone) => phone.replace(/\d{2}(?=\D*$)/, "**");

const faqItems = [
  {
    q: "¿Es el mismo producto que venden en farmacias?",
    a:
      "Sí, es exactamente el mismo Rheumatizin Forte de venta libre que vas a encontrar en farmacias de todo el país. La diferencia es que acá lo conseguís con 53% OFF y te llega directo a tu casa.",
  },
  {
    q: "¿Cómo funciona la garantía de devolución?",
    a:
      "Tenés 30 días desde que recibís el producto para probarlo. Si después del primer ciclo completo no notás mejora, nos escribís por WhatsApp y te devolvemos el 100% del dinero. Sin vueltas ni letra chica.",
  },
  {
    q: "¿Puedo pagar en cuotas?",
    a:
      "Sí, podés abonar en 3 cuotas de $7.874,26 con tarjeta de crédito a través del checkout seguro. También aceptamos débito, transferencia y dinero en cuenta.",
  },
  {
    q: "¿A qué zonas llega el envío?",
    a:
      "Enviamos a todo el país. El costo del envío se calcula automáticamente en el checkout según tu código postal. CABA y GBA reciben en 24 a 48hs hábiles. Interior entre 3 y 7 días hábiles dependiendo de la provincia.",
  },
  {
    q: "¿Cuánto tiempo tarda en hacer efecto?",
    a:
      "La mayoría de nuestros clientes empieza a notar mejoras entre la segunda y tercera semana de uso continuo. El efecto sostenido se consolida al completar el ciclo de 20 días más los 10 de estabilización.",
  },
  {
    q: "¿Tiene contraindicaciones?",
    a:
      "Al ser venta libre, es seguro para la mayoría de los adultos. Si estás tomando anticoagulantes, tenés una condición crónica o estás embarazada, consultá con tu médico de cabecera antes de empezar.",
  },
];

const formatNumber = (value) => value.toString().padStart(2, "0");

const RheumazinForte = () => {
  const [time, setTime] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [openFaq, setOpenFaq] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponFeedback, setCouponFeedback] = useState(null);

  const schemaMarkup = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        name: "Rheumatizin Forte",
        description:
          "Rheumatizin Forte — Tratamiento desinflamatorio natural de venta libre. Recuperá tu movilidad en 20 días con garantía de devolución.",
        brand: { "@type": "Brand", name: "Cuidafy" },
        image: "https://cuidafy.com.ar/producto.webp",
        offers: {
          "@type": "Offer",
          url: "https://cuidafy.com.ar/rheumazin-forte",
          priceCurrency: "ARS",
          price: "18997",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "500",
        },
      }),
    []
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Rheumatizin Forte | 53% OFF | Cuidafy";

    const metaTags = [
      {
        name: "description",
        content:
          "Rheumatizin Forte al 53% OFF. Recuperá tu movilidad en 20 días o te devolvemos el dinero. Venta libre en farmacias.",
      },
      { property: "og:title", content: "Rheumatizin Forte | 53% OFF" },
      {
        property: "og:description",
        content:
          "Recuperá tu movilidad en 20 días. Venta libre en farmacias. 3 cuotas accesibles. Garantía 100% o te devolvemos el dinero.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://cuidafy.com.ar/rheumazin-forte" },
      { name: "twitter:card", content: "summary_large_image" },
    ];

    const createdMetas = metaTags.map((tag) => {
      const element = document.createElement("meta");
      if (tag.name) element.setAttribute("name", tag.name);
      if (tag.property) element.setAttribute("property", tag.property);
      element.setAttribute("content", tag.content);
      document.head.appendChild(element);
      return element;
    });

    return () => {
      document.title = previousTitle;
      createdMetas.forEach((meta) => meta.remove());
    };
  }, []);

  useEffect(() => {
    let targetRaw = localStorage.getItem(OFFER_STORAGE_KEY);
    let target = targetRaw ? Number(targetRaw) : NaN;
    if (!Number.isFinite(target) || target <= Date.now()) {
      target = Date.now() + OFFER_DURATION_MS;
      localStorage.setItem(OFFER_STORAGE_KEY, String(target));
    }

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTime({ hours, minutes, seconds });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".rf-reveal");
    if (!elements.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("rf-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const handleCouponApply = (event) => {
    event.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (!code) {
      setCouponFeedback({ type: "error", text: "Ingresá un código de cupón." });
      return;
    }
    if (code === "CUIDA10") {
      setCouponFeedback({
        type: "success",
        text: "✓ Cupón aplicado. Se descontará un 10% adicional al finalizar la compra.",
      });
    } else {
      setCouponFeedback({
        type: "error",
        text: "Ese cupón no es válido o ya fue utilizado. Probá con otro.",
      });
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`rf-star ${index < rating ? "rf-star--on" : "rf-star--off"}`}
        aria-hidden="true"
      >
        ★
      </span>
    ));

  return (
    <div className="rf-page">
      <style>{styles}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaMarkup }} />

      <header className="rf-header">
        <div className="rf-header__inner">
          <div className="rf-logo">
            <span className="rf-logo__mark">C</span>
            <span className="rf-logo__text">Cuidafy</span>
          </div>
          <span className="rf-header__badge">🏥 Venta libre en farmacias</span>
          <a href={CHECKOUT_URL} className="rf-btn rf-btn--primary rf-header__cta">
            Comprar ahora
          </a>
        </div>
      </header>

      <section className="rf-hero">
        <div className="rf-hero__inner">
          <div className="rf-hero__content rf-reveal">
            <span className="rf-hero__kicker">Rheumatizin Forte</span>
            <h1 className="rf-hero__title">
              El mismo producto que encontrás en farmacias, ahora con 53% OFF
            </h1>
            <p className="rf-hero__sub">
              Rheumatizin Forte — Recuperá tu movilidad en 20 días o te devolvemos el dinero.
            </p>

            <div className="rf-price">
              <div className="rf-price__row">
                <span className="rf-price__old">$39.999,00</span>
                <span className="rf-price__discount">53% OFF</span>
              </div>
              <div className="rf-price__final">$18.997,00</div>
              <div className="rf-price__installments">3 cuotas de $7.874,26</div>
              <div className="rf-price__shipping">
                🚚 Envío a todo el país — calculamos el costo al finalizar
              </div>
            </div>

            <a href={CHECKOUT_URL} className="rf-btn rf-btn--primary rf-btn--xl rf-hero__cta">
              QUIERO MI PRODUCTO →
            </a>

            <ul className="rf-hero__badges">
              <li>✓ Venta libre en farmacias</li>
              <li>✓ 3 cuotas accesibles</li>
              <li>✓ Garantía 100%</li>
            </ul>

            <div className="rf-timer">
              <p className="rf-timer__label">⏰ Oferta válida por tiempo limitado</p>
              <div className="rf-timer__clock">
                <div className="rf-timer__cell">
                  <span className="rf-timer__value">{formatNumber(time.hours)}</span>
                  <span className="rf-timer__unit">horas</span>
                </div>
                <span className="rf-timer__sep">:</span>
                <div className="rf-timer__cell">
                  <span className="rf-timer__value">{formatNumber(time.minutes)}</span>
                  <span className="rf-timer__unit">min</span>
                </div>
                <span className="rf-timer__sep">:</span>
                <div className="rf-timer__cell">
                  <span className="rf-timer__value">{formatNumber(time.seconds)}</span>
                  <span className="rf-timer__unit">seg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rf-hero__image rf-reveal">
            <div className="rf-product-mock">
              <div className="rf-product-mock__shine" />
              <span className="rf-product-mock__tag">Venta libre</span>
              <img
                src="/producto.webp"
                alt="Rheumatizin Forte — 30 comprimidos recubiertos"
                className="rf-product-mock__img"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rf-trust">
        <div className="rf-trust__inner">
          <div className="rf-trust__item">
            <span className="rf-trust__icon">🏥</span>
            <span className="rf-trust__text">Venta libre en farmacias</span>
          </div>
          <div className="rf-trust__item">
            <span className="rf-trust__icon">🚚</span>
            <span className="rf-trust__text">Envío a todo el país</span>
          </div>
          <div className="rf-trust__item">
            <span className="rf-trust__icon">💳</span>
            <span className="rf-trust__text">3 cuotas accesibles</span>
          </div>
          <div className="rf-trust__item">
            <span className="rf-trust__icon">🔒</span>
            <span className="rf-trust__text">Compra 100% segura</span>
          </div>
        </div>
      </section>

      <section className="rf-section rf-problem">
        <div className="rf-container rf-reveal">
          <h2 className="rf-section__title">¿Sentís que tu cuerpo te pone límites cada mañana?</h2>
          <p className="rf-section__lead">
            Si estás acá, sabés de qué hablamos. Ese dolor que no se va, que te obliga a planear
            cada movimiento, que te roba las cosas simples del día a día.
          </p>
          <ul className="rf-pain-list">
            <li>Te levantás rígido y necesitás 20 minutos para empezar a moverte.</li>
            <li>Evitás las escaleras, los viajes largos, hasta jugar con tus nietos.</li>
            <li>Ya probaste analgésicos que tapan el dolor pero no atacan el problema.</li>
            <li>Dormís mal porque el dolor te despierta varias veces por noche.</li>
            <li>Gastás plata en tratamientos que solo funcionan mientras los hacés.</li>
          </ul>
          <p className="rf-section__closing">
            No estás exagerando, y no tenés que resignarte. Hay algo que sí está funcionando.
          </p>
        </div>
      </section>

      <section className="rf-section rf-solution">
        <div className="rf-container rf-reveal">
          <span className="rf-section__kicker">La solución</span>
          <h2 className="rf-section__title">
            Rheumatizin Forte — el tratamiento que ataca la causa, no solo el síntoma
          </h2>
          <div className="rf-solution__grid">
            <div className="rf-solution__card">
              <span className="rf-solution__icon">🏃</span>
              <h3>Movilidad desde el primer minuto</h3>
              <p>
                Los primeros días ya vas a notar que te levantás con menos rigidez. Tu cuerpo
                empieza a responder como antes.
              </p>
            </div>
            <div className="rf-solution__card">
              <span className="rf-solution__icon">🔥</span>
              <h3>Acción desinflamatoria real</h3>
              <p>
                Actúa directo sobre la inflamación en articulaciones y músculos. No tapa el dolor,
                lo desarma desde adentro.
              </p>
            </div>
            <div className="rf-solution__card">
              <span className="rf-solution__icon">🌙</span>
              <h3>Noches de descanso profundo</h3>
              <p>
                Dormir de corrido, sin despertarte por una rodilla, una cadera, una espalda que
                duele. Así se recupera el cuerpo.
              </p>
            </div>
            <div className="rf-solution__card">
              <span className="rf-solution__icon">💪</span>
              <h3>Libertad en el día a día</h3>
              <p>
                Volver a caminar, a salir, a trabajar, a jugar con los nietos. Sin pensar dos veces
                si vas a poder.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rf-section rf-howto">
        <div className="rf-container rf-reveal">
          <span className="rf-section__kicker">Cómo funciona</span>
          <h2 className="rf-section__title">Un ciclo de 30 días que cambia todo</h2>
          <div className="rf-timeline">
            <div className="rf-timeline__step">
              <div className="rf-timeline__num">1</div>
              <h3>Fase de Acción</h3>
              <p className="rf-timeline__duration">20 días</p>
              <p>
                Tomás 1 comprimido por día con el desayuno. En esta fase el principio activo
                penetra y empieza a desinflamar en profundidad.
              </p>
            </div>
            <div className="rf-timeline__step">
              <div className="rf-timeline__num">2</div>
              <h3>Fase de Estabilización</h3>
              <p className="rf-timeline__duration">10 días</p>
              <p>
                Descansás del producto. Tu cuerpo consolida los resultados y fija la mejora en los
                tejidos.
              </p>
            </div>
            <div className="rf-timeline__step">
              <div className="rf-timeline__num">3</div>
              <h3>Resultado sostenido</h3>
              <p className="rf-timeline__duration">Continuo</p>
              <p>
                Alivio sostenido y mejora progresiva. Recuperás la vida que pensabas perdida y
                podés repetir el ciclo según lo necesites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rf-section rf-buyers">
        <div className="rf-container rf-reveal">
          <span className="rf-section__kicker">Ventas de esta semana</span>
          <h2 className="rf-section__title">Clientes que ya compraron</h2>
          <p className="rf-section__lead">
            Algunos de los contactos reales que recibieron su Rheumatizin Forte en los últimos
            días. Ocultamos los últimos dígitos para cuidar su privacidad.
          </p>
          <div className="rf-buyers__grid">
            {buyers.map((buyer, index) => (
              <div key={`${buyer.phone}-${index}`} className="rf-buyers__chip">
                <span className="rf-buyers__check" aria-hidden="true">
                  ✓
                </span>
                <span className="rf-buyers__name">{buyer.name}</span>
                <span className="rf-buyers__phone">{maskPhone(buyer.phone)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rf-section rf-reviews">
        <div className="rf-container rf-reveal">
          <span className="rf-section__kicker">Historias reales</span>
          <h2 className="rf-section__title">Más de 500 personas ya recuperaron su movilidad</h2>
          <div className="rf-reviews__rating">
            <div className="rf-stars rf-stars--lg">{renderStars(5)}</div>
            <span className="rf-reviews__avg">4.8 / 5 promedio</span>
          </div>
          <div className="rf-reviews__grid">
            {reviews.map((review) => (
              <article key={review.name} className="rf-review">
                <header className="rf-review__head">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="rf-review__avatar"
                    loading="lazy"
                  />
                  <div>
                    <p className="rf-review__name">{review.name}</p>
                    <p className="rf-review__meta">
                      {review.city} · {review.date}
                    </p>
                  </div>
                </header>
                <div className="rf-stars">{renderStars(review.rating)}</div>
                <p className="rf-review__text">{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rf-section rf-compare">
        <div className="rf-container rf-reveal">
          <span className="rf-section__kicker">Compará</span>
          <h2 className="rf-section__title">Por qué Rheumatizin Forte es diferente</h2>
          <div className="rf-compare__wrap">
            <table className="rf-compare__table">
              <thead>
                <tr>
                  <th />
                  <th className="rf-compare__highlight">Rheumatizin Forte</th>
                  <th>Analgésicos comunes</th>
                  <th>Kinesiología</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Precio mensual</td>
                  <td className="rf-compare__highlight">$18.997</td>
                  <td>$3.000 aprox.</td>
                  <td>$40.000+</td>
                </tr>
                <tr>
                  <td>Duración del efecto</td>
                  <td className="rf-compare__highlight">30 días o más</td>
                  <td>4 a 6 horas</td>
                  <td>Solo durante la sesión</td>
                </tr>
                <tr>
                  <td>Ataca la causa</td>
                  <td className="rf-compare__highlight">✓</td>
                  <td>✗</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>Garantía de devolución</td>
                  <td className="rf-compare__highlight">✓ 100%</td>
                  <td>✗</td>
                  <td>✗</td>
                </tr>
                <tr>
                  <td>Lo usás desde tu casa</td>
                  <td className="rf-compare__highlight">✓</td>
                  <td>✓</td>
                  <td>✗</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rf-section rf-guarantee">
        <div className="rf-container rf-reveal">
          <div className="rf-guarantee__card">
            <span className="rf-guarantee__shield">🛡️</span>
            <h2>30 días de garantía total</h2>
            <p>
              Probalo el primer ciclo completo. Si no sentís mejora, nos escribís y te devolvemos
              el <strong>100% del dinero</strong>. Sin vueltas, sin letra chica, sin peros.
            </p>
            <p className="rf-guarantee__sub">
              Podemos ofrecer esta garantía porque sabemos que funciona. Los números nos respaldan.
            </p>
          </div>
        </div>
      </section>

      {/* <section className="rf-section rf-coupon">
        <div className="rf-container rf-reveal">
          <div className="rf-coupon__card">
            <div className="rf-coupon__intro">
              <h2>¿Tenés un cupón de descuento?</h2>
              <p>
                Aplicá tu código antes de comprar y obtené un descuento adicional sobre el precio
                final.
              </p>
            </div>
            <form className="rf-coupon__form" onSubmit={handleCouponApply}>
              <input
                type="text"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="Ingresá tu código"
                className="rf-coupon__input"
                aria-label="Código de cupón"
              />
              <button type="submit" className="rf-btn rf-btn--primary rf-coupon__btn">
                Aplicar
              </button>
            </form>
            {couponFeedback ? (
              <p
                className={`rf-coupon__feedback rf-coupon__feedback--${couponFeedback.type}`}
                role="status"
              >
                {couponFeedback.text}
              </p>
            ) : null}
          </div>
        </div>
      </section> */}

      <section className="rf-section rf-faq">
        <div className="rf-container rf-reveal">
          <span className="rf-section__kicker">Preguntas frecuentes</span>
          <h2 className="rf-section__title">Lo que todos preguntan antes de comprar</h2>
          <div className="rf-faq__list">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q} className={`rf-faq__item ${isOpen ? "rf-faq__item--open" : ""}`}>
                  <button
                    type="button"
                    className="rf-faq__trigger"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className="rf-faq__icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen ? <p className="rf-faq__answer">{item.a}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rf-section rf-final-cta">
        <div className="rf-container rf-reveal">
          <div className="rf-final-cta__card">
            <p className="rf-final-cta__kicker">Última oportunidad con 53% OFF</p>
            <h2>Recuperá tu movilidad hoy — más de 500 personas ya lo hicieron</h2>
            <div className="rf-final-cta__price">
              <span className="rf-final-cta__old">$39.999,00</span>
              <span className="rf-final-cta__new">$18.997,00</span>
              <span className="rf-final-cta__installments">o 3 cuotas de $7.874,26</span>
            </div>
            <a href={CHECKOUT_URL} className="rf-btn rf-btn--primary rf-btn--xl">
              QUIERO MI PRODUCTO →
            </a>
            <p className="rf-final-cta__note">
              🛡️ Garantía 100% · 🚚 Envío a todo el país · 💳 3 cuotas accesibles
            </p>
            <p className="rf-final-cta__timer">
              Oferta expira en {formatNumber(time.hours)}:{formatNumber(time.minutes)}:
              {formatNumber(time.seconds)}
            </p>
          </div>
        </div>
      </section>

      <footer className="rf-footer">
        <div className="rf-container rf-footer__inner">
          <div className="rf-logo rf-logo--light">
            <span className="rf-logo__mark">C</span>
            <span className="rf-logo__text">Cuidafy</span>
          </div>
          <nav className="rf-footer__nav">
            <a href="/terminos">Términos y condiciones</a>
            <a href="/privacidad">Política de privacidad</a>
            <a href="/devoluciones">Cambios y devoluciones</a>
            <a href="mailto:info.cuidafy@gmail.com">info.cuidafy@gmail.com</a>
            <a
  href="https://wa.me/5493764331313?text=Hola%20Cuidafy%2C%20quiero%20saber%20más%20sobre%20Rheumatizin%20Forte"
  target="_blank"
  rel="noopener noreferrer"
  className="rf-whatsapp-float"
>
  💬
</a>
          </nav>
          <p className="rf-footer__copy">
            © {new Date().getFullYear()} Cuidafy — cuidafy.com.ar · Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <a href={CHECKOUT_URL} className="rf-float-cta">
        Comprar — $18.997 →
      </a>
    </div>
  );
};

const styles = `
.rf-whatsapp-float {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: #25d366;
  color: #fff;
  font-size: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(37, 211, 102, 0.5);
  z-index: 999;
  transition: 0.2s;
}

.rf-whatsapp-float:hover {
  background: #128c7e;
  transform: scale(1.1);
}

.rf-page {
  --rf-blue: #1a56db;
  --rf-blue-dark: #1e3a8a;
  --rf-blue-soft: #eff6ff;
  --rf-red: #e53e3e;
  --rf-red-dark: #c53030;
  --rf-green: #25d366;
  --rf-green-dark: #128c7e;
  --rf-text: #1f2937;
  --rf-muted: #4b5563;
  --rf-border: #e5e7eb;
  --rf-bg-soft: #f8fafc;
  font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--rf-text);
  background: #fff;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.rf-page *, .rf-page *::before, .rf-page *::after { box-sizing: border-box; }
.rf-page h1, .rf-page h2, .rf-page h3 { margin: 0; line-height: 1.2; font-weight: 800; color: #0f172a; }
.rf-page p { margin: 0; }
.rf-page ul { margin: 0; padding: 0; list-style: none; }
.rf-page a { color: inherit; text-decoration: none; }

.rf-container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
.rf-section { padding: 72px 20px; }
.rf-section__kicker { display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--rf-blue); margin-bottom: 12px; }
.rf-section__title { font-size: clamp(26px, 4vw, 40px); margin-bottom: 16px; }
.rf-section__lead { font-size: 18px; color: var(--rf-muted); max-width: 720px; margin-bottom: 24px; }
.rf-section__closing { margin-top: 24px; font-size: 18px; font-weight: 600; color: var(--rf-blue-dark); }

.rf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 26px; border-radius: 999px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; text-align: center; }
.rf-btn--primary { background: var(--rf-green); color: #fff; box-shadow: 0 10px 24px rgba(37, 211, 102, 0.32); }
.rf-btn--primary:hover { background: var(--rf-green-dark); transform: translateY(-2px); box-shadow: 0 14px 30px rgba(18, 140, 126, 0.38); }
.rf-btn--xl { padding: 20px 36px; font-size: 17px; letter-spacing: 0.3px; }

.rf-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; color: var(--rf-blue-dark); }
.rf-logo__mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--rf-blue), var(--rf-blue-dark)); color: #fff; display: grid; place-items: center; font-size: 20px; font-weight: 900; }
.rf-logo--light { color: #fff; }

.rf-header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.96); backdrop-filter: blur(10px); border-bottom: 1px solid var(--rf-border); }
.rf-header__inner { max-width: 1120px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 16px; }
.rf-header__badge { flex: 1; font-size: 13px; font-weight: 600; color: var(--rf-blue-dark); background: var(--rf-blue-soft); padding: 8px 14px; border-radius: 999px; text-align: center; display: none; }
.rf-header__cta { padding: 10px 20px; font-size: 14px; }

.rf-hero { padding: 64px 20px 40px; background: linear-gradient(180deg, var(--rf-blue-soft) 0%, #fff 70%); }
.rf-hero__inner { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
.rf-hero__kicker { display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--rf-blue); margin-bottom: 12px; }
.rf-hero__title { font-size: clamp(28px, 4.5vw, 46px); color: #0f172a; margin-bottom: 16px; }
.rf-hero__sub { font-size: 18px; color: var(--rf-muted); margin-bottom: 24px; }
.rf-hero__cta { margin: 8px 0 16px; width: 100%; max-width: 480px; }
.rf-hero__badges { display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: 14px; color: var(--rf-blue-dark); font-weight: 600; margin-top: 8px; }

.rf-price { background: #fff; border: 2px solid var(--rf-border); border-radius: 20px; padding: 20px 24px; margin-bottom: 20px; }
.rf-price__row { display: flex; align-items: center; gap: 14px; margin-bottom: 4px; }
.rf-price__old { font-size: 18px; color: #94a3b8; text-decoration: line-through; }
.rf-price__discount { font-size: 12px; font-weight: 800; color: #fff; background: var(--rf-red); padding: 5px 10px; border-radius: 999px; letter-spacing: 0.4px; }
.rf-price__final { font-size: clamp(34px, 5vw, 44px); font-weight: 900; color: var(--rf-blue-dark); line-height: 1.1; }
.rf-price__installments { font-size: 15px; color: var(--rf-muted); margin-top: 4px; font-weight: 600; }
.rf-price__shipping { font-size: 14px; color: #059669; font-weight: 700; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--rf-border); }

.rf-timer { margin-top: 24px; padding: 18px 22px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; text-align: center; }
.rf-timer__label { font-size: 13px; font-weight: 700; color: var(--rf-red-dark); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
.rf-timer__clock { display: flex; align-items: center; justify-content: center; gap: 8px; }
.rf-timer__cell { background: #fff; border: 1px solid #fecaca; border-radius: 12px; padding: 8px 14px; min-width: 68px; display: flex; flex-direction: column; align-items: center; }
.rf-timer__value { font-size: 24px; font-weight: 900; color: var(--rf-red-dark); font-variant-numeric: tabular-nums; }
.rf-timer__unit { font-size: 10px; text-transform: uppercase; color: var(--rf-muted); font-weight: 600; letter-spacing: 0.5px; }
.rf-timer__sep { font-size: 22px; color: var(--rf-red); font-weight: 900; }

.rf-hero__image { display: flex; justify-content: center; }
.rf-product-mock { position: relative; width: 100%; max-width: 420px; aspect-ratio: 3 / 4; border-radius: 28px; background: linear-gradient(155deg, #dbeafe 0%, #eff6ff 55%, #ffffff 100%); box-shadow: 0 30px 60px -20px rgba(26,86,219,0.35); display: flex; align-items: center; justify-content: center; padding: 32px; overflow: hidden; }
.rf-product-mock__shine { position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 55%); pointer-events: none; }
.rf-product-mock__tag { align-self: flex-start; background: #fff; color: var(--rf-blue-dark); font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 999px; position: absolute; top: 24px; left: 24px; letter-spacing: 0.4px; box-shadow: 0 4px 12px rgba(15,23,42,0.12); z-index: 2; }
.rf-product-mock__img { position: relative; z-index: 1; max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 20px 30px rgba(15, 23, 42, 0.25)); }

.rf-trust { background: var(--rf-blue-dark); color: #fff; padding: 28px 20px; }
.rf-trust__inner { max-width: 1120px; margin: 0 auto; display: grid; gap: 20px; grid-template-columns: repeat(2, 1fr); }
.rf-trust__item { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; }
.rf-trust__icon { font-size: 24px; }

.rf-problem { background: var(--rf-bg-soft); }
.rf-pain-list { display: grid; gap: 14px; margin: 20px 0 0; }
.rf-pain-list li { background: #fff; border: 1px solid var(--rf-border); border-left: 4px solid var(--rf-red); padding: 16px 20px; border-radius: 14px; font-size: 16px; color: var(--rf-text); }

.rf-solution__grid { display: grid; gap: 20px; grid-template-columns: 1fr; margin-top: 32px; }
.rf-solution__card { background: #fff; border: 1px solid var(--rf-border); border-radius: 20px; padding: 28px; box-shadow: 0 4px 12px rgba(15,23,42,0.04); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.rf-solution__card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(26,86,219,0.12); }
.rf-solution__icon { font-size: 36px; display: block; margin-bottom: 14px; }
.rf-solution__card h3 { font-size: 19px; margin-bottom: 8px; color: var(--rf-blue-dark); }
.rf-solution__card p { color: var(--rf-muted); font-size: 15px; }

.rf-howto { background: var(--rf-blue-soft); }
.rf-timeline { display: grid; gap: 24px; grid-template-columns: 1fr; margin-top: 32px; position: relative; }
.rf-timeline__step { background: #fff; border-radius: 20px; padding: 32px 28px; border: 1px solid var(--rf-border); position: relative; }
.rf-timeline__num { width: 44px; height: 44px; border-radius: 50%; background: var(--rf-blue); color: #fff; font-weight: 900; font-size: 20px; display: grid; place-items: center; margin-bottom: 16px; }
.rf-timeline__step h3 { font-size: 20px; color: var(--rf-blue-dark); margin-bottom: 4px; }
.rf-timeline__duration { font-size: 13px; font-weight: 700; color: var(--rf-red); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.rf-timeline__step p { color: var(--rf-muted); font-size: 15px; }

.rf-buyers { background: #fff; }
.rf-buyers__grid { display: grid; gap: 10px; grid-template-columns: 1fr; margin-top: 28px; }
.rf-buyers__chip { display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; transition: transform 0.15s ease, box-shadow 0.15s ease; }
.rf-buyers__chip:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(37, 211, 102, 0.18); }
.rf-buyers__check { width: 24px; height: 24px; border-radius: 50%; background: var(--rf-green); color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 900; flex-shrink: 0; }
.rf-buyers__name { font-weight: 700; color: #065f46; font-size: 14px; flex-shrink: 0; }
.rf-buyers__phone { font-family: 'Menlo', 'Monaco', 'Courier New', monospace; font-size: 13px; color: var(--rf-muted); font-variant-numeric: tabular-nums; margin-left: auto; letter-spacing: 0.3px; }

.rf-reviews__rating { display: flex; align-items: center; gap: 12px; margin: 12px 0 28px; flex-wrap: wrap; }
.rf-reviews__avg { font-weight: 700; color: var(--rf-text); font-size: 15px; }
.rf-stars { display: inline-flex; gap: 2px; }
.rf-stars--lg .rf-star { font-size: 22px; }
.rf-star { font-size: 16px; line-height: 1; }
.rf-star--on { color: #f59e0b; }
.rf-star--off { color: #e5e7eb; }
.rf-reviews__grid { display: grid; gap: 20px; grid-template-columns: 1fr; }
.rf-review { background: #fff; border: 1px solid var(--rf-border); border-radius: 20px; padding: 24px; box-shadow: 0 4px 10px rgba(15,23,42,0.04); }
.rf-review__head { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.rf-review__avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; background: #f1f5f9; border: 2px solid #e5e7eb; }
.rf-review__name { font-weight: 700; font-size: 15px; }
.rf-review__meta { font-size: 12px; color: var(--rf-muted); margin-top: 2px; }
.rf-review__text { margin-top: 10px; color: var(--rf-text); font-size: 14px; line-height: 1.65; }

.rf-compare { background: var(--rf-bg-soft); }
.rf-compare__wrap { overflow-x: auto; margin-top: 32px; border-radius: 18px; border: 1px solid var(--rf-border); background: #fff; }
.rf-compare__table { width: 100%; border-collapse: collapse; min-width: 600px; }
.rf-compare__table th, .rf-compare__table td { padding: 16px 18px; text-align: left; border-bottom: 1px solid var(--rf-border); font-size: 14px; }
.rf-compare__table th { background: #f1f5f9; font-weight: 700; color: var(--rf-text); font-size: 13px; text-transform: uppercase; letter-spacing: 0.4px; }
.rf-compare__table tr:last-child td { border-bottom: none; }
.rf-compare__highlight { background: var(--rf-blue-soft) !important; color: var(--rf-blue-dark) !important; font-weight: 700; }

.rf-guarantee__card { background: linear-gradient(135deg, var(--rf-blue-dark), var(--rf-blue)); color: #fff; border-radius: 28px; padding: 48px 32px; text-align: center; box-shadow: 0 30px 60px -20px rgba(26,86,219,0.4); }
.rf-guarantee__shield { font-size: 54px; display: block; margin-bottom: 12px; }
.rf-guarantee__card h2 { color: #fff; font-size: clamp(26px, 4vw, 36px); margin-bottom: 16px; }
.rf-guarantee__card p { max-width: 560px; margin: 0 auto; font-size: 17px; opacity: 0.95; }
.rf-guarantee__sub { margin-top: 14px !important; font-size: 14px !important; opacity: 0.8 !important; }

.rf-coupon__card { background: #fff; border: 2px dashed var(--rf-blue); border-radius: 24px; padding: 36px 28px; display: grid; gap: 20px; }
.rf-coupon__intro h2 { font-size: 24px; color: var(--rf-blue-dark); margin-bottom: 6px; }
.rf-coupon__intro p { color: var(--rf-muted); font-size: 15px; }
.rf-coupon__form { display: flex; gap: 10px; flex-wrap: wrap; }
.rf-coupon__input { flex: 1; min-width: 200px; padding: 14px 18px; border: 2px solid var(--rf-border); border-radius: 12px; font-size: 15px; outline: none; transition: border 0.15s ease; font-family: inherit; text-transform: uppercase; }
.rf-coupon__input:focus { border-color: var(--rf-blue); }
.rf-coupon__btn { padding: 14px 26px; }
.rf-coupon__feedback { padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; }
.rf-coupon__feedback--success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.rf-coupon__feedback--error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.rf-faq { background: var(--rf-bg-soft); }
.rf-faq__list { display: grid; gap: 12px; margin-top: 24px; }
.rf-faq__item { background: #fff; border: 1px solid var(--rf-border); border-radius: 16px; overflow: hidden; transition: border 0.15s ease; }
.rf-faq__item--open { border-color: var(--rf-blue); }
.rf-faq__trigger { width: 100%; background: none; border: none; padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 16px; font-weight: 700; color: var(--rf-text); cursor: pointer; text-align: left; font-family: inherit; }
.rf-faq__icon { font-size: 24px; color: var(--rf-blue); font-weight: 900; line-height: 1; }
.rf-faq__answer { padding: 0 22px 22px; color: var(--rf-muted); font-size: 15px; line-height: 1.7; }

.rf-final-cta__card { background: linear-gradient(135deg, #fff4ec, #fff); border: 2px solid var(--rf-red); border-radius: 28px; padding: 48px 32px; text-align: center; }
.rf-final-cta__kicker { font-size: 13px; font-weight: 800; color: var(--rf-red); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
.rf-final-cta__card h2 { font-size: clamp(24px, 3.6vw, 34px); margin-bottom: 24px; max-width: 620px; margin-left: auto; margin-right: auto; }
.rf-final-cta__price { display: flex; flex-direction: column; gap: 4px; align-items: center; margin-bottom: 28px; }
.rf-final-cta__old { font-size: 18px; color: #94a3b8; text-decoration: line-through; }
.rf-final-cta__new { font-size: clamp(38px, 6vw, 56px); font-weight: 900; color: var(--rf-blue-dark); line-height: 1; }
.rf-final-cta__installments { font-size: 15px; color: var(--rf-muted); font-weight: 600; }
.rf-final-cta__note { margin-top: 18px; font-size: 14px; color: var(--rf-muted); font-weight: 600; }
.rf-final-cta__timer { margin-top: 10px; font-size: 13px; color: var(--rf-red-dark); font-weight: 700; font-variant-numeric: tabular-nums; }

.rf-footer { background: #0f172a; color: #cbd5e1; padding: 48px 20px 32px; }
.rf-footer__inner { display: grid; gap: 22px; text-align: center; }
.rf-footer__inner .rf-logo { justify-content: center; }
.rf-footer__nav { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; font-size: 14px; }
.rf-footer__nav a:hover { color: #fff; }
.rf-footer__copy { font-size: 12px; color: #64748b; }

.rf-float-cta { display: flex; position: fixed; bottom: 16px; left: 16px; right: 16px; z-index: 100; background: var(--rf-green); color: #fff; font-weight: 800; font-size: 16px; padding: 16px 20px; border-radius: 999px; justify-content: center; align-items: center; box-shadow: 0 16px 34px rgba(37,211,102,0.45); }
.rf-float-cta:hover { background: var(--rf-green-dark); }

.rf-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.rf-reveal--visible { opacity: 1; transform: none; }

@media (min-width: 640px) {
  .rf-trust__inner { grid-template-columns: repeat(4, 1fr); }
  .rf-solution__grid { grid-template-columns: repeat(2, 1fr); }
  .rf-timeline { grid-template-columns: repeat(3, 1fr); }
  .rf-reviews__grid { grid-template-columns: repeat(2, 1fr); }
  .rf-buyers__grid { grid-template-columns: repeat(2, 1fr); }
  .rf-header__badge { display: inline-block; }
}

@media (min-width: 960px) {
  .rf-hero__inner { grid-template-columns: 1.1fr 0.9fr; gap: 60px; }
  .rf-solution__grid { grid-template-columns: repeat(4, 1fr); }
  .rf-reviews__grid { grid-template-columns: repeat(3, 1fr); }
  .rf-buyers__grid { grid-template-columns: repeat(3, 1fr); }
  .rf-coupon__card { grid-template-columns: 1.1fr 1fr; align-items: center; }
  .rf-float-cta { display: none; }
  .rf-footer__inner { grid-template-columns: auto 1fr auto; text-align: left; align-items: center; }
  .rf-footer__inner .rf-logo { justify-content: flex-start; }
  .rf-footer__copy { text-align: right; }
}

@media (max-width: 959px) {
  .rf-page { padding-bottom: 90px; }
}
`;

export default RheumazinForte;
