import { useEffect, useState } from "react";
import clienteAxios from "../config/axios";

const useGetDateTable = (rol) => {
  const [paginado, setPaginado] = useState({});

  const [limite, setLimite] = useState(5);
  const [pagina, setPagina] = useState(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      setLoading(true);
      let { data } = await clienteAxios.get(
        `api/buscar/usuarios?limite=${limite}&pagina=${pagina}${
          rol && `&rol=${rol}`
        }`
      );
      setPaginado({ ...data, resultadoFilter: data.resultados });
      setLoading(false);
    };

    obtenerUsuarios();
  }, [limite, pagina]);

  const handleFilterUsers = (e) => {
  
    if (e.target.value === "Todos") {
      setPaginado({ ...paginado, resultadoFilter: paginado.resultados });
    } else if (e.target.value === "Activo") {
      let filterActivos = paginado.resultados.filter(
        (userState) => userState.estado
      );

      setPaginado({ ...paginado, resultadoFilter: filterActivos });
    } else if (e.target.value === "Suspendido") {
      let filterSuspendidos = paginado.resultados.filter(
        (userState) => !userState.estado
      );

      setPaginado({ ...paginado, resultadoFilter: filterSuspendidos });
    }
  };

  return {
    paginado,
    pagina,
    loading,
    setLimite,
    setPagina,
    handleFilterUsers
  };
};

export default useGetDateTable;
