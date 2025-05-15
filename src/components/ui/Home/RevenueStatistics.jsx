import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRevenueStatesQuery } from "../../../redux/apiSlices/dashboardSlice";
import salongoLogo from "../../../assets/salon-go-logo.png";
import { Spin } from "antd";

const monthNames = [
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

const RevenueStatistics = () => {
  const { data: revenueData, isLoading, error } = useRevenueStatesQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (error) {
    return <div>Error loading revenue statistics</div>;
  }

  // Transform the data to use month names
  const data =
    revenueData?.data?.monthlyRevenue?.map((item) => ({
      ...item,
      month: monthNames[parseInt(item.month) - 1], // Convert month number to name
    })) || [];

  return (
    <div
      style={{ width: "100%", height: 350 }}
      className="px-5 py-3 bg-white rounded-2xl shadow-md"
    >
      <h4 className="mb-5 mt-4 text-xl font-semibold">Revenue Statistics</h4>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15405D" stopOpacity={1} />
              <stop offset="100%" stopColor="#15405D" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#15405D"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueStatistics;
