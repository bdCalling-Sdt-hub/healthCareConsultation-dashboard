import { Form, Input, Button, Spin } from "antd";
import {
  useEditPageDescriptionMutation,
  useGetPageDescriptionsQuery,
} from "../../redux/apiSlices/termsAndConditionSlice";
import { SaveOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { TextArea } = Input;

const PageDescription = () => {
  const pages = ["Our Insights", "Services", "Our Way", "About", "Contact Us"];

  const { data: pageDescription, isLoading } = useGetPageDescriptionsQuery();
  const [updatePageDescription] = useEditPageDescriptionMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  const pageDescriptions = pageDescription?.data;
  // console.log(pageDescriptions);

  const onFinish = async (values) => {
    try {
      const res = await updatePageDescription(values);
      console.log(res);
      if (res?.data?.success) {
        toast.success(
          res?.data?.message || "Page descriptions updated successfully"
        );
      } else {
        toast.error(res?.data?.message || "Page descriptions updated failed");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }

    // console.log("Received values:", values);
    // Hook this up to backend or local state as needed
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Change Page Descriptions</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ourinsights: pageDescriptions?.ourinsights || "",
          services: pageDescriptions?.services || "",
          ourway: pageDescriptions?.ourway || "",
          about: pageDescriptions?.about || "",
          contactus: pageDescriptions?.contactus || "",
        }}
      >
        {pages.map((page) => {
          const key = page.replace(/\s+/g, "").toLowerCase();
          return (
            <Form.Item
              key={key}
              name={key}
              label={`${page} Description`}
              rules={[
                {
                  required: true,
                  message: `Please enter a description for ${page}`,
                },
                {
                  max: 300,
                  message: "Description must be 300 characters or less.",
                },
              ]}
            >
              <TextArea
                rows={4}
                maxLength={300}
                showCount
                placeholder={`Enter description for ${page}`}
              />
            </Form.Item>
          );
        })}

        <div className="text-end">
          <Form.Item>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              className="bg-primary"
              htmlType="submit"
            >
              Save Page Descriptions
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default PageDescription;
