import React, { useState } from "react";
import {
  Calendar,
  Badge,
  Modal,
  Form,
  TimePicker,
  Button,
  DatePicker,
} from "antd";
import dayjs from "dayjs";

const BookingCalendar = () => {
  // State to hold bookings
  const [bookings, setBookings] = useState([
    {
      date: "2025-03-15",
      startTime: "10:00",
      endTime: "11:00",
      title: "Check-up",
    },
    {
      date: "2025-03-16",
      startTime: "14:00",
      endTime: "15:00",
      title: "Vaccination",
    },
    {
      date: "2025-03-18",
      startTime: "13:00",
      endTime: "14:00",
      title: "Dermatology Consultation",
    },
  ]);

  // State for modal and selected booking
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [form] = Form.useForm(); // Ant Design Form instance

  // Open modal when clicking a booking
  const handleEdit = (index) => {
    const booking = bookings[index];
    setEditingBooking(index);
    setIsModalOpen(true);

    // Set initial values in the form
    form.setFieldsValue({
      date: dayjs(booking.date),
      startTime: dayjs(booking.startTime, "HH:mm"),
      endTime: dayjs(booking.endTime, "HH:mm"),
    });
  };

  // Handle booking update
  const handleFinish = (values) => {
    const updatedBooking = {
      ...bookings[editingBooking],
      date: values.date.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
    };

    // Update the booking in the array
    const updatedBookings = [...bookings];
    updatedBookings[editingBooking] = updatedBooking;
    setBookings(updatedBookings);

    setIsModalOpen(false);
  };

  // Render bookings inside the calendar
  const dateCellRender = (value) => {
    const formattedDate = dayjs(value).format("YYYY-MM-DD");
    const dailyBookings = bookings.filter((b) => b.date === formattedDate);

    return dailyBookings.length > 0 ? (
      <ul className="m-0 p-1">
        {dailyBookings.map((item, index) => (
          <li
            key={index}
            className="list-none p-2 rounded-md bg-[rgb(110,197,255)] cursor-pointer"
            onClick={() => handleEdit(index)}
          >
            <Badge
              status="success"
              text={`${item.title} (${dayjs(item.startTime, "HH:mm").format(
                "hh:mm A"
              )} - ${dayjs(item.endTime, "HH:mm").format("hh:mm A")})`}
              className="text-xs"
            />
          </li>
        ))}
      </ul>
    ) : null;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Booking Calendar</h2>
      <Calendar dateCellRender={dateCellRender} />

      {/* Edit Booking Modal */}
      <Modal
        title="Edit Booking"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Select a date" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[{ required: true, message: "Select start time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="endTime"
            rules={[{ required: true, message: "Select end time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Update Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
