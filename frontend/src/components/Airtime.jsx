import { ProductContext } from "../context/ProductContext";
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

const Airtime = () => {
  const { api, detectNetwork } = useContext(GeneralContext);
  const { airtimeNetworks } = useContext(ProductContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    selectedNetwork: "",
    selectedAirtimeType: "",
    phone: "",
    pin: "",
    amount: "",
    networkId: "",
  });

  const [airtimeTypes, setAirtimeTypes] = useState([]);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
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
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));

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
          setFormData((prev) => ({
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
    if (formData.selectedNetwork) {
      api
        .get(`airtime/airtime-type/${formData.selectedNetwork}/`)
        .then((response) => setAirtimeTypes(response.data))
        .catch((error) => {
          console.error("Error fetching plan types:", error);
          setErrorPopupMessage(
            "Failed to fetch airtime types. Please try again."
          );
          setIsErrorOpen(true);
        });
    }
  }, [formData.selectedNetwork, api]);

  const validInputs = useCallback(() => {
    const newErrors = {};
    if (!formData.selectedNetwork)
      newErrors.selectedNetwork = "Please select a network";
    if (!formData.selectedAirtimeType)
      newErrors.selectedAirtimeType = "Please select an airtime type";
    if (!formData.phone) {
      newErrors.phone = "A phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits";
    } else if (formData.phone.length !== 11) {
      newErrors.phone = "Enter a valid 11-digit phone number";
    }

    if (!formData.amount) newErrors.amount = "Please enter an amount";
    if (!formData.pin) {
      newErrors.pin = "PIN is required";
    } else if (formData.pin !== user.transaction_pin) {
      newErrors.pin = "Incorrect PIN";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, user.transaction_pin]);

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
    productType,
    formData,
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
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      {memoizedGeneralLeft}
      <div className="mx-auto w-full max-w-[800px]">
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
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div>
              <select
                name="selectedNetwork"
                aria-label="Network"
                className={`${selectStyle}`}
                value={formData.selectedNetwork}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Network
                </option>
                {airtimeNetworks.map((item) => (
                  <option key={item.network_id} value={item.network}>
                    {item.network.toUpperCase()}
                  </option>
                ))}
              </select>
              {errors.selectedNetwork && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedNetwork}
                </p>
              )}
            </div>
            <div>
              <select
                name="selectedAirtimeType"
                aria-label="Plan Type"
                className={`${selectStyle}`}
                value={formData.selectedAirtimeType}
                onChange={handleInputChange}
                disabled={
                  !formData.selectedNetwork ||
                  !airtimeTypes.some((type) => type.is_active)
                }
              >
                <option value="" disabled>
                  Plan Type
                </option>
                {airtimeTypes.map((item) => (
                  <option
                    key={item.id}
                    value={item.airtime_type}
                    disabled={!item.is_active}
                  >
                    {item.airtime_type.toUpperCase()}
                  </option>
                ))}
              </select>
              {errors.selectedAirtimeType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedAirtimeType}
                </p>
              )}
            </div>

            <div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                aria-label="Phone number"
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
            <div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                className={`${inputStyle} ${
                  errors.amount ? errorInputStyle : ""
                }`}
                onChange={handleInputChange}
              />
            </div>
            <div>
              {errors.pin && (
                <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
              )}
              <input
                type="password"
                name="pin"
                placeholder="Pin"
                aria-label="Pin"
                autoComplete="current-password"
                value={formData.pin}
                onChange={handleInputChange}
                className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
              />
            </div>
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3">
              <p
                className="dark:text-white text-primary opacity-80 font-semibold cursor-pointer"
                onClick={handleBypass}
              >
                Bypass Phone Number
              </p>
              <div className="flex items-center mr-3">
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative cursor-pointer hover:transition-colors hover:duration-300 ease-in-out ${
                    bypassPhoneNumber ? "bg-gray-600" : "bg-primary"
                  }`}
                  onClick={handleBypass}
                >
                  <div
                    className={`h-6 w-6 bg-white bg-gray-400 rounded-full absolute transform hover:transition-transform hover:duration-300 ease-in-out ${
                      bypassPhoneNumber
                        ? "translate-x-5"
                        : "translate-x-[-0.1rem]"
                    }`}
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

export default Airtime;
