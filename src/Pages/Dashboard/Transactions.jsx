import React, { useState } from "react";
import { ConfigProvider, Table, Modal } from "antd";
import { FaEye } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";

const Transactions = () => {
  const [visible, setVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Client Name", dataIndex: "client", key: "client" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span style={{ color: status === "Paid" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <FaEye
          size={20}
          style={{ color: "#1890ff", cursor: "pointer" }}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

  const data = [
    {
      key: "1",
      date: "10 May, 2024",
      service: "Revenue Integrity & Compliance",
      client: "Chris Hemsworth",
      email: "mahmud@gmail.com",
      address: "76/4 R no. 60/1 Rue des Saints-Paris, 75005 Paris",
      phone: "+099999",
      bookingId: "#132547964",
      amount: "$240",
      paymentStatus: "Paid",
      time: "8:00 AM - 10:00 AM",
      image:
        "https://image.tmdb.org/t/p/w235_and_h235_face/piQGdoIQOF3C1EI5cbYZLAW1gfj.jpg",
    },
    {
      key: "2",
      date: "12 May, 2024",
      service: "Financial Risk Assessment",
      client: "Robert Downey Jr.",
      email: "tony@starkindustries.com",
      address: "10880 Malibu Point, Malibu, CA",
      phone: "+123456789",
      bookingId: "#132547965",
      amount: "$350",
      paymentStatus: "Pending",
      time: "10:00 AM - 12:00 PM",
      image:
        "https://image.tmdb.org/t/p/w235_and_h235_face/1YjdSym1jTG7xjHSI0yGGWEsw5i.jpg",
    },
    {
      key: "3",
      date: "15 May, 2024",
      service: "Corporate Tax Advisory",
      client: "Scarlett Johansson",
      email: "natasha@shield.com",
      address: "Avengers Facility, New York, NY",
      phone: "+987654321",
      bookingId: "#132547966",
      amount: "$280",
      paymentStatus: "Paid",
      time: "1:00 PM - 3:00 PM",
      image:
        "https://image.tmdb.org/t/p/w235_and_h235_face/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg",
    },
    {
      key: "4",
      date: "18 May, 2024",
      service: "Mergers & Acquisitions Consultation",
      client: "Chris Evans",
      email: "cap@avengers.com",
      address: "Brooklyn, NY",
      phone: "+1122334455",
      bookingId: "#132547967",
      amount: "$400",
      paymentStatus: "Paid",
      time: "2:00 PM - 4:00 PM",
      image:
        "https://image.tmdb.org/t/p/w235_and_h235_face/jpurJ9jAcLCYjgHHfYF32m3zJYm.jpg",
    },
    {
      key: "5",
      date: "20 May, 2024",
      service: "Business Strategy Consulting",
      client: "Mark Ruffalo",
      email: "hulk@avengers.com",
      address: "Harlem, NY",
      phone: "+5566778899",
      bookingId: "#132547968",
      amount: "$500",
      paymentStatus: "Pending",
      time: "4:00 PM - 6:00 PM",
      image:
        "https://image.tmdb.org/t/p/w235_and_h235_face/uC6TTUhPpQCmgldGyYveKRAu8JN.jpg",
    },
  ];

  const handleViewDetails = (record) => {
    setSelectedTransaction(record);
    setVisible(true);
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#15405D",
              headerColor: "white",
            },
          },
        }}
      >
        <Table
          columns={columns}
          rowKey="key"
          dataSource={data}
          pagination={{ pageSize: 5 }}
        />
      </ConfigProvider>

      <Modal
        title={null}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={400}
      >
        {selectedTransaction && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h3
              style={{
                textAlign: "left",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Booking
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginTop: "10px",
              }}
            >
              <img
                src={selectedTransaction.image}
                alt={selectedTransaction.client}
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />
              <div style={{ textAlign: "left" }}>
                <h4 style={{ margin: 0 }}>{selectedTransaction.client}</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                  {selectedTransaction.email}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                  {selectedTransaction.address}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                  {selectedTransaction.phone}
                </p>
              </div>
            </div>
            <hr style={{ margin: "15px 0" }} />
            <div style={{ textAlign: "left" }}>
              <p>
                <strong>Booking ID:</strong> {selectedTransaction.bookingId}
              </p>
              <p>
                <strong>Service:</strong> {selectedTransaction.service}
              </p>
              <p>
                <strong>Amount:</strong> {selectedTransaction.amount}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span style={{ color: "green" }}>
                  ● {selectedTransaction.paymentStatus}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <IoCalendarOutline /> {selectedTransaction.date}
              </p>
              <p className="flex items-center gap-2 text-red-500">
                <MdAccessTime /> {selectedTransaction.time}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transactions;
