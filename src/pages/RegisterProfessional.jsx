import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux';
import { deleteError, registerProfessional } from '../redux/features/authSlice';

import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ButtonSpinner from '../components/ButtonSpinner'

import bg4 from "../assets/bg-4-auth.jpg"
import swal from 'sweetalert';

const RegisterProfessional = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => ({ ...state.auth }));

    const [userForm, setUserForm] = useState({
        nombre: "",
        email: "",
        apellido: "",
        password: "",
        confirmpassword: "",
    });

    const { nombre, apellido, email, password, confirmpassword } = userForm;

    useEffect(() => {
        error && toast.error(error);
        dispatch(deleteError())
    }, [error]);

    const handleChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([nombre, apellido, email, password, confirmpassword].includes("")) {
            return toast.error("Todos los campos son obligatorios");
        }

        if (password !== confirmpassword) {
            return toast.error("Las contraseñas no coinciden");
        }

        if (password.length < 6) {
            return toast.error("La contraseña debe ser mayor a 6 caracteres");
        }

        dispatch(registerProfessional({ userForm, navigate, toast }));

        // Mostrar Sweet Alert en caso de éxito
        swal("Registro Exitoso", "Comunícate con el área comercial para confirmar tu cuenta", "success")
        .then(() => {
            history.push('/loginProfesional');
        });

    };

    return (
        <section className="bg-white">
            <div className="flex justify-center min-h-screen items-center">

                <div className="bg-primary hidden lg:block w-full h-screen lg:w-2/5">
                    <LazyLoadImage width="100%" height="100%" effect='blur' src={bg4} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5 flex-col">

                    <div className='flex flex-col justify-center items-center'>
                        <LazyLoadImage effect='blur' width="150" height="80" alt="Logo fondo trasparente" 
                            //src="https://www.calyaan.com.co/static/media/logo.7391fed19edfcfb85f3d.png" 
                            />
                            
                        <h1 className="text-xl md:text-2xl font-bold leading-tight mt-4 text-center">Registro para profesional</h1>
                    </div>

                    <form className="mt-6" onSubmit={handleSubmit}>
                        <div className=' flex justify-between gap-4'>
                            <div>
                                <label className=" text-gray-700">Nombres</label>
                                <input type="text" name="nombre" onChange={handleChange} value={nombre} placeholder="Nombres" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover focus:bg-white focus:outline-none" autoFocus autoComplete="true" required />
                            </div>

                            <div>
                                <label className=" text-gray-700">Apellidos</label>
                                <input type="text" name="apellido" onChange={handleChange} value={apellido} placeholder="Apellidos" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover focus:bg-white focus:outline-none" autoFocus autoComplete="true" required />
                            </div>

                        </div>

                        <div className='mt-4'>
                            <label className="block text-gray-700">Dirección de correo electrónico</label>
                            <input type="email" name="email" onChange={handleChange} value={email} placeholder="Correo electrónico" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover focus:bg-white focus:outline-none" autoFocus autoComplete="true" required />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">Contraseña</label>
                            <input type="password" name="password" onChange={handleChange} value={password} placeholder="••••••••" minLength="6" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover
                  focus:bg-white focus:outline-none" required />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">Confirmar contraseña</label>
                            <input type="password" name="confirmpassword" onChange={handleChange} value={confirmpassword} placeholder="••••••••" minLength="6" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-bgHover
                  focus:bg-white focus:outline-none" required />
                        </div>

                        {loading ? (
                            <ButtonSpinner />
                        ) :
                            <button type="submit" className="w-full block bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg
                            px-4 py-3 mt-6">Regístrame</button>
                        }

                    </form>

                </div>
            </div>
        </section>
    )
}

export default RegisterProfessional