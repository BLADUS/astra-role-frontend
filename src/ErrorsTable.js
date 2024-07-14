import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, notification } from "antd";

const ErrorsTable = () => {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    try {
      const response = await axios.get("/resources/errors");
      if (response.status === 200) {
        setErrors(response.data);
      } else {
        setErrors([]);
        notification.warning({
          message: "Информация",
          description: "Список ошибок пуст",
        });
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось получить список ошибок",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "errorId",
      key: "id",
    },
    {
      title: "Error Name",
      dataIndex: "errorName",
      key: "errorName",
    },
  ];

  return (
    <div>
      <h2>Errors Table</h2>
      <Table dataSource={errors} columns={columns} />
    </div>
  );
};

export default ErrorsTable;
