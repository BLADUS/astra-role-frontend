import React, { useState } from "react";
import { notification } from "antd";
import axios from "axios";

const CreateRoleModal = ({ visible, setVisible, fetchRoles }) => {
  const [newRole, setNewRole] = useState({
    roleName: "",
    read_distribs: false,
    read_softs: false,
    read_errors: false,
    create_roles: false,
    delete_roles: false,
    edit_roles: false,
  });

  const handleCreateRole = async () => {
    try {
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
        setVisible(false);
        notification.success({
          message: "Успех",
          description: "Роль успешно создана",
        });
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: error.response.data,
      });
    }
  };

  return (
    visible && (
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
          <button onClick={handleCreateRole}>Create</button>
          <button onClick={() => setVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  );
};

export default CreateRoleModal;
