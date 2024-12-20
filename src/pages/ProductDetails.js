import { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import { Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';

import ProductCatalog from '../components/ProductCatalog';
import AdminPanel from '../components/AdminPanel';

import UserContext from '../context/UserContext';

export default function Products() {

    const { productId } = useParams();
    const navigate = useNavigate();

    const notyf = new Notyf();

    const { user } = useContext(UserContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const add = () => {
        setQuantity(quantity + 1);
    }

    const minus = () => {
        if(quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const randomChange = (e) => {
        if(e.target.value > 1) {
            setQuantity(e.target.value);
        }
    }

    const addToCart = () => {
        if(user.id !== null) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity,
                    subtotal: quantity * price
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.message === "Product not found.") {
                    setName('');
                    setDescription('');
                    setPrice(0);
                    setQuantity(1);

                    navigate('/products')
                }
                if(data.message === "Item added to cart successfully") {
                    notyf.success("Item added to cart!");
                }
                if(data.message === "Error adding to cart") {
                    notyf.error("Failed to add to cart!");
                }
            })
        } else {
            navigate('/login');
        }
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            if(data.error === "Product not found" || data.length === 0) {
                setName('');
                setDescription('');
                setPrice(0);

                navigate('/products')
            } else {
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
            }
        })
    }, [productId])

    return(
        (user.isAdmin === true)
        ?
            <Navigate to="/products" />
        :
            <Row className="d-flex justify-content-center mt-5">
                <Col className="col-8">
                    <Card bg="dark" className="text-white">
                      <Card.Header as="h3" className="text-center">{name}</Card.Header>
                      <Card.Body>
                        <Card.Text>{description}</Card.Text>
                        <Card.Text className="text-warning">Price: ₱{price}</Card.Text>
                        <Card.Text>Quantity: </Card.Text>
                        <Row>
                            <Col xs={2} className="d-flex">
                                <Button variant="outline-light" size="sm" onClick={minus}>-</Button>
                                <Form.Control
                                    min="1"
                                    size="sm"
                                    type="number" 
                                    value = {quantity}
                                    onChange = {e => randomChange(e)}
                                />
                                <Button variant="outline-light" size="sm" onClick={add}>+</Button>
                            </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer>
                        {(user.id !== null)?
                            <Button variant="success" onClick={addToCart}>Add to Cart</Button>
                        :
                            <Button as={Link} variant="warning" to="/login">Log In to Add to Cart</Button>
                        }
                      </Card.Footer>
                    </Card>
                </Col>
            </Row>
    )
}