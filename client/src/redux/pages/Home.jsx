import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../services/authSlice";
import { useAddBookMutation, useDeleteBookMutation, useGetBooksQuery, useUpdateBookMutation } from '../services/booksApiSlice';
import { Link } from 'react-router-dom';
import { useGetLoansQuery, useDeleteLoansMutation } from '../services/loansApiSlice';

const Home = () => {
    const currentUser = useSelector(selectCurrentUser);
    const userId = currentUser?._id;

    const { data: loansData, error, isLoading, refetch } = useGetLoansQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const filteredLoans = loansData?.data?.filter((loan) => loan.user_id === userId) || [];

    
    return (
        <div class="container">
          <div class="page-inner">
            <div class="page-header">
              <ul class="breadcrumbs mb-3">
                <li class="nav-home">
                  <a href="#">
                    <i class="icon-home"></i>
                  </a>
                </li>
                <li class="separator">
                  <i class="icon-arrow-right"></i>
                </li>
                <li class="nav-item">
                  <a href="#">Home Page</a>
                </li>
              </ul>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card">
                  
                  <div class="card-body">
                    <h2>Welcome to Home Page, {currentUser.name}!</h2>
                  </div>
                  <div class="card-header">
                    <div class="card-title">My Loans</div>
                  </div>
                  <div class="card-body">
                    <div class="card-sub">
                    </div>
                    <table class="table mt-3">
                      <thead>
                        <tr>
                          <th scope="col">Book</th>
                          <th scope="col">Loan Date</th>
                          <th scope="col">Return Date</th>
                          <th scope="col">Returned At</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          filteredLoans.map((loan) => (
                            <tr key={loan._id}>
                            <td>{loan.book_id.title}</td>
                            <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
                            <td>{new Date(loan.return_date).toLocaleDateString()}</td>
                            <td>{new Date(loan.returned_at).toLocaleDateString()}</td>
                            <td>{loan.status}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Home;