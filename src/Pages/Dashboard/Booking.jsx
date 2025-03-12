import React, { useState } from "react";
import { Table, Tabs, Modal, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import BookingCalendar from "../../components/ui/Bookings/BookingCalender";

const { TabPane } = Tabs;

const bookingsData = [
  {
    key: "1",
    date: "01 Mar 2024 - 9:00 AM",
    service: "Haircut",
    client: "John Doe",
    status: "Approved",
    email: "johndoe@example.com",
    phone: "+1234567890",
    location: "New York, USA",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    key: "2",
    date: "03 Mar 2024 - 2:00 PM",
    service: "Facial",
    client: "Jane Doe",
    status: "Pending",
    email: "janedoe@example.com",
    phone: "+9876543210",
    location: "Los Angeles, USA",
    profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleViewDetails = (record) => {
    setSelectedBooking(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const columns = [
    { title: "Date/Time", dataIndex: "date", key: "date" },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Client", dataIndex: "client", key: "client" },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color:
              status === "Approved"
                ? "green"
                : status === "Pending"
                ? "orange"
                : "red",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <EyeOutlined
          style={{ color: "#1890ff", cursor: "pointer" }}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Booking History" key="1">
          <Table
            columns={columns}
            dataSource={bookingsData}
            pagination={{ pageSize: 5 }}
            style={{ marginTop: "16px" }}
          />
        </TabPane>
        <TabPane tab="Booking Timetable" key="2">
          <BookingCalendar />
        </TabPane>
      </Tabs>

      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedBooking && (
          <div>
            <img
              src={selectedBooking.profileImg}
              alt="Profile"
              className="w-40 h-40 rounded-2xl mb-4"
            />
            <h3 className="text-2xl font-bold my-5">
              {selectedBooking.client}
            </h3>
            <p>
              <strong>Service:</strong> {selectedBooking.service}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBooking.phone}
            </p>
            <p>
              <strong>Location:</strong> {selectedBooking.location}
            </p>
            <p>
              <strong>Date:</strong> {selectedBooking.date}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <Button
                type="primary"
                style={{ backgroundColor: "#004085", borderColor: "#004085" }}
              >
                Approve
              </Button>
              <Button type="default" danger>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
