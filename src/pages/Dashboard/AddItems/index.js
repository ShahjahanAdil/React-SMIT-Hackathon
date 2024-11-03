import React, { useState } from 'react'
import AdminHeader from '../../../components/AdminHeader'
import Topbar from '../../../components/TopBar'
import { FiUploadCloud } from 'react-icons/fi'
import { HiPlus } from 'react-icons/hi2'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { firestore, storage } from '../../../config/firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

const initialState = { title: '', brand: '', category: '', price: '', description: '' }
const randomID = () => Math.random().toString(36).slice(6)

export default function AddItems() {

    const [state, setState] = useState(initialState)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleOnChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSetFile = e => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
        } else {
            window.toastify('Please select a valid image file', 'error');
        }
    }

    const handleAddItem = () => {
        const { title, brand, category, price, description } = state

        if (!title || !brand || !category || !price || !description) {
            return window.toastify('Please fill all fields!', 'warning')
        }

        if (!file) {
            return window.toastify('Please select an image!', 'warning')
        }

        try {
            setLoading(true)

            const itemID = randomID()
            const imageFileName = itemID + '_' + file.name

            const storageRef = ref(storage, `itemsImages/${imageFileName}`);
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

                        const itemDoc = doc(firestore, 'items', itemID);
                        await setDoc(itemDoc, {
                            itemID,
                            title,
                            brand,
                            category,
                            price,
                            description,
                            imageFileName,
                            itemImage: downloadURL,
                            dateCreated: Timestamp.now().toDate()
                        }, { merge: true });

                        window.toastify('Successfully added item!', 'success');
                    } catch (error) {
                        console.error('Error updating user:', error);
                        window.toastify('Something went wrong!', 'error');
                    } finally {
                        setState(initialState)
                        setFile(null)
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

    return (
        <>
            <Topbar title={'Admin'} />

            <main>
                <div className="admin-container">
                    <AdminHeader />

                    <p className='text-center mb-4 users-heading'>ADD ITEM</p>

                    <div className="add-item-container">
                        <div className="add-item-left">
                            <input type="file" name="file" id="file" onChange={handleSetFile} />
                            <div className="file-upload">
                                <FiUploadCloud id='upload-icon' />
                                {!file ? <p>Drag and drop or click to upload image</p> : <p>Selected {file.name}</p>}
                            </div>
                        </div>
                        <div className="add-item-right">
                            <div>
                                <label htmlFor="title">Title:</label>
                                <input type="text" name="title" id="title" value={state?.title} placeholder='Enter title of item' onChange={handleOnChange} />
                            </div>
                            <div>
                                <label htmlFor="brand">Brand:</label>
                                <input type="text" name="brand" id="brand" value={state?.brand} placeholder='Enter brand name of item (kfc, mcdonald, etc.)' onChange={handleOnChange} />
                            </div>
                            <div>
                                <label htmlFor="category">Category:</label>
                                <input type="text" name="category" id="category" value={state?.category} placeholder='Enter category of item (burger, pizza, etc.)' onChange={handleOnChange} />
                            </div>
                            <div>
                                <label htmlFor="price">Price:</label>
                                <input type="text" name="price" id="price" value={state?.price} placeholder='Enter price in PKR' onChange={handleOnChange} />
                            </div>
                            <div>
                                <label htmlFor="description">Description:</label>
                                <textarea name="description" id="description" value={state?.description} placeholder='Enter detailed description of item for SEO' onChange={handleOnChange}></textarea>
                            </div>

                            <button className='gap-1' onClick={handleAddItem} disabled={loading}>
                                {loading ? 'Adding...' : 'Add Item'} <HiPlus display={`${loading ? 'none' : 'block'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}