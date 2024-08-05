import React, { useContext, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-2 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-2 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const ElectricityBill = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [electricitySettings, setElectricitySettings] = useState([]);
  const [price, setPrice] = useState("");
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [discos, setDiscos] = useState([]);
  const { api } = useContext(GeneralContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleBypass = () => {
    setBypassPhoneNumber(!bypassPhoneNumber);
  };

  useEffect(() => {
    api
      .get("electricity-bill/")
      .then((response) => setDiscos(response.data))
      .catch((error) => console.error("Error Fetching Discos", error));
  }, [api]);

  useEffect(() => {
    api
      .get("electricity-settings/")
      .then((response) => setElectricitySettings(response.data))
      .catch((error) => console.error("Error Meter Type", error));
  }, [api]);

  return (
    <div className="bg-bg_on h-auto bg-contain bg-no-repeat justify-center mt-[20vh] sm:bg-cover bg-center px-4 ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Pay Electricity Bill
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Electricity Bill</span>
          </div>
        </div>
        <div className="flex flex-col justify-center border-[0.01rem] border-gray-200 dark:border-gray-900 p-5 rounded-[1.5rem] dark:bg-opacity-15 shadow-lg shadow-indigo-950/10">
          <form onSubmit={handleSubmit}>
            <div>
              <select
                name="disco_name"
                aria-label="Disco Name"
                className={`${selectStyle}`}
              >
                <option value="" disabled>
                  Disco Name
                </option>
                {discos.map((item) => (
                  <option key={item.id}>{item.disco_name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="meter_type"
                aria-label="Meter Type"
                className={`${selectStyle}`}
              >
                <option value="" disabled>
                  Meter Type
                </option>
                {electricitySettings.map((item) => (
                  <option key={item.id} disabled={!item.is_active}>
                    {item.meter_type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                name="meter_number"
                placeholder="Meter Number"
                aria-label="Meter Number"
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                name="Amount"
                placeholder="Amount"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`${inputStyle}`}
              />
            </div>
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

export default ElectricityBill;
