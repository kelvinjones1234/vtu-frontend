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
