import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {

    const { user } = useSelector((state) => ({ ...state.auth }));

    return (
        user ? <Outlet /> : <Navigate to="/servicio" replace={true} />
    )
}

export default AuthGuard