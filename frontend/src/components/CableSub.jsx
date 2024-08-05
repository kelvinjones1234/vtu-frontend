import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthenticationContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-2 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-2 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const CableSub = () => {
  const { api } = useContext(GeneralContext);

  const { cableCategories } = useContext(ProductContext);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [price, setPrice] = useState("");
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [selectedCableCategory, setSelectedCableCategory] = useState("");
  const [cablePlans, setCablePlans] = useState([]);
  const [selectedCablePlan, setSelectedCablePlan] = useState("");

  const handleSelectedCableCategory = (e) => {
    setSelectedCableCategory(e.target.value);
    setCablePlans([]);
    setSelectedCablePlan("");
  };

  const handleSelectedCablePlan = (e) => {
    const selectedPlanId = parseInt(e.target.value, 10);
    const selectedPlan = cablePlans.find((plan) => plan.id === selectedPlanId);
    setSelectedCablePlan(selectedPlanId);
    setPrice(selectedPlan ? selectedPlan.price : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleBypass = () => {
    setBypassPhoneNumber(!bypassPhoneNumber);
  };

  useEffect(() => {
    if (selectedCableCategory) {
      api
        .get(`category/${selectedCableCategory}/`)
        .then((response) => {
          setCablePlans(response.data);
        })
        .catch((error) => console.error("Error fetching cable plans:", error));
    }
  }, [selectedCableCategory]);

  return (
    <div className="bg-bg_on h-auto bg-contain bg-no-repeat justify-center mt-[20vh] sm:bg-cover bg-center px-4 ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Buy Cable Subscription
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Cable Subscription</span>
          </div>
        </div>
        <div className="flex flex-col justify-center border-[0.01rem] border-gray-200 dark:border-gray-900 p-5 rounded-[1.5rem] dark:bg-opacity-15 shadow-lg shadow-indigo-950/10">
          <form onSubmit={handleSubmit}>
            <div>
              <select
                name="cable_name"
                aria-label="Cable Name"
                className={`${selectStyle}`}
                value={selectedCableCategory}
                onChange={handleSelectedCableCategory}
              >
                <option value="" disabled>
                  Cable Name
                </option>
                {cableCategories.map((item) => (
                  <option
                    value={item.id}
                    key={item.id}
                    disabled={!item.is_active}
                  >
                    {item.cable_name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="cable_plan"
                aria-label="Cable Plan"
                className={`${selectStyle}`}
                value={selectedCablePlan}
                onChange={handleSelectedCablePlan}
              >
                <option value="" disabled>
                  Cable Plan
                </option>
                {cablePlans.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.cable_plan}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                name="iuc_number"
                placeholder="IUC Number"
                aria-label="IUC Number"
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
                Bypass IUC Number
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

export default CableSub;
