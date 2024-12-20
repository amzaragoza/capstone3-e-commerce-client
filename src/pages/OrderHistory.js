import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Table } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import { Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

export default function OrderHistory() {
    const { user } = useContext(UserContext);
    const notyf = new Notyf();

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [productDetails, setProductDetails] = useState([]);

    const fetchOrderHistory = () => {
        if (user.id !== null) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        notyf.error(data.error || 'Failed to fetch orders');
                        setOrders([]);
                    } else {
                        setOrders(data.orders || []);
                        setOrderItems(data.orders.productsOrdered || []);
                    }
                })
                .catch(error => {
                    notyf.error('An error occurred while fetching your order history');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const fetchProductDetails = async () => {
        if (orderItems.length > 0) {
            try {
                const productData = await Promise.all(
                    orderItems.map(async (item) => {
                        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                        const product = await response.json();
                        // return { ...item, ...product };
                        return {
                            name: product.name,
                            price: product.price,
                            quantity: item.quantity,
                            subtotal: product.price * item.quantity,
                        };
                    })
                );

                setProductDetails(productData);
            } catch (error) {
                notyf.error('Error fetching product details:', error);
            }
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOrderItems(order.productsOrdered || []);
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
        setShowDetailsModal(false);
    };

    useEffect(() => {
        fetchOrderHistory();
    }, [user]);

    useEffect(() => {
        if (Array.isArray(orderItems) && orderItems.length > 0) {
            fetchProductDetails();
        }
    }, [orderItems]);

    return (
        (user.id !== null)
        ?
            (user.isAdmin !== true)
                ?
                    <>
                        <Row className="my-5 text-center">
                            <h1>Your Order History</h1>
                        </Row>
                        <Row>
                            <Col className="col-12">
                                {isLoading ? (
                                    <div className="text-center">
                                        <Spinner animation="border" role="status" />
                                        <span className="ms-2">Loading your orders...</span>
                                    </div>
                                ) : (
                                    <Row>
                                        {Array.isArray(orders) && orders.length > 0 ? (
                                            orders.map((order) => (
                                                <Col key={order._id} md={4} className="mb-4">
                                                    <Card bg="dark" text="white" className="h-100">
                                                        <Card.Header>Order ID: {order._id}</Card.Header>
                                                        <Card.Body>
                                                            <Card.Title>{new Date(order.orderedOn).toLocaleDateString()}</Card.Title>
                                                            <Card.Text>
                                                                <strong>Total Price:</strong> &#8369; {order.totalPrice.toFixed(2)} <br />
                                                                <strong>Status:</strong> {order.status}
                                                            </Card.Text>
                                                            <Button
                                                                as={Link}
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(order)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))
                                        ) : (
                                            <Col className="text-center">
                                                <Card bg="light" text="dark" className="w-100">
                                                    <Card.Body>
                                                        <Card.Text>No orders found.</Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )}
                                    </Row>
                                )}
                            </Col>
                        </Row>

                        {/* Order Details Modal */}
                        <Modal
                            show={showDetailsModal}
                            onHide={handleCloseDetails}
                            size="lg"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Order Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedOrder ? (
                                    <>
                                        <p>
                                            <strong>Order ID:</strong> {selectedOrder._id} <br />
                                            <strong>Date:</strong> {new Date(selectedOrder.orderedOn).toLocaleString()} <br />
                                            <strong>Status:</strong> {selectedOrder.status} <br />
                                            <strong>Total Price:</strong> &#8369; {selectedOrder.totalPrice.toFixed(2)}
                                        </p>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Product Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(productDetails) &&
                                                    productDetails.map((item, index) => (
                                                        <tr key={item.productId}>
                                                            <td>{item.name}</td>
                                                            <td>&#8369; {item.price.toFixed(2)}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>&#8369; {(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </Table>
                                    </>
                                ) : (
                                    <p>Loading order details...</p>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseDetails}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>   
                :
                    //admin
                    <Navigate to="/products" />
               
        : <Navigate to="/login" />
    )
}