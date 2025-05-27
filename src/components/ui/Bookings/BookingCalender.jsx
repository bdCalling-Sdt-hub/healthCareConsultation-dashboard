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
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetSlotsByDateQuery,
  useUpdateBookingsMutation,
} from "../../../redux/apiSlices/bookingSlice";
import { useFetchAdminProfileQuery } from "../../../redux/apiSlices/authSlice";

const { Option } = Select;
const { Text, Title } = Typography;

const BookingCalendar = ({ bookingsData }) => {
  console.log("bookingData", bookingsData);

  // State to hold selected date and timezone for API query
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState("America/New_York");

  const { data: userData, isLoading: isAdminLoading } =
    useFetchAdminProfileQuery();
  // Use the query with parameters
  const { data: slotsData, isLoading: slotsLoading } = useGetSlotsByDateQuery(
    {
      date: selectedDate,
      timeZone: userData?.data?.timezone || "America/New_York",
    }
    // { skip: !selectedDate }
  );

  useEffect(() => {
    if (userData?.data) {
      setSelectedTimeZone(userData?.data?.timezone || "America/New_York");
    }
  }, [userData]);

  const [updateBookings] = useUpdateBookingsMutation();

  // Format bookings data
  const formatBookings = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((booking) => {
      // Parse the scheduledAt directly without timezone conversion
      const scheduledDate = dayjs(booking.scheduledAt);
      
      return {
        id: booking._id,
        date: scheduledDate.format("YYYY-MM-DD"),
        time: scheduledDate.format("hh:mm A"), // Use 12-hour format with AM/PM
        // startTime: getTimeFromCode(booking.timeCode),
        // endTime: getTimeFromCode(booking.timeCode + 100), // Assuming 1 hour duration
        title: booking.service?.title || "Appointment",
        paymentMethod: booking.paymentMethod || "physical",
        price: booking.fee,
        clientMessage: booking.message,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        contact: booking.contact,
        link: booking.link,
        status: booking.status,
        industry: booking.industry,
        country: booking.country,
        state: booking.state,
        timezone: booking.timezone, // Add timezone property
        note: booking.note, // Admin note (your instructions to client)
      };
    });
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
      // const slots = [];

      // Extract available slots from API response
      // slotsData.data.forEach((dayData) => {
      //   dayData.times.forEach((timeSlot) => {
      //     if (!timeSlot.isBooked) {
      //       slots.push({
      //         time: timeSlot.time,
      //         timeCode: timeSlot.timeCode,
      //       });
      //     }
      //   });
      // });

      setAvailableSlots(slotsData?.data[0]?.times || []);
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
    setMeetingType(booking.paymentMethod || "physical");
    setIsModalOpen(true);

    console.log("asdfvsdvsdv", booking);

    // Set initial values in the form
    form.setFieldsValue({
      date: dayjs(booking.date),
      timeSlot: booking.time,
      paymentMethod: booking.paymentMethod || "physical",
      price: booking.price,
      link: booking.link, // Changed from meetingLink to link
      title: booking.title,
      message: booking.clientMessage, // Client's message
      adminNote: booking.note, // Admin note (your instructions to client)
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

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setMeetingType(e.target.value);
  };

  // Handle booking update
  const handleFinish = (values) => {
    // Find the selected time slot to get the timeCode
    const selectedSlot = availableSlots.find(
      (slot) => slot.time === values.timeSlot
    );

    // If no timeCode is found, use the original timeCode or a default value
    let timeCode = null;
    if (selectedSlot) {
      timeCode = selectedSlot.timeCode;
    } else if (editingBooking !== null && bookings[editingBooking]) {
      // Use the original booking's timeCode if available
      const originalBooking = bookingsData.find(
        (booking) => booking._id === bookings[editingBooking].id
      );
      timeCode = originalBooking?.timeCode || 900; // Default to 900 (9:00 AM) if not found
    } else {
      // Default timeCode if nothing else is available
      timeCode = 900; // Default to 900 (9:00 AM)
    }

    // Use the selected time slot directly without formatting
    const selectedTime = values.timeSlot || bookings[editingBooking].time;

    // Create the updated booking data according to the required format
    const updateData = {
      date: values.date.format("YYYY-MM-DD"),
      time: selectedTime,
      timeCode: timeCode,
      link: values.link,
      note: values.adminNote,
      paymentRequired: values.paymentMethod === "online",
      paymentMethod: values.paymentMethod,
      fee: values.price,
    };

    // Call the update API
    updateBookings({
      id: bookings[editingBooking].id,
      data: updateData,
    })
      .unwrap()
      .then(() => {
        // Update the local state
        const updatedBooking = {
          ...bookings[editingBooking],
          date: values.date.format("YYYY-MM-DD"),
          time: selectedTime,
          title: values.title,
          paymentMethod: values.paymentMethod,
          price: values.price,
          link: values.link,
          clientMessage: bookings[editingBooking].clientMessage,
          note: values.adminNote,
        };

        const updatedBookings = [...bookings];
        updatedBookings[editingBooking] = updatedBooking;
        setBookings(updatedBookings);

        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Failed to update booking:", error);
      });
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
                <p>{item.time}</p>
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
                {item.time} {item.firstName}
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
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
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
                    <Select
                      className="w-full"
                      loading={slotsLoading}
                      placeholder="Select a time slot"
                    >
                      {availableSlots?.map((slot, index) => (
                        <Option key={index} value={slot?.time}>
                          {slot?.time}
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
                    name="link"
                    rules={[
                      {
                        type: "url",
                        message: "Please enter a valid URL",
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
                      Payment Information
                    </Divider>
                  </div>

                  <Form.Item
                    name="paymentMethod"
                    rules={[
                      {
                        required: true,
                        message: "Please select payment method",
                      },
                    ]}
                    className="mb-2"
                  >
                    <Radio.Group
                      onChange={handlePaymentMethodChange}
                      className="w-full"
                    >
                      <Space direction="vertical" className="w-full">
                        <Radio
                          value="physical"
                          className="p-3 border rounded-lg w-full flex items-center"
                        >
                          <div className="flex items-center gap-2">
                            <CreditCardOutlined className="text-green-500" />
                            <span className="font-medium">
                              Physical Payment
                            </span>
                          </div>
                          <div className="ml-6 text-gray-500 text-sm">
                            Client will pay in person
                          </div>
                        </Radio>
                        <Radio
                          value="online"
                          className="p-3 border rounded-lg w-full flex items-center"
                        >
                          <div className="flex items-center gap-2">
                            <CreditCardOutlined className="text-blue-500" />
                            <span className="font-medium">Online Payment</span>
                          </div>
                          <div className="ml-6 text-gray-500 text-sm">
                            Client will pay online
                          </div>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

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

                  <Form.Item
                    label="Client's Message"
                    name="message"
                    className="mt-4"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Client's message will appear here"
                      readOnly
                      disabled
                      className="bg-gray-50"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Admin Notes/Instructions"
                    name="adminNote"
                    className="mt-4"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Add any special instructions or notes for this appointment"
                    />
                  </Form.Item>

                  <div className="mt-auto pt-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      size="large"
                    >
                      Update Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default BookingCalendar;
