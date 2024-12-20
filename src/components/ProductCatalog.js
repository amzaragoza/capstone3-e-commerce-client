import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cart from '../pages/Cart';
import UserContext from '../context/UserContext';

export default function ProductCatalog() {

	const { user } = useContext(UserContext);

	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
		.then(response => response.json())
		.then(data => {
			if(data.error === "No active products found") {
				setProducts([]);
			} else {
				setProducts(data);
			}
		});
	}, [])

	return(
		<>
			<h1 className="my-5">Products</h1>
			<Row className="d-flex justify-content-center mx-auto my-5">
				{
					(products.length > 0)
					?
						products.map((product) => {
							return(
								<Col className="col-4 justify-content-center mt-4">
					                <Card>
										<Card.Body>
										    <Card.Title className="mb-4 text-center">{product.name}</Card.Title>
										    <Card.Text className="mb-5">{product.description}</Card.Text>
										    <Card.Text className="my-5 text-warning">{product.price}</Card.Text>
										    <Button as={Link} variant="primary" className="col-12" to={`/products/details/${product._id}`}>Details</Button>
										</Card.Body>
									</Card>
					            </Col>
							)
						})
					:
						<h1>No Products for Sale :(</h1>
				}
	        </Row>
        </>
	)
}