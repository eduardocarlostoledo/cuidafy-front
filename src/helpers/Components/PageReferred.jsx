import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import InvalidReference from "../../pages/InvalidReference";
import Register from "../../pages/Register";
import PageLoading from "./PageLoading";

const PageReferred = () => {
  const [referidoValida, setReferenciaValida] = useState(false);
  const [cargando, setCargando] = useState(true); // nueva variable de estado

  const { search } = useLocation();
  const referido = new URLSearchParams(search).get('referido');

  useEffect(() => {
    const obtenerReferido = async () => {
      try {
        const { data } = await clienteAxios.get(`/api/profesional/referidos`);
        setReferenciaValida(
          data.some(
            (referidoState) => referidoState?.codigoreferido === referido
          )
        );
      } catch (err) {
        console.log(err);
      }
      setCargando(false); // actualizar el estado para indicar que el proceso de carga ha finalizado
    };

    if (referido) {
      obtenerReferido();
    } else {
      setCargando(false); // si no hay referido, establece cargando a false para evitar mostrar el componente InvalidReference brevemente
    }
  }, [referido]);

  if (cargando) { // mostrar un spinner de carga mientras se verifica la referencia
    return <PageLoading />;
  }

  return referido ? (
    referidoValida ? <Register referido={referido} /> : <InvalidReference />
  ) : (
    <Register />
  );
};

export default PageReferred;
