import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import CareFlowFrame from "../../components/care/CareFlowFrame";
import { useDisponibilidades } from "../../hooks/useDisponibilidades";
import clienteAxios from "../../config/axios";
import { getAuthToken, getStoredProfile } from "../../helpers/auth/getSessionData";
import { googleSignIn } from "../../redux/features/authSlice";
import {
  buildCareMatches,
  getNeedOptionById,
  getStoredCareContractDraft,
  getStoredCareRequest,
  getStoredCareSelection,
  saveCareContractDraft,
} from "../../helpers/careFlow";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base outline-none transition focus:border-[#a6782b] focus:ring-2 focus:ring-[#f0debd]";

const resolveCheckoutUrl = (payload) =>
  payload?.checkoutUrl ||
  payload?.link_pago ||
  payload?.init_point ||
  payload?.sandbox_init_point ||
  payload?.factura?.link_pago ||
  payload?.orden?.factura?.link_pago ||
  payload?.preference?.init_point ||
  payload?.preference?.sandbox_init_point ||
  payload?.preference?.response?.init_point ||
  payload?.preference?.response?.sandbox_init_point ||
  payload?.preference?.body?.init_point ||
  payload?.preference?.body?.sandbox_init_point ||
  "";

const splitFullName = (value = "") => {
  const [firstName = "", ...rest] = String(value).trim().split(" ");
  return {
    firstName,
    lastName: rest.join(" "),
  };
};

const PAYMENT_STATUS_COPY = {
  pending: {
    className: "border-amber-200 bg-amber-50 text-amber-800",
    title: "El pago quedó pendiente",
    description:
      "Todavía no abrimos el hub. Cuando el pago a la plataforma quede aprobado, podrás entrar al caso.",
  },
  rejected: {
    className: "border-red-200 bg-red-50 text-red-700",
    title: "No pudimos aprobar el pago",
    description:
      "La orden no quedó habilitada. Revisa tus datos y vuelve a intentar el pago para entrar al hub.",
  },
};

const CareCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { disponibilidades } = useDisponibilidades();
  const request = getStoredCareRequest();
  const selection = getStoredCareSelection();
  const storedDraft = getStoredCareContractDraft();
  const token = getAuthToken();
  const storedProfile = getStoredProfile();
  const sessionProfile = user || storedProfile || null;
  const isRegisteredCustomer = Boolean(token && sessionProfile?._id);
  const paymentStatus = useMemo(
    () => new URLSearchParams(location.search).get("payment_status") || "",
    [location.search]
  );

  const profileName = sessionProfile?.nombre || "";
  const initialNames = splitFullName(profileName);
  const [form, setForm] = useState(() => ({
    firstName: storedDraft?.firstName || initialNames.firstName,
    lastName: storedDraft?.lastName || initialNames.lastName,
    email: storedDraft?.email || sessionProfile?.email || "",
    phone: storedDraft?.phone || "",
    address: storedDraft?.address || "",
    locality: storedDraft?.locality || request.localidad || "",
    notes: storedDraft?.notes || request.notes || "",
    accepted: Boolean(storedDraft?.accepted),
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isHydratingCustomer, setIsHydratingCustomer] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const hydrateCustomerData = async () => {
      if (!isRegisteredCustomer || !sessionProfile?._id) {
        return;
      }

      try {
        setIsHydratingCustomer(true);
        const [profileResponse, addressesResponse] = await Promise.all([
          clienteAxios.get(`/api/usuarios/perfil/${sessionProfile._id}`),
          clienteAxios.get("/api/usuarios/direcciones"),
        ]);

        const profileData = profileResponse.data || {};
        const defaultAddress =
          profileData?.direccionDefault ||
          (Array.isArray(addressesResponse.data) ? addressesResponse.data[0] : null) ||
          null;

        setForm((currentForm) => ({
          ...currentForm,
          firstName: currentForm.firstName || profileData?.nombre || initialNames.firstName,
          lastName: currentForm.lastName || profileData?.apellido || initialNames.lastName,
          email: currentForm.email || profileData?.email || sessionProfile?.email || "",
          phone: currentForm.phone || profileData?.telefono || "",
          address: currentForm.address || defaultAddress?.direccion || "",
          locality:
            currentForm.locality ||
            defaultAddress?.localidad ||
            request.localidad ||
            "",
          notes: currentForm.notes || defaultAddress?.info || request.notes || "",
        }));
      } catch (error) {
        console.error("Error cargando datos del cliente en checkout:", error);
      } finally {
        setIsHydratingCustomer(false);
      }
    };

    hydrateCustomerData();
  }, [
    initialNames.firstName,
    initialNames.lastName,
    isRegisteredCustomer,
    request.localidad,
    request.notes,
    sessionProfile?._id,
    sessionProfile?.email,
  ]);

  const caregiver = useMemo(() => {
    if (!selection?.profileId) return null;
    const matches = buildCareMatches(disponibilidades, request);
    return matches.find((match) => match.id === selection.profileId) || null;
  }, [disponibilidades, request, selection?.profileId]);

  const careConfirmPath = "/cuidado/confirmar";
  const loginHref = `/login?next=${encodeURIComponent(careConfirmPath)}`;
  const registerHref = `/registro?next=${encodeURIComponent(careConfirmPath)}`;
  const paymentMessage = PAYMENT_STATUS_COPY[paymentStatus] || null;

  const handleGoogleLoginSuccess = (tokenResponse) => {
    const accessToken = tokenResponse.access_token;
    dispatch(
      googleSignIn({
        accessToken,
        navigate,
        toast,
        rute: careConfirmPath,
      })
    );
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      toast.error("No pudimos iniciar sesión con Google. Intenta nuevamente.");
    },
  });

  const handleChange = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };
 
  const createOrderViaCareContract = async () => {
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
          locality: form.locality || request.localidad || "",
          notes: form.notes,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let checkoutUrl = resolveCheckoutUrl(data);
    const orderId = data?.orderId || data?.orden?._id || data?.orden?.id || "";

    if (!checkoutUrl && orderId) {
      try {
        const orderResponse = await clienteAxios.get(`/api/ordenes/getordenbyid/${orderId}`);
        checkoutUrl = resolveCheckoutUrl(orderResponse.data);
      } catch (orderError) {
        console.error("No pudimos recuperar el link de pago desde la orden:", orderError);
      }
    }

    return {
      orderId,
      checkoutUrl,
      amount: data?.amount || 0,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!isRegisteredCustomer) {
      navigate(loginHref);
      return;
    }

    const draft = {
      ...form,
      request,
      selection,
      updatedAt: new Date().toISOString(),
    };

    saveCareContractDraft(draft);
    setIsSubmitting(true);

    try {
      const { orderId, checkoutUrl, amount } = await createOrderViaCareContract();

      if (!orderId || !checkoutUrl) {
        throw new Error("No recibimos un checkout válido para el pago");
      }

      saveCareContractDraft({
        ...draft,
        orderId,
        amount,
        checkoutUrl,
        paymentStartedAt: new Date().toISOString(),
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("Error iniciando pago de cuidado:", error);
      setSubmitError(
        error.response?.data?.msg || "No pudimos iniciar el pago del cuidado. Intenta nuevamente."
      );
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
            <p className="font-semibold text-slate-900">Profesional elegido</p>
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
          <div>
            <p className="font-semibold text-slate-900">Zona</p>
            <p>{form.locality || request.localidad || "A confirmar"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[#dccfbf] bg-[#fff8ed] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
          Regla de acceso
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          El hub solo se abre con cuenta iniciada y pago aprobado. Primero validamos al
          cliente, luego cobramos la plataforma y recién después habilitamos el caso.
        </p>
      </div>
    </>
  );

  return (
    <CareFlowFrame
      currentStep="contract"
      title="Confirma el cuidado que quieres coordinar"
      description="Primero validamos la cuenta del cliente. Despues pedimos los datos y enviamos al pago de la plataforma antes de abrir el hub."
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
      ) : !isRegisteredCustomer ? (
        <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6 md:p-8">
          <div className="rounded-[1.5rem] border border-[#dccfbf] bg-[#fcfaf7] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7d5a21]">
              Profesional seleccionado
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {caregiver?.nombreCompleto || selection?.nombreCompleto || "Profesional"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {selection?.selectedSlot?.fecha || "Fecha a confirmar"} a las{" "}
                  {selection?.selectedSlot?.hora || "hora a confirmar"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Zona del servicio</p>
                <p className="mt-1 text-sm text-slate-600">
                  {form.locality || request.localidad || "A confirmar"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6">
            <p className="text-base font-semibold text-slate-900">
              Antes de crear la orden, necesitas una cuenta
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Ya no permitimos abrir el hub como invitado. Primero debes registrarte o
              iniciar sesión, y después pagar a la plataforma para habilitar el caso.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={loginHref}
                className="rounded-full bg-[#7c5a23] px-6 py-3 text-sm font-semibold text-white hover:bg-[#604318]"
              >
                Iniciar sesión
              </Link>
              <Link
                to={registerHref}
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Crear cuenta
              </Link>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <FcGoogle className="text-lg" />
                <span>Continuar con Google</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6 md:p-8"
        >
          {paymentMessage ? (
            <div
              className={`mb-6 rounded-[1.25rem] border px-4 py-3 text-sm ${paymentMessage.className}`}
            >
              <p className="font-semibold">{paymentMessage.title}</p>
              <p className="mt-1">{paymentMessage.description}</p>
            </div>
          ) : null}

          {submitError ? (
            <div className="mb-6 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="rounded-[1.5rem] border border-[#dccfbf] bg-[#fcfaf7] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7d5a21]">
              Profesional seleccionado
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {caregiver?.nombreCompleto || selection?.nombreCompleto || "Profesional"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {selection?.selectedSlot?.fecha || "Fecha a confirmar"} a las{" "}
                  {selection?.selectedSlot?.hora || "hora a confirmar"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Zona del servicio</p>
                <p className="mt-1 text-sm text-slate-600">
                  {form.locality || request.localidad || "A confirmar"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-[#fffaf3] p-5">
            <p className="text-base font-semibold text-slate-900">
              Datos del cliente o familiar que coordina
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Completamos los datos de tu cuenta y puedes corregirlos antes de pagar a la
              plataforma.
            </p>
            {isHydratingCustomer ? (
              <p className="mt-2 text-sm text-[#7d5a21]">Cargando tus datos guardados...</p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-800">Nombre</label>
              <input
                value={form.firstName}
                onChange={(event) => handleChange("firstName", event.target.value)}
                className={inputClassName}
                placeholder="Nombre del cliente o referente"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">
                Apellido
                <span className="ml-2 text-xs font-medium text-slate-500">(opcional)</span>
              </label>
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
              <label className="text-sm font-semibold text-slate-800">Telefono</label>
              <input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                className={inputClassName}
                placeholder="Telefono de contacto"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">
                Email
                <span className="ml-2 text-xs font-medium text-slate-500">(autocompletado)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className={inputClassName}
                placeholder="mail@ejemplo.com"
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
            <label className="text-sm font-semibold text-slate-800">
              Indicaciones utiles para coordinar
              <span className="ml-2 text-xs font-medium text-slate-500">(opcional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              className={`${inputClassName} min-h-[120px] resize-none`}
              placeholder="Accesos, movilidad, referencias de horario o notas para coordinacion..."
            />
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-[#dccfbf] bg-[#fff8ed] p-4 text-sm text-slate-700">
            Cuando continúas, te enviamos a Mercado Pago para cobrar la plataforma. El hub se
            abre únicamente después de un pago aprobado.
          </div>

          <label className="mt-6 flex items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-[#fcfaf7] p-4 text-sm leading-6 text-slate-600">
            <input
              type="checkbox"
              checked={form.accepted}
              onChange={(event) => handleChange("accepted", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              Confirmo que estos son los datos del cliente o familiar que coordina el servicio,
              que la dirección corresponde al lugar de atención y que entiendo que el hub se
              habilita recién después del pago a la plataforma.
            </span>
          </label>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !form.firstName || !form.phone || !form.address || !form.accepted}
              className="rounded-full bg-[#7c5a23] px-6 py-3 text-sm font-semibold text-white hover:bg-[#604318] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? "Abriendo pago..." : "Pagar a la plataforma y abrir hub"}
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
