import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Divider,
  Card,
  notification,
  Button,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useCreateChallengeMutation,
  useUpdateChallengeMutation,
} from "../../../redux/apiSlices/challengeSlice";
import { getImageUrl } from "../../../utils/getImageUrl";

const { TextArea } = Input;
const { Option } = Select;

const ChallengeModal = ({ visible, onCancel, challenge, services = [] }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const [createChallenge, { isLoading: isCreating }] =
    useCreateChallengeMutation();
  const [updateChallenge, { isLoading: isUpdating }] =
    useUpdateChallengeMutation();

  const isEditing = !!challenge;
  const isLoading = isCreating || isUpdating;

  // Reset form when modal opens/closes or challenge changes
  useEffect(() => {
    if (visible) {
      if (isEditing) {
        // Set form values for editing
        form.setFieldsValue({
          title: challenge.title,
          description: challenge.description,
          service: challenge.service?._id,
          contents: challenge.contents || [],
          footer: challenge.footer,
        });

        // Set images if exist
        if (challenge.images && challenge.images.length > 0) {
          const images = challenge.images.map((image, index) => ({
            uid: `-${index}`,
            name: `image-${index}.png`,
            status: "done",
            url: getImageUrl(image),
          }));
          setFileList(images);
        } else {
          setFileList([]);
        }
      } else {
        // Reset form for adding - completely clear all fields
        form.resetFields();
        // Clear file list
        setFileList([]);
      }
    }
  }, [visible, challenge, form, isEditing]);

  const handleImagesChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Create FormData object
      const formData = new FormData();

      // Prepare data object exactly as specified
      const data = {
        title: values.title,
        description: values.description,
        service: values.service,
        contents: values.contents || [],
        footer: values.footer,
      };

      // Append data as JSON string
      formData.append("data", JSON.stringify(data));

      // Append images (up to 3)
      fileList.forEach((file, index) => {
        if (file.originFileObj && index < 3) {
          formData.append("image", file.originFileObj);
        }
      });

      // Submit the form - either create or update
      const action = isEditing
        ? updateChallenge({ id: challenge._id, data: formData })
        : createChallenge(formData);

      action
        .unwrap()
        .then(() => {
          notification.success({
            message: "Success",
            description: `Challenge ${
              isEditing ? "updated" : "created"
            } successfully`,
          });
          onCancel();
          form.resetFields();
          setFileList([]);
        })
        .catch((error) => {
          notification.error({
            message: "Error",
            description:
              error.message ||
              `Failed to ${isEditing ? "update" : "create"} challenge`,
          });
        });
    });
  };

  return (
    <Modal
      title={isEditing ? "Edit Challenge" : "Add New Challenge"}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      confirmLoading={isLoading}
    >
      <Form form={form} layout="vertical">
        {/* Basic Information */}
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Challenge Title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <TextArea
            rows={4}
            placeholder="This is the description of the challenge, explaining the objectives and goals."
          />
        </Form.Item>

        <Form.Item
          name="service"
          label="Service"
          rules={[{ required: true, message: "Please select a service" }]}
        >
          <Select placeholder="Select a service">
            {services.map((service) => (
              <Option key={service._id} value={service._id}>
                {service.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Content Sections */}
        <Divider orientation="left">Content Sections</Divider>

        <Form.List
          name="contents"
          rules={[
            {
              validator: async (_, contents) => {
                if (!contents || contents.length < 1) {
                  return Promise.reject(
                    new Error("At least one content section is required")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  className="mb-4"
                  title={`Section ${name + 1}`}
                  extra={
                    fields.length > 1 ? (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    ) : null
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, "title"]}
                    label="Section Title"
                    rules={[{ required: true, message: "Title is required" }]}
                  >
                    <Input placeholder="Challenge Overview" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Section Description"
                    rules={[
                      { required: true, message: "Description is required" },
                    ]}
                  >
                    <TextArea
                      rows={2}
                      placeholder="An introduction to the challenge and the rules."
                    />
                  </Form.Item>

                  <Form.List name={[name, "details"]}>
                    {(
                      detailFields,
                      { add: addDetail, remove: removeDetail }
                    ) => (
                      <>
                        {detailFields.map(
                          ({
                            key: detailKey,
                            name: detailName,
                            ...restDetailField
                          }) => (
                            <Form.Item
                              key={detailKey}
                              {...restDetailField}
                              label={detailName === 0 ? "Details" : ""}
                              required={false}
                            >
                              <div className="flex items-center">
                                <Form.Item
                                  {...restDetailField}
                                  name={detailName}
                                  noStyle
                                  rules={[
                                    {
                                      required: true,
                                      message: "Detail is required",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="Detail point"
                                    style={{ width: "90%" }}
                                  />
                                </Form.Item>
                                {detailFields.length > 1 ? (
                                  <DeleteOutlined
                                    className="ml-2"
                                    onClick={() => removeDetail(detailName)}
                                  />
                                ) : null}
                              </div>
                            </Form.Item>
                          )
                        )}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => addDetail()}
                            icon={<PlusOutlined />}
                            block
                          >
                            Add Detail
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Content Section
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="footer" label="Footer">
          <Input placeholder="Footer text" />
        </Form.Item>

        {/* Images Upload (at the end as requested) */}
        <Divider orientation="left">Challenge Images (Max 3)</Divider>
        <Form.Item
          label="Upload Images"
          name="images"
          extra="You can upload up to 3 images for this challenge"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleImagesChange}
            beforeUpload={() => false}
            multiple
            maxCount={3}
          >
            {fileList.length >= 3 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChallengeModal;
