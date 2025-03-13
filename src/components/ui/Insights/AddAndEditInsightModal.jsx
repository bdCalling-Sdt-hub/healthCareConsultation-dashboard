import React, { useState } from "react";
import { Modal, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const InsightModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      clientBackground: "",
      challenge: "",
      approach: "",
      testimonial: "",
      imageTestimonial: null,
      image: null,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (file, key) => {
    setFormData((prev) => ({ ...prev, [key]: file }));
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
        <div className="grid grid-cols-3 gap-4">
          <Input.TextArea
            placeholder="Client Background"
            name="clientBackground"
            value={formData.clientBackground}
            onChange={handleChange}
          />
          <Input.TextArea
            placeholder="The Challenge"
            name="challenge"
            value={formData.challenge}
            onChange={handleChange}
          />
          <Input.TextArea
            placeholder="Our Approach"
            name="approach"
            value={formData.approach}
            onChange={handleChange}
          />
        </div>
        <Input.TextArea
          placeholder="Testimonial"
          name="testimonial"
          value={formData.testimonial}
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-4">
          <Upload
            beforeUpload={(file) => handleUpload(file, "imageTestimonial")}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
          <Upload beforeUpload={(file) => handleUpload(file, "image")}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </div>
        <Button type="primary" block onClick={() => onSubmit(formData)}>
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default InsightModal;
