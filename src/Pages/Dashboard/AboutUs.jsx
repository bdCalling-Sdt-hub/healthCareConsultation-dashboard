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
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  useAllAboutUsQuery,
  useUpdateAboutUsMutation,
} from "../../redux/apiSlices/faqSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import toast from "react-hot-toast";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

// const aboutData = [
//   {
//     id: 1,
//     title: "Our Mission",
//     images: [
//       "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
//       "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
//     ],
//     description: [
//       {
//         title: "",
//         body: "Hukka Hua",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "Our Vision",
//     images: [
//       "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
//       "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
//     ],
//     description: [
//       {
//         title: "",
//         body: "Hukka Hua",
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "Our Values",
//     images: [
//       "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
//       "https://cdn.pixabay.com/photo/2017/06/14/21/11/random-2403426_640.png",
//     ],
//     description: [
//       {
//         title: "hello",
//         body: "Hukka Hua",
//       },
//       {
//         title: "hello",
//         body: "Hukka Hua",
//       },
//       {
//         title: "hello",
//         body: "Hukka Hua",
//       },
//     ],
//   },
// ];

const AboutUs = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const { data: aboutsData, isLoading } = useAllAboutUsQuery();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutUsMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  const aboutData = aboutsData?.data;
  // console.log(aboutData);

  // Define columns for the Ant Design table
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "descriptions",
      key: "descriptions",
      render: (descriptions) => descriptions?.[0]?.body || "N/A",
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
      type: record.type,
      descriptions: record?.descriptions?.map((desc) => ({
        heading: desc.heading || "",
        body: desc.body || "",
      })),
    });

    // Set file list for the Upload component with proper image URLs
    if (record.images && record.images.length > 0) {
      const newFileList = record.images.map((img, index) => ({
        uid: `-${index}`,
        name: `image-${index}`,
        status: "done",
        url: getImageUrl(img), // Use getImageUrl to properly format the image URL
        thumbUrl: getImageUrl(img), // Also set thumbUrl for preview
      }));
      setFileList(newFileList);
    } else {
      setFileList([]);
    }

    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Create a new FormData object
        const formData = new FormData();

        // Create the data object with the structure you need
        const data = {
          title: values.title,
          type: values.type,
          descriptions: values.descriptions,
        };

        console.log("asdvsvdsdfv", data);
        // Append data as a JSON string
        formData.append("data", JSON.stringify(data));

        // Append new images as files
        fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append("image", file.originFileObj);
          }
        });

        // For existing images, extract the path from the URL
        const existingImages = fileList
          .filter((file) => !file.originFileObj && file.url)
          .map((file) => {
            // Extract the path portion from the full URL
            const urlPath = file.url.replace(import.meta.env.VITE_API_URL, "");
            return urlPath;
          });

        // Log what we're sending to help with debugging
        console.log("Submitting data:", data);
        console.log("Existing images:", existingImages);

        // Call the update mutation with FormData
        updateAbout({ data: formData })
          .unwrap()
          .then(() => {
            toast.success("About section updated successfully");
            setEditModalVisible(false);
          })
          .catch((error) => {
            toast.error(error.message || "Failed to update about section");
          });
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div className="p-4">
      <Title level={2} className="text-3xl font-semibold mb-6">
        About Us
      </Title>
      <Table
        dataSource={aboutData}
        columns={columns}
        rowKey="_id"
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
                {selectedRecord?.images?.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`Image ${index + 1}`}
                    style={{ width: 150, height: 150, objectFit: "cover" }}
                  />
                ))}
              </Space>
            </div>
            <div className="mt-4">
              <Collapse defaultActiveKey={["0"]} ghost>
                {selectedRecord?.descriptions?.map((desc, index) => (
                  <div>
                    {desc?.heading && (
                      <h1 className="font-semibold">{desc?.heading}</h1>
                    )}
                    <p>{desc?.body}</p>
                  </div>
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
          <Form.Item
            name="type"
            label="Type"
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
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
            >
              {fileList.length >= 2 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AboutUs;
