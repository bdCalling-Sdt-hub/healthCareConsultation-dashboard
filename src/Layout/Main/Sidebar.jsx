import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import {
  MdCancelPresentation,
  MdCategory,
  MdDashboard,
  MdFeaturedPlayList,
  MdInsights,
  MdMedicalServices,
  MdMiscellaneousServices,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineGateway, AiOutlineTransaction } from "react-icons/ai";
import { TbUserScreen } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

import { PiUserPlus } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import Cookies from "js-cookie";
import logo from "../../assets/logo.png";
import { DiGoogleAnalytics } from "react-icons/di";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaCalendar, FaMoneyBillTransfer, FaScissors } from "react-icons/fa6";
import { FaBorderStyle, FaCalendarAlt } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    Cookies.remove("refreshToken");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <MdDashboard size={24} />,
      label: (
        <Link to="/" className="">
          Dashboard
        </Link>
      ),
    },
    {
      key: "/bookings",
      icon: <FaCalendarAlt size={24} />,
      label: <Link to="/bookings">Bookings</Link>,
    },
    {
      key: "/transactions",
      icon: <AiOutlineTransaction size={24} />,
      label: <Link to="/transactions">Transactions</Link>,
    },
    {
      key: "/services",
      icon: <MdMedicalServices size={24} />,
      label: <Link to="/services">Services</Link>,
    },
    {
      key: "/insights",
      icon: <MdInsights size={24} />,
      label: <Link to="/insights">Insights</Link>,
    },
    {
      key: "/our-way",
      icon: <AiOutlineGateway size={24} />,
      label: <Link to="/our-way">Our Way</Link>,
    },
    {
      key: "/users",
      icon: <TbUserScreen size={24} />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "subMenuSetting",
      icon: <IoSettingsOutline size={24} />,
      label: "Settings",
      children: [
        {
          key: "/personal-information",
          label: (
            <Link
              to="/personal-information"
              className="text-white hover:text-white"
            >
              Personal Information
            </Link>
          ),
        },
        {
          key: "/change-password",
          label: (
            <Link to="/change-password" className="text-white hover:text-white">
              Change Password
            </Link>
          ),
        },
        {
          key: "/reviews",
          label: (
            <Link to="/reviews" className="text-white hover:text-white">
              Reviews
            </Link>
          ),
        },
        {
          key: "/terms-and-condition",
          label: (
            <Link
              to="/terms-and-condition"
              className="text-white hover:text-white"
            >
              Terms And Condition
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy" className="text-white hover:text-white">
              Privacy Policy
            </Link>
          ),
        },
        {
          key: "/f-a-q",
          label: (
            <Link to="/f-a-q" className="text-white hover:text-white">
              FAQ
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={handleLogout}>Logout</p>,
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );

    if (selectedItem) {
      setSelectedKey(path);

      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className="mt-5 overflow-y-scroll">
      <div className="px-10">
        <Link
          to={"/"}
          className="mb-10 flex items-center flex-col gap-2 justify-center py-4"
        >
          <img src={logo} alt="" className="w-40" />
        </Link>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        style={{ borderRightColor: "transparent", background: "transparent" }}
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;
