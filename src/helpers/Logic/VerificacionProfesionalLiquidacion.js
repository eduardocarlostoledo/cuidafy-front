export const verificacionProfesional = (fila, profesional) => {
  let resultado = fila.filter(
    (fil) =>
      fil &&
      profesional &&
      fil.profesional_id &&
      profesional._id &&
      fil.profesional_id._id === profesional._id
  );
  // console.log(fila, resultado, profesional, "verificacionProfesional");
  if (fila.length === resultado.length) {
    return true;
  }
  return false;
};
