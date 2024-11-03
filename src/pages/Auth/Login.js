import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, firestore } from '../../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthContext } from '../../contexts/AuthContext'
import googleSvg from '../../assets/images/google.svg'

const initialState = { email: '', password: '' }

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

export default function Login() {

    const { dispatch } = useAuthContext()
    const [state, setState] = useState(initialState)
    const [isloading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()

        let { email, password } = state

        if (!window.isEmail(email)) { return window.toastify("Please enter a valid email address", "error") }

        setIsLoading(true)

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                const userData = userDoc.data()

                window.toastify('Login successfull!', 'success')

                dispatch({ type: 'SET_LOGGED_IN', payload: { user: userData } })
                navigate('/')
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/invalid-credential":
                        window.toastify("Invalid email or password!", "error"); break;
                    default:
                        window.toastify("Something went wrong while signing in!", "error"); break;
                }
            })
            .finally(() => {
                setIsLoading(false)
            });
    }

    const handleGoogleLogin = () => {
        setIsLoading(true)
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                const user = result.user;
                await setDoc(doc(firestore, "users", user.uid), {
                    uid: user.uid,
                    fullname: user.displayName,
                    email: user.email,
                    profilePic: user.photoURL,
                    roles: ['user']
                })

                window.toastify('Login successful!', 'success');
                setIsLoading(false)
                navigate('/')
            }).catch((error) => {
                const errorMessage = error.message;
                console.log('Google Login Error => ', errorMessage);
                window.toastify('Something went wrong', "error");
                setIsLoading(false)
            });
    }

    if (isloading) {
        return <Loader />
    }

    return (
        <div className='auth-page'>
            <div className="auth-box">
                <h3 className='text-center mb-3'>Login</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">EMAIL:</label>
                        <input type="text" name="email" id="email" placeholder='Enter your email' value={state.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="password">PASSWORD:</label>
                        <input type="password" name="password" id="password" placeholder='Enter your password' value={state.password} onChange={handleChange} />
                    </div>
                    <p className='fp-btn'><Link to='/auth/forgot-password' className='auth-link'>Forgot Password?</Link></p>
                    <div>
                        <input type="submit" name="submit" id="submit" className='reg-btn mt-3' value='LOGIN' />
                    </div>
                    <p className='text-center'>OR</p>
                    <div>
                        <div>
                            <button className="google-btn my-3" onClick={handleGoogleLogin}><img src={googleSvg} alt="google" /> <span>LOGIN WITH GOOGLE</span></button>
                        </div>
                    </div>
                    <p className='mb-2'>Don't have an account? <Link to='/auth/register' className='auth-link'>Register Now</Link></p>
                </form>
            </div>
        </div>
    )
}