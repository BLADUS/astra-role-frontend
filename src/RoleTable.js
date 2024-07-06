import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // подключение стилей

function RoleTable() {
  const [roles, setRoles] = useState([]);
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
  }, []);

  const fetchRoles = async () => {
    const response = await axios.get("/roles");
    setRoles(response.data);
  };

  const handleCreateRole = async () => {
    await axios.post("/roles", newRole);
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
    setShowCreateRoleModal(false); // скрыть модальное окно создания роли после создания
  };

  const handleDeleteRole = async (roleId) => {
    const response = await axios.get(`/roles/affected-users/${roleId}`);
    setAffectedUsers(response.data);
    setRoleIdToDelete(roleId);
    setShowDeleteModal(true);
  };

  const confirmDeleteRole = async () => {
    await axios.delete(`/roles/${roleIdToDelete}`);
    setShowDeleteModal(false);
    fetchRoles();
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
    await axios.post("/roles", editableRole);
    fetchRoles();
    setShowEditRoleModal(false);
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
        <button
          className="create-role-button"
          onClick={() => setShowCreateRoleModal(true)}
        >
          New Role
        </button>
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
              <tr key={role.roleId}>
                <td>{role.roleId}</td>
                <td>{role.roleName}</td>
                <td>{role.read_distribs ? "Yes" : "No"}</td>
                <td>{role.read_softs ? "Yes" : "No"}</td>
                <td>{role.read_errors ? "Yes" : "No"}</td>
                <td>{role.create_roles ? "Yes" : "No"}</td>
                <td>{role.delete_roles ? "Yes" : "No"}</td>
                <td>{role.edit_roles ? "Yes" : "No"}</td>
                <td>
                  {role.roleId !== 1 && role.roleId !== 2 && (
                    <>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteRole(role.roleId)}
                      >
                        delete
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleEditRole(role)}
                      >
                        edit
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showCreateRoleModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create Role</h2>
              <input
                type="text"
                placeholder="Role Name"
                value={newRole.roleName}
                onChange={(e) =>
                  setNewRole({ ...newRole, roleName: e.target.value })
                }
              />
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={newRole.read_distribs}
                    onChange={(e) =>
                      setNewRole({
                        ...newRole,
                        read_distribs: e.target.checked,
                      })
                    }
                  />
                  Read Distribs
                </label>
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <button className="create-button" onClick={handleCreateRole}>
                Create
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
              <h2>Affected Users</h2>
              <input
                type="text"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul>
                {filteredUsers.map((user) => (
                  <li key={user.userId}>{user.username}</li>
                ))}
              </ul>
              <div className="pagination-bar">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <span>
                  Page {currentPage} of{" "}
                  {Math.ceil(affectedUsers.length / usersPerPage)}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(affectedUsers.length / usersPerPage)
                  }
                >
                  &gt;
                </button>
              </div>
              <button className="confirm-button" onClick={confirmDeleteRole}>
                Confirm Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showEditRoleModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Role</h2>
              <input
                type="text"
                placeholder="Role Name"
                value={editableRole.roleName}
                onChange={(e) =>
                  setEditableRole({ ...editableRole, roleName: e.target.value })
                }
              />
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <button className="update-button" onClick={handleUpdateRole}>
                Update
              </button>
              <button className="cancel-button" onClick={handleCloseEditModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleTable;
