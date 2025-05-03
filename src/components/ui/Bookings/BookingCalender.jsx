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
import { useGetSlotsByDateQuery } from "../../../redux/apiSlices/bookingSlice";

const { Option } = Select;
const { Text, Title } = Typography;

const BookingCalendar = ({ bookingsData }) => {
  // Convert timeCode to time format
  const getTimeFromCode = (timeCode) => {
    const hours = Math.floor(timeCode / 100);
    const minutes = timeCode % 100;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // State to hold selected date and timezone for API query
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState("America/New_York");

  // Use the query with parameters
  const { data: slotsData, isLoading: slotsLoading } = useGetSlotsByDateQuery(
    { date: selectedDate, timeZone: selectedTimeZone }
    // { skip: !selectedDate }
  );

  // Format bookings data
  const formatBookings = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((booking) => ({
      id: booking._id,
      date: dayjs(booking.scheduledAt).format("YYYY-MM-DD"),
      startTime: getTimeFromCode(booking.timeCode),
      endTime: getTimeFromCode(booking.timeCode + 100), // Assuming 1 hour duration
      title: booking.service?.title || "Appointment",
      meetingType: booking.paymentRequired ? "online" : "physical",
      price: booking.fee,
      clientMessage: booking.message,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      contact: booking.contact,
      status: booking.status,
      industry: booking.industry,
      country: booking.country,
      state: booking.state,
      timezone: booking.timezone, // Add timezone property
    }));
  };

  // State to hold bookings
  const [bookings, setBookings] = useState([]);

  // Available time slots
  const [availableSlots, setAvailableSlots] = useState([]);
  console.log(availableSlots);

  // State for modal and selected booking
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [meetingType, setMeetingType] = useState("physical");
  const [form] = Form.useForm(); // Ant Design Form instance

  // Initialize bookings from props
  useEffect(() => {
    if (bookingsData) {
      const formattedBookings = formatBookings(bookingsData);
      setBookings(formattedBookings);
    }
  }, [bookingsData]);

  // Update available slots when slots data changes
  useEffect(() => {
    if (slotsData?.data && slotsData.data.length > 0) {
      const slots = [];

      // Extract available slots from API response
      slotsData.data.forEach((dayData) => {
        dayData.times.forEach((timeSlot) => {
          if (!timeSlot.isBooked) {
            slots.push({
              time: timeSlot.time,
              timeCode: timeSlot.timeCode,
            });
          }
        });
      });

      setAvailableSlots(slots);
    }
  }, [slotsData]);

  // Generate available time slots for selected date
  useEffect(() => {
    if (isModalOpen && form.getFieldValue("date")) {
      const date = form.getFieldValue("date");
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);

      // If editing a booking, use its timezone
      if (editingBooking !== null && bookings[editingBooking]) {
        setSelectedTimeZone(
          bookings[editingBooking].timezone || "America/New_York"
        );
      }
    }
  }, [isModalOpen, form, editingBooking, bookings]);

  // Open modal when clicking a booking
  const handleEdit = (index) => {
    if (index === -1 || !bookings[index]) return;

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

    // Set selected date for API query
    const formattedDate = dayjs(booking.date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setSelectedTimeZone(booking.timezone || "America/New_York");
  };

  // Handle date change
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);

      // If editing a booking, use its timezone
      if (editingBooking !== null && bookings[editingBooking]) {
        setSelectedTimeZone(
          bookings[editingBooking].timezone || "America/New_York"
        );
      }
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
      clientMessage: values.clientMessage,
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
            key={item.id || index}
            title={
              <div>
                <p>
                  <strong>{item.title}</strong>
                </p>
                <p>{`${item.firstName} ${item.lastName}`}</p>
                <p>
                  {dayjs(item.startTime, "HH:mm").format("hh:mm A")} -{" "}
                  {dayjs(item.endTime, "HH:mm").format("hh:mm A")}
                </p>
                <p>Status: {item.status}</p>
              </div>
            }
          >
            <li
              className={`list-none py-1 px-2 rounded-md cursor-pointer mb-1 flex items-center ${
                item.meetingType === "online" ? "bg-blue-100" : "bg-green-100"
              }`}
              onClick={() =>
                handleEdit(bookings.findIndex((b) => b.id === item.id))
              }
            >
              <Badge
                status={
                  item.status === "pending"
                    ? "warning"
                    : item.meetingType === "online"
                    ? "processing"
                    : "success"
                }
              />
              <span className="ml-1 text-xs truncate max-w-[80%]">
                {dayjs(item.startTime, "HH:mm").format("hh:mm A")}{" "}
                {item.firstName}
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
        {editingBooking !== null && bookings[editingBooking] && (
          <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            className="mt-4"
          >
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="bg-gray-50 p-4 rounded-lg h-full">
                  <div className="mb-4">
                    <Title level={5}>Client Information</Title>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong>{" "}
                        {bookings[editingBooking].firstName}{" "}
                        {bookings[editingBooking].lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {bookings[editingBooking].email}
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        {bookings[editingBooking].contact}
                      </p>
                      <p>
                        <strong>Industry:</strong>{" "}
                        {bookings[editingBooking].industry}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {bookings[editingBooking].state},{" "}
                        {bookings[editingBooking].country}
                      </p>
                      <p>
                        <strong>Time Zone:</strong>{" "}
                        {bookings[editingBooking].timezone}
                      </p>
                    </div>
                  </div>

                  <Form.Item
                    label={
                      <div className="flex items-center gap-2">
                        <CalendarOutlined />
                        <span>Appointment Date</span>
                      </div>
                    }
                    name="date"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
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
                    <Select className="w-full" loading={slotsLoading}>
                      {availableSlots.map((slot, index) => (
                        <Option
                          key={index}
                          value={`${slot.startTime}-${slot.endTime}`}
                          data-timecode={slot.timeCode}
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
                      {
                        required: meetingType === "online",
                        message: "Please enter meeting link",
                      },
                      {
                        type: "url",
                        message: "Please enter a valid URL",
                        warningOnly: meetingType !== "online",
                      },
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
                      Message from Client
                    </Divider>
                    <div className="bg-yellow-50 p-4 rounded-lg mt-2 mb-4">
                      <p className="text-gray-700">
                        {bookings[editingBooking].clientMessage}
                      </p>
                    </div>

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
                          name="sentMessageToClient"
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
        )}
      </Modal>
    </div>
  );
};

export default BookingCalendar;
