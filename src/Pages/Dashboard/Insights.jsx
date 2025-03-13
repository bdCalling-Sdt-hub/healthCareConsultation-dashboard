import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddAndEditInsightModal from "../../components/ui/Insights/AddAndEditInsightModal";
const fakeInsights = [
  {
    key: "1",
    title: "Revenue Integrity & Compliance",
    clientBackground: "Client background details...",
    challenge: "Challenge description...",
    approach: "Our approach...",
    testimonial: "When an unknown step galley of...",
    publicationDate: "27 January 2024",
  },
  {
    key: "2",
    title: "Digital Transformation",
    clientBackground: "Helping clients navigate the digital landscape...",
    challenge: "Challenge description...",
    approach: "Our approach...",
    testimonial: "The Big Oxmox advised her not to believe...",
    publicationDate: "28 January 2024",
  },
  {
    key: "3",
    title: "Business Model Innovation",
    clientBackground: "Designing and implementing new business models...",
    challenge: "Challenge description...",
    approach: "Our approach...",
    testimonial: "Pack my box with five dozen liquor jugs.",
    publicationDate: "29 January 2024",
  },
  {
    key: "4",
    title: "Operational Efficiency",
    clientBackground: "Increasing efficiency in operations...",
    challenge: "Challenge description...",
    approach: "Our approach...",
    testimonial: "How vexingly quick witted zebras jump!",
    publicationDate: "30 January 2024",
  },
];

const InsightsPage = () => {
  const [data, setData] = useState(fakeInsights);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);

  const handleEdit = (record) => {
    setEditingInsight(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    setEditingInsight(null);
    setIsModalVisible(true);
  };

  const columns = [
    { title: "SL No.", dataIndex: "key", key: "key" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Testimonial", dataIndex: "testimonial", key: "testimonial" },
    {
      title: "Publication Date",
      dataIndex: "publicationDate",
      key: "publicationDate",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ marginRight: 10, color: "#F3B806" }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record.key)}
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Insights</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Insight
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey="key"
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
      <AddAndEditInsightModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        service={editingInsight}
        setData={setData}
        data={data}
      />
    </div>
  );
};

export default InsightsPage;
