import React from "react";
import { useCarrito } from "../hooks/useCarrito";
import { Button, Empty, List, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { saveCareRequest } from "../helpers/careFlow";

/**
 * Componente que muestra resumen del carrito
 * Puede ser usado en header o sidebar
 */
const CarritoResumen = ({ compact = false }) => {
  const { items, total, subtotal, eliminarItem, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const handleContinueInCareFlow = () => {
    const firstItem = items[0];

    saveCareRequest({
      preferredSpecialty: firstItem?.profesional?.especialidades?.[0] || "",
      notes:
        firstItem?.fecha && firstItem?.hora
          ? `Referencia previa desde carrito legacy: ${firstItem.fecha} a las ${firstItem.hora}.`
          : "",
    });

    navigate("/cuidado/matches");
  };

  if (!items.length) {
    return (
      <div className="p-4 text-center">
        <Empty description="Sin selección legacy" style={{ marginTop: "20px" }} />
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{total} items</span>
        <span className="text-sm text-gray-600">${subtotal.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Selección anterior ({total})</h2>
        <div className="text-sm text-gray-600">
          Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className="border-b pb-2"
            extra={
              <Popconfirm
                title="Eliminar"
                description="¿Estás seguro de eliminar este item?"
                onConfirm={() => eliminarItem(item.id)}
                okText="Sí"
                cancelText="No"
              >
                <DeleteOutlined className="cursor-pointer text-red-500 hover:text-red-700" />
              </Popconfirm>
            }
          >
            <List.Item.Meta
              title={`${item.profesional?.nombre || "Profesional"} ${
                item.profesional?.apellido || ""
              }`}
              description={
                <div className="text-xs text-gray-600">
                  <p>Fecha: {item.fecha}</p>
                  <p>Hora: {item.hora}</p>
                  <p>Especialidad: {item.profesional?.especialidades?.[0]}</p>
                </div>
              }
            />
            <div className="text-right">
              <div className="font-semibold">${item.precio?.toFixed(2) || "0.00"}</div>
            </div>
          </List.Item>
        )}
      />

      <div className="mt-4 flex gap-2">
        <Button type="primary" className="flex-1" onClick={handleContinueInCareFlow}>
          Continuar en el hub
        </Button>
        <Popconfirm
          title="Vaciar carrito"
          description="¿Eliminar todos los items?"
          onConfirm={vaciarCarrito}
          okText="Sí"
          cancelText="No"
        >
          <Button danger className="flex-1">
            Vaciar
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default CarritoResumen;
