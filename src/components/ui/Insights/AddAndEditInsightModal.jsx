import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useCreateInsightMutation,
  useUpdateInsightMutation,
} from "../../../redux/apiSlices/insightsSlice";
import { getImageUrl } from "../../../utils/getImageUrl";

const InsightModal = ({ visible, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  // Add useEffect to update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        image: initialData.image || null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        image: null,
      });
    }
  }, [initialData]);

  const [createInsight] = useCreateInsightMutation();
  const [updateInsight] = useUpdateInsightMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
    return false;
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        message.error("Title is required!");
        return;
      }
      if (!formData.description.trim()) {
        message.error("Description is required!");
        return;
      }
      if (!formData.image && !initialData) {
        message.error("Image is required!");
        return;
      }

      // Create FormData
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);

      // Handle image differently for update vs create
      if (initialData) {
        // For update: only append if there's a new image
        if (formData.image instanceof File) {
          submitData.append("image", formData.image);
        }
      } else {
        // For create: image is required
        submitData.append("image", formData.image);
      }

      let response;
      if (initialData) {
        response = await updateInsight({
          id: initialData._id,
          data: submitData,
        }).unwrap();
      } else {
        response = await createInsight({ data: submitData }).unwrap();
      }

      if (response?.success) {
        message.success(
          initialData
            ? "Insight updated successfully!"
            : "Insight added successfully!"
        );
        setFormData({
          title: "",
          description: "",
          image: null,
        });
        onClose();
      }
    } catch (error) {
      console.error("Operation failed:", error);
      message.error(error?.data?.message || "Something went wrong!");
    }
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
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : getImageUrl(formData.image)
                  }
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
        <Button type="primary" block onClick={handleSubmit}>
          {initialData ? "Update" : "Submit"}
        </Button>
      </div>
    </Modal>
  );
};

export default InsightModal;
