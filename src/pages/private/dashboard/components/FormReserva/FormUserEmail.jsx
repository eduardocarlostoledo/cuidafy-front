import React, { useState } from 'react';
import Spinner from '../../../../../components/Spinner';
import { toast } from 'react-toastify';
import clienteAxios from '../../../../../config/axios';

const FormUserEmail = ({userEmail,setUserEmail,setEstado,setReserva,reserva}) => {

    const [cargando,setCargando] = useState(false)

    const handleSubmitUserEmail = async (e) => {
        setCargando(true);

        e.preventDefault();

        if (userEmail === "") {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            let { data } = await clienteAxios.post(`api/usuarios/email`, {
                email: userEmail,
            });

            setEstado("nuevo");

            setReserva({
                ...reserva,
                cliente_id: data?._id,
                cliente_email: data?.email,
                cliente_nombre: data?.nombre,
                cliente_apellido: data?.apellido,
                cliente_cedula: data?.cedula,
                cliente_telefono: data?.telefono,
                direccion_servicio:data?.direcciones[0]?.direccion,
                localidad_servicio: data?.direcciones[0]?.localidad,
                adicional_direccion_servicio: data?.direccionDefault?.info,
                ciudad_Servicio: data?.direccionDefault?.ciudad,
                telefono_servicio: data?.telefono,
                nuevo: false,
            });
console.log("FORM USER email", reserva)
            setCargando(false);
            setUserEmail("");
        } catch (err) {
            console.log(err);
            setCargando(false);
            let error = err.response.data.msg
                ? err.response.data.msg
                : err.response && "Estamos presentando problemas internos";
            return toast.error(error);
        }
    };

    return (
        <>
            {cargando ? (
                <Spinner />
            ) : (
                <form onSubmit={handleSubmitUserEmail}>
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Correo Electrónico de usuario
                        </label>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Correo Electrónico"
                        />
                    </div>
                    <button className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover rounded focus:outline-none">
                        <p className="text-sm font-medium leading-none text-white">
                            Buscar Usuario
                        </p>
                    </button>
                </form>
            )}
        </>


    );
};

export default FormUserEmail;
