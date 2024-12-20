import { useState, useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

export default function AppNavBar() {

	const { user } = useContext(UserContext);

	return(
		<Navbar bg="dark" expand="lg" data-bs-theme="dark">
			<Container fluid>
			    <Navbar.Brand as={Link} to="/">G7 Sweat Shop</Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
				    <Nav className="ms-auto">
				    	<Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
				        {(user.id !== null)? 
				        	(user.isAdmin === true)?
				        		<>
					        		<Nav.Link as={NavLink} to="/products" exact="true">Dashboard</Nav.Link>
					        		<Nav.Link as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
				        		</>
				        	:
				        		<>
				        			<Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>
				        			<Nav.Link as={NavLink} to="/orders" exact="true">Orders</Nav.Link>
                            		<Nav.Link as={NavLink} to="/cart" exact="true">Cart</Nav.Link>
                            		<Nav.Link as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
                            	</>
						: 
							<>
								<Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>
								<Nav.Link as={NavLink} to="/login" exact="true">Log In</Nav.Link>
								<Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
							</>
						}
				    </Nav>
			    </Navbar.Collapse>
			</Container>
		</Navbar>
	)
}