import { useState, useEffect, useContext } from 'react';
import { Row, Col, Table, Modal, Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';

import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import DeactivateProduct from './DeactivateProduct'

import UserContext from '../context/UserContext';

export default function AdminPanel() {

	const { user } = useContext(UserContext);

    const notyf = new Notyf();

	const [products, setProducts] = useState([]);

	const fetchData = () => {
		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then(response => response.json())
		.then(data => {
			if(data.error === "No products found") {
				setProducts([]);
			} else if(data.length === 0) {
				setProducts([]);
			} else {
				setProducts(data);
			}
		});
	};

	useEffect(() => {
		fetchData();
	}, [])

	return(
		(user.id !== null && user.isAdmin === true)
		?
			<>
				<Row className="my-5 text-center">
					<h1>Admin Dashboard</h1>
					<Col>
						<AddProduct fetchData={fetchData} />
						<Button variant="success" className="ms-1">Show Orders</Button>
					</Col>
				</Row>
				<Row>
					<Col className="col-12">
						<Table striped bordered hover variant="dark">
					      <thead>
					        <tr>
					          <th>Name</th>
					          <th>Description</th>
					          <th>Price</th>
					          <th>Availability</th>
					          <th>Actions</th>
					        </tr>
					      </thead>
					      <tbody>
					      	{
					      		(products.length > 0)
					      		?
					      			products.map((product) => {
					      				return(
					      					<>
					      						<tr>
							      					<td>{product.name}</td>
											        <td>{product.description}</td>
											        <td>{product.price}</td>
											        {(product.isActive === true)
											        ?
											        	<td>Available</td>
											        :
											        	<td>Not Available</td>
											        }
											        <td className="text-center">
											        	<UpdateProduct product = {product} fetchData = {fetchData}/>
											        	<DeactivateProduct product={product} isActive={product.isActive} fetchData={fetchData}/>
											        </td>
										        </tr>
									        </>
					      				)
					      			})
					      		:
					      			null
					      	}
					      </tbody>
					    </Table>
				    </Col>
			    </Row>
		    </>
		:
			<Navigate to="/login" />
	)
}