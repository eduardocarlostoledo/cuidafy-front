import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddressCard from "../../components/AddressCard";
import ModalAddress from "../../components/ModalAddress";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const [modalAddressForm, setModalAddressForm] = useState(false);
  const [addressEdit, setAddressEdit] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [noHayDire, setNoHayDire] = useState(false);
  const navigate = useNavigate();

  const handleToggleModalAddress = () => {
    setModalAddressForm(!modalAddressForm);
    setAddressEdit(false); // Close the edit modal as well, if open
  };

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const { data } = await clienteAxios.get("api/usuarios/direcciones");
        // console.log("getAddresses", data);

        setAddresses([...data]);
      } catch (err) {
        let error =
          err.response?.data.msg || "Estamos presentando problemas internos";
        toast.error(error);
      }
    };

    getAddresses();
    if (addresses.length <= 0) {
      setNoHayDire(true);
    }
  }, []);

  const crearDireccion = async (direccion) => {
    try {
      const { data } = await clienteAxios.post(
        "api/usuarios/direcciones",
        direccion
      );
      // console.log("crearDireccion", data);

      setAddresses((prevState) => [...prevState, data.direccion]);
      if (noHayDire) {
        setNoHayDire(false);
        swal({
          title:
            "¡Excelente! Completaste tu perfil!",
          icon: "success",
          type: "success",
          customClass: {
            title: "text-center", // Clase CSS para centrar el título
          },
          buttons: {
            continueEditing: {
              text: "Continuar editando",
              value: "continue",
            },
            goToService: {
              text: "Volver al hub de cuidado",
              value: "goToService",
            },
          },
        }).then((value) => {
          if (value === "goToService") {
            navigate("/encontrar-cuidado");
          }
        });
      } else {
        toast.success("Dirección creada correctamente");
      }

      setModalAddressForm(false);
    } catch (err) {
      console.log(err);
      let error =
        err.response?.data.msg || "Estamos presentando problemas internos";
      toast.error(error);
    }
  };

  const actualizarDireccion = async (direccion) => {
    try {
      const { data } = await clienteAxios.put(
        `api/usuarios/direcciones/${direccion._id}`,
        direccion
      );

      setAddresses((prevState) => {
        const updatedAddresses = prevState.map((address) => {
          if (address._id === direccion._id) {
            return data.direccion;
          }
          return address;
        });

        return updatedAddresses;
      });

      toast.success("Dirección actualizada correctamente");
      setAddressEdit(false);
    } catch (err) {
      console.log(err);
      let error =
        err.response?.data.msg || "Estamos presentando problemas internos";
      toast.error(error);
    }
  };

  const eliminarDireccion = async (id) => {
    try {
      await clienteAxios.delete(`api/usuarios/direccion/${id}`);

      setAddresses((prevState) =>
        prevState.filter((direccionState) => direccionState._id !== id)
      );

      toast.success("Dirección eliminada correctamente");
    } catch (err) {
      let error =
        err.response?.data.msg || "Estamos presentando problemas internos";
      toast.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-5">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="mb-4">
              <p className="font-medium text-xl mb-2">Direcciones</p>
              <p className="text-gray-600 leading-loose">
                Puedes tener un máximo de 5 direcciones registradas.
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="flex justify-between mb-4 flex-col gap-4 md:items-center md:flex-row">
                <h5 className="text-xl font-medium leading-none mb-2">
                  Últimas direcciones registradas
                </h5>
                <span
                  className="text-sm font-medium text-primary hover:underline cursor-pointer"
                  onClick={handleToggleModalAddress}
                >
                  Agregar
                </span>
              </div>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                  {addresses.length <= 0 ? (
                    <p>No tienes registrada ninguna dirección</p>
                  ) : (
                    addresses.map((address, index) => (
                      <AddressCard
                        addressState={address}
                        key={address._id}
                        id={address._id}
                        order={index}
                        address={address.direccion}
                        location={address.localidad}
                        otherinfo={address.info}
                        name={address.nombre}
                        eliminarDireccion={eliminarDireccion}
                        setModalAddressForm={setModalAddressForm}
                        setAddressEdit={setAddressEdit}
                      />
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(modalAddressForm || addressEdit) && (
        <ModalAddress
          handleModalAddress={handleToggleModalAddress}
          crearDireccion={crearDireccion}
          actualizarDireccion={actualizarDireccion}
          addressEdit={addressEdit}
        />
      )}
    </>
  );
};

export default Address;

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import AddressCard from "../../components/AddressCard";
// import ModalAddress from "../../components/ModalAddress";
// import clienteAxios from "../../config/axios";

// const Address = () => {
//   const [modalAddressForm, setModalAddressForm] = useState(false);
//   const [addressEdit, setAddressEdit] = useState(false);
//   const [arrayAddress, setArrayAddress] = useState([]);

//   const handleModalAddress = () => {
//     setModalAddressForm(!modalAddressForm);
//   };

//   useEffect(() => {
//     const getDirecciones = async () => {
//       try {
//         let { data } = await clienteAxios.get("api/usuarios/direcciones");
//         console.log("getDirecciones", data);

//         setArrayAddress([...data]);
//       } catch (err) {
//         let error = err.response.data.msg
//           ? err.response.data.msg
//           : err.response && "Estamos presentando problemas internos";
//         return toast.error(error);
//       }
//     };
//     getDirecciones();
//   }, []);

//   const crearDireccion = async (direccion) => {
//     try {
//       const { data } = await clienteAxios.post(
//         `api/usuarios/direcciones`,
//         direccion
//       );
//       console.log("crearDireccion", data);

//       setArrayAddress([...arrayAddress, data.direccion]);

//       toast.success("Dirección creada correctamente");

//       setModalAddressForm(false);
//     } catch (err) {
//       console.log(err);
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   const actualizarDireccion = async (direccion) => {
//     try {
//       const { data } = await clienteAxios.put(
//         `api/usuarios/direcciones/${direccion._id}`,
//         {
//           direccion,
//         }
//       );

//       const todos = [...arrayAddress];
//       const index = todos.findIndex((todo) => todo._id === direccion._id);
//       todos[index] = data.direccion;

//       setArrayAddress([...todos]);

//       toast.success("Dirección actualizada correctamente");
//       setAddressEdit(false);
//     } catch (err) {
//       console.log(err);
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   const eliminarDireccion = async (id) => {
//     try {
//       await clienteAxios.delete(`api/usuarios/direccion/${id}`);

//       setArrayAddress(
//         arrayAddress.filter((direccionState) => direccionState._id !== id)
//       );

//       toast.success("Dirección eliminada correctamente");
//     } catch (err) {
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center justify-center mt-5">
//         <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//           <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
//             <div className="mb-4">
//               <p className="font-medium text-xl mb-2">Direcciones</p>
//               <p className="text-gray-600 leading-loose">
//                 Puedes tener un máximo de 5 direcciones registradas.
//               </p>
//             </div>

//             <div className="lg:col-span-2">
//               <div className="flex justify-between mb-4 flex-col gap-4 md:items-center md:flex-row">
//                 <h5 className="text-xl font-medium leading-none mb-2">
//                   Últimas direcciones registradas
//                 </h5>
//                 <span
//                   className="text-sm font-medium text-primary hover:underline cursor-pointer"
//                   onClick={handleModalAddress}
//                 >
//                   Agregar
//                 </span>
//               </div>
//               <div className="flow-root">
//                 <ul role="list" className="divide-y divide-gray-200">
//                   {arrayAddress.length <= 0 ? (
//                     <p>No tienes registrado ninguna dirección</p>
//                   ) : (
//                     arrayAddress?.map((addressState, index) => (
//                       <AddressCard
//                         addressState={addressState}
//                         key={addressState._id}
//                         id={addressState._id}
//                         order={index}
//                         address={addressState.direccion}
//                         location={addressState.localidad}
//                         otherinfo={addressState.info}
//                         name={addressState.nombre}
//                         eliminarDireccion={eliminarDireccion}
//                         setModalAddressForm={setModalAddressForm}
//                         setAddressEdit={setAddressEdit}
//                       />
//                     ))
//                   )}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalAddressForm && !addressEdit && (
//         <ModalAddress
//           handleModalAddress={handleModalAddress}
//           crearDireccion={crearDireccion}
//           actualizarDireccion={actualizarDireccion}
//         />
//       )}

//       {modalAddressForm && addressEdit && (
//         <ModalAddress
//           handleModalAddress={handleModalAddress}
//           crearDireccion={crearDireccion}
//           actualizarDireccion={actualizarDireccion}
//           addressEdit={addressEdit}
//         />
//       )}
//     </>
//   );
// };

// export default Address;
