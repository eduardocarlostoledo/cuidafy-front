import React, { useEffect, useState } from 'react'

import { LazyLoadImage } from 'react-lazy-load-image-component'

import { useNavigate, Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { deleteError, forgotPassword } from '../redux/features/authSlice';

import ButtonSpinner from '../components/ButtonSpinner';

import { toast } from 'react-toastify';


const ForgotPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => ({ ...state.auth }));

    const [valueForm, setValueForm] = useState({ email: "" })

    const { email } = valueForm;

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

        if ([email].includes("")) {
            return toast.error("Correo electrónico requerido");
        }

        dispatch(forgotPassword({ email, toast }));

        setValueForm({ email: "" })

    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <LazyLoadImage effect='blur' width="150" height="80" alt="Logo fondo trasparente" src="https://www.calyaan.com.co/static/media/logo.7391fed19edfcfb85f3d.png" />
                </a>
                <div className="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Solicitar nueva contraseña
                    </h2>
                    <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Correo electrónico</label>
                            <input type="email" name="email" value={email} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Correo electrónico" required="" onChange={handleChange} />
                        </div>

                        {loading ? (
                            <ButtonSpinner />
                        ) :
                            <button type="submit" className="w-full block bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg
                            px-4 py-3 mt-6">Enviar instrucciones</button>
                        }

                    </form>
                </div>

                <div className="text-left mt-2">
                    <Link
                      to="/"
                      className="text-sm font-semibold text-gray-700 hover:text-bgHover focus:text-bgHover"
                    >
                      Volver al Inicio
                    </Link>
                  </div>

            </div>
        </section>
    )
}

export default ForgotPassword