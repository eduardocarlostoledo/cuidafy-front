import React from "react";
import GeorefLocationSelector from "../../../../../components/GeorefLocationSelector";
import { parseGeorefLocation } from "../../../../../helpers/georefLocation";

const FormUser = ({ handleChange, reserva }) => {
    console.log(reserva, "FORM USER")
    const structuredLocation = parseGeorefLocation(reserva.localidad_servicio);
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidName = (name) => {
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s'-]+$/;
        return nameRegex.test(name);
    };

    const isValidNumeric = (value) => {
        const numericRegex = /^[0-9]+$/;
        return numericRegex.test(value);
    };

    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^\+?[0-9]+$/;
        return phoneRegex.test(phone);
    };


    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            correo electrónico
                        </label>
                        <input
                            type="email"
                            name="cliente_email"
                            onChange={handleChange}
                            value={reserva.cliente_email}
                            className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${isValidEmail(reserva.cliente_email) ? '' : 'border-red-500'
                                }`}
                            placeholder="Correo Electrónico"
                        />
                        {isValidEmail(reserva.cliente_email) ? null : (
                            <p className="text-red-500 text-xs mt-1">Ingresa un correo electrónico válido</p>
                        )}
                    </div>
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Nombres
                        </label>
                        <input
                            type="text"
                            className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${isValidName(reserva.cliente_nombre) ? '' : 'border-red-500'
                                }`}
                            placeholder="Nombres"
                            value={reserva.cliente_nombre}
                            name="cliente_nombre"
                            onChange={handleChange}
                        />
                        {isValidName(reserva.cliente_nombre) ? null : (
                            <p className="text-red-500 text-xs mt-1">Ingresa un nombre válido</p>
                        )}
                    </div>

                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Apellidos
                        </label>
                        <input
                            type="text"
                            className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${isValidName(reserva.cliente_apellido) ? '' : 'border-red-500'
                                }`}
                            placeholder="Apellidos"
                            name="cliente_apellido"
                            value={reserva.cliente_apellido}
                            onChange={handleChange}
                        />
                        {isValidName(reserva.cliente_apellido) ? null : (
                            <p className="text-red-500 text-xs mt-1">Ingresa un apellido válido</p>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Teléfono
                        </label>
                        <input
                            type="text"
                            name="cliente_telefono"
                            onChange={handleChange}
                            value={reserva.cliente_telefono}
                            placeholder="Teléfono"
                            className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${isValidPhoneNumber(reserva.cliente_telefono) ? '' : 'border-red-500'
                                }`}
                        />
                        {isValidPhoneNumber(reserva.cliente_telefono) ? null : (
                            <p className="text-red-500 text-xs mt-1">Ingresa un número de teléfono válido</p>
                        )}
                    </div>

                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Cédula
                        </label>
                        <input
                            type="text"
                            className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${isValidNumeric(reserva.cliente_cedula) ? '' : 'border-red-500'
                                }`}
                            placeholder="Cédula"
                            value={reserva.cliente_cedula}
                            name="cliente_cedula"
                            onChange={handleChange}
                        />
                        {isValidNumeric(reserva.cliente_cedula) ? null : (
                            <p className="text-red-500 text-xs mt-1">Ingresa una cédula válida</p>
                        )}
                    </div>

                </div>

                <div className="w-full lg:w-6/12 px-4">




                </div>



            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                INFORMACIÓN DE Contacto
            </h6>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Dirección
                        </label>
                        <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            name="direccion_servicio"
                            onChange={handleChange}
                            value={reserva.direccion_servicio}
                            placeholder="Dirección del cliente"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            INFORMACIÓN ADICIONAL
                        </label>
                        <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Información adicional"
                            name="adicional_direccion_servicio"
                            onChange={handleChange}
                            value={reserva.adicional_direccion_servicio}
                        />
                    </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Provincia
                        </label>
                        <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Provincia"
                            disabled={true}
                            value={structuredLocation.provincia || "Argentina"}
                        />
                    </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Localidad
                        </label>
                        <GeorefLocationSelector
                            value={reserva.localidad_servicio}
                            onChange={({ label }) =>
                                handleChange({
                                    target: {
                                        name: "localidad_servicio",
                                        value: label,
                                    },
                                })
                            }
                            selectClassName="border-0 px-3 py-3 shadow"
                            className="grid-cols-1"
                            labels={{
                                provincia: "Provincia",
                                municipio: "Municipio",
                                localidad: "Localidad",
                            }}
                        />
                    </div>
                    <div className="mt-2 mb-4"></div>
                </div>
            </div>
        </>
    )
}

export default FormUser
