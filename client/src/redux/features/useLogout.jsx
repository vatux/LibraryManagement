import { useDispatch } from 'react-redux';
import { logOut } from '../services/authSlice';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logOut());
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return logout;
}

export default useLogout;
