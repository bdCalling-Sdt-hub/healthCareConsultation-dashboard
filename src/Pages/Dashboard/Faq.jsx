import { useState } from "react";
import { Button, Table, Modal, Input, Form, Spin } from "antd";
import { FaPlus } from "react-icons/fa";
import {
  useAddFaqMutation,
  useAllFaqsQuery,
  useDeleteFaqMutation,
  useUpdateFaqMutation,
} from "../../redux/apiSlices/faqSlice";
import moment from "moment/moment";
import toast from "react-hot-toast";

const Faq = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Remove dummy data as we're using real API data
  const { data: faqsData, isLoading } = useAllFaqsQuery();
  const [addFaq] = useAddFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this FAQ?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await deleteFaq(id).unwrap();
          if (response?.success) {
            toast.success(response?.message || "FAQ deleted successfully!");
          }
        } catch (error) {
          toast.error(error?.data?.message || "Something went wrong!");
        }
      },
    });
  };

  const data = faqsData?.data;
  console.log(data);

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
    },
    {
      title: "Uploaded At",
      dataIndex: "createdAt",
      key: "createdAt",

      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setEditingFaq(record);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      // Create the request body with the required fields
      const data = {
        question: values.question,
        answer: values.answer,
      };

      console.log(data);

      const response = await addFaq(data).unwrap();

      if (response?.success) {
        toast.success("FAQ added successfully!");
        form.resetFields();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      const data = {
        question: values.question,
        answer: values.answer,
      };

      const response = await updateFaq({
        id: editingFaq._id,
        data: data,
      }).unwrap();

      if (response?.success) {
        toast.success("FAQ updated successfully!");
        editForm.resetFields();
        setIsEditModalOpen(false);
        setEditingFaq(null);
      } else {
        toast.error(response?.message || "Failed to update FAQ");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <Button
            type="primary"
            icon={<FaPlus />}
            onClick={() => setIsModalOpen(true)}
          >
            Add FAQs
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={false}
        />
      </div>

      {/* Add FAQ Modal */}
      <Modal
        title="Add New FAQ"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" className="space-y-4 mb-4">
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input.TextArea placeholder="Enter your question" rows={3} />
          </Form.Item>

          <Form.Item
            label="Answer"
            name="answer"
            rules={[{ required: true, message: "Please enter the answer" }]}
          >
            <Input.TextArea placeholder="Enter the answer" rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal
        title="Edit FAQ"
        open={isEditModalOpen}
        onOk={handleEdit}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingFaq(null);
          editForm.resetFields();
        }}
      >
        <Form
          form={editForm}
          layout="vertical"
          className="space-y-4 mb-10 my-4"
          initialValues={editingFaq}
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input.TextArea placeholder="Enter your question" rows={3} />
          </Form.Item>

          <Form.Item
            label="Answer"
            name="answer"
            rules={[{ required: true, message: "Please enter the answer" }]}
          >
            <Input.TextArea placeholder="Enter the answer" rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Faq;
