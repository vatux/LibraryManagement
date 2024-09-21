import React, {useState, useEffect} from 'react'
import { useAddBooksCopiesMutation, useDeleteBooksCopiesMutation, useGetBooksCopiesQuery, useUpdateBooksCopiesMutation } from '../services/booksCopiesApiSlice';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../services/authSlice";
import { useGetBooksQuery } from '../services/booksApiSlice';

const BooksCopies = () => {
    
    const user = useSelector(selectCurrentUser);

    const { data: booksCopiesData, error: booksCopiesError, isLoading: booksCopiesIsLoading, refetch: refetchBooksCopies } = useGetBooksCopiesQuery();
    const { data: booksData, error: booksError, isLoading: booksIsLoading, refetch: refetchBooks } = useGetBooksQuery();
    const [addBookCopy] = useAddBooksCopiesMutation();
    const [updateBookCopy] = useUpdateBooksCopiesMutation();
    const [deleteBookCopy] = useDeleteBooksCopiesMutation();
    const [selectedBookCopy, setSelectedBookCopy] = useState(null);
    const [updateData, setUpdateData] = useState({ title: '', author: '', published_year: '', genre: '', isbn: '', quantity: '' });
    const [newBookCopyData, setNewBookCopyData] = useState({ title: '', author: '', published_year: '', genre: '', isbn: '', quantity: '' });
  
    if (booksCopiesIsLoading) return <p>Loading BooksCopies...</p>;
    if (booksCopiesError) return <p>Error BooksCopies: {booksCopiesError.message}</p>;

    if (booksIsLoading) return <p>Loading Books...</p>;
    if (booksError) return <p>Error Books: {booksError.message}</p>;
  
    const booksCopiesArray = Array.isArray(booksCopiesData?.data) ? booksCopiesData.data : [];
    const booksArray = Array.isArray(booksData?.data) ? booksData.data : [];

    const handleAddClick = () => {
        setNewBookCopyData({
            book_id: '',
            copy_number: '',
            is_available: '',
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('addBookCopyModal'));
        addModal.show();
    };

    const handleAddBookCopy = async () => {
        try {
          await addBookCopy(newBookCopyData).unwrap();
          const addModal = window.bootstrap.Modal.getInstance(document.getElementById('addBookCopyModal'));
          addModal.hide();
          refetchBooksCopies();
        } catch (err) {
          console.error('Failed to add book copy:', err);
        }
    };

    const handleEditClick = (bookCopy) => {
        setSelectedBookCopy(bookCopy);
        setUpdateData({
            book_id: bookCopy.book_id,
            copy_number: bookCopy.copy_number,
            is_available: bookCopy.is_available,
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('updateBookCopyModal'));
        addModal.show();
    };

    

    const handleUpdate = async () => {
        if (!selectedBookCopy || !selectedBookCopy._id) {
            console.error('BookCopy ID is missing');
            return;
        }

        try {
            await updateBookCopy({
                _id: selectedBookCopy._id,
                ...updateData
            }).unwrap();
            const editModal = window.bootstrap.Modal.getInstance(document.getElementById('updateBookCopyModal'));
            editModal.hide();
            refetchBooksCopies();
        } catch (err) {
            console.error('Failed to update book copy:', err);
        }
    };

    const handleDeleteClick = async (bookCopyId) => {
        console.log("BOOK COPY ID:", bookCopyId);

        if (!bookCopyId) {
            console.error('BookCopy ID is missing');
            return;
        }

        try {
            await deleteBookCopy(bookCopyId).unwrap();
            refetchBooksCopies();
        } catch (err) {
            console.error('Failed to delete book copy:', err);
        }
    };
  
    return (
        <div class="container">
          <div class="page-inner">
            <div class="page-header">
              <h3 class="fw-bold mb-3">Books Copies</h3>
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
                  <a href="#">Books Copies List</a>
                </li>
              </ul>
            </div>
            <div class="row">
            <div class="col-md-12">
            <div class="card">
              { 
                (user.role === 'admin' || user.role === 'librarian') && (
                  <div class="card-header">
                    <div class="d-flex align-items-center">
                      <h4 class="card-title">Add BookCopy</h4>
                      <button
                        class="btn btn-primary btn-round ms-auto"
                        data-bs-target="#addBookCopyModal"
                        onClick={() => handleAddClick()}
                      >
                        <i class="fa fa-plus"></i>
                        Add BookCopy
                      </button>
                    </div>
                </div>
              )

              }
                
                  <div class="card-body">
                    <div
                      class="modal fade"
                      id="addBookCopyModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> New</span>
                              <span class="fw-light"> Book Copy </span>
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
                              Create a new book copy using this form, make sure you
                              fill them all
                            </p>
                            <form>
                              <div class="row">
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Book ID</label>
                                    <select
                                      id="addBookId"
                                      type="text"
                                      class="form-control"
                                      value={newBookCopyData.book_id}
                                      onChange={(e) => setNewBookCopyData({ ...newBookCopyData, book_id: e.target.value })}
                                      >
                                        <option value=''>Select a book</option>
                                        { booksArray.map(book => (
                                          <option key={book._id} value={book._id}>
                                          {book.title}
                                          </option>
                                        ))}
                                        </select>
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Copy Number</label>
                                    <input
                                      id="addCopyNumber"
                                      type="text"
                                      class="form-control"
                                      value={newBookCopyData.copy_number}
                                      onChange={(e) => setNewBookCopyData({ ...newBookCopyData, copy_number: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Is Available</label>
                                    <select
                                      id="addIsAvailable"
                                      type="text"
                                      class="form-control"
                                      value={newBookCopyData.is_available}
                                      onChange={(e) => setNewBookCopyData({ ...newBookCopyData, is_available: e.target.value })}
                                    >
                                        <option value="">Select Availability</option>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
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
                              onClick={handleAddBookCopy}
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
                      id="updateBookCopyModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> Update</span>
                              <span class="fw-light"> Book Copy </span>
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
                              Update book copy informations using this form.
                            </p>
                            <form>
                              <div class="row">
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Book ID</label>
                                    <input
                                      id="updateBookId"
                                      type="text"
                                      class="form-control"
                                      value={updateData.book_id || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, book_id: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Copy Number</label>
                                    <input
                                      id="updateCopyNumber"
                                      type="text"
                                      class="form-control"
                                      value={updateData.copy_number || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, copy_number: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label htmlFor='defaultSelect'>Is Available</label>
                                    <select
                                      id="updatePublishedYear"
                                      type="text"
                                      class="form-select form-control"
                                      value={updateData.is_available}
                                      onChange={(e) => setUpdateData({ ...updateData, is_available: e.target.value })}
                                      >
                                        <option value="">Select Availability</option>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                      </select>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div class="modal-footer border-0">
                            <button
                              type="button"
                              id="updateBookCopyButton"
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
                            <th>Book</th>
                            <th>Copy Number</th>
                            <th>Is Available</th>
                          </tr>
                        </thead>
                        <tbody>
                            {booksCopiesArray.map(bookCopy => (
                                <tr key={bookCopy._id}>
                                <td>{bookCopy.book_id.title}</td>
                                <td>{bookCopy.copy_number}</td>
                                <td>{bookCopy.is_available ? 'True' : 'False'}</td>
                                {
                                  (user.role === 'admin' || user.role === 'librarian') && (
                                    <td>
                                  <div class="form-button-action">
                                    <button
                                      type="button"
                                      data-bs-toggle="tooltip"
                                      title=""
                                      class="btn btn-link btn-primary btn-lg"
                                      data-original-title="Edit Task"
                                      onClick={() => handleEditClick(bookCopy)}
                                    >
                                      <i class="fa fa-edit"></i>
                                    </button>
                                    <button
                                      id="alert_demo_3_3"
                                      type="button"
                                      class="btn btn-link btn-danger"
                                      data-original-title="Remove"
                                      onClick={() => handleDeleteClick(bookCopy._id)}
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
  export default BooksCopies;