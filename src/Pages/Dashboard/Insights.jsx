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
  DatePicker,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
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
import { useGetAllServicesQuery } from "../../redux/apiSlices/serviceSlice";

const { Title } = Typography;
const { Option } = Select;

const InsightsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [chartTitle, setChartTitle] = useState("Growth Rate Data");
  const [chartDescription, setChartDescription] = useState(
    "Enter monthly values for the website performance chart."
  );
  const [isEditingChart, setIsEditingChart] = useState(false);
  const [growthData, setGrowthData] = useState([]);
  const [newMonthName, setNewMonthName] = useState("");
  const [newMonthYear, setNewMonthYear] = useState(moment().format("YYYY"));

  // Add new state for services section
  const [serviceData, setServiceData] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [serviceValue, setServiceValue] = useState(0);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [serviceChartTitle, setServiceChartTitle] = useState("Top Services");
  const [serviceChartDescription, setServiceChartDescription] = useState(
    "Distribution of our most popular healthcare services."
  );
  const [chartFooter, setChartFooter] = useState(""); // 1. Add state for footer

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // console.log(editingInsight);

  const { data: insights, isLoading } = useInsightsQuery();
  const [deleteInsight] = useDeleteInsightMutation();

  const { data: insightsChartData, isLoading: isChartLoading } =
    useGetAllInsightChartQuery();

  const { data: allServices, isLoading: isServiceLoading } =
    useGetAllServicesQuery();

  const [createInsightChart] = useCreateInsightChartMutation();

  // Initialize growth data from API if available
  useEffect(() => {
    if (insightsChartData?.data) {
      // Check if we have graph data
      const graphData = insightsChartData.data.graph || [];

      if (graphData.length > 0) {
        // Get the first graph item
        const chartItem = graphData[0];

        // Set the chart data
        if (chartItem.data && chartItem.data.length > 0) {
          setGrowthData(chartItem.data);
        } else {
          // Initialize with empty array if no data
          setGrowthData([]);
        }

        // Set chart title and description if available
        if (chartItem.title) {
          setChartTitle(chartItem.title);
        }
        if (chartItem.description) {
          setChartDescription(chartItem.description);
        }
        if (chartItem.footer) {
          setChartFooter(chartItem.footer);
        } else {
          setChartFooter("");
        }
      }
    }
  }, [insightsChartData]);

  // Initialize service data from API if available
  useEffect(() => {
    if (insightsChartData?.data) {
      // Check if we have pie chart data
      const pieData = insightsChartData.data.pie || [];

      if (pieData.length > 0) {
        // Get the first pie chart item
        const chartItem = pieData[0];

        // Set the chart data
        if (chartItem.data && chartItem.data.length > 0) {
          setServiceData(chartItem.data);
        }

        // Set chart title and description if available
        if (chartItem.title) {
          setServiceChartTitle(chartItem.title);
        }
        if (chartItem.description) {
          setServiceChartDescription(chartItem.description);
        }
      }
    }
  }, [insightsChartData]);

  if (isLoading || isChartLoading || isServiceLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const allInsights = insights?.data;
  const allServicesData = allServices?.data;
  console.log(allServicesData);

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

  const handleAddMonth = () => {
    if (!newMonthName) {
      message.error("Please select a month");
      return;
    }

    // Check if month already exists
    const monthExists = growthData.some(
      (item) => item.name === `${newMonthName} ${newMonthYear}`
    );

    if (monthExists) {
      message.error(`${newMonthName} ${newMonthYear} already exists`);
      return;
    }

    const newMonth = {
      name: `${newMonthName} ${newMonthYear}`,
      value: 0,
    };

    setGrowthData([...growthData, newMonth]);
    setNewMonthName("");
  };

  const handleRemoveMonth = (index) => {
    const newData = [...growthData];
    newData.splice(index, 1);
    setGrowthData(newData);
  };

  const handleSaveGrowthData = async () => {
    try {
      const payload = {
        title: chartTitle,
        description: chartDescription,
        footer: chartFooter, // 2. Add footer to payload
        type: "graph",
        data: growthData,
      };

      // console.log(payload);

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

  const handleServiceValueChange = (value) => {
    setServiceValue(parseInt(value) || 0);
  };

  const handleAddService = () => {
    if (!selectedService) {
      message.error("Please select a service");
      return;
    }

    // Find the selected service details
    const serviceDetails = allServicesData.find(
      (service) => service._id === selectedService
    );

    if (!serviceDetails) {
      message.error("Service not found");
      return;
    }

    const newService = {
      name: serviceDetails.title,
      value: serviceValue,
      id: serviceDetails._id,
    };

    setServiceData([...serviceData, newService]);
    setSelectedService("");
    setServiceValue(0);
  };

  const handleRemoveService = (index) => {
    const newData = [...serviceData];
    newData.splice(index, 1);
    setServiceData(newData);
  };

  const handleServiceDataChange = (index, value) => {
    const newData = [...serviceData];
    newData[index].value = parseInt(value) || 0;
    setServiceData(newData);
  };

  const handleSaveServiceData = async () => {
    try {
      const payload = {
        title: serviceChartTitle,
        description: serviceChartDescription,
        type: "pie",
        data: serviceData,
      };

      console.log(payload);

      const response = await createInsightChart(payload).unwrap();

      if (response.success) {
        message.success("Service chart data saved successfully!");
        setIsEditingServices(false);
      } else {
        message.error(response.message || "Failed to save service chart data");
      }
    } catch (error) {
      console.error("Error saving service chart data:", error);
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

          {isEditingChart && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-3">Add New Month</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <Select
                    placeholder="Select month"
                    className="w-full"
                    value={newMonthName}
                    onChange={(value) => setNewMonthName(value)}
                  >
                    {months.map((month) => (
                      <Option key={month} value={month}>
                        {month}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <DatePicker
                    picker="year"
                    value={moment(newMonthYear, "YYYY")}
                    onChange={(date) =>
                      setNewMonthYear(
                        date ? date.format("YYYY") : moment().format("YYYY")
                      )
                    }
                    className="w-full"
                  />
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddMonth}
                  className="bg-primary"
                >
                  Add Month
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {growthData.map((item, index) => (
              <div key={index} className="mb-4">
                <Form.Item
                  label={
                    <div className="flex justify-between w-full">
                      <span>{item.name}</span>
                      {isEditingChart && (
                        <Button
                          type="text"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => handleRemoveMonth(index)}
                          size="small"
                        />
                      )}
                    </div>
                  }
                  className="mb-1"
                >
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) =>
                      handleGrowthDataChange(index, e.target.value)
                    }
                    disabled={!isEditingChart}
                    placeholder="Enter value"
                  />
                </Form.Item>
              </div>
            ))}
          </div>

          {growthData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {isEditingChart ? (
                <p>No months added yet. Use the form above to add months.</p>
              ) : (
                <p>No chart data available. Click "Edit Chart" to add data.</p>
              )}
            </div>
          )}

          {/* Footer textarea below months */}
          {isEditingChart ? (
            <Input.TextArea
              value={chartFooter}
              onChange={(e) => setChartFooter(e.target.value)}
              placeholder="Enter chart footer (e.g., Source: CDC, 2024)"
              className="mb-4"
              rows={2}
            />
          ) : (
            chartFooter && (
              <div className="text-xs text-gray-500 mb-4">{chartFooter}</div>
            )
          )}

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveGrowthData}
              className="bg-primary"
              disabled={!isEditingChart}
            >
              Save Chart Data
            </Button>
          </div>
        </Card>
      </div>

      {/* Services section */}
      <div className="mt-8">
        <Card className="shadow-sm">
          <div className="flex justify-between items-center mb-4">
            {isEditingServices ? (
              <Input
                value={serviceChartTitle}
                onChange={(e) => setServiceChartTitle(e.target.value)}
                placeholder="Enter chart title (e.g., Top Services, Popular Treatments)"
                className="font-bold text-lg w-1/2"
              />
            ) : (
              <Title level={4} className="mb-0">
                {serviceChartTitle}
              </Title>
            )}
            <Button
              type={isEditingServices ? "default" : "primary"}
              icon={isEditingServices ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => setIsEditingServices(!isEditingServices)}
            >
              {isEditingServices ? "Cancel" : "Edit Services Chart"}
            </Button>
          </div>

          {isEditingServices ? (
            <Input.TextArea
              value={serviceChartDescription}
              onChange={(e) => setServiceChartDescription(e.target.value)}
              placeholder="Enter chart description"
              className="mb-4"
              rows={2}
            />
          ) : (
            <p className="text-gray-600 mb-4">{serviceChartDescription}</p>
          )}

          {isEditingServices && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-3">Add New Service</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <Select
                    placeholder="Select service"
                    className="w-full"
                    value={selectedService}
                    onChange={(value) => setSelectedService(value)}
                  >
                    {allServicesData.map((service) => {
                      // Check if service is already selected
                      const isSelected = serviceData.some(
                        (item) => item.id === service._id
                      );
                      return (
                        <Option
                          key={service._id}
                          value={service._id}
                          disabled={isSelected}
                        >
                          {service.title} {isSelected && "(Already added)"}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div className="w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <Input
                    type="number"
                    value={serviceValue}
                    onChange={(e) => handleServiceValueChange(e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddService}
                  className="bg-primary"
                >
                  Add Service
                </Button>
              </div>
            </div>
          )}

          {/* Fixed service data display section - removed nested grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceData.map((item, index) => (
              <div key={index} className="mb-4">
                <Form.Item
                  label={
                    <div className="flex justify-between w-full">
                      <span>{item.name}</span>
                      {isEditingServices && (
                        <Button
                          type="text"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => handleRemoveService(index)}
                          size="small"
                        />
                      )}
                    </div>
                  }
                  className="mb-1"
                >
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) =>
                      handleServiceDataChange(index, e.target.value)
                    }
                    disabled={!isEditingServices}
                    placeholder="Enter value"
                  />
                </Form.Item>
              </div>
            ))}
          </div>

          {serviceData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {isEditingServices ? (
                <p>
                  No services added yet. Use the form above to add services.
                </p>
              ) : (
                <p>
                  No service data available. Click "Edit Services Chart" to add
                  data.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveServiceData}
              className="bg-primary"
              disabled={!isEditingServices}
            >
              Save Service Data
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
