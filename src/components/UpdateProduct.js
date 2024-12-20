import {Button, Form, Modal} from 'react-bootstrap';
import { useState } from 'react';

import {Notyf} from 'notyf';

export default function UpdateProduct({product, fetchData}){
    const notyf = new Notyf();

    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddModalClose = () => setShowAddModal(false);
    const handleAddModalShow = () => setShowAddModal(true);

    const [productId, setProductId] = useState(product._id);

    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);

    const updateProduct = (event, productId) => {

        event.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`,{
	        method: 'PATCH',
	        headers: {
	            "Content-Type": "application/json",
	            'Authorization': `Bearer ${localStorage.getItem("token")}`
        	},
			body: JSON.stringify({
				name, 
				description, 
				price
			})
        })
        .then(res => res.json())
        .then(data => {

            console.log(data)

            if (data.error === "Product not found") {
                notyf.error(`${data.name} does not exist`);
                fetchData();
                handleAddModalClose();
            } else {
                notyf.success(`Product updated successfully`);
                fetchData();
                handleAddModalClose();
            }
        })
    }


    
    return (
        <>
            <Button variant = "primary" className="me-1" size = "sm" onClick={handleAddModalShow} >Update</Button>

            {/*Update Modal*/}

            <Modal show={showAddModal} onHide={handleAddModalClose}>
                   <Modal.Header closeButton>
                     <Modal.Title>Update Product</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                     <Form >
                       <Form.Group className="mb-3" controlId="courseName">
                         <Form.Label>Name</Form.Label>
                         <Form.Control
                           type="text"
                           required
                           value = {name}
                           onChange = {event => setName(event.target.value)}
                         />
                       </Form.Group>

                       <Form.Group
                         className="mb-3"
                         controlId="courseDescription"
                       >
                         <Form.Label>Description</Form.Label>
                         <Form.Control  
                            type = "text"
                            value = {description}
                            onChange = {event => setDescription(event.target.value)} 
                            required/>
                       </Form.Group>

                       <Form.Group
                         className="mb-3"
                         controlId="coursePrice"
                       >
                         <Form.Label>Price</Form.Label>
                         <Form.Control  
                            type = "number"
                            value = {price} 
                            onChange = {event => setPrice(event.target.value)}
                            required/>
                       </Form.Group>


                     </Form>
                   </Modal.Body>
                   <Modal.Footer>
                     <Button variant="secondary" onClick={handleAddModalClose}>
                       Close
                     </Button>
                     <Button variant="success" onClick= {event => updateProduct(event, productId)}>
                       Save Changes
                     </Button>
                   </Modal.Footer>
                 </Modal>


        </>
        )
}