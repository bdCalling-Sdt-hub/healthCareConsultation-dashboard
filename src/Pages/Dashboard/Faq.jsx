import { useState } from "react";
import { Button, Table, Modal, Input, Form } from "antd";
import { FaPlus } from "react-icons/fa";

const Faq = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Dummy data
  const [faqs] = useState([
    {
      id: 1,
      question: "What insurance plans do you accept?",
      answer:
        "We accept most major insurance plans including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, and UnitedHealthcare. Please contact our office to verify your specific coverage.",
    },
    {
      id: 2,
      question: "How do I schedule an appointment?",
      answer:
        "You can schedule an appointment by calling our office during business hours, using our online booking system, or through our patient portal. New patients may need to complete registration forms before their first visit.",
    },
    {
      id: 3,
      question: "What are your office hours?",
      answer:
        "Our regular office hours are Monday through Friday from 8:00 AM to 5:00 PM. We also offer extended hours on Thursdays until 7:00 PM and select Saturday mornings for your convenience.",
    },
  ]);

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      width: "30%",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      width: "50%",
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
          <Button danger>Delete</Button>
        </div>
      ),
    },
  ];

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
            Add FAQ
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={faqs}
          rowKey="id"
          pagination={false}
        />
      </div>

      {/* Add FAQ Modal */}
      <Modal
        title="Add New FAQ"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <Input.TextArea placeholder="Enter your question" rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <Input.TextArea placeholder="Enter the answer" rows={6} />
          </div>
        </div>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal
        title="Edit FAQ"
        open={isEditModalOpen}
        onOk={() => setIsEditModalOpen(false)}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingFaq(null);
        }}
      >
        <div className="space-y-4 mb-10 my-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <Input.TextArea
              placeholder="Enter your question"
              rows={3}
              defaultValue={editingFaq?.question}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <Input.TextArea
              placeholder="Enter the answer"
              rows={6}
              defaultValue={editingFaq?.answer}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Faq;
