import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CareFlowFrame from "../../components/care/CareFlowFrame";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import clienteAxios from "../../config/axios";
import { getAuthToken } from "../../helpers/auth/getSessionData";
import {
  buildCareMatches,
  getNeedOptionById,
  getStoredCareContractDraft,
  getStoredCareRequest,
  getStoredCareSelection,
  saveCareContractDraft,
} from "../../helpers/careFlow";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a6782b] focus:ring-2 focus:ring-[#f0debd]";

const splitFullName = (value = "") => {
  const [firstName = "", ...rest] = String(value).trim().split(" ");
  return {
    firstName,
    lastName: rest.join(" "),
  };
};

const CareCheckout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { disponibilidades } = useDisponibilidades();
  const request = getStoredCareRequest();
  const selection = getStoredCareSelection();
  const storedDraft = getStoredCareContractDraft();

  const profileName = useMemo(() => {
    const localProfile = user || JSON.parse(localStorage.getItem("profile") || "null");
    return localProfile?.nombre || "";
  }, [user]);

  const initialNames = splitFullName(profileName);
  const [form, setForm] = useState(() => ({
    firstName: storedDraft?.firstName || initialNames.firstName,
    lastName: storedDraft?.lastName || initialNames.lastName,
    email: storedDraft?.email || user?.email || "",
    phone: storedDraft?.phone || "",
    address: storedDraft?.address || "",
    locality: storedDraft?.locality || request.localidad || "",
    notes: storedDraft?.notes || request.notes || "",
    accepted: Boolean(storedDraft?.accepted),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const caregiver = useMemo(() => {
    if (!selection?.profileId) return null;
    const matches = buildCareMatches(disponibilidades, request);
    return matches.find((match) => match.id === selection.profileId) || null;
  }, [disponibilidades, request, selection?.profileId]);

  const handleChange = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const draft = {
      ...form,
      request,
      selection,
      updatedAt: new Date().toISOString(),
    };

    saveCareContractDraft(draft);

    const token = getAuthToken();
    if (!token) {
      setSubmitError("Necesitas iniciar sesion para crear la orden real y abrir el hub del caso.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await clienteAxios.post(
        "/api/pay/care-contract",
        {
          request,
          selection,
          customerData: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            locality: form.locality,
            notes: form.notes,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      saveCareContractDraft({
        ...draft,
        orderId: data.orderId,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      navigate(`/resumen/${data.orderId}`);
    } catch (error) {
      console.error("Error creando orden de cuidado:", error);
      setSubmitError(
        error.response?.data?.msg || "No pudimos crear la orden de cuidado. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedNeed = getNeedOptionById(request.needType);

  const sidebar = (
    <>
      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Resumen de contratacion
        </p>
        <div className="mt-5 space-y-4 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">Necesidad</p>
            <p>{selectedNeed?.label || "Cuidado general"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Cuidador seleccionado</p>
            <p>{caregiver?.nombreCompleto || selection?.nombreCompleto || "Pendiente"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Horario tentativo</p>
            <p>
              {selection?.selectedSlot
                ? `${selection.selectedSlot.fecha} a las ${selection.selectedSlot.hora}`
                : "Pendiente"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Estado de este paso
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Esta pantalla deja lista la confirmacion de cuidado: datos de contacto, direccion
          y resumen de la eleccion. El siguiente tramo natural es integrar pago y caso activo
          sobre esta base.
        </p>
      </div>
    </>
  );

  return (
    <CareFlowFrame
      currentStep="contract"
      title="Confirma el cuidado que quieres coordinar"
      description="En este punto ya tienes necesidad, perfil y horario. Ahora dejamos claro quien coordina, donde sera el servicio y como seguir con la confirmacion."
      backHref={selection?.profileId ? `/cuidado/cuidador/${selection.profileId}` : "/cuidado/matches"}
      backLabel="Volver a la ficha"
      aside={sidebar}
    >
      {!selection?.profileId ? (
        <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-8">
          <p className="text-lg font-semibold text-slate-900">
            Todavia no seleccionaste un cuidador ni un horario.
          </p>
          <Link
            to="/cuidado/matches"
            className="mt-5 inline-flex rounded-full bg-[#7c5a23] px-5 py-3 text-sm font-semibold text-white hover:bg-[#604318]"
          >
            Ir al matching
          </Link>
        </div>
      ) : submitted ? (
        <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-8">
          <div className="rounded-[1.5rem] border border-green-200 bg-green-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
              Solicitud lista para coordinar
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Guardamos tu confirmacion preliminar
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Ya quedo armado el borrador con el perfil elegido, el horario tentativo y los
              datos principales del servicio. Esto deja lista la capa de contratacion para
              conectarla al pago y a la activacion del caso.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[#fcfaf7] p-5">
              <p className="text-sm font-semibold text-slate-900">Cuidador elegido</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {caregiver?.nombreCompleto || selection.nombreCompleto}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {selection.selectedSlot?.fecha} a las {selection.selectedSlot?.hora}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-[#fcfaf7] p-5">
              <p className="text-sm font-semibold text-slate-900">Datos de contacto</p>
              <p className="mt-2 text-sm text-slate-600">
                {form.firstName} {form.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-600">{form.email}</p>
              <p className="mt-1 text-sm text-slate-600">{form.phone}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/cuidado/matches")}
              className="rounded-full bg-[#7c5a23] px-6 py-3 text-sm font-semibold text-white hover:bg-[#604318]"
            >
              Volver al matching
            </button>
            <Link
              to="/"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6 md:p-8"
        >
          {submitError ? (
            <div className="mb-6 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-800">Nombre</label>
              <input
                value={form.firstName}
                onChange={(event) => handleChange("firstName", event.target.value)}
                className={inputClassName}
                placeholder="Nombre de quien coordina"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">Apellido</label>
              <input
                value={form.lastName}
                onChange={(event) => handleChange("lastName", event.target.value)}
                className={inputClassName}
                placeholder="Apellido"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-800">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className={inputClassName}
                placeholder="mail@ejemplo.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">Telefono</label>
              <input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                className={inputClassName}
                placeholder="Telefono de contacto"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-800">Direccion del servicio</label>
              <input
                value={form.address}
                onChange={(event) => handleChange("address", event.target.value)}
                className={inputClassName}
                placeholder="Direccion, piso, referencia..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">Localidad</label>
              <input
                value={form.locality}
                onChange={(event) => handleChange("locality", event.target.value)}
                className={inputClassName}
                placeholder="Localidad donde sera el servicio"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-slate-800">Indicaciones utiles para coordinar</label>
            <textarea
              value={form.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              className={`${inputClassName} min-h-[120px] resize-none`}
              placeholder="Accesos, movilidad, referencias de horario, notas para la coordinacion..."
            />
          </div>

          <label className="mt-6 flex items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-[#fcfaf7] p-4 text-sm leading-6 text-slate-600">
            <input
              type="checkbox"
              checked={form.accepted}
              onChange={(event) => handleChange("accepted", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              Confirmo que estos datos describen correctamente la necesidad y el lugar donde
              se coordinaria el cuidado.
            </span>
          </label>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !form.firstName ||
                !form.email ||
                !form.phone ||
                !form.address ||
                !form.accepted
              }
              className="rounded-full bg-[#7c5a23] px-6 py-3 text-sm font-semibold text-white hover:bg-[#604318] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? "Creando orden..." : "Crear orden y abrir hub"}
            </button>
            <Link
              to="/cuidado/matches"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Seguir comparando
            </Link>
          </div>
        </form>
      )}
    </CareFlowFrame>
  );
};

export default CareCheckout;
