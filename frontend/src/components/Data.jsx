import React, { useContext, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import axios from "axios"; // Import Axios
import { AuthContext } from "../context/AuthenticationContext";
import SubmitButton from "./SubmitButton";
import ConfirmationPopup from "./ConfirmationPopup"; // Import ConfirmationPopup
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const Data = () => {
  const { dataNetworks } = useContext(ProductContext);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [planTypes, setPlanTypes] = useState([]);
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedDataPlan, setSelectedDataPlan] = useState("");
  const [selectedDataPlanId, setSelectedDataPlanId] = useState("");
  const [networkId, setNetworkId] = useState("");
  const [planName, setPlanName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [price, setPrice] = useState("");
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [networkMessage, setNetworkMessage] = useState(""); // State for the network message
  const { api, detectNetwork, setLoading } = useContext(GeneralContext);
  const { user, authTokens } = useContext(AuthContext);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorPopupMessage, setErrorPopupMessage] = useState("");

  useEffect(() => {
    if (selectedNetwork) {
      api
        .get(`data/plan-type/${selectedNetwork}/`)
        .then((response) => setPlanTypes(response.data))
        .catch((error) => console.error("Error fetching plan types:", error));
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (selectedPlanType && selectedNetwork) {
      api
        .get(`data/plans/${selectedNetwork}/${selectedPlanType}/`)
        .then((response) => setDataPlans(response.data))
        .catch((error) => console.error("Error fetching data plans:", error));
    }
  }, [selectedPlanType, selectedNetwork]);

  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    setPhone(inputPhone);

    // Only detect the network and update the message if the phone number is not empty
    if (inputPhone) {
      // Detect the network based on the phone number
      const detectedNetwork = detectNetwork(inputPhone);

      // Update the network message based on the detected network
      if (detectedNetwork !== "Unknown Network") {
        setNetworkMessage(
          `Detected Network: ${detectedNetwork} <br /> NB: Ignore this for Ported Numbers`
        );
      } else {
        setNetworkMessage(
          `Unable to identify network <br /> NB: Ignore this for Ported Numbers`
        );
      }
    } else {
      // If the phone number is empty, clear the network message
      setNetworkMessage("");
    }
  };

  const handleNetworkChange = (e) => {
    const selectedNetworkName = e.target.value;
    const selectedNetworkObj = dataNetworks.find(
      (network) => network.network === selectedNetworkName
    );

    if (selectedNetworkObj) {
      setSelectedNetwork(selectedNetworkName);
      setNetworkId(selectedNetworkObj.network_id); // Set the network_id
      setPlanTypes([]);
      setSelectedPlanType("");
      setDataPlans([]);
      setSelectedDataPlan("");
      setPrice("");
    }
  };

  const handlePlanTypeChange = (e) => {
    setSelectedPlanType(e.target.value);
    setDataPlans([]);
    setSelectedDataPlan("");
    setPrice("");
  };

  const handleDataPlanChange = (e) => {
    const selected = parseInt(e.target.value, 10);

    const selectedPlan = dataPlans.find(
      (plan) => plan.id === selected || plan.plan_id === selected
    );

    if (selectedPlan) {
      setSelectedDataPlanId(selectedPlan.plan_id);
      setSelectedDataPlan(selectedPlan.id);
      setPlanName(selectedPlan.data_plan);
      setPrice(selectedPlan.price);
    } else {
      setSelectedDataPlanId("");
      setSelectedDataPlan("");
      setPrice("");
    }
  };

  const validInputs = () => {
    const newError = {};

    // Validate phone number
    if (!phone) {
      newError.phone = "A phone number is required";
    } else if (phone.length !== 11) {
      newError.phone = "Enter a valid 11-digit phone number";
    }

    // Validate PIN
    if (pin !== user.transaction_pin) {
      newError.pin = "Incorrect pin";
    }

    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validInputs()) {
      setIsConfirmOpen(true); // Open confirmation popup
    }
  };

  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    function generateUniqueId(length = 16) {
      const array = new Uint8Array(length / 2); // length / 2 because each byte converts to 2 hex characters
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
    }
    try {
      setLoading(true);
      const payload = {
        network: networkId,
        phone: phone,
        data_plan: selectedDataPlanId,
        bypass: bypassPhoneNumber,
        "request-id": `Data_${generateUniqueId()}`,
      };
      const response = await axios.post(
        "https://kusosub.com/api/data",
        payload,
        {
          headers: {
            Authorization:
              "Token 3379df5f760eb207eb83201fdadc6ec81652e5934a37f0ac83c1c9de4c18",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      setSuccessMessage("Transaction successful!");
      setIsSuccessOpen(true);
      axios
        .api(
          "transactions/",
          {
            transaction_ref_no: response.data.transid,
            wallet: user.user_id,
            transaction_type: "DATA",
            product: planName,
            price: amount,
            status: response.data.status,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        )
        .then((response) => {
          console.log("POST request successful:", response.data);
        })
        .catch((error) => {
          console.error("Error making POST request:", error);
        });
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : error.message;
      setErrorPopupMessage(errorMsg);
      setIsErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  const handleErrorClose = () => {
    setIsErrorOpen(false);
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
          <form onSubmit={handleSubmit}>
            <div>
              <select
                name="network"
                aria-label="Network"
                value={selectedNetwork}
                onChange={handleNetworkChange}
                className={selectStyle}
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
                className={selectStyle}
                value={selectedPlanType}
                onChange={handlePlanTypeChange}
                disabled={
                  !selectedNetwork || !planTypes.some((type) => type.is_active)
                }
              >
                <option value="" disabled>
                  Plan Type
                </option>
                {planTypes.map((type) => (
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
                className={selectStyle}
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
              {console.log({ dataPlans })}
            </div>
            <div>
              {errorMessage.phone && (
                <div className="text-gray-700 dark:text-white">
                  {errorMessage.phone}
                </div>
              )}
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                aria-label="Phone number"
                value={phone}
                onChange={handlePhoneChange}
                className={inputStyle}
              />
              {networkMessage && (
                <p
                  className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: networkMessage }}
                />
              )}
            </div>
            <div>
              {errorMessage.pin && (
                <div className="text-gray-700 dark:text-white">
                  {errorMessage.pin}
                </div>
              )}
              <input
                type="password"
                name="pin"
                placeholder="Pin"
                aria-label="Pin"
                autoComplete="current-password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className={inputStyle}
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
                  className={inputStyle}
                />
              </div>
            )}
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3">
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
              <SubmitButton label="Purchase" />
            </div>
          </form>
        </div>
      </div>
      <GeneralRight />

      {/* Render Confirmation Popup */}
      <ConfirmationPopup
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with transfering ${planName} to ${phone}?`}
      />

      {/* Render Error Popup */}
      <ErrorPopup
        isOpen={isErrorOpen}
        message={errorPopupMessage}
        onClose={handleErrorClose}
      />

      {/* Render Success Popup */}
      <SuccessPopup
        isOpen={isSuccessOpen}
        message={successMessage}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
};

export default Data;
