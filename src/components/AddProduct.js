import { useState, useEffect, useContext } from 'react';
import { Row, Col, Table, Modal, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

import UserContext from '../context/UserContext';

export default function AddProduct({ fetchData }) {

	const notyf = new Notyf();

	const [showAddModal, setShowAddModal] = useState(false);

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);

	const [isActive, setIsActive] = useState(false);

	useEffect(()=> {
		if(name !== '' && description !== '' && price > 0 && price !== null){
			setIsActive(true);
		}else{
			setIsActive(false);
		}
	}, [name, description, price])

	const handleAddModalClose = () => setShowAddModal(false);
	const handleAddModalShow = () => setShowAddModal(true);

	const addProduct = () => {
		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})
		})
		.then(response => response.json())
		.then(data => {
			if(data.error === "Product already exists") {
				notyf.error("This product already exists!");
			} else if(data) {
				setName('');
				setDescription('');
				setPrice(0);

				notyf.success("Product successfully added!");

				fetchData();

				handleAddModalClose();
			} else {
				notyf.error("Something went wrong!");
			}
		});
	}

	return(
		<>
			<Button variant="primary" className="me-1" onClick={handleAddModalShow}>Add Product</Button>

			<Modal show={showAddModal} onHide={handleAddModalClose}>
				<Modal.Header closeButton>
				    <Modal.Title>Add New Product</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				    <Form>
				        <Form.Group className="mb-3" controlId="addFormName">
				            <Form.Label>Name</Form.Label>
				            <Form.Control 
				            	type="text"
				            	required
					            value={name}
					        	onChange={event => setName(event.target.value)}
				            />
				        </Form.Group>
				        <Form.Group className="mb-3" controlId="addFormDescription">
				            <Form.Label>Description</Form.Label>
				            <Form.Control
				            	as="textarea"
				            	rows={3}
				            	required
					            value={description}
					        	onChange={event => setDescription(event.target.value)}
				            />
				        </Form.Group>
				        <Form.Group className="mb-3" controlId="addFormPrice">
				            <Form.Label>Price</Form.Label>
				            <Form.Control
				            	type="number"
				            	required
					            value={price}
					        	onChange={event => setPrice(event.target.value)}
				            />
				        </Form.Group>
				    </Form>
				</Modal.Body>
				<Modal.Footer>
				    <Button variant="secondary" onClick={handleAddModalClose}>Close</Button>
				    {isActive ?
				    	<Button variant="primary" onClick={addProduct}>Add Product</Button>
				    :
				    	<Button variant="danger" disabled>Add Product</Button>
				    }
				</Modal.Footer>
			</Modal>
		</>
	)
}