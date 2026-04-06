// CouponGenerationModal.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../../../config/axios';


// ... (importaciones)

const CouponGenerationModal = ({ isOpen, onClose, setServicios, servicios, setReserva, reserva, precioConDescuentos }) => {
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const minDateString = today.toISOString().split("T")[0];
    setMinDate(minDateString);
  }, []);

  const [coupon, setCoupon] = useState({
    codigo: "",
    tipoDescuento: "",
    descuento: "",
    vencimiento: "",
  });

  const { codigo, tipoDescuento, descuento, vencimiento } = coupon;
  const [cuponesNoVigentes, setCuponesNoVigentes] = useState([]);
  const [cuponesVigentes, setCuponesVigentes] = useState([]);

  const handleChange = (e) => {
    setCoupon({
      ...coupon,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if ([codigo, tipoDescuento, descuento, vencimiento].includes("")) {
        return toast.error("Todos los campos son obligatorios");
      }

      let { data } = await clienteAxios.post(`/api/coupon`, coupon);

      toast.success(data.msg);

      setCoupon({
        codigo: "",
        tipoDescuento: "",
        descuento: "",
        vencimiento: "",
      });

      console.log(coupon.codigo, "COUPONGENERATION")
      alert(`Cupón: ${coupon.codigo}`);

      setCuponesVigentes([...cuponesVigentes, data.coupon]);
    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Estamos presentando problemas internos";
      toast.error(errorMsg);
    }
  };

  const handleCopyCoupon = (text) => {
    navigator.clipboard.writeText(text);
  };

  const [selectedAccordion, setSelectedAccordion] = useState(null);

  const toggleAccordion = (accordionId) => {
    setSelectedAccordion(
      selectedAccordion === accordionId ? null : accordionId
    );
  };

  const isAccordionOpen = (accordion) => {
    return selectedAccordion === accordion;
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="modal">
        <div className="relative w-full mb-10">
          

          <form
            onSubmit={handleSubmit}
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4"
          >
            <div>
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Código*
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="codigo"
                value={codigo}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="CUP2021"
              />
            </div>

            <div className="mb-4">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Tipo de Descuento*
              </label>
              <select
                type="text"
                onChange={handleChange}
                value={tipoDescuento}
                name="tipoDescuento"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option value="">Seleccionar</option>
                <option value="porcentaje">Porcentaje</option>
                <option value="valor">Valor</option>
              </select>
            </div>

            <div>
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Descuento*
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="descuento"
                value={descuento}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Porcentaje 25 / Valor 25.000 "
              />
            </div>

            <div>
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Vencimiento
              </label>
              <input
                type="date"
                value={vencimiento}
                onChange={handleChange}
                min={minDate}
                name="vencimiento"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>

            <div>
              <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none">
                <p className="text-sm font-medium leading-none text-white">
                  Crear Cupón
                </p>
              </button>
            </div>
          </form>
        </div>
        <button
          onClick={onClose}
          className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover rounded focus:outline-none"
        >
          <p className="text-sm font-medium leading-none text-white">
            Cerrar Generar Cupón
          </p>
        </button>
      </div>
    </div>
  );
};

export default CouponGenerationModal;
