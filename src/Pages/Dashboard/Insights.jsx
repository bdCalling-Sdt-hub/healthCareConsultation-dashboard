import React, { useState } from "react";
import { Table, Button, Modal, Spin, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddAndEditInsightModal from "../../components/ui/Insights/AddAndEditInsightModal";
import { FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  useCreateInsightMutation,
  useInsightsQuery,
} from "../../redux/apiSlices/insightsSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import moment from "moment";

const InsightsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);

  // console.log(editingInsight);

  const { data: insights, isLoading } = useInsightsQuery();
  const [createInsight] = useCreateInsightMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const allInsights = insights?.data;
  console.log(allInsights);

  const handleEdit = (record) => {
    setEditingInsight(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: "Delete Insight",
      content: "Are you sure you want to delete this insight?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteInsight(key).unwrap();
          message.success("Insight deleted successfully!");
        } catch (error) {
          message.error(error?.data?.message || "Something went wrong!");
        }
      },
    });
  };

  const handleAdd = () => {
    setEditingInsight(null);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "SL No.",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={getImageUrl(image)} alt="" className="w-20 h-16 rounded-md" />
      ),
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Publication Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD MMMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex">
          <Link to={`/insights/${record?._id}`}>
            <FaEye size={16} style={{ marginRight: 10, color: "#0095FF" }} />
          </Link>
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ marginRight: 10, color: "#F3B806" }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record._id)}
            style={{ color: "red" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Insights</h2>
        <Button
          className="bg-primary text-white py-5"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Insight
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey="_id"
        dataSource={allInsights}
        pagination={{ pageSize: 5 }}
      />
      <AddAndEditInsightModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingInsight(null);
        }}
        initialData={editingInsight}
      />
    </div>
  );
};

export default InsightsPage;
