const calcularCupon = ({valor, tipoDescuento,descuento}) => {



  let precioTotal =  0;

  if (tipoDescuento === 'porcentaje') {
    precioTotal = valor - (valor * (descuento / 100));
  } else {
    precioTotal = valor - descuento;
  }

  return precioTotal;
};

export default calcularCupon;