import React, { useEffect, useState } from 'react'
import Topbar from '../../../components/TopBar'
import { FiShoppingCart } from 'react-icons/fi'
import { FaMinus, FaPlus, FaTrashCan } from 'react-icons/fa6'
import { Modal } from 'antd'
import { LuDollarSign } from 'react-icons/lu'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { useCartContext } from '../../../contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { firestore } from '../../../config/firebase'
import { useAuthContext } from '../../../contexts/AuthContext'
import { GoListOrdered } from 'react-icons/go'

const generateOrderID = () => Math.random().toString(36).slice(5)

export default function Cart() {

    const { user } = useAuthContext()
    const { cart, cartDispatch } = useCartContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [orderLoading, setOrderLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.email) return
            setLoading(true)

            try {
                const ordersRef = collection(firestore, "orders")
                const q = query(ordersRef, where("email", "==", user.email))
                const querySnapshot = await getDocs(q)
                const fetchedOrders = querySnapshot.docs.map(doc => ({ ...doc.data() }))
                setOrders(fetchedOrders)
            } catch (error) {
                console.error("Error fetching orders: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user])

    console.log(orders);


    const delItem = (itemID) => {
        Modal.confirm({
            title: 'Are you sure, you want to remove this item from cart?',
            okText: 'Yes',
            okType: 'danger',
            onOk: async () => {
                try {
                    const userEmail = user?.email
                    if (!userEmail) return

                    await deleteDoc(doc(firestore, `userCart_${userEmail}`, itemID))
                    cartDispatch({ type: 'DELETE_ITEM', delItemID: itemID })
                    window.toastify('Item deleted successfully!', 'success')
                }
                catch (err) {
                    console.error('Cart item deleting error: ', err)
                    window.toastify('Something went wrong!', 'error')
                }
            }
        })
    }

    const handleIncrementItem = (itemID) => {
        cartDispatch({ type: 'INCREMENT_ITEM', itemID })
    }

    const handleDecrementItem = (itemID) => {
        cartDispatch({ type: 'DECREMENT_ITEM', itemID })
    }

    function totalItems() {
        return cart.reduce((itemsCount, item) => itemsCount + item.quantity, 0)
    }

    function totalPrice() {
        return cart.reduce((itemsPriceCount, item) => itemsPriceCount + item.quantity * item.price, 0)
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0
        }).format(price)
    }

    const handleBuyNow = async (item) => {
        setOrderLoading(true)

        const { uid, email } = user
        const { itemID, itemImage, title, price } = item
        const orderID = generateOrderID()

        try {
            await setDoc(doc(firestore, "orders", orderID), {
                uid,
                email,
                itemImage,
                title,
                price,
                orderID,
                orderStatus: 'prepairing'
            })

            await deleteDoc(doc(firestore, `userCart_${email}`, itemID))
            cartDispatch({ type: 'DELETE_ITEM', delItemID: itemID })

            const newOrder = { uid, email, itemImage, title, price, orderID, orderStatus: 'prepairing' }
            setOrders((prevOrders) => [...prevOrders, newOrder])

            window.toastify('Order placed successfully!', 'success')
        } catch (error) {
            console.error('Order placement error:', error)
            window.toastify('Failed to place order. Please try again!', 'error')
        } finally {
            setOrderLoading(false)
        }
    }

    return (
        <>
            <Topbar title={'Cart'} />

            <main>
                <div className="cart-container">
                    <div className="cart-items">
                        <p className='cart-heading'><span className='d-flex align-items-center gap-2'><FiShoppingCart /> SHOPPING CART</span></p>
                        <div className="cart-items-container">
                            {cart.length > 0 ?
                                (
                                    cart.map((item) => {
                                        return (
                                            <div className="cart-item" key={item.itemID}>
                                                <div className="cart-item-left">
                                                    <div className="cart-item-img">
                                                        <img src={item.itemImage} alt={item.title} id='cart-img' />
                                                    </div>
                                                    <div className="cart-item-content">
                                                        <p className='cart-item-title' onClick={() => navigate(`/product/${item.itemID}`)}>{item.title}</p>
                                                        <div>
                                                            <p><span className='d-flex align-items-center gap-2'><FaMinus className='quantity-icons' onClick={() => handleDecrementItem(item.itemID)} /> {item.quantity} <FaPlus className='quantity-icons' onClick={() => handleIncrementItem(item.itemID)} /></span></p>
                                                            <p><span style={{ fontWeight: 900 }}>Price:</span> {formatPrice(item.price)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="cart-item-right">
                                                    <FaTrashCan className='cart-trash' onClick={() => delItem(item.itemID)} />
                                                    <button className={`${orderLoading ? 'opacity-50' : ''}`} onClick={() => handleBuyNow(item)} disabled={orderLoading}><span className='d-flex align-items-center gap-1'>{!orderLoading ? 'Buy now' : 'Ordering...'}</span></button>
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                                :
                                <div className='text-center'>
                                    <p className='mb-4'>Your cart is empty.</p>
                                    <Link to='/products' className='continue-shopping-btn link text-white'>Continue Shopping <FiShoppingCart style={{ marginLeft: '5px' }} /></Link>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="checkout">
                        <p className='cart-heading'><span className='d-flex align-items-center gap-2'><LuDollarSign style={{ color: 'green' }} />GRAND TOTAL</span></p>
                        <div className="checkout-container">
                            <div className="checkout-content">
                                <p><span style={{ fontWeight: 900 }}>Total Quantity:</span> {totalItems()}</p>
                                <p><span style={{ fontWeight: 900 }}>Total Price:</span> {formatPrice(totalPrice())}</p>
                            </div>
                            <div className="checkout-button">
                                <button><span className='d-flex justify-content-center align-items-center gap-1' onClick={() => window.toastify('Teri okaat se baahir hai 😂', 'warning')}><HiOutlineShoppingBag /> Checkout</span></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='orders-container'>
                    <p className='orders-heading text-center'><GoListOrdered /> YOUR ORDERS</p>

                    <div class="table-responsive mt-4">
                        <table class="table order-table">
                            <tr>
                                <th>#</th>
                                <th>Order ID</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                            {orders.length > 0 ?
                                (orders.map((order, i) => {
                                    return (
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{order.orderID}</td>
                                            <td><img src={order.itemImage} alt={order.title} style={{width: '80px'}} /></td>
                                            <td>{order.title}</td>
                                            <td>{order.price}</td>
                                            <td style={{textTransform: 'capitalize'}}>{order.orderStatus}</td>
                                        </tr>
                                    )
                                })
                                ) :
                                <p className='text-center'>You have ordered nothing yet.</p>
                            }
                        </table>
                    </div>
                </div>
            </main >
        </>
    )
}