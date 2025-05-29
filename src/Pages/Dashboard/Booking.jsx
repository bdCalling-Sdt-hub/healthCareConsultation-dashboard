import React, { useState } from "react";
import {
  Table,
  Tabs,
  Modal,
  Button,
  Spin,
  Space,
  Tag,
  message,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import BookingCalendar from "../../components/ui/Bookings/BookingCalender";
import BookingSlots from "../../components/ui/Bookings/BookingSlots";
import {
  useAllBookingsQuery,
  useUpdateBookingsMutation,
} from "../../redux/apiSlices/bookingSlice";
import moment from "moment/moment";
import { imageUrl } from "../../redux/api/baseApi";

const { TabPane } = Tabs;

const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: allBookings, isLoading, refetch } = useAllBookingsQuery();
  const [updateBookingStatus, { isLoading: isUpdating }] =
    useUpdateBookingsMutation();

  // Check if the data is loaded before rendering the componen

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

  // Improved status update handler with confirmation and feedback
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Format the request body correctly with status in lowercase
      await updateBookingStatus({
        id,
        data: { status: newStatus.toLowerCase() },
      }).unwrap();

      message.success(`Booking marked as ${newStatus} successfully`);
      refetch(); // Refresh the data to show updated status
    } catch (error) {
      message.error(
        `Failed to update booking status: ${error.message || "Unknown error"}`
      );
    }
  };

  // Status tag renderer with appropriate colors
  const renderStatusTag = (status) => {
    // Convert status to title case for display
    const displayStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    let color;
    switch (status.toLowerCase()) {
      case "approved":
        color = "green";
        break;
      case "pending":
        color = "orange";
        break;
      case "cancelled":
        color = "red";
        break;
      case "completed":
        color = "blue";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{displayStatus}</Tag>;
  };

  const columns = [
    {
      title: "Date/Time",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (date) => moment(date).format("DD MMM YYYY - hh:mm A"),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (_, record) => (
        <p>{record?.duration ? `${record.duration} min` : "N/A"}</p>
      ),
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>

          {record.status.toLowerCase() !== "cancelled" &&
            record.status.toLowerCase() !== "completed" && (
              <Popconfirm
                title="Are you sure you want to cancel this booking?"
                onConfirm={() => handleStatusUpdate(record._id, "cancelled")}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  icon={<CloseCircleOutlined />}
                  size="small"
                  loading={isUpdating}
                >
                  Cancel
                </Button>
              </Popconfirm>
            )}

          {record.status.toLowerCase() !== "completed" &&
            record.status.toLowerCase() !== "cancelled" && (
              <Popconfirm
                title="Mark this booking as completed?"
                onConfirm={() => handleStatusUpdate(record._id, "completed")}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  style={{ backgroundColor: "#52c41a" }}
                  loading={isUpdating}
                >
                  Complete
                </Button>
              </Popconfirm>
            )}
        </Space>
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
            pagination={{ pageSize: 10 }}
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
