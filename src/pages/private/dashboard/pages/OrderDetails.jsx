import React from 'react'

const OrderDetails = () => {
    return (


        <div className="body-content px-8 py-8 bg-slate-100">
            <div className="flex justify-between mb-10">
                <div className="page-title">
                    <h3 className="mb-0 text-[28px]">Detalles de orden #19893507</h3>
                </div>
            </div>

            <div className="">
                <div className="flex items-center flex-wrap justify-between px-8 mb-6 bg-white rounded-t-md rounded-b-md shadow-xs py-6">
                    <div className="relative">
                        <h5 className="font-normal mb-0">ID de orden : #26BC663E</h5>
                        <p className="mb-0 text-tiny">Order creada : Agusto 26, 2023 10:30 AM</p>
                    </div>
                    <div className="flex sm:justify-end flex-wrap sm:space-x-6 mt-5 md:mt-0">
                        <div className="search-select mr-3 flex items-center space-x-3 ">
                            <span className="text-tiny inline-block leading-none -translate-y-[2px]">Cambiar estado : </span>
                            <select>
                                <option>Pendiente</option>
                                <option>Finalizados</option>
                                <option>Rechazado</option>
                                <option>Agendar</option>
                            </select>
                        </div>
                        <div className="product-add-btn flex ">
                            <a href="#" className="tp-btn ">Guardar</a>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
                        <h5>Detalles de usuario</h5>
                        <div className="relative overflow-x-auto ">
                            <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                                <tbody>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Nombre
                                        </td>
                                        <td className="py-3 whitespace-nowrap ">
                                            <a href="#" className="flex items-center justify-end space-x-5 text-end text-heading text-hover-primary">
                                             {/*    <img className="w-10 h-10 rounded-full" src="" alt="" /> */}
                                             <svg   stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" className="w-9 h-9 text-gray-300" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"></path></svg>
                                                <span className="font-medium ">Toledo Consultora</span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Correo
                                        </td> 
                                        <td className="py-3 text-end">
                                            <a href="mailto:support@mail.com">info.cuidafy@gmail.com</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Numero
                                        </td>
                                        <td className="py-3 text-end">
                                            <a href="tel:3764331313">+54 3764331313</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Ver perfil
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
                        <h5>Detalles de orden</h5>

                        <div className="relative overflow-x-auto ">
                            <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                                <tbody>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Fecha
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-end">
                                            04/05/2023
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Hora
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-end">
                                            8:00 am
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Metodo de pago
                                        </td>
                                        <td className="py-3 text-end">
                                            Mercado Pago <img className="w-[40px] h-auto" src="assets/img/icons/visa.svg" alt="" />
                                        </td>
                                    </tr>
                              
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
                        <h5>Direccion de servicio</h5>

                        <div className="relative overflow-x-auto ">
                            <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                                <tbody>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[40%]">
                                            Casa
                                        </td>
                                        <td className="py-3 text-end">
                                           Cra 99 bis 14-61
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[40%]">
                                            Adicional
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-end">
                                            pueblo nuevo 2
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[40%]">
                                            Ciudad
                                        </td>
                                        <td className="py-3 text-end">
                                            Bogota
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
                        <h5>Detalles de profesional</h5>
                        <div className="relative overflow-x-auto ">
                            <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                                <tbody>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Nombre
                                        </td>
                                        <td className="py-3 whitespace-nowrap ">
                                            <a href="#" className="flex items-center justify-end space-x-5 text-end text-heading text-hover-primary">
                                             {/*    <img className="w-10 h-10 rounded-full" src="" alt="" /> */}
                                             <svg   stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" className="w-9 h-9 text-gray-300" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"></path></svg>
                                                <span className="font-medium ">Toledo Consultora</span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Correo
                                        </td>
                                        <td className="py-3 text-end">
                                            <a href="mailto:support@mail.com">info.cuidafy@gmail.com</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Numero
                                        </td>
                                        <td className="py-3 text-end">
                                            <a href="tel:3764331313">+54 3764331313</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Ver perfil
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
                        <h5>Detalles de factura</h5>
                        <div className="relative overflow-x-auto ">
                            <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                                <tbody>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Nro de factura
                                        </td>
                                        <td className="py-3 whitespace-nowrap ">
                                            <a href="#" className="flex items-center justify-end space-x-5 text-end text-heading text-hover-primary">
                                             {/*    <img className="w-10 h-10 rounded-full" src="" alt="" /> */}
                                            
                                                <span className="font-medium ">Toledo Consultora</span>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Estado
                                        </td>
                                        <td className="py-3 text-end">
                                            <a href="mailto:support@mail.com">info.cuidafy@gmail.com</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Numero
                                        </td>
                                        <td className="py-3 text-end">
                                            <a href="tel:3764331313">+54 3764331313</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Ver perfil
                                        </td>
                                
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
                        <h5>Detalles de Liquidacion</h5>
                        <div className="relative overflow-x-auto ">
                            <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                                <tbody>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Nro de Liquidacion
                                        </td>
                                        <td className="py-3 text-end ">
                                            #23423423423
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Estado
                                        </td>
                                        <td className="py-3 text-end">
                                            Liquidado
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                        <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                            Otra 
                                        </td>
                                        <td className="py-3 text-end">
                                    Descuento
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 2xl:col-span-8">
                        <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-8">
                            <div className="relative overflow-x-auto  mx-8">
                                <table className="w-[975px] md:w-full text-base text-left text-gray-500">

                                    <thead className="bg-white">
                                        <tr className="border-b border-gray6 text-tiny">
                                            <th scope="col" className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold">
                                                Producto
                                            </th>
                                            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
                                                Precio
                                            </th>
                                            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
                                                Cantidad
                                            </th>
                                            <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-8 py-5 whitespace-nowrap">
                                                <a href="#" className="flex items-center space-x-5">
                                                    <img className="w-[40px] h-[40px] rounded-md" src="assets/img/product/prodcut-1.jpg" alt="" />
                                                    <span className="font-medium text-heading text-hover-primary transition">Peinado</span>
                                                </a>
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                $171.00
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                37
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                $1200.33
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-8 py-5 whitespace-nowrap">
                                                <a href="#" className="flex items-center space-x-5">
                                                    <img className="w-[40px] h-[40px] rounded-md" src="assets/img/product/prodcut-2.jpg" alt="" />
                                                    <span className="font-medium text-heading text-hover-primary transition">Peinado</span>
                                                </a>
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                $15.00
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                10
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                $15.00
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-8 py-5 whitespace-nowrap">
                                                <a href="#" className="flex items-center space-x-5">
                                                    <img className="w-[40px] h-[40px] rounded-md" src="assets/img/product/prodcut-3.jpg" alt="" />
                                                    <span className="font-medium text-heading text-hover-primary transition">Peinado</span>
                                                </a>
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                $145.00
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                20
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                $2500.00
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 2xl:col-span-4">
                        <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-8 px-8">
                            <h5>Precio de orden</h5>
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-base text-left text-gray-500">
                                    <tbody>

                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-3 py-3 pt-6 font-normal text-[#55585B] text-start">
                                                Subtotal
                                            </td>
                                            <td className="px-3 py-3 pt-6 font-normal text-[#55585B] text-end">
                                                $1237.00
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-3 py-3 font-normal text-[#55585B] text-start">
                                                Descuento por cupon:
                                            </td>
                                            <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                                                $49.55
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-3 py-3 font-normal text-[#55585B] text-start">
                                                Ganancia Cuidafy: % 65
                                            </td>
                                            <td className="px-3 py-3 text-[#55585B] text-end text-lg font-semibold">
                                                $1310.55
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-3 py-3 font-normal text-[#55585B] text-start">
                                                Ganancia Profesional: % 20
                                            </td>
                                            <td className="px-3 py-3 text-[#55585B] text-end text-lg font-semibold">
                                                $1310.55
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                                            <td className="pr-3 py-3 font-normal text-[#55585B] text-start">
                                                Precio total:
                                            </td>
                                            <td className="px-3 py-3 text-[#55585B] text-end text-lg font-semibold">
                                                $1310.55
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails