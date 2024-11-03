import React, { useEffect, useState } from 'react'
import Topbar from '../../../components/TopBar'
import AdminHeader from '../../../components/AdminHeader'
import { Image, Table } from 'antd'
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import { UserOutlined } from '@ant-design/icons'
import { CiSearch } from 'react-icons/ci';

const columns = [
    {
        title: 'ID',
        dataIndex: 'uid',
        key: 'uid',
    },
    {
        title: 'Profile',
        dataIndex: 'profilePic',
        key: 'profilePic',
        render: (_, user) => (
            user.profilePic ? (
                <Image src={user.profilePic} id='user-profile-img' />
            ) : (
                <UserOutlined id='user-profile-outlined' />
            )
        ),
    },
    {
        title: 'Fullname',
        dataIndex: 'fullname',
        key: 'fullname',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Roles',
        dataIndex: 'roles',
        key: 'roles',
    },
];

export default function Users() {

    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersQuery = query(collection(firestore, "users"));
                const querySnapshot = await getDocs(usersQuery);
                let usersArray = querySnapshot.docs.map((doc, i) => ({ ...doc.data(), key: i + 1 }))
                setUsers(usersArray)
                setFilteredUsers(usersArray)
            }
            catch (err) {
                console.error(err)
            }
            finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleSearchSubmit = e => {
        e.preventDefault()

        if (!searchQuery) {
            setFilteredUsers(users)
        }
        else {
            const filteredUser = users.filter(user => user.uid === searchQuery)
            setFilteredUsers(filteredUser)
        }
    }

    return (
        <>
            <Topbar title='Admin' />
            <main>
                <div className="admin-container">
                    <AdminHeader />

                    <p className='text-center mb-4 users-heading'>USERS</p>

                    <div className='d-flex justify-content-end'>
                        <div className='search-bar user-search-bar mb-3'>
                            <form onSubmit={handleSearchSubmit}>
                                <input type="text" name="search" id="search" placeholder='Search user by uid' onChange={(e) => setSearchQuery(e.target.value)} />
                                <CiSearch className='search-icon' />
                            </form>
                        </div>
                    </div>

                    <Table dataSource={filteredUsers} columns={columns} loading={loading} scroll={{ x: 800 }} pagination={false} />
                </div>
            </main>
        </>
    )
}