import { useProduct } from "../context/ProductContext";
import { useAuth } from "../context/AuthenticationContext";
import { useGeneral } from "../context/GeneralContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import {
  useState,
  React,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useTransactionSubmit } from "./UserTransactionSubmit";
import FloatingLabelInput from "./FloatingLabelInput";
import FloatingLabelSelect from "./FloatingLabelSelect";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

const Airtime = ({ showSidebars = true, showStyle = true }) => {
  const { api, detectNetwork } = useGeneral();
  const [loading, setLoading] = useState(false);

  const { airtimeNetworks, setAirtimeFormData, airtimeFormData, handleSave } =
    useProduct();

  const { user } = useAuth();

  const [airtimeTypes, setAirtimeTypes] = useState([]);
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

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setAirtimeFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when the input changes

      if (name === "phone") {
        const detectedNetwork = detectNetwork(value);
        setNetworkMessage(
          value
            ? `Detected Network: ${detectedNetwork} <br /> NB: Ignore this for Ported Numbers`
            : ""
        );
      }

      if (name === "selectedNetwork") {
        const selectedNetworkObj = airtimeNetworks.find(
          (network) => network.network === value
        );
        if (selectedNetworkObj) {
          setAirtimeFormData((prev) => ({
            ...prev,
            selectedNetwork: value,
            networkId: selectedNetworkObj.network_id,
          }));
        }
      }
    },
    [airtimeNetworks, detectNetwork]
  );

  useEffect(() => {
    if (airtimeFormData.selectedNetwork) {
      api
        .get(`airtime/airtime-type/${airtimeFormData.selectedNetwork}/`)
        .then((response) => setAirtimeTypes(response.data))
        .catch((error) => {
          console.error("Error fetching plan types:", error);
          setPopupState((prev) => ({
            ...prev,
            errorPopupMessage:
              "Failed to fetch airtime types. Please try again.",
            isErrorOpen: true,
          }));
        });
    }
  }, [airtimeFormData.selectedNetwork, api]);

  const validInputs = useCallback(() => {
    const newErrors = {};
    if (!airtimeFormData.selectedNetwork)
      newErrors.selectedNetwork = "Please select a network";
    if (!airtimeFormData.title) {
      newErrors.title = "Shortcut must be saved with a name";
    }
    if (!airtimeFormData.selectedAirtimeType)
      newErrors.selectedAirtimeType = "Please select an airtime type";
    if (!airtimeFormData.phone) {
      newErrors.phone = "A phone number is required";
    } else if (!/^\d+$/.test(airtimeFormData.phone)) {
      newErrors.phone = "Phone number must contain only digits";
    } else if (airtimeFormData.phone.length !== 11) {
      newErrors.phone = "Enter a valid 11-digit phone number";
    }

    if (!airtimeFormData.amount) newErrors.amount = "Please enter an amount";
    if (!airtimeFormData.pin) {
      newErrors.pin = "PIN is required";
    } else if (airtimeFormData.pin !== user.transaction_pin) {
      newErrors.pin = "Incorrect PIN";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [airtimeFormData, user.transaction_pin]);

  const generateUniqueId = useCallback((length = 16) => {
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }, []);

  const productType = "airtime";

  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    generateUniqueId,
    setLoading,
    productType,
    formData: airtimeFormData,
    bypassPhoneNumber,
  });

  const handleCancel = () =>
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
  const handleErrorClose = () =>
    setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
  const handleBypass = () => setBypassPhoneNumber((prev) => !prev);

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
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] mb-4">
              Buy Airtime
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Airtime</span>
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
                : (e) => handleSave(e, airtimeFormData, validInputs)
            }
          >
            {!showStyle && (
              <div>
                <FloatingLabelInput
                  type="text"
                  name="title"
                  placeholder="Shortcut Name"
                  aria-label="Title"
                  value={airtimeFormData.title}
                  onChange={handleInputChange}
                  className={`${inputStyle}`}
                  error={errors.title}
                />
              </div>
            )}

            {/* Network Selection */}
            <FloatingLabelSelect
              name="selectedNetwork"
              placeholder="Network"
              value={airtimeFormData.selectedNetwork}
              onChange={handleInputChange}
              error={errors.selectedNetwork}
              options={airtimeNetworks.map((item) => ({
                value: item.network,
                label: item.network,
              }))}
            />

            <FloatingLabelSelect
              name="selectedAirtimeType"
              placeholder="Plan Type"
              value={airtimeFormData.selectedAirtimeType}
              onChange={handleInputChange}
              error={errors.selectedAirtimeType}
              disabled={!airtimeFormData.selectedNetwork}
              options={airtimeTypes.map((item) => ({
                value: item.airtime_type,
                label: item.airtime_type,
              }))}
            />

            {/* Phone Number Input */}
            <div>
              <FloatingLabelInput
                type="text"
                name="phone"
                placeholder="Phone Number"
                aria-label="Phone number"
                disabled={!airtimeFormData.selectedAirtimeType}
                value={airtimeFormData.phone}
                onChange={handleInputChange}
                className={`${inputStyle}`}
                error={errors.phone}
              />
              {networkMessage && (
                <p
                  className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: networkMessage }}
                />
              )}
            </div>

            {/* Amount Input */}
            <div>
              <FloatingLabelInput
                type="text"
                name="amount"
                placeholder="Amount"
                disabled={!airtimeFormData.phone}
                aria-label="Amount"
                value={airtimeFormData.amount}
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
                disabled={!airtimeFormData.amount}
                aria-label="Pin"
                autoComplete="current-password"
                value={airtimeFormData.pin}
                onChange={handleInputChange}
                className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
                error={errors.pin}
              />
            </div>

            {/* Bypass Phone Number Toggle */}
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3">
              <p
                className="dark:text-white text-primary opacity-80 font-semibold cursor-pointer"
                onClick={handleBypass}
              >
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
              <SubmitButton
                label={`${showStyle ? "Purchase" : "Save"}`}
                loading={loading}
              />
            </div>
          </form>
        </div>
      </div>
      {showSidebars && memoizedGeneralRight}

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with transferring ₦${airtimeFormData.amount} airtime to ${airtimeFormData.phone}?`}
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

export default Airtime;
