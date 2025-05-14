import { Table, Modal, Button, Spin } from "antd";
import { useState } from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import AddAndEditModal from "../../components/ui/Services/AddAndEditModal";
import { FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";
import toast from "react-hot-toast";
import {
  useDeleteServiceMutation,
  useGetAllServicesQuery,
} from "../../redux/apiSlices/serviceSlice";

const Services = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { data: services, isLoading } = useGetAllServicesQuery();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );

  const allServices = services?.data || [];

  // console.log(allServices);

  const showModal = (record) => {
    setSelectedService(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedService(null);
  };

  const handleDelete = async (id) => {
    try {
      Modal.confirm({
        title: "Are you sure you want to delete this service?",
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            const res = await deleteService(id);
            if (res?.data?.success) {
              toast.success(
                res?.data?.message || "Service deleted successfully"
              );
            } else {
              toast.error(res?.data?.message || "Failed to delete service");
            }
          } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Failed to delete service");
          }
        },
      });
    } catch (error) {
      console.error("Error showing confirmation modal:", error);
      toast.error("Something went wrong");
    }
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Service Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={getImageUrl(image)}
          alt="Service"
          className="w-20 h-16 rounded-lg object-cover"
        />
      ),
    },
    {
      title: "Service Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Link to={`/services/${record?._id}`}>
            <FaEye className="text-blue-700 cursor-pointer" size={18} />
          </Link>
          <EditOutlined
            className="text-yellow-500 cursor-pointer hover:text-yellow-700"
            onClick={() => showModal(record)}
          />
          <FaTrash
            onClick={() => handleDelete(record?._id)}
            className="text-red-500 cursor-pointer hover:text-red-700"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-5 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Doctor's Services</h1>
        <Button
          onClick={() => {
            setSelectedService(null); // Reset selected service for add mode
            setIsModalVisible(true);
          }}
          className="mb-4 py-5 bg-primary text-white"
        >
          Add New Service
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey="_id"
        dataSource={allServices}
        pagination={false}
      />

      {/* Add/Edit Service Modal */}
      <AddAndEditModal
        visible={isModalVisible}
        onClose={handleCancel}
        service={selectedService}
      />
    </div>
  );
};

export default Services;
