import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Spin, Empty, Alert, Card, Drawer, Button, Divider, Badge, Tag } from "antd";
import { getOrders } from "./../../../../redux/features/ordenesSlice";
import "./Calendar-optimized.css";


const localizer = momentLocalizer(moment);
const MyCalendar = ({ reservations }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState(Views.MONTH);

  const events = reservations
    .map((reservation) => {
      if (
        !reservation.hora_servicio &&
        !reservation.cita_servicio &&
        !reservation.profesional_id
      ) {
        return null;
      }

      const [start, end] = reservation?.hora_servicio?.split("-") || [];
      const startDate = moment(
        `${reservation.cita_servicio} ${start?.trim()}` || null,
        "YYYY-MM-DD HH:mm"
      );
      const endDate = moment(
        `${reservation.cita_servicio} ${end?.trim()}` || null,
        "YYYY-MM-DD HH:mm"
      );

      return {
        _id: reservation._id,
        nombre: reservation.cliente_id?.nombre,
        apellido: reservation.cliente_id?.apellido,
        servicio: reservation.servicios[0]?.nombre,
        profesional: reservation.profesional_id?.nombre,
        dia: reservation?.cita_servicio,
        start: startDate.toDate(),
        end: endDate.toDate(),
        estadoPago: reservation.factura?.estadoPago,
        nroSesion: reservation?.nroSesion,
        direccion_servicio: reservation.direccion_servicio,
        fullReservation: reservation,
      };
    })
    .filter((event) => event !== null && (event.estadoPago === "approved" || event.estadoPago === "pending"));

  const handleSelectSlot = (slotInfo) => {
    setSelectedDay(slotInfo.start);
    setDrawerOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedDay(event.start);
    setDrawerOpen(true);
  };

  // Obtener eventos del día seleccionado
  const getDayEvents = () => {
    if (!selectedDay) return [];
    const dayStr = moment(selectedDay).format("YYYY-MM-DD");
    return events.filter((e) => moment(e.start).format("YYYY-MM-DD") === dayStr);
  };

  const dayEvents = getDayEvents();
  const displayedEvents = dayEvents.slice(0, 3);
  const hiddenCount = Math.max(0, dayEvents.length - 3);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-600 to-purple-400 rounded-t-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">Calendario de Servicios</h1>
        <p className="text-purple-100 mt-2 text-sm sm:text-base">
          <Badge count={reservations.length} style={{ backgroundColor: "#fff", color: "#9333ea" }} />
          <span className="ml-2">servicios agendados</span>
        </p>
      </div>
      <div className="bg-white rounded-b-lg shadow-lg overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          components={{
            event: EventComponent,
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          view={view}
          onView={setView}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          eventPropGetter={(event) => {
            const className = event.estadoPago === "pending" ? "calendar-event-pending" : "calendar-event-approved";
            return { className };
          }}
        />
      </div>

      <Drawer
        title={`Servicios - ${moment(selectedDay).format("DD MMMM YYYY")}`}
        placement="bottom"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        height="auto"
        className="mobile-drawer"
      >
        {dayEvents.length === 0 ? (
          <p className="text-gray-500">No hay servicios agendados para este día</p>
        ) : (
          <div className="space-y-3">
            {displayedEvents.map((event, idx) => (
              <div key={event._id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-purple-900">{event.nombre} {event.apellido}</h3>
                  <Tag color={event.estadoPago === "approved" ? "green" : "orange"}>
                    {event.estadoPago === "approved" ? "Aprobado" : "Pendiente"}
                  </Tag>
                </div>
                <p className="text-gray-700 mb-2"><strong>Servicio:</strong> {event.servicio}</p>
                <p className="text-gray-700 mb-2"><strong>Profesional:</strong> {event.profesional}</p>
                <p className="text-gray-700 mb-2"><strong>Dirección:</strong> {event.direccion_servicio}</p>
                <p className="text-gray-700 mb-2"><strong>Sesión:</strong> #{event.nroSesion}</p>
                <p className="text-sm text-gray-600">🕒 {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}</p>
                <Divider style={{ margin: "8px 0" }} />
                <Button type="primary" size="small" className="w-full">
                  Ver detalles completos
                </Button>
              </div>
            ))}
            {hiddenCount > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <p className="text-amber-900 font-semibold">+{hiddenCount} servicio{hiddenCount > 1 ? "s" : ""} más</p>
                <p className="text-sm text-amber-700">Desplaza para ver más</p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

const EventComponent = ({ event }) => {
  const hora = moment(event.start).format("HH:mm");
  const isApproved = event.estadoPago === "approved";
  
  return (
    <div 
      className={`p-1 sm:p-2 rounded text-xs font-semibold truncate cursor-pointer transition-all hover:shadow-lg ${
        isApproved
          ? "bg-gradient-to-r from-green-500 to-green-400 text-white"
          : "bg-gradient-to-r from-amber-500 to-amber-400 text-white"
      }`}
      title={`${event.nombre} ${event.apellido} - ${event.servicio} (${hora})`}
    >
      <div className="truncate">{event.nombre} {event.apellido}</div>
      <div className="hidden sm:block text-xs opacity-90 truncate">{event.servicio}</div>
      <div className="text-xs opacity-90">🕒 {hora}</div>
    </div>
  );
};

const CalendarDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.ordenes.order || []);

  useEffect(() => {
    dispatch(getOrders())
      .then(() => setLoading(false))
      .catch((error) => {
        setError(error.message);
        toast.error(error.message);
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-2 sm:p-4">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Cargando servicios..." />
        </div>
      ) : error ? (
        <div className="p-4 sm:p-6">
          <Alert
            message="Error al cargar servicios"
            description={error}
            type="error"
            showIcon
          />
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Empty
            description="No hay servicios agendados"
            style={{ marginTop: 60 }}
          />
        </div>
      ) : (
        <Card className="shadow-lg p-0 sm:p-4">
          <MyCalendar reservations={reservations} />
        </Card>
      )}
    </div>
  );
};

export default CalendarDashboard; 