import React, { useState, useEffect } from "react";
import {
  Calendar,
  Badge,
  Modal,
  Form,
  TimePicker,
  Button,
  DatePicker,
  Select,
  Input,
  InputNumber,
  Radio,
  Divider,
  Space,
  Typography,
  Tooltip,
} from "antd";
import {
  VideoCameraOutlined,
  UserOutlined,
  DollarOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { Text, Title } = Typography;

const BookingCalendar = () => {
  // State to hold bookings
  const [bookings, setBookings] = useState([
    {
      date: "2025-04-15",
      startTime: "10:00",
      endTime: "11:00",
      title: "Check-up",
      meetingType: "physical",
      clientMessage: "Please arrive 15 minutes early to complete paperwork.",
    },
    {
      date: "2025-04-16",
      startTime: "14:00",
      endTime: "15:00",
      title: "Vaccination",
      meetingType: "physical",
      clientMessage: "Bring your vaccination history if available.",
    },
    {
      date: "2025-04-18",
      startTime: "13:00",
      endTime: "14:00",
      title: "Dermatology Consultation",
      meetingType: "online",
      price: 50,
      meetingLink: "https://zoom.us/j/123456789",
      clientMessage: "Please ensure you have good lighting for the video call.",
    },
  ]);

  // Available time slots
  const [availableSlots, setAvailableSlots] = useState([]);

  // State for modal and selected booking
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [meetingType, setMeetingType] = useState("physical");
  const [form] = Form.useForm(); // Ant Design Form instance

  // Generate available time slots for selected date
  useEffect(() => {
    if (isModalOpen && form.getFieldValue("date")) {
      generateTimeSlots(form.getFieldValue("date").format("YYYY-MM-DD"));
    }
  }, [isModalOpen, form]);

  // Generate time slots for a specific date
  const generateTimeSlots = (date) => {
    // Example time slots (9 AM to 5 PM, 1-hour intervals)
    const slots = [];
    const bookedSlots = bookings
      .filter(
        (b) =>
          b.date === date &&
          b.id !==
            (editingBooking !== null ? bookings[editingBooking].id : null)
      )
      .map((b) => b.startTime);

    for (let hour = 9; hour < 17; hour++) {
      const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
      if (!bookedSlots.includes(timeSlot)) {
        slots.push({
          startTime: timeSlot,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        });
      }
    }

    setAvailableSlots(slots);
  };

  // Open modal when clicking a booking
  const handleEdit = (index) => {
    const booking = bookings[index];
    setEditingBooking(index);
    setMeetingType(booking.meetingType || "physical");
    setIsModalOpen(true);

    // Set initial values in the form
    form.setFieldsValue({
      date: dayjs(booking.date),
      timeSlot: `${booking.startTime}-${booking.endTime}`,
      meetingType: booking.meetingType || "physical",
      price: booking.price,
      meetingLink: booking.meetingLink,
      title: booking.title,
    });

    // Generate time slots for the selected date
    generateTimeSlots(booking.date);
  };

  // Handle date change
  const handleDateChange = (date) => {
    if (date) {
      generateTimeSlots(date.format("YYYY-MM-DD"));
    }
  };

  // Handle meeting type change
  const handleMeetingTypeChange = (e) => {
    setMeetingType(e.target.value);
  };

  // Handle booking update
  const handleFinish = (values) => {
    const [startTime, endTime] = values.timeSlot.split("-");

    const updatedBooking = {
      ...bookings[editingBooking],
      date: values.date.format("YYYY-MM-DD"),
      startTime,
      endTime,
      title: values.title,
      meetingType: values.meetingType,
      meetingLink: values.meetingLink,
      clientMessage: values.clientMessage, // Save client message
    };

    // Add online-specific fields if meeting type is online
    if (values.meetingType === "online") {
      updatedBooking.price = values.price;
    } else {
      // Remove online-specific fields if meeting type is physical
      delete updatedBooking.price;
    }

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
          <Tooltip
            key={index}
            title={`${item.title} (${dayjs(item.startTime, "HH:mm").format(
              "hh:mm A"
            )} - ${dayjs(item.endTime, "HH:mm").format("hh:mm A")})`}
          >
            <li
              className={`list-none py-1 px-2 rounded-md cursor-pointer mb-1 flex items-center ${
                item.meetingType === "online" ? "bg-blue-100" : "bg-green-100"
              }`}
              onClick={() =>
                handleEdit(
                  bookings.findIndex(
                    (b) =>
                      b.date === item.date &&
                      b.startTime === item.startTime &&
                      b.title === item.title
                  )
                )
              }
            >
              <Badge
                status={
                  item.meetingType === "online" ? "processing" : "success"
                }
              />
              <span className="ml-1 text-xs truncate max-w-[80%]">
                {dayjs(item.startTime, "HH:mm").format("hh:mm A")} {item.title}
              </span>
            </li>
          </Tooltip>
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
        title={
          <div className="flex items-center gap-2 text-primary">
            <CalendarOutlined />
            <span>Edit Appointment</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1200}
        className="booking-modal"
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          className="mt-4"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="bg-gray-50 p-4 rounded-lg h-full">
                <Form.Item
                  label={
                    <div className="flex items-center gap-2">
                      <CalendarOutlined />
                      <span>Appointment Date</span>
                    </div>
                  }
                  name="date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    className="w-full"
                    onChange={handleDateChange}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <div className="flex items-center gap-2">
                      <ClockCircleOutlined />
                      <span>Time Slot</span>
                    </div>
                  }
                  name="timeSlot"
                  rules={[
                    { required: true, message: "Please select a time slot" },
                  ]}
                >
                  <Select className="w-full">
                    {availableSlots.map((slot, index) => (
                      <Option
                        key={index}
                        value={`${slot.startTime}-${slot.endTime}`}
                      >
                        {dayjs(slot.startTime, "HH:mm").format("hh:mm A")} -{" "}
                        {dayjs(slot.endTime, "HH:mm").format("hh:mm A")}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Appointment Title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please enter appointment title",
                    },
                  ]}
                >
                  <Input placeholder="E.g., Check-up, Consultation, etc." />
                </Form.Item>

                <Form.Item
                  label={
                    <div className="flex items-center gap-2">
                      <LinkOutlined />
                      <span>Meeting Link</span>
                    </div>
                  }
                  name="meetingLink"
                  rules={[
                    { required: true, message: "Please enter meeting link" },
                    { type: "url", message: "Please enter a valid URL" },
                  ]}
                >
                  <Input placeholder="https://zoom.us/j/123456789" />
                </Form.Item>
              </div>
            </div>

            <div className="flex-1 min-w-[300px]">
              <div className="h-full flex flex-col">
                <div className="mb-2">
                  <Divider orientation="left" className="my-0">
                    Appointment Type
                  </Divider>
                </div>

                <Form.Item
                  name="meetingType"
                  rules={[
                    { required: true, message: "Please select meeting type" },
                  ]}
                  className="mb-2"
                >
                  <Radio.Group
                    onChange={handleMeetingTypeChange}
                    className="w-full"
                  >
                    <Space direction="vertical" className="w-full">
                      <Radio
                        value="physical"
                        className="p-3 border rounded-lg w-full flex items-center"
                      >
                        <div className="flex items-center gap-2">
                          <UserOutlined className="text-green-500" />
                          <span className="font-medium">
                            Physical Appointment
                          </span>
                        </div>
                        <div className="ml-6 text-gray-500 text-sm">
                          Patient will visit the clinic in person
                        </div>
                      </Radio>
                      <Radio
                        value="online"
                        className="p-3 border rounded-lg w-full flex items-center"
                      >
                        <div className="flex items-center gap-2">
                          <VideoCameraOutlined className="text-blue-500" />
                          <span className="font-medium">
                            Online Consultation
                          </span>
                        </div>
                        <div className="ml-6 text-gray-500 text-sm">
                          Virtual appointment via video call
                        </div>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                {meetingType === "online" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Form.Item
                      label={
                        <div className="flex items-center gap-2">
                          <DollarOutlined />
                          <span>Consultation Fee</span>
                        </div>
                      }
                      name="price"
                      rules={[
                        {
                          required: true,
                          message: "Please enter consultation fee",
                        },
                      ]}
                      className="mb-2"
                    >
                      <InputNumber
                        prefix="$"
                        className="w-full"
                        min={0}
                        placeholder="Enter amount"
                      />
                    </Form.Item>
                  </div>
                )}

                {/* Client Message Section */}
                <div className="mt-4">
                  <Divider orientation="left" className="my-0">
                    Message to Client
                  </Divider>
                  <div className="bg-yellow-50 p-4 rounded-lg mt-2">
                    <Form.Item
                      name="clientMessage"
                      label={
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium">
                            Instructions or Notes
                          </span>
                        </div>
                      }
                      tooltip="This message will be sent to the client with their appointment details"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Enter any special instructions, preparation details, or notes for the client..."
                        className="w-full"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Form.Item className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90"
            >
              Update Appointment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
