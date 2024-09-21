import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../services/authSlice";

const RequireAuth = () => {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();

    console.log('Redux State:', useSelector((state) => state.auth));
    console.log("Token:", token);

    return(
        token 
            ? <Outlet/>
            : <Navigate to = '/login' state={{from: location}} replace />
    )
}

export default RequireAuth;