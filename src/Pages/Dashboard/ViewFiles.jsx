import { Table, Avatar, Button, Spin, Card, Tag, Tooltip } from "antd";
import {
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import {
  useDownloadFileMutation,
  useGetFilesByUserIdQuery,
} from "../../redux/apiSlices/userSlice";
import { useParams } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import React, { useState } from "react";

const getFileIcon = (mimeType) => {
  if (mimeType === "application/pdf")
    return <FilePdfOutlined style={{ color: "#e74c3c", fontSize: 20 }} />;
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return <FileExcelOutlined style={{ color: "#27ae60", fontSize: 20 }} />;
  return <FileUnknownOutlined style={{ color: "#888", fontSize: 20 }} />;
};

const ViewFiles = () => {
  const { id } = useParams();
  const { data: files, isLoading } = useGetFilesByUserIdQuery(id);
  const [downloadFile] = useDownloadFileMutation();

  // Track loading state for each file
  const [downloadingId, setDownloadingId] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const fileList = files?.data || [];

  const handleDownloadFile = async (id) => {
    setDownloadingId(id);
    try {
      const res = await downloadFile(id).unwrap();
      const blob = new Blob([res], { type: res.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error(error?.data?.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    {
      title: "",
      dataIndex: "mimeType",
      key: "icon",
      width: 50,
      render: (mimeType) => getFileIcon(mimeType),
    },
    {
      title: "Sr. No",
      dataIndex: "sr",
      key: "sr",
      width: 100,
      render: (_, record, index) => index + 1,
    },
    {
      title: "File Name",
      dataIndex: "originalName",
      key: "originalName",
      render: (text) => (
        <Tooltip title={text}>
          <span className="break-all">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Type",
      dataIndex: "mimeType",
      key: "mimeType",
      render: (type) => <Tag color="blue">{type.split("/").pop()}</Tag>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size) => <span>{(size / (1024 * 1024)).toFixed(2)} MB</span>,
    },
    {
      title: "Uploaded By",
      dataIndex: "uploadedBy",
      key: "uploadedBy",
      render: (uploadedBy) => (
        <div className="flex items-center gap-2">
          <Avatar src={uploadedBy?.profile} />
          <div>
            <div className="font-medium">{uploadedBy?.name}</div>
            <div className="text-xs text-gray-500">{uploadedBy?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Upload Date",
      dataIndex: "uploadTimestamp",
      key: "uploadTimestamp",
      render: (date) => <span>{moment(date).format("YYYY-MM-DD HH:mm")}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          target="_blank"
          rel="noopener noreferrer"
          loading={downloadingId === record._id}
          onClick={() => handleDownloadFile(record._id)}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="flex justify-center py-8 bg-gray-50 min-h-screen">
      <Card
        title={<span className="text-2xl font-bold">User Files</span>}
        bordered={false}
        className="w-full shadow-lg"
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={fileList}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          className="rounded-b-lg"
        />
      </Card>
    </div>
  );
};

export default ViewFiles;
