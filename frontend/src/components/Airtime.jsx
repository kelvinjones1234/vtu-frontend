import axios from "axios";
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
import { useWallet } from "../context/WalletContext";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

const Airtime = () => {
  const { api, detectNetwork, setLoading } = useContext(GeneralContext);
  const { airtimeNetworks, activeApi } = useContext(ProductContext);
  const { user, authTokens, rememberMe} = useContext(AuthContext);
  const { walletData, setWalletData } = useWallet();

  const [formData, setFormData] = useState({
    selectedNetwork: "",
    selectedAirtimeType: "",
    phone: "",
    pin: "",
    amount: "",
    networkId: "",
  });

  const [airtimeTypes, setAirtimeTypes] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validInputs()) {
      if (rememberMe) {
        const token = localStorage.getItem("authTokens");
        const parsedToken = token ? JSON.parse(token) : null;

        if (parsedToken) {
          const storedAccessToken = parsedToken.access;
          if (storedAccessToken !== authTokens.access) {
            console.log("Token altered or empty");
            logoutUser();
          } else {
            setPopupState((prev) => ({ ...prev, isConfirmOpen: true }));
          }
        } else {
          console.log("No parsed token found");
          logoutUser();
        }
      } else {
        // If rememberMe is false, proceed without checking local storage
        setPopupState((prev) => ({ ...prev, isConfirmOpen: true }));
      }
    }
  };

  const generateUniqueId = useCallback((length = 16) => {
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }, []);

  const handleConfirm = useCallback(async () => {
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
    setLoading(true);
    try {
      const walletResponse = await api.get(`wallet/${user.username}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (walletResponse.data.balance < formData.amount) {
        throw new Error("Insufficient Funds");
      }

      const payload = {
        network: formData.networkId,
        phone: formData.phone,
        amount: formData.amount,
        plan_type: formData.selectedAirtimeType.toUpperCase(),
        bypass: bypassPhoneNumber,
        "request-id": `Airtime_${generateUniqueId()}`,
      };

      const response = await axios.post(
        "https://kusosub.com/api/topup/",
        payload,
        {
          headers: {
            Authorization: `Token ${activeApi}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newBalance = Number(walletData.balance) - formData.amount;
      const deduct = -formData.amount;

      await api.put(
        `fund-wallet/${user.username}/`,
        { balance: deduct },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      setWalletData((prevData) => ({ ...prevData, balance: newBalance }));
      productDes = `₦${formData.amount} ${formData.selectedNetwork} airtime`;
      await api.post(
        "transactions/",
        {
          transaction_ref_no: response.data.transid,
          wallet: user.user_id,
          transaction_type: "AIRTIME",
          product: productDes.toUpperCase(),
          price: formData.amount,
          status: response.data.status,
          new_bal: newBalance,
          phone: formData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      setPopupState((prev) => ({
        ...prev,
        successMessage: "Transaction successful!",
        isSuccessOpen: true,
      }));
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : error.message;

      if (errorMsg.includes("Insufficient Account")) {
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage: "Network error occurred!",
          isErrorOpen: true,
        }));
      } else {
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage: errorMsg,
          isErrorOpen: true,
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [
    api,
    authTokens.access,
    bypassPhoneNumber,
    formData,
    generateUniqueId,
    setLoading,
    user.username,
    user.user_id,
    walletData.balance,
  ]);

  const handleCancel = () =>
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
  const handleErrorClose = () =>
    setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
  const handleBypass = () => setBypassPhoneNumber((prev) => !prev);

  const memoizedGeneralLeft = useMemo(() => <GeneralLeft />, []);
  const memoizedGeneralRight = useMemo(() => <GeneralRight />, []);

  return (
    <div className="bg-bg_on h-auto bg-contain bg-no-repeat mt-[8rem] justify-center sm:bg-cover bg-center px-4 ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem] font-body_two">
      {memoizedGeneralLeft}
      <div>
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Buy Airtime
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Airtime</span>
          </div>
        </div>
        <div className="flex flex-col justify-center border-[0.01rem] border-gray-200 dark:border-gray-900 p-5 rounded-[1.5rem] dark:bg-opacity-15 shadow-lg shadow-indigo-950/10">
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
              {/* {errors.selectedNetwork && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedNetwork}
                </p>
              )} */}
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
              {/* {errors.selectedAirtimeType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.selectedAirtimeType}
                </p>
              )} */}
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
                className="dark:text-white text-primary opacity-80 font-semibold"
                onClick={handleBypass}
              >
                Bypass Phone Number
              </p>
              <div className="flex items-center mr-3">
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative cursor-pointer transition-colors duration-300 ease-in-out ${
                    bypassPhoneNumber ? "bg-gray-600" : "bg-primary"
                  }`}
                  onClick={handleBypass}
                >
                  <div
                    className={`h-6 w-6 bg-white bg-gray-400 rounded-full absolute transform transition-transform duration-300 ease-in-out ${
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
        message={`Are you sure you want to proceed with transferring ${formData.planName} to ${formData.phone}?`}
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
