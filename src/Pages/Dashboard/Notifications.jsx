import React, { useState } from "react";
import { ConfigProvider, Pagination } from "antd";
import Title from "../../components/common/Title";
import { useNotificationQuery } from "../../redux/apiSlices/notificationSlice";
import rentMeLogo from "../../assets/navLogo.png";

const notificationsData = [
  {
    id: 1,
    sender: "Sanchez Haro Manuel",
    message: "Started a new trip at 5 PM. Trip No.56 started from Mexico City.",
    timestamp: "1hr ago",
    avatar:
      "https://img.freepik.com/free-photo/everything-is-okay-cheerful-friendly-looking-caucasian-guy-with-moustache-beard-raising-hand-with-ok-great-gesture-giving-approval-like-having-situation-control_176420-22386.jpg",
  },
  {
    id: 2,
    sender: "Maria Gonzalez",
    message: "Scheduled a meeting for tomorrow at 10 AM.",
    timestamp: "2hrs ago",
    avatar:
      "https://img.freepik.com/free-photo/young-pretty-girl-with-hands-crossed-smiling_176420-20051.jpg",
  },
  {
    id: 3,
    sender: "James Smith",
    message: "Submitted a travel report for approval.",
    timestamp: "3hrs ago",
    avatar:
      "https://img.freepik.com/free-photo/handsome-serious-young-man-posing-studio-isolated-gray-wall_176420-21306.jpg",
  },
  {
    id: 4,
    sender: "Sarah Connor",
    message: "Trip No.89 was successfully completed.",
    timestamp: "4hrs ago",
    avatar:
      "https://img.freepik.com/free-photo/portrait-beautiful-young-woman_176420-20333.jpg",
  },
  {
    id: 5,
    sender: "Carlos Rivera",
    message: "Reviewed your recent trip itinerary.",
    timestamp: "5hrs ago",
    avatar:
      "https://img.freepik.com/free-photo/handsome-young-man-smiling_176420-23278.jpg",
  },
  {
    id: 6,
    sender: "Emily Davis",
    message: "Requested a trip report summary.",
    timestamp: "6hrs ago",
    avatar:
      "https://img.freepik.com/free-photo/stylish-young-girl-with-glasses-smiling_176420-20356.jpg",
  },
  {
    id: 7,
    sender: "John Doe",
    message: "Updated trip No.45 status to 'Completed'.",
    timestamp: "7hrs ago",
    avatar:
      "https://img.freepik.com/free-photo/young-man-smiling-against-grey-wall_176420-20255.jpg",
  },
  {
    id: 8,
    sender: "Sophia Martinez",
    message: "Trip No.67 needs your review.",
    timestamp: "8hrs ago",
    avatar:
      "https://img.freepik.com/free-photo/beautiful-young-woman-smiling-happy_176420-23282.jpg",
  },
];

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const isLoading = false;
  // const { data: notifications, isLoading } = useNotificationQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={rentMeLogo} alt="" />
      </div>
    );
  }
  const notifications = [];
  const notificationData = notifications.data;

  console.log(notificationData);

  const paginatedData = notificationsData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Title className="text-[22px]">All Notifications</Title>
        <button className="bg-[#15405D] text-white h-10 px-4 rounded-md">
          Read All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 bg-white p-4 rounded-lg">
        {paginatedData.map((notification) => (
          <div
            key={notification.id}
            className="border-b-[1px] pb-2 border-[#d9d9d9] flex items-center gap-3"
          >
            <img
              style={{
                height: "50px",
                width: "50px",
                borderRadius: "100%",
                border: "2px solid gray",
              }}
              src={notification.avatar}
              alt={`${notification.sender} avatar`}
            />
            <div>
              <p>
                <span className="font-bold">{notification.sender}</span>:{" "}
                {notification.message}
              </p>
              <p style={{ color: "gray", marginTop: "4px" }}>
                {notification.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-6">
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                itemActiveBg: "#FFE133",
                borderRadius: "100%",
              },
            },
          }}
        >
          <Pagination
            current={page}
            total={notificationsData.length}
            pageSize={pageSize}
            onChange={(page) => setPage(page)}
            showQuickJumper={false}
            showSizeChanger={true}
            pageSizeOptions={["5", "10", "15"]}
            onShowSizeChange={(current, size) => setPageSize(size)}
            position={["bottomCenter"]}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Notifications;
