import { useState } from "react";
import {
  Spin,
  Table,
  Typography,
  Button,
  Space,
  Tag,
  Image,
  Modal,
  List,
  Carousel,
  Card,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import {
  useDeleteChallengeMutation,
  useGetChallengesQuery,
} from "../../redux/apiSlices/challengeSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import { useGetAllServicesQuery } from "../../redux/apiSlices/serviceSlice";
import toast from "react-hot-toast";
import ChallengeModal from "../../components/ui/challenge/ChallengeModal";

const { Title, Text, Paragraph } = Typography;

const Challenges = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const { data: challengesData, isLoading } = useGetChallengesQuery();
  const { data: servicesData } = useGetAllServicesQuery();
  const [deleteChallenge] = useDeleteChallengeMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const challenges = challengesData?.data;
  const services = servicesData?.data || [];

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Delete Challenge",
      content: "Are you sure you want to delete this challenge?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await deleteChallenge(id);
          if (res.success) {
            toast.success(res.data.message || "Challenge deleted successfully");
          }
        } catch (error) {
          toast.error(error.message || "Failed to delete challenge");
        }
      },
    });
  };

  // Define columns for the Ant Design table
  const columns = [
    {
      title: "Background",
      dataIndex: "background",
      key: "background",
      width: 120,
      render: (background) => (
        <Image
          src={getImageUrl(background)}
          alt="Background"
          width={100}
          height={60}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Content Sections",
      dataIndex: "contents",
      key: "contents",
      render: (contents) => (
        <Space direction="vertical">
          {contents.map((content, index) => (
            <Tag color="blue" key={index}>
              {content.title}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <FaEye
            onClick={() => handleView(record)}
            className="text-blue-600 cursor-pointer"
            size={30}
          />

          <FaEdit
            onClick={() => handleEdit(record)}
            className="cursor-pointer"
            size={25}
          />

          <FaTrash
            className="cursor-pointer text-red-600"
            size={23}
            onClick={() => handleDelete(record?._id)}
          />
        </Space>
      ),
    },
  ];

  // Functions for view and edit actions
  const handleView = (record) => {
    setSelectedChallenge(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedChallenge(record);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setSelectedChallenge(null);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedChallenge(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">
          Challenges
        </Title>
        <Button type="primary" onClick={handleAddNew}>
          Add New Challenge
        </Button>
      </div>

      <Table
        dataSource={challenges}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* Combined Add/Edit Challenge Modal */}
      <ChallengeModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        challenge={selectedChallenge}
        services={services}
      />

      {/* View Challenge Modal */}
      <Modal
        title={selectedChallenge?.title}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedChallenge && (
          <div className="challenge-details">
            {/* Background Image */}
            <div className="mb-6">
              <Image
                src={getImageUrl(selectedChallenge.background)}
                alt="Background"
                style={{ width: "100%", height: 200, objectFit: "cover" }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <Title level={4}>Description</Title>
              <Paragraph>{selectedChallenge.description}</Paragraph>
            </div>

            {/* Images Gallery */}
            {selectedChallenge.images &&
              selectedChallenge.images.length > 0 && (
                <div className="mb-6">
                  <Title level={4}>Images</Title>
                  <Carousel autoplay>
                    {selectedChallenge.images.map((image, index) => (
                      <div key={index}>
                        <Image
                          src={getImageUrl(image)}
                          alt={`Challenge Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 300,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}

            {/* Content Sections */}
            <div className="mb-6">
              <Title level={4}>Content Sections</Title>
              <List
                itemLayout="vertical"
                dataSource={selectedChallenge.contents}
                renderItem={(content, index) => (
                  <Card className="mb-4" title={content.title}>
                    <Paragraph>{content.description}</Paragraph>
                    {content.details && content.details.length > 0 && (
                      <List
                        dataSource={content.details}
                        renderItem={(detail, detailIndex) => (
                          <List.Item>
                            <Text>• {detail}</Text>
                          </List.Item>
                        )}
                      />
                    )}
                  </Card>
                )}
              />
            </div>

            {/* Footer */}
            {selectedChallenge.footer && (
              <div className="mt-6 pt-4 border-t">
                <Title level={5}>Footer</Title>
                <Paragraph>{selectedChallenge.footer}</Paragraph>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-6 pt-4 border-t">
              <Space size="large">
                <Text type="secondary">
                  Created:{" "}
                  {new Date(selectedChallenge.createdAt).toLocaleString()}
                </Text>
                <Text type="secondary">
                  Updated:{" "}
                  {new Date(selectedChallenge.updatedAt).toLocaleString()}
                </Text>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Challenges;
