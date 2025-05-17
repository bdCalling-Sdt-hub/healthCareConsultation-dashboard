import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spin,
  message,
  Form,
  Input,
  Card,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import AddAndEditInsightModal from "../../components/ui/Insights/AddAndEditInsightModal";
import { FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  useCreateInsightChartMutation,
  useCreateInsightMutation,
  useDeleteInsightMutation,
  useGetAllInsightChartQuery,
  useInsightsQuery,
} from "../../redux/apiSlices/insightsSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import moment from "moment";

const { Title } = Typography;

const InsightsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [chartTitle, setChartTitle] = useState("Growth Rate Data");
  const [chartDescription, setChartDescription] = useState(
    "Enter monthly values for the website performance chart."
  );
  const [isEditingChart, setIsEditingChart] = useState(false);
  const [growthData, setGrowthData] = useState([
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
    { month: "Jul", value: 0 },
    { month: "Aug", value: 0 },
    { month: "Sep", value: 0 },
    { month: "Oct", value: 0 },
    { month: "Nov", value: 0 },
    { month: "Dec", value: 0 },
  ]);

  // console.log(editingInsight);

  const { data: insights, isLoading } = useInsightsQuery();
  const [deleteInsight] = useDeleteInsightMutation();

  const { data: insightsChartData, isLoading: isChartLoading } =
    useGetAllInsightChartQuery();
  const [createInsightChart] = useCreateInsightChartMutation();

  // Initialize growth data from API if available
  useEffect(() => {
    if (insightsChartData?.data?.length > 0) {
      const chartData = insightsChartData.data[0]?.chartData || [];
      if (chartData.length > 0) {
        // Ensure we maintain 12 months structure
        const updatedData = [...growthData];
        chartData.forEach((item, index) => {
          if (index < 12) {
            updatedData[index].value = item.value;
          }
        });
        setGrowthData(updatedData);
      }
      // Set chart title and description if available
      if (insightsChartData.data[0]?.title) {
        setChartTitle(insightsChartData.data[0]?.title);
      }
      if (insightsChartData.data[0]?.description) {
        setChartDescription(insightsChartData.data[0]?.description);
      }
    }
  }, [insightsChartData]);

  if (isLoading || isChartLoading) {
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

  const handleGrowthDataChange = (index, value) => {
    const newData = [...growthData];
    newData[index].value = parseInt(value) || 0;
    setGrowthData(newData);
  };

  const handleSaveGrowthData = async () => {
    try {
      const payload = {
        data: growthData,
        title: chartTitle,
        description: chartDescription,
      };

      console.log(payload);

      const response = await createInsightChart(payload).unwrap();

      if (response.success) {
        message.success("Chart data saved successfully!");
        setIsEditingChart(false);
      } else {
        message.error(response.message || "Failed to save chart data");
      }
    } catch (error) {
      console.error("Error saving chart data:", error);
      message.error(error?.data?.message || "Something went wrong!");
    }
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
        <img
          src={getImageUrl(image)}
          alt=""
          className="w-20 h-16 object-cover rounded-md"
        />
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

      <div className="mt-8">
        <Card className="shadow-sm">
          <div className="flex justify-between items-center mb-4">
            {isEditingChart ? (
              <Input
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title (e.g., Obesity Rates, Heart Failure Statistics)"
                className="font-bold text-lg w-1/2"
              />
            ) : (
              <Title level={4} className="mb-0">
                {chartTitle}
              </Title>
            )}
            <Button
              type={isEditingChart ? "default" : "primary"}
              icon={isEditingChart ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => setIsEditingChart(!isEditingChart)}
            >
              {isEditingChart ? "Cancel" : "Edit Chart"}
            </Button>
          </div>

          {isEditingChart ? (
            <Input.TextArea
              value={chartDescription}
              onChange={(e) => setChartDescription(e.target.value)}
              placeholder="Enter chart description (e.g., Monthly obesity rates across the US)"
              className="mb-4"
              rows={2}
            />
          ) : (
            <p className="text-gray-600 mb-4">{chartDescription}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {growthData.map((item, index) => (
              <div key={item.month} className="mb-4">
                <Form.Item label={item.month} className="mb-1">
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) =>
                      handleGrowthDataChange(index, e.target.value)
                    }
                    addonBefore={item.month}
                    placeholder="Enter value"
                  />
                </Form.Item>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveGrowthData}
              className="bg-primary"
            >
              Save Chart Data
            </Button>
          </div>
        </Card>
      </div>

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
