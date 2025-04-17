import { Button, Modal, Input, Upload } from "antd";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  UploadOutlined,
  PlayCircleOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const data = {
  key: "1",
  serviceName: "General Consultation",
  image: "https://i.ibb.co.com/tMdLTwg3/image-11.png",
  description:
    "Comprehensive health check-up and consultation with a senior doctor.",
  fee: "$50",
  duration: "30 minutes",
  doctor: "Dr. John Doe",
  specialization: "General Physician",
  location: "Downtown Medical Center",
  availability: "Monday - Friday, 9 AM - 5 PM",
  tabs: [
    { id: 1, title: "Tab 1", content: "Content for Tab 1" },
    { id: 1, title: "Tab 1", content: "Content for Tab 1" },
  ],
};

const Service = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    tabName: "",
    whyItMatters: "",
    howItWorks: [],
    discovery: "",
  });
  const [image, setImage] = useState(null);
  const [videos, setVideos] = useState([null, null]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = () => {
    console.log("Form Data:", form);
    console.log("Image:", image);
    console.log("Videos:", videos);
    setIsModalOpen(false);
  };

  return (
    <div>
      <img
        src={data.image}
        alt={data.serviceName}
        className="w-[400px] h-[300px]"
      />
      <div className="my-5">
        <h1 className="text-3xl font-bold">{data?.serviceName}</h1>
        <p className="text-lg">{data?.description}</p>
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
          {data?.tabs?.map((tab) => (
            <h1
              key={tab.id}
              className="bg-primary px-5 py-3 text-white hover:bg-[#1b557c] cursor-pointer rounded-lg"
            >
              {tab.title}
            </h1>
          ))}
        </div>
      </div>

      <Modal
        title="Add New Tab"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tab Name
            </label>
            <Input
              name="tabName"
              placeholder="Enter tab name"
              value={form.tabName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Why It Matters
            </label>
            <Input.TextArea
              name="whyItMatters"
              placeholder="Explain why it matters"
              value={form.whyItMatters}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How It Works
            </label>
            <Input.TextArea
              name="howItWorks"
              placeholder="Explain how it works"
              value={form.howItWorks}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discovery
            </label>
            <Input.TextArea
              name="discovery"
              placeholder="Enter discovery details"
              value={form.discovery}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <Upload beforeUpload={handleImageUpload} showUploadList={false}>
              <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 rounded-lg">
                {image ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(image)}
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
                          {videos[index].name}
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

          <Button type="primary" block onClick={handleSubmit}>
            Add Tab
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Service;
