import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import {Notyf} from 'notyf';
import UserContext from '../context/UserContext';

export default function Login() {

    const {user, setUser} = useContext(UserContext);

    const notyf = new Notyf();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {

            if(data.access){
                localStorage.setItem('token', data.access);

                retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');

                notyf.success('Successful Login');
            } else if (data.error === "Email and password do not match") {
                notyf.error(`Incorrect credentials. Try again!`);
            } else {
                notyf.error(`${email} does not exist`);
            }
        })
    }

    function retrieveUserDetails(token){

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => response.json())
        .then(data => {
            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            })
        })
    }


    useEffect(() => {
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }
    }, [email, password]);


    return(
        (user.id !== null)
            ?
            <Navigate to='/products'/>
            :    
            <>
                <h1 className="my-5 text-center">Login</h1>
                <Container className="col-6 mt-5 p-5 border border-secondary rounded">
                    <Form onSubmit={(e) => authenticate(e)}>
                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter your email here" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="my-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter your password here" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        { isActive ? 
                            <div className="d-grid gap-2 mt-5">
                                <Button variant="primary" type="submit" id="loginBtn">
                                    Login
                                </Button>
                            </div>
                            : 
                            <div className="d-grid gap-2 mt-5">
                                <Button variant="primary" type="submit" id="loginBtn" disabled>
                                    Login
                                </Button>
                            </div>
                        }  
                    </Form> 
                </Container>
                <p className = 'mt-4 text-center'>Don't have an account yet? <a href="/register" className="text-decoration-none">Click here</a> to register.</p>
            </> 
    )
}