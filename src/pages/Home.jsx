import React, { lazy, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import {
  EnvironmentOutlined,
  LoginOutlined,
  CompassOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useDisponibilidades } from "../hooks/useDisponibilidades";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const PREFERENCE_PRESETS = [
  {
    id: "cuidado_247",
    title: "Cuidado 24/7",
    description: "Acompañamiento continuo, control y apoyo durante todo el día.",
    tags: ["enfer", "cuidad", "acompan", "geri"],
  },
  {
    id: "higiene_personal",
    title: "Baños e higiene",
    description: "Asistencia para baño, higiene personal y cambios posturales.",
    tags: ["cuidad", "enfer", "higiene", "auxiliar"],
  },
  {
    id: "acompanamiento_hogar",
    title: "Baño + casa + trámites",
    description: "Acompañamiento con tareas del hogar y gestiones cotidianas.",
    tags: ["cuidad", "acompan", "domic", "asistente", "hogar"],
  },
];

const LOCATION_STORAGE_KEY = "preferred_localidad";
const PRESET_STORAGE_KEY = "preferred_care_preset";

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const scoreSpecialty = (specialty = "", presetTags = []) => {
  const normalizedSpecialty = normalizeText(specialty);
  return presetTags.reduce(
    (total, tag) => (normalizedSpecialty.includes(tag) ? total + 1 : total),
    0
  );
};

const getProfile = () => {
  try {
    const rawProfile = localStorage.getItem("profile");
    return rawProfile ? JSON.parse(rawProfile) : null;
  } catch (error) {
    console.error("No pudimos leer el perfil local:", error);
    return null;
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { disponibilidades, loading, error } = useDisponibilidades();
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(PREFERENCE_PRESETS[0].id);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationHint, setLocationHint] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedLocalidad = localStorage.getItem(LOCATION_STORAGE_KEY) || "";
    const storedPreset = localStorage.getItem(PRESET_STORAGE_KEY) || "";

    setProfile(getProfile());

    if (storedLocalidad) {
      setSelectedLocalidad(storedLocalidad);
    }

    if (storedPreset) {
      setSelectedPreset(storedPreset);
    }
  }, []);

  const groupedAvailability = useMemo(() => {
    const groups = {};

    (disponibilidades || []).forEach((disponibilidad) => {
      const professional = disponibilidad.creador;
      const specialties = professional?.especialidad || [];
      const localidades = professional?.localidadesLaborales || [];

      specialties.forEach((specialty) => {
        localidades.forEach((localidad) => {
          const key = `${specialty}::${localidad}`;

          if (!groups[key]) {
            groups[key] = {
              specialty,
              localidad,
              professionals: new Set(),
              slots: 0,
            };
          }

          groups[key].professionals.add(
            professional?.creador?._id || `${professional?._id || key}-${specialty}-${localidad}`
          );
          groups[key].slots +=
            (disponibilidad?.horarios || disponibilidad?.disponibilidad || []).filter(
              (item) => item.stock !== false
            ).length || 0;
        });
      });
    });

    return Object.values(groups).map((group) => ({
      ...group,
      professionalsCount: group.professionals.size,
    }));
  }, [disponibilidades]);

  const localidades = useMemo(() => {
    const unique = new Set(
      groupedAvailability.map((item) => item.localidad).filter(Boolean)
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [groupedAvailability]);

  useEffect(() => {
    if (!selectedLocalidad && localidades.length > 0) {
      const storedLocalidad = localStorage.getItem(LOCATION_STORAGE_KEY);
      setSelectedLocalidad(storedLocalidad || localidades[0]);
    }
  }, [localidades, selectedLocalidad]);

  const selectedPresetConfig =
    PREFERENCE_PRESETS.find((preset) => preset.id === selectedPreset) ||
    PREFERENCE_PRESETS[0];

  const recommendedServices = useMemo(() => {
    const filteredByLocation = selectedLocalidad
      ? groupedAvailability.filter(
          (item) => normalizeText(item.localidad) === normalizeText(selectedLocalidad)
        )
      : groupedAvailability;

    return filteredByLocation
      .map((item) => ({
        ...item,
        score: scoreSpecialty(item.specialty, selectedPresetConfig.tags),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.professionalsCount !== a.professionalsCount) {
          return b.professionalsCount - a.professionalsCount;
        }
        return b.slots - a.slots;
      })
      .slice(0, 6);
  }, [groupedAvailability, selectedLocalidad, selectedPresetConfig]);

  const localServices = useMemo(() => {
    const source = selectedLocalidad
      ? groupedAvailability.filter(
          (item) => normalizeText(item.localidad) === normalizeText(selectedLocalidad)
        )
      : groupedAvailability;

    return source
      .sort((a, b) => {
        if (b.professionalsCount !== a.professionalsCount) {
          return b.professionalsCount - a.professionalsCount;
        }
        return b.slots - a.slots;
      })
      .slice(0, 8);
  }, [groupedAvailability, selectedLocalidad]);

  const persistPreferences = (localidad = selectedLocalidad, preset = selectedPreset) => {
    if (localidad) {
      localStorage.setItem(LOCATION_STORAGE_KEY, localidad);
      localStorage.setItem("localidad", localidad);
    }
    if (preset) {
      localStorage.setItem(PRESET_STORAGE_KEY, preset);
    }
  };

  const findClosestLocalidad = (candidate = "") => {
    const normalizedCandidate = normalizeText(candidate);

    return (
      localidades.find(
        (localidad) =>
          normalizedCandidate.includes(normalizeText(localidad)) ||
          normalizeText(localidad).includes(normalizedCandidate)
      ) || ""
    );
  };

  const detectLocalidad = () => {
    if (!navigator.geolocation) {
      message.info("Tu navegador no permite detectar ubicación.");
      return;
    }

    setIsDetectingLocation(true);
    setLocationHint("Buscando tu zona...");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&accept-language=es`
          );
          const data = await response.json();
          const address = data?.address || {};
          const detectedName =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state_district ||
            "";

          const matchedLocalidad = findClosestLocalidad(detectedName);

          if (matchedLocalidad) {
            setSelectedLocalidad(matchedLocalidad);
            persistPreferences(matchedLocalidad, selectedPreset);
            setLocationHint(`Detectamos ${matchedLocalidad} y ya la dejamos seleccionada.`);
            message.success(`Zona detectada: ${matchedLocalidad}`);
          } else if (detectedName) {
            setLocationHint(
              `Detectamos ${detectedName}, pero preferimos que confirmes la localidad disponible más cercana.`
            );
            message.info("Confirmá tu localidad para afinar la recomendación.");
          } else {
            setLocationHint("No pudimos traducir tu ubicación a una localidad útil.");
          }
        } catch (error) {
          console.error("Error al detectar localidad:", error);
          setLocationHint("No pudimos geoubicar tu localidad. Podés elegirla manualmente.");
          message.error("No pudimos detectar tu localidad automáticamente.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Error de geolocalización:", error);
        setLocationHint("No pudimos acceder a tu ubicación. Elegí tu localidad manualmente.");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleViewService = (specialty, localidad) => {
    persistPreferences(localidad, selectedPreset);
    const params = new URLSearchParams({
      preset: selectedPreset,
      localidad,
      especialidad: specialty,
    });

    navigate(`/cuidado/matches?${params.toString()}`);
  };

  const handleSeeRecommendations = () => {
    persistPreferences();

    if (recommendedServices.length > 0) {
      const params = new URLSearchParams({
        preset: selectedPreset,
        localidad: selectedLocalidad || "",
      });
      navigate(`/encontrar-cuidado?${params.toString()}`);
      return;
    }

    navigate("/encontrar-cuidado");
  };

  return (
    <div className="min-h-screen bg-[#f5efe5] text-slate-900">
      <Header />

      <main>
        <section className="border-b border-[#dccfbf] bg-[linear-gradient(135deg,#fff8ed_0%,#f5efe5_45%,#ebddcb_100%)]">
          <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-full bg-[#ead9bd] px-4 py-2 text-sm font-semibold text-[#6f5120]">
                <CompassOutlined className="mr-2" />
                Elegí necesidad y zona antes de completar tu perfil
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                {!profile?._id && (
                  <Link
                    to="/login"
                    className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 font-semibold hover:bg-white"
                  >
                    <LoginOutlined className="mr-2" />
                    Ingresar
                  </Link>
                )}
                <Link
                  to="/loginProfesional"
                  className="rounded-full border border-slate-300 px-4 py-2 font-semibold hover:bg-white/70"
                >
                  Profesional
                </Link>
                <Link
                  to="/logindashboard"
                  className="rounded-full border border-slate-300 px-4 py-2 font-semibold hover:bg-white/70"
                >
                  Admin
                </Link>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
              <div>
                <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.24em] text-[#7d5a21]">
                  Flujo de ingreso más amable
                </p>
                <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-6xl">
                  Primero te orientamos. Después, solo si avanzás, te pedimos los datos.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                  Entrá, decinos tu zona o dejá que la detectemos, elegí qué tipo de ayuda
                  necesitás y te recomendamos opciones reales. Teléfono y dirección quedan
                  para el momento de coordinar o reservar.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-[#dccfbf] bg-white/80 p-5">
                    <p className="text-3xl font-bold">{localidades.length || 0}</p>
                    <p className="mt-2 text-sm text-slate-600">zonas con disponibilidad</p>
                  </div>
                  <div className="rounded-3xl border border-[#dccfbf] bg-white/80 p-5">
                    <p className="text-3xl font-bold">{groupedAvailability.length || 0}</p>
                    <p className="mt-2 text-sm text-slate-600">coincidencias activas por zona</p>
                  </div>
                  <div className="rounded-3xl border border-[#dccfbf] bg-white/80 p-5">
                    <p className="text-3xl font-bold">
                      {recommendedServices[0]?.professionalsCount || 0}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">profesionales en tu mejor match</p>
                  </div>
                </div>

                <div className="mt-8 rounded-[2rem] border border-[#dccfbf] bg-white/70 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
                    Así funciona
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-[#f7f1e7] p-4">
                      <p className="font-semibold">1. Elegís tu zona</p>
                      <p className="mt-2 text-sm text-slate-600">
                        Manualmente o con detección automática.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f1e7] p-4">
                      <p className="font-semibold">2. Marcás tu necesidad</p>
                      <p className="mt-2 text-sm text-slate-600">
                        Cuidado 24/7, higiene o ayuda combinada.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f1e7] p-4">
                      <p className="font-semibold">3. Recién al confirmar</p>
                      <p className="mt-2 text-sm text-slate-600">
                        Completás teléfono y dirección para coordinar bien.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#dccfbf] bg-white/90 p-6 shadow-[0_25px_80px_rgba(76,58,33,0.12)] backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c5a23]">
                  {profile?._id
                    ? `Bienvenido${profile?.nombre ? `, ${profile.nombre}` : ""}`
                    : "Encontrá ayuda más rápido"}
                </p>

                <h2 className="mt-3 text-3xl font-semibold">
                  {profile?._id
                    ? "Contanos primero dónde y qué necesitás."
                    : "Empezá por tu zona y tu necesidad."}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {profile?._id
                    ? "No hace falta completar todo ahora. Guardamos tu preferencia y te mostramos opciones cercanas."
                    : "Podés mirar opciones antes de registrarte. Si después querés reservar, ahí seguimos con tus datos."}
                </p>

                <div className="mt-6 rounded-3xl border border-[#efe3d4] bg-[#fbf8f2] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        Tu localidad
                      </label>
                      <p className="mt-1 text-xs text-slate-500">
                        La usamos para recomendarte cuidadores y horarios disponibles cerca.
                      </p>
                    </div>

                    <Button
                      type="default"
                      icon={<EnvironmentOutlined />}
                      loading={isDetectingLocation}
                      onClick={detectLocalidad}
                    >
                      Detectar zona
                    </Button>
                  </div>

                  <select
                    value={selectedLocalidad}
                    onChange={(event) => setSelectedLocalidad(event.target.value)}
                    className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                  >
                    {localidades.map((localidad) => (
                      <option key={localidad} value={localidad}>
                        {localidad}
                      </option>
                    ))}
                  </select>

                  <p className="mt-3 text-xs text-slate-500">
                    {locationHint ||
                      "Si ya elegiste tu localidad antes, te la recordamos automáticamente."}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    ¿Qué necesitás hoy?
                  </p>

                  <div className="grid gap-3">
                    {PREFERENCE_PRESETS.map((preset) => {
                      const selected = preset.id === selectedPreset;

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPreset(preset.id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-[#9a6c22] bg-[#fff3dd] shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{preset.title}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                {preset.description}
                              </p>
                            </div>
                            {selected && <CheckCircleOutlined className="text-[#9a6c22]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSeeRecommendations}
                    className="rounded-full bg-[#7c5a23] px-5 py-3 text-sm font-semibold text-white hover:bg-[#624514]"
                  >
                    Encontrar cuidadores compatibles
                  </button>
                  {!profile?._id && (
                    <Link
                      to="/registro"
                      className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
                    >
                      Crear cuenta despues
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c5a23]">
                Recomendado para vos
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Tipos de cuidado sugeridos en {selectedLocalidad || "tu zona"}
              </h2>
            </div>
            <Link to="/servicios" className="text-sm font-semibold text-[#7c5a23]">
              Explorar mapa completo
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              Cargando recomendaciones...
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              No pudimos cargar coincidencias: {error}
            </div>
          ) : recommendedServices.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
              No encontramos un match exacto con esa preferencia. Podés probar otra necesidad
              o explorar los tipos de cuidado activos de tu zona.
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recommendedServices.map((service) => (
                <button
                  key={`${service.specialty}-${service.localidad}`}
                  type="button"
                  onClick={() => handleViewService(service.specialty, service.localidad)}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5a23]">
                    Tipo recomendado
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{service.specialty}</h3>
                  <p className="mt-2 text-sm text-slate-600">Zona: {service.localidad}</p>
                  <p className="mt-4 text-sm text-slate-600">
                    {service.professionalsCount} cuidador(es) y {service.slots} horarios detectados.
                  </p>
                  <span className="mt-6 inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                    Ver cuidadores y horarios
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 md:px-8">
          <div className="rounded-[2rem] border border-[#dccfbf] bg-white p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c5a23]">
                  También disponible en tu localidad
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Explorá más opciones cerca tuyo</h2>
              </div>
              <p className="max-w-xl text-sm text-slate-600">
                Si todavía no sabés exactamente qué tipo de ayuda necesitás, podés arrancar
                por los tipos de cuidado más activos de tu zona.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {localServices.map((service) => (
                <button
                  key={`local-${service.specialty}-${service.localidad}`}
                  type="button"
                  onClick={() => handleViewService(service.specialty, service.localidad)}
                  className="rounded-[1.5rem] border border-slate-200 bg-[#fcfaf7] p-5 text-left transition hover:border-[#caaa72]"
                >
                  <p className="text-lg font-semibold">{service.specialty}</p>
                  <p className="mt-2 text-sm text-slate-600">{service.localidad}</p>
                  <p className="mt-4 text-sm text-slate-500">
                    {service.professionalsCount} profesionales disponibles
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
