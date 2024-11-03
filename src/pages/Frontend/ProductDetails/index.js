import React, { useEffect, useState } from 'react'
import Topbar from '../../../components/TopBar'
import { FiShoppingCart } from 'react-icons/fi'
import { ImCoinDollar } from 'react-icons/im'
import { FaCheckCircle } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Loader from '../../../components/Loader'
import { firestore } from '../../../config/firebase'
import { doc, getDoc } from 'firebase/firestore'
import CartButton from '../../../components/CartButton'
import { useCartContext } from '../../../contexts/CartContext'
import { useAuthContext } from '../../../contexts/AuthContext'

export default function ProductDetails() {

    const { productID } = useParams()
    const { user } = useAuthContext()
    const { cartDispatch } = useCartContext()
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const productDoc = await getDoc(doc(firestore, "items", productID));
                if (productDoc.exists()) {
                    setProduct(productDoc.data())
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct()
    }, [productID])

    const handleAddToCart = () => {
        if (!user?.email) return window.toastify('Please login to continue shopping!', 'info')

        const { itemID, itemImage, title, price, brand } = product

        const newCartItem = {
            itemID, itemImage, title, price, brand,
            quantity: 1
        }

        cartDispatch({ type: 'ADD_ITEM', newItem: newCartItem })
        window.toastify('Item succesfully added to your cart!', 'success')
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Topbar title={'Product'} />

            <main>
                <div className="product-details-container">
                    <div className="product-detail-img">
                        <img src={product.itemImage} alt={product.title} />
                    </div>
                    <div className="product-detail-content">
                        <h3>{product.title}</h3>
                        <p><span style={{ color: '#2c7565', fontWeight: '900' }}>Brand:</span> <span className='brand-tag'>{product.brand}</span></p>
                        <p><span style={{ color: '#2c7565', fontWeight: '900' }}>Price:</span> {formatCurrency(product.price)}</p>
                        <button className='add-to-cart-btn d-flex justify-content-center align-items-center gap-2' onClick={handleAddToCart}>Add to cart <FiShoppingCart /></button>
                        <ul>
                            <li><span className='d-flex align-items-center gap-1'>100% authenticated product <FaCheckCircle style={{ color: 'green' }} /></span></li>
                            <li><span className='d-flex align-items-center gap-1'>Best price guaranteed <ImCoinDollar style={{ color: 'green' }} /></span></li>
                        </ul>
                    </div>
                </div>
            </main>

            <CartButton />
        </>
    )
}