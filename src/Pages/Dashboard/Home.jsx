import React from "react";
import rentMeLogo from "../../assets/navLogo.png";
import GeneralStateSection from "../../components/ui/Home/GeneralStateSection";
import Professionals from "../../components/ui/Home/Professionals";
import RevenueStatistics from "../../components/ui/Home/RevenueStatistics";
import BookingStatistics from "../../components/ui/Home/BookingStatistics";

const Home = () => {
  const orderSummary = {
    doneByProfessionals: 65,
    doneByFreelancers: 35,
  };

  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={rentMeLogo} alt="" />
      </div>
    );
  }

  return (
    <div>
      <GeneralStateSection />
      <div className="mt-4">
        <RevenueStatistics />
      </div>
      <div className="flex w-full mt-4 gap-4">
        <div className="w-[60%]">
          <Professionals />
        </div>
        <div className="md:w-[40%]">
          <BookingStatistics />
        </div>
      </div>
    </div>
  );
};

export default Home;
