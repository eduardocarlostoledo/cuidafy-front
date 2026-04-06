import React from 'react'

const MethodPay = ({}) => {
    return (
        <>
            <h6 className="text-blueGray-400 text-sm mt-4 mb-6 font-bold uppercase">
                Formas de pago
            </h6>

            <div className="container  grid grid-cols-2  gap-8">

                <div className="rounded bg-white p-4" >

                    <h4 className="font-bold mb-2">Link de Pago</h4>

                    <p>La generación de enlaces de pago permite enviar un enlace al cliente para que realice el pago correspondiente. Una vez que se ha efectuado el pago, el cliente puede programar sus citas, ya que el pago ha sido aprobado.</p>

                    <button
                        onClick={generarPreferencias}
                        className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                    >
                        <p className="text-sm font-medium leading-none text-white">
                            Generar Link de Pago
                        </p>
                    </button>
                </div>

                <div className="rounded bg-white p-4" >

                    <h4 className="font-bold mb-2">Pago Externo</h4>

                    <p>Al utilizar este método de pago externo, se deben actualizar los campos correspondientes al pago en la tabla de facturación al confirmar el pago. Sin embargo, se permitirá agendar una cita con la profesional antes de realizar el pago.</p>

                    <button
                        onClick={(e) => setMetodoExterno(!metodoexterno)}
                        className="mt-4 p-3 bg-primary hover:bg-bgHover focus:bg-bgHover  rounded focus:outline-none"
                    >
                        <p className="text-sm font-medium leading-none text-white">
                            Agendar Profesional
                        </p>
                    </button>
                </div>

            </div>
        </>
    )
}

export default MethodPay