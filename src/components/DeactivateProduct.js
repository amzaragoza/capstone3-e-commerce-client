import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function DeactivateProduct({product, isActive, fetchData}) {

    const notyf = new Notyf();

    const [productId, setProductId] = useState(product._id);

    const archiveToggle = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        .then(res => res.json())
        .then(data => {

            if(data.success === true) {
                notyf.success("Successfully Deactivated")
                fetchData();

            }else {
                notyf.error("Product not found")
                fetchData();
            }

        })
    }


    const activateToggle = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        .then(res => res.json())
        .then(data => {

            if(data.success === true) {
                notyf.success("Successfully Activated")
                fetchData();
            }else {
                notyf.error("Product not found")
                fetchData();
            }
            
        })
    }
 

    return(
        <>
            {isActive ?

                <Button variant="danger" className="ms-1" size="sm" onClick={() => archiveToggle()}>Disable</Button>

                :

                <Button variant="success" className="ms-1" size="sm" onClick={() => activateToggle()}>Activate</Button>

            }
        </>

        )
}