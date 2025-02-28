import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import SubmitButton from "./SubmitButton";
import { useTransactionSubmit } from "./UserTransactionSubmit";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { AuthContext } from "../context/AuthenticationContext";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

const ElectricityBill = () => {
  const [formData, setFormData] = useState({
    meterNumber: "",
    pin: "",
    amount: "",
    selectedDisco: "",
    selectedMeterType: "",
    selectedDiscoId: "", // Add selectedDiscoId to the formData state
  });

  const { user } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      // If the selectedDisco changes, find the corresponding plan_id
      if (name === "selectedDisco") {
        const selectedDisco = discos.find(
          (disco) => disco.disco_name === value
        );
        if (selectedDisco) {
          updatedFormData.selectedDiscoId = selectedDisco.plan_id;
        } else {
          updatedFormData.selectedDiscoId = ""; // Reset if no matching Disco is found
        }
      }

      return updatedFormData;
    });

    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when the input changes
  };

  const [errors, setErrors] = useState({});
  const [discos, setDiscos] = useState([]);
  const { api } = useContext(GeneralContext);
  const [bypassMeterNumber, setBypassMeterNumber] = useState(false);

  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  const handleBypass = () => {
    setBypassMeterNumber(!bypassMeterNumber);
  };

  useEffect(() => {
    api
      .get("electricity-bill/")
      .then((response) => setDiscos(response.data))
      .catch((error) => console.error("Error Fetching Discos", error));
  }, [api]);

  // Get unique Disco names
  const uniqueDiscos = useMemo(() => {
    const discoNames = discos.map((disco) => disco.disco_name);
    return [...new Set(discoNames)]; // Remove duplicates using Set
  }, [discos]);

  // Filter meter types based on selected Disco
  const filteredMeterTypes = useMemo(() => {
    if (!formData.selectedDisco) return [];
    return discos.filter(
      (disco) => disco.disco_name === formData.selectedDisco
    );
  }, [formData.selectedDisco, discos]);

  const validInputs = () => {
    const newErrors = {};
    if (!formData.selectedDisco) {
      newErrors.selectedDisco = "Please select a Disco";
    }
    if (!formData.selectedMeterType) {
      newErrors.selectedMeterType = "Please select a meter type";
    }
    if (!formData.meterNumber) {
      newErrors.meterNumber = "A meter number is required";
    } else if (!/^\d+$/.test(formData.meterNumber)) {
      newErrors.meterNumber = "Meter number must contain only digits";
    } else if (formData.meterNumber.length !== 11) {
      newErrors.meterNumber = "Enter a valid 11-digit meter number";
    }

    if (!formData.amount) {
      newErrors.amount = "Please enter an amount";
    }

    if (!formData.pin) {
      newErrors.pin = "PIN is required";
    } else if (formData.pin !== user.transaction_pin) {
      newErrors.pin = "Incorrect PIN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateUniqueId = useCallback((length = 16) => {
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }, []);

  const handleCancel = () =>
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
  const handleErrorClose = () =>
    setPopupState((prev) => ({ ...prev, isErrorOpen: false }));

  const productType = "electricity";

  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    generateUniqueId,
    productType,
    formData,
    bypassMeterNumber,
  });


  const memoizedGeneralLeft = useMemo(() => <GeneralLeft />, []);
  const memoizedGeneralRight = useMemo(() => <GeneralRight />, []);

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      {memoizedGeneralLeft}
      <div className="mx-auto w-full max-w-[800px]">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
            Pay Electricity Bill
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Electricity Bill</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Disco Selection */}
            <div>
              {errors.selectedDisco && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.selectedDisco}
                </p>
              )}
              <select
                name="selectedDisco"
                aria-label="Disco Name"
                className={`${selectStyle} ${
                  errors.selectedDisco ? errorInputStyle : ""
                }`}
                value={formData.selectedDisco}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Disco Name
                </option>
                {uniqueDiscos.map((discoName, index) => (
                  <option key={index} value={discoName}>
                    {discoName}
                  </option>
                ))}
              </select>
            </div>

            {/* Meter Type Selection */}
            <div>
              {errors.selectedMeterType && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.selectedMeterType}
                </p>
              )}
              <select
                name="selectedMeterType"
                aria-label="Meter Type"
                className={`${selectStyle} ${
                  errors.selectedMeterType ? errorInputStyle : ""
                }`}
                value={formData.selectedMeterType}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Meter Type
                </option>
                {filteredMeterTypes.map((item) => (
                  <option
                    key={item.id}
                    value={item.meter_type}
                    disabled={!item.is_active}
                  >
                    {item.meter_type}
                  </option>
                ))}
              </select>
            </div>

            {/* Meter Number Input */}
            <div>
              {errors.meterNumber && (
                <p className="text-red-500 text-sm mb-1">
                  {errors.meterNumber}
                </p>
              )}
              <input
                type="text"
                name="meterNumber"
                value={formData.meterNumber}
                placeholder="Meter Number"
                aria-label="Meter Number"
                className={`${inputStyle} ${
                  errors.meterNumber ? errorInputStyle : ""
                }`}
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
                aria-label="Pin"
                value={formData.pin}
                autoComplete="current-password"
                className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
                onChange={handleInputChange}
              />
            </div>

            {/* Amount Input */}
            <div>
              {errors.amount && (
                <p className="text-red-500 text-sm mb-1">{errors.amount}</p>
              )}
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`${inputStyle} ${
                  errors.amount ? errorInputStyle : ""
                }`}
              />
            </div>

            {/* Bypass IUC Number Toggle */}
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-5">
              <p
                className="dark:text-white text-primary opacity-80 font-semibold cursor-pointer"
                onClick={handleBypass}
              >
                Bypass Meter Number
              </p>
              <div className="flex items-center mr-3">
                <div
                  className={`h-4 w-9 rounded-2xl flex items-center relative ${
                    bypassMeterNumber ? "bg-gray-600" : "bg-primary"
                  }`}
                >
                  <div
                    className={`button h-5 w-5 bg-white rounded-full absolute hover:transition-all hover:duration-450 ease-in-out ${
                      bypassMeterNumber ? "right-0" : "left-0"
                    }`}
                    onClick={handleBypass}
                  ></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <SubmitButton label="Verify Meter Number" />
            </div>
          </form>
        </div>
      </div>
      {memoizedGeneralRight}
      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with transferring ₦${formData.amount} airtime to ${formData.phone}?`}
      />

      <ErrorPopup
        isOpen={popupState.isErrorOpen}
        message={popupState.errorPopupMessage}
        onClose={handleErrorClose}
      />

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

export default ElectricityBill;
