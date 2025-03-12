import React from "react";
import { ConfigProvider, Table } from "antd";
import { FaEye } from "react-icons/fa";

const Transactions = () => {
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
      render: () => <FaEye style={{ color: "#1890ff", cursor: "pointer" }} />,
    },
  ];

  const data = [
    {
      key: "1",
      date: "2025-03-01",
      service: "Health Cate Consultation",
      client: "John Doe",
      amount: "$50",
      paymentStatus: "Paid",
    },
    {
      key: "2",
      date: "2025-03-03",
      service: "Health Cate Consultation",
      client: "Jane Doe",
      amount: "$70",
      paymentStatus: "Pending",
    },
    {
      key: "3",
      date: "2025-03-07",
      service: "Health Cate Consultation",
      client: "Mike Smith",
      amount: "$30",
      paymentStatus: "Paid",
    },
    {
      key: "4",
      date: "2025-03-12",
      service: "Health Cate Consultation",
      client: "Anna Brown",
      amount: "$100",
      paymentStatus: "Paid",
    },
    {
      key: "5",
      date: "2025-03-18",
      service: "Health Cate Consultation",
      client: "David Wilson",
      amount: "$80",
      paymentStatus: "Pending",
    },
  ];

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
          dataSource={data}
          pagination={{ pageSize: 5 }}
        />
      </ConfigProvider>
    </div>
  );
};

export default Transactions;
