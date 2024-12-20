import { useState, useEffect, useContext } from 'react';

import ProductCatalog from '../components/ProductCatalog';
import AdminPanel from '../components/AdminPanel';


import UserContext from '../context/UserContext';

export default function Products() {

    const { user } = useContext(UserContext);

    return(
        (user.isAdmin === true)
        ?
            <AdminPanel />
        :
            <ProductCatalog />
    )
}