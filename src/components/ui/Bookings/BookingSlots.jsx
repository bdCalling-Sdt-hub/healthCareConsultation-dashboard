import React, { useState, useEffect } from "react";
import { Button, Select, TimePicker, Card, Spin, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetSlotsQuery,
  useManageSlotsMutation,
} from "../../../redux/apiSlices/bookingSlice";

const { Option } = Select;

const BookingSlots = () => {
  // State for managing booking slots
  const [selectedDay, setSelectedDay] = useState("sunday");
  const [selectedTime, setSelectedTime] = useState(null);
  const [schedule, setSchedule] = useState(null);

  const { data: scheduleData, isLoading } = useGetSlotsQuery();
  const [updateSlots, { isLoading: isUpdating }] = useManageSlotsMutation();

  // Initialize schedule from API data
  useEffect(() => {
    if (scheduleData?.data) {
      setSchedule({
        schedule: scheduleData.data,
      });
    }
  }, [scheduleData]);

  if (isLoading || !schedule) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  // Function to handle adding new time slot
  const handleAddTimeSlot = () => {
    if (!selectedTime) return;

    const formattedTime = selectedTime.format("hh:mm A");
    const timeCode =
      parseInt(selectedTime.format("HH")) * 100 +
      parseInt(selectedTime.format("mm"));

    setSchedule((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule) => {
        if (daySchedule.day === selectedDay) {
          // Check if time already exists
          const timeExists = daySchedule.times.some(
            (t) => t.time === formattedTime
          );
          if (timeExists) {
            message.warning("This time slot already exists for this day");
            return daySchedule;
          }

          return {
            ...daySchedule,
            times: [
              ...daySchedule.times,
              {
                time: formattedTime,
                timeCode: timeCode,
                status: false,
              },
            ].sort((a, b) => a.timeCode - b.timeCode),
          };
        }
        return daySchedule;
      }),
    }));

    setSelectedTime(null);
  };

  // Function to handle removing time slot
  const handleRemoveTimeSlot = (day, timeToRemove) => {
    setSchedule((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule) => {
        if (daySchedule.day === day) {
          return {
            ...daySchedule,
            times: daySchedule.times.filter((t) => t.time !== timeToRemove),
          };
        }
        return daySchedule;
      }),
    }));
  };

  // Function to save schedule to backend
  const handleSaveSchedule = async () => {
    try {
      // Create a properly formatted schedule object that matches the expected format
      const formattedSchedule = {
        timeZone: "America/New_York", // Add the timeZone property
        schedule: schedule.schedule.map(day => ({
          day: day.day,
          times: day.times.map(slot => slot.time) // Just extract the time strings
        }))
      };
      
      console.log("Sending data:", JSON.stringify(formattedSchedule, null, 2));
      
      await updateSlots(formattedSchedule).unwrap();
      message.success("Schedule updated successfully");
    } catch (error) {
      console.error("Failed to update schedule:", error);
      message.error("Failed to update schedule: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="p-4">
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Create Booking Slots
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Select Day
            </label>
            <Select
              value={selectedDay}
              onChange={setSelectedDay}
              style={{ width: "100%" }}
              className="rounded-lg"
              dropdownStyle={{ borderRadius: "8px" }}
            >
              {schedule.schedule.map((day) => (
                <Option key={day.day} value={day.day} className="capitalize">
                  {day.day}
                </Option>
              ))}
            </Select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Select Time
            </label>
            <TimePicker
              use12Hours
              format="hh:mm A"
              value={selectedTime}
              onChange={setSelectedTime}
              style={{ width: "100%" }}
              className="rounded-lg"
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTimeSlot}
            className="bg-primary hover:bg-primary/90 h-10 px-6"
            style={{ marginBottom: "1px" }}
          >
            Add Slot
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {schedule.schedule.map((daySchedule) => (
          <Card
            key={daySchedule.day}
            title={
              <div className="flex items-center space-x-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    daySchedule.day === "sunday"
                      ? "bg-red-500"
                      : daySchedule.day === "saturday"
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  }`}
                ></span>
                <span className="capitalize font-medium">
                  {daySchedule.day}
                </span>
              </div>
            }
            className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            headStyle={{
              backgroundColor:
                daySchedule.day === "sunday"
                  ? "#FEF2F2"
                  : daySchedule.day === "saturday"
                  ? "#F5F3FF"
                  : "#EFF6FF",
              borderBottom: "none",
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {daySchedule.times.length > 0 ? (
                daySchedule.times.map((timeSlot) => (
                  <div
                    key={timeSlot.time}
                    className={`flex justify-between items-center p-3 rounded-lg border-l-4 transition-colors duration-200 ${
                      timeSlot.status
                        ? "bg-green-50 border-green-500 hover:bg-green-100"
                        : "bg-gray-50 border-primary hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium text-gray-700">
                      {timeSlot.time}
                    </span>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      className="hover:bg-red-50 rounded-full"
                      onClick={() =>
                        handleRemoveTimeSlot(daySchedule.day, timeSlot.time)
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🕒</div>
                  <div>No slots available</div>
                </div>
              )}
            </div>
            <div className="mt-4 text-xs text-right text-gray-500">
              {daySchedule.times.length} slot
              {daySchedule.times.length !== 1 ? "s" : ""}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="primary"
          size="large"
          className="bg-primary hover:bg-primary/90"
          onClick={handleSaveSchedule}
          loading={isUpdating}
        >
          Save Schedule
        </Button>
      </div>
    </div>
  );
};

export default BookingSlots;
