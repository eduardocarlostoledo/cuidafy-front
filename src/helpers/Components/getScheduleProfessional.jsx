const getScheduleProfessional = (horariosForm) => {
    const result = horariosForm.map((horario) => horario.hora.split(""));
    return result;
  };
  
  export default getScheduleProfessional;
  
// const getScheduleProfessional = (horariosForm)=>{

//     const result = horariosForm.map((horario)=>(
//         horario.hora.split("")
//     ))

// }

// export default getScheduleProfessional