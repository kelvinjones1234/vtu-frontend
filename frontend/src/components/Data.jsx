import React, { useContext, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-2 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-2 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const Data = () => {
  const { dataNetworks } = useContext(ProductContext);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [planTypes, setPlanTypes] = useState([]);
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedDataPlan, setSelectedDataPlan] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [price, setPrice] = useState("");
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const { api } = useContext(GeneralContext);

  useEffect(() => {
    if (selectedNetwork) {
      // Fetch plan types based on selected network
      api
        .get(`data/plan-type/${selectedNetwork}/`)
        .then((response) => setPlanTypes(response.data))
        .catch((error) => console.error("Error fetching plan types:", error));
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (selectedPlanType && selectedNetwork) {
      // Fetch data plans based on selected network and plan type
      api
        .get(`data/plans/${selectedNetwork}/${selectedPlanType}/`)
        .then((response) => setDataPlans(response.data))
        .catch((error) => console.error("Error fetching data plans:", error));
    }
  }, [selectedPlanType, selectedNetwork]);

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
    setPlanTypes([]);
    setSelectedPlanType("");
    setDataPlans([]);
    setSelectedDataPlan("");
    setPrice("");
  };

  const handlePlanTypeChange = (e) => {
    setSelectedPlanType(e.target.value);
    setDataPlans([]);
    setSelectedDataPlan("");
    setPrice("");
  };

  const handleDataPlanChange = (e) => {
    const selectedPlanId = parseInt(e.target.value, 10);
    const selectedPlan = dataPlans.find((plan) => plan.id === selectedPlanId);
    setSelectedDataPlan(selectedPlanId);
    setPrice(selectedPlan ? selectedPlan.price : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleBypass = () => {
    setBypassPhoneNumber(!bypassPhoneNumber);
  };

  return (
    <div className="bg-bg_on h-auto bg-contain bg-no-repeat mt-[20vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div>
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Buy Data
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Data</span>
          </div>
        </div>
        <div className="flex flex-col justify-center border-[0.01rem] border-gray-200 dark:border-gray-900 p-5 rounded-[1.5rem] dark:bg-opacity-15 shadow-lg shadow-indigo-950/10">
          <form onSubmit={handleSubmit} className="">
            <div className="">
              <select
                name="network"
                aria-label="Network"
                value={selectedNetwork}
                onChange={handleNetworkChange}
                className={`${selectStyle}`}
              >
                <option value="" disabled>
                  Network
                </option>
                {dataNetworks.map((item) => (
                  <option key={item.network_id} value={item.network}>
                    {item.network.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="planType"
                aria-label="Plan Type"
                className={`${selectStyle}`}
                value={selectedPlanType}
                onChange={handlePlanTypeChange}
                disabled={
                  !selectedNetwork || !planTypes.some((type) => type.is_active)
                }
              >
                <option value="" disabled>
                  Plan Type
                </option>
                {console.log(planTypes)}
                {planTypes
                  // .filter((type) => type.is_active)
                  .map((type) => (
                    <option
                      key={type.plan_type}
                      value={type.id}
                      disabled={!type.is_active}
                    >
                      {type.plan_type}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <select
                name="dataPlan"
                aria-label="Data Plan"
                className={`${selectStyle}`}
                value={selectedDataPlan}
                onChange={handleDataPlanChange}
                disabled={!selectedPlanType}
              >
                <option value="" disabled>
                  Data Plan
                </option>
                {dataPlans.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.data_plan}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                aria-label="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputStyle}`}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Pin"
                aria-label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputStyle}`}
              />
            </div>
            {price && (
              <div>
                <input
                  type="text"
                  disabled
                  name="price"
                  placeholder="Price"
                  value={`₦${price}`}
                  className={`${inputStyle}`}
                />
              </div>
            )}
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-5">
              <p
                className="dark:text-white text-primary opacity-80 font-semibold"
                onClick={handleBypass}
              >
                Bypass Phone Number
              </p>
              <div className="flex items-center mr-3">
                <div
                  className={`h-4 w-9 rounded-2xl flex items-center relative ${
                    bypassPhoneNumber ? "bg-gray-600" : "bg-primary"
                  }`}
                >
                  <div
                    className={`button h-5 w-5 bg-white rounded-full absolute transition-all duration-500 ease-in-out ${
                      bypassPhoneNumber ? "right-0" : "left-0"
                    }`}
                    onClick={handleBypass}
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <button
                className="text-[1rem] my-2 w-full outline-none text-white p-1 h-[3.2rem] bg-[#1CCEFF] text-black rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-450 ease-in-out"
                type="submit"
              >
                Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default Data;
