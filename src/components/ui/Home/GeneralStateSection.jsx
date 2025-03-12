import { FaPrescriptionBottleMedical, FaUsers } from "react-icons/fa6";
import salongoLogo from "../../../assets/salon-go-logo.png";
import { FaThList } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";

const GeneralStateSection = () => {
  // Simulated dummy data
  const generalState = {
    data: {
      totalRevenue: 1500,
      totalClients: 120,
      pendingApplication: 45,
      completedConsultation: 320,
    },
  };

  const isLoading = false; // Simulated loading state

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={salongoLogo} alt="" />
      </div>
    );
  }

  const state = generalState?.data;

  return (
    <div className="grid md:grid-cols-4 gap-6 md:h-[80px]">
      <div className="bg-primary rounded-2xl py-0 px-6 flex items-center justify-start gap-4">
        <div className="flex justify-between w-full">
          <div>
            <h1 className="text-lg text-gray-400">Total Revenue</h1>
            <h1 className="text-2xl font-semibold text-white">
              ${state?.totalRevenue}
            </h1>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center">
            <GrMoney size={26} />
          </div>
        </div>
      </div>
      <div className="bg-primary rounded-2xl py-0 px-6 flex items-center justify-start gap-4">
        <div className="flex justify-between w-full">
          <div>
            <h1 className="text-lg text-gray-400">Total Clients</h1>
            <h1 className="text-2xl font-semibold text-white">
              {state?.totalClients}
            </h1>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center">
            <FaUsers size={24} />
          </div>
        </div>
      </div>
      <div className="bg-primary rounded-2xl py-0 px-6 flex items-center justify-start gap-4">
        <div className="flex justify-between w-full">
          <div>
            <h1 className="text-lg text-gray-400">Pending Application</h1>
            <h1 className="text-2xl font-semibold text-white">
              {state?.pendingApplication}
            </h1>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center">
            <FaThList size={24} />
          </div>
        </div>
      </div>
      <div className="bg-primary rounded-2xl py-0 px-6 flex items-center justify-start gap-4">
        <div className="flex justify-between w-full">
          <div>
            <h1 className="text-lg text-gray-400">Completed Consultation</h1>
            <h1 className="text-2xl font-semibold text-white">
              {state?.completedConsultation}
            </h1>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center">
            <FaPrescriptionBottleMedical size={28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralStateSection;
