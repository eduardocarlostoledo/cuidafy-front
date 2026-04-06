export const getEstadoPagoClass = (estadoPago) => {
    switch (estadoPago) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "";
    }
  };

  