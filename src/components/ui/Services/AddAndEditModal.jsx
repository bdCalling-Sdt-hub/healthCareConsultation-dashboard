import { Modal, Input, Button, Upload } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";

const AddAndEditModal = ({ visible, onClose, service }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (service) {
      setForm({
        title: service.serviceName,
        description: service.description,
      });
    } else {
      setForm({
        title: "",
        description: "",
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

  const handleSubmit = () => {
    console.log("Form Data:", form);
    console.log("Image:", image);
    onClose();
  };

  // Add after other useEffect
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(URL.createObjectURL(image));
      }
    };
  }, [image]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={service ? "Edit Service" : "Add New Service"}
      width={600}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Image
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
                  <Button icon={<UploadOutlined />} className="mt-2">
                    Change Image
                  </Button>
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
            Service Title
          </label>
          <Input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <Input.TextArea
            name="description"
            placeholder="Short Description"
            value={form.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        <Button type="primary" block onClick={handleSubmit}>
          {service ? "Update Service" : "Add Service"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddAndEditModal;
