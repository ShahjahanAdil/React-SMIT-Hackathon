import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import Topbar from '../../../components/TopBar';
import AdminHeader from '../../../components/AdminHeader';
import Loader from '../../../components/Loader';
import { MdEdit } from 'react-icons/md';
import { Modal, Select, Button } from 'antd';

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const usersQuery = query(collection(firestore, "orders"));
                const querySnapshot = await getDocs(usersQuery);
                const usersArray = querySnapshot.docs.map((doc, i) => ({ ...doc.data(), key: i + 1 }));
                setOrders(usersArray);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = (order) => {
        setSelectedOrder(order);
        setStatus(order.orderStatus);
        setIsModalOpen(true);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const handleOk = async () => {
        if (selectedOrder) {
            try {
                await updateDoc(doc(firestore, "orders", selectedOrder.orderID), {
                    orderStatus: status
                });
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderID === selectedOrder.orderID ? { ...order, orderStatus: status } : order
                    )
                );
                window.toastify('Order status updated successfully!', 'success')
            } catch (error) {
                console.error('Error updating order status:', error)
                window.toastify('Failed to update order status. Please try again!', 'error')
            }
            setIsModalOpen(false)
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false)
        setSelectedOrder(null)
    };

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Topbar title="Admin" />
            <main>
                <div className="admin-container">
                    <AdminHeader />

                    <p className="text-center mb-4 users-heading">ORDERS</p>
                    <div className="orders-container">
                        <div className="table-responsive mt-4">
                            <table className="table order-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Order ID</th>
                                        <th>Ordered By</th>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map((order, i) => (
                                            <tr key={order.orderID}>
                                                <td>{i + 1}</td>
                                                <td>{order.orderID}</td>
                                                <td>{order.email}</td>
                                                <td>
                                                    <img src={order.itemImage} alt={order.title} style={{ width: '80px' }} />
                                                </td>
                                                <td>{order.title}</td>
                                                <td>{order.price}</td>
                                                <td style={{ textTransform: 'capitalize' }}>{order.orderStatus}</td>
                                                <td>
                                                    <MdEdit
                                                        size={20}
                                                        color="#007bff"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleUpdateStatus(order)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No orders yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Modal
                    title="Update Order Status"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            Update
                        </Button>,
                    ]}
                >
                    <p style={{ paddingBlock: '10px', color: '#000000A6' }}>Select a new status for the order:</p>
                    <Select
                        style={{ width: '100%' }}
                        value={status}
                        onChange={handleStatusChange}
                        options={[
                            { value: 'preparing', label: 'Preparing' },
                            { value: 'ready for pickup', label: 'Ready for Pickup' },
                            { value: 'delivered', label: 'Delivered' },
                        ]}
                    />
                </Modal>
            </main>
        </>
    )
}