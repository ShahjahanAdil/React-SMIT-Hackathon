import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, firestore } from '../../config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import googleSvg from '../../assets/images/google.svg'

const initialState = { fullname: '', email: '', password: '' }

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

export default function Register() {

    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()

        let { fullname, email, password } = state

        fullname = fullname.trim()

        if (fullname.length < 3) { return window.toastify("Fullname must be atleast 3 characters", "error") }
        if (!window.isEmail(email)) { return window.toastify("Please enter a valid email address", "error") }
        if (password.length < 6) { return window.toastify("Password must be atleast 6 characters", "error") }

        setLoading(true)

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                await updateProfile(auth.currentUser, {
                    displayName: fullname
                })

                await setDoc(doc(firestore, "users", user.uid), {
                    uid: user.uid,
                    fullname: fullname,
                    email: email,
                    password: password,
                    roles: ['customer']
                })
                window.toastify('User successfully registered!', 'success')
                navigate('/')
            })
            .catch((error) => {
                console.log('error', error);
                switch (error.code) {
                    case "auth/email-already-in-use":
                        window.toastify("Email address already in use", "error"); break;
                    default:
                        window.toastify("Something went wrong while registering a new user!", "error"); break;
                }
            })
            .finally(() => {
                setLoading(false)
            });
    }

    const handleGoogleLogin = () => {
        setLoading(true)
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
                setLoading(false)
                navigate('/')
            }).catch((error) => {
                const errorMessage = error.message;
                console.log('Google SignUp Error => ', errorMessage);
                window.toastify('Something went wrong', "error");
                setLoading(false)
            });
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className='auth-page'>
            <div className="auth-box">
                <h3 className='text-center mb-3'>Signup</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fullname">FULL NAME:</label>
                        <input type="text" name="fullname" id="fullname" placeholder='Enter your full name' value={state.fullname} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="email">EMAIL:</label>
                        <input type="text" name="email" id="email" placeholder='Enter your email' value={state.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="password">PASSWORD:</label>
                        <input type="password" name="password" id="password" placeholder='Enter your password' value={state.password} onChange={handleChange} />
                    </div>
                    <div>
                        <input type="submit" name="submit" id="submit" className='reg-btn mt-3' value='SIGNUP' />
                    </div>
                    <p className='text-center'>OR</p>
                    <div>
                        <div>
                            <button className="google-btn my-3" onClick={handleGoogleLogin}><img src={googleSvg} alt="google" /> <span>SIGNUP WITH GOOGLE</span></button>
                        </div>
                    </div>
                    <p className='mb-2'>Already have an account? <Link to='/auth/login' className='auth-link'>Login Now</Link></p>
                </form>
            </div>
        </div>
    )
}