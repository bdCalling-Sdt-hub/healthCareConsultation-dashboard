import { Modal, Input, Button, Upload, message } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import {
  useCreateServiceMutation,
  useEditServiceMutation,
} from "../../../redux/apiSlices/ServiceSlice";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/getImageUrl";

const AddAndEditModal = ({ visible, onClose, service }) => {
  const [form, setForm] = useState({
    data: {
      title: "",
      description: "",
    },
  });
  const [image, setImage] = useState(null);

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [editService, { isLoading: isEditing }] = useEditServiceMutation();

  // Reset form when modal closes or service changes
  useEffect(() => {
    if (service) {
      setForm({
        data: {
          title: service.title,
          description: service.description,
        },
      });
      service.image && setImage(getImageUrl(service.image));
    } else {
      resetForm();
    }
  }, [service]);

  const resetForm = () => {
    setForm({
      data: {
        title: "",
        description: "",
      },
    });
    setImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.data.title || !form.data.description) {
        return toast.error("Please fill in all required fields");
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(form.data));
      image && formData.append("image", image);

      const response = await (service
        ? editService({ data: formData, id: service._id })
        : createService(formData)
      ).unwrap();

      if (response?.success) {
        toast.success(
          service
            ? "Service updated successfully!"
            : "Service added successfully!"
        );
        onClose();
        resetForm();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={() => {
        onClose();
        resetForm();
      }}
      footer={null}
      title={service ? "Edit Service" : "Add New Service"}
      width={600}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Image
          </label>
          <Upload 
            beforeUpload={(file) => {
              setImage(file);
              return false;
            }} 
            showUploadList={false}
          >
            <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 rounded-lg">
              {image ? (
                <div className="flex flex-col items-center">
                  <img
                    src={typeof image === "string" ? image : URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                  <Button icon={<UploadOutlined />}>Change Image</Button>
                </div>
              ) : (
                <>
                  <PictureOutlined className="text-2xl text-blue-500" />
                  <Button icon={<UploadOutlined />}>Select Image</Button>
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
            value={form.data.title}
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
            value={form.data.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        <Button
          type="primary"
          block
          onClick={handleSubmit}
          loading={isCreating || isEditing}
        >
          {service ? "Update Service" : "Add Service"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddAndEditModal;
