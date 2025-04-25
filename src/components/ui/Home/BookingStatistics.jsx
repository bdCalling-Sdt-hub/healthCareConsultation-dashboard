import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useBookingStatisticsQuery } from "../../../redux/apiSlices/dashboardSlice";
import salongoLogo from "../../../assets/salon-go-logo.png";

const COLORS = ["#15405d", "#336484", "#1b2f3d"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const BookingStatistics = () => {
  const { data: bookingStats, isLoading, error } = useBookingStatisticsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <img src={salongoLogo} alt="" className="w-20" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading booking statistics</div>;
  }

  // Transform the API data into the format required by the pie chart
  const data = [
    {
      name: "Completed Bookings",
      value: bookingStats?.data?.completedRate || 0,
    },
    { name: "Pending Bookings", value: bookingStats?.data?.pendingRate || 0 },
    {
      name: "Canceled Bookings",
      value: bookingStats?.data?.cancelledRate || 0,
    },
  ].filter((item) => item.value > 0); // Only show segments with values > 0

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-4">
      <h1 className="text-xl font-semibold">
        Booking Statistics ({bookingStats?.data?.totalBookings || 0} Total)
      </h1>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex space-x-4 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="w-4 h-4 inline-block rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-sm">
              {entry.name} ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStatistics;
