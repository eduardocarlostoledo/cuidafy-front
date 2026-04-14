import { useEffect } from "react";
import RheumazinLegalLayout from "../components/RheumazinLegalLayout";

const RheumazinPrivacidad = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Política de privacidad | Rheumatizin Forte — Cuidafy";
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <RheumazinLegalLayout title="Política de privacidad" lastUpdate="Noviembre 2025">
      <p>
        En Cuidafy respetamos tu privacidad y nos tomamos en serio la protección de tus datos
        personales. Esta Política de Privacidad describe qué información recolectamos cuando
        visitás la página de Rheumatizin Forte o comprás el producto, cómo la usamos, con
        quién la compartimos y qué derechos tenés sobre ella, en los términos de la
        <strong> Ley 25.326 de Protección de Datos Personales</strong> de la República
        Argentina.
      </p>

      <h2>1. Qué datos recolectamos</h2>
      <p>Cuando visitás nuestra landing, recolectamos automáticamente:</p>
      <ul>
        <li>Datos técnicos: dirección IP, tipo de navegador, sistema operativo, páginas visitadas y tiempo de permanencia.</li>
        <li>Cookies y tecnologías similares para analítica y mejora del sitio.</li>
      </ul>
      <p>Cuando finalizás una compra en Tiendanube, se recolectan adicionalmente:</p>
      <ul>
        <li>Nombre y apellido.</li>
        <li>Documento de identidad (DNI).</li>
        <li>Email de contacto.</li>
        <li>Teléfono.</li>
        <li>Dirección de envío (calle, número, localidad, provincia, código postal).</li>
        <li>Datos de facturación.</li>
      </ul>
      <p>
        Los datos de tu tarjeta de crédito o medio de pago <strong>nunca son almacenados por
        Cuidafy</strong>: se procesan directamente en el entorno seguro de Mercado Pago o del
        procesador de pagos habilitado por Tiendanube.
      </p>

      <h2>2. Para qué usamos tus datos</h2>
      <p>Usamos tus datos personales exclusivamente para:</p>
      <ul>
        <li>Procesar y enviar tu pedido.</li>
        <li>Coordinar la logística con la empresa de correo.</li>
        <li>Emitir la factura o comprobante correspondiente.</li>
        <li>Enviarte información relevante sobre el estado de tu compra por email o WhatsApp.</li>
        <li>Responder consultas y brindarte soporte.</li>
        <li>Cumplir con obligaciones legales e impositivas.</li>
      </ul>

      <h2>3. Con quién compartimos tus datos</h2>
      <p>
        Tus datos se comparten únicamente con los terceros necesarios para poder completar la
        compra y el envío:
      </p>
      <ul>
        <li>
          <strong>Tiendanube</strong> — plataforma de ecommerce que procesa el checkout y
          gestiona el carrito.
        </li>
        <li>
          <strong>Mercado Pago</strong> u otro procesador de pagos habilitado por Tiendanube
          para la cobranza del producto.
        </li>
        <li>
          <strong>Correo Argentino, Andreani u otras empresas de logística</strong> para la
          entrega del producto en el domicilio indicado.
        </li>
        <li>
          Herramientas de analítica (por ejemplo Google Analytics) con datos agregados y
          anónimos, sin identificación personal directa.
        </li>
      </ul>
      <p>
        No vendemos, alquilamos ni cedemos tus datos a terceros con fines comerciales no
        autorizados por vos.
      </p>

      <h2>4. Cookies</h2>
      <p>
        La landing utiliza cookies propias y de terceros para mejorar tu experiencia, recordar
        tus preferencias (como el timer de la oferta) y medir el desempeño del sitio. Podés
        configurar tu navegador para bloquear las cookies, pero algunas funcionalidades pueden
        no estar disponibles si las desactivás.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        En cualquier momento podés ejercer los siguientes derechos sobre tus datos personales:
      </p>
      <ul>
        <li><strong>Acceso</strong>: saber qué datos tuyos tenemos almacenados.</li>
        <li><strong>Rectificación</strong>: corregir datos inexactos o incompletos.</li>
        <li><strong>Supresión</strong>: pedir la eliminación de tus datos cuando ya no sean necesarios.</li>
        <li><strong>Oposición</strong>: oponerte al uso de tus datos para fines específicos.</li>
      </ul>
      <p>
        Para ejercer estos derechos, escribinos a <strong>hola@cuidafy.com.ar</strong> o por
        WhatsApp al <strong>+54 9 3764 33-1313</strong>. Respondemos dentro de los 10 días
        hábiles conforme a la normativa vigente.
      </p>

      <h2>6. Conservación de los datos</h2>
      <p>
        Conservamos tus datos por el tiempo necesario para cumplir con los fines descriptos
        en esta política y para cumplir con las obligaciones legales, fiscales e impositivas
        aplicables. Una vez cumplido ese plazo, los datos son eliminados o anonimizados.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Implementamos medidas técnicas y organizativas razonables para proteger tus datos
        contra accesos no autorizados, pérdida o alteración. Ninguna transmisión por Internet
        es 100% segura, pero trabajamos activamente para reducir los riesgos.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        La compra de Rheumatizin Forte está destinada a personas mayores de 18 años. No
        recolectamos intencionalmente datos de menores. Si sos padre, madre o tutor y creés
        que un menor nos envió datos, contactanos para eliminarlos.
      </p>

      <h2>9. Autoridad de control</h2>
      <p>
        Si considerás que tus derechos han sido vulnerados, podés presentar un reclamo ante
        la <strong>Agencia de Acceso a la Información Pública</strong> de la República
        Argentina, autoridad de aplicación de la Ley 25.326.
      </p>

      <h2>10. Actualizaciones de esta política</h2>
      <p>
        Esta política puede actualizarse periódicamente. La versión vigente es siempre la
        publicada en esta página, con la fecha de última actualización indicada al inicio.
      </p>
    </RheumazinLegalLayout>
  );
};

export default RheumazinPrivacidad;
