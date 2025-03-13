import { Modal, Input, Button, Upload } from "antd";
import { useState, useEffect } from "react";
import {
  UploadOutlined,
  PlayCircleOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const AddAndEditModal = ({ visible, onClose, service }) => {
  const [form, setForm] = useState({
    title: "",
    whatWeDo: "",
    capabilities: "",
    relatedLinks: "",
  });
  const [image, setImage] = useState(null);
  const [videos, setVideos] = useState([null, null]);

  // Populate form with service data if in edit mode
  useEffect(() => {
    if (service) {
      setForm({
        title: service.serviceName,
        whatWeDo: service.description,
        capabilities: service.specialization,
        relatedLinks: service.location,
      });
    } else {
      setForm({
        title: "",
        whatWeDo: "",
        capabilities: "",
        relatedLinks: "",
      });
    }
  }, [service]);

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
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={service ? "Edit Service" : "Add New Service"}
      width={800}
    >
      <div className="space-y-4">
        <Input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input.TextArea
            name="whatWeDo"
            placeholder="What we do"
            value={form.whatWeDo}
            onChange={handleInputChange}
          />
          <Input.TextArea
            name="capabilities"
            placeholder="Our Capabilities"
            value={form.capabilities}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Upload beforeUpload={handleImageUpload} showUploadList={false}>
            <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 rounded-lg">
              <PictureOutlined className="text-2xl text-blue-500" />
              <Button icon={<UploadOutlined />} className="mt-2">
                Select Image
              </Button>
              {image && (
                <p className="mt-2 text-sm text-gray-600">{image.name}</p>
              )}
            </div>
          </Upload>
          {videos.map((video, index) => (
            <Upload
              key={index}
              beforeUpload={(file) => handleVideoUpload(file, index)}
              showUploadList={false}
            >
              <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 rounded-lg">
                <PlayCircleOutlined className="text-2xl text-blue-500" />
                <Button icon={<UploadOutlined />} className="mt-2">
                  Select Video
                </Button>
                {video && (
                  <p className="mt-2 text-sm text-gray-600">{video.name}</p>
                )}
              </div>
            </Upload>
          ))}
        </div>
        <Input
          name="relatedLinks"
          placeholder="Related Links"
          value={form.relatedLinks}
          onChange={handleInputChange}
        />
        <Button type="primary" block onClick={handleSubmit}>
          {service ? "Update Service" : "Add Service"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddAndEditModal;
