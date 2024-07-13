import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notification } from 'antd';

const AffectedUsersComponent = ({ roleId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAffectedUsers = async () => {
      try {
        const response = await axios.get(`/roles/affected-users/${roleId}`);
        if (response.status === 204) {
          notification.info({
            message: "Информация",
            description: "Пользователей с такой ролью найдено не было",
          });
          setUsers([]);
        } else {
          setUsers(response.data);
        }
      } catch (error) {
        notification.error({
          message: "Ошибка",
          description: "При получении списка пользователей с этой ролью произошла ошибка",
        });
        console.error('Error fetching affected users:', error);
      }
    };

    fetchAffectedUsers();
  }, [roleId]);

  return (
    <div>
      <h2>Affected Users</h2>
      {users.length === 0 ? (
        <p>No users with this role were found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.username}</td>
                <td>{user.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AffectedUsersComponent;
