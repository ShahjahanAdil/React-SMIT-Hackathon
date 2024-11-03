import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Header from '../../components/Header'
import Products from './Products'
import Footer from '../../components/Footer'
import NoPage from '../../components/NoPage'
import ProductDetails from './ProductDetails'
import PrivateRoute from '../../components/PrivateRoute'
import Cart from './Cart'

export default function Frontend() {
    return (
        <>
            <Header />
            <Routes>
                <Route index element={<Home />} />
                <Route path='home' element={<Home />} />
                <Route path='products' element={<Products />} />
                <Route path='products/category/:selectedCategory' element={<Products />} />
                <Route path='products/brand/:selectedBrand' element={<Products />} />
                <Route path='product/:productID' element={<ProductDetails />} />
                <Route path='/cart/:userEmail' element={<PrivateRoute Component={Cart} allowedRoles={['admin', 'customer']} />} />
                <Route path='*' element={<NoPage />} />
            </Routes>
            <Footer />
        </>
    )
}