import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const Auth = createContext()

const initialState = { isAuthenticated: false, user: {} }

const reducer = (state, { type, payload }) => {
    switch (type) {
        case 'SET_LOGGED_IN':
            return { isAuthenticated: true, user: payload.user }
        case 'SET_PROFILE':
            return { ...state, user: payload.user }
        case 'SET_LOGGED_OUT':
            return initialState
        default:
            return state
    }
}

export default function AuthContextProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const readProfile = useCallback(() => {
        onAuthStateChanged(auth, async (user) => {
            setLoading(true)
            if (user) {
                try {
                    const userDoc = await getDoc(doc(firestore, "users", user.uid));
                    const userData = userDoc.data()

                    dispatch({ type: 'SET_LOGGED_IN', payload: { user: userData } })
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    setLoading(false)
                }
            } else {
                dispatch({ type: 'SET_LOGGED_OUT' })
            }
            setLoading(false)
        });
    }, [])

    useEffect(() => {
        readProfile()
    }, [readProfile])

    const handleLogout = async () => {
        setLoading(true)
        await signOut(auth)
        dispatch({ type: 'SET_LOGGED_OUT' })
        navigate('/')

        window.toastify('Logged out successfully!', 'success')
        setLoading(false)
    }

    return (
        <Auth.Provider value={{ ...state, dispatch, loading, setLoading, handleLogout }}>
            {children}
        </Auth.Provider>
    )
}

export const useAuthContext = () => useContext(Auth)