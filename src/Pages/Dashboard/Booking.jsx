import React, { useState } from "react";
import { Table, Tabs, Modal, Button, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import BookingCalendar from "../../components/ui/Bookings/BookingCalender";
import BookingSlots from "../../components/ui/Bookings/BookingSlots";
import { useAllBookingsQuery } from "../../redux/apiSlices/bookingSlice";
import moment from "moment/moment";
import { imageUrl } from "../../redux/api/baseApi";

const { TabPane } = Tabs;

const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: allBookings, isLoading } = useAllBookingsQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );

  const bookingsData = allBookings?.data;

  const handleViewDetails = (record) => {
    setSelectedBooking(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const columns = [
    {
      title: "Date/Time",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (date) => moment(date).format("DD MMM YYYY - hh:mm A"),
    },
    { title: "Service", dataIndex: ["service", "title"], key: "service" },
    {
      title: "Client",
      dataIndex: "firstName",
      key: "firstName",
      render: (client, record) => (
        <p>
          {record?.firstName} {record?.lastName}
        </p>
      ),
    },
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
        <TabPane tab="Manage Slots" key="1">
          <BookingSlots />
        </TabPane>
        <TabPane tab="Booking History" key="2">
          <Table
            columns={columns}
            dataSource={bookingsData}
            pagination={{ pageSize: 5 }}
            style={{ marginTop: "16px" }}
            rowKey={"_id"}
          />
        </TabPane>
        <TabPane tab="Booking Timetable" key="3">
          <BookingCalendar bookingsData={bookingsData} />
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
              src={
                selectedBooking?.service?.image?.startsWith("http")
                  ? selectedBooking?.service?.image
                  : `${imageUrl}/${selectedBooking?.service?.image}`
              }
              alt="Profile"
              className="w-40 h-40 rounded-2xl object-contain mb-4"
            />
            <h3 className="text-2xl font-bold my-5">
              {selectedBooking.client}
            </h3>
            <p>
              <strong>Service:</strong> {selectedBooking.service?.title}
            </p>
            <p>
              <strong>Name:</strong> {selectedBooking.firstName}{" "}
              {selectedBooking.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBooking.contact}
            </p>
            <p>
              <strong>Location:</strong> {selectedBooking.state}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {moment(selectedBooking.scheduledAt).format("DD MMM YYYY")}
            </p>
            {/* <div
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
            </div> */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
