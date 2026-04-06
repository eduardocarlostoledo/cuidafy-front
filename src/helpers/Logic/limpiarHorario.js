const limpiarHorario = (horario) => {
    const time = horario.split(" - ")[0];
    const [hour, minute] = time.split(":");
    const amPm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12}:${minute} ${amPm}`;
  }

  export default limpiarHorario