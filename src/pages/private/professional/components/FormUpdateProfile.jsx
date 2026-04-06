import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ButtonSpinner from "../../../../components/ButtonSpinner";
import Spinner from "../../../../components/Spinner";
import clienteAxios from "../../../../config/axios";
import { localidadesLaborales } from "../../../../data";
import { especialidadesHabilitadas } from "../../../../data";
import { deleteError } from "../../../../redux/features/authSlice";
import { updateProfile } from "../../../../redux/features/professionalSlice";

const FormUpdateProfile = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state.auth }));
  const { loadingProfessional, errorProfessional } = useSelector((state) => ({
    ...state.professional,
  }));

  const [especialidadesForm, setEspecialidadForm] = useState([]);
  const [localidadForm, setLocalidadForm] = useState([]);

  const [especialidades, setEspecialidades] = useState([]);

  const [valueForm, setValueForm] = useState({
    areasLaborales: "",
    especialidad: "",
    descripcion: "",
  });

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const { especialidad, descripcion, areasLaborales } = valueForm;

  useEffect(() => {
    const getEspecialidades = async () => {
      try {
        setLoadingImage(true);
        let { data } = await clienteAxios.get(`/api/products`);

        setEspecialidades(data);
      } catch (err) {
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getEspecialidades();
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoadingImage(true);
        let { data } = await clienteAxios.get(`/api/profesional/perfil`);

        const { descripcion, especialidad, localidadesLaborales } = data.profesional;

        setLoadingImage(false);
        setValueForm({ ...valueForm, descripcion });
        setEspecialidadForm(especialidad);
        setLocalidadForm(localidadesLaborales);

        if (data?.img) {
          setImage(data.img);
        }
      } catch (err) {
        let error = err.response.data.msg
          ? err.response.data.msg
          : err.response && "Estamos presentando problemas internos";
        return toast.error(error);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    if (errorProfessional) {
      toast.error(errorProfessional);
      dispatch(deleteError());
    }
  }, [errorProfessional, dispatch]);

  const handleChange = (e) => {
    setValueForm({
      ...valueForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeImage = async (e) => {
    try {
      setLoadingImage(true);
      const formData = new FormData();
      formData.append("upload_preset", `${e.target.files[0].name}`);
      formData.append("file", e.target.files[0], "form-data");

      let { data } = await clienteAxios.post(`/api/uploads/file`, formData);

      setLoadingImage(false);
      setImage(data.imageURL);
      toast.success(data.msg);
    } catch (err) {
      let error = err.response.data.msg
        ? err.response.data.msg
        : err.response && "Estamos presentando problemas internos";
      return toast.error(error);
    }
  };

  const handleChangeEspecialidades = (e) => {
    if (!especialidadesForm.includes(e.target.value) && e.target.value !== "") {
      setEspecialidadForm([...especialidadesForm, e.target.value]);
    }

    setValueForm({ ...valueForm, especialidad: e.target.value });
  };

  const eliminarEspecialidad = (especialidad) => {
    setEspecialidadForm(
      especialidadesForm.filter(
        (especialidadState) => especialidadState !== especialidad
      )
    );
  };

  const handleChangeLocalidad = (e) => {

    if (!localidadForm.includes(e.target.value) && e.target.value !== "") {
      setLocalidadForm([...localidadForm, e.target.value]);
    }

    setValueForm({ ...valueForm, areasLaborales: e.target.value });
  };

  const eliminarLocalidad = (localidad) => {
    setLocalidadForm(
      localidadForm.filter((localidadState) => localidadState !== localidad)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([descripcion].includes("")) {
      return toast.error("Es obligatorio agregar una descripción a tu perfil");
    } else if (especialidadesForm.length <= 0) {
      return toast.error("Se requiere mínimo una especialidad para tu perfil");
    }

    const dataP = {
      descripcion,
      especialidades: especialidadesForm,
      localidades: localidadForm,
    };

    dispatch(updateProfile({ dataP, toast }));
  };

  return (
    <>
      <label className="mb-2">Foto de perfil</label>
      {loadingImage ? (
        <div className="p-4 flex justify-center">
          <Spinner />
        </div>
      ) : !image ? (
        <>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center mt-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 rounded">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="text-xs text-gray-500 ">
                SVG, PNG o JPG (MAX. 2MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleChangeImage}
            />
          </label>
        </>
      ) : (
        <div className="flex gap-6">
          <LazyLoadImage
            className="rounded mt-2"
            effect="blur"
            width="240"
            height="240"
            alt="Logo fondo trasparente"
            src={image}
          />
          <div className="mt-1 flex  items-center ">
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              onClick={(e) => setImage(null)}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-2">
        <label htmlFor="descripcion">Descripción profesional</label>
        <div className="w-full my-2 p-2 border border-gray-200 rounded-lg bg-gray-200 ">
          <div className="p-2 bg-gray-200 rounded-b-lg ">
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={handleChange}
              name="descripcion"
              rows="8"
              className="block w-full px-0 text-sm outline-none text-gray-800 bg-gray-200 border-0    focus:ring-0  "
              placeholder="Escribe un poco sobre ti..."
            ></textarea>
          </div>
        </div>

        <label htmlFor="especialidad">Especialidades</label>
        <div className="mt-2 mb-4">
          <select
            id="especialidad"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none block w-full p-3"
            value={especialidad}
            onChange={handleChangeEspecialidades}
            name="especialidad"
          >
            <option value="">Especialidades</option>
            {especialidadesHabilitadas.map((especialidad, index) => (
              <option key={index} value={especialidad}>
                {especialidad}
              </option>
            ))}
          </select>
        </div>

        {especialidadesForm?.length > 0 && (
          <div className="my-4 flex flex-wrap gap-4">
            {especialidadesForm.map((especialidad, index) => (
              <p
                key={index}
                className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
              >
                {especialidad}
                <AiFillCloseCircle
                  className="ml-2"
                  onClick={() => eliminarEspecialidad(especialidad)}
                />
              </p>
            ))}
          </div>
        )}

        <label htmlFor="areasLaborales">Zonas Laborales</label>
        <div className="mt-2 mb-4">
          <select
            id="areasLaborales"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none block w-full p-3"
            value={areasLaborales}
            onChange={handleChangeLocalidad}
            name="areasLaborales"
          >
            <option value="">Localidades</option>
            {localidadesLaborales?.map((localidad, index) => (
              <option key={index} value={localidad}>
                {localidad}
              </option>
            ))}
          </select>
        </div>

        {localidadForm?.length > 0 && (
          <div className="my-4 flex flex-wrap gap-4">
            {localidadForm.map((localidad, index) => (
              <div
                key={index}
                className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500"
              >
                {localidad}
                <AiFillCloseCircle
                  className="ml-2"
                  onClick={() => eliminarLocalidad(localidad)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="md:col-span-5 text-right">
          <div className="inline-flex items-end">
            {loadingProfessional ? (
              <ButtonSpinner />
            ) : (
              <button className="bg-primary hover:bg-bgHover text-white font-bold py-3 px-6 rounded">
                Guardar cambios
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default FormUpdateProfile;

// import React, { useEffect, useState } from "react";
// import { AiFillCloseCircle } from "react-icons/ai";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import ButtonSpinner from "../../../../components/ButtonSpinner";
// import Spinner from "../../../../components/Spinner";
// import clienteAxios from "../../../../config/axios";
// import { localidadesLaborales } from "../../../../data";
// import { especialidadesHabilitadas } from "../../../../data";
// import { deleteError } from "../../../../redux/features/authSlice";
// import { updateProfile } from "../../../../redux/features/professionalSlice";

// const FormUpdateProfile = () => {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => ({ ...state.auth }));
//   const { loadingProfessional, errorProfessional } = useSelector((state) => ({
//     ...state.professional,
//   }));

//   const [especialidadesForm, setEspecialidadForm] = useState([]);
//   const [localidadForm, setLocalidadForm] = useState([]);

//   const [especialidades,setEspecialidades] = useState([])

//   const [valueForm, setValueForm] = useState({
//     areasLaborales: "",
//     especialidad: "",
//     descripcion: "",
//   });

//   const [image, setImage] = useState(null);
//   const [loadingImage, setLoadingImage] = useState(false);

//   const { especialidad, descripcion, areasLaborales } = valueForm;

//   useEffect(()=>{
//     const getEspecialidades = async () => {
//       try {
//         setLoadingImage(true);
//         let { data } = await clienteAxios.get(`/api/products`);

//         setEspecialidades(data)
//       } catch (err) {
//         let error = err.response.data.msg
//           ? err.response.data.msg
//           : err.response && "Estamos presentando problemas internos";
//         return toast.error(error);
//       }
//     };
//     getEspecialidades();
//   },[])

//   useEffect(() => {
//     const getProfile = async () => {
//       try {
//         setLoadingImage(true);
//         let { data } = await clienteAxios.get(`/api/profesional/perfil`);

//         const { descripcion, especialidad, areasLaborales } =
//           data.profesional;

//         setLoadingImage(false);
//         setValueForm({ ...valueForm, descripcion });
//         setEspecialidadForm(especialidad);
//         setLocalidadForm(areasLaborales);

//         if (data?.img) {
//           setImage(data.img);
//         }
//       } catch (err) {
//         let error = err.response.data.msg
//           ? err.response.data.msg
//           : err.response && "Estamos presentando problemas internos";
//         return toast.error(error);
//       }
//     };
//     getProfile();
//   }, []);

//   useEffect(() => {
//     errorProfessional && toast.error(errorProfessional);
//     dispatch(deleteError());
//   }, [errorProfessional]);

//   const handleChange = (e) => {
//     setValueForm({
//       ...valueForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleChangeImage = async (e) => {
//     try {
//       setLoadingImage(true);
//       const formData = new FormData();
//       formData.append("upload_preset", `${e.target.files[0].name}`);
//       formData.append("file", e.target.files[0], "form-data");

//       let { data } = await clienteAxios.post(`/api/uploads/file`, formData);

//       setLoadingImage(false);
//       setImage(data.imageURL);
//       toast.success(data.msg);
//     } catch (err) {
//       let error = err.response.data.msg
//         ? err.response.data.msg
//         : err.response && "Estamos presentando problemas internos";
//       return toast.error(error);
//     }
//   };

//   const handleChangeEspecialidades = (e) => {

//     if (!especialidadesForm.includes(e.target.value) && e.target.value !== "") {
//       setEspecialidadForm([...especialidadesForm, e.target.value]);
//     }

//     setValueForm({ ...valueForm, especialidad: e.target.value });
//   };

//   const eliminarEspecialidad = (especialidad) => {
//     setEspecialidadForm(
//       especialidadesForm.filter(
//         (especialidadState) => especialidadState !== especialidad
//       )
//     );
//   };

//   const handleChangeLocalidad = (e) => {
//     console.log ("e.target.value", e.target.value)
//     if (!localidadForm.includes(e.target.value) && e.target.value !== "") {
//       setLocalidadForm([...localidadForm, e.target.value]);
//     }

//     setValueForm({ ...valueForm, areasLaborales: e.target.value });
//   };

//   const eliminarLocalidad = (localidad) => {
//     setLocalidadForm(
//       localidadForm.filter((localidadState) => localidadState !== localidad)
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if ([descripcion].includes("")) {
//       return toast.error("Es obligatorio agregar una descripción a tu perfil");
//     } else if (especialidadesForm.length <= 0) {
//       return toast.error("Se requiere mínimo una especialidad para tu perfil");
//     }

//     const dataP = {
//       descripcion,
//       especialidades: especialidadesForm,
//       localidades: localidadForm,
//     };

//     dispatch(updateProfile({ dataP, toast }));
//   };

//   return (
//     <>
//       <label className="mb-2">Foto de perfil</label>
//       {loadingImage ? (
//         <div className="p-4 flex justify-center">
//           <Spinner />
//         </div>
//       ) : !image ? (
//         <>
//           <label
//             htmlFor="dropzone-file"
//             className="flex flex-col items-center justify-center mt-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
//           >
//             <div className="flex flex-col items-center justify-center pt-5 pb-6 rounded">
//               <svg
//                 aria-hidden="true"
//                 className="w-10 h-10 mb-3 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//   strokeLinecap="round"
//   strokeLinejoin="round"
//   strokeWidth="2"
//   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
// ></path>

//                 {/* <path
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   stroke-width="2"
//                   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                 ></path> */}
//               </svg>
//               <p className="text-xs text-gray-500 ">
//                 SVG, PNG o JPG (MAX. 2MB)
//               </p>
//             </div>
//             <input
//               id="dropzone-file"
//               type="file"
//               className="hidden"
//               onChange={handleChangeImage}
//             />
//           </label>
//         </>
//       ) : (
//         <div className="flex gap-6">
//           <LazyLoadImage
//             className="rounded mt-2"
//             effect="blur"
//             width="240"
//             height="240"
//             alt="Logo fondo trasparente"
//             src={image}
//           />
//           <div className="mt-1 flex  items-center ">
//             <button
//               type="button"
//               className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
//               onClick={(e) => setImage(null)}
//             >
//               Eliminar
//             </button>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="mt-2">
//         <label htmlFor="descripcion">Descripción profesional</label>
//         <div className="w-full my-2 p-2 border border-gray-200 rounded-lg bg-gray-200 ">
//           <div className="p-2 bg-gray-200 rounded-b-lg ">
//             <textarea
//               id="descripcion"
//               value={descripcion}
//               onChange={handleChange}
//               name="descripcion"
//               rows="8"
//               className="block w-full px-0 text-sm outline-none text-gray-800 bg-gray-200 border-0    focus:ring-0 "
//               placeholder="Escribe un poco sobre ti..."
//             ></textarea>
//           </div>
//         </div>

//         <label htmlFor="especialidad">Especialidades</label>
//         <div className="mt-2 mb-4">
//           <select
//             id="especialidad"
//             className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none block w-full p-3"
//             value={especialidad}
//             onChange={handleChangeEspecialidades}
//             name="especialidad"
//           >
//             <option value="">Especialidades</option>
//             {especialidadesHabilitadas.map((especialidad, index) => (
//   <option key={index} value={especialidad}>
//     {especialidad}
//   </option>
// ))}

//             {/* {especialidades?.map((especialidad, index) => (
//               <option key={index} value={especialidad.nombre}>
//                 {especialidad.nombre}
//               </option>
//             ))} */}

//             {/* {especialidadesHabilitadas
//   ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
//   .map((especialidad, index) => (
//     <option key={index} value={especialidad.nombre}>
//       {especialidad.nombre}
//     </option>
//   ))} */}

//           </select>
//         </div>

//         {especialidadesForm?.length > 0 && (
//           <div className="my-4 flex flex-wrap gap-4">
//             {especialidadesForm.map((especialidad, index) => (
//               <p
//                 key={index}
//                 className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
//               >
//                 {especialidad}
//                 <AiFillCloseCircle
//                   className="ml-2"
//                   onClick={() => eliminarEspecialidad(especialidad)}
//                 />
//               </p>
//             ))}
//           </div>
//         )}

//         {/* <label htmlFor="areasLaborales">Zonas Laborales</label>
//         <div className="mt-2 mb-4">
//           <select
//             id="areasLaborales"
//             className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none block w-full p-3"
//             value={areasLaborales}
//             onChange={handleChangeLocalidad}
//             name="areasLaborales"
//           >
//             <option value="">Localidades</option>
//             {localidades?.map((localidad, index) => (
//               <option key={index} value={localidad.split(" ")[1]}>
//                 {localidad}
//               </option>
//             ))}
//           </select>
//         </div>

//         {localidadForm?.length > 0 && (
//           <div className="my-4 flex flex-wrap gap-4">
//             {localidadForm.map((localidad, index) => (
//               <p
//                 key={index}
//                 className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500 "
//               >
//                 {localidad}
//                 <AiFillCloseCircle
//                   className="ml-2"
//                   onClick={() => eliminarLocalidad(localidad)}
//                 />
//               </p>
//             ))}
//           </div>
//         )} */}
//         <label htmlFor="areasLaborales">Zonas Laborales</label>
// <div className="mt-2 mb-4">
//   <select
//     id="areasLaborales"
//     className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-200 focus:border-bgHover focus:bg-white focus:outline-none block w-full p-3"
//     value={areasLaborales}
//     onChange={handleChangeLocalidad}
//     name="areasLaborales"
//   >
//     <option value="">Localidades</option>
//     {localidadesLaborales.map((areasLaborales, index) => (
//       <option key={index} value={areasLaborales}>
//         {areasLaborales}
//       </option>
//     ))}
//   </select>
// </div>

// {localidadForm?.length > 0 && (
//   <div className="my-4 flex flex-wrap gap-4">
//     {localidadForm.map((localidad, index) => (
//       <div
//         key={index}
//         className="text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer bg-gray-100 text-gray-800 border-gray-500"
//       >
//         {localidad}
//         <AiFillCloseCircle
//           className="ml-2"
//           onClick={() => eliminarLocalidad(localidad)}
//         />
//       </div>
//     ))}
//   </div>
// )}

//         <div className="md:col-span-5 text-right">
//           <div className="inline-flex items-end">
//             {loadingProfessional ? (
//               <ButtonSpinner />
//             ) : (
//               <button className="bg-primary hover:bg-bgHover text-white font-bold py-3 px-6 rounded">
//                 Guardar cambios
//               </button>
//             )}
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default FormUpdateProfile;
