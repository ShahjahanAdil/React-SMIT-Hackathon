import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { useAuthContext } from '../AuthContext'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { firestore } from '../../config/firebase'
import Loader from '../../components/Loader'

const CartContext = createContext()

const initialState = { cart: [] }

const cartReducer = (state, { type, userCart, newItem, delItemID, itemID }) => {
    switch (type) {
        case 'ADD_ITEM':
            const existingItemIndex = state.cart.findIndex(item => item.itemID === newItem.itemID)
            if (existingItemIndex !== -1) {
                const updatedCart = state.cart.map((item, i) =>
                    existingItemIndex === i ? { ...item, quantity: item.quantity + 1 } : item
                )
                return { cart: updatedCart }
            }
            else {
                return { cart: [...state.cart, newItem] }
            }
        case 'INCREMENT_ITEM':
            return {
                cart: state.cart.map((item) =>
                    item.itemID === itemID ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
        case 'DECREMENT_ITEM':
            return {
                cart: state.cart.map((item) =>
                    item.itemID === itemID && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
                )
            }
        case 'DELETE_ITEM':
            return { cart: state.cart.filter(item => item.itemID !== delItemID) }
        case 'SET_CART':
            return { cart: userCart }
        default:
            return state
    }
}

export function CartContextProvider({ children }) {

    const [state, cartDispatch] = useReducer(cartReducer, initialState)
    const { user } = useAuthContext()
    const [cartLength, setCartLength] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchUserCart = async () => {
            setLoading(true)
            try {
                const userEmail = user?.email;
                if (!userEmail) return

                const querySnapshot = await getDocs(collection(firestore, `userCart_${userEmail}`))
                let userCartArray = querySnapshot.docs.map((doc) => doc.data())
                cartDispatch({ type: 'SET_CART', userCart: userCartArray })
            }
            catch (err) {
                console.error('Error fetching userCart', err);
            }
            finally {
                setLoading(false)
            }
        }

        if (user?.email) {
            fetchUserCart()
        }
        else {
            state.cart = []
        }
    }, [user?.email])

    useEffect(() => {
        const updateCartInFirestore = async () => {
            try {
                const userEmail = user?.email;
                if (!userEmail) return;

                await Promise.all(state.cart.map(item =>
                    setDoc(doc(firestore, `userCart_${userEmail}`, item.itemID), item)
                ))
            } catch (error) {
                console.error('Error updating cart in Firestore:', error)
            }
        }

        if (user?.email) {
            updateCartInFirestore()
        }
    }, [state.cart, user?.email])

    useEffect(() => {
        setCartLength(state.cart.length)
    }, [user?.email, state.cart])

    if (loading) {
        return <>
            <Loader />
        </>;
    }

    return (
        <CartContext.Provider value={{ cart: state.cart, cartDispatch, cartLength }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => useContext(CartContext)