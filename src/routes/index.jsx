import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import Users from "../Pages/Dashboard/Users";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import Transactions from "../Pages/Dashboard/Transactions";
import UserProfile from "../Pages/Dashboard/AdminProfile/UserProfile";
import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition";
import Insights from "../Pages/Dashboard/Insights";
import Booking from "../Pages/Dashboard/Booking";
import Services from "../Pages/Dashboard/Services";
import Service from "../Pages/Dashboard/Service";
import SingleInsight from "../Pages/Dashboard/SingleInsight";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import Faq from "../Pages/Dashboard/Faq";
import OurWay from "../Pages/Dashboard/OurWay";
import PrivateRoute from "./PrivateRoute";
import Review from "../Pages/Dashboard/Review";
import AboutUs from "../Pages/Dashboard/AboutUs";
import Challenges from "../Pages/Dashboard/Challenges";
import PublicInfo from "../Pages/Dashboard/PublicInfo";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <ProtectedRoute><Main /></ProtectedRoute> ,
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/bookings",
        element: <Booking />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/services/:id",
        element: <Service />,
      },
      {
        path: "/insights",
        element: <Insights />,
      },
      {
        path: "/our-way",
        element: <OurWay />,
      },
      {
        path: "/challenges",
        element: <Challenges />,
      },
      {
        path: "/insights/:id",
        element: <SingleInsight />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/personal-information",
        element: <UserProfile />,
      },
      {
        path: "/public-information",
        element: <PublicInfo />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/reviews",
        element: <Review />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-condition",
        element: <TermsAndCondition />,
      },
      {
        path: "/f-a-q",
        element: <Faq />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
