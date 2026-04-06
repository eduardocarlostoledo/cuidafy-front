import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CareFlowFrame from "../../components/care/CareFlowFrame";
import { localidadesLaborales } from "../../data";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import {
  CARE_CONTACT_WINDOW_OPTIONS,
  CARE_EXPERIENCE_OPTIONS,
  CARE_FAMILY_SUPPORT_OPTIONS,
  CARE_FREQUENCY_OPTIONS,
  CARE_GENDER_PREFERENCE_OPTIONS,
  CARE_LIVING_OPTIONS,
  CARE_MODALITY_OPTIONS,
  CARE_NEED_OPTIONS,
  CARE_PATIENT_AGE_OPTIONS,
  CARE_PAYMENT_OPTIONS,
  CARE_RELATION_OPTIONS,
  CARE_REQUEST_STORAGE_KEY,
  CARE_SHIFT_OPTIONS,
  CARE_START_WINDOW_OPTIONS,
  CARE_AUTONOMY_OPTIONS,
  CARE_URGENCY_OPTIONS,
  buildCareRequestFromSearch,
  getCareSegmentation,
  getNeedOptionById,
  getOptionLabel,
  getStoredCareRequest,
  mergeCareRequest,
  saveCareRequest,
} from "../../helpers/careFlow";

const fieldClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a6782b] focus:ring-2 focus:ring-[#f0debd]";

const cardClassName = "rounded-[1.75rem] border border-[#dccfbf] bg-white p-6";

const CareIntake = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { disponibilidades, loading } = useDisponibilidades();
  const storedRequest = getStoredCareRequest();

  const [mode, setMode] = useState(storedRequest.intakeMode || "short");
  const [form, setForm] = useState(() =>
    mergeCareRequest(storedRequest, buildCareRequestFromSearch(searchParams))
  );
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const localidades = useMemo(() => {
    const availabilityLocalities = (disponibilidades || []).flatMap(
      (item) => item?.creador?.localidadesLaborales || []
    );

    return Array.from(new Set([...availabilityLocalities, ...localidadesLaborales])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [disponibilidades]);

  useEffect(() => {
    if (!form.localidad && localidades.length > 0) {
      setForm((current) => ({ ...current, localidad: localidades[0] }));
    }
  }, [form.localidad, localidades]);

  useEffect(() => {
    saveCareRequest({
      ...form,
      intakeMode: mode,
      completionStatus: mode === "long" ? "long_draft" : "short_draft",
    });
  }, [form, mode]);

  const selectedNeed = getNeedOptionById(form.needType);
  const segmentation = useMemo(() => getCareSegmentation(form), [form]);
  const whatsappHref = `https://web.whatsapp.com/send/?phone=543764331313&text=${encodeURIComponent(
    "Hola, necesito ayuda para definir una solicitud de cuidado."
  )}&type=phone_number&app_absent=0`;

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setForm((current) => ({ ...current, intakeMode: nextMode }));
  };

  const isShortValid = Boolean(
    form.relation &&
      form.needType &&
      form.localidad &&
      form.urgency &&
      form.frequency &&
      form.shift &&
      form.modality &&
      form.startWindow
  );

  const isLongValid = Boolean(
    isShortValid &&
      form.patientAgeRange &&
      form.autonomyLevel &&
      form.livingSituation &&
      form.familySupport &&
      form.paymentPreference &&
      form.contactName &&
      form.contactPhone &&
      form.contactEmail
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const request = saveCareRequest({
      ...form,
      intakeMode: mode,
      completionStatus: mode === "long" ? "long_complete" : "short_complete",
    });
    navigate("/cuidado/matches", { state: { request } });
  };

  const handleReset = () => {
    localStorage.removeItem(CARE_REQUEST_STORAGE_KEY);
    setMode("short");
    setForm(mergeCareRequest(buildCareRequestFromSearch(searchParams)));
    setResetDone(true);
  };

  const sidebar = (
    <>
      <div className={cardClassName}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Estado del intake
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f7efe2] px-3 py-2 text-xs font-semibold text-[#6b4b18]">
            {mode === "short" ? "Version corta" : "Solicitud completa"}
          </span>
          <span className="rounded-full bg-[#f7efe2] px-3 py-2 text-xs font-semibold text-[#6b4b18]">
            {segmentation.urgency === "urgente"
              ? "Urgencia alta"
              : segmentation.urgency === "exploracion"
              ? "Exploracion"
              : "Proximos dias"}
          </span>
          <span className="rounded-full bg-[#f7efe2] px-3 py-2 text-xs font-semibold text-[#6b4b18]">
            Intensidad {segmentation.intensity}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {segmentation.shouldPromptCoordination
            ? "Este caso conviene mostrarlo con coordinacion humana visible ademas del matching."
            : "Podemos abrir un matching inicial sin pedir demasiados datos de entrada."}
        </p>
      </div>

      <div className={cardClassName}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Resumen en vivo
        </p>
        <div className="mt-5 space-y-4 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">Quien coordina</p>
            <p>{getOptionLabel(CARE_RELATION_OPTIONS, form.relation) || "Pendiente"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Necesidad principal</p>
            <p>{selectedNeed?.label || "Pendiente"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Zona y modalidad</p>
            <p>
              {form.localidad || "Pendiente"} · {getOptionLabel(CARE_MODALITY_OPTIONS, form.modality)}
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Como sigue</p>
            <p>Recomendaciones iniciales, posibilidad de editar y CTA a coordinacion.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Draft unico
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Ya no repartimos contexto entre multiples claves sueltas. Este borrador vive como
          una sola solicitud de cuidado y se guarda automaticamente.
        </p>
        {storedRequest?.draftUpdatedAt ? (
          <p className="mt-3 text-xs text-slate-500">
            Ultima actualizacion:{" "}
            {new Date(form.draftUpdatedAt || storedRequest.draftUpdatedAt).toLocaleString()}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Reiniciar borrador
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#c9a468] px-4 py-2 text-sm font-semibold text-[#6b4b18] hover:bg-white"
          >
            Hablar con coordinacion
          </a>
        </div>
        {resetDone ? <p className="mt-3 text-xs text-green-700">Borrador reiniciado.</p> : null}
      </div>
    </>
  );

  return (
    <CareFlowFrame
      currentStep="intake"
      title="Contanos que tipo de cuidado necesitas"
      description="El intake ya funciona como solicitud estructurada: primero entendemos necesidad, contexto y urgencia; despues abrimos matching con mucho menos ruido."
      backHref="/"
      backLabel="Volver al inicio"
      aside={sidebar}
    >
      <form onSubmit={handleSubmit} className={`${cardClassName} md:p-8`}>
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleModeChange("short")}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              mode === "short"
                ? "bg-[#7c5a23] text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Version corta
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("long")}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              mode === "long"
                ? "bg-[#7c5a23] text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Solicitud completa
          </button>
        </div>

        <div className="rounded-[1.5rem] border border-[#e6d7bf] bg-[#fcfaf7] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
            {mode === "short" ? "Intake corto" : "Version larga"}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {mode === "short"
              ? "Pensado para calificar necesidad, guardar intencion y abrir un matching inicial en pocos minutos."
              : "Pensado para mejorar recomendaciones, dejar contexto operativo listo y preparar mejor la contratacion."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-800">Quien coordina</label>
            <select
              value={form.relation}
              onChange={(event) => handleChange("relation", event.target.value)}
              className={fieldClassName}
            >
              {CARE_RELATION_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Localidad del servicio</label>
            <select
              value={form.localidad}
              onChange={(event) => handleChange("localidad", event.target.value)}
              className={fieldClassName}
            >
              <option value="">Selecciona una localidad</option>
              {localidades.map((localidad) => (
                <option key={localidad} value={localidad}>
                  {localidad}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-800">Necesidad principal</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {CARE_NEED_OPTIONS.map((option) => {
              const selected = option.id === form.needType;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleChange("needType", option.id)}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${
                    selected
                      ? "border-[#a6782b] bg-[#fff4df] shadow-sm"
                      : "border-slate-200 bg-[#fcfaf7] hover:border-[#d8c3a0]"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="text-sm font-semibold text-slate-800">Urgencia</label>
            <select
              value={form.urgency}
              onChange={(event) => handleChange("urgency", event.target.value)}
              className={fieldClassName}
            >
              {CARE_URGENCY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Frecuencia</label>
            <select
              value={form.frequency}
              onChange={(event) => handleChange("frequency", event.target.value)}
              className={fieldClassName}
            >
              {CARE_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Franja preferida</label>
            <select
              value={form.shift}
              onChange={(event) => handleChange("shift", event.target.value)}
              className={fieldClassName}
            >
              {CARE_SHIFT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Modalidad</label>
            <select
              value={form.modality}
              onChange={(event) => handleChange("modality", event.target.value)}
              className={fieldClassName}
            >
              {CARE_MODALITY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-800">Ventana de inicio</label>
            <select
              value={form.startWindow}
              onChange={(event) => handleChange("startWindow", event.target.value)}
              className={fieldClassName}
            >
              {CARE_START_WINDOW_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">
              Especialidad a priorizar
            </label>
            <input
              value={form.preferredSpecialty}
              onChange={(event) => handleChange("preferredSpecialty", event.target.value)}
              className={fieldClassName}
              placeholder="Ej: adultos mayores, post operatorio, ACV..."
            />
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-semibold text-slate-800">Notas para orientar el matching</label>
          <textarea
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            className={`${fieldClassName} min-h-[112px] resize-none`}
            placeholder="Ej: movilidad reducida, preferencia por acompanamiento femenino, horarios de visita..."
          />
        </div>

        {mode === "long" ? (
          <>
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-semibold text-slate-900">Contexto ampliado</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-800">Rango etario</label>
                  <select
                    value={form.patientAgeRange}
                    onChange={(event) => handleChange("patientAgeRange", event.target.value)}
                    className={fieldClassName}
                  >
                    <option value="">Selecciona una opcion</option>
                    {CARE_PATIENT_AGE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Autonomia general</label>
                  <select
                    value={form.autonomyLevel}
                    onChange={(event) => handleChange("autonomyLevel", event.target.value)}
                    className={fieldClassName}
                  >
                    <option value="">Selecciona una opcion</option>
                    {CARE_AUTONOMY_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Situacion de vivienda</label>
                  <select
                    value={form.livingSituation}
                    onChange={(event) => handleChange("livingSituation", event.target.value)}
                    className={fieldClassName}
                  >
                    <option value="">Selecciona una opcion</option>
                    {CARE_LIVING_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Red familiar o de apoyo</label>
                  <select
                    value={form.familySupport}
                    onChange={(event) => handleChange("familySupport", event.target.value)}
                    className={fieldClassName}
                  >
                    <option value="">Selecciona una opcion</option>
                    {CARE_FAMILY_SUPPORT_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Experiencia requerida</label>
                  <select
                    value={form.caregiverExperience}
                    onChange={(event) => handleChange("caregiverExperience", event.target.value)}
                    className={fieldClassName}
                  >
                    {CARE_EXPERIENCE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Preferencia de genero</label>
                  <select
                    value={form.caregiverGenderPreference}
                    onChange={(event) =>
                      handleChange("caregiverGenderPreference", event.target.value)
                    }
                    className={fieldClassName}
                  >
                    {CARE_GENDER_PREFERENCE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Forma de pago prevista</label>
                  <select
                    value={form.paymentPreference}
                    onChange={(event) => handleChange("paymentPreference", event.target.value)}
                    className={fieldClassName}
                  >
                    {CARE_PAYMENT_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Mejor horario para contacto</label>
                  <select
                    value={form.contactWindow}
                    onChange={(event) => handleChange("contactWindow", event.target.value)}
                    className={fieldClassName}
                  >
                    {CARE_CONTACT_WINDOW_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-800">Nombre de contacto</label>
                  <input
                    value={form.contactName}
                    onChange={(event) => handleChange("contactName", event.target.value)}
                    className={fieldClassName}
                    placeholder="Nombre y apellido"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">Telefono</label>
                  <input
                    value={form.contactPhone}
                    onChange={(event) => handleChange("contactPhone", event.target.value)}
                    className={fieldClassName}
                    placeholder="Telefono de contacto"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-slate-800">Email</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(event) => handleChange("contactEmail", event.target.value)}
                  className={fieldClassName}
                  placeholder="mail@ejemplo.com"
                />
              </div>
            </div>
          </>
        ) : null}

        {segmentation.shouldSuggestLongIntake && mode === "short" ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#e9d5b1] bg-[#fff8ed] p-5">
            <p className="font-semibold text-slate-900">
              Este caso podria beneficiarse con la solicitud completa
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Vemos senales de urgencia, intensidad o contexto que justifican sumar mas detalle
              antes del matching final.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={mode === "long" ? !isLongValid : !isShortValid}
            className="rounded-full bg-[#7c5a23] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#604318] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading
              ? "Preparando recomendaciones..."
              : mode === "long"
              ? "Ver matching mejorado"
              : "Ver resultado preliminar"}
          </button>

          {mode === "short" ? (
            <button
              type="button"
              onClick={() => handleModeChange("long")}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Completar solicitud
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => saveCareRequest(form)}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Guardar borrador
          </button>
        </div>
      </form>
    </CareFlowFrame>
  );
};

export default CareIntake;
