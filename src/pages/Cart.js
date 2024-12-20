import { useState, useEffect, useContext } from 'react';
import { Row, Col, Table, Modal, Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';

import RemoveFromCart from '../components/RemoveFromCart';
import ClearCart from '../components/ClearCart';
import UserContext from '../context/UserContext';

export default function Cart() {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const notyf = new Notyf();

    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = () => {
        if(user.id !== null) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.error === "User's cart cannot be found") {
                    setCart([]);
                    setCartItems([]);
                } else {
                    setCart(data.cart);
                    setCartItems(data.cart.cartItems);
                }
            });
        }
    };

    const fetchProductDetails = async () => {
        try {
            const productData = await Promise.all(
                cartItems.map(async (item) => {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const data = await response.json();
                    return { ...item, ...data };
                })
            );

            setProductDetails(productData);
        } catch (error) {
            notyf.error('Error fetching product details:', error);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productId,
                newQuantity
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Item quantity updated successfully") {
                fetchData(); // Re-fetch updated cart data
            } else {
                notyf.error("Error updating quantity:", data.message);
            }
        })
        .catch(err => {
            notyf.error("Error updating quantity:", err);
        });
    };

    const incrementQuantity = (productId, quantity) => {
        const newQuantity = quantity + 1;
        updateQuantity(productId, newQuantity);
    };

    const decrementQuantity = (productId, quantity) => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            updateQuantity(productId, newQuantity);
        }
    };

    const confirmCheckout = () => {
            setIsLoading(true);
            fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    items: cartItems,
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === 'Ordered Successfully') {
                        notyf.success('Order placed successfully!');
                        fetchData(); // Re-fetch cart data to clear it
                        setShowCheckoutModal(false); // Close the modal
                    } else {
                        notyf.error(data.message || 'Failed to place order');
                    }
                })
                .catch((error) => {
                    notyf.error('An error occurred while placing your order');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if(cartItems.length > 0) {
            fetchProductDetails();
        }
    }, [cartItems])

    const handleCheckout = () => {
        setShowCheckoutModal(true);
    };

    return(
        (user.id !== null)
        ?
            <>
                <Row className="my-5 text-center">
                    <h1>Your Shopping Cart</h1>
                </Row>
                <Row>
                    <Col className="col-12">
                        <Table striped bordered hover variant="dark">
                          <thead>
                            <tr className="text-center">
                              <th className="col-6">Name</th>
                              <th className="col-1">Price</th>
                              <th className="col-3">Quantity</th>
                              <th className="col-1">Subtotal</th>
                              <th className="col-1"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                                (cartItems.length > 0)
                                ? 
                                    productDetails.map((item) => {
                                        return(
                                            <tr key={item.productId}>
                                                <td>{item.name}</td>
                                                <td>&#8369; {item.price}</td>
                                                <td>
                                                    <Col xs={5} className="d-flex mx-auto">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-light"
                                                            onClick={() => decrementQuantity(item.productId, item.quantity)}
                                                            disabled={item.quantity <= 1}
                                                        >-</Button>
                                                        <Form.Control
                                                            min="1"
                                                            size="sm"
                                                            type="number" 
                                                            value = {item.quantity}
                                                            onChange = {() => updateQuantity(item.productId, item.quantity)}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="outline-light"
                                                            onClick={() => incrementQuantity(item.productId, item.quantity)}
                                                        >+</Button>
                                                    </Col>
                                                </td>
                                                <td>&#8369; {item.subtotal}</td>
                                                <td className="text-center"><RemoveFromCart cartItem={item} fetchData={fetchData}/></td>
                                            </tr>
                                        )
                                    })
                                :
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No items in the cart
                                        </td>
                                    </tr>
                            }
                            <tr>
                                <td colSpan="3"><Button variant="success" className="ms-1 py-2" onClick={handleCheckout}>Checkout</Button></td>
                                <td colSpan="2" className="text-center fs-4 align-middle">Total: &#8369; {cart.totalPrice}</td>
                            </tr>
                          </tbody>
                        </Table>
                    </Col>
                </Row>
                <Col className="my-2">
                    <ClearCart fetchData={fetchData} />
                </Col>

                {/* Checkout Confirmation Modal */}
                <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Checkout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to proceed with the checkout?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={confirmCheckout}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Placing Order...' : 'Confirm Order'}
                        </Button>
                    </Modal.Footer>
                </Modal>

            </>
        :
            <Navigate to="/login" />
    )
}