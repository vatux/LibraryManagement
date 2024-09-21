import React, {useState, useEffect} from 'react'
import { useAddBookMutation, useDeleteBookMutation, useGetBooksQuery, useUpdateBookMutation } from '../services/booksApiSlice';
import { useAddBooksCopiesMutation, useDeleteBooksCopiesMutation, useGetBooksCopiesQuery, useUpdateBooksCopiesMutation } from '../services/booksCopiesApiSlice';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../services/authSlice";
import { useAddLoansMutation } from '../services/loansApiSlice';

const Books = () => {
    const currentUser = useSelector(selectCurrentUser);
    const userId = currentUser?._id;

    const { data: booksData, error: booksError, isLoading: booksIsLoading, refetch: refetchBooks } = useGetBooksQuery();
    const { data: booksCopiesData, error: booksCopiesError, isLoading: booksCopiesIsLoading, refetch: refetchBooksCopies } = useGetBooksCopiesQuery();
    const [addBook] = useAddBookMutation();
    const [updateBook] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();
    const [selectedBook, setSelectedBook] = useState(null);
    const [updateData, setUpdateData] = useState({ title: '', author: '', published_year: '', genre: '', isbn: '', quantity: '' });
    const [newBookData, setNewBookData] = useState({ title: '', author: '', published_year: '', genre: '', isbn: '', quantity: '' });
    const [addLoan] = useAddLoansMutation();
    const [newLoanData, setNewLoanData] = useState({ user_id: '', book_id:'', loan_date:'', return_date:'', returned_at:'', status:'' });
    const [borrowedBook, setBorrowedBook] = useState(null);

    if (booksCopiesIsLoading) return <p>Loading BooksCopies...</p>;
    if (booksCopiesError) return <p>Error BooksCopies: {booksCopiesError.message}</p>;

    if (booksIsLoading) return <p>Loading Books...</p>;
    if (booksError) return <p>Error Books: {booksError.message}</p>;
  
    const booksCopiesArray = Array.isArray(booksCopiesData?.data) ? booksCopiesData.data : [];
    const booksArray = Array.isArray(booksData?.data) ? booksData.data : [];

    const handleAddClick = () => {
        setNewBookData({
            title: '',
            author: '',
            published_year: '',
            genre: '',
            isbn: '',
            quantity: ''
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('addBookModal'));
        addModal.show();
    };

    const handleAddBook = async () => {
        try {
          await addBook(newBookData).unwrap();
          const addModal = window.bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
          addModal.hide();
          refetchBooks();
        } catch (err) {
          console.error('Failed to add book:', err);
        }
    };

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setUpdateData({
            title: book.title,
            author: book.author,
            published_year: book.published_year,
            genre: book.genre,
            isbn: book.isbn,
            quantity: book.quantity,
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('updateBookModal'));
        addModal.show();
    };

    

    const handleUpdate = async () => {
        if (!selectedBook || !selectedBook._id) {
            console.error('Book ID is missing');
            return;
        }

        try {
            await updateBook({
                _id: selectedBook._id,
                ...updateData
            }).unwrap();
            const editModal = window.bootstrap.Modal.getInstance(document.getElementById('updateBookModal'));
            editModal.hide();
            refetchBooks();
        } catch (err) {
            console.error('Failed to update book:', err);
        }
    };

    const handleDeleteClick = async (bookId) => {
        console.log("BOOK ID:", bookId);

        const existingBookCopy = booksCopiesArray.find(copy => copy.book_id === bookId);

        if (!bookId) {
            console.error('Book ID is missing');
            return;
        }

        if (existingBookCopy) {
          alert('This book cannot be deleted because it has existing copies.');
          return;
      }

        try {
            await deleteBook(bookId).unwrap();
            refetchBooks();
        } catch (err) {
            console.error('Failed to delete book:', err);
        }
    };

    const handleBorrowClick = (book) => {
      setBorrowedBook(book);
      setNewLoanData({
          user_id: '',
          book_id: '',
          loan_date: '',
          return_date: '',
          returned_at: '',
          status: ''
      });
      const addLoanModal = new window.bootstrap.Modal(document.getElementById('addLoanModal'));
      addLoanModal.show();
  };

    const handleAddBorrow = async () => {
      try {
          await addLoan({ user_id: userId, book_id: borrowedBook._id, loan_date: new Date(), return_date: newLoanData.return_date }).unwrap();
          const addLoanModal = window.bootstrap.Modal.getInstance(document.getElementById('addLoanModal'));
          addLoanModal.hide();
          refetchBooks();
      } catch (error) {
        console.error('Failed to borrow book:', error);
      }
    };
  
    return (
        <div class="container">
          <div class="page-inner">
            <div class="page-header">
              <h3 class="fw-bold mb-3">Books</h3>
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
                  <a href="#">Books List</a>
                </li>
              </ul>
            </div>
            <div class="row">
            <div class="col-md-12">
            <div class="card">
              { 
                (currentUser.role === 'admin' || currentUser.role === 'librarian') && (
                  <div class="card-header">
                    <div class="d-flex align-items-center">
                      <h4 class="card-title">Add Book</h4>
                      <button
                        class="btn btn-primary btn-round ms-auto"
                        data-bs-target="#addBookModal"
                        onClick={() => handleAddClick()}
                      >
                        <i class="fa fa-plus"></i>
                        Add Book
                      </button>
                    </div>
                </div>
              )

              }
                
                  <div class="card-body">
                    <div
                      class="modal fade"
                      id="addBookModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> New</span>
                              <span class="fw-light"> Book </span>
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
                              Create a new book using this form, make sure you
                              fill them all
                            </p>
                            <form>
                              <div class="row">
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Title</label>
                                    <input
                                      id="addTitle"
                                      type="text"
                                      class="form-control"
                                      value={newBookData.title}
                                      onChange={(e) => setNewBookData({ ...newBookData, title: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Author</label>
                                    <input
                                      id="addAuthor"
                                      type="text"
                                      class="form-control"
                                      value={newBookData.author}
                                      onChange={(e) => setNewBookData({ ...newBookData, author: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Published Year</label>
                                    <input
                                      id="addPublishedYear"
                                      type="date"
                                      class="form-control"
                                      value={newBookData.published_year}
                                      onChange={(e) => setNewBookData({ ...newBookData, published_year: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Genre</label>
                                    <input
                                      id="addGenre"
                                      type="text"
                                      class="form-select form-control"
                                      value={newBookData.role}
                                      onChange={(e) => setNewBookData({ ...newBookData, genre: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>ISBN</label>
                                    <input
                                      id="addIsbn"
                                      type="text"
                                      class="form-select form-control"
                                      value={newBookData.isbn}
                                      onChange={(e) => setNewBookData({ ...newBookData, isbn: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Quantity</label>
                                    <input
                                      id="addGenre"
                                      type="text"
                                      class="form-select form-control"
                                      value={newBookData.quantity}
                                      onChange={(e) => setNewBookData({ ...newBookData, quantity: e.target.value })}
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
                              onClick={handleAddBook}
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
                      id="updateBookModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> Update</span>
                              <span class="fw-light"> Book </span>
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
                              Update book informations using this form.
                            </p>
                            <form>
                              <div class="row">
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Title</label>
                                    <input
                                      id="updateTitle"
                                      type="text"
                                      class="form-control"
                                      value={updateData.title || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Author</label>
                                    <input
                                      id="updateAuthor"
                                      type="text"
                                      class="form-control"
                                      value={updateData.author || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, author: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label htmlFor='defaultSelect'>Published Year</label>
                                    <input
                                      id="updatePublishedYear"
                                      type="date"
                                      class="form-select form-control"
                                      value={updateData.published_year}
                                      onChange={(e) => setUpdateData({ ...updateData, published_year: e.target.value })}
                                      />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Genre</label>
                                    <input
                                      id="updateGenre"
                                      type="text"
                                      class="form-control"
                                      value={updateData.genre || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, genre: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>ISBN</label>
                                    <input
                                      id="updateIsbn"
                                      type="text"
                                      class="form-control"
                                      value={updateData.isbn || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, isbn: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Quantity</label>
                                    <input
                                      id="updateQuantity"
                                      type="text"
                                      class="form-control"
                                      value={updateData.quantity || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, quantity: e.target.value })}
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div class="modal-footer border-0">
                            <button
                              type="button"
                              id="updateUserButton"
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
                              <span class="fw-mediumbold"> Borrow</span>
                              <span class="fw-light"> Book </span>
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
                            <form>
                              <div class="row">
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Return Date</label>
                                    <input
                                      id="returnDate"
                                      type="date"
                                      class="form-control"
                                      value={newLoanData.return_date}
                                      onChange={(e) => setNewLoanData({ ...newLoanData, return_date: e.target.value })}
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
                              onClick={handleAddBorrow}
                            >
                              Borrow
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
                            <th>Title</th>
                            <th>Author</th>
                            <th>Published Year</th>
                            <th>Genre</th>
                            <th>ISBN</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                            {booksArray.map(book => (
                                <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{new Date(book.published_year).toLocaleDateString()}</td>
                                <td>{book.genre}</td>
                                <td>{book.isbn}</td>
                                <td>{book.quantity}</td>
                                <td><button class="btn btn-primary" 
                                    onClick={() => handleBorrowClick(book)}
                                    disabled={book.quantity <= 0}>
                                    <span class="btn-label">
                                    <i class="fa fa-bookmark"></i>
                                    </span>
                                    Borrow
                                    </button></td>
                                {
                                  (currentUser.role === 'admin' || currentUser.role === 'librarian') && (
                                    <td>
                                  <div class="form-button-action">
                                    <button
                                      type="button"
                                      data-bs-toggle="tooltip"
                                      title=""
                                      class="btn btn-link btn-primary btn-lg"
                                      data-original-title="Edit Task"
                                      onClick={() => handleEditClick(book)}
                                    >
                                      <i class="fa fa-edit"></i>
                                    </button>
                                    <button
                                      id="alert_demo_3_3"
                                      type="button"
                                      class="btn btn-link btn-danger"
                                      data-original-title="Remove"
                                      onClick={() => handleDeleteClick(book._id)}
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
  export default Books;