import { getImagenEspecialidad } from "../data/especialidadImagenes";

/**
 * Normalizar disponibilidad a estructura de Card
 * @param {Object} disponibilidad Datos crudos del backend
 * @returns {Object} Objeto normalizado para Card
 */
export const normalizarDisponibilidadACard = (disponibilidad) => {
  if (!disponibilidad || !disponibilidad._id) {
    return null;
  }

  const especialidad = disponibilidad.creador?.especialidad?.[0] || "Servicio";
  const horarios = disponibilidad.horarios || disponibilidad.disponibilidad || [];
  const profesionalNombre = disponibilidad.creador?.creador?.nombre || "";
  const profesionalApellido = disponibilidad.creador?.creador?.apellido || "";

  return {
    id: disponibilidad._id,
    image: getImagenEspecialidad(especialidad),
    text: especialidad,
    count: horarios.length.toString(),
    link: `/servicio?id=${disponibilidad._id}`,
    // Datos adicionales para debugging
    metadata: {
      disponibilidadId: disponibilidad._id,
      profesional: `${profesionalNombre} ${profesionalApellido}`.trim(),
      especialidad,
      fecha: disponibilidad.fecha,
      horariosDisponibles: horarios.filter((h) => h.stock).length,
    },
  };
};

/**
 * Normalizar disponibilidades (array)
 * @param {Array<Object>} disponibilidades Array de disponibilidades
 * @returns {Array<Object>} Array normalizado
 */
export const normalizarDisponibilidades = (disponibilidades) => {
  if (!Array.isArray(disponibilidades)) {
    return [];
  }

  return disponibilidades
    .map((disp) => normalizarDisponibilidadACard(disp))
    .filter((card) => card !== null);
};

/**
 * Extraer detalles del profesional
 * @param {Object} disponibilidad Datos crudos del backend
 * @returns {Object} Objeto con datos del profesional
 */
export const extraerProfesional = (disponibilidad) => {
  if (!disponibilidad || !disponibilidad.creador) {
    return {
      id: null,
      nombre: "Desconocido",
      apellido: "",
      especialidades: [],
      localidades: [],
    };
  }

  const { creador } = disponibilidad;
  const { nombre = "", apellido = "" } = creador.creador || {};

  return {
    id: creador._id,
    nombre,
    apellido,
    especialidades: creador.especialidad || [],
    localidades: creador.localidadesLaborales || [],
  };
};

/**
 * Extraer horarios disponibles
 * @param {Object} disponibilidad Datos crudos del backend
 * @returns {Array<Object>} Array de horarios con detalles
 */
export const extraerHorarios = (disponibilidad) => {
  if (!disponibilidad) {
    return [];
  }

  const horarios = disponibilidad.horarios || disponibilidad.disponibilidad || [];

  return horarios.map((horario) => ({
    id: horario._id,
    hora: horario.hora,
    disponible: horario.stock === true,
    stock: horario.stock,
  }));
};

/**
 * Normalizar carrito para guardar en localStorage
 * @param {Object} disponibilidad Datos crudos del backend
 * @param {string} horarioId ID del horario seleccionado
 * @param {string} horaSeleccionada Hora seleccionada (ej: "06:00-07:00")
 * @returns {Object} Objeto para carrito
 */
export const crearItemCarrito = (
  disponibilidad,
  horarioId,
  horaSeleccionada
) => {
  if (
    !disponibilidad ||
    !disponibilidad._id ||
    !horarioId ||
    !horaSeleccionada
  ) {
    return null;
  }

  const profesional = extraerProfesional(disponibilidad);

  return {
    disponibilidadId: disponibilidad._id,
    profesionalId: disponibilidad.creador._id,
    usuarioId: disponibilidad.creador.creador._id,
    fecha: disponibilidad.fecha,
    horarioId,
    hora: horaSeleccionada,
    profesional: {
      nombre: profesional.nombre,
      apellido: profesional.apellido,
      especialidades: profesional.especialidades,
    },
    createdAt: new Date().toISOString(),
  };
};

/**
 * Validar estructura de disponibilidad
 * @param {Object} disponibilidad Objeto a validar
 * @returns {Array<string>} Array de errores (vacío si es válido)
 */
export const validarDisponibilidad = (disponibilidad) => {
  const errores = [];

  if (!disponibilidad) {
    errores.push("Disponibilidad no existe");
    return errores;
  }

  if (!disponibilidad._id) {
    errores.push("Falta _id");
  }

  if (!disponibilidad.fecha) {
    errores.push("Falta fecha");
  }

  if (
    !Array.isArray(disponibilidad.horarios) &&
    !Array.isArray(disponibilidad.disponibilidad)
  ) {
    errores.push("Falta array de horarios");
  }

  if (!disponibilidad.creador) {
    errores.push("Falta información del creador");
  } else {
    if (!disponibilidad.creador._id) {
      errores.push("Falta creador._id");
    }
    if (!Array.isArray(disponibilidad.creador.especialidad)) {
      errores.push("Falta especialidad");
    }
    if (!disponibilidad.creador.creador) {
      errores.push("Falta datos del profesional");
    }
  }

  return errores;
};
