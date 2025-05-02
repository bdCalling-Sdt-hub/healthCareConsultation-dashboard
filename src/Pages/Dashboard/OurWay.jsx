import {
  Spin,
  Table,
  Typography,
  Button,
  Modal,
  List,
  Form,
  Input,
  message,
} from "antd";
import {
  useEditOurWayMutation,
  useGetOurWaysQuery,
} from "../../redux/apiSlices/ourWaySlice";
import { useState } from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const OurWay = () => {
  const { data: ourWays, isLoading } = useGetOurWaysQuery();
  const [editOurWay] = useEditOurWayMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const ourWayItems = ourWays?.data;

  const showModal = (record) => {
    setSelectedItem(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEditModal = (record) => {
    setEditingItem(record);
    editForm.setFieldsValue({
      label: record.label,
      title: record.title,
      description: record.description,
      contents: record.contents.map((content) => ({
        heading: content.heading,
        body: content.body,
      })),
      footer: record.footer || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
    editForm.resetFields();
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();

      const response = await editOurWay({
        id: editingItem._id,
        data: values,
      }).unwrap();

      if (response?.success) {
        message.success("Our Way item updated successfully!");
        setIsEditModalOpen(false);
        setEditingItem(null);
        editForm.resetFields();
      }
    } catch (error) {
      console.error("Error updating Our Way item:", error);
      message.error(error?.data?.message || "Something went wrong!");
    }
  };

  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      width: 100,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 250,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 400,
    },
    {
      title: "Contents",
      key: "contents",
      render: (_, record) => (
        <Text>{`${record.contents.length} sections`}</Text>
      ),
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModal(record)}
            className="bg-primary hover:bg-primary/90"
          >
            View Details
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Edit
          </Button>
        </div>
      ),
      width: 250,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Our Way</Title>
        <Paragraph className="text-gray-500">
          Manage and view our company's approach and methodologies
        </Paragraph>
      </div>

      <Table
        columns={columns}
        dataSource={ourWayItems}
        rowKey="_id"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        bordered
        scroll={{ x: 1000 }}
      />

      {selectedItem && (
        <Modal
          title={selectedItem.title}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <div className="p-4">
            <div className="mb-4">
              <Text type="secondary" className="text-sm">
                Label: {selectedItem.label}
              </Text>
              <Paragraph className="mt-2">{selectedItem.description}</Paragraph>
            </div>

            <Title level={4} className="mb-4">
              Content Sections
            </Title>

            <List
              bordered
              dataSource={selectedItem.contents}
              renderItem={(content, index) => (
                <List.Item>
                  <div className="w-full">
                    <div className="flex items-start">
                      <div className="mr-4 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Title level={5}>{content.heading}</Title>
                        <Paragraph>{content.body}</Paragraph>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />

            {selectedItem.footer && (
              <div className="mt-6 pt-4 border-t">
                <Text strong>Footer:</Text>
                <Paragraph>{selectedItem.footer}</Paragraph>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Our Way Item"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleEditSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>,
        ]}
        width={800}
      >
        <Form form={editForm} layout="vertical" className="mt-4">
          <Form.Item
            name="label"
            label="Label"
            rules={[{ required: true, message: "Please enter a label" }]}
          >
            <Input readOnly disabled placeholder="Enter label" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input readOnly disabled placeholder="Enter title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.List name="contents">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Title level={5}>Content Sections</Title>
                  <Button type="dashed" onClick={() => add()} className="mb-2">
                    Add Section
                  </Button>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-4 rounded-lg relative">
                    <Form.Item
                      {...restField}
                      name={[name, "heading"]}
                      label="Heading"
                      rules={[
                        { required: true, message: "Please enter a heading" },
                      ]}
                    >
                      <Input placeholder="Enter heading" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "body"]}
                      label="Body"
                      rules={[
                        {
                          required: true,
                          message: "Please enter body content",
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Enter body content"
                      />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        className="absolute top-2 right-2"
                        onClick={() => remove(name)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Form.List>

          <Form.Item name="footer" label="Footer">
            <Input.TextArea rows={3} placeholder="Enter footer (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OurWay;
