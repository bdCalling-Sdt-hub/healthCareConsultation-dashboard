import { Table, Modal, Button } from "antd";
import { useState } from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import AddAndEditModal from "../../components/ui/Services/AddAndEditModal";
import { FaTrash } from "react-icons/fa";

const servicesData = [
  {
    key: "1",
    serviceName: "General Consultation",
    description:
      "Comprehensive health check-up and consultation with a senior doctor.",
    fee: "$50",
    duration: "30 minutes",
    doctor: "Dr. John Doe",
    specialization: "General Physician",
    location: "Downtown Medical Center",
    availability: "Monday - Friday, 9 AM - 5 PM",
  },
  {
    key: "2",
    serviceName: "Cardiology Consultation",
    description: "Evaluation and diagnosis of heart-related conditions.",
    fee: "$100",
    duration: "45 minutes",
    doctor: "Dr. Emily Smith",
    specialization: "Cardiologist",
    location: "City Heart Clinic",
    availability: "Tuesday & Thursday, 10 AM - 4 PM",
  },
  {
    key: "3",
    serviceName: "Dermatology Consultation",
    description: "Skin-related diagnosis and treatment options.",
    fee: "$80",
    duration: "40 minutes",
    doctor: "Dr. Alex Johnson",
    specialization: "Dermatologist",
    location: "SkinCare Hospital",
    availability: "Monday - Saturday, 11 AM - 6 PM",
  },
  {
    key: "4",
    serviceName: "Pediatrics Consultation",
    description:
      "Healthcare services for children from newborns to adolescents.",
    fee: "$60",
    duration: "30 minutes",
    doctor: "Dr. Linda Williams",
    specialization: "Pediatrician",
    location: "Children's Medical Center",
    availability: "Monday - Friday, 9 AM - 3 PM",
  },
  {
    key: "5",
    serviceName: "Orthopedic Consultation",
    description: "Diagnosis and treatment for bone and joint disorders.",
    fee: "$120",
    duration: "50 minutes",
    doctor: "Dr. Robert Brown",
    specialization: "Orthopedic Surgeon",
    location: "Advanced Orthopedic Clinic",
    availability: "Wednesday & Friday, 8 AM - 2 PM",
  },
];

const Services = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const showModal = (record) => {
    setSelectedService(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedService(null);
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <EditOutlined
            className="text-yellow-500 cursor-pointer hover:text-yellow-700"
            onClick={() => showModal(record)}
          />
          <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" />
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
        rowKey="key"
        dataSource={servicesData}
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
