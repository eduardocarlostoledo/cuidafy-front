const IMAGE_SIZE = 300;

const PALETTES = {
  acv: {
    background: "#E6F0FF",
    accent: "#1E4FA3",
    text: "#12305F",
  },
  acompanamiento: {
    background: "#FDEFD8",
    accent: "#B9770E",
    text: "#6E3B00",
  },
  terapeutico: {
    background: "#E8F6F3",
    accent: "#148F77",
    text: "#0F5B4C",
  },
  vigilancia: {
    background: "#FDEDEC",
    accent: "#C0392B",
    text: "#7B241C",
  },
  postoperatorio: {
    background: "#F4ECF7",
    accent: "#8E44AD",
    text: "#5B2C6F",
  },
  enfermeria: {
    background: "#EBF5FB",
    accent: "#2E86C1",
    text: "#1B4F72",
  },
  guardia: {
    background: "#FEF5E7",
    accent: "#D35400",
    text: "#7E3F00",
  },
  terapia: {
    background: "#EAFAF1",
    accent: "#239B56",
    text: "#196F3D",
  },
  general: {
    background: "#F4F6F7",
    accent: "#5D6D7E",
    text: "#2C3E50",
  },
};

const SPECIALTY_META = {
  "Apoyo a la familia del paciente": {
    shortLabel: "Apoyo familiar",
    palette: "general",
  },
  "ACV y neurológicos": {
    shortLabel: "ACV y neuro",
    palette: "acv",
  },
  "Acompañamiento básico": {
    shortLabel: "Acompañamiento",
    palette: "acompanamiento",
  },
  "Acompañamiento terapéutico": {
    shortLabel: "Terapéutico",
    palette: "terapeutico",
  },
  "Alimentación especial": {
    shortLabel: "Alimentación",
    palette: "general",
  },
  "Alzheimer y demencias": {
    shortLabel: "Demencias",
    palette: "general",
  },
  "Compañía y vigilancia": {
    shortLabel: "Vigilancia",
    palette: "vigilancia",
  },
  "Cuidados crónicos": {
    shortLabel: "Crónicos",
    palette: "general",
  },
  "Cuidados geriátricos": {
    shortLabel: "Geriátricos",
    palette: "general",
  },
  "Cuidados paliativos": {
    shortLabel: "Paliativos",
    palette: "general",
  },
  "Cuidados post-operatorios": {
    shortLabel: "Post operatorio",
    palette: "postoperatorio",
  },
  Diabetes: {
    shortLabel: "Diabetes",
    palette: "general",
  },
  "Enfermería general": {
    shortLabel: "Enfermería",
    palette: "enfermeria",
  },
  "Fisioterapia básica": {
    shortLabel: "Fisioterapia",
    palette: "general",
  },
  "Guardia 24 horas": {
    shortLabel: "Guardia 24 h",
    palette: "guardia",
  },
  "Heridas y úlceras": {
    shortLabel: "Heridas",
    palette: "general",
  },
  "Movilidad y traslados": {
    shortLabel: "Traslados",
    palette: "general",
  },
  Oncología: {
    shortLabel: "Oncología",
    palette: "general",
  },
  Parkinson: {
    shortLabel: "Parkinson",
    palette: "general",
  },
  Pediatría: {
    shortLabel: "Pediatría",
    palette: "general",
  },
  Respiratorios: {
    shortLabel: "Respiratorio",
    palette: "general",
  },
  "Terapia ocupacional": {
    shortLabel: "Terapia ocup.",
    palette: "terapia",
  },
};

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const buildPlaceholderImage = (title, paletteName = "general") => {
  const palette = PALETTES[paletteName] || PALETTES.general;
  const safeTitle = escapeXml(title || "Servicio");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_SIZE}" height="${IMAGE_SIZE}" viewBox="0 0 ${IMAGE_SIZE} ${IMAGE_SIZE}">
      <rect width="${IMAGE_SIZE}" height="${IMAGE_SIZE}" rx="28" fill="${palette.background}" />
      <circle cx="240" cy="58" r="34" fill="${palette.accent}" fill-opacity="0.16" />
      <circle cx="54" cy="244" r="42" fill="${palette.accent}" fill-opacity="0.12" />
      <rect x="26" y="26" width="248" height="248" rx="24" fill="white" fill-opacity="0.5" stroke="${palette.accent}" stroke-opacity="0.18" />
      <rect x="44" y="44" width="82" height="10" rx="5" fill="${palette.accent}" fill-opacity="0.28" />
      <rect x="44" y="182" width="150" height="12" rx="6" fill="${palette.accent}" fill-opacity="0.18" />
      <rect x="44" y="204" width="112" height="12" rx="6" fill="${palette.accent}" fill-opacity="0.12" />
      <circle cx="88" cy="112" r="32" fill="${palette.accent}" fill-opacity="0.2" />
      <path d="M88 92c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 12a8 8 0 1 1 0 16 8 8 0 0 1 0-16z" fill="${palette.accent}" />
      <text x="44" y="154" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${palette.text}">${safeTitle}</text>
    </svg>
  `.trim();

  return toDataUri(svg);
};

export const especialidadImagenes = Object.fromEntries(
  Object.entries(SPECIALTY_META).map(([specialty, meta]) => [
    specialty,
    buildPlaceholderImage(meta.shortLabel, meta.palette),
  ])
);

export const getGenericServiceImage = (label = "Servicio") =>
  buildPlaceholderImage(label, "general");

export const getImagenEspecialidad = (especialidad) => {
  if (!especialidad) {
    return getGenericServiceImage("Servicio");
  }

  return (
    especialidadImagenes[especialidad] ||
    buildPlaceholderImage(especialidad, "general")
  );
};

export const getEspecialidadesDisponibles = () => Object.keys(especialidadImagenes);

export const especialidadExiste = (especialidad) => especialidad in especialidadImagenes;
