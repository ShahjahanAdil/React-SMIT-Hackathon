import React, { useEffect, useState } from 'react';
import Topbar from '../../../components/TopBar';
import AdminHeader from '../../../components/AdminHeader';
import { Image, Popconfirm, Table, Modal, Input, Form, Button } from 'antd';
import { CiSearch } from 'react-icons/ci';
import { CgTrash } from 'react-icons/cg';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../../config/firebase';
import { BsArrowDown } from 'react-icons/bs';
import { deleteObject, ref } from 'firebase/storage';
import { MdEdit } from 'react-icons/md';

const columns = (handleDelete, handleEdit) => [
    {
        title: '#',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Image',
        dataIndex: 'itemImage',
        key: 'itemImage',
        render: (_, item) => (
            <Image src={item.itemImage} id='item-img' style={{ width: '50px' }} />
        ),
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, item) => (
            <>
                <MdEdit
                    style={{ color: 'blue', fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} 
                    onClick={() => handleEdit(item)} 
                />
                <Popconfirm
                    title="Are you sure you want to delete this item?"
                    onConfirm={() => handleDelete(item)}
                    okText="Yes"
                    cancelText="No"
                >
                    <CgTrash style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                </Popconfirm>
            </>
        ),
    },
];

export default function Items() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [itemsLimit, setItemsLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const itemsCollection = collection(firestore, "items");
                const q = query(itemsCollection, orderBy('dateCreated', 'desc'));

                const querySnapshot = await getDocs(q);
                let itemsArray = querySnapshot.docs.map((doc, i) => ({ ...doc.data(), key: i + 1 }));

                setItems(itemsArray);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const filtered = items.filter(item => item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredItems(filtered.slice(0, itemsLimit));
    }, [items, itemsLimit, searchQuery]);

    const handleDelete = async (item) => {
        const { itemID, imageFileName } = item;

        try {
            await deleteDoc(doc(firestore, "items", itemID));
            await deleteObject(ref(storage, `itemsImages/${imageFileName}`));
            const updatedItems = items.filter(item => item.itemID !== itemID).map((item, i) => ({ ...item, key: i + 1 }));
            setItems(updatedItems);
            setFilteredItems(updatedItems.slice(0, itemsLimit));

            window.toastify('Successfully deleted Item!', 'success');
        }
        catch (error) {
            console.error(error);
            window.toastify('Something went wrong!', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        form.setFieldsValue({
            title: item.title,
            category: item.category,
            price: item.price,
            description: item.description,
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async (values) => {
        const { itemID } = editingItem;
        try {
            await updateDoc(doc(firestore, "items", itemID), values);
            const updatedItems = items.map((item) => item.itemID === itemID ? { ...item, ...values } : item);
            setItems(updatedItems);
            setFilteredItems(updatedItems.slice(0, itemsLimit));
            setIsModalOpen(false);
            setEditingItem(null);
            window.toastify('Item updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating item:', error);
            window.toastify('Failed to update item!', 'error');
        }
    };

    return (
        <>
            <Topbar title={'Admin'} />
            <main>
                <div className="admin-container">
                    <AdminHeader />
                    <p className='text-center mb-4 users-heading'>Items</p>
                    <div className='d-flex justify-content-end'>
                        <div className='search-bar user-search-bar mb-3'>
                            <form onSubmit={e => e.preventDefault()}>
                                <Input 
                                    placeholder='Search item'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    prefix={<CiSearch className='search-icon' />}
                                />
                            </form>
                        </div>
                    </div>

                    <Table dataSource={filteredItems} columns={columns(handleDelete, handleEdit)} loading={loading} scroll={{ x: 800 }} pagination={false} bordered />

                    {items.length > 0 && itemsLimit < items.length && (
                        <div className="text-center">
                            <button
                                className='mt-5'
                                style={{ padding: '5px 15px', backgroundColor: '#7dcab3', color: '#fafafa', borderRadius: '30px' }}
                                onClick={() => setItemsLimit(prevLimit => prevLimit + 5)}
                            >
                                <span className='d-flex justify-content-center align-items-center gap-2'>Load more <BsArrowDown /></span>
                            </button>
                        </div>
                    )}
                </div>

                <Modal
                    title="Edit Item"
                    visible={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
                        <Button key="submit" type="primary" onClick={() => form.submit()}>Update</Button>,
                    ]}
                >
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please enter the category' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter the price' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter the description' }]}>
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Modal>
            </main>
        </>
    );
}