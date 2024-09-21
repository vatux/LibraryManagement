import React, {useState, useEffect} from 'react'
import { useAddLoansMutation, useDeleteLoansMutation, useGetLoansQuery, useUpdateLoansMutation } from '../services/loansApiSlice';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../services/authSlice";

const Loans = () => {
    
    const user = useSelector(selectCurrentUser);

    const { data, error, isLoading, refetch } = useGetLoansQuery();
    const [addLoan] = useAddLoanMutation();
    const [updateLoan] = useUpdateLoanMutation();
    const [deleteLoan] = useDeleteLoanMutation();
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [updateData, setUpdateData] = useState({ user_id: '', book_id: '', birth_date: '' });
    const [newLoanData, setNewLoanData] = useState({ name: '', biography: '', birth_date: '' });
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const loanArray = Array.isArray(data?.data) ? data.data : [];

    const handleAddClick = () => {
        setNewLoanData({
            name: '',
            biography: '',
            birth_date: '',
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('addLoanModal'));
        addModal.show();
    };

    const handleAddLoan = async () => {
        try {
          await addLoan(newLoanData).unwrap();
          const addModal = window.bootstrap.Modal.getInstance(document.getElementById('addLoanModal'));
          addModal.hide();
          refetch();
        } catch (err) {
          console.error('Failed to add loan:', err);
        }
    };

    const handleEditClick = (loan) => {
        setSelectedLoan(loan);
        setUpdateData({
            name: loan.name,
            biography: loan.biography,
            birth_date: loan.birth_date,
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('updateLoanModal'));
        addModal.show();
    };

    

    const handleUpdate = async () => {
        if (!selectedLoan || !selectedLoan._id) {
            console.error('Loan ID is missing');
            return;
        }

        try {
            await updateLoan({
                _id: selectedLoan._id,
                ...updateData
            }).unwrap();
            const editModal = window.bootstrap.Modal.getInstance(document.getElementById('updateLoanModal'));
            editModal.hide();
            refetch();
        } catch (err) {
            console.error('Failed to update loan:', err);
        }
    };

    const handleDeleteClick = async (loanId) => {
        console.log("Loan ID:", loanId);

        if (!loanId) {
            console.error('Loan ID is missing');
            return;
        }

        try {
            await deleteLoan(loanId).unwrap();
            refetch();
        } catch (err) {
            console.error('Failed to delete loan:', err);
        }
    };
  
    return (
        <div class="container">
          <div class="page-inner">
            <div class="page-header">
              <h3 class="fw-bold mb-3">Loans</h3>
              <ul class="breadcrumbs mb-3">
                <li class="nav-home">
                  <a href="home">
                    <i class="icon-home"></i>
                  </a>
                </li>
                <li class="separator">
                  <i class="icon-arrow-right"></i>
                </li>
                <li class="nav-item">
                  <a href="#">Loans List</a>
                </li>
              </ul>
            </div>
            <div class="row">
            <div class="col-md-12">
            <div class="card">
              { 
                user.role === 'admin' || user.role === 'librarian' && (
                  <div class="card-header">
                    <div class="d-flex align-items-center">
                      <h4 class="card-title">Add Loan</h4>
                      <button
                        class="btn btn-primary btn-round ms-auto"
                        data-bs-target="#addLoanModal"
                        onClick={() => handleAddClick()}
                      >
                        <i class="fa fa-plus"></i>
                        Add Loan
                      </button>
                    </div>
                </div>
              )

              }
                
                  <div class="card-body">
                    <div
                      class="modal fade"
                      id="addLoanModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> New</span>
                              <span class="fw-light"> Loan </span>
                            </h5>
                            <button
                              type="button"
                              class="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            <p class="small">
                              Create a new loan using this form, make sure you
                              fill them all
                            </p>
                            <form>
                              <div class="row">
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Name</label>
                                    <input
                                      id="addName"
                                      type="text"
                                      class="form-control"
                                      value={newLoanData.name}
                                      onChange={(e) => setNewLoanData({ ...newLoanData, name: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Biography</label>
                                    <input
                                      id="addBiography"
                                      type="text"
                                      class="form-control"
                                      value={newLoanData.biography}
                                      onChange={(e) => setNewLoanData({ ...newLoanData, biography: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Birth Date</label>
                                    <input
                                      id="addBirthDate"
                                      type="text"
                                      class="form-control"
                                      value={newLoanData.birth_date}
                                      onChange={(e) => setNewLoanData({ ...newLoanData, birth_date: e.target.value })}
                                      />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div class="modal-footer border-0">
                            <button
                              type="button"
                              id="addRowButton"
                              class="btn btn-primary"
                              onClick={handleAddLoan}
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              class="btn btn-danger"
                              data-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="modal fade"
                      id="updateLoanModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> Update</span>
                              <span class="fw-light"> Loan </span>
                            </h5>
                            <button
                              type="button"
                              class="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            <p class="small">
                              Update loan informations using this form.
                            </p>
                            <form>
                              <div class="row">
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Name</label>
                                    <input
                                      id="updateName"
                                      type="text"
                                      class="form-control"
                                      value={updateData.name || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Biography</label>
                                    <input
                                      id="updateBiography"
                                      type="text"
                                      class="form-control"
                                      value={updateData.biography || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, biography: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Birth Date</label>
                                    <input
                                      id="updateBirthDate"
                                      type="text"
                                      class="form-select form-control"
                                      value={updateData.birth_date}
                                      onChange={(e) => setUpdateData({ ...updateData, birth_date: e.target.value })}
                                      />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div class="modal-footer border-0">
                            <button
                              type="button"
                              id="updateLoanButton"
                              class="btn btn-primary"
                              onClick={handleUpdate}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              class="btn btn-danger"
                              data-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="table-responsive">
                      <table
                        id="add-row"
                        class="display table table-striped table-hover"
                      >
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Biography</th>
                            <th>Birth Date</th>
                          </tr>
                        </thead>
                        <tbody>
                            {loanArray.map(loan => (
                                <tr key={loan._id}>
                                <td>{loan.name}</td>
                                <td>{loan.biography}</td>
                                <td>{loan.birth_date}</td>
                                {
                                  user.role === 'admin' || user.role === 'librarian' && (
                                    <td>
                                  <div class="form-button-action">
                                    <button
                                      type="button"
                                      data-bs-toggle="tooltip"
                                      title=""
                                      class="btn btn-link btn-primary btn-lg"
                                      data-original-title="Edit Task"
                                      onClick={() => handleEditClick(loan)}
                                    >
                                      <i class="fa fa-edit"></i>
                                    </button>
                                    <button
                                      id="alert_demo_3_3"
                                      type="button"
                                      class="btn btn-link btn-danger"
                                      data-original-title="Remove"
                                      onClick={() => handleDeleteClick(loan._id)}
                                    >
                                      <i class="fa fa-times"></i>
                                    </button>
                                  </div>
                                </td>
                                  )
                                }
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
    );
  };
  export default Loans;