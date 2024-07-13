import React, { useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button, notification } from "antd";
import axios from "axios";

const EditRoleModal = ({ visible, setVisible, editableRole, handleUpdateRole, setEditableRole }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(editableRole);
    }
  }, [visible, editableRole, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedRole = { ...editableRole, ...values };
      await axios.patch(`/roles/${editableRole.roleId}`, updatedRole); 
      handleUpdateRole(); 
      setVisible(false);
      notification.success({
        message: "Успех",
        description: "Роль успешно обновлена",
      });
    } catch (error) {
      console.log("Validate Failed:", error);
      notification.error({
        message: "Ошибка",
        description: "Не удалось обновить роль",
      });
    }
  };

  return (
    <Modal
      title="Edit Role"
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setEditableRole(null); // Сбрасываем editableRole при закрытии модального окна
      }}
      footer={[
        <Button key="back" onClick={() => {
          setVisible(false);
          setEditableRole(null); // Сбрасываем editableRole при закрытии модального окна
        }}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Сохранить
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="edit_role_form">
        <Form.Item
          name="roleName"
          label="Название роли"
          rules={[{ required: true, message: "Введите название роли!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="read_distribs" valuePropName="checked">
          <Checkbox>Read Distribs</Checkbox>
        </Form.Item>
        <Form.Item name="read_softs" valuePropName="checked">
          <Checkbox>Read Softs</Checkbox>
        </Form.Item>
        <Form.Item name="read_errors" valuePropName="checked">
          <Checkbox>Read Errors</Checkbox>
        </Form.Item>
        <Form.Item name="create_roles" valuePropName="checked">
          <Checkbox>Create Roles</Checkbox>
        </Form.Item>
        <Form.Item name="delete_roles" valuePropName="checked">
          <Checkbox>Delete Roles</Checkbox>
        </Form.Item>
        <Form.Item name="edit_roles" valuePropName="checked">
          <Checkbox>Edit Roles</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRoleModal;
