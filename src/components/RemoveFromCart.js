import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function RemoveFromCart({cartItem, fetchData}) {

    const notyf = new Notyf();

    const [productId, setProductId] = useState(cartItem.productId);

    const removeProduct = () => {

        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {

            if (data.message === "Item removed from cart successfully") {
                fetchData();
                notyf.success("Item Successfully Removed")
            } else if (data.message === "Item not found in cart") {
                fetchData();
                notyf.error("Item not found in cart")
            } else {
                fetchData();
                notyf.error("Cart does not exist") 
            }

        })
    }

    return(
        <Button variant="danger" size="sm" onClick={removeProduct}>Remove</Button>
    )
}