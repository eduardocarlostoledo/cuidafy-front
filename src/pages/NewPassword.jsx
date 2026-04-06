import React, { useEffect, useState } from 'react'

import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import PageErrors from '../helpers/Components/PageErrors'
import clienteAxios from '../config/axios'
import ButtonSpinner from '../components/ButtonSpinner'
import { toast } from 'react-toastify'
import { deleteError, newPassword } from '../redux/features/authSlice'

const NewPassword = () => {

    const { idtoken } = useParams()

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [NotAuthorized, setNotAuthorized] = useState(false)
    const [valueForm, setValueForm] = useState({
        password: "", confirmpassword: ""
    })

    const { loading, error } = useSelector((state) => ({ ...state.auth }));

    const { password, confirmpassword } = valueForm;

    useEffect(() => {
        const confirmToken = async () => {
            try {
                await clienteAxios.get(`usuarios/olvide-password/${idtoken}`);
            } catch (error) {
                if (error.response.status === 403) {
                    setNotAuthorized(true)
                }
            }
        }
        confirmToken()

    }, [idtoken])

    useEffect(() => {
        error && toast.error(error);
        dispatch(deleteError())
    }, [error]);

    const handleChange = (e) => {
        setValueForm({
            ...valueForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([password, confirmpassword].includes("")) {
            return toast.error("Todos los campos son obligatorios");
        }

        if (password !== confirmpassword) {
            return toast.error("Las contraseñas no coinciden");
        }

        if (password.length < 6) {
            return toast.error("La contraseña debe ser mayor a 6 caracteres");
        }

        let values = { password, token: idtoken }

        dispatch(newPassword({ values, navigate, toast }));

        setValueForm({ password: "", confirmpassword: "" })

    };

    return (
        NotAuthorized ?
            <PageErrors title={"Acción no autorizada"} message={"Si creee que se trata de un error comunicarse con nosotros"} />
            :
            <>
                <section className="bg-gray-50">
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                            <LazyLoadImage effect='blur' width="150" height="80" alt="Logo fondo trasparente" 
                            //src="https://www.calyaan.com.co/static/media/logo.7391fed19edfcfb85f3d.png" 
                            />
                        </a>
                        <div className="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8">
                            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Nueva Contraseña
                            </h2>
                            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Nueva contraseña</label>
                                    <input type="password" name="password" value={password} onChange={handleChange} id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirmar contraseña</label>
                                    <input type="password" name="confirmpassword" value={confirmpassword} onChange={handleChange} id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                                </div>
                                {
                                    loading ? <ButtonSpinner /> :
                                        <button type="submit" className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Guardar nueva contraseña</button>
                                }

                            </form>
                        </div>
                    </div>
                </section>
            </>
    )
}

export default NewPassword