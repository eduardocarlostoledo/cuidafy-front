export const GEOREF_SEPARATOR = " > ";

export const formatGeorefLocation = ({
  provincia = "",
  municipio = "",
  localidad = "",
} = {}) => {
  const parts = [provincia, municipio, localidad].filter(Boolean);
  return parts.join(GEOREF_SEPARATOR);
};

export const parseGeorefLocation = (value) => {
  if (!value || typeof value !== "string" || !value.includes(GEOREF_SEPARATOR)) {
    return {
      provincia: "",
      municipio: "",
      localidad: "",
      isStructured: false,
    };
  }

  const [provincia = "", municipio = "", localidad = ""] = value
    .split(GEOREF_SEPARATOR)
    .map((item) => item.trim());

  return {
    provincia,
    municipio,
    localidad,
    isStructured: true,
  };
};
