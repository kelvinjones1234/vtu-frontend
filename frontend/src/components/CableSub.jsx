import React, {
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import SubmitButton from "./SubmitButton";
import { AuthContext } from "../context/AuthenticationContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useWallet } from "../context/WalletContext";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";


  const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";


const CableSub = () => {
  const { cableCategories } = useContext(ProductContext);
  const { user, authTokens, rememberMe, logoutUser } = useContext(AuthContext);
  const { walletData, setWalletData } = useWallet();
  const { api, setLoading } = useContext(GeneralContext);

  const [bypassUicNumber, setBypassUicNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [selectedCableCatId, setSelectedCableCatId] = useState("");

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

  const memoizedApi = useMemo(() => api, [api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectedCableCategory = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedCategory = cableCategories.find(
      (cable) => selectedId === cable.id
    );

    if (selectedCategory) {
      setSelectedCableCatId(selectedCategory.cable_id);
      setFormData((prev) => ({
        ...prev,
        selectedCableCategory: selectedId,
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
    const newError = {};
    if (!formData.uicNumber) newError.uicNumber = "A UIC number is required";
    else if (formData.uicNumber.length !== 10)
      newError.uicNumber = "Enter a valid 10-digit UIC number";
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
        bypass: bypassUicNumber,
        "request-id": `Cable_${generateUniqueId()}`,
        // Add other necessary payload fields
      };

      const response = await axios.post(
        "https://kusosub.com/api/cable", // Update this URL
        payload,
        {
          headers: {
            Authorization: `Token ${process.env.REACT_APP_API_KEY}`, // Use environment variable for API key
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
          transaction_type: "CABLE",
          product: formData.planName,
          price: formData.price,
          status: response.data.status,
          new_bal: newBalance,
          uicNumber: formData.uicNumber,
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
    user.user_id,
    authTokens.access,
    walletData,
    formData,
    bypassUicNumber,
    setWalletData,
    setLoading,
  ]);

  const handleCancel = () =>
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
  const handleErrorClose = () =>
    setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
  const handleBypass = () => setBypassUicNumber((prev) => !prev);

  useEffect(() => {
    if (formData.selectedCableCategory) {
      api
        .get(`category/${formData.selectedCableCategory}/`)
        .then((response) => {
          setCablePlans(response.data);
        })
        .catch((error) => console.error("Error fetching cable plans:", error));
    }
  }, [formData.selectedCableCategory, api]);

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto w-full max-w-[800px]">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
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
            <div>
              <select
                name="selectedCableCategory"
                aria-label="Cable Name"
                className={selectStyle}
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
            <div>
              <select
                name="selectedCablePlan"
                aria-label="Cable Plan"
                className={selectStyle}
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
            <div>
              {errorMessage.uicNumber && (
                <div className="text-red-500 text-sm mb-1">
                  {errorMessage.uicNumber}
                </div>
              )}
              <input
                type="text"
                name="uicNumber"
                placeholder="UIC Number"
                aria-label="UIC Number"
                className={`${inputStyle} ${
                  errorMessage.pin ? errorInputStyle : ""
                }`}
                value={formData.uicNumber}
                onChange={handleInputChange}
              />
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
                aria-label="Password"
                autoComplete="current-password"
                className={`${inputStyle} ${
                  errorMessage.pin ? errorInputStyle : ""
                }`}
                value={formData.pin}
                onChange={handleInputChange}
              />
            </div>
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
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-5">
              <p
                className="dark:text-white text-primary opacity-80 font-semibold cursor-pointer"
                onClick={handleBypass}
              >
                Bypass UIC Number
              </p>
              <div className="flex items-center mr-3">
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative cursor-pointer hover:transition-colors hover:duration-300 ease-in-out ${
                    bypassUicNumber ? "bg-gray-600" : "bg-primary"
                  }`}
                  onClick={handleBypass}
                >
                  <div
                    className={`h-6 w-6 bg-white bg-gray-400 rounded-full absolute transform hover:transition-transform hover:duration-300 ease-in-out ${
                      bypassUicNumber
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
        message={`Are you sure you want to proceed with subscribing ${formData.planName} to ${formData.uicNumber}?`}
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

export default CableSub;