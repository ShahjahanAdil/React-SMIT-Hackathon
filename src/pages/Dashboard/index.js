import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from '../../components/PrivateRoute'
import Admin from './Admin'
import Header from '../../components/Header'
import Profile from './Profile'
import Users from './Users'
import NoPage from '../../components/NoPage'
import Footer from '../../components/Footer'
import AddItems from './AddItems'
import Items from './Items'
import Orders from './Orders'

export default function Dashboard() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='admin-panel' element={<PrivateRoute Component={Admin} allowedRoles={['admin']} />} />
                <Route path='admin-panel/users' element={<PrivateRoute Component={Users} allowedRoles={['admin']} />} />
                <Route path='admin-panel/add-items' element={<PrivateRoute Component={AddItems} allowedRoles={['admin']} />} />
                <Route path='admin-panel/items' element={<PrivateRoute Component={Items} allowedRoles={['admin']} />} />
                <Route path='admin-panel/orders' element={<PrivateRoute Component={Orders} allowedRoles={['admin']} />} />
                <Route path='profile' element={<PrivateRoute Component={Profile} allowedRoles={['admin', 'customer']} />} />
                <Route path='*' element={<NoPage />} />
            </Routes>
            <Footer />
        </>
    )
}