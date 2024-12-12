import React, {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { GeneralContext } from "../context/GeneralContext";
import { useWallet } from "../context/WalletContext";
import { AuthContext } from "../context/AuthenticationContext";
import SubmitButton from "./SubmitButton";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import axios from "axios";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white sm:w-[40vw] hover:transition hoveer:duration-450 hover:ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white sm:w-[40vw] hover:transition hoveer:duration-450 hover:ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

const Data = () => {
  const { dataNetworks, activeApi } = useContext(ProductContext);
  const { api, detectNetwork, setLoading } = useContext(GeneralContext);
  const { user, authTokens, logoutUser, rememberMe } = useContext(AuthContext);
  const { walletData, setWalletData } = useWallet();

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
  });

  const [planTypes, setPlanTypes] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [networkMessage, setNetworkMessage] = useState("");
  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  const memoizedApi = useMemo(() => api, [api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
    const newError = {};
    if (!formData.phone) newError.phone = "A phone number is required";
    else if (formData.phone.length !== 11)
      newError.phone = "Enter a valid 11-digit phone number";
    if (formData.pin !== user.transaction_pin) newError.pin = "Incorrect pin";
    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

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

  const handleConfirm = useCallback(async () => {
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
    setLoading(true);

    const generateUniqueId = (length = 16) => {
      const array = new Uint8Array(length / 2);
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
    };

    try {
      const walletResponse = await memoizedApi.get(`wallet/${user.username}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (walletResponse.data.balance < formData.price) {
        throw new Error(
          `Insufficient Funds ₦${walletResponse.data.balance}.00`
        );
      }

      const payload = {
        network: formData.networkId,
        phone: formData.phone,
        data_plan: formData.selectedDataPlanId,
        bypass: bypassPhoneNumber,
        "request-id": `Data_${generateUniqueId()}`,
      };

      const response = await axios.post(
        "https://kusosub.com/api/data",
        payload,
        {
          headers: {
            Authorization: `Token ${activeApi}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newBalance = Number(walletData.balance) - formData.price;
      const deduct = -formData.price;

      await memoizedApi.put(
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

      await memoizedApi.post(
        "transactions/",
        {
          transaction_ref_no: response.data.transid,
          wallet: user.user_id,
          transaction_type: "DATA",
          product: formData.planName,
          price: formData.price,
          status: response.data.status,
          new_bal: newBalance,
          phone: formData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
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
    memoizedApi,
    user.username,
    authTokens.access,
    walletData,
    formData,
    bypassPhoneNumber,
    setWalletData,
    setLoading,
  ]);

  const handleCancel = () =>
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
  const handleErrorClose = () =>
    setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
  const handleBypass = () => setBypassPhoneNumber((prev) => !prev);

  return (
    <div className="pt-[6rem] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
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
        <div className="flex flex-col justify-center border-[0.01rem] dark:border-gray-900 p-5 rounded-[1.5rem] shadow-lg shadow-indigo-950/10">
          <form onSubmit={handleSubmit}>
            <div>
              {errorMessage.selectedNetwork && (
                <div className="text-red-500 text-sm mb-1">
                  {errorMessage.selectedNetwork}
                </div>
              )}
              <select
                name="selectedNetwork"
                aria-label="Network"
                value={formData.selectedNetwork}
                onChange={handleInputChange}
                className={`${selectStyle} ${
                  errorMessage.selectedNetwork ? "border-red-500" : ""
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

            <div>
              {errorMessage.selectedPlanType && (
                <div className="text-red-500 text-sm mb-1">
                  {errorMessage.selectedPlanType}
                </div>
              )}
              <select
                name="selectedPlanType"
                aria-label="Plan Type"
                value={formData.selectedPlanType}
                onChange={handleInputChange}
                className={`${selectStyle} ${
                  errorMessage.selectedPlanType ? "border-red-500" : ""
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
                    {type.plan_type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {errorMessage.selectedDataPlan && (
                <div className="text-red-500 text-sm mb-1">
                  {errorMessage.selectedDataPlan}
                </div>
              )}
              <select
                name="selectedDataPlan"
                aria-label="Data Plan"
                value={formData.selectedDataPlan}
                onChange={handleInputChange}
                className={`${selectStyle} ${
                  errorMessage.selectedDataPlan ? errorInputStyle : ""
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

            <div>
              {errorMessage.phone && (
                <div className="text-red-500 text-sm mb-1">
                  {errorMessage.phone}
                </div>
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
                  errorMessage.phone ? errorInputStyle : ""
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
              {errorMessage.pin && (
                <div className="text-red-500 text-sm mb-1">
                  {errorMessage.pin}
                </div>
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
                className={`${inputStyle} ${
                  errorMessage.pin ? errorInputStyle : ""
                }`}
              />
            </div>

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

            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3">
              <p
                className="dark:text-white text-primary opacity-80 font-semibold cursor-pointer"
                onClick={handleBypass}
              >
                Bypass Phone Number
              </p>
              <div className="flex items-center mr-3">
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative cursor-pointer hover:transition-colors hoveer:duration-300 hover:ease-in-out ${
                    bypassPhoneNumber ? "bg-gray-600" : "bg-primary"
                  }`}
                  onClick={handleBypass}
                >
                  <div
                    className={`h-6 w-6 bg-white bg-gray-400 rounded-full absolute transform hover:transition-transform hoveer:duration-300 hover:ease-in-out ${
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
      <GeneralRight />

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

export default Data;
