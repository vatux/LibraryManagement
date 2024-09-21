import React, {useState, useEffect} from 'react'
import { useAddAuthorMutation, useDeleteAuthorMutation, useGetAuthorsQuery, useUpdateAuthorMutation } from '../services/authorsApiSlice';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../services/authSlice";

const Authors = () => {
    
    const user = useSelector(selectCurrentUser);

    const { data, error, isLoading, refetch } = useGetAuthorsQuery();
    const [addAuthor] = useAddAuthorMutation();
    const [updateAuthor] = useUpdateAuthorMutation();
    const [deleteAuthor] = useDeleteAuthorMutation();
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [updateData, setUpdateData] = useState({ name: '', biography: '', birth_date: '' });
    const [newAuthorData, setNewAuthorData] = useState({ name: '', biography: '', birth_date: '' });
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const authorArray = Array.isArray(data?.data) ? data.data : [];

    const handleAddClick = () => {
        setNewAuthorData({
            name: '',
            biography: '',
            birth_date: '',
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('addAuthorModal'));
        addModal.show();
    };

    const handleAddAuthor = async () => {
        try {
          await addAuthor(newAuthorData).unwrap();
          const addModal = window.bootstrap.Modal.getInstance(document.getElementById('addAuthorModal'));
          addModal.hide();
          refetch();
        } catch (err) {
          console.error('Failed to add author:', err);
        }
    };

    const handleEditClick = (author) => {
        setSelectedAuthor(author);
        setUpdateData({
            name: author.name,
            biography: author.biography,
            birth_date: author.birth_date,
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('updateAuthorModal'));
        addModal.show();
    };

    

    const handleUpdate = async () => {
        if (!selectedAuthor || !selectedAuthor._id) {
            console.error('Author ID is missing');
            return;
        }

        try {
            await updateAuthor({
                _id: selectedAuthor._id,
                ...updateData
            }).unwrap();
            const editModal = window.bootstrap.Modal.getInstance(document.getElementById('updateAuthorModal'));
            editModal.hide();
            refetch();
        } catch (err) {
            console.error('Failed to update author:', err);
        }
    };

    const handleDeleteClick = async (authorId) => {
        console.log("Author ID:", authorId);

        if (!authorId) {
            console.error('Author ID is missing');
            return;
        }

        try {
            await deleteAuthor(authorId).unwrap();
            refetch();
        } catch (err) {
            console.error('Failed to delete author:', err);
        }
    };
  
    return (
        <div class="container">
          <div class="page-inner">
            <div class="page-header">
              <h3 class="fw-bold mb-3">Authors</h3>
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
                  <a href="#">Authors List</a>
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
                      <h4 class="card-title">Add Author</h4>
                      <button
                        class="btn btn-primary btn-round ms-auto"
                        data-bs-target="#addAuthorModal"
                        onClick={() => handleAddClick()}
                      >
                        <i class="fa fa-plus"></i>
                        Add Author
                      </button>
                    </div>
                </div>
              )

              }
                
                  <div class="card-body">
                    <div
                      class="modal fade"
                      id="addAuthorModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> New</span>
                              <span class="fw-light"> Author </span>
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
                              Create a new author using this form, make sure you
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
                                      value={newAuthorData.name}
                                      onChange={(e) => setNewAuthorData({ ...newAuthorData, name: e.target.value })}
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
                                      value={newAuthorData.biography}
                                      onChange={(e) => setNewAuthorData({ ...newAuthorData, biography: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Birth Date</label>
                                    <input
                                      id="addBirthDate"
                                      type="date"
                                      class="form-control"
                                      value={newAuthorData.birth_date}
                                      onChange={(e) => setNewAuthorData({ ...newAuthorData, birth_date: e.target.value })}
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
                              onClick={handleAddAuthor}
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
                      id="updateAuthorModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> Update</span>
                              <span class="fw-light"> Author </span>
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
                              Update author informations using this form.
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
                              id="updateAuthorButton"
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
                            {authorArray.map(author => (
                                <tr key={author._id}>
                                <td>{author.name}</td>
                                <td>{author.biography}</td>
                                <td>{new Date(author.birth_date).toLocaleString()}</td>
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
                                      onClick={() => handleEditClick(author)}
                                    >
                                      <i class="fa fa-edit"></i>
                                    </button>
                                    <button
                                      id="alert_demo_3_3"
                                      type="button"
                                      class="btn btn-link btn-danger"
                                      data-original-title="Remove"
                                      onClick={() => handleDeleteClick(author._id)}
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
  export default Authors;