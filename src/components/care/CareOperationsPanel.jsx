import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import clienteAxios from "../../config/axios";
import Spinner from "../Spinner";

const serviceStatusOptions = ["Pendiente", "Confirmado", "Completado", "Cancelado"];
const paymentStatusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado" },
  { value: "pendiente", label: "Pendiente legacy" },
  { value: "pagada", label: "Pagada legacy" },
  { value: "cancelada", label: "Cancelada legacy" },
];
const hourOptions = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a6782b] focus:ring-2 focus:ring-[#f0debd]";

const CareOperationsPanel = ({ role, caseItem, onSaved }) => {
  const [form, setForm] = useState({
    estado: "Pendiente",
    estadoPago: "pending",
    payment_id: "",
    fechaRealizacion: "",
    horaRealizacion: "",
  });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({
      estado: caseItem?.estado_servicio || "Pendiente",
      estadoPago: caseItem?.factura?.estadoPago || "pending",
      payment_id: caseItem?.factura?.payment_id || "",
      fechaRealizacion: caseItem?.cita_servicio || "",
      horaRealizacion: caseItem?.hora_servicio || "",
    });
    setImage(caseItem?.registroFirmaCliente || "");
  }, [caseItem]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("upload_preset", file.name);
      formData.append("file", file, "form-data");

      const { data } = await clienteAxios.post("/api/uploads/file-firmas", formData);
      setImage(data.imageURL);
      toast.success(data.msg || "Firma cargada");
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "No pudimos subir la firma";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (role === "admin") {
        const { data } = await clienteAxios.put(
          `/api/ordenes/updateordendashboard/${caseItem._id}`,
          {
            estado: form.estado,
            estadoPago: form.estadoPago,
            payment_id: form.payment_id,
          }
        );

        toast.success(data.msg || "Caso actualizado");
      } else {
        const { data } = await clienteAxios.post("/api/ordenes/updateorderbyprofesional/", {
          id: caseItem._id,
          estado: form.estado,
          registroFirmaCliente: image,
          fechaRealizacion: form.fechaRealizacion,
          horaRealizacion: form.horaRealizacion,
          estadoPago: form.estadoPago,
          payment_id: form.payment_id,
        });

        toast.success(data.msg || "Caso actualizado");
      }

      onSaved?.();
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "No pudimos actualizar el caso";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-[#dccfbf] bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5a21]">
        Operacion del caso
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Estos campos mantienen el trabajo operativo que ya hacia profesional y coordinacion desde la vista de resumen.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-800">Estado del servicio</label>
          <select
            value={form.estado}
            onChange={(event) => handleChange("estado", event.target.value)}
            className={inputClassName}
          >
            {serviceStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-800">Estado de pago</label>
          <select
            value={form.estadoPago}
            onChange={(event) => handleChange("estadoPago", event.target.value)}
            className={inputClassName}
          >
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-800">ID de pago</label>
          <input
            type="text"
            value={form.payment_id}
            onChange={(event) => handleChange("payment_id", event.target.value)}
            className={inputClassName}
            placeholder="Transaccion, transferencia o referencia"
          />
        </div>

        {role === "profesional" ? (
          <>
            <div>
              <label className="text-sm font-semibold text-slate-800">Fecha de realizacion</label>
              <input
                type="date"
                value={form.fechaRealizacion}
                onChange={(event) => handleChange("fechaRealizacion", event.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">Hora de realizacion</label>
              <select
                value={form.horaRealizacion}
                onChange={(event) => handleChange("horaRealizacion", event.target.value)}
                className={inputClassName}
              >
                <option value="">Selecciona una franja</option>
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">Firma o comprobante</label>
              {uploading ? (
                <div className="mt-3 flex justify-center rounded-2xl border border-slate-200 bg-[#fcfaf7] p-4">
                  <Spinner />
                </div>
              ) : (
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#fcfaf7] px-4 py-6 text-center text-sm text-slate-600 hover:border-[#c9a468] hover:bg-[#fff8ed]">
                  {image ? "Reemplazar archivo cargado" : "Subir firma o comprobante"}
                  <input type="file" className="hidden" onChange={handleUpload} />
                </label>
              )}

              {image ? (
                <a
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-[#7c5a23] underline-offset-4 hover:underline"
                >
                  Ver archivo actual
                </a>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="mt-6 inline-flex rounded-full bg-[#7c5a23] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5f4219] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
};

export default CareOperationsPanel;
