import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({
    roleName: '',
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
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20); 

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await axios.get('/roles');
    setRoles(response.data);
  };

  const handleCreateRole = async () => {
    await axios.post('/roles', newRole);
    fetchRoles();
    setNewRole({
      roleName: '',
      read_distribs: false,
      read_softs: false,
      read_errors: false,
      create_roles: false,
      delete_roles: false,
      edit_roles: false,
    });
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = affectedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredUsers = currentUsers.filter((user) =>
    user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="role-table-container">
      <h1>Roles</h1>
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
          {roles.map(role => (
            <tr key={role.roleId}>
              <td>{role.roleId}</td>
              <td>{role.roleName}</td>
              <td>{role.read_distribs ? 'Yes' : 'No'}</td>
              <td>{role.read_softs ? 'Yes' : 'No'}</td>
              <td>{role.read_errors ? 'Yes' : 'No'}</td>
              <td>{role.create_roles ? 'Yes' : 'No'}</td>
              <td>{role.delete_roles ? 'Yes' : 'No'}</td>
              <td>{role.edit_roles ? 'Yes' : 'No'}</td>
              <td>
                {role.roleId !== 1 && role.roleId !== 2 && (
                  <button onClick={() => handleDeleteRole(role.roleId)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="create-role-section">
        <h2>Create Role</h2>
        <input type="text" placeholder="Role Name" value={newRole.roleName} onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })} />
        <div>
          <label>
            <input type="checkbox" checked={newRole.read_distribs} onChange={(e) => setNewRole({ ...newRole, read_distribs: e.target.checked })} />
            Read Distribs
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={newRole.read_softs} onChange={(e) => setNewRole({ ...newRole, read_softs: e.target.checked })} />
            Read Softs
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={newRole.read_errors} onChange={(e) => setNewRole({ ...newRole, read_errors: e.target.checked })} />
            Read Errors
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={newRole.create_roles} onChange={(e) => setNewRole({ ...newRole, create_roles: e.target.checked })} />
            Create Roles
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={newRole.delete_roles} onChange={(e) => setNewRole({ ...newRole, delete_roles: e.target.checked })} />
            Delete Roles
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={newRole.edit_roles} onChange={(e) => setNewRole({ ...newRole, edit_roles: e.target.checked })} />
            Edit Roles
          </label>
        </div>
        <button onClick={handleCreateRole}>Create</button>
      </div>

      {showDeleteModal && (
        <div className="modal">
          <h2>Affected Users</h2>
          <ul>
            {filteredUsers.map(user => (
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
              Page {currentPage} of {Math.ceil(affectedUsers.length / usersPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(affectedUsers.length / usersPerPage)
              }
            >
              &gt;
            </button>
          </div>
          <button onClick={confirmDeleteRole}>Confirm Delete</button>
          <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default RoleTable;
