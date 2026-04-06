import React, { useEffect, useState } from 'react';

import clienteAxios from '../../../../../config/axios';
import { toast } from 'react-toastify';
import { NumericFormat } from 'react-number-format';
import Spinner from '../../../../../components/Spinner';
import CouponGenerationModal from '../../pages/CouponGenerationModal';

const ServiciosComponent = ({ setServicios, servicios, setReserva, reserva, precioConDescuentos , fechaVenta, setFechaVenta }) => {
  //console.log("precioConDescuentos SERVICIOS COMPONENT", precioConDescuentos)
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false);

  useEffect(() => {
    const getProductos = async () => {
      setCargando(true)
      try {
        let { data } = await clienteAxios.get(`/api/products`);

        setProductos(data);
        setCargando(false)
      } catch (err) {
        setCargando(false)
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getProductos();
  }, []);



  const [coupon, setCoupon] = useState('');

  // Función para abrir el modal
  const handleOpenModal = () => {
    setShowCouponModal(true);
  };

  const handleChangeServicio = (e) => {
    if (!servicios.includes(e.target.value) && e.target.value !== "" && servicios.length < 1) {
      let busqueda = productos.filter(
        (servicio) => servicio._id === e.target.value
      );

      setServicios([...servicios, ...busqueda]);
    }
  };

  // Ordenar los productos alfabéticamente por nombre
  const productosOrdenados = productos?.sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );

  const applyCoupon = async (e) => {
    e.preventDefault()

    try {
      let { data } = await clienteAxios.post(`/api/coupon/discount`, { coupon, valor: servicios[0]?.precio });

      servicios[0].valorTotal = data.valorTotal
      servicios[0]._idCodigo = data._idCodigo

      setReserva({
        ...reserva,
        coupon: data._idCodigo,
        valorTotal: servicios[0].valorTotal = data.valorTotal
      });

    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Estamos presentando problemas internos";
      toast.error(errorMsg);
    }
  };

  function eliminarDelCarrito() {
    setServicios([]);
  }

  return (

    <div>
      <div className="flex justify-between py-2 mb-5">
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Información de servicio
        </h6>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 px-4">

          {
            cargando ?
              <Spinner />
              :
              <div className="relative w-full mb-6">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Servicios
                </label>
                <select
                  id="servicios"
                  className="bg-white appearance-none z-10 pl-3 py-3 w-full text-sm border border-transparent focus:outline-none focus:border-indigo-700 text-gray-800 rounded"
                  onChange={handleChangeServicio}
                  name="servicios"
                >
                  <option value="">Servicios</option>
                  {productosOrdenados?.map((servicio, index) => (
                    <option key={index} value={servicio._id}>
                      {servicio.nombre}
                    </option>
                  ))}
                </select>
              </div>
          }

          {servicios.length > 0 && (
            <div className="relative w-full mb-3">
              <form onSubmit={applyCoupon}>
                <div>
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                    Cupón
                  </label>
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Ingresa Cupón"
                  />
                </div>

                 {/* Nuevo campo para la fecha de venta */}
        <div>
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="fechaVenta">
            Fecha de Venta
          </label>
          <input
            type="date" // Puedes usar otro tipo de input según tus necesidades
            value={fechaVenta}
            onChange={(e) => setFechaVenta(e.target.value)}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          />
        </div>
        {/* Fin del nuevo campo */}


                <div>
                  <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover rounded focus:outline-none">
                    <p className="text-sm font-medium leading-none text-white">
                      Aplicar Cupón
                    </p>
                  </button>
                </div>
              </form>
            </div>
          )}

{/* Botón para abrir el modal */}
<button
        className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover rounded focus:outline-none"
        onClick={handleOpenModal}
      >
        <p className="text-sm font-medium leading-none text-white">
Generar Cupón        </p>
      </button>

          <CouponGenerationModal
            isOpen={showCouponModal}
            onClose={() => setShowCouponModal(false)}
            setServicios={setServicios}
            servicios={servicios}
            setReserva={setReserva}
            reserva={reserva}
            precioConDescuentos={precioConDescuentos}
            style={{ display: 'block', background: 'white', padding: '20px' }}
          />


        </div>

        {servicios.length > 0 && (
          <div id="menu" className={`w-full px-4 flex`}>
            <div className="pt-11 sm:px-6 px-4 pb-4 sm:pb-6 flex-row space-y-12 w-full relative ">
              {servicios.map((servicio, index) => (
                <div
                  key={index}
                  className="flex flex-row w-full justify-between sm:space-x-4 "
                >
                  <div className="flex gap-4">
                    <div className=" h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={servicio?.img}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="flex justify-center items-start flex-col mt-4 sm:mt-0">
                      <p className="text-base leading-4 text-gray-800">
                        {servicio.nombre}
                      </p>
                      <p className="text-sm leading-none my-2 text-gray-600">
                        Cantidad: 1
                      </p>
                      <NumericFormat
                        value={servicio.precio}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    </div>
                  </div>

                  <div className="  sm:right-0 sm:inset-y-3">
                    <button
                      className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 "
                      onClick={() => eliminarDelCarrito()}
                    >
                      <svg
                        className="text-gray-800 hover:text-black fill-stroke"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center items-center w-full flex-col space-y-2">
                <div className="flex justify-between items-center w-full">
                  <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">
                    Total
                  </p>
                  <p className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-gray-800">
                    {!servicios[0]._idCodigo ? (
                      servicios.length > 1 ? (
                        <p>
                          {' '}
                          <NumericFormat
                            value={servicios.reduce(
                              (a, b) => Number(a.precio) + Number(b.precio)
                            )}

                            displayType="text"
                            thousandSeparator={true}
                            prefix="$"
                          />
                        </p>
                      ) : (
                        <NumericFormat
                          value={Number(precioConDescuentos) || servicios?.map((a) => a.precio)[0]} //comentado por que no muestra el precio con descuentos                          
                          displayType="text"
                          thousandSeparator={true}
                          prefix="$"
                        />
                      )
                    ) : (
                      <NumericFormat
                        value={Number(precioConDescuentos) || servicios[0].valorTotal}

                        displayType="text"
                        thousandSeparator={true}
                        prefix="$"
                      />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiciosComponent;
