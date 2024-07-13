import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { notification } from "antd";
import "antd/dist/reset.css";
import CreateRoleModal from "./CreateRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import EditRoleModal from "./EditRoleModal";

function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [sessionRole, setSessionRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);
  const [affectedUsers, setAffectedUsers] = useState([]);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
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
    try {
      const response = await axios.get("/roles");
      if (response.status === 204) {
        setRoles([]);
        notification.warning({
          message: "Информация",
          description: "Список ролей пуст",
        });
      } else if (response.status === 200) {
        setRoles(response.data);
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось получить список ролей",
      });
    }
  };

  const fetchSessionRole = async () => {
    try {
      const response = await axios.get("/roles/session-role");
      if (response.status === 200) {
        setSessionRole(response.data);
      } else {
        setSessionRole(null);
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось получить сессию роли",
      });
    }
  };

  const fetchAffectedUsers = async (roleId) => {
    try {
      const response = await axios.get(`/roles/affected-users/${roleId}`);
      if (response.status === 204) {
        notification.info({
          message: "Информация",
          description: "Нет пользователей с этой ролью.",
        });
        setAffectedUsers([]);
      } else {
        setAffectedUsers(response.data);
      }
      setRoleIdToDelete(roleId);
      setShowDeleteModal(true);
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description:
          "Не удалось получить список пользователей, затронутых ролью",
      });
    }
  };

  const handleSetSessionRole = async (roleId) => {
    try {
      await axios.post(`/roles/set-role/${roleId}`);
      fetchSessionRole();
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось установить сессию роли",
      });
    }
  };

  const handleDeleteRole = (roleId) => {
    fetchAffectedUsers(roleId);
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

  const handleUpdateRole = async (updatedRole) => {
    try {
      await axios.patch(`/roles`, updatedRole);
      fetchRoles();
      setShowEditRoleModal(false);
      notification.success({
        message: "Успех",
        description: "Роль успешно обновлена",
      });
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось обновить роль",
      });
    }
  };

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
                  {sessionRole &&
                    sessionRole.delete_roles &&
                    role.roleName !== "user" &&
                    role.roleName !== "admin" && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteRole(role.roleId)}
                      >
                        Delete
                      </button>
                    )}
                  {sessionRole &&
                    sessionRole.edit_roles &&
                    role.roleName !== "user" &&
                    role.roleName !== "admin" && (
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

      <CreateRoleModal
        visible={showCreateRoleModal}
        setVisible={setShowCreateRoleModal}
        fetchRoles={fetchRoles}
      />

      <DeleteRoleModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        roleId={roleIdToDelete}
        affectedUsers={affectedUsers}
        fetchRoles={fetchRoles}
      />

      <EditRoleModal
        visible={showEditRoleModal}
        setVisible={setShowEditRoleModal}
        role={editableRole}
        handleUpdateRole={handleUpdateRole}
        handleClose={handleCloseEditModal}
      />
    </div>
  );
}

export default RoleTable;
