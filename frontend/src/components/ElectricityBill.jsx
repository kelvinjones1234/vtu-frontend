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
import { useGeneral } from "../context/GeneralContext";
import SubmitButton from "./SubmitButton";
import { useTransactionSubmit } from "./UserTransactionSubmit";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useAuth } from "../context/AuthenticationContext";
import { useProduct } from "../context/ProductContext";

import FloatingLabelInput from "./FloatingLabelInput";
import FloatingLabelSelect from "./FloatingLabelSelect";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

const ElectricityBill = ({ showSidebars = true, showStyle = true }) => {
  const { electricityFormData, setElectricityFormData, handleSave } =
    useProduct();

  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setElectricityFormData((prev) => {
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
  const { api } = useGeneral();
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
    if (!electricityFormData.selectedDisco) return [];
    return discos.filter(
      (disco) => disco.disco_name === electricityFormData.selectedDisco
    );
  }, [electricityFormData.selectedDisco, discos]);

  const validInputs = useCallback(() => {
    const newErrors = {};
    if (!electricityFormData.selectedDisco) {
      newErrors.selectedDisco = "Please select a Disco";
    }
    if (!electricityFormData.selectedMeterType) {
      newErrors.selectedMeterType = "Please select a meter type";
    }
    if (!electricityFormData.title) {
      newErrors.title = "Shortcut must be saved with a name";
    }
    if (!electricityFormData.meterNumber) {
      newErrors.meterNumber = "A meter number is required";
    } else if (!/^\d+$/.test(electricityFormData.meterNumber)) {
      newErrors.meterNumber = "Meter number must contain only digits";
    } else if (electricityFormData.meterNumber.length !== 13) {
      newErrors.meterNumber = "Enter a valid 13-digit meter number";
    }

    if (!electricityFormData.amount) {
      newErrors.amount = "Please enter an amount";
    }

    if (!electricityFormData.pin) {
      newErrors.pin = "PIN is required";
    } else if (electricityFormData.pin !== user.transaction_pin) {
      newErrors.pin = "Incorrect PIN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [electricityFormData, user.transaction_pin]);

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
    formData: electricityFormData,
    bypassMeterNumber,
  });

  const memoizedGeneralLeft = useMemo(() => <GeneralLeft />, []);
  const memoizedGeneralRight = useMemo(() => <GeneralRight />, []);

  return (
    <div
      className={`${
        showStyle &&
        "pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]"
      }`}
    >
      {showSidebars && memoizedGeneralLeft}
      <div className="mx-auto w-full max-w-[800px]">
        {showStyle && (
          <div>
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] md:text-3xl mb-4">
              Pay Electricity Bill
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Electricity Bill</span>
            </div>
          </div>
        )}
        <div
          className={`${
            showStyle &&
            "bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6"
          }`}
        >
          <form
            onSubmit={
              showStyle
                ? handleSubmit
                : (e) => handleSave(e, electricityFormData, validInputs)
            }
          >
            {!showStyle && (
              <div>
                <FloatingLabelInput
                  type="text"
                  name="title"
                  placeholder="Shortcut Name"
                  aria-label="Title"
                  value={electricityFormData.title}
                  onChange={handleInputChange}
                  className={`${inputStyle}`}
                  error={errors.title}
                />
              </div>
            )}
            {/* Disco Selection */}
            <div>
              <FloatingLabelSelect
                name="selectedDisco"
                placeholder="Disco Name"
                value={electricityFormData.selectedDisco}
                onChange={handleInputChange}
                error={errors.selectedDisco}
                // disabled={!electricityFormData.selectedDisco}
                options={uniqueDiscos.map((discoName) => ({
                  value: discoName,
                  label: discoName,
                }))}
              />
            </div>

            {/* Meter Type Selection */}
            <div>
              <FloatingLabelSelect
                name="selectedMeterType"
                placeholder="Meter Type"
                value={electricityFormData.selectedMeterType}
                onChange={handleInputChange}
                error={errors.selectedMeterType}
                disabled={!electricityFormData.selectedDisco}
                options={filteredMeterTypes.map((item) => ({
                  value: item.id,
                  label: item.meter_type,
                }))}
              />
            </div>

            {/* Meter Number Input */}
            <div>
              <FloatingLabelInput
                type="text"
                name="meterNumber"
                value={electricityFormData.meterNumber}
                disabled={!electricityFormData.selectedMeterType}
                placeholder="Meter Number"
                aria-label="Meter Number"
                className={`${inputStyle}`}
                onChange={handleInputChange}
                error={errors.meterNumber}
              />
            </div>

            {/* Amount Input */}
            <div>
              <FloatingLabelInput
                type="text"
                name="amount"
                placeholder="Amount"
                disabled={!electricityFormData.amount}
                value={electricityFormData.amount}
                onChange={handleInputChange}
                className={`${inputStyle}`}
                error={errors.amount}
              />
            </div>

            {/* PIN Input */}
            <div>
              <FloatingLabelInput
                type="password"
                name="pin"
                placeholder="Pin"
                disabled={!electricityFormData.amount}
                aria-label="Pin"
                value={electricityFormData.pin}
                autoComplete="current-password"
                className={`${inputStyle}`}
                error={errors.pin}
                onChange={handleInputChange}
              />
            </div>

            <div
              className={`${electricityFormData.pin?.length !== 4 && "hidden"}`}
            >
              <FloatingLabelInput
                type="text"
                name="charges"
                placeholder=""
                disabled
                value={`₦${electricityFormData.charges}`}
                onChange={handleInputChange}
                className={`${inputStyle}`}
              />
            </div>

            {/* Bypass IUC Number Toggle */}
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-5">
              <p className="dark:text-white text-primary opacity-80 font-semibold">
                Bypass Meter Number
              </p>
              <div
                className="flex items-center mr-3 cursor-pointer"
                onClick={handleBypass}
              >
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative transition-colors duration-300 ease-in-out ${
                    bypassMeterNumber ? "bg-[#1CCEFF]" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`h-6 w-6 bg-white border rounded-full absolute transform transition-transform duration-300 ease-in-out ${
                      bypassMeterNumber
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
                label={`${
                  bypassMeterNumber ? "Purchase" : "Verify Meter Number"
                }`}
              />
            </div>
          </form>
        </div>
      </div>
      {showSidebars && memoizedGeneralRight}
      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with transferring ₦${electricityFormData.amount} airtime to ${electricityFormData.phone}?`}
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
