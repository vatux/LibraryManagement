import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../services/authSlice'; // authSlice içindeki setCredentials aksiyonu

const authPersist = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
            dispatch(setCredentials({ user, token }));
            console.log('persist_user: ',user);
            console.log('persist_user: ',token);
        }
    }, [dispatch]);
};

export default authPersist;
