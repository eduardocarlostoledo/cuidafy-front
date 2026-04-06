const calcularLiquidacion = (selectedRows) => {
    console.log("selectedRows", selectedRows);
    let totalProfesional = 0;
    let totalCalyaan = 0;
    let total = 0;
  
    selectedRows.forEach((row) => {
      if (row.servicios[0].nombre.includes("Valoracion")) {
        console.log("valoracion")

        totalProfesional += row.factura.precioTotal * 0.50;
        totalCalyaan += row.factura.precioTotal * 0.50;

      } else if (row.servicios[0].nombre.includes("corporativo")) {
        console.log("corporativo")
        totalProfesional += row.factura.precioTotal * 0.50;
        totalCalyaan += row.factura.precioTotal * 0.50;
      } else if (row.servicios[0].nombre.includes("express")) {
        console.log("express")
        totalProfesional += row.factura.precioTotal * 0.50;
        totalCalyaan += row.factura.precioTotal * 0.50;
      } else {
        console.log("otro de 39%")
        totalProfesional += row.factura.precioTotal * 0.61;
        totalCalyaan += row.factura.precioTotal * 0.39;
      }
      total += row.factura.precioTotal;
    });
  
    return { totalProfesional, totalCalyaan, total };
  };
  
  export default calcularLiquidacion;
  