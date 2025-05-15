import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import Title from "../../components/common/Title";
import {
  useTermsAndConditionQuery,
  useUpdateTermsAndConditionsMutation,
} from "../../redux/apiSlices/termsAndConditionSlice";
import toast from "react-hot-toast";
import rentMeLogo from "../../assets/navLogo.png";
import {
  usePrivacyPolicyQuery,
  useUpdatePricyPolicyMutation,
} from "../../redux/apiSlices/privacyPolicySlice";
import { Spin } from "antd";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const { data: privacyPolicy, isLoading, refetch } = usePrivacyPolicyQuery();

  const [updatePrivacyPolicy] = useUpdatePricyPolicyMutation();

  useEffect(() => {
    if (privacyPolicy?.content) {
      setContent(privacyPolicy?.content);
    }
  }, [privacyPolicy]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  const termsDataSave = async () => {
    const data = {
      content: content,
      type: "privacy-policy",
    };

    try {
      const res = await updatePrivacyPolicy(data).unwrap();
      if (res.success) {
        toast.success("Privacy Policy updated successfully");
        refetch();
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <Title className="mb-4">Privacy Policy</Title>

      <JoditEditor
        ref={editor}
        value={privacyPolicy?.content}
        onChange={(newContent) => {
          setContent(newContent);
        }}
      />

      <div className="flex items-center justify-center mt-5">
        <button
          onClick={termsDataSave}
          type="submit"
          className="bg-primary text-white w-[160px] h-[42px] rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
