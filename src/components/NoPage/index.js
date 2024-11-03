import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

export default function NoPage() {
    return (
        <main className='mt-5 pt-5'>
            <h1 className='text-center'>404 Error. No Such Page!</h1>
            <div className='text-center mt-5'>
                <Link
                    to='/'
                    style={{ padding: '8px 20px', borderRadius: '50px', backgroundColor: '#2c7565', color: '#efefef', textDecoration: 'none' }}
                >
                    <ArrowLeftOutlined /> GO TO HOME
                </Link>
            </div>
        </main>
    )
}