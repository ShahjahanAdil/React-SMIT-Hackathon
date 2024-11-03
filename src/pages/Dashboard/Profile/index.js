import React, { useState } from 'react'
import Topbar from '../../../components/TopBar'
import { useAuthContext } from '../../../contexts/AuthContext'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Popconfirm } from 'antd'
import Loader from '../../../components/Loader'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { auth, firestore, storage } from '../../../config/firebase'
import { deleteUser, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { CgTrash } from 'react-icons/cg'
import { MdUpdate } from 'react-icons/md'

const randomID = () => Math.random().toString(36).slice(2)

export default function Profile() {

    const { user, dispatch } = useAuthContext()
    const [editingUser, setEditingUser] = useState({ ...user })
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = e => setEditingUser(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleEdit = async () => {
        if (!editingUser.fullname) {
            window.toastify('Full name is required', 'error');
            return;
        }

        if (!file) {
            updateUserWithoutPic()
        }
        else {
            updateUserWithPic()
        }
    }

    const updateUserWithoutPic = async () => {
        if (editingUser) {
            setLoading(true)
            try {
                const userDoc = doc(firestore, 'users', editingUser.uid);
                await setDoc(userDoc, { fullname: editingUser.fullname }, { merge: true });
                await updateProfile(auth.currentUser, {
                    displayName: editingUser.fullname
                })

                dispatch({ type: 'SET_PROFILE', payload: { user: editingUser } })

                setLoading(false)
                window.toastify('Profile updated successfully', 'success');
            } catch (error) {
                console.error('Error updating user:', error);
                setLoading(false)
                window.toastify('Error updating user', 'error');
            }
        }
    }

    const updateUserWithPic = async () => {
        if (editingUser) {

            setLoading(true)

            try {
                const storageRef = ref(storage, `images/${randomID()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        console.error(error)
                        window.toastify('Something went wrong!', 'error')
                        setLoading(false)
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                            const userDoc = doc(firestore, 'users', editingUser.uid);
                            await setDoc(userDoc, {
                                fullname: editingUser.fullname,
                                profilePic: downloadURL
                            }, { merge: true });
                            await updateProfile(auth.currentUser, {
                                displayName: editingUser.fullname,
                                photoURL: downloadURL
                            })

                            dispatch({ type: 'SET_PROFILE', payload: { user: { ...editingUser, profilePic: downloadURL } } })
                            window.toastify('Profile updated successfully', 'success');
                        } catch (error) {
                            console.error('Error updating user:', error);
                            window.toastify('Error updating user', 'error');
                        } finally {
                            setLoading(false);
                        }
                    }
                );
            }
            catch (error) {
                console.error('Unexpected error:', error);
                setLoading(false);
                window.toastify('Unexpected error occurred', 'error');
            }
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const currentUser = auth.currentUser
            await deleteDoc(doc(firestore, "users", user.uid))
            await deleteUser(currentUser)
            setLoading(false)
            window.toastify('User deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            setLoading(false)
            window.toastify('Error deleting user', 'error');
        }
    }

    const handleSetFile = e => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
        } else {
            window.toastify('Please select a valid image file', 'error');
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Topbar title={'Profile'} />
            <main className='container pf-container'>
                <div className="pf-box">
                    <div>
                        <div className="pf-img">
                            <Avatar src={user?.profilePic} icon={!user?.profilePic && <UserOutlined className='pf-avatar-icon' />} className='pf-avatar' />
                            <p style={{ fontSize: '1rem' }} className='my-2'>Update Profile</p>
                            <input type="file" name="file" id="file" style={{ margin: '0px' }} className='mt-2' accept='image/*' onChange={handleSetFile} />
                        </div>
                        <div>
                            <label htmlFor="fullname">FULL NAME:</label>
                            <input type="text" name="fullname" id="fullname" value={editingUser.fullname || ''} placeholder='Enter your fullname' onChange={handleChange} />
                        </div>
                    </div>
                    <div className='pf-btns'>
                        <Popconfirm
                            title="Are you sure, you want to delete this user?"
                            onConfirm={() => handleDelete()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <button className='del-btn gap-1'><CgTrash /> Delete Account</button>
                        </Popconfirm>
                        <button className='update-pf-btn gap-1' onClick={handleEdit}><MdUpdate /> Update Profile</button>
                    </div>
                </div>
            </main>
        </>
    )
}