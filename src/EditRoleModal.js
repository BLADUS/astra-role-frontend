import React from "react";
import { Modal, Form, Input, Checkbox } from "antd";

const EditRoleModal = ({ visible, setVisible, role, handleUpdateRole, handleClose }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const updatedRole = { ...role, ...values };
    handleUpdateRole(updatedRole);
  };

  return (
    <Modal
      title="Edit Role"
      visible={visible}
      onCancel={handleClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        initialValues={role}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="roleName"
          label="Role Name"
          rules={[{ required: true, message: "Please input the role name!" }]}
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
