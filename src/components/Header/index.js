import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { useAuthContext } from '../../contexts/AuthContext'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { IoHomeOutline } from 'react-icons/io5'
import { BiSupport } from 'react-icons/bi'
import { RiAdminLine, RiUserAddLine } from 'react-icons/ri'
import { MdInfoOutline } from 'react-icons/md'
import { GoSignOut } from 'react-icons/go'
import { FiLogIn } from 'react-icons/fi'
import { TbShoppingBag } from 'react-icons/tb'

export default function Header() {

    const { user, isAuthenticated, handleLogout } = useAuthContext()
    const [isOpen, setIsOpen] = useState(false)
    const [showAvatarMenu, setShowAvatarMenu] = useState(false)
    const navigate = useNavigate()

    const handleScroll = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header>
            <nav>
                <div className="header-container">
                    <div className="header d-flex">
                        <div className="h-left">
                            <h4>MASTER</h4>
                        </div>
                        <div className="h-right d-flex">
                            <ul className='d-flex align-items-center'>
                                <li><Link to='/' className='header-link link d-flex align-items-center gap-1'><IoHomeOutline /> Home</Link></li>
                                <li><Link to='/products' className='header-link link d-flex align-items-center gap-1'><TbShoppingBag /> Products</Link></li>
                                <li><Link to='/' onClick={() => handleScroll('contact')} className='header-link link d-flex align-items-center gap-1'><BiSupport /> Contact</Link></li>
                                <li><Link to='/' onClick={() => handleScroll('about')} className='header-link link d-flex align-items-center gap-1'><MdInfoOutline /> About</Link></li>
                                {user?.roles?.includes('admin') &&
                                    <li><Link to='/dashboard/admin-panel' className='header-link link d-flex align-items-center gap-1'><RiAdminLine /> Admin</Link></li>}
                                {!isAuthenticated ?
                                    <>
                                        <li><Link to='/auth/register' className='header-link link auth-btns d-flex align-items-center gap-1'><RiUserAddLine /> SignUp</Link></li>
                                        <li><Link to='/auth/login' className='header-link link auth-btns d-flex align-items-center gap-1'>Login <FiLogIn /></Link></li>
                                    </> :
                                    <li className='profile-container'>
                                        <Avatar src={user?.profilePic} icon={!user?.profilePic && <UserOutlined />} className='profile-avatar' onClick={() => setShowAvatarMenu(!showAvatarMenu)} />
                                        <div className="profile-dropdown" style={{ opacity: showAvatarMenu ? '1' : '0', transform: showAvatarMenu ? 'translateY(0%)' : 'translateY(20%)' }} >
                                            <button className="profile-btn gap-1" onClick={() => { navigate('/dashboard/profile'); setShowAvatarMenu(!showAvatarMenu) }}><UserOutlined /> Profile</button>
                                            <button className="logout-btn gap-1" onClick={handleLogout}><GoSignOut /> Logout</button>
                                        </div>
                                    </li>
                                }
                                <li><MenuOutlined className='menu-icon' onClick={() => setIsOpen(!isOpen)} /></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="header-small" style={{ transform: `translateX(${!isOpen ? '-100%' : '0%'})` }}>
                    <div className='cross'>
                        <CloseOutlined className='cross-small' onClick={() => setIsOpen(!isOpen)} />
                    </div>
                    <div className="header-small-links">
                        <ul>
                            <li onClick={() => setIsOpen(!isOpen)}><Link to='/' className='header-small-link link d-flex align-items-center gap-1'><IoHomeOutline /> Home</Link></li>
                            <li onClick={() => setIsOpen(!isOpen)}><Link to='/products' className='header-small-link link d-flex align-items-center gap-1'><TbShoppingBag /> Products</Link></li>
                            <li onClick={() => setIsOpen(!isOpen)}><Link className='header-small-link link d-flex align-items-center gap-1'><BiSupport /> Contact</Link></li>
                            <li onClick={() => setIsOpen(!isOpen)}><Link className='header-small-link link d-flex align-items-center gap-1'><MdInfoOutline /> About</Link></li>
                            {user?.roles?.includes('admin') &&
                                <li onClick={() => setIsOpen(!isOpen)}><Link to='/dashboard/admin-panel' className='header-small-link link d-flex align-items-center gap-1'><RiAdminLine /> Admin</Link></li>}
                            {!isAuthenticated ?
                                <>
                                    <li><Link to='/auth/register' className='header-small-link link' onClick={() => setIsOpen(!isOpen)}><RiUserAddLine /> SignUp</Link></li>
                                    <li><Link to='/auth/login' className='header-small-link link' onClick={() => setIsOpen(!isOpen)}><FiLogIn /> Login</Link></li>
                                </> :
                                <li onClick={() => setIsOpen(!isOpen)}><Link className='header-small-link link d-flex align-items-center gap-1' onClick={handleLogout}><GoSignOut /> Logout</Link></li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}