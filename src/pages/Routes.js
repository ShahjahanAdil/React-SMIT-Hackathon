import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import { useAuthContext } from '../contexts/AuthContext'
import PrivateRoute from '../components/PrivateRoute'
import Dashboard from './Dashboard'

export default function Index() {

    const { isAuthenticated } = useAuthContext()

    return (
        <Routes>
            <Route path='/*' element={<Frontend />} />
            <Route path='auth/*' element={!isAuthenticated ? <Auth /> : <Navigate to='/' />} />
            <Route path='dashboard/*' element={<PrivateRoute Component={Dashboard} allowedRoles={['admin', 'customer']} />} />
        </Routes>
    )
}