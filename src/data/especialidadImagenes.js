/**
 * Mapeo de especialidades a imágenes
 * Actualizar URLs según recursos disponibles en Calyaan
 */
export const especialidadImagenes = {
  // Servicios de cuidado
  "Apoyo a la familia del paciente": "https://via.placeholder.com/300?text=Apoyo+Familia",
  "ACV y neurológicos": "https://via.placeholder.com/300?text=ACV+Neurologicos",
  "Acompañamiento básico": "https://via.placeholder.com/300?text=Acompanamiento",
  "Acompañamiento terapéutico": "https://via.placeholder.com/300?text=Terapeutico",
  "Alimentación especial": "https://via.placeholder.com/300?text=Alimentacion",
  "Alzheimer y demencias": "https://via.placeholder.com/300?text=Alzheimer",
  "Compañía y vigilancia": "https://via.placeholder.com/300?text=Vigilancia",
  "Cuidados crónicos": "https://via.placeholder.com/300?text=Cronicos",
  "Cuidados geriátricos": "https://via.placeholder.com/300?text=Geriatricos",
  "Cuidados paliativos": "https://via.placeholder.com/300?text=Paliativos",
  "Cuidados post-operatorios": "https://via.placeholder.com/300?text=PostOp",
  "Diabetes": "https://via.placeholder.com/300?text=Diabetes",
  "Enfermería general": "https://via.placeholder.com/300?text=Enfermeria",
  "Fisioterapia básica": "https://via.placeholder.com/300?text=Fisioterapia",
  "Guardia 24 horas": "https://via.placeholder.com/300?text=Guardia24h",
  "Heridas y úlceras": "https://via.placeholder.com/300?text=Heridas",
  "Movilidad y traslados": "https://via.placeholder.com/300?text=Movilidad",
  "Oncología": "https://via.placeholder.com/300?text=Oncologia",
  "Parkinson": "https://via.placeholder.com/300?text=Parkinson",
  "Pediatría": "https://via.placeholder.com/300?text=Pediatria",
  "Respiratorios": "https://via.placeholder.com/300?text=Respiratorios",
  "Terapia ocupacional": "https://via.placeholder.com/300?text=Ocupacional",
};

/**
 * Obtener imagen para una especialidad
 * @param {string} especialidad Nombre de la especialidad
 * @returns {string} URL de la imagen
 */
export const getImagenEspecialidad = (especialidad) => {
  if (!especialidad) {
    return "https://via.placeholder.com/300?text=Sin+Imagen";
  }

  return (
    especialidadImagenes[especialidad] ||
    "https://via.placeholder.com/300?text=Servicio"
  );
};

/**
 * Obtener todas las especialidades disponibles
 * @returns {Array<string>} Array de nombres de especialidades
 */
export const getEspecialidadesDisponibles = () => {
  return Object.keys(especialidadImagenes);
};

/**
 * Validar si una especialidad existe
 * @param {string} especialidad Nombre de la especialidad
 * @returns {boolean} true si existe, false si no
 */
export const especialidadExiste = (especialidad) => {
  return especialidad in especialidadImagenes;
};
