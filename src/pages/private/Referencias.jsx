import React, { useEffect, useState } from "react";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { BsCheckCircle } from "react-icons/bs";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import clienteAxios from "../../config/axios";

const Referencias = () => {
  const [referidosState, setReferidosState] = useState({
    codigoreferido: "",
    referidos: [],
  });

  const [effect, setEffect] = useState({
    button1: false,
    button2: false,
  });

  const { button1, button2 } = effect;

  const { codigoreferido, referidos } = referidosState;

  const { user } = useSelector((state) => ({ ...state.auth }));

  useEffect(() => {
    const getPerfilReferido = async () => {
      try {
        let { data } = await clienteAxios.get(
          `api/profesional/perfil-referido`
        );

        setReferidosState(data);
      } catch (err) {
        console.log(err);
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getPerfilReferido();
  }, []);

  const handleClickCopy = (e) => {

    if (e.target.getAttribute("id") === "codigo-referido") {
      setEffect({
        ...effect,
        button1: true,
      });

      navigator.clipboard.writeText(codigoreferido);

      setTimeout(() => {
        setEffect({
          ...effect,
          button1: false,
        });
      }, 3000);
    } else {
      setEffect({
        ...effect,
        button2: true,
      });

      navigator.clipboard.writeText(
        `https://calyaan.com.co?referido${codigoreferido}`
      );

      setTimeout(() => {
        setEffect({
          ...effect,
          button2: false,
        });
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="mb-4">
            <p className="font-medium text-xl mb-2">Referidos</p>
            <p className="text-gray-600 leading-loose">
              Por cada registro que se realice en la plataforma con el "enlace
              de referido" se vincularan ti, por cada servicio adquirido por el
              cliente se te dará el 5% del costo.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-medium leading-none mb-2">
                Historial de referidos
              </h5>
            </div>

            <div className="mb-5">
              <div className="md:col-span-5 w-full">
                <label
                  for="website-admin"
                  className="block mb-2 font-medium text-gray-900 "
                >
                  Código de referido
                </label>
                <div className="flex">
                  <span
                    id="codigo-referido"
                    className={`${
                      button1 && "bg-green-200"
                    } cursor-pointer inline-flex items-center justify-center px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md `}
                    onClick={handleClickCopy}
                  >
                    {button1 ? (
                      <BsCheckCircle
                        className="w-5 h-5 animate-bounce"
                        id="codigo-referido"
                      />
                    ) : (
                      <HiOutlineClipboardCopy
                        className="w-5 h-5 cursor-pointer"
                        id="codigo-referido"
                      />
                    )}
                  </span>
                  <input
                    type="text"
                    id="website-admin"
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                    disabled={true}
                    value={codigoreferido}
                  />
                </div>
              </div>

              <div className="md:col-span-5 w-full mt-4">
                <label
                  for="website-admin"
                  className="block mb-2 font-medium text-gray-900"
                >
                  Enlace de referido
                </label>
                <div className="flex">
                  <span
                    id="enlace-referido"
                    className={`${
                      button2 && "bg-green-200"
                    } cursor-pointer inline-flex items-center justify-center px-3 py-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md`}
                    onClick={handleClickCopy}
                  >
                    {button2 ? (
                      <BsCheckCircle
                        className="w-5 h-5 animate-bounce"
                        id="codigo-referido"
                      />
                    ) : (
                      <HiOutlineClipboardCopy
                        className="w-5 h-5 cursor-pointer"
                        id="enlace-referido"
                      />
                    )}
                  </span>
                  <input
                    type="text"
                    id="website-admin"
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                    value={`https://calyaan.com.co?referido=${codigoreferido}`}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Servicios
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referidos?.map((referido) => (
                    <tr className="bg-white border-b" key={referido._id}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {referido.nombre} {referido.apellido}
                      </th>
                      <td className="px-6 py-4">
                        {referido.createdAt.split("T")[0]}
                      </td>
                      <td className="px-6 py-4">{referido.reservas.length}</td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referencias;
