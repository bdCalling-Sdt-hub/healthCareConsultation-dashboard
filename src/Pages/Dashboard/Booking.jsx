import React, { useEffect, useState } from "react";
import { Calendar, Table, Tabs } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import BookingCalendar from "../../components/ui/Bookings/BookingCalender";

const { TabPane } = Tabs;

// 📝 Fake Table Data for Booking History
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
    render: () => (
      <EyeOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
    ),
  },
];

const bookingsData = [
  {
    key: "1",
    date: "01 Mar 2024 - 9:00 AM",
    service: "Haircut",
    client: "John Doe",
    status: "Approved",
  },
  {
    key: "2",
    date: "03 Mar 2024 - 2:00 PM",
    service: "Facial",
    client: "Jane Doe",
    status: "Pending",
  },
  {
    key: "3",
    date: "07 Mar 2024 - 10:00 AM",
    service: "Manicure",
    client: "Mike Smith",
    status: "Rejected",
  },
  {
    key: "4",
    date: "12 Mar 2024 - 1:00 PM",
    service: "Massage",
    client: "Anna Brown",
    status: "Approved",
  },
  {
    key: "5",
    date: "18 Mar 2024 - 3:00 PM",
    service: "Hair Coloring",
    client: "David Wilson",
    status: "Pending",
  },
  {
    key: "6",
    date: "25 Mar 2024 - 11:00 AM",
    service: "Pedicure",
    client: "Emily Johnson",
    status: "Approved",
  },
];

const Bookings = () => {
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
        {/* Booking History Tab */}
        <TabPane tab="Booking History" key="1">
          <Table
            columns={columns}
            dataSource={bookingsData}
            pagination={{ pageSize: 5 }}
            style={{ marginTop: "16px" }}
          />
        </TabPane>

        {/* Booking Timetable Tab */}
        <TabPane tab="Booking Timetable" key="2">
          <BookingCalendar />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Bookings;
