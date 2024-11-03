import React from 'react'
import { Badge } from 'antd'
import { FiShoppingCart } from 'react-icons/fi'
import { useCartContext } from '../../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'

export default function CartButton() {

    const { user } = useAuthContext()
    const { cartLength } = useCartContext()
    const navigate = useNavigate()

    return (
        <Badge count={cartLength} offset={[0, 10]} className='cart-btn' showZero>
            <FiShoppingCart className='cart-btn-icon' onClick={() => navigate(`/cart/${user.email}`)} />
        </Badge>
    )
}