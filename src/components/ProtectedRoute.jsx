import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { isTokenExpired } from '../utils/isTokenExpired';
import { logout } from '../features/authSlice';

const ProtectedRoute = ({ children }) => {

    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    if (!token || isTokenExpired(token)) {
        dispatch(logout());
        return <Navigate to="/login" replace />;
    }

    return children;
};


export default ProtectedRoute