import { useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { useAuth } from "../context/AuthenticationContext";
const PriceList = () => {
  const { user } = useAuth();

  const dataPrices = {
    mtn: [
      { plan: "1GB", price: "₦500" },
      { plan: "5GB", price: "₦2500" },
      { plan: "10GB", price: "₦4500" },
    ],
    glo: [
      { plan: "1GB", price: "₦450" },
      { plan: "5GB", price: "₦2300" },
      { plan: "10GB", price: "₦4000" },
    ],
    airtel: [
      { plan: "1GB", price: "₦500" },
      { plan: "5GB", price: "₦2400" },
      { plan: "10GB", price: "₦4200" },
    ],
    mobile: [
      { plan: "1GB", price: "₦550" },
      { plan: "5GB", price: "₦2600" },
      { plan: "10GB", price: "₦4600" },
    ],
  };

  const cablePrices = {
    dstv: [
      { plan: "DSTV Access", price: "₦2000" },
      { plan: "DSTV Compact", price: "₦9000" },
      { plan: "DSTV Premium", price: "₦16000" },
    ],
    gotv: [
      { plan: "GOTV Lite", price: "₦1000" },
      { plan: "GOTV Plus", price: "₦3600" },
      { plan: "GOTV Max", price: "₦6300" },
    ],
    startimes: [
      { plan: "StarTimes Basic", price: "₦900" },
      { plan: "StarTimes Classic", price: "₦2500" },
      { plan: "StarTimes Super", price: "₦5000" },
    ],
  };

  const electricityPrices = {
    ikeja: [
      { plan: "Prepaid", price: "₦50/kWh" },
      { plan: "Postpaid", price: "₦55/kWh" },
    ],
    eko: [
      { plan: "Prepaid", price: "₦52/kWh" },
      { plan: "Postpaid", price: "₦57/kWh" },
    ],
    abuja: [
      { plan: "Prepaid", price: "₦53/kWh" },
      { plan: "Postpaid", price: "₦58/kWh" },
    ],
  };

  return (
    <div
      className={`bg-bg_on min-h-screen bg-contain lg:px-[6rem] bg-no-repeat justify-center mt-[8rem] sm:bg-cover bg-center px-4 sm:px-6 lg:px-8 xl:px-16`}
    >
      <div className="max-w-7xl mx-auto sm:flex gap-8">
        <GeneralLeft />
        <div className="min-w-[400.20px] pr-2 mx-auto">
          <div className="mb-8">
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
              Price List
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Price List</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Data Plans
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(dataPrices).map(([network, plans]) => (
                <div key={network}>
                  <h4 className="font-semibold text-primary dark:text-gray-300 mb-2 capitalize">
                    {network}
                  </h4>
                  <ul className="text-sm text-gray-500 dark:text-gray-400">
                    {plans.map((plan, index) => (
                      <li key={index}>
                        {plan.plan}: {plan.price}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Cable TV Plans
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(cablePrices).map(([provider, plans]) => (
                <div key={provider}>
                  <h4 className="font-semibold text-primary dark:text-gray-300 mb-2 capitalize">
                    {provider}
                  </h4>
                  <ul className="text-sm text-gray-500 dark:text-gray-400">
                    {plans.map((plan, index) => (
                      <li key={index}>
                        {plan.plan}: {plan.price}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Electricity Tariffs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(electricityPrices).map(([provider, plans]) => (
                <div key={provider}>
                  <h4 className="font-semibold text-primary dark:text-gray-300 mb-2 capitalize">
                    {provider}
                  </h4>
                  <ul className="text-sm text-gray-500 dark:text-gray-400">
                    {plans.map((plan, index) => (
                      <li key={index}>
                        {plan.plan}: {plan.price}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <GeneralRight />
      </div>
    </div>
  );
};

export default PriceList;
