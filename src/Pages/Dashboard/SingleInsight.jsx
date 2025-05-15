import {
  Button,
  Table,
  Modal,
  Input,
  Upload,
  Collapse,
  Form,
  message,
  Spin,
} from "antd";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  useCreateBarsMutation,
  useCreateSectionMutation,
  useDeleteSectionMutation,
  useGetAllSectionsByInsightIdQuery,
  useUpdateSectionMutation,
} from "../../redux/apiSlices/insightsSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import toast from "react-hot-toast";

const SingleInsight = () => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isAssignBarsModal, setIsAssignBarsModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isViewModal, setIsViewModal] = useState(false);
  const [viewingSection, setViewingSection] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });

  // Form and route hooks
  const [form] = Form.useForm();
  const { id } = useParams();

  // API hooks
  const { data: getInsightData, isLoading } =
    useGetAllSectionsByInsightIdQuery(id);
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [assignBars] = useCreateBarsMutation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  const sections = getInsightData?.data;
  const insightData = sections?.[0]?.insight || {};
  console.log(insightData);

  // Table columns configuration
  const columns = [
    {
      title: "Logo",
      key: "logo",
      render: (_, record) => (
        <img
          src={getImageUrl(record?.image)}
          alt="section logo"
          className="w-14 h-14 rounded-lg object-cover"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleView(record)}>
            View
          </Button>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button onClick={() => handleAssignBars(record)}>Assign Bars</Button>
          <Button onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Handler functions
  const handleView = (record) => {
    setViewingSection(record);
    setIsViewModal(true);
  };

  const handleEdit = (record) => {
    setEditingSection(record);
    setFormData({ title: record.title, image: null });
    setIsEditModalOpen(true);
  };

  const handleAssignBars = (record) => {
    setSelectedSection(record);
    setIsAssignBarsModal(true);
  };

  const handleCreateSection = async () => {
    try {
      const submitData = new FormData();
      submitData.append("data", JSON.stringify({ title: formData.title }));
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await createSection({ id, data: submitData }).unwrap();
      if (response?.success) {
        toast.success("Section created successfully!");
        handleCloseModal();
      } else {
        toast.error(response?.message || "Failed to create section");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = (sectionId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this section?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await deleteSection(sectionId).unwrap();
          if (response?.success) {
            toast.success(response?.message || "Section deleted successfully!");
          } else {
            toast.error(response?.message || "Failed to delete section!");
          }
        } catch (error) {
          toast.error(error?.data?.message || "Something went wrong!");
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const processedBars = values.bars.map((bar, index) => ({
        title: bar.title,
        body: bar.body.split("\n").filter((point) => point.trim() !== ""),
        id: selectedSection.bars?.[index]?.id || `${Date.now()}-${index}`,
      }));

      const response = await assignBars({
        id: selectedSection._id,
        data: { contents: processedBars },
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Bars assigned successfully!");
        handleCloseAssignBarsModal();
      } else {
        toast.error(response?.message || "Failed to assign bars!");
      }
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const handleUpdateSection = async () => {
    try {
      if (!editingSection?._id) return;

      const submitData = new FormData();
      submitData.append(
        "data",
        JSON.stringify({
          title: formData.title || editingSection.title,
        })
      );

      if (formData.image instanceof File) {
        submitData.append("image", formData.image);
      }

      const response = await updateSection({
        id: editingSection._id,
        data: submitData,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Section updated successfully!");
        handleCloseEditModal();
      } else {
        toast.error(response?.message || "Failed to update section!");
      }
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong!");
    }
  };

  // Modal close handlers
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", image: null });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSection(null);
    setFormData({ title: "", image: null });
  };

  const handleCloseAssignBarsModal = () => {
    setIsAssignBarsModal(false);
    setSelectedSection(null);
    form.resetFields();
  };

  // Utility handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Insight Details Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col items-center justify-center">
          <div>
            <img
              src={getImageUrl(insightData.image)}
              alt="Insight Image"
              className=" h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="text-center mt-5">
            <h1 className="text-3xl font-bold mb-4">{insightData.title}</h1>
            <p className="text-gray-600">{insightData.description}</p>
          </div>
        </div>
      </div>
      {/* Sections Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Insight Sections</h2>
          <Button
            type="primary"
            icon={<FaPlus />}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-5 rounded"
          >
            Add Section
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={sections}
          rowKey="_id"
          pagination={false}
        />
      </div>
      {/* Add Section Modal */}
      <Modal
        title="Add New Section"
        open={isModalOpen}
        onOk={handleCreateSection}
        onCancel={() => {
          setIsModalOpen(false);
          setFormData({ title: "", image: null });
        }}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <Input
              name="title"
              placeholder="Enter section title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Logo
            </label>
            <Upload
              maxCount={1}
              showUploadList={false}
              beforeUpload={handleImageUpload}
            >
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                {formData.image ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <Button icon={<UploadOutlined />}>Change Logo</Button>
                  </div>
                ) : (
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                )}
              </div>
            </Upload>
          </div>
        </div>
      </Modal>

      {/* Edit Section Modal */}
      <Modal
        title="Edit Section"
        open={isEditModalOpen}
        onOk={handleUpdateSection}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingSection(null);
          setFormData({ title: "", image: null });
        }}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <Input
              name="title"
              placeholder="Enter section title"
              value={formData.title || editingSection?.title || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Logo
            </label>
            <Upload
              maxCount={1}
              showUploadList={false}
              beforeUpload={handleImageUpload}
            >
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                {formData.image ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <Button icon={<UploadOutlined />}>Change Logo</Button>
                  </div>
                ) : editingSection?.image ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={getImageUrl(editingSection.image)}
                      alt="Preview"
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <Button icon={<UploadOutlined />}>Change Logo</Button>
                  </div>
                ) : (
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                )}
              </div>
            </Upload>
          </div>
        </div>
      </Modal>

      {/* assign bars modal */}
      <Modal
        title={`Assign Bars - ${selectedSection?.title || ""}`}
        open={isAssignBarsModal}
        onCancel={() => {
          setIsAssignBarsModal(false);
          setSelectedSection(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
          initialValues={{
            bars: selectedSection?.bars?.length
              ? selectedSection?.bars?.map((bar) => ({
                  title: bar?.title,
                  body: bar?.body.join("\n"),
                }))
              : [{}],
          }}
        >
          <Form.List name="bars" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div
                    key={`bar-${field.key}-${selectedSection?._id}`}
                    className="border p-4 rounded-lg relative"
                  >
                    <Form.Item
                      {...field}
                      label="Bar Title"
                      name={[field.name, "title"]}
                      rules={[{ required: true, message: "Title is required" }]}
                    >
                      <Input placeholder="Enter bar title" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Body"
                      name={[field.name, "body"]}
                      rules={[{ required: true, message: "Body is required" }]}
                      help="Enter each point in a new line"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Enter points (one per line)"
                      />
                    </Form.Item>

                    <Button
                      type="text"
                      className="absolute top-2 right-2"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<FaPlus />}
                >
                  Add More Bar
                </Button>
              </div>
            )}
          </Form.List>

          <Button type="primary" block onClick={handleSubmit}>
            Save Bars
          </Button>
        </Form>
      </Modal>

      {/* view modal */}
      <Modal
        title={`View Bars - ${viewingSection?.title || ""}`}
        open={isViewModal}
        onCancel={() => {
          setIsViewModal(false);
          setViewingSection(null);
        }}
        footer={null}
        width={800}
      >
        <div className="space-y-6 mt-4">
          {viewingSection?.bars?.map((bar, index) => (
            <Collapse
              key={`${bar.title}-${index}-${viewingSection._id}`}
              className="border rounded-lg"
            >
              <Collapse.Panel header={bar.title}>
                <ul className="list-disc pl-5 space-y-2">
                  {bar.body.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-gray-600">
                      {point}
                    </li>
                  ))}
                </ul>
              </Collapse.Panel>
            </Collapse>
          ))}
          {(!viewingSection?.bars || viewingSection.bars.length === 0) && (
            <div className="text-center text-gray-500">
              No bars assigned to this section yet
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SingleInsight;
