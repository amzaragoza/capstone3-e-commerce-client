import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ClearCart({ fetchData }) {

    const notyf = new Notyf();

    const clearCart = () => {

        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`,{
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Cart cleared successfully") {
                fetchData();
                notyf.success("Cart Cleared")
            } else if (data.message === "Cart is already empty") {
                fetchData();
                notyf.error("Cart already Empty")
            } else {
                fetchData();
                notyf.error("Cart does not exist") 
            }
        })
    }

    return(
        <Button variant="danger" className="ms-1 py-2" onClick={clearCart}>Clear Cart</Button>
    )
}