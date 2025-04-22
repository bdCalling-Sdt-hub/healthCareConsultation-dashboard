import React, { useState } from "react";
import { Modal, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const InsightModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      image: null,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
    return false;
  };

  return (
    <Modal
      title={initialData ? "Edit Insight" : "Add Insight"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <Input.TextArea
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
        <Upload beforeUpload={handleUpload} showUploadList={false}>
          <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 rounded-lg">
            {formData.image ? (
              <div className="flex flex-col items-center">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mb-2"
                />
                <Button icon={<UploadOutlined />}>Change Image</Button>
              </div>
            ) : (
              <>
                <UploadOutlined className="text-2xl text-blue-500" />
                <Button icon={<UploadOutlined />} className="mt-2">
                  Select Image
                </Button>
              </>
            )}
          </div>
        </Upload>
        <Button type="primary" block onClick={() => onSubmit(formData)}>
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default InsightModal;
