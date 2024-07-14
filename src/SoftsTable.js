import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, notification } from "antd";

const SoftsTable = () => {
  const [softs, setSofts] = useState([]);

  useEffect(() => {
    fetchSofts();
  }, []);

  const fetchSofts = async () => {
    try {
      const response = await axios.get("resources/softs");
      if (response.status === 200) {
        setSofts(response.data);
      } else {
        setSofts([]);
        notification.warning({
          message: "Информация",
          description: "Список программных продуктов пуст",
        });
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: "Не удалось получить список программных продуктов",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "softId",
      key: "id",
    },
    {
      title: "Soft Name",
      dataIndex: "softName",
      key: "softName",
    },

  ];

  return (
    <div>
      <h2>Softs Table</h2>
      <Table dataSource={softs} columns={columns} />
    </div>
  );
};

export default SoftsTable;
