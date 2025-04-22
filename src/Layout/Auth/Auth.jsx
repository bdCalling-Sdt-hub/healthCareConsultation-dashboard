import React from "react";
import { Outlet } from "react-router-dom";
import backgroundImage from "../../assets/sl_040220_29550_22.jpg";

const Auth = () => {
  return (
    <div
      className="w-full flex items-center justify-center relative"
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          background: "#ffffff",
          padding: 30,
          borderRadius: 10,
          width: 510,
          position: "relative",
          zIndex: 2,
        }}
        className="shadow-xl"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
