import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../services/authSlice";


const Sidebar = () => {

    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const user = useSelector(selectCurrentUser);

    return (
      <div className="sidebar" data-background-color="dark">
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">
            <ul className="nav nav-secondary">
              <li className={`nav-item ${isActive('/home')}`}>
                <Link to="/home">
                  <i className="fas fa-home"></i>
                  <p>Home</p>
                </Link>
              </li>
              
              <li className="nav-section">
                <span className="sidebar-mini-icon">
                  <i className="fa fa-ellipsis-h"></i>
                </span>
                <h4 className="text-section">OPERATIONS</h4>
              </li>
              <li className={`nav-item ${isActive('/books')}`}>
                <Link to="/books">
                  <i className="fas fa-book"></i>
                  <p>Books</p>
                </Link>
              </li>
              {
                user.role === 'admin' && (
                  <li className={`nav-item ${isActive('/users')}`}>
                    <Link to="/users">
                      <i className="fas fa-user"></i>
                      <p>Users</p>
                    </Link>
                  </li>
                )
              }
              
              {/* <li className={`nav-item ${isActive('/loans')}`}>
                <Link to="#">
                  <i className="fas fa-bookmark"></i>
                  <p>Loans</p>
                </Link>
              </li> */}
              <li className={`nav-item ${isActive('/bookscopies')}`}>
                <Link to="/bookscopies">
                  <i className="fas fa-swatchbook"></i>
                  <p>Books Copies</p>
                </Link>
              </li>
              {
                (user.role === 'admin' || user.role === 'librarian') && (
                  <li className={`nav-item ${isActive('/authors')}`}>
                <Link to="/authors">
                  <i className="fas fa-user-edit"></i>
                  <p>Authors</p>
                </Link>
              </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    )
}

export default Sidebar