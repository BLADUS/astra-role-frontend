import React, { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";

const DeleteRoleModal = ({ visible, setVisible, roleId, affectedUsers, fetchRoles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); 
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(affectedUsers);
  }, [affectedUsers]);

  const confirmDeleteRole = async () => {
    try {
      await axios.delete(`/roles/${roleId}`);
      fetchRoles();
      setVisible(false);
      notification.success({
        message: "Успех",
        description: "Роль удалена",
      });
    } catch (error) {
      console.error("Failed to delete role:", error);
      notification.error({
        message: "Ошибка",
        description: "Не удалось удалить роль.",
      });
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterUsers = (term) => {
    setSearchTerm(term);
    const filteredUsers = affectedUsers.filter((user) =>
      user.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
    setCurrentPage(1); 
  };

  const getCurrentUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  };

  return (
    visible && (
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
            onChange={(e) => filterUsers(e.target.value)}
          />
          {affectedUsers.length === 0 ? (
            <p>No users with this role were found.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentUsers().map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className="delete-button" onClick={confirmDeleteRole}>
            Delete
          </button>
          <button className="cancel-button" onClick={() => setVisible(false)}>
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
              { length: Math.ceil(filteredUsers.length / usersPerPage) },
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
                currentPage === Math.ceil(filteredUsers.length / usersPerPage)
              }
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteRoleModal;
