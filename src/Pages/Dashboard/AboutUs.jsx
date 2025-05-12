import {
  Table,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Upload,
  Divider,
  Card,
  Collapse,
  notification,
} from "antd";
import { useState } from "react";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const aboutData = [
  {
    id: 1,
    title: "Our Mission",
    images: [
      "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
      "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
    ],
    description: [
      {
        title: "",
        body: "Hukka Hua",
      },
    ],
  },
  {
    id: 2,
    title: "Our Vision",
    images: [
      "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
      "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
    ],
    description: [
      {
        title: "",
        body: "Hukka Hua",
      },
    ],
  },
  {
    id: 3,
    title: "Our Values",
    images: [
      "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
      "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
    ],
    description: [
      {
        title: "hello",
        body: "Hukka Hua",
      },
      {
        title: "hello",
        body: "Hukka Hua",
      },
      {
        title: "hello",
        body: "Hukka Hua",
      },
    ],
  },
];

const AboutUs = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  // Define columns for the Ant Design table
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (descriptions) => descriptions[0]?.body || "No description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);

    // Set form values with the description array
    form.setFieldsValue({
      title: record.title,
      descriptions: record.description.map((desc) => ({
        heading: desc.title || "", // Map title to heading for clarity
        body: desc.body || "",
      })),
    });

    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      // Here you would typically update your data
      console.log("Updated values:", values);

      // Example of how you might update the data
      // const updatedData = aboutData.map(item => {
      //   if (item.id === selectedRecord.id) {
      //     return {
      //       ...item,
      //       description: values.descriptions.map(desc => ({
      //         title: desc.heading,
      //         body: desc.body
      //       }))
      //     };
      //   }
      //   return item;
      // });

      notification.success({
        message: "Updated Successfully",
        description: `${selectedRecord.title} has been updated.`,
      });

      // Close the modal
      setEditModalVisible(false);
    });
  };

  return (
    <div className="p-4">
      <Title level={2} className="text-3xl font-semibold mb-6">
        About Us
      </Title>
      <Table
        dataSource={aboutData}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />

      {/* View Modal */}
      <Modal
        title={`View: ${selectedRecord?.title}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <Title level={4}>{selectedRecord.title}</Title>
            <div className="my-4">
              <Space>
                {selectedRecord.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Image ${index + 1}`}
                    style={{ width: 150, height: 150, objectFit: "cover" }}
                  />
                ))}
              </Space>
            </div>
            <div className="mt-4">
              <Collapse defaultActiveKey={["0"]} ghost>
                {selectedRecord.description.map((desc, index) => (
                  <Panel
                    header={desc.title ? desc.title : `Section ${index + 1}`}
                    key={index}
                  >
                    <p>{desc.body}</p>
                  </Panel>
                ))}
              </Collapse>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={`Edit: ${selectedRecord?.title}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditSubmit}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input readOnly />
          </Form.Item>

          <Divider orientation="left">Description Sections</Divider>

          <Form.List name="descriptions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    className="mb-4"
                    title={`Section ${name + 1}`}
                    extra={
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "heading"]}
                      label="Heading"
                    >
                      <Input placeholder="Section heading" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "body"]}
                      label="Body"
                      rules={[{ required: true, message: "Body is required" }]}
                    >
                      <TextArea rows={4} placeholder="Section content" />
                    </Form.Item>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Description Section
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item name="images" label="Images">
            <Upload
              listType="picture-card"
              fileList={selectedRecord?.images.map((img, index) => ({
                uid: `-${index}`,
                name: `image-${index}`,
                status: "done",
                url: img,
              }))}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AboutUs;
