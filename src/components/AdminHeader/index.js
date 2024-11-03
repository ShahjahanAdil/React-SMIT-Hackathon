import React from 'react'
import { Link } from 'react-router-dom'
import { CgUserList } from 'react-icons/cg'
import { HiPlus } from 'react-icons/hi2'
import { CiShoppingBasket } from 'react-icons/ci'
import { GoListOrdered } from 'react-icons/go'

export default function AdminHeader() {
    return (
        <div className="admin-header mb-5">
            <Link to='/dashboard/admin-panel/users' className='link gap-1'><CgUserList /> Users</Link>
            <Link to='/dashboard/admin-panel/add-items' className='link gap-1'>Add Items <HiPlus /></Link>
            <Link to='/dashboard/admin-panel/items' className='link gap-1'><CiShoppingBasket /> Items</Link>
            <Link to='/dashboard/admin-panel/orders' className='link gap-1'><GoListOrdered /> Orders</Link>
        </div>
    )
}