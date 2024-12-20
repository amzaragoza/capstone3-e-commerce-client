import { Navigate } from 'react-router-dom';
import {useContext, useEffect} from 'react';

import UserContext from '../context/UserContext';

export default function Logout(){

	const { setUser, unsetUser} = useContext(UserContext);
	
	useEffect(()=>{
		unsetUser();
		
		setUser({
			id: null,
			isAdmin: null
		})

	}, [])

	return(
		<Navigate to='/login' />
	)
}