import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../config/firebase'

const initialState = { email: "" }

export default function ForgotPassword() {

    const [state, setState] = useState(initialState)
    const [isloading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()

        const { email } = state

        setIsLoading(true)

        sendPasswordResetEmail(auth, email)
            .then(() => {
                window.toastify('Password reset email sent successfully. Check your mail box!', 'success')
                navigate('/auth/login')
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error(errorCode);
                window.toastify('Something went wrong!', 'error')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div className='auth-page'>
            <div className="auth-box">
                <h3 className='text-center mb-3'>Reset Password</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">EMAIL:</label>
                        <input type="text" name="email" id="email" placeholder='Enter your email' value={state.email} onChange={handleChange} />
                    </div>
                    <div>
                        <input type="submit" name="submit" id="submit" className='reg-btn mt-3' value={!isloading ? 'SEND PASSWORD' : 'SENDING...'} />
                    </div>
                </form>
            </div>
        </div>
    )
}