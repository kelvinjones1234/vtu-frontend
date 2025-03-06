import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { GeneralContext } from "../context/GeneralContext"; 
import { AuthContext } from "../context/AuthenticationContext";
import SubmitButton from "./SubmitButton";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useTransactionSubmit } from "./UserTransactionSubmit";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

const Data = () => {
  const { dataNetworks } = useContext(ProductContext);
  const { api, detectNetwork } = useContext(GeneralContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    selectedNetwork: "",
    selectedPlanType: "",
    selectedDataPlan: "",
    selectedDataPlanId: "",
    networkId: "",
    planName: "",
    phone: "",
    pin: "",
    price: "",
    url: "",
    api_name: "",
  });

  const [planTypes, setPlanTypes] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [networkMessage, setNetworkMessage] = useState("");
  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  console.log("FORM DATA", formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when the input changes

    if (name === "phone") {
      handlePhoneChange(value);
    } else if (name === "selectedNetwork") {
      handleNetworkChange(value);
    } else if (name === "selectedPlanType") {
      handlePlanTypeChange(value);
    } else if (name === "selectedDataPlan") {
      handleDataPlanChange(value);
    }
  };

  const handlePhoneChange = (inputPhone) => {
    if (inputPhone.length === 11) {
      const detectedNetwork = detectNetwork(inputPhone);
      setNetworkMessage(
        detectedNetwork !== "Unknown Network"
          ? `Detected Network: ${detectedNetwork} <br /> NB: Ignore this for Ported Numbers`
          : `Unable to identify network <br /> NB: Ignore this for Ported Numbers`
      );
    } else {
      setNetworkMessage("");
    }
  };

  const handleNetworkChange = (selectedNetworkName) => {
    const selectedNetworkObj = dataNetworks.find(
      (network) => network.network === selectedNetworkName
    );
    if (selectedNetworkObj) {
      setFormData((prev) => ({
        ...prev,
        selectedNetwork: selectedNetworkName,
        networkId: selectedNetworkObj.network_id,
        selectedPlanType: "",
        selectedDataPlan: "",
        price: "",
      }));
      setPlanTypes([]);
      setDataPlans([]);
    }
  };

  const handlePlanTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlanType: value,
      selectedDataPlan: "",
      price: "",
    }));
    setDataPlans([]);
  };

  const handleDataPlanChange = (value) => {
    const selected = parseInt(value, 10);
    const selectedPlan = dataPlans.find(
      (plan) => plan.id === selected || plan.plan_id === selected
    );
    if (selectedPlan) {
      setFormData((prev) => ({
        ...prev,
        selectedDataPlanId: selectedPlan.plan_id,
        selectedDataPlan: selectedPlan.id,
        planName: selectedPlan.data_plan,
        price: selectedPlan.price,
        url: selectedPlan.api.api_url,
        api_name: selectedPlan.api.api_name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedDataPlanId: "",
        selectedDataPlan: "",
        price: "",
      }));
    }
  };

  useEffect(() => {
    if (formData.selectedNetwork) {
      api
        .get(`data/plan-type/${formData.selectedNetwork}/`)
        .then((response) => setPlanTypes(response.data))
        .catch((error) => console.error("Error fetching plan types:", error));
    }
  }, [formData.selectedNetwork, api]);

  useEffect(() => {
    if (formData.selectedPlanType && formData.selectedNetwork) {
      api
        .get(
          `data/plans/${formData.selectedNetwork}/${formData.selectedPlanType}/`
        )
        .then((response) => setDataPlans(response.data))
        .catch((error) => console.error("Error fetching data plans:", error));
    }
  }, [formData.selectedPlanType, formData.selectedNetwork, api]);

  const validInputs = () => {
    const newErrors = {};
    if (!formData.selectedNetwork) {
      newErrors.selectedNetwork = "Please select a network";
    }
    if (!formData.selectedPlanType) {
      newErrors.selectedPlanType = "Please select a plan type";
    }
    if (!formData.selectedDataPlan) {
      newErrors.selectedDataPlan = "Please select a data plan";
    }
    if (!formData.phone) {
      newErrors.phone = "A phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits";
    } else if (formData.phone.length !== 11) {
      newErrors.phone = "Enter a valid 11-digit phone number";
    }
    if (!formData.pin) {
      newErrors.pin = "PIN is required";
    } else if (formData.pin !== user.transaction_pin) {
      newErrors.pin = "Incorrect PIN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateUniqueId = (length = 16) => {
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  };

  const productType = "data";

  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    generateUniqueId,
    productType,
    formData,
    bypassPhoneNumber,
  });

  const handleCancel = () =>
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
  const handleErrorClose = () =>
    setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
  const handleBypass = () => setBypassPhoneNumber((prev) => !prev);

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto w-full max-w-[800px]">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] md:text-3xl mb-4">
            Buy Data
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Data</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Network Selection */}
            <div>
              {errors.selectedNetwork && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.selectedNetwork}
                </p>
              )}
              <select
                name="selectedNetwork"
                aria-label="Network"
                value={formData.selectedNetwork}
                onChange={handleInputChange}
                className={`${selectStyle} ${
                  errors.selectedNetwork ? errorInputStyle : ""
                }`}
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

            {/* Plan Type Selection */}
            <div>
              {errors.selectedPlanType && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.selectedPlanType}
                </p>
              )}
              <select
                name="selectedPlanType"
                aria-label="Plan Type"
                value={formData.selectedPlanType}
                onChange={handleInputChange}
                className={`${selectStyle} ${
                  errors.selectedPlanType ? errorInputStyle : ""
                }`}
                disabled={
                  !formData.selectedNetwork ||
                  !planTypes.some((type) => type.is_active)
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
                    {type.plan_type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Plan Selection */}
            <div>
              {errors.selectedDataPlan && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.selectedDataPlan}
                </p>
              )}
              <select
                name="selectedDataPlan"
                aria-label="Data Plan"
                value={formData.selectedDataPlan}
                onChange={handleInputChange}
                className={`${selectStyle} ${
                  errors.selectedDataPlan ? errorInputStyle : ""
                }`}
                disabled={!formData.selectedPlanType}
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

            {/* Phone Number Input */}
            <div>
              {errors.phone && (
                <p className="text-red-500 text-sm mb-1">{errors.phone}</p>
              )}
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                aria-label="Phone number"
                disabled={!formData.selectedDataPlan}
                value={formData.phone}
                onChange={handleInputChange}
                className={`${inputStyle} ${
                  errors.phone ? errorInputStyle : ""
                }`}
              />
              {networkMessage && (
                <p
                  className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: networkMessage }}
                />
              )}
            </div>

            {/* PIN Input */}
            <div>
              {errors.pin && (
                <p className="text-red-500 text-sm mb-1">{errors.pin}</p>
              )}
              <input
                type="password"
                name="pin"
                placeholder="Pin"
                disabled={!formData.phone}
                aria-label="Pin"
                autoComplete="current-password"
                value={formData.pin}
                onChange={handleInputChange}
                className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
              />
            </div>

            {/* Price Display */}
            {formData.price && (
              <input
                type="text"
                disabled
                name="price"
                placeholder="Price"
                value={`₦${formData.price}`}
                className={`${inputStyle}`}
              />
            )}

            {/* Bypass Phone Number Toggle */}
            <div
              className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3"
              // Make the entire div clickable
            >
              <p className="dark:text-white text-primary opacity-80 font-semibold">
                Bypass Phone Number
              </p>
              <div
                className="flex items-center mr-3 cursor-pointer"
                onClick={handleBypass}
              >
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative transition-colors duration-300 ease-in-out ${
                    bypassPhoneNumber ? "bg-[#1CCEFF]" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`h-6 w-6 bg-white border rounded-full absolute transform transition-transform duration-300 ease-in-out ${
                      bypassPhoneNumber
                        ? "translate-x-5"
                        : "translate-x-[-0.1rem]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <SubmitButton label="Purchase" />
            </div>
          </form>
        </div>
      </div>
      <GeneralRight />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with transferring ${formData.planName} to ${formData.phone}?`}
      />

      {/* Error Popup */}
      <ErrorPopup
        isOpen={popupState.isErrorOpen}
        message={popupState.errorPopupMessage}
        onClose={handleErrorClose}
      />

      {/* Success Popup */}
      <SuccessPopup
        isOpen={popupState.isSuccessOpen}
        message={popupState.successMessage}
        onClose={() =>
          setPopupState((prev) => ({ ...prev, isSuccessOpen: false }))
        }
      />
    </div>
  );
};

export default Data;
