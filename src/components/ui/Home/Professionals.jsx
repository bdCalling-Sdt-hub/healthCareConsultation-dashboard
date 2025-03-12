import randomImg from "../../../assets/randomProfile2.jpg";
import salongoLogo from "../../../assets/salon-go-logo.png";

// Dummy data for Professionals Component

const Professionals = () => {
  // Simulate loading state
  const dummyProfessionalsData = {
    data: [
      {
        name: "Revenue Integrity & Compliance",
        conversionRate: 85,
      },
      {
        name: "Finance Optimization",
        conversionRate: 78,
      },
      {
        name: "Healthcare Cost Analysis",
        conversionRate: 92,
      },
      {
        name: "Budgeting & Forecasting",
        conversionRate: 45,
      },
      {
        name: "Payment & Reimbursement Solutions",
        conversionRate: 73,
      },
      {
        name: "Financial Strategy & Growth Consulting",
        conversionRate: 80,
      },
    ],
  };
  const isLoading = false;
  const professionalsData = dummyProfessionalsData;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={salongoLogo} alt="" />
      </div>
    );
  }

  const professionals = professionalsData?.data;

  const topProfessionals = [...(professionals || [])]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5);

  return (
    <div className="border h-[340px] bg-white rounded-2xl pb-5 md:flex flex-col justify-center">
      <p className="text-xl font-semibold px-10 py-4">Service Analytics</p>
      <div className="md:flex flex-col px-10 gap-4">
        {topProfessionals?.map((value, index) => (
          <div key={index} className="flex items-center gap-4">
            <h1 className="text-sm font-medium  w-60">{value?.name}</h1>
            <div className="flex items-center flex-1">
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${value.conversionRate}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm font-medium">{value?.conversionRate}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Professionals;
