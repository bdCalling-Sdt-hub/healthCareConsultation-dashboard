import { Button, Modal, Input, Upload, Form, Spin, message } from "antd";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  UploadOutlined,
  PlayCircleOutlined,
  PictureOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  useCreateTabsMutation,
  useDeleteTabsMutation,
  useGetAllTabsQuery,
  useGetSingleServiceQuery,
  useUpdateTabsMutation,
} from "../../redux/apiSlices/serviceSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import { MdEditSquare } from "react-icons/md";

// Remove unused mock data
const Service = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTabContentModalOpen, setIsTabContentModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedTabForEdit, setSelectedTabForEdit] = useState(null);
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [videos, setVideos] = useState([null, null]);
  const [submitting, setSubmitting] = useState(false);

  const { data: service, isLoading } = useGetSingleServiceQuery(id);
  const { data: getTabs, isLoading: isTabLoading } = useGetAllTabsQuery(id);

  const [createTab] = useCreateTabsMutation();
  const [editTab] = useUpdateTabsMutation();
  const [deleteTab] = useDeleteTabsMutation();

  if (isLoading || isTabLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const serviceData = service?.data?.result || [];
  const tabs = getTabs?.data || [];

  console.log("svgsdfbvsbsdfb", serviceData);

  const handleImageUpload = (file) => {
    setImage(file);
    return false;
  };

  const handleVideoUpload = (file, index) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = file;
    setVideos(updatedVideos);
    return false;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTabForEdit(null);
    form.resetFields();
    setImage(null);
    setVideos([null, null]);
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      // Create the data object with the required structure
      const data = {
        service: id,
        tabName: values.tabName,
        contents: values.contents.map((section) => ({
          title: section.title,
          descriptions: section.descriptions
            .split("\n")
            .filter((point) => point.trim() !== ""),
        })),
      };

      // Create FormData
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Handle image upload
      if (image) {
        formData.append("image", image);
      }

      // Handle video uploads - only append actual video files
      if (videos) {
        videos.forEach((video) => {
          if (video) {
            formData.append("media", video);
          }
        });
      }

      let response;
      if (selectedTabForEdit) {
        response = await editTab({
          id: selectedTabForEdit._id,
          data: formData,
        }).unwrap();
      } else {
        response = await createTab(formData).unwrap();
      }

      if (response?.success) {
        message.success(
          selectedTabForEdit
            ? "Tab updated successfully!"
            : "Tab added successfully!"
        );
        handleCloseModal();
      }
    } catch (error) {
      console.error("Validation failed:", error);
      message.error(error?.data?.message || "Something went wrong!");
      setSubmitting(false);
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setIsTabContentModalOpen(true);
  };

  const handleEditClick = (tab) => {
    setSelectedTabForEdit(tab);
    form.setFieldsValue({
      tabName: tab.tabName,
      contents: tab.contents.map((content) => ({
        title: content.title,
        descriptions: content.descriptions.join("\n"),
      })),
    });
    if (tab.images?.[0]) {
      setImage(tab.images[0]);
    }
    if (tab.videos?.length) {
      setVideos(tab.videos.map((video) => video || null));
    }
    setIsModalOpen(true);
  };

  const handleDeleteTab = async (tab) => {
    try {
      const response = await deleteTab(tab._id).unwrap();
      if (response?.success) {
        message.success("Tab deleted successfully!");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      message.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <img
        src={getImageUrl(serviceData?.image)}
        alt={serviceData?.title}
        className="w-[400px] h-[300px] rounded-xl object-contain"
      />
      <div className="my-5">
        <h1 className="text-3xl font-bold">{serviceData?.title}</h1>
        <p className="text-lg">{serviceData?.description}</p>
      </div>
      <div>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Tabs</h2>
          <Button
            className="border border-primary py-5 px-8 text-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus /> Add A Tab
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-5 my-10">
          {tabs?.map((tab) => (
            <div key={tab?._id} className="relative group">
              <h1
                className="bg-primary px-5 py-3 text-white text-sm hover:bg-[#1b557c] cursor-pointer rounded-lg"
                onClick={() => handleTabClick(tab)}
              >
                {tab?.tabName}
              </h1>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  icon={<MdEditSquare />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(tab);
                  }}
                />
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<MinusCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    Modal.confirm({
                      title: "Delete Tab",
                      content: "Are you sure you want to delete this tab?",
                      okText: "Yes",
                      okType: "danger",
                      cancelText: "No",
                      onOk: () => handleDeleteTab(tab),
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content Modal */}
      <Modal
        title={selectedTab?.tabName}
        open={isTabContentModalOpen}
        onCancel={() => {
          setIsTabContentModalOpen(false);
          setSelectedTab(null);
        }}
        footer={null}
        width={800}
      >
        {selectedTab && (
          <div className="space-y-6">
            {/* Content Sections */}
            {selectedTab.contents.map((content, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-semibold mb-3">{content.title}</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {content.descriptions.map((desc, idx) => (
                    <li key={idx} className="text-gray-700">
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Images Section */}
            {selectedTab.images && selectedTab.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Image</h3>
                <div className="flex justify-center">
                  <img
                    src={getImageUrl(selectedTab.images[0])}
                    alt="Tab Image"
                    className="w-full max-w-lg h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Videos Section */}
            {selectedTab?.videos && selectedTab?.videos?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Videos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedTab?.videos?.map((video, index) => (
                    <video key={index} controls className="w-full rounded-lg">
                      <source src={getImageUrl(video)} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add/Edit Tab Modal */}
      <Modal
        title={selectedTabForEdit ? "Edit Tab" : "Add New Tab"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            name="tabName"
            label="Tab Name"
            rules={[{ required: true, message: "Please enter tab name" }]}
          >
            <Input placeholder="Enter tab name" />
          </Form.Item>

          <Form.List name="contents" initialValue={[{ key: 0 }]}>
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="border p-4 rounded-lg relative"
                  >
                    <Form.Item
                      key={`title-${field.key}`}
                      label="Section Title"
                      name={[field.name, "title"]}
                      rules={[{ required: true, message: "Title is required" }]}
                    >
                      <Input placeholder="Enter section title" />
                    </Form.Item>

                    <Form.Item
                      key={`descriptions-${field.key}`}
                      label="Body"
                      name={[field.name, "descriptions"]}
                      rules={[{ required: true, message: "Body is required" }]}
                      help="Enter each point in a new line"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Enter points (one per line)"
                      />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button
                        type="text"
                        className="absolute top-2 right-2"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<FaPlus />}
                >
                  Add More Section
                </Button>
              </div>
            )}
          </Form.List>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <Upload beforeUpload={handleImageUpload} showUploadList={false}>
              <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 rounded-lg">
                {image ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        typeof image === "string"
                          ? getImageUrl(image)
                          : URL.createObjectURL(image)
                      }
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mb-2"
                    />
                    <Button icon={<UploadOutlined />}>Change Image</Button>
                  </div>
                ) : (
                  <>
                    <PictureOutlined className="text-2xl text-blue-500" />
                    <Button icon={<UploadOutlined />} className="mt-2">
                      Select Image
                    </Button>
                  </>
                )}
              </div>
            </Upload>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Videos
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <Upload
                  key={index}
                  beforeUpload={(file) => handleVideoUpload(file, index)}
                  showUploadList={false}
                >
                  <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 rounded-lg">
                    {videos[index] ? (
                      <div className="flex flex-col items-center">
                        <PlayCircleOutlined className="text-2xl text-blue-500" />
                        <p className="mt-2 text-sm text-gray-600">
                          {typeof videos[index] === "string"
                            ? videos[index].split("/").pop()
                            : videos[index].name}
                        </p>
                        <Button icon={<UploadOutlined />} className="mt-2">
                          Change Video
                        </Button>
                      </div>
                    ) : (
                      <>
                        <PlayCircleOutlined className="text-2xl text-blue-500" />
                        <Button icon={<UploadOutlined />} className="mt-2">
                          Select Video {index + 1}
                        </Button>
                      </>
                    )}
                  </div>
                </Upload>
              ))}
            </div>
          </div>

          <Button
            type="primary"
            block
            onClick={handleSubmit}
            loading={submitting}
            disabled={submitting}
          >
            {selectedTabForEdit ? "Update Tab" : "Add Tab"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Service;
