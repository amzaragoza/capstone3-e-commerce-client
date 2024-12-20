import {Button, Form, Container } from 'react-bootstrap';
import {useState, useEffect, useContext} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';

export default function Register(){
	const {user} = useContext(UserContext);

	const notyf = new Notyf();
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [mobileNo, setMobileNo] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [isActive, setIsActive] = useState(false);

	useEffect(()=> {
		if(firstName !== "" && lastName !== "" && email !== "" && mobileNo !== '' && mobileNo.length === 11 && password !== '' && confirmPassword !== '' && password === confirmPassword  ){
			setIsActive(true);
		}else{
			setIsActive(false);
		}
	}, [firstName, lastName, email, mobileNo, password, confirmPassword])


	const registerUser = (event) => {

		event.preventDefault();

		console.log("register button is clicked");

		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
			method: 'POST',
			headers: {
				"Content-Type" : 'application/json'
			},
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				mobileNo,
				password
			})
		})
		.then(response => response.json())
		.then(data => {
			
			if(data.message === 'Registered Successfully'){
				setFirstName('');
				setLastName('');
				setEmail('');
				setMobileNo('');
				setPassword('');
				setConfirmPassword('');

				notyf.success("Registration successful!");
				navigate("/login");
			}else if(data.error === "Email invalid"){
				notyf.error('Email is invalid');
			}else if (data.error === "Mobile number invalid"){
				notyf.error('Mobile number is invalid');
			} else if(data.error === "Password must be atleast 8 characters"){
				notyf.error("Password must be at least 8 characters");
			}else {
				notyf.error("Something went wrong!");
			}
			
		})
	}


	return (
		(user.id !== null) 
		?
		<Navigate to="/products" />
		:
		<Container className="my-5 p-5 border border-secondary rounded">
			<Form className ="mx-auto" onSubmit = {event => registerUser(event)}>
				<h1 className = 'mb-5 text-center'>Register</h1>

				<Form.Group className="mb-3">
			        <Form.Label>First Name:</Form.Label>
			        <Form.Control 
			        	type="text" 
			        	placeholder="Enter your First Name" 
			        	value = {firstName}
			        	onChange = {event => setFirstName(event.target.value)}
			        	required/>
			      </Form.Group>

			      <Form.Group className="mb-3">
			        <Form.Label>Last Name:</Form.Label>
			        <Form.Control 
			        	type="text" 
			        	placeholder="Enter your Last Name" 
			        	value = {lastName}
			        	onChange = {event => setLastName(event.target.value)}
			        	required/>
			      </Form.Group>

			      <Form.Group className="mb-3" >
			        <Form.Label>Email:</Form.Label>
			        <Form.Control 
			        	type="email" 
			        	placeholder="Enter your email" 
			        	value = {email}
			        	onChange = {event => setEmail(event.target.value)}
			        	required/>
			      </Form.Group>

			      <Form.Group className="mb-3">
			        	<Form.Label>Mobile Number:</Form.Label>
			        	<Form.Control 
			        		type="number" 
			        		placeholder="Enter your 11 digit mobile number" 
			        		value = {mobileNo}
			        		onChange = {event => setMobileNo(event.target.value)}
			        		required/>
			       </Form.Group>

			      <Form.Group className="mb-3">
			        <Form.Label>Password:</Form.Label>
			        <Form.Control 
			        	type="password" 
			        	placeholder="Enter your password (atleast 8 characters)" 
			        	value = {password}
			        	onChange = {event => setPassword(event.target.value)}
			        	required/>
			      </Form.Group>

			      <Form.Group className="mb-3">
			        <Form.Label>Verify Password:</Form.Label>
			        <Form.Control 
			        	type="password" 
			        	placeholder="Verify your Password" 
			        	value = {confirmPassword}
			        	onChange = {event => setConfirmPassword(event.target.value)}
			        	required/>
			      </Form.Group>

			      {
			      	isActive ?
			      		<div className="d-grid gap-2 mt-5">
				      		<Button variant="primary" type="submit">
				      		  Register
				      		</Button>
			      		</div>
			      	:
			      		<div className="d-grid gap-2 mt-5">
				      		<Button variant="primary" type="submit" disabled>
				        		Register
				      		</Button>
			      		</div>
			      }		      
			</Form>
		</Container>
		)
}