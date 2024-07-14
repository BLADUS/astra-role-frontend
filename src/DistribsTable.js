import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, notification } from "antd";

const DistribsTable = () => {
  const [distribs, setDistribs] = useState([]);

  useEffect(() => {
    fetchDistribs();
  }, []);

  const fetchDistribs = async () => {
    try {
      const response = await axios.get("resources/distribs");
      if (response.status === 200) {
        setDistribs(response.data);
      } else {
        setDistribs([]);
        notification.warning({
          message: "Информация",
          description: "Список дистрибутивов пуст",
        });
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось получить список дистрибутивов",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "distribId",
      key: "id",
    },
    {
      title: "Distrib Name",
      dataIndex: "distribName",
      key: "distribName",
    },
  ];

  return (
    <div>
      <h2>Distribs Table</h2>
      <Table dataSource={distribs} columns={columns} />
    </div>
  );
};

export default DistribsTable;
