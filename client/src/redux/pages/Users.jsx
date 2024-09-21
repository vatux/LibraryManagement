import React, {useState, useEffect} from 'react'
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation, useAddUserMutation } from '../services/usersApiSlice';
import { Link } from 'react-router-dom';

const Users = () => {
    const { data, error, isLoading, refetch } = useGetUsersQuery();
    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateData, setUpdateData] = useState({ name: '', email: '', role: '' });
    const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: '' });
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const usersArray = Array.isArray(data?.data) ? data.data : [];

    const handleAddClick = () => {
        setNewUserData({
            name: '',
            email: '',
            password: '',
            role: ''
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('addUserModal'));
        addModal.show();
    };

    const handleAddUser = async () => {
        try {
          await addUser(newUserData).unwrap();
          const addModal = window.bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
          addModal.hide();
          refetch();
        } catch (err) {
          console.error('Failed to add user:', err);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setUpdateData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        const addModal = new window.bootstrap.Modal(document.getElementById('updateUserModal'));
        addModal.show();
    };

    

    const handleUpdate = async () => {
        if (!selectedUser || !selectedUser._id) {
            console.error('User ID is missing');
            return;
        }

        try {
            await updateUser({
                _id: selectedUser._id,
                ...updateData
            }).unwrap();
            const editModal = window.bootstrap.Modal.getInstance(document.getElementById('updateUserModal'));
            editModal.hide();
            refetch();
        } catch (err) {
            console.error('Failed to update user:', err);
        }
    };

    const handleDeleteClick = async (userId) => {
        console.log("USER ID:", userId);

        if (!userId) {
            console.error('User ID is missing');
            return;
        }

        try {
            await deleteUser(userId).unwrap();
            refetch();
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };
  
    return (
        <div class="container">
          <div class="page-inner">
            <div class="page-header">
              <h3 class="fw-bold mb-3">Users</h3>
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
                  <a href="#">Users List</a>
                </li>
              </ul>
            </div>
            <div class="row">
            <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex align-items-center">
                      <h4 class="card-title">Add User</h4>
                      <button
                        class="btn btn-primary btn-round ms-auto"
                        data-bs-target="#addUserModal"
                        onClick={() => handleAddClick()}
                      >
                        <i class="fa fa-plus"></i>
                        Add User
                      </button>
                    </div>
                </div>
                  <div class="card-body">
                    <div
                      class="modal fade"
                      id="addUserModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> New</span>
                              <span class="fw-light"> User </span>
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
                              Create a new user using this form, make sure you
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
                                      value={newUserData.name}
                                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Email</label>
                                    <input
                                      id="addEmail"
                                      type="text"
                                      class="form-control"
                                      value={newUserData.email}
                                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Password</label>
                                    <input
                                      id="addPassword"
                                      type="password"
                                      class="form-control"
                                      value={newUserData.password}
                                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-12">
                                  <div class="form-group form-group-default">
                                    <label>Role</label>
                                    <select
                                      id="addRole"
                                      type="text"
                                      class="form-select form-control"
                                      value={newUserData.role}
                                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                      >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="librarian">Librarian</option>
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
                              onClick={handleAddUser}
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
                      id="updateUserModal"
                      tabindex="-1"
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header border-0">
                            <h5 class="modal-title">
                              <span class="fw-mediumbold"> Update</span>
                              <span class="fw-light"> User </span>
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
                              Update user informations using this form.
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
                                <div class="col-md-6 pe-0">
                                  <div class="form-group form-group-default">
                                    <label>Email</label>
                                    <input
                                      id="updateEmail"
                                      type="text"
                                      class="form-control"
                                      value={updateData.email || ''}
                                      onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="form-group form-group-default">
                                    <label htmlFor='defaultSelect'>Role</label>
                                    <select
                                      id="updateRole"
                                      type="text"
                                      class="form-select form-control"
                                      value={updateData.role}
                                      onChange={(e) => setUpdateData({ ...updateData, role: e.target.value })}
                                      >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                        <option value="librarian">Librarian</option>
                                    </select>
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

                    <div class="table-responsive">
                      <table
                        id="add-row"
                        class="display table table-striped table-hover"
                      >
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                            {usersArray.map(user => (
                                <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                  <div class="form-button-action">
                                    <button
                                      type="button"
                                      data-bs-toggle="tooltip"
                                      title=""
                                      class="btn btn-link btn-primary btn-lg"
                                      data-original-title="Edit Task"
                                      onClick={() => handleEditClick(user)}
                                    >
                                      <i class="fa fa-edit"></i>
                                    </button>
                                    <button
                                      id="alert_demo_3_3"
                                      type="button"
                                      class="btn btn-link btn-danger"
                                      data-original-title="Remove"
                                      onClick={() => handleDeleteClick(user._id)}
                                    >
                                      <i class="fa fa-times"></i>
                                    </button>
                                  </div>
                                </td>
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
  export default Users;