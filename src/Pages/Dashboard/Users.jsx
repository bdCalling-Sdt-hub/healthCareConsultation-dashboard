import React, { useState } from "react";
import { Table, Space, Avatar, Modal } from "antd";
import { FaEye } from "react-icons/fa";
import randomImg from "../../assets/randomProfile2.jpg";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const users = {
    data: {
      data: [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
          location: "Springfield",
          industryName: "IT",
          phone: "+123456789",
          address: "123 Main St",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
          location: "Springfield",
          industryName: "Healthcare",
          phone: "+987654321",
          address: "456 Elm St",
        },
      ],
    },
  };

  const data = users?.data?.data;

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
        const imgUrl = record.profileImg || randomImg;
        return (
          <Space>
            <Avatar src={imgUrl} alt={name} size="large" />
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
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
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
              src={selectedUser.profileImg || randomImg}
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
