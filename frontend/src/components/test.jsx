import React, { useContext, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import { useWallet } from "../context/WalletContext";
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
  const { walletData, updateWalletBalance } = useWallet();

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
      const newBalance = Number(walletData.balance) - Number(price);
      updateWalletBalance(newBalance);
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
            price: price,
            status: response.data.status,
            new_bal: newBalance

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




























import React, { useContext, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import { ProductContext } from "../context/ProductContext";

const TransactionHistory = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { authTokens } = useContext(AuthContext);
  const { api } = useContext(GeneralContext);
  const { productData } = useContext(ProductContext);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await api.get("transactions/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setTransactionHistory(response.data);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTransactionHistory();
  }, [api, authTokens.access]);

  useEffect(() => {
    let filtered = transactionHistory;

    // Filter by category
    if (category) {
      filtered = filtered.filter(
        (item) =>
          item.transaction_type?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.transaction_ref_no
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.product?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date_create).getTime();
        const start = new Date(startDate).getTime();
        return itemDate >= start;
      });
    }

    if (endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date_create).getTime();
        const end = new Date(endDate).getTime();
        return itemDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  }, [category, status, searchTerm, startDate, endDate, transactionHistory]);

  return (
    <div className="bg-bg_on h-auto bg-contain bg-no-repeat justify-center mt-[20vh] sm:bg-cover bg-center px-4 ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="min-w-[349.20px] pr-2 mx-auto">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Transaction History
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">History</span>
          </div>
        </div>
        <div className="py-2 mt-[1rem]">
          <input
            type="search"
            placeholder="Search for transaction"
            className="outline-0 text-primary hover:border-gray-400 focus:border-link dark:focus:border-link dark:hover:border-black dark:focus:border-link dark:text-white text-[.9rem] py-[0.05rem] px-2 bg-white dark:bg-[#18202F] rounded-[.5rem] border border-gray-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex pb-1 gap-2 text-[.8rem] md:text-[1rem]">
          <div className="time-interval">
            <select
              name="category"
              id="category"
              className="outline-0 text-primary hover:border-gray-400 focus:border-link dark:focus:border-link dark:hover:border-black dark:focus:border-link dark:text-white text-[.9rem] py-[0.05rem] px-2 bg-white dark:bg-[#18202F] rounded-[.5rem] border border-gray-700"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All category</option>
              {productData.map((product, index) => (
                <option key={index} value={product.category.toLowerCase()}>
                  {product.category.toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="status">
            <select
              name="status"
              id="status"
              className="outline-0 text-primary hover:border-gray-400 focus:border-link dark:focus:border-link dark:hover:border-black dark:focus:border-link dark:text-white text-[.9rem] py-[0.05rem] px-2 bg-white dark:bg-[#18202F] rounded-[.5rem] border border-gray-700"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Failed">Failed</option>
              <option value="Success">Successful</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 pt-1 pb-5">
          <input
            type="date"
            className="outline-0 text-primary hover:border-gray-400 focus:border-link dark:focus:border-link dark:hover:border-black dark:focus:border-link dark:text-white text-[.9rem] py-[0.05rem] px-2 bg-white dark:bg-[#18202F] rounded-[.5rem] border border-gray-700"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="outline-0 text-primary hover:border-gray-400 focus:border-link dark:focus:border-link dark:hover:border-black dark:focus:border-link dark:text-white text-[.9rem] py-[0.05rem] px-2 bg-white dark:bg-[#18202F] rounded-[.5rem] border border-gray-700"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center border-[0.01rem] border-gray-900 rounded-[.5rem] bg-opacity-15 shadow-lg shadow-indigo-950/10">
          <div className="overflow-x-auto custom-scrollbar overflow-y-auto h-auto max-h-[500px]">
            <table className="text-primary dark:text-white text-[.9rem] md:text-[1rem] mx-auto">
              <thead>
                <tr className="dark:bg-gray-600 bg-gray-200">
                  <th className="px-2 py-1 text-start rounded-tl-[.5rem] w-[15rem]">
                    Reference
                  </th>
                  <th className="px-2 py-1 text-start w-[15rem]">
                    Description
                  </th>
                  <th className="px-2 py-1 text-start w-[15rem]">Amount</th>
                  <th className="px-2 py-1 text-start w-[15rem]">Balance</th>
                  <th className="px-2 py-1 text-start w-[15rem]">
                    Purchase Date
                  </th>
                  <th className="px-2 py-1 text-start rounded-tr-[.5rem] w-[15rem]">
                    Transaction Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((item, index) => (
                  <tr
                    className={`transition-all duration-400 ease-in-out ${
                      index % 2 === 0
                        ? "hover:opacity-85"
                        : "bg-gray-100 dark:bg-gray-500 hover:opacity-85"
                    }`}
                    key={item.transaction_ref_no}
                  >
                    {console.log(filteredTransactions)}
                    <td className="px-2 py-[1rem]">
                      {item.transaction_ref_no}
                    </td>
                    <td className="px-2 py-[1rem]">{item.product}</td>
                    <td className="px-2 py-[1rem]">₦ {item.price}</td>
                    <td className="px-2 py-[1rem]">₦ {item.new_bal}</td>
                    <td className="px-2 py-[1rem]">
                      {item.date_create.slice(0, 10)}
                    </td>
                    <td className={`px-2 py-[1rem]`}>
                      <div
                        className={`${
                          item.status.toLowerCase() === "success"
                            ? "text-green-400 bg-primary bg-opacity-80 font-bold dark:bg-white dark:bg-opacity-20"
                            : "text-red-400 bg-primary bg-opacity-80 font-bold dark:bg-white dark:bg-opacity-20"
                        } text-center rounded-[.5rem] font-bol`}
                      >
                        {item.status.toLowerCase()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default TransactionHistory;


















import React, { useContext, useCallback, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import { useWallet } from "../context/WalletContext";
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
  const { walletData, updateWalletBalance, refreshWallet } = useWallet();

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
      setIsConfirmOpen(true);
    }
  };

  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    setLoading(true);

    function generateUniqueId(length = 16) {
      const array = new Uint8Array(length / 2);
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
    }

    try {
      // Refresh wallet and check balance
      const walletResponse = await api.get(`wallet/${user.username}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (walletResponse.data.balance < price) {
        setErrorPopupMessage("Insufficient Funds");
        setIsErrorOpen(true);
        setLoading(false);
        return; // Exit the function early if there are insufficient funds
      }

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

      // // Proceed with the transaction only if there are sufficient funds
      // const mockResponse = {
      //   data: {
      //     transid: `TRANS_${generateUniqueId()}`,
      //     status: "SUCCESS",
      //   },
      // };

      // // Simulate the delay of a real API request
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // const response = mockResponse;

      // Calculate new balance
      const newBalance = Number(walletResponse.data.balance) - price;
      const deduct = -price;
      console.log(deduct);

      // Update wallet balance
      await updateWalletBalance(newBalance, deduct);

      await api.post(
        "transactions/",
        {
          transaction_ref_no: response.data.transid,
          wallet: user.user_id,
          transaction_type: "DATA",
          product: planName,
          price: price,
          status: response.data.status,
          new_bal: newBalance,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      console.log("Transaction complete:", response);

      setSuccessMessage("Transaction successful!");
      setIsSuccessOpen(true);
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








return (
  <div className="mt-20 sm:mt-24 lg:mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-body_two">
    <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
      <div className="lg:w-1/4">
        <GeneralLeft />
      </div>

      <div className="lg:w-1/2 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-primary dark:text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Available Balance</h2>
            <Link
              to="/user/dashboard/transactions"
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300"
            >
              <span className="mr-2">Transaction History</span>
              <FaAngleRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold">
              ₦{" "}
              {walletData &&
                Number(walletData.balance).toFixed(2).toLocaleString()}
            </p>
            <button
              onClick={handleOpenModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              + Fund Wallet
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-primary dark:text-white">
          <p className="mb-4">
            Create shortcuts for frequent activities or transfer atom credit
            to other users with their phone number.
          </p>
          <div className="flex justify-between">
            <button className="bg-blue-500 hover bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Create Shortcut
            </button>
            <button className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              Transfer Credit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {productData.map((item) => (
            <Link
              key={item.id}
              to={`/user/dashboard/services/${item.category.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.name}
                className="h-12 w-12 object-contain mb-2"
              />
              <p className="text-sm text-center text-primary dark:text-white">
                {item.category}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-primary dark:bg-white text-white dark:text-primary font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
            Get Premium Service
          </button>
        </div>
      </div>

      <div className="lg:w-1/4">
        <GeneralRight />
      </div>
    </div>

    {isModalOpen && <FundWalletModal onClose={handleCloseModal} />}
  </div>
);














import axios from "axios";
import { ProductContext } from "../context/ProductContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { useState, React, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import { AuthContext } from "../context/AuthenticationContext";
import SubmitButton from "./SubmitButton";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";

const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white sm:w-[40vw] transition duration-450 ease-in-out mb-3 w-full text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const Airtime = () => {
  const { api, detectNetwork, setLoading } = useContext(GeneralContext);
  const { airtimeNetworks } = useContext(ProductContext);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [airtimeTypes, setAirtimeTypes] = useState([]);
  const [selectedAirtimeType, setSelecedAirtimeType] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");
  const [networkId, setNetworkId] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [networkMessage, setNetworkMessage] = useState(""); // State for the network message
  const { user, authTokens } = useContext(AuthContext);
  const { walletData, updateWalletBalance } = useWallet();

  const handleNetworkChange = (e) => {
    const selectedNetworkName = e.target.value;
    const selectedNetworkObj = airtimeNetworks.find(
      (network) => network.network === selectedNetworkName
    );

    if (selectedNetworkObj) {
      setSelectedNetwork(selectedNetworkName);
      setNetworkId(selectedNetworkObj.network_id); // Set the network_id
    }
  };

  const handleSelectedAirtimeTypeChange = (e) => {
    setSelecedAirtimeType(e.target.value);
  };

  useEffect(() => {
    if (selectedNetwork) {
      api
        .get(`airtime/airtime-type/${selectedNetwork}/`)
        .then((response) => setAirtimeTypes(response.data))
        .catch((error) => console.error("Error fetching plan types:", error));
    }
  }, [selectedNetwork]);

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
        amount: amount,
        plan_type: selectedAirtimeType.toUpperCase(),
        bypass: bypassPhoneNumber,
        "request-id": `Airtime_${generateUniqueId()}`,
      };
      const response = await axios.post(
        "https://kusosub.com/api/topup/",
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
      const newBalance = Number(walletData.balance) - amount;
      updateWalletBalance(newBalance);

      axios
        .api(
          "transactions/",
          {
            transaction_ref_no: response.data.transid,
            wallet: user.user_id,
            transaction_type: "AIRTIME",
            product: `${amount} ${selectedNetwork} airtime`,
            price: amount,
            status: response.data.status,
            new_bal: newBalance
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

      setSuccessMessage("Transaction successful!");
      setIsSuccessOpen(true);
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
    <div className="bg-bg_on h-auto bg-contain bg-no-repeat mt-[20vh] justify-center sm:bg-cover bg-center px-4 ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem] font-body_two">
      <GeneralLeft />
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
                name="network"
                aria-label="Network"
                className={`${selectStyle}`}
                value={selectedNetwork}
                onChange={handleNetworkChange}
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
            </div>
            <div>
              <select
                name="planType"
                aria-label="Plan Type"
                className={`${selectStyle}`}
                value={selectedAirtimeType}
                onChange={handleSelectedAirtimeTypeChange}
                disabled={
                  !selectedNetwork ||
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
                className={`${inputStyle}`}
              />
              {networkMessage && (
                <p
                  className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: networkMessage }}
                />
              )}
            </div>
            <div>
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                className={`${inputStyle}`}
                onChange={(e) => setAmount(e.target.value)}
              />
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
                className={`${inputStyle}`}
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
        message={`Are you sure you want to proceed with transfering ₦${amount} airtime to ${phone}?`}
      />

      {/* Render Error Popup */}
      <ErrorPopup
        isOpen={isErrorOpen}
        message={errorPopupMessage}
        onClose={handleErrorClose}
      />
      <SuccessPopup
        isOpen={isSuccessOpen}
        message={successMessage}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
};

export default Airtime;
