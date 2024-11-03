import React from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

export default function PrivateRoute({ Component, allowedRoles }) {

    const { user, isAuthenticated } = useAuthContext()

    if (!isAuthenticated) return <Navigate to='/auth/login' />

    if (user?.roles?.find(role => allowedRoles.includes(role))) return <Component />

    return <>
        <main>
            <h1 className='text-center mt-5'>You don't have permission to access this page.</h1>
            <div className='text-center mt-5'>
                <Link
                    to='/'
                    style={{ padding: '8px 20px', borderRadius: '50px', backgroundColor: '#2c7565', color: '#efefef', textDecoration: 'none' }}
                >
                    <ArrowLeftOutlined /> GO BACK
                </Link>
            </div>
        </main>
    </>
}