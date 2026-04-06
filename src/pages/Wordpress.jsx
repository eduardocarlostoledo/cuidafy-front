import React from "react";
import { useNavigate } from "react-router-dom";

const Wordpress = () => {
  const navigate = useNavigate();

  const productos = [
    {
      nombre: "Masaje reductor + Limpieza facial profunda",
      precio: "298000",
      id: "12307",
    },
    {
      nombre: "Drenaje linfático + Limpieza facial profunda",
      precio: "298000",
      id: "12308",
    },
  ];

  const handleAgregarCarro = (producto) => {
    navigate(`/servicio?id=${producto.id}`)
  };

  return (
    <div className="flex justify-center items-center w-full h-100v gap-4">
      {productos.map((producto) => (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow ">
          <img
            className="rounded-t-lg"
            src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/20.jpg.webp"
            alt=""
          />

          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              {producto.nombre}
            </h5>

            <p className="mb-3 font-normal text-gray-700 ">
              Precio: {producto.precio}
            </p>
            <button
              onClick={() => handleAgregarCarro(producto)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
            >
              Reservar
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wordpress;
