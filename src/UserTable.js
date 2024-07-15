import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, notification } from "antd";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [sessionUser, setSessionUser] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchSessionUser();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/users");
            if (response.status === 204) {
                setUsers([]);
                notification.warning({
                    message: "Информация",
                    description: "Список пользователей пуст",
                });
            } else if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: "Не удалось получить список пользователей",
            });
        }
    };

    const fetchSessionUser = async () => {
        try {
            const response = await axios.get("/users/session-user");
            if (response.status === 200) {
                setSessionUser(response.data);
            } else {
                setSessionUser(null);
            }
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: "Не удалось получить текущего пользователя сессии",
            });
        }
    };

    const handleSetSessionUser = async (userId) => {
        try {
            await axios.post(`/users/set-user/${userId}`);
            fetchSessionUser(); 
            fetchUsers(); 
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: "Не удалось установить текущего пользователя сессии",
            });
        }
    };

    const columns = [
        {
            title: "User ID",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Role ID",
            dataIndex: "roleId",
            key: "roleId",
        },
        {
            title: "Weight",
            dataIndex: "weight",
            key: "weight",
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Button onClick={() => handleSetSessionUser(record.userId)}>
                    Set Session User
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Users Table</h2>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="userId"
                rowClassName={(record) =>
                    sessionUser && record.userId === sessionUser.userId ? "highlight" : ""
                }
            />
            {sessionUser && (
                <div>
                    <h3>Current Session User: {sessionUser.username}</h3>
                </div>
            )}
        </div>
    );
};

export default UserTable;
