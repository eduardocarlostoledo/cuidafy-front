import React, { useState } from "react";
import { useCarrito } from "../hooks/useCarrito";
import { Button, Select, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

/**
 * Componente para seleccionar horario y agregar disponibilidad al carrito
 * Props: { disponibilidad }
 */
const AgregarAlCarritoBtn = ({ disponibilidad, precio = 0 }) => {
  const { agregarItem } = useCarrito();
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!disponibilidad) {
    return null;
  }

  const horarios = disponibilidad.horarios || disponibilidad.disponibilidad || [];
  const horariosDisponibles = horarios.filter((h) => h.stock === true);

  const manejarAgregarAlCarrito = () => {
    if (!horarioSeleccionado) {
      message.warning("Por favor selecciona un horario");
      return;
    }

    setLoading(true);

    try {
      const horarioObj = horarios.find((h) => h._id === horarioSeleccionado);

      if (!horarioObj) {
        message.error("Horario no válido");
        return;
      }

      const agregado = agregarItem(
        disponibilidad,
        horarioObj._id,
        horarioObj.hora,
        precio
      );

      if (agregado) {
        message.success("¡Agregado al carrito!");
        setHorarioSeleccionado(null);

        // Scroll to top
        window.scrollTo(0, 0);
      } else {
        message.error("Error al agregar al carrito");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold mb-2">
          Selecciona un horario
        </label>
        <Select
          placeholder="Elige un horario disponible"
          value={horarioSeleccionado}
          onChange={setHorarioSeleccionado}
          className="w-full"
          options={horariosDisponibles.map((h) => ({
            label: h.hora,
            value: h._id,
          }))}
        />
      </div>

      <Button
        type="primary"
        size="large"
        icon={<ShoppingCartOutlined />}
        onClick={manejarAgregarAlCarrito}
        loading={loading}
        disabled={!horariosDisponibles.length}
        className="w-full"
      >
        {precio > 0 ? `Agregar - $${precio.toFixed(2)}` : "Agregar al carrito"}
      </Button>

      {!horariosDisponibles.length && (
        <p className="text-sm text-red-500 text-center">
          No hay horarios disponibles en este momento
        </p>
      )}
    </div>
  );
};

export default AgregarAlCarritoBtn;
