import { useEffect, useState } from "react";
import clienteAxios from "../config/axios";

const useGetDateTableReservas = (rol) => {
  const [paginado, setPaginado] = useState({});

  const [limite, setLimite] = useState(20);
  const [pagina, setPagina] = useState(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerReservas = async () => {
      setLoading(true);
      let { data } = await clienteAxios.get(
        `api/buscar/ordenes?limite=${limite}&pagina=${pagina}`
      );

      setPaginado(data);
      setLoading(false);
    };



    obtenerReservas();
  }, [limite, pagina]);
  // console.log("PAGINA", pagina)
  return {
    paginado,
    pagina,
    loading,
    setLimite,
    setPagina,
  };
};

export default useGetDateTableReservas;
