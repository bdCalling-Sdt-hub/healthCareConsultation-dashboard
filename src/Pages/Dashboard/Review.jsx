import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Rate,
  Space,
  message,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useReviewsQuery,
  useUpdateReviewMutation,
} from "../../redux/apiSlices/reviewSlice";
import { getImageUrl } from "../../utils/getImageUrl";

const Review = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: reviews, isLoading } = useReviewsQuery();
  const [addReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleOpenModal = (record = null) => {
    setEditingReview(record);
    setImageFile(null);

    if (record) {
      form.setFieldsValue({
        ...record,
      });
      // Set image preview if the review has an image
      if (record.image) {
        setImagePreview(getImageUrl(record.image));
      } else {
        setImagePreview(null);
      }
    } else {
      form.resetFields();
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingReview(null);
    setImagePreview(null);
    setImageFile(null);
    form.resetFields();
  };

  const handleImageChange = (info) => {
    if (info.file) {
      setImageFile(info.file);
      setImagePreview(URL.createObjectURL(info.file));
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      const data = {
        name: values.name,
        industry: values.industry,
        title: values.title,
        review: values.review,
        rating: values.rating,
      };

      // Append the data object as JSON
      formData.append("data", JSON.stringify(data));

      // Append image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingReview) {
        await updateReview({
          id: editingReview._id,
          data: formData,
        }).unwrap();
        message.success("Review updated successfully");
      } else {
        await addReview(formData).unwrap();
        message.success("Review added successfully");
      }
      handleCancel();
    } catch (error) {
      message.error(
        "Failed to save review: " + (error.message || "Unknown error")
      );
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Delete Review",
      content: "Are you sure you want to delete this review?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          await deleteReview(id).unwrap();
          message.success("Review deleted successfully");
        } catch (error) {
          message.error(
            "Failed to delete review: " + (error.message || "Unknown error")
          );
        }
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      filters: [
        { text: "Healthcare", value: "Healthcare" },
        { text: "Technology", value: "Technology" },
        { text: "Education", value: "Education" },
      ],
      onFilter: (value, record) => record.industry === value,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      ellipsis: true,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reviews Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90"
        >
          Add Review
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reviews?.data || []}
        loading={isLoading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} reviews`,
        }}
      />

      <Modal
        title={editingReview ? "Edit Review" : "Add New Review"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          {/* Image Upload */}
          <Form.Item label="Reviewer Image" name="image">
            <div className="flex flex-col items-center">
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Reviewer"
                    className="w-32 h-32 object-cover rounded-full border-2 border-primary"
                  />
                </div>
              )}
              <Upload
                beforeUpload={(file) => {
                  handleImageChange({ file });
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>
                  {imagePreview ? "Change Image" : "Upload Image"}
                </Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input reviewer's name!" },
            ]}
          >
            <Input placeholder="Enter reviewer's name" />
          </Form.Item>

          <Form.Item
            name="industry"
            label="Industry"
            rules={[{ required: true, message: "Please input industry!" }]}
          >
            <Input placeholder="Enter industry" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input title!" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          <Form.Item
            name="review"
            label="Review"
            rules={[
              { required: true, message: "Please input review content!" },
            ]}
          >
            <Input.TextArea
              placeholder="Enter review content"
              rows={4}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please select rating!" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" className="bg-primary">
                {editingReview ? "Update" : "Submit"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Review;
