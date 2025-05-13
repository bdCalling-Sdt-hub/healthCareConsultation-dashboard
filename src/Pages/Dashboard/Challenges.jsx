import { useState } from "react";
import {
  Spin,
  Table,
  Typography,
  Button,
  Space,
  Tag,
  Image,
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Divider,
  Card,
  notification,
  List,
  Carousel,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useCreateChallengeMutation,
  useGetChallengesQuery,
} from "../../redux/apiSlices/challengeSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import { useGetAllServicesQuery } from "../../redux/apiSlices/ServiceSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Challenges = () => {
  const [form] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [backgroundFile, setBackgroundFile] = useState(null);

  const { data: challengesData, isLoading } = useGetChallengesQuery();
  const { data: servicesData } = useGetAllServicesQuery();
  const [createChallenge, { isLoading: isCreating }] =
    useCreateChallengeMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const challenges = challengesData?.data;
  const services = servicesData?.data || [];

  // Define columns for the Ant Design table
  const columns = [
    {
      title: "Background",
      dataIndex: "background",
      key: "background",
      width: 120,
      render: (background) => (
        <Image
          src={getImageUrl(background)}
          alt="Background"
          width={100}
          height={60}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Content Sections",
      dataIndex: "contents",
      key: "contents",
      render: (contents) => (
        <Space direction="vertical">
          {contents.map((content, index) => (
            <Tag color="blue" key={index}>
              {content.title}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Placeholder functions for view and edit actions
  const handleView = (record) => {
    setSelectedChallenge(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log("Edit challenge:", record);
    // Implement edit functionality here
  };

  const showAddModal = () => {
    form.resetFields();
    setFileList([]);
    setBackgroundFile(null);
    setAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
  };

  const handleBackgroundChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setBackgroundFile(fileList[0]);
    } else {
      setBackgroundFile(null);
    }
  };

  const handleImagesChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleAddSubmit = () => {
    form.validateFields().then((values) => {
      // Create FormData object
      const formData = new FormData();

      // Prepare data object
      const data = {
        title: values.title,
        description: values.description,
        service: values.service,
        background: values.background,
        contents: values.contents,
        footer: values.footer,
      };

      // Append data as JSON string
      formData.append("data", JSON.stringify(data));

      // Append background image if exists
      if (backgroundFile?.originFileObj) {
        formData.append("background", backgroundFile.originFileObj);
      }

      // Append images
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("image", file.originFileObj);
        }
      });

      // Submit the form
      createChallenge(formData)
        .unwrap()
        .then(() => {
          notification.success({
            message: "Success",
            description: "Challenge created successfully",
          });
          setAddModalVisible(false);
          form.resetFields();
          setFileList([]);
          setBackgroundFile(null);
        })
        .catch((error) => {
          notification.error({
            message: "Error",
            description: error.message || "Failed to create challenge",
          });
        });
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">
          Challenges
        </Title>
        <Button type="primary" onClick={showAddModal}>
          Add New Challenge
        </Button>
      </div>

      <Table
        dataSource={challenges}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* Add Challenge Modal */}
      <Modal
        title="Add New Challenge"
        open={addModalVisible}
        onCancel={handleAddModalCancel}
        onOk={handleAddSubmit}
        width={800}
        confirmLoading={isCreating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Challenge Title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea
              rows={4}
              placeholder="This is the description of the challenge, explaining the objectives and goals."
            />
          </Form.Item>

          <Form.Item
            name="service"
            label="Service"
            rules={[{ required: true, message: "Please select a service" }]}
          >
            <Select placeholder="Select a service">
              {services.map((service) => (
                <Option key={service._id} value={service._id}>
                  {service.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="background"
            label="Background Text"
            rules={[
              {
                required: true,
                message: "Please enter background information",
              },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="The challenge is designed to test participants' skills in various domains..."
            />
          </Form.Item>

          <Form.Item label="Background Image" name="backgroundImage">
            <Upload
              listType="picture-card"
              fileList={backgroundFile ? [backgroundFile] : []}
              onChange={handleBackgroundChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {!backgroundFile && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Divider orientation="left">Content Sections</Divider>

          <Form.List
            name="contents"
            initialValue={[{ title: "", description: "", details: [""] }]}
            rules={[
              {
                validator: async (_, contents) => {
                  if (!contents || contents.length < 1) {
                    return Promise.reject(
                      new Error("At least one content section is required")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    className="mb-4"
                    title={`Section ${name + 1}`}
                    extra={
                      fields.length > 1 ? (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      ) : null
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      label="Section Title"
                      rules={[{ required: true, message: "Title is required" }]}
                    >
                      <Input placeholder="Challenge Overview" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label="Section Description"
                      rules={[
                        { required: true, message: "Description is required" },
                      ]}
                    >
                      <TextArea
                        rows={2}
                        placeholder="An introduction to the challenge and the rules."
                      />
                    </Form.Item>

                    <Form.List name={[name, "details"]}>
                      {(
                        detailFields,
                        { add: addDetail, remove: removeDetail }
                      ) => (
                        <>
                          {detailFields.map(
                            ({
                              key: detailKey,
                              name: detailName,
                              ...restDetailField
                            }) => (
                              <Form.Item
                                key={detailKey}
                                {...restDetailField}
                                label={detailName === 0 ? "Details" : ""}
                                required={false}
                              >
                                <div className="flex items-center">
                                  <Form.Item
                                    {...restDetailField}
                                    name={detailName}
                                    noStyle
                                    rules={[
                                      {
                                        required: true,
                                        message: "Detail is required",
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Detail point"
                                      style={{ width: "90%" }}
                                    />
                                  </Form.Item>
                                  {detailFields.length > 1 ? (
                                    <DeleteOutlined
                                      className="ml-2"
                                      onClick={() => removeDetail(detailName)}
                                    />
                                  ) : null}
                                </div>
                              </Form.Item>
                            )
                          )}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addDetail()}
                              icon={<PlusOutlined />}
                              block
                            >
                              Add Detail
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Content Section
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item name="footer" label="Footer">
            <Input placeholder="Footer text" />
          </Form.Item>

          <Form.Item label="Images" name="images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImagesChange}
              beforeUpload={() => false}
              multiple
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Challenge Modal */}
      <Modal
        title={selectedChallenge?.title}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedChallenge && (
          <div className="challenge-details">
            {/* Background Image */}
            <div className="mb-6">
              <Image
                src={getImageUrl(selectedChallenge.background)}
                alt="Background"
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <Title level={4}>Description</Title>
              <Paragraph>{selectedChallenge.description}</Paragraph>
            </div>

            {/* Images Gallery */}
            {selectedChallenge.images && selectedChallenge.images.length > 0 && (
              <div className="mb-6">
                <Title level={4}>Images</Title>
                <Carousel autoplay>
                  {selectedChallenge.images.map((image, index) => (
                    <div key={index}>
                      <Image
                        src={getImageUrl(image)}
                        alt={`Challenge Image ${index + 1}`}
                        style={{ width: '100%', height: 300, objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}

            {/* Content Sections */}
            <div className="mb-6">
              <Title level={4}>Content Sections</Title>
              <List
                itemLayout="vertical"
                dataSource={selectedChallenge.contents}
                renderItem={(content, index) => (
                  <Card className="mb-4" title={content.title}>
                    <Paragraph>{content.description}</Paragraph>
                    {content.details && content.details.length > 0 && (
                      <List
                        dataSource={content.details}
                        renderItem={(detail, detailIndex) => (
                          <List.Item>
                            <Text>• {detail}</Text>
                          </List.Item>
                        )}
                      />
                    )}
                  </Card>
                )}
              />
            </div>

            {/* Footer */}
            {selectedChallenge.footer && (
              <div className="mt-6 pt-4 border-t">
                <Title level={5}>Footer</Title>
                <Paragraph>{selectedChallenge.footer}</Paragraph>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-6 pt-4 border-t">
              <Space size="large">
                <Text type="secondary">
                  Created: {new Date(selectedChallenge.createdAt).toLocaleString()}
                </Text>
                <Text type="secondary">
                  Updated: {new Date(selectedChallenge.updatedAt).toLocaleString()}
                </Text>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Challenges;
