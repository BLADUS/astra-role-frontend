import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [sessionRole, setSessionRole] = useState(null);
  const [newRole, setNewRole] = useState({
    roleName: "",
    read_distribs: false,
    read_softs: false,
    read_errors: false,
    create_roles: false,
    delete_roles: false,
    edit_roles: false,
  });
  const [affectedUsers, setAffectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editableRole, setEditableRole] = useState({
    roleId: null,
    roleName: "",
    read_distribs: false,
    read_softs: false,
    read_errors: false,
    create_roles: false,
    delete_roles: false,
    edit_roles: false,
  });

  useEffect(() => {
    fetchRoles();
    fetchSessionRole();
  }, []);

  const fetchRoles = async () => {
    const response = await axios.get("/roles");
    setRoles(response.data);
  };

  const fetchSessionRole = async () => {
    const response = await axios.get("/roles/session-role");
    if (response.status === 200) {
      setSessionRole(response.data);
    } else {
      setSessionRole(null);
    }
  };

  const handleSetSessionRole = async (roleId) => {
    await axios.post(`/roles/set-role/${roleId}`);
    fetchSessionRole();
  };

  const handleCreateRole = async () => {
    const response = await axios.post("/roles", newRole);
    if (response.status === 200) {
      fetchRoles();
      setNewRole({
        roleName: "",
        read_distribs: false,
        read_softs: false,
        read_errors: false,
        create_roles: false,
        delete_roles: false,
        edit_roles: false,
      });
      setShowCreateRoleModal(false);
    } else {
      alert(response.data);
    }
  };

  const handleDeleteRole = async (roleId) => {
    const response = await axios.get(`/roles/affected-users/${roleId}`);
    setAffectedUsers(response.data);
    setRoleIdToDelete(roleId);
    setShowDeleteModal(true);
  };

  const confirmDeleteRole = async () => {
    const response = await axios.delete(`/roles/${roleIdToDelete}`);
    if (response.status === 200) {
      setShowDeleteModal(false);
      fetchRoles();
    } else {
      alert(response.data);
    }
  };

  const handleEditRole = (role) => {
    setEditableRole(role);
    setShowEditRoleModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditRoleModal(false);
    setEditableRole({
      roleId: null,
      roleName: "",
      read_distribs: false,
      read_softs: false,
      read_errors: false,
      create_roles: false,
      delete_roles: false,
      edit_roles: false,
    });
  };

  const handleUpdateRole = async () => {
    const response = await axios.patch("/roles", editableRole);
    if (response.status === 200) {
      fetchRoles();
      setShowEditRoleModal(false);
    } else {
      alert(response.data);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = affectedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredUsers = currentUsers.filter((user) =>
    user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <div className="role-table-container">
        <h1>Roles</h1>
        {sessionRole && sessionRole.create_roles && (
          <button
            className="create-role-button"
            onClick={() => setShowCreateRoleModal(true)}
          >
            New Role
          </button>
        )}
        <table className="role-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Role Name</th>
              <th>Read Distribs</th>
              <th>Read Softs</th>
              <th>Read Errors</th>
              <th>Create Roles</th>
              <th>Delete Roles</th>
              <th>Edit Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role.roleId}
                className={
                  sessionRole && role.roleId === sessionRole.roleId
                    ? "highlight"
                    : ""
                }
              >
                <td>{role.roleId}</td>
                <td>{role.roleName}</td>
                <td>{role.read_distribs ? "Yes" : "No"}</td>
                <td>{role.read_softs ? "Yes" : "No"}</td>
                <td>{role.read_errors ? "Yes" : "No"}</td>
                <td>{role.create_roles ? "Yes" : "No"}</td>
                <td>{role.delete_roles ? "Yes" : "No"}</td>
                <td>{role.edit_roles ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="set-role-button"
                    onClick={() => handleSetSessionRole(role.roleId)}
                  >
                    Set Role
                  </button>
                  {sessionRole && sessionRole.delete_roles && role.roleName !== 'user' && role.roleName !== 'admin' && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteRole(role.roleId)}
                    >
                      Delete
                    </button>
                  )}
                  {sessionRole && sessionRole.edit_roles && role.roleName !== 'user' && role.roleName !== 'admin' && (
                    <button
                      className="edit-button"
                      onClick={() => handleEditRole(role)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateRoleModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Role</h2>
            <label>Role Name</label>
            <input
              type="text"
              value={newRole.roleName}
              onChange={(e) =>
                setNewRole({ ...newRole, roleName: e.target.value })
              }
            />
            <label>
              <input
                type="checkbox"
                checked={newRole.read_distribs}
                onChange={(e) =>
                  setNewRole({ ...newRole, read_distribs: e.target.checked })
                }
              />
              Read Distribs
            </label>
            <label>
              <input
                type="checkbox"
                checked={newRole.read_softs}
                onChange={(e) =>
                  setNewRole({ ...newRole, read_softs: e.target.checked })
                }
              />
              Read Softs
            </label>
            <label>
              <input
                type="checkbox"
                checked={newRole.read_errors}
                onChange={(e) =>
                  setNewRole({ ...newRole, read_errors: e.target.checked })
                }
              />
              Read Errors
            </label>
            <label>
              <input
                type="checkbox"
                checked={newRole.create_roles}
                onChange={(e) =>
                  setNewRole({ ...newRole, create_roles: e.target.checked })
                }
              />
              Create Roles
            </label>
            <label>
              <input
                type="checkbox"
                checked={newRole.delete_roles}
                onChange={(e) =>
                  setNewRole({ ...newRole, delete_roles: e.target.checked })
                }
              />
              Delete Roles
            </label>
            <label>
              <input
                type="checkbox"
                checked={newRole.edit_roles}
                onChange={(e) =>
                  setNewRole({ ...newRole, edit_roles: e.target.checked })
                }
              />
              Edit Roles
            </label>
            <button className="save-button" onClick={handleCreateRole}>
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowCreateRoleModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Delete Role</h2>
            <p>
              Are you sure you want to delete this role? It is assigned to the
              following users:
            </p>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="delete-button" onClick={confirmDeleteRole}>
              Delete
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <div className="pagination">
              <button
                className="pagination-arrow"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
              {Array.from(
                { length: Math.ceil(affectedUsers.length / usersPerPage) },
                (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                )
              )}
              <button
                className="pagination-arrow"
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(affectedUsers.length / usersPerPage)
                }
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditRoleModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Role</h2>
            <label>Role Name</label>
            <input
              type="text"
              value={editableRole.roleName}
              onChange={(e) =>
                setEditableRole({ ...editableRole, roleName: e.target.value })
              }
            />
            <label>
              <input
                type="checkbox"
                checked={editableRole.read_distribs}
                onChange={(e) =>
                  setEditableRole({
                    ...editableRole,
                    read_distribs: e.target.checked,
                  })
                }
              />
              Read Distribs
            </label>
            <label>
              <input
                type="checkbox"
                checked={editableRole.read_softs}
                onChange={(e) =>
                  setEditableRole({
                    ...editableRole,
                    read_softs: e.target.checked,
                  })
                }
              />
              Read Softs
            </label>
            <label>
              <input
                type="checkbox"
                checked={editableRole.read_errors}
                onChange={(e) =>
                  setEditableRole({
                    ...editableRole,
                    read_errors: e.target.checked,
                  })
                }
              />
              Read Errors
            </label>
            <label>
              <input
                type="checkbox"
                checked={editableRole.create_roles}
                onChange={(e) =>
                  setEditableRole({
                    ...editableRole,
                    create_roles: e.target.checked,
                  })
                }
              />
              Create Roles
            </label>
            <label>
              <input
                type="checkbox"
                checked={editableRole.delete_roles}
                onChange={(e) =>
                  setEditableRole({
                    ...editableRole,
                    delete_roles: e.target.checked,
                  })
                }
              />
              Delete Roles
            </label>
            <label>
              <input
                type="checkbox"
                checked={editableRole.edit_roles}
                onChange={(e) =>
                  setEditableRole({
                    ...editableRole,
                    edit_roles: e.target.checked,
                  })
                }
              />
              Edit Roles
            </label>
            <button className="save-button" onClick={handleUpdateRole}>
              Save
            </button>
            <button className="cancel-button" onClick={handleCloseEditModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleTable;
