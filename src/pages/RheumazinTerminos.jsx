import { useEffect } from "react";
import RheumazinLegalLayout from "../components/RheumazinLegalLayout";

const RheumazinTerminos = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Términos y condiciones | Rheumatizin Forte — Cuidafy";
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <RheumazinLegalLayout title="Términos y condiciones" lastUpdate="Noviembre 2025">
      <p>
        Bienvenido a Cuidafy. Los presentes Términos y Condiciones (en adelante, los
        <strong> "Términos"</strong>) regulan el acceso y uso de la página de producto
        Rheumatizin Forte alojada en <strong>cuidafy.com.ar/rheumazin-forte</strong> y el
        proceso de compra realizado a través del checkout de Tiendanube en
        <strong> cuidafy.mitiendanube.com</strong>. Al navegar el sitio o realizar una compra,
        aceptás estos Términos en su totalidad.
      </p>

      <h2>1. Identificación del vendedor</h2>
      <p>
        El producto Rheumatizin Forte es comercializado por <strong>Cuidafy</strong>, con
        domicilio comercial en la provincia de Misiones, Argentina. Para cualquier consulta,
        reclamo o ejercicio de derechos, podés contactarnos por WhatsApp al
        <strong> +54 9 3764 33-1313</strong> o al email <strong>hola@cuidafy.com.ar</strong>.
      </p>

      <h2>2. Descripción del producto</h2>
      <p>
        Rheumatizin Forte es un producto de <strong>venta libre</strong> disponible también en
        farmacias de Argentina. La información publicada en la landing tiene carácter
        orientativo y no reemplaza la consulta con un profesional de la salud. Si tenés
        condiciones crónicas, tomás medicación regularmente, estás embarazada o en período de
        lactancia, consultá con tu médico antes de iniciar cualquier tratamiento.
      </p>

      <h2>3. Precio, pago y cuotas</h2>
      <p>
        El precio publicado corresponde a una oferta promocional por tiempo limitado y puede
        modificarse sin previo aviso. El precio final, impuestos aplicables y medios de pago
        disponibles (tarjeta de crédito, débito, transferencia o efectivo) se confirman en el
        checkout de Tiendanube antes de finalizar la compra.
      </p>
      <ul>
        <li>El precio incluye el valor del producto únicamente.</li>
        <li>
          Las cuotas publicadas son referenciales y pueden variar según el banco emisor, el
          tipo de tarjeta y la promoción vigente al momento del pago.
        </li>
        <li>
          Los impuestos y recargos por financiación (si los hubiera) son informados de forma
          transparente en el checkout antes de confirmar la operación.
        </li>
      </ul>

      <h2>4. Envíos</h2>
      <p>
        Enviamos Rheumatizin Forte a todo el país. El costo y el plazo de envío se calculan
        automáticamente en el checkout de Tiendanube en función del código postal ingresado.
        Para más información sobre zonas, transportistas y tiempos estimados, revisá la
        sección de envíos al momento de pagar.
      </p>

      <h2>5. Uso correcto del producto</h2>
      <p>
        Rheumatizin Forte debe ser utilizado siguiendo las indicaciones del envase y el
        prospecto incluido. El usuario se compromete a:
      </p>
      <ul>
        <li>Respetar la posología indicada.</li>
        <li>No exceder la dosis diaria recomendada.</li>
        <li>Conservar el producto en lugar seco, a temperatura ambiente y fuera del alcance de niños.</li>
        <li>Consultar a un profesional ante cualquier reacción adversa.</li>
      </ul>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        Cuidafy actúa como canal de venta y no reemplaza la consulta médica. Los testimonios
        publicados en la landing corresponden a experiencias individuales y los resultados
        pueden variar entre personas. No garantizamos resultados idénticos para todos los
        usuarios. Cuidafy no será responsable por daños derivados del uso incorrecto del
        producto o del incumplimiento de las indicaciones del prospecto.
      </p>

      <h2>7. Propiedad intelectual</h2>
      <p>
        Todo el contenido de la landing (textos, imágenes, logotipos, diseño) es propiedad de
        Cuidafy o de sus proveedores y está protegido por las leyes de propiedad intelectual
        vigentes en Argentina. No está permitida su reproducción total o parcial sin
        autorización expresa.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Cuidafy se reserva el derecho de modificar estos Términos en cualquier momento. Las
        modificaciones entran en vigencia al ser publicadas en esta página. Te recomendamos
        revisar periódicamente esta sección.
      </p>

      <h2>9. Ley aplicable y jurisdicción</h2>
      <p>
        Estos Términos se rigen por las leyes de la República Argentina. Cualquier
        controversia se someterá a los Tribunales Ordinarios de la Provincia de Misiones,
        sin perjuicio de las acciones que pueda iniciar el consumidor en el marco de la Ley
        24.240 de Defensa del Consumidor.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Si tenés preguntas sobre estos Términos, podés escribirnos al botón de WhatsApp de
        más abajo o al email <strong>hola@cuidafy.com.ar</strong>. Respondemos de lunes a
        viernes en horario comercial.
      </p>
    </RheumazinLegalLayout>
  );
};

export default RheumazinTerminos;
