import React, { useContext, useEffect, useState } from "react";
import SubmitButton from "./SubmitButton";
import { useAuth } from "../context/AuthenticationContext";
import { useProduct } from "../context/ProductContext";
import { useGeneral } from "../context/GeneralContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useTransactionSubmit } from "./UserTransactionSubmit";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

const CableSub = () => {
  const { cableCategories } = useProduct();
  const { user } = useAuth();
  const { api } = useGeneral();

  const [bypassUicNumber, setBypassUicNumber] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCableCatId, setSelectedCableCatId] = useState("");
  const [selectedCableId, setSelectedCableId] = useState(""); // New state for id

  const [cablePlans, setCablePlans] = useState([]);
  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  const [formData, setFormData] = useState({
    selectedCableCategory: "",
    selectedCablePlan: "",
    uicNumber: "",
    pin: "",
    price: "",
    planName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when the input changes
  };

  const handleSelectedCableCategory = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedCategory = cableCategories.find(
      (cable) => selectedId === cable.id
    );

    if (selectedCategory) {
      setSelectedCableId(selectedCategory.id); // Store id for fetching plans
      setSelectedCableCatId(selectedCategory.cable_id); // Store cable_id for formData
      setFormData((prev) => ({
        ...prev,
        selectedCableCategory: selectedCategory.cable_id, // Set to cable_id
        selectedCablePlan: "",
        price: "",
      }));
      setCablePlans([]);
    }
  };

  const handleSelectedCablePlan = (e) => {
    const selectedPlanId = parseInt(e.target.value, 10);
    const selectedPlan = cablePlans.find(
      (plan) => plan.plan_id === selectedPlanId
    );
    setFormData((prev) => ({
      ...prev,
      selectedCablePlan: selectedPlanId,
      price: selectedPlan ? selectedPlan.price : "",
      planName: selectedPlan ? selectedPlan.cable_plan : "",
    }));
  };

  const validInputs = () => {
    const newErrors = {};
    if (!formData.selectedCableCategory) {
      newErrors.selectedCableCategory = "Please select a cable category";
    }
    if (!formData.selectedCablePlan) {
      newErrors.selectedCablePlan = "Please select a cable plan";
    }
    if (!formData.uicNumber) {
      newErrors.uicNumber = "A UIC number is required";
    } else if (formData.uicNumber.length !== 10) {
      newErrors.uicNumber = "Enter a valid 10-digit UIC number";
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

  const productType = "cable";

  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    generateUniqueId,
    productType,
    formData,
    bypassUicNumber,
  });

  const handleCancel = () =>
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
  const handleErrorClose = () =>
    setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
  const handleBypass = () => setBypassUicNumber((prev) => !prev);

  useEffect(() => {
    if (selectedCableId) {
      api
        .get(`category/${selectedCableId}/`)
        .then((response) => {
          setCablePlans(response.data);
        })
        .catch((error) => console.error("Error fetching cable plans:", error));
    }
  }, [selectedCableId, api]);

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto w-full max-w-[800px]">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] md:text-3xl mb-4">
            Buy Cable Subscription
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Cable Subscription</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cable Category Selection */}
            <div>
              {errors.selectedCableCategory && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.selectedCableCategory}
                </p>
              )}
              <select
                name="selectedCableCategory"
                aria-label="Cable Name"
                className={`${selectStyle} ${
                  errors.selectedCableCategory ? errorInputStyle : ""
                }`}
                value={formData.selectedCableCategory}
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

            {/* Cable Plan Selection */}
            <div>
              {errors.selectedCablePlan && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.selectedCablePlan}
                </p>
              )}
              <select
                name="selectedCablePlan"
                aria-label="Cable Plan"
                className={`${selectStyle} ${
                  errors.selectedCablePlan ? errorInputStyle : ""
                }`}
                value={formData.selectedCablePlan}
                onChange={handleSelectedCablePlan}
                disabled={!selectedCableCatId}
              >
                <option value="" disabled>
                  Cable Plan
                </option>
                {cablePlans.map((item) => (
                  <option value={item.plan_id} key={item.id}>
                    {item.cable_plan}
                  </option>
                ))}
              </select>
            </div>

            {/* UIC Number Input */}
            <div>
              {errors.uicNumber && (
                <p className="text-red-500 text-sm mb-1">{errors.uicNumber}</p>
              )}
              <input
                type="text"
                name="uicNumber"
                placeholder="UIC Number"
                aria-label="UIC Number"
                className={`${inputStyle} ${
                  errors.uicNumber ? errorInputStyle : ""
                }`}
                value={formData.uicNumber}
                onChange={handleInputChange}
              />
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
                aria-label="Password"
                autoComplete="current-password"
                className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
                value={formData.pin}
                onChange={handleInputChange}
              />
            </div>

            {/* Price Display */}
            {formData.price && (
              <div>
                <input
                  type="text"
                  disabled
                  name="price"
                  placeholder="Price"
                  value={`₦${Number(formData.price).toLocaleString("en-NG")}`}
                  className={inputStyle}
                />
              </div>
            )}

            {/* Bypass UIC Number Toggle */}
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-5">
              <p className="dark:text-white text-primary opacity-80 font-semibold">
                Bypass UIC Number
              </p>
              <div
                className="flex items-center mr-3 cursor-pointer"
                onClick={handleBypass}
              >
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative transition-colors duration-300 ease-in-out ${
                    bypassUicNumber ? "bg-[#1CCEFF]" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`h-6 w-6 bg-white border rounded-full absolute transform transition-transform duration-300 ease-in-out ${
                      bypassUicNumber
                        ? "translate-x-5"
                        : "translate-x-[-0.1rem]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <SubmitButton
                label={`${bypassUicNumber ? "Purchase" : "Verify IUC Number"}`}
              />
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
        message={`Are you sure you want to proceed with subscribing ${formData.planName} to ${formData.uicNumber}?`}
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

export default CableSub;
