import React, { lazy, useEffect, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom';

import { confirmAccount, deleteError } from '../redux/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';

import bg3 from "../assets/bg-3-auth.jpg"
import { AiOutlineCheck } from "react-icons/ai"

const ConfirmAccount = () => {

    const { idtoken } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useSelector((state) => ({ ...state.auth }));

    useEffect(() => {
        dispatch(confirmAccount({ idtoken, navigate, toast }));
    }, []);

    useEffect(() => {
        error && toast.error(error);
        dispatch(deleteError())
    }, [error]);

    return (
        <>
            <div className="flex flex-col justify-center h-screen">
                <div className="rounded-lg shadow-md container flex flex-col px-6 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center ">
                    <div className="w-full lg:w-1/2 flex justify-center flex-col gap-8 items-center">
                        <div className="lg:max-w-lg">
                            <h1 className="text-3xl font-bold tracking-wide text-gray-800 lg:text-4xl">¡Felicidades, estás a un paso de confirmar tu cuenta!</h1>
                            <p className="mt-4 text-gray-600">Accederás a muchos beneficios para tu bienestar.</p>
                            <div className="grid gap-6 mt-8 sm:grid-cols-2">
                                <div className="flex items-center text-gray-800 -px-3">
                                    <AiOutlineCheck />
                                    <span className="mx-3">Más de 7 categorías </span>
                                </div>

                                <div className="flex items-center text-gray-800 -px-3">
                                    <AiOutlineCheck />

                                    <span className="mx-3">Más de 40 servicios</span>
                                </div>

                                <div className="flex items-center text-gray-800 -px-3">
                                    <AiOutlineCheck />

                                    <span className="mx-3">Reservas desde tu casa</span>
                                </div>

                                <div className="flex items-center text-gray-800 -px-3">
                                    <AiOutlineCheck />

                                    <span className="mx-3">Las mejores profesionales</span>
                                </div>
                            </div>
                            <div className='lg:w-1/3 md:w-1/2'>
                                {
                                    loading ?
                                        <Spinner />
                                        :
                                        <Link to="/" className="block text-center bg-primary hover:bg-bgHover focus:bg-bgHover text-white font-semibold rounded-lg
                                           px-4 py-3 mt-6">Iniciar sesión</Link>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-full lg:w-1/2">
                        <LazyLoadImage effect='blur' className="object-cover w-full h-full max-w-2xl rounded-md" src={bg3} alt="glasses photo" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmAccount