import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import clienteAxios from "../../../config/axios";

const SLOT_OPTIONS = [
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

const DAYS = [
  { dayOfWeek: 0, label: "Domingo" },
  { dayOfWeek: 1, label: "Lunes" },
  { dayOfWeek: 2, label: "Martes" },
  { dayOfWeek: 3, label: "Miercoles" },
  { dayOfWeek: 4, label: "Jueves" },
  { dayOfWeek: 5, label: "Viernes" },
  { dayOfWeek: 6, label: "Sabado" },
];

const EXCEPTION_TYPES = [
  { value: "day_off", label: "Dia no disponible" },
  { value: "vacation", label: "Vacaciones" },
  { value: "manual_block", label: "Bloquear horario" },
  { value: "manual_open", label: "Abrir horario puntual" },
  { value: "special_hours", label: "Horario especial del dia" },
];

const createEmptyDay = (dayOfWeek) => ({
  dayOfWeek,
  enabled: false,
  ranges: [{ start: "09:00", end: "18:00" }],
});

const createDefaultTemplate = () => ({
  timezone: "America/Buenos_Aires",
  slotGranularityMinutes: 60,
  defaultCoverageKm: 20,
  active: true,
  days: DAYS.map((day) => createEmptyDay(day.dayOfWeek)),
});

const createEmptyException = () => ({
  type: "day_off",
  startDate: "",
  endDate: "",
  reason: "",
  ranges: [{ start: "09:00", end: "18:00" }],
});

const shouldUseRanges = (type) =>
  ["manual_block", "manual_open", "special_hours"].includes(type);

const normalizeTemplate = (template) => {
  const base = createDefaultTemplate();

  if (!template) {
    return base;
  }

  return {
    timezone: template.timezone || base.timezone,
    slotGranularityMinutes:
      template.slotGranularityMinutes || base.slotGranularityMinutes,
    defaultCoverageKm: template.defaultCoverageKm ?? base.defaultCoverageKm,
    active: template.active ?? true,
    days: DAYS.map((day) => {
      const current = template.days?.find(
        (item) => item.dayOfWeek === day.dayOfWeek
      );

      if (!current) {
        return createEmptyDay(day.dayOfWeek);
      }

      return {
        dayOfWeek: day.dayOfWeek,
        enabled: current.enabled ?? current.active ?? false,
        ranges:
          current.ranges?.length > 0
            ? current.ranges.map((range) => ({
                start: range.start || range.startTime || "09:00",
                end: range.end || range.endTime || "18:00",
              }))
            : [{ start: "09:00", end: "18:00" }],
      };
    }),
  };
};

const AvailabilityPreviewTable = ({ professionalId }) => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDisponibilidades = useCallback(async () => {
    if (!professionalId) {
      return;
    }

    try {
      setLoading(true);
      const response = await clienteAxios.post(
        "/api/profesional/disponibilidad-por-id",
        { _id: professionalId }
      );
      setDisponibilidades(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          "No pudimos cargar la disponibilidad del profesional"
      );
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useEffect(() => {
    loadDisponibilidades();
  }, [loadDisponibilidades]);

  const columns = [
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
    {
      title: "Horarios disponibles",
      dataIndex: "horarios",
      key: "horarios",
      render: (horarios = []) =>
        horarios.length > 0 ? (
          <ul className="list-disc pl-4">
            {horarios
              .filter((horario) => horario.stock !== false)
              .map((horario) => (
                <li key={horario._id || horario.hora}>{horario.hora}</li>
              ))}
          </ul>
        ) : (
          <span>Sin horarios</span>
        ),
    },
  ];

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Vista previa proxima semana
        </h3>
        <button
          type="button"
          onClick={loadDisponibilidades}
          className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
        >
          Recargar
        </button>
      </div>
      <Table
        dataSource={disponibilidades.map((item) => ({
          ...item,
          key: item._id || `${item.fecha}-${item.creador?._id || "prof"}`,
        }))}
        columns={columns}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

const Schedule = ({ profesionalSelect }) => {
  const authUser = useSelector((state) => state.auth.user);
  const professionalId =
    profesionalSelect?.profesional?._id ||
    authUser?.profesionalId ||
    authUser?.profesional?._id;
  const isAdminEditing = Boolean(profesionalSelect?.profesional?._id);

  const scheduleTemplatePath = isAdminEditing
    ? `/api/profesional/schedule-template/${professionalId}`
    : "/api/profesional/schedule-template";
  const scheduleExceptionsPath = isAdminEditing
    ? `/api/profesional/schedule-exceptions/${professionalId}`
    : "/api/profesional/schedule-exceptions";

  const [templateForm, setTemplateForm] = useState(createDefaultTemplate());
  const [templateLoading, setTemplateLoading] = useState(false);
  const [exceptionForm, setExceptionForm] = useState(createEmptyException());
  const [exceptions, setExceptions] = useState([]);
  const [exceptionsLoading, setExceptionsLoading] = useState(false);
  const [legacyDateInput, setLegacyDateInput] = useState("");
  const [legacySlots, setLegacySlots] = useState([]);
  const [legacySelectedOptions, setLegacySelectedOptions] = useState([]);
  const [legacyLoading, setLegacyLoading] = useState(false);

  const legacyReadPath = useMemo(() => {
    if (!legacyDateInput) {
      return "";
    }

    if (isAdminEditing) {
      return `/api/profesional/disponibilidad-profesional-admin-dash?fecha=${legacyDateInput}&_id=${professionalId}`;
    }

    return `/api/profesional/${legacyDateInput}`;
  }, [isAdminEditing, legacyDateInput, professionalId]);

  const loadTemplate = useCallback(async () => {
    if (!professionalId) {
      return;
    }

    try {
      setTemplateLoading(true);
      const { data } = await clienteAxios.get(scheduleTemplatePath);
      setTemplateForm(normalizeTemplate(data.template));
    } catch (error) {
      setTemplateForm(createDefaultTemplate());
      toast.error(
        error.response?.data?.msg ||
          "No pudimos cargar la agenda semanal del profesional"
      );
    } finally {
      setTemplateLoading(false);
    }
  }, [professionalId, scheduleTemplatePath]);

  const loadExceptions = useCallback(async () => {
    if (!professionalId) {
      return;
    }

    try {
      setExceptionsLoading(true);
      const { data } = await clienteAxios.get(scheduleExceptionsPath);
      setExceptions(data.exceptions || []);
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          "No pudimos cargar las excepciones del profesional"
      );
    } finally {
      setExceptionsLoading(false);
    }
  }, [professionalId, scheduleExceptionsPath]);

  useEffect(() => {
    loadTemplate();
    loadExceptions();
  }, [loadTemplate, loadExceptions]);

  const loadLegacyDate = useCallback(
    async (dateValue) => {
      if (!dateValue || !professionalId) {
        return;
      }

      try {
        setLegacyLoading(true);
        const { data } = await clienteAxios.get(
          isAdminEditing
            ? `/api/profesional/disponibilidad-profesional-admin-dash?fecha=${dateValue}&_id=${professionalId}`
            : `/api/profesional/${dateValue}`
        );

        const horarios = data?.horarios || [];
        setLegacyDateInput(dateValue);
        setLegacySlots(horarios);
        setLegacySelectedOptions(
          horarios
            .filter((slot) => slot.stock !== false)
            .map((slot) => slot.hora)
        );
      } catch (error) {
        toast.error(
          error.response?.data?.msg ||
            "No pudimos cargar la agenda diaria del profesional"
        );
        setLegacyDateInput(dateValue);
        setLegacySlots([]);
        setLegacySelectedOptions([]);
      } finally {
        setLegacyLoading(false);
      }
    },
    [isAdminEditing, professionalId]
  );

  const updateDayField = (dayOfWeek, patch) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day
      ),
    }));
  };

  const updateRangeField = (dayOfWeek, rangeIndex, field, value) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              ranges: day.ranges.map((range, index) =>
                index === rangeIndex ? { ...range, [field]: value } : range
              ),
            }
          : day
      ),
    }));
  };

  const addRangeToDay = (dayOfWeek) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              ranges: [...day.ranges, { start: "09:00", end: "18:00" }],
            }
          : day
      ),
    }));
  };

  const removeRangeFromDay = (dayOfWeek, rangeIndex) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) {
          return day;
        }

        const nextRanges = day.ranges.filter((_, index) => index !== rangeIndex);
        return {
          ...day,
          ranges:
            nextRanges.length > 0
              ? nextRanges
              : [{ start: "09:00", end: "18:00" }],
        };
      }),
    }));
  };

  const handleSaveTemplate = async (event) => {
    event.preventDefault();

    try {
      setTemplateLoading(true);
      await clienteAxios.put(scheduleTemplatePath, templateForm);
      toast.success("Agenda semanal guardada");
      await loadTemplate();
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          "No pudimos guardar la agenda semanal del profesional"
      );
    } finally {
      setTemplateLoading(false);
    }
  };

  const updateExceptionRange = (index, field, value) => {
    setExceptionForm((prev) => ({
      ...prev,
      ranges: prev.ranges.map((range, rangeIndex) =>
        rangeIndex === index ? { ...range, [field]: value } : range
      ),
    }));
  };

  const addExceptionRange = () => {
    setExceptionForm((prev) => ({
      ...prev,
      ranges: [...prev.ranges, { start: "09:00", end: "18:00" }],
    }));
  };

  const removeExceptionRange = (index) => {
    setExceptionForm((prev) => {
      const nextRanges = prev.ranges.filter((_, rangeIndex) => rangeIndex !== index);
      return {
        ...prev,
        ranges:
          nextRanges.length > 0
            ? nextRanges
            : [{ start: "09:00", end: "18:00" }],
      };
    });
  };

  const handleCreateException = async (event) => {
    event.preventDefault();

    if (!exceptionForm.startDate || !exceptionForm.endDate) {
      return toast.error("Debes completar fecha de inicio y fin");
    }

    try {
      setExceptionsLoading(true);
      await clienteAxios.post(scheduleExceptionsPath, {
        ...exceptionForm,
        ranges: shouldUseRanges(exceptionForm.type) ? exceptionForm.ranges : [],
      });
      toast.success("Excepcion guardada");
      setExceptionForm(createEmptyException());
      await loadExceptions();
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          "No pudimos guardar la excepcion del profesional"
      );
    } finally {
      setExceptionsLoading(false);
    }
  };

  const handleDeleteException = async (exceptionId) => {
    try {
      setExceptionsLoading(true);
      await clienteAxios.delete(
        `/api/profesional/schedule-exceptions/item/${exceptionId}`
      );
      toast.success("Excepcion eliminada");
      await loadExceptions();
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          "No pudimos eliminar la excepcion del profesional"
      );
    } finally {
      setExceptionsLoading(false);
    }
  };

  const handleLegacyCheckboxChange = (slotValue, checked) => {
    if (checked) {
      setLegacySlots((prev) => [
        ...prev.filter((slot) => slot.hora !== slotValue),
        { hora: slotValue, stock: true },
      ]);
      setLegacySelectedOptions((prev) => [...prev, slotValue]);
      return;
    }

    setLegacySlots((prev) => prev.filter((slot) => slot.hora !== slotValue));
    setLegacySelectedOptions((prev) => prev.filter((slot) => slot !== slotValue));
  };

  const handleLegacySave = async (event) => {
    event.preventDefault();

    if (!legacyDateInput) {
      return toast.error("Debes seleccionar una fecha");
    }

    try {
      setLegacyLoading(true);
      await clienteAxios.post("/api/profesional", {
        fecha: legacyDateInput,
        horarios: legacySlots,
        _id: professionalId,
      });
      toast.success("Agenda diaria guardada");
      await loadLegacyDate(legacyDateInput);
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          "No pudimos guardar la agenda diaria del profesional"
      );
    } finally {
      setLegacyLoading(false);
    }
  };

  const exceptionTypeLabel = useCallback(
    (value) =>
      EXCEPTION_TYPES.find((type) => type.value === value)?.label || value,
    []
  );

  return (
    <div className="my-12 space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Agenda semanal base
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Define una sola vez los dias y rangos en que el profesional puede
              trabajar. Luego la disponibilidad efectiva se calcula con
              excepciones y ordenes ya ocupadas.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSaveTemplate}>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Zona horaria
                </span>
                <input
                  type="text"
                  value={templateForm.timezone}
                  onChange={(event) =>
                    setTemplateForm((prev) => ({
                      ...prev,
                      timezone: event.target.value,
                    }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Duracion del slot
                </span>
                <select
                  value={templateForm.slotGranularityMinutes}
                  onChange={(event) =>
                    setTemplateForm((prev) => ({
                      ...prev,
                      slotGranularityMinutes: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                >
                  <option value={30}>30 minutos</option>
                  <option value={60}>60 minutos</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Cobertura por defecto
                </span>
                <input
                  type="number"
                  min="0"
                  value={templateForm.defaultCoverageKm}
                  onChange={(event) =>
                    setTemplateForm((prev) => ({
                      ...prev,
                      defaultCoverageKm: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
            <div className="space-y-4">
              {templateForm.days.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className="rounded border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(event) =>
                          updateDayField(day.dayOfWeek, {
                            enabled: event.target.checked,
                          })
                        }
                      />
                      {
                        DAYS.find((item) => item.dayOfWeek === day.dayOfWeek)
                          ?.label
                      }
                    </label>
                    <button
                      type="button"
                      onClick={() => addRangeToDay(day.dayOfWeek)}
                      className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
                    >
                      Agregar rango
                    </button>
                  </div>

                  {day.enabled && (
                    <div className="mt-4 space-y-3">
                      {day.ranges.map((range, index) => (
                        <div
                          key={`${day.dayOfWeek}-${index}`}
                          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                        >
                          <input
                            type="time"
                            value={range.start}
                            onChange={(event) =>
                              updateRangeField(
                                day.dayOfWeek,
                                index,
                                "start",
                                event.target.value
                              )
                            }
                            className="rounded border border-slate-300 px-3 py-2"
                          />
                          <input
                            type="time"
                            value={range.end}
                            onChange={(event) =>
                              updateRangeField(
                                day.dayOfWeek,
                                index,
                                "end",
                                event.target.value
                              )
                            }
                            className="rounded border border-slate-300 px-3 py-2"
                          />
                          <button
                            type="button"
                            onClick={() => removeRangeFromDay(day.dayOfWeek, index)}
                            className="rounded border border-rose-300 px-3 py-2 text-sm text-rose-700"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={templateLoading}
              className="rounded bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {templateLoading ? "Guardando..." : "Guardar agenda semanal"}
            </button>
          </form>
        </section>

        <section className="rounded bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Excepciones y ausencias
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Usa esta seccion para vacaciones, dias libres o aperturas y
              bloqueos puntuales sin tocar toda la semana base.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleCreateException}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Tipo
                </span>
                <select
                  value={exceptionForm.type}
                  onChange={(event) =>
                    setExceptionForm((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                >
                  {EXCEPTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Motivo
                </span>
                <input
                  type="text"
                  value={exceptionForm.reason}
                  onChange={(event) =>
                    setExceptionForm((prev) => ({
                      ...prev,
                      reason: event.target.value,
                    }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Desde
                </span>
                <input
                  type="date"
                  value={exceptionForm.startDate}
                  onChange={(event) =>
                    setExceptionForm((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Hasta
                </span>
                <input
                  type="date"
                  value={exceptionForm.endDate}
                  onChange={(event) =>
                    setExceptionForm((prev) => ({
                      ...prev,
                      endDate: event.target.value,
                    }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
            {shouldUseRanges(exceptionForm.type) && (
              <div className="space-y-3 rounded border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Rangos afectados
                  </h3>
                  <button
                    type="button"
                    onClick={addExceptionRange}
                    className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
                  >
                    Agregar rango
                  </button>
                </div>
                {exceptionForm.ranges.map((range, index) => (
                  <div
                    key={`exception-range-${index}`}
                    className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      type="time"
                      value={range.start}
                      onChange={(event) =>
                        updateExceptionRange(index, "start", event.target.value)
                      }
                      className="rounded border border-slate-300 px-3 py-2"
                    />
                    <input
                      type="time"
                      value={range.end}
                      onChange={(event) =>
                        updateExceptionRange(index, "end", event.target.value)
                      }
                      className="rounded border border-slate-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeExceptionRange(index)}
                      className="rounded border border-rose-300 px-3 py-2 text-sm text-rose-700"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={exceptionsLoading}
              className="rounded bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {exceptionsLoading ? "Guardando..." : "Guardar excepcion"}
            </button>
          </form>
          <div className="mt-8 space-y-3">
            {exceptions.length === 0 && (
              <p className="text-sm text-slate-500">
                No hay excepciones registradas todavia.
              </p>
            )}
            {exceptions.map((exception) => (
              <div
                key={exception._id}
                className="rounded border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {exceptionTypeLabel(exception.type)}
                    </p>
                    <p className="text-sm text-slate-600">
                      {String(exception.startDate).slice(0, 10)} al{" "}
                      {String(exception.endDate).slice(0, 10)}
                    </p>
                    {exception.reason && (
                      <p className="text-sm text-slate-500">
                        Motivo: {exception.reason}
                      </p>
                    )}
                    {exception.ranges?.length > 0 && (
                      <p className="text-sm text-slate-500">
                        Rangos:{" "}
                        {exception.ranges
                          .map((range) => `${range.start}-${range.end}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteException(exception._id)}
                    className="rounded border border-rose-300 px-3 py-2 text-sm text-rose-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded bg-white p-6 shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Compatibilidad diaria y migracion
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Esta pantalla legacy sigue disponible para casos puntuales. Si el
            profesional ya tiene agenda semanal, aqui veras la disponibilidad
            efectiva del dia y tambien puedes sobrescribirla cargando un dia
            puntual.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleLegacySave}>
          <div className="max-w-sm">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Fecha puntual
              </span>
              <input
                type="date"
                value={legacyDateInput}
                onChange={(event) => loadLegacyDate(event.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          {legacyDateInput && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SLOT_OPTIONS.map((slot) => (
                  <label
                    key={slot}
                    className="flex items-center gap-3 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={legacySelectedOptions.includes(slot)}
                      onChange={(event) =>
                        handleLegacyCheckboxChange(slot, event.target.checked)
                      }
                    />
                    {slot}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={legacyLoading}
                className="rounded bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {legacyLoading ? "Guardando..." : "Guardar agenda diaria"}
              </button>
            </div>
          )}
          {legacyReadPath && (
            <p className="text-xs text-slate-400">
              Fuente actual: {legacyReadPath}
            </p>
          )}
        </form>
      </section>

      <AvailabilityPreviewTable professionalId={professionalId} />
    </div>
  );
};

export default Schedule;
