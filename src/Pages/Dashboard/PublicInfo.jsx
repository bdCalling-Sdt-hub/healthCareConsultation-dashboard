import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  TimePicker,
  Select,
  Spin,
  Typography,
} from "antd";
import {
  FacebookOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  InstagramOutlined,
  PhoneOutlined,
  MailOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import moment from "moment";

import toast from "react-hot-toast";
import {
  useCreateAndUpdateFooterItemsMutation,
  useGetFooterItemsQuery,
} from "../../redux/apiSlices/termsAndConditionSlice";

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PublicInfo = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { data: footerInfo, isLoading } = useGetFooterItemsQuery();
  const [createAndUpdateFooterItems] = useCreateAndUpdateFooterItemsMutation();

  // Set form values when data is loaded
  useEffect(() => {
    if (footerInfo?.data) {
      const formattedData = {
        ...footerInfo.data,
        businessStartTime: footerInfo.data.businessStartTime
          ? moment(footerInfo.data.businessStartTime, "HH:mm")
          : null,
        businessEndTime: footerInfo.data.businessEndTime
          ? moment(footerInfo.data.businessEndTime, "HH:mm")
          : null,
      };
      form.setFieldsValue(formattedData);
    }
  }, [footerInfo, form]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Format time values for API
      const data = {
        ...values,
        businessStartTime: values.businessStartTime
          ? values.businessStartTime.format("HH:mm")
          : null,
        businessEndTime: values.businessEndTime
          ? values.businessEndTime.format("HH:mm")
          : null,
      };

      console.log(data);

      const res = await createAndUpdateFooterItems(data).unwrap();

      if (res?.success) {
        toast.success(
          res?.message || "Public information updated successfully!"
        );
      } else {
        toast.error(res?.message || "Failed to update public information");
      }
    } catch (error) {
      toast.error(error?.error?.data?.message || "Something went wrong!");
      console.error("Error updating public info:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Title level={2} className="mb-6">
        Public Information Settings
      </Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="contact"
              label="Contact Number"
              rules={[
                {
                  required: true,
                  message: "Please enter a contact phone number",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-green-600 mr-2" />}
                placeholder="+1 (555) 123-4567"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-blue-500 mr-2" />}
                placeholder="contact@example.com"
              />
            </Form.Item>

            <Form.Item
              name="facebook"
              label="Facebook"
              rules={[
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input
                prefix={<FacebookOutlined className="text-blue-600 mr-2" />}
                placeholder="https://facebook.com/yourpage"
              />
            </Form.Item>

            <Form.Item
              name="instagram"
              label="Instagram"
              rules={[
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input
                prefix={<InstagramOutlined className="text-pink-600 mr-2" />}
                placeholder="https://instagram.com/yourhandle"
              />
            </Form.Item>

            <Form.Item
              name="x"
              label="Twitter / X"
              rules={[
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input
                prefix={<TwitterOutlined className="text-blue-400 mr-2" />}
                placeholder="https://twitter.com/yourhandle"
              />
            </Form.Item>

            <Form.Item
              name="youtube"
              label="YouTube"
              rules={[
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input
                prefix={<YoutubeOutlined className="text-red-600 mr-2" />}
                placeholder="https://youtube.com/yourchannel"
              />
            </Form.Item>

            <Form.Item
              name="linkedin"
              label="LinkedIn"
              rules={[
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input
                prefix={<LinkedinOutlined className="text-blue-800 mr-2" />}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </Form.Item>

            <Form.Item
              name="businessStartDay"
              label="Business Start Day"
              rules={[
                {
                  required: true,
                  message: "Please select a business start day",
                },
              ]}
            >
              <Select placeholder="Select start day">
                {days.map((day) => (
                  <Option key={day} value={day}>
                    {day}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="businessEndDay"
              label="Business End Day"
              rules={[
                {
                  required: true,
                  message: "Please select a business end day",
                },
              ]}
            >
              <Select placeholder="Select end day">
                {days.map((day) => (
                  <Option key={day} value={day}>
                    {day}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="businessStartTime"
              label="Business Start Time"
              rules={[
                {
                  required: true,
                  message: "Please select a business start time",
                },
              ]}
            >
              <TimePicker
                format="HH:mm"
                className="w-full"
                placeholder="Select start time"
                suffixIcon={<ClockCircleOutlined className="text-blue-500" />}
              />
            </Form.Item>

            <Form.Item
              name="businessEndTime"
              label="Business End Time"
              rules={[
                {
                  required: true,
                  message: "Please select a business end time",
                },
              ]}
            >
              <TimePicker
                format="HH:mm"
                className="w-full"
                placeholder="Select end time"
                suffixIcon={<ClockCircleOutlined className="text-blue-500" />}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="contactDescription"
            label="Contact Description"
            rules={[
              {
                required: true,
                message: "Please enter a Contact page description",
                max: 100,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter a brief description (max 100 characters)"
              maxLength={100}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="footerDescription"
            label="Footer Description"
            rules={[
              {
                required: true,
                message: "Please enter a footer description",
                max: 100,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter a brief description (max 100 characters)"
              maxLength={100}
              showCount
            />
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              className="bg-primary"
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default PublicInfo;
