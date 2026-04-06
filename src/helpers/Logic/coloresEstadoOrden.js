export const getEstadoOrdenClass = (estado_servicio) => {
    switch (estado_servicio) {
      case "Completado":
        return "text-green-600";
      case "Pendiente":
        return "text-yellow-600";
      case "Cancelado":
        return "text-red-600";
      default:
        return "";
    }
  };
