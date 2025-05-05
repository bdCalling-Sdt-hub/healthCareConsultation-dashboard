import React, { useState } from "react";
import { Table, Space, Avatar, Modal, Spin } from "antd";
import { FaEye } from "react-icons/fa";
import randomImg from "../../assets/randomProfile2.jpg";
import { useUsersQuery } from "../../redux/apiSlices/userSlice";
import { getImageUrl } from "../../utils/getImageUrl";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: usersData, isLoading } = useUsersQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );

  const data = usersData?.data;
  console.log(data);

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        const name = record.name || "Unknown";
        const imgUrl = record?.profile || randomImg;
        return (
          <Space>
            <Avatar src={getImageUrl(imgUrl)} alt={name} size="large" />
            <span>{name}</span>
          </Space>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <p>{phone || "unknown"}</p>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => <p>{address || "unknown"}</p>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <FaEye
            size={20}
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => showUserDetails(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold my-5">Users</h1>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        rowKey="_id"
      />

      {/* User Details Modal */}
      <Modal
        title="User Details"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedUser && (
          <div className="flex flex-col gap-3 p-4">
            <img
              src={getImageUrl(selectedUser.profile) || randomImg}
              alt={selectedUser.name}
              className="w-44 h-40 rounded-2xl"
            />
            <h2 className="text-lg font-semibold">Name: {selectedUser.name}</h2>
            <p className="text-gray-600">
              Industry: {selectedUser.industryName}
            </p>
            <p className="text-gray-600">Email: {selectedUser.email}</p>
            <p className="text-gray-600">Phone: {selectedUser.phone}</p>
            <p className="text-gray-600">Address: {selectedUser.address}</p>
            <p className="text-gray-600">Location: {selectedUser.location}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Users;
