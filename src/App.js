import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { UserProvider } from './context/UserContext';

import AppNavBar from './components/AppNavBar';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import Logout from './pages/Logout';

function App() {
    const [user, setUser] = useState({
      id: null,
      isAdmin: null
    });

    const [isLoading, setIsLoading] = useState(true);

    const unsetUser = () => {
      localStorage.clear();
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const data = await response.json();
                    if (data._id === undefined) {
                        setUser({ id: null, isAdmin: null });
                    } else {
                        setUser({ id: data._id, isAdmin: data.isAdmin });
                    }
                } catch (error) {
                    setUser({ id: null, isAdmin: null });
                }
            } else {
                setUser({ id: null, isAdmin: null });
            }
            
            setIsLoading(false);
        };

        fetchUserDetails();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <UserProvider value={{user, setUser, unsetUser}}>
          <Router>
            <AppNavBar />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/details/:productId" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </Container>
          </Router>
        </UserProvider>
    )
}

export default App;
