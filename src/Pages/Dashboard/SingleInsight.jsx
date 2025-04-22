import { Button, Table, Image, Modal, Input, Upload, Collapse } from "antd";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

const SingleInsight = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isAssignBarsModal, setIsAssignBarsModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isViewModal, setIsViewModal] = useState(false);
  const [viewingSection, setViewingSection] = useState(null);

  const insightData = {
    title: "Example Insight",
    description: "This is a detailed description of the insight.",
    image:
      "https://www.inovalon.com/wp-content/uploads/2022/07/INO-22-0989-How-Healthcare-Organizations-Leverage.png",
  };

  // Dummy data for the table
  const [sections] = useState([
    {
      id: 1,
      title: "Increasing Costs of Medical Technology",
      logo: "https://cdn-icons-png.flaticon.com/512/2491/2491418.png",
      bars: [
        {
          title: "Bar 1",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
        {
          title: "Bar 2",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
        {
          title: "Bar 3",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
        {
          title: "Bar 4",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Pharmaceutical & Prescription Drug Costs",
      logo: "https://cdn-icons-png.flaticon.com/512/4360/4360311.png",
      bars: [
        {
          title: "Bar 1",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
        {
          title: "Bar 2",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
        {
          title: "Bar 3",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Administrative & Operational Inefficiencies",
      logo: "https://cdn-icons-png.flaticon.com/512/1968/1968641.png",
      bars: [
        {
          title: "Bar 1",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
        {
          title: "Bar 2",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
      ],
    },
    {
      id: 4,
      title: "Aging Population & Chronic Disease Burden",
      logo: "https://cdn-icons-png.flaticon.com/512/3209/3209005.png",
      bars: [
        {
          title: "Bar 1",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
        {
          title: "Bar 2",
          body: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus provident ex dolore labore rem accusantium amet esse laboriosam quod, modi ipsam optio odio, rerum a tempore ullam deleniti eius odit doloremque molestiae quam officiis! Commodi nihil dolores a consequuntur molestiae? Quo, expedita tempore. Vitae temporibus rerum eos maiores? Facere, blanditiis!",
          ],
        },
      ],
    },
  ]);

  const columns = [
    {
      title: "Logo",
      key: "logo",
      render: (_, record) => (
        <img
          src={record.logo}
          alt="section logo"
          className="w-10 h-10 object-contain"
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
          <Button
            type="primary"
            onClick={() => {
              setViewingSection(record);
              setIsViewModal(true);
            }}
          >
            View
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setEditingSection(record);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setSelectedSection(record);
              setIsAssignBarsModal(true);
            }}
          >
            Assign Bars
          </Button>
          <Button danger>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Insight Details Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col items-center justify-center">
          <div>
            <img
              src={insightData.image}
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
          >
            Add Section
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={sections}
          rowKey="id"
          pagination={false}
        />
      </div>
      {/* Add Section Modal */}
      <Modal
        title="Add New Section"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <Input placeholder="Enter section title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Logo
            </label>
            <Upload maxCount={1} showUploadList={false}>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </div>
            </Upload>
          </div>
        </div>
      </Modal>

      {/* Edit Section Modal */}
      <Modal
        title="Edit Section"
        open={isEditModalOpen}
        onOk={() => setIsEditModalOpen(false)}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingSection(null);
        }}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <Input
              placeholder="Enter section title"
              defaultValue={editingSection?.title}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Logo
            </label>
            <Upload maxCount={1} showUploadList={false}>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                {editingSection?.logo ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={editingSection.logo}
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
        onOk={() => setIsAssignBarsModal(false)}
        onCancel={() => {
          setIsAssignBarsModal(false);
          setSelectedSection(null);
        }}
      >
        <div className="space-y-4 my-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input placeholder="Enter title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body (Enter each point in a new line)
            </label>
            <Input.TextArea
              placeholder="Enter points here...&#10;Each new line will be a separate point&#10;Like this"
              rows={6}
            />
          </div>
        </div>
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
            <Collapse key={index} className="border rounded-lg">
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
