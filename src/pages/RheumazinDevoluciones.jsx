import { useEffect } from "react";
import RheumazinLegalLayout from "../components/RheumazinLegalLayout";

const RheumazinDevoluciones = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Cambios y devoluciones | Rheumatizin Forte — Cuidafy";
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <RheumazinLegalLayout title="Cambios y devoluciones" lastUpdate="Noviembre 2025">
      <p>
        En Cuidafy queremos que estés 100% conformes con tu compra de Rheumatizin Forte. Por
        eso te ofrecemos una <strong>garantía de satisfacción de 30 días</strong>. Si al
        finalizar el primer ciclo de uso no sentís mejora, te devolvemos el 100% del valor
        del producto. Acá te explicamos cómo funciona.
      </p>

      <h2>1. Garantía de satisfacción de 30 días</h2>
      <p>
        Si completaste el ciclo de 20 días de acción más los 10 días de estabilización
        siguiendo las indicaciones del prospecto y no notaste mejora en tu movilidad o en
        tus síntomas, te devolvemos el 100% del valor del producto sin preguntas ni
        trámites complicados.
      </p>
      <p>
        Esta garantía es adicional a los derechos que te otorga la
        <strong> Ley 24.240 de Defensa del Consumidor</strong> y no los reemplaza.
      </p>

      <h2>2. Derecho de arrepentimiento</h2>
      <p>
        Conforme al <strong>Artículo 34 de la Ley 24.240</strong>, tenés un plazo de
        <strong> 10 días corridos</strong> desde la recepción del producto para revocar la
        compra sin necesidad de justificar tu decisión. El producto debe estar sin usar, en
        su envase original y con el precinto de seguridad intacto.
      </p>

      <h2>3. Cómo solicitar una devolución</h2>
      <ol>
        <li>
          Escribinos por WhatsApp al <strong>+54 9 3764 33-1313</strong> o por email a
          <strong> hola@cuidafy.com.ar</strong> indicando tu número de pedido, nombre
          completo y motivo de la devolución.
        </li>
        <li>
          Nuestro equipo te responde dentro de las 48 hs hábiles confirmando el procedimiento
          y la dirección a donde deberás enviar el producto.
        </li>
        <li>
          Una vez que recibimos el producto y verificamos su estado, procesamos el reintegro
          por el mismo medio de pago utilizado en la compra original.
        </li>
      </ol>

      <h2>4. Condiciones del producto a devolver</h2>
      <ul>
        <li>
          Para el <strong>derecho de arrepentimiento (10 días)</strong>: el producto debe
          estar sin usar, en su envase original, cerrado y con el precinto intacto.
        </li>
        <li>
          Para la <strong>garantía de satisfacción (30 días)</strong>: podés devolver el
          envase incluso si ya empezaste el ciclo. Lo importante es que completes el
          tratamiento antes de reclamar, para que la garantía tenga sentido.
        </li>
        <li>
          El producto debe llegarnos en buenas condiciones de conservación (no expuesto a
          humedad extrema, sol directo o daños visibles).
        </li>
      </ul>

      <h2>5. Reintegros</h2>
      <p>
        Los reintegros se realizan por el mismo medio de pago utilizado en la compra:
      </p>
      <ul>
        <li>
          <strong>Tarjeta de crédito o débito:</strong> el reintegro se acredita en el
          resumen del mes siguiente, según los tiempos de Mercado Pago y tu banco.
        </li>
        <li>
          <strong>Transferencia bancaria:</strong> la devolución se procesa a una CBU de tu
          titularidad dentro de los 5 días hábiles posteriores a la recepción del producto.
        </li>
        <li>
          <strong>Efectivo (Pago Fácil / Rapipago):</strong> coordinamos con vos la forma de
          reintegro al momento de procesar la devolución.
        </li>
      </ul>

      <h2>6. Costos de envío en la devolución</h2>
      <ul>
        <li>
          Si el producto llega dañado, con fallas o en mal estado por nuestra culpa,
          <strong> nosotros nos hacemos cargo del costo del envío de devolución</strong>.
        </li>
        <li>
          Si la devolución es por derecho de arrepentimiento o por garantía de satisfacción,
          el costo del envío del producto de vuelta queda a cargo del comprador, salvo que
          acordemos algo distinto.
        </li>
      </ul>

      <h2>7. Cambios</h2>
      <p>
        Como Rheumatizin Forte es un producto único sin variantes, no realizamos
        "cambios" en sentido estricto. Si hubo un error en tu envío (por ejemplo recibiste
        un producto distinto al que compraste), contactanos inmediatamente y coordinamos el
        reemplazo sin costo para vos.
      </p>

      <h2>8. Productos no sujetos a devolución</h2>
      <p>
        No se aceptan devoluciones en los siguientes casos:
      </p>
      <ul>
        <li>
          Cuando se solicita pasado el plazo de 30 días desde la recepción del producto.
        </li>
        <li>
          Cuando el producto fue dañado por mal uso, almacenamiento incorrecto o exposición
          a condiciones contrarias a las indicadas en el envase.
        </li>
      </ul>

      <h2>9. Contacto</h2>
      <p>
        Para cualquier consulta sobre cambios, devoluciones o garantías, escribinos por el
        botón de WhatsApp que aparece más abajo o al email
        <strong> hola@cuidafy.com.ar</strong>. Atendemos de lunes a viernes en horario
        comercial y respondemos a la brevedad posible.
      </p>
    </RheumazinLegalLayout>
  );
};

export default RheumazinDevoluciones;
