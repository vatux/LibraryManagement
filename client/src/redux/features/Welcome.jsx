import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../services/authSlice";
import { Link } from "react-router-dom";

const Welcome = () => {
    
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);

    
    return (
        <div class="container">
          <div class="page-inner">
            <div class="page-header">
              <h3 class="fw-bold mb-3">Welcome! {user.name}</h3>
              <ul class="breadcrumbs mb-3">
                <li class="nav-home">
                  <a href="#">
                    <i class="icon-home"></i>
                  </a>
                </li>
              </ul>
              <p>Token: {token}</p>
            <p><Link to="/bookslist">Go to the Books List</Link></p>
            </div>
          </div>
        </div>
    )
}

export default Welcome