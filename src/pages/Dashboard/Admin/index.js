import React from 'react'
import Topbar from '../../../components/TopBar'
import AdminHeader from '../../../components/AdminHeader'

export default function Admin() {
    return (
        <>
            <Topbar title={'Admin'} />
            <main>
                <div className="admin-container">
                    <AdminHeader />
                </div>
            </main>
        </>
    )
}