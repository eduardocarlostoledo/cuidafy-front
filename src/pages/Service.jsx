import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Divider, Space, Spin } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import clienteAxios from "../config/axios";
import { useDisponibilidades } from "../hooks/useDisponibilidades";
import {
  buildCareRequestFromDisponibilidad,
  buildCareSelectionFromDisponibilidad,
  getNeedOptionById,
  saveCareRequest,
  saveCareSelection,
} from "../helpers/careFlow";

const Service = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, loading: loadingDisponibilidades } = useDisponibilidades();
  const [profile, setProfile] = useState([]);
  const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] = useState(null);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [onboardingStatus, setOnboardingStatus] = useState({
    telefonoCompleto: true,
    direccionCompleta: true,
  });

  const disponibilidadId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id");
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      const profileData = localStorage.getItem("profile");
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  }, []);

  useEffect(() => {
    if (!disponibilidadId) {
      setErrorMessage("No se especificó una disponibilidad válida.");
      setLoadingDisponibilidad(false);
      return;
    }

    if (loadingDisponibilidades) {
      setLoadingDisponibilidad(true);
      return;
    }

    const disponibilidad = (disponibilidades || []).find((item) => item._id === disponibilidadId);

    if (!disponibilidad) {
      setErrorMessage("No encontramos la disponibilidad que intentabas abrir.");
      setLoadingDisponibilidad(false);
      return;
    }

    setDisponibilidadSeleccionada(disponibilidad);
    setSelectedSlotId(
      (disponibilidad.horarios || disponibilidad.disponibilidad || []).find((slot) => slot.stock !== false)
        ?._id || ""
    );
    setErrorMessage("");
    setLoadingDisponibilidad(false);
  }, [disponibilidadId, disponibilidades, loadingDisponibilidades]);

  useEffect(() => {
    if (!profile?._id) return;

    const loadOnboardingStatus = async () => {
      try {
        const [profileResponse, addressesResponse] = await Promise.all([
          clienteAxios.get(`api/usuarios/perfil/${profile._id}`),
          clienteAxios.get("api/usuarios/direcciones"),
        ]);

        setOnboardingStatus({
          telefonoCompleto: Boolean(profileResponse.data?.telefono),
          direccionCompleta: Array.isArray(addressesResponse.data)
            ? addressesResponse.data.length > 0
            : false,
        });
      } catch (error) {
        console.error("Error al validar onboarding del usuario:", error);
      }
    };

    loadOnboardingStatus();
  }, [profile?._id]);

  const availableSlots = useMemo(
    () =>
      (disponibilidadSeleccionada?.horarios ||
        disponibilidadSeleccionada?.disponibilidad ||
        []
      ).filter((slot) => slot.stock !== false),
    [disponibilidadSeleccionada]
  );

  const selectedSlot = useMemo(
    () => availableSlots.find((slot) => slot._id === selectedSlotId) || availableSlots[0] || null,
    [availableSlots, selectedSlotId]
  );

  const careRequest = useMemo(
    () => buildCareRequestFromDisponibilidad(disponibilidadSeleccionada),
    [disponibilidadSeleccionada]
  );

  const selectedNeedLabel =
    getNeedOptionById(careRequest.needType)?.label ||
    disponibilidadSeleccionada?.creador?.especialidad?.[0] ||
    "Cuidado general";

  const handleContinueToCheckout = () => {
    if (!disponibilidadSeleccionada || !selectedSlot) return;

    saveCareRequest(careRequest);
    saveCareSelection(buildCareSelectionFromDisponibilidad(disponibilidadSeleccionada, selectedSlot));
    navigate("/cuidado/confirmar");
  };

  const handleContinueToMatching = () => {
    saveCareRequest(careRequest);
    const params = new URLSearchParams();

    if (careRequest.localidad) {
      params.set("localidad", careRequest.localidad);
    }

    if (careRequest.preferredSpecialty) {
      params.set("especialidad", careRequest.preferredSpecialty);
    }

    navigate(`/cuidado/matches?${params.toString()}`);
  };

  return (
    <div className="bg-[#f7f1e8]">
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <div className="rounded-[2rem] border border-[#dccfbf] bg-[linear-gradient(140deg,#fff8ed_0%,#f7f1e8_60%,#eadcc8_100%)] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5a23]">
            Compatibilidad de ruta
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            Esta entrada ahora vive dentro del hub de cuidado
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Conservamos el acceso legacy para no perder contexto, pero desde aquí ya te
            llevamos al flujo nuevo: necesidad, cuidador, horario y coordinación.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 md:px-8">
        {loadingDisponibilidad ? (
          <div className="rounded-[2rem] border border-[#dccfbf] bg-white p-12 text-center">
            <Spin size="large" tip="Preparando la disponibilidad dentro del flujo nuevo..." />
          </div>
        ) : errorMessage ? (
          <div className="rounded-[2rem] border border-[#dccfbf] bg-white p-8">
            <Alert
              message="No pudimos recuperar esta entrada"
              description={errorMessage}
              type="error"
              showIcon
              action={
                <Button size="small" danger onClick={() => navigate("/encontrar-cuidado")}>
                  Ir al inicio del flujo
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.45fr,0.85fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-[#dccfbf] bg-white p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5a23]">
                      Ficha puente
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                      {disponibilidadSeleccionada?.creador?.creador?.nombre}{" "}
                      {disponibilidadSeleccionada?.creador?.creador?.apellido}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {disponibilidadSeleccionada?.creador?.descripcion ||
                        "Tomamos esta disponibilidad histórica y la traducimos a una ficha coherente con el nuevo recorrido."}
                    </p>
                  </div>

                  <div className="rounded-full bg-[#f7efe2] px-4 py-2 text-sm font-semibold text-[#6b4b18]">
                    {selectedNeedLabel}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-[#fcfaf7] p-5">
                    <p className="text-sm font-semibold text-slate-900">Zona principal</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {disponibilidadSeleccionada?.creador?.localidadesLaborales?.join(" · ") ||
                        "Sin localidad visible"}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-[#fcfaf7] p-5">
                    <p className="text-sm font-semibold text-slate-900">Fecha disponible</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {disponibilidadSeleccionada?.fecha || "Sin fecha visible"}
                    </p>
                  </div>
                </div>

                <Divider orientation="left">
                  <span className="text-base font-semibold">Horarios visibles para continuar</span>
                </Divider>

                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {availableSlots.map((slot) => {
                    const selected = slot._id === selectedSlotId;

                    return (
                      <button
                        key={slot._id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot._id)}
                        className={`flex w-full items-center justify-between rounded-[1.25rem] border px-5 py-4 text-left transition ${
                          selected
                            ? "border-[#a6782b] bg-[#fff4df]"
                            : "border-slate-200 bg-[#fcfaf7] hover:border-[#d8c3a0]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ClockCircleOutlined className="text-[#7c5a23]" />
                          <div>
                            <p className="font-semibold text-slate-900">{slot.hora}</p>
                            <p className="text-sm text-slate-600">
                              {disponibilidadSeleccionada?.fecha}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#7c5a23]">
                          {selected ? "Seleccionado" : "Elegir"}
                        </span>
                      </button>
                    );
                  })}
                </Space>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleContinueToCheckout}
                    disabled={!selectedSlot}
                  >
                    Continuar al hub de contratación
                  </Button>
                  <Button size="large" onClick={handleContinueToMatching}>
                    Ver matching completo
                  </Button>
                  <Link
                    to="/encontrar-cuidado"
                    className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Reiniciar solicitud
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-[#dccfbf] bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5a23]">
                  Solicitud sugerida
                </p>
                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-900">Necesidad principal</p>
                    <p>{selectedNeedLabel}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Localidad</p>
                    <p>{careRequest.localidad || "A confirmar"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Próximo paso</p>
                    <p>Elegir si quieres seguir con este perfil o volver al matching del hub.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5a23]">
                  Qué cambia
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>Ya no trabajamos con carrito ni checkout como punto de entrada.</li>
                  <li>La disponibilidad se interpreta como parte de una solicitud de cuidado.</li>
                  <li>La coordinación posterior sigue en el hub del caso, no en una pantalla aislada.</li>
                </ul>
              </div>

              {profile?._id &&
                (!onboardingStatus.telefonoCompleto || !onboardingStatus.direccionCompleta) && (
                  <Card className="rounded-[2rem] border-[#f0d8a7] bg-[#fff8ed]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                      Preparar coordinación
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">
                      Puedes seguir ahora y completar estos datos después
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      El flujo nuevo prioriza mostrar opciones antes de pedir toda la
                      información. Igual te dejamos visibles los datos que conviene completar.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {!onboardingStatus.telefonoCompleto && (
                        <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-700">
                          Falta teléfono
                        </span>
                      )}
                      {!onboardingStatus.direccionCompleta && (
                        <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-700">
                          Falta dirección
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {!onboardingStatus.telefonoCompleto && (
                        <Button type="primary" onClick={() => navigate("/ajustes")}>
                          Completar teléfono
                        </Button>
                      )}
                      {!onboardingStatus.direccionCompleta && (
                        <Button onClick={() => navigate("/direcciones")}>
                          Agregar dirección
                        </Button>
                      )}
                    </div>
                  </Card>
                )}

              <Card className="rounded-[2rem] border-slate-200">
                <div className="flex items-start gap-3">
                  <UserOutlined className="mt-1 text-[#7c5a23]" />
                  <div>
                    <p className="font-semibold text-slate-900">Acceso histórico conservado</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Esta URL vieja sigue funcionando para no romper enlaces previos, pero ya
                      no marca el camino del producto. El recorrido recomendado empieza en el
                      intake de cuidado.
                    </p>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
};

export default Service;
