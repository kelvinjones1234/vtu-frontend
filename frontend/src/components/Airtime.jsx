// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useProduct } from "../context/ProductContext";
// import { useAuth } from "../context/AuthenticationContext";
// import { useGeneral } from "../context/GeneralContext";
// import GeneralLeft from "./GeneralLeft";
// import GeneralRight from "./GeneralRight";
// import { Link } from "react-router-dom";
// import SubmitButton from "./SubmitButton";
// import ConfirmationPopup from "./ConfirmationPopup";
// import ErrorPopup from "./ErrorPopup";
// import SuccessPopup from "./SuccessPopup";
// import { useTransactionSubmit } from "./UserTransactionSubmit";
// import FloatingLabelInput from "./FloatingLabelInput";
// import FloatingLabelSelect from "./FloatingLabelSelect";

// // Styles
// const selectStyle =
//   "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

// const inputStyle =
//   "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

// const errorInputStyle = "border-red-500 dark:border-red-700";

// // Main Component
// const Airtime = ({ showSidebars = true, showStyle = true }) => {
//   const { airtimeNetworks, handleSave } = useProduct();
//   const { user } = useAuth();
//   const { api, detectNetwork } = useGeneral();

//   // State Management
//   const [airtimeFormData, setAirtimeFormData] = useState({
//     selectedNetwork: "",
//     selectedAirtimeType: "",
//     phone: "",
//     pin: "",
//     amount: "",
//     networkId: "",
//     api: "",
//     title: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [airtimeTypes, setAirtimeTypes] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
//   const [networkMessage, setNetworkMessage] = useState("");

//   const [popupState, setPopupState] = useState({
//     isConfirmOpen: false,
//     isErrorOpen: false,
//     isSuccessOpen: false,
//     successMessage: "",
//     errorPopupMessage: "",
//   });

//   // Handlers
//   const handleInputChange = useCallback(
//     (e) => {
//       const { name, value } = e.target;
//       setAirtimeFormData((prev) => {
//         const updatedFormData = { ...prev, [name]: value };

//         if (name === "phone") {
//           const detectedNetwork = detectNetwork(value);
//           setNetworkMessage(
//             value
//               ? `Detected Network: ${detectedNetwork} <br /> NB: Ignore this for Ported Numbers`
//               : ""
//           );
//         }

//         if (name === "selectedNetwork") {
//           const selectedNetworkObj = airtimeNetworks.find(
//             (network) => network.network === value
//           );
//           if (selectedNetworkObj) {
//             updatedFormData.networkId = selectedNetworkObj.network_id;
//           }
//         }

//         return updatedFormData;
//       });

//       setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error
//     },
//     [airtimeNetworks, detectNetwork]
//   );

//   const handleBypass = useCallback(
//     () => setBypassPhoneNumber((prev) => !prev),
//     []
//   );

//   // Fetch Airtime Types
//   useEffect(() => {
//     if (airtimeFormData.selectedNetwork) {
//       api
//         .get(`airtime/airtime-type/${airtimeFormData.selectedNetwork}/`)
//         .then((response) => {
//           setAirtimeTypes(response.data);

//           if (response.data.length > 0) {
//             setAirtimeFormData((prev) => ({
//               ...prev,
//               api: response.data[0]?.api || "",
//             }));
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching airtime types:", error);
//           setPopupState((prev) => ({
//             ...prev,
//             errorPopupMessage:
//               "Failed to fetch airtime types. Please try again.",
//             isErrorOpen: true,
//           }));
//         });
//     }
//   }, [airtimeFormData.selectedNetwork, api]);

//   // Form Validation
//   const validInputs = useCallback(() => {
//     const newErrors = {};
//     if (!airtimeFormData.selectedNetwork)
//       newErrors.selectedNetwork = "Please select a network";
//     if (!showStyle && !airtimeFormData.title)
//       newErrors.title = "Shortcut must be saved with a title";
//     if (!airtimeFormData.selectedAirtimeType)
//       newErrors.selectedAirtimeType = "Please select an airtime type";
//     if (!airtimeFormData.phone) newErrors.phone = "A phone number is required";
//     else if (!/^\d+$/.test(airtimeFormData.phone))
//       newErrors.phone = "Phone number must contain only digits";
//     else if (airtimeFormData.phone.length !== 11)
//       newErrors.phone = "Enter a valid 11-digit phone number";
//     if (!airtimeFormData.amount) newErrors.amount = "Please enter an amount";
//     if (!airtimeFormData.pin) newErrors.pin = "PIN is required";
//     else if (airtimeFormData.pin !== user.user.transaction_pin)
//       newErrors.pin = "Incorrect PIN";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [airtimeFormData, showStyle, user]);

//   // Transaction Form Data
//   const transactionFormData = useMemo(
//     () => ({
//       selectedNetwork: airtimeFormData.selectedNetwork,
//       selectedAirtimeType: airtimeFormData.selectedAirtimeType,
//       phone: airtimeFormData.phone,
//       pin: airtimeFormData.pin,
//       amount: airtimeFormData.amount,
//       networkId: airtimeFormData.networkId,
//       api_name: airtimeFormData.api?.api_name || "",
//       url: airtimeFormData.api?.api_url || "",
//       title: airtimeFormData.title,
//     }),
//     [airtimeFormData]
//   );

//   // Transaction Submission
//   const { handleSubmit, handleConfirm } = useTransactionSubmit({
//     validInputs,
//     setPopupState,
//     setLoading,
//     productType: "airtime",
//     formData: transactionFormData,
//     bypassPhoneNumber,
//   });

//   // Popup Handlers
//   const handleCancel = useCallback(
//     () => setPopupState((prev) => ({ ...prev, isConfirmOpen: false })),
//     []
//   );
//   const handleErrorClose = useCallback(
//     () => setPopupState((prev) => ({ ...prev, isErrorOpen: false })),
//     []
//   );
//   const handleSuccessClose = useCallback(
//     () => setPopupState((prev) => ({ ...prev, isSuccessOpen: false })),
//     []
//   );

//   // Memoized Components
//   const memoizedGeneralLeft = useMemo(() => <GeneralLeft />, []);
//   const memoizedGeneralRight = useMemo(() => <GeneralRight />, []);

//   return (
//     <div
//       className={`${
//         showStyle &&
//         "pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]"
//       }`}
//     >
//       {showSidebars && memoizedGeneralLeft}
//       <div className="mx-auto w-full max-w-[800px]">
//         {showStyle && (
//           <div>
//             <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] mb-4">
//               Buy Airtime
//             </h2>
//             <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
//               <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
//               <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
//               <span className="text-gray-500">Airtime</span>
//             </div>
//           </div>
//         )}

//         <div
//           className={`${
//             showStyle &&
//             "bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6"
//           }`}
//         >
//           <form
//             onSubmit={
//               showStyle
//                 ? handleSubmit
//                 : (e) => handleSave(e, transactionFormData, validInputs)
//             }
//           >
//             {!showStyle && (
//               <FloatingLabelInput
//                 type="text"
//                 name="title"
//                 placeholder="Shortcut Name"
//                 aria-label="Title"
//                 value={airtimeFormData.title}
//                 onChange={handleInputChange}
//                 className={`${inputStyle}`}
//                 error={errors.title}
//               />
//             )}

//             <FloatingLabelSelect
//               name="selectedNetwork"
//               placeholder="Network"
//               value={airtimeFormData.selectedNetwork}
//               onChange={handleInputChange}
//               error={errors.selectedNetwork}
//               options={airtimeNetworks.map((item) => ({
//                 value: item.network,
//                 label: item.network,
//               }))}
//             />

//             <FloatingLabelSelect
//               name="selectedAirtimeType"
//               placeholder="Plan Type"
//               value={airtimeFormData.selectedAirtimeType}
//               onChange={handleInputChange}
//               error={errors.selectedAirtimeType}
//               disabled={!airtimeFormData.selectedNetwork}
//               options={airtimeTypes.map((item) => ({
//                 value: item.airtime_type,
//                 label: item.airtime_type,
//               }))}
//             />

//             <FloatingLabelInput
//               type="text"
//               name="phone"
//               placeholder="Phone Number"
//               aria-label="Phone number"
//               disabled={!airtimeFormData.selectedAirtimeType}
//               value={airtimeFormData.phone}
//               onChange={handleInputChange}
//               className={`${inputStyle}`}
//               error={errors.phone}
//             />
//             {networkMessage && (
//               <p
//                 className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
//                 dangerouslySetInnerHTML={{ __html: networkMessage }}
//               />
//             )}

//             <FloatingLabelInput
//               type="text"
//               name="amount"
//               placeholder="Amount"
//               disabled={!airtimeFormData.phone}
//               aria-label="Amount"
//               value={airtimeFormData.amount}
//               onChange={handleInputChange}
//               className={`${inputStyle}`}
//               error={errors.amount}
//             />

//             <FloatingLabelInput
//               type="password"
//               name="pin"
//               placeholder="Pin"
//               disabled={!airtimeFormData.amount}
//               aria-label="Pin"
//               autoComplete="current-password"
//               value={airtimeFormData.pin}
//               onChange={handleInputChange}
//               className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
//               error={errors.pin}
//             />

//             <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3">
//               <p
//                 className="dark:text-white text-primary opacity-80 font-semibold cursor-pointer"
//                 onClick={handleBypass}
//               >
//                 Bypass Phone Number
//               </p>
//               <div
//                 className="flex items-center mr-3 cursor-pointer"
//                 onClick={handleBypass}
//               >
//                 <div
//                   className={`h-5 w-10 rounded-full flex items-center relative transition-colors duration-300 ease-in-out ${
//                     bypassPhoneNumber ? "bg-[#1CCEFF]" : "bg-gray-600"
//                   }`}
//                 >
//                   <div
//                     className={`h-6 w-6 bg-white border rounded-full absolute transform transition-transform duration-300 ease-in-out ${
//                       bypassPhoneNumber
//                         ? "translate-x-5"
//                         : "translate-x-[-0.1rem]"
//                     }`}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <SubmitButton
//               label={`${showStyle ? "Purchase" : "Save"}`}
//               loading={loading}
//             />
//           </form>
//         </div>
//       </div>
//       {showSidebars && memoizedGeneralRight}

//       <ConfirmationPopup
//         isOpen={popupState.isConfirmOpen}
//         onConfirm={handleConfirm}
//         onCancel={handleCancel}
//         message={`Are you sure you want to proceed with transferring ₦${airtimeFormData.amount} airtime to ${airtimeFormData.phone}?`}
//       />

//       <ErrorPopup
//         isOpen={popupState.isErrorOpen}
//         message={popupState.errorPopupMessage}
//         onClose={handleErrorClose}
//       />

//       <SuccessPopup
//         isOpen={popupState.isSuccessOpen}
//         message={popupState.successMessage}
//         onClose={handleSuccessClose}
//       />
//     </div>
//   );
// };

// export default Airtime;



import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useProduct } from "../context/ProductContext";
import { useAuth } from "../context/AuthenticationContext";
import { useGeneral } from "../context/GeneralContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useTransactionSubmit } from "./UserTransactionSubmit";
import FloatingLabelInput from "./FloatingLabelInput";
import FloatingLabelSelect from "./FloatingLabelSelect";

// Main Component
const Airtime = ({ showSidebars = true, showStyle = true }) => {
  const { airtimeNetworks, handleSave } = useProduct();
  const { user } = useAuth();
  const { api, detectNetwork } = useGeneral();

  // State Management
  const [airtimeFormData, setAirtimeFormData] = useState({
    selectedNetwork: "",
    selectedAirtimeType: "",
    phone: "",
    pin: "",
    amount: "",
    networkId: "",
    api: "",
    title: "",
  });

  const [loading, setLoading] = useState(false);
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

  // Handlers
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      
      setAirtimeFormData((prev) => {
        const updatedFormData = { ...prev, [name]: value };

        // Handle network detection for phone input
        if (name === "phone" && value) {
          const detectedNetwork = detectNetwork(value);
          setNetworkMessage(
            `Detected Network: ${detectedNetwork} <br /> NB: Ignore this for Ported Numbers`
          );
        } else if (name === "phone" && !value) {
          setNetworkMessage("");
        }

        // Update networkId when network is selected
        if (name === "selectedNetwork") {
          const selectedNetworkObj = airtimeNetworks.find(
            (network) => network.network === value
          );
          if (selectedNetworkObj) {
            updatedFormData.networkId = selectedNetworkObj.network_id;
          }
        }

        return updatedFormData;
      });

      // Clear error for the changed field
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [airtimeNetworks, detectNetwork]
  );

  const handleBypass = useCallback(() => setBypassPhoneNumber(prev => !prev), []);

  // Fetch Airtime Types when network changes
  useEffect(() => {
    if (!airtimeFormData.selectedNetwork) return;
    
    api
      .get(`airtime/airtime-type/${airtimeFormData.selectedNetwork}/`)
      .then((response) => {
        setAirtimeTypes(response.data);

        // Set first airtime type API if available
        if (response.data.length > 0) {
          setAirtimeFormData((prev) => ({
            ...prev,
            api: response.data[0]?.api || "",
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching airtime types:", error);
        setPopupState({
          ...popupState,
          errorPopupMessage: "Failed to fetch airtime types. Please try again.",
          isErrorOpen: true,
        });
      });
  }, [airtimeFormData.selectedNetwork, api]);

  // Form Validation
  const validInputs = useCallback(() => {
    const newErrors = {};
    
    // Required field validations
    if (!airtimeFormData.selectedNetwork) newErrors.selectedNetwork = "Please select a network";
    if (!showStyle && !airtimeFormData.title) newErrors.title = "Shortcut must be saved with a title";
    if (!airtimeFormData.selectedAirtimeType) newErrors.selectedAirtimeType = "Please select an airtime type";
    
    // Phone validation
    if (!airtimeFormData.phone) {
      newErrors.phone = "A phone number is required";
    } else if (!/^\d+$/.test(airtimeFormData.phone)) {
      newErrors.phone = "Phone number must contain only digits";
    } else if (airtimeFormData.phone.length !== 11) {
      newErrors.phone = "Enter a valid 11-digit phone number";
    }
    
    // Amount and PIN validations
    if (!airtimeFormData.amount) newErrors.amount = "Please enter an amount";
    if (!airtimeFormData.pin) {
      newErrors.pin = "PIN is required";
    } else if (airtimeFormData.pin !== user.user.transaction_pin) {
      newErrors.pin = "Incorrect PIN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [airtimeFormData, showStyle, user]);

  // Transaction Form Data
  const transactionFormData = useMemo(
    () => ({
      selectedNetwork: airtimeFormData.selectedNetwork,
      selectedAirtimeType: airtimeFormData.selectedAirtimeType,
      phone: airtimeFormData.phone,
      pin: airtimeFormData.pin,
      amount: airtimeFormData.amount,
      networkId: airtimeFormData.networkId,
      api_name: airtimeFormData.api?.api_name || "",
      url: airtimeFormData.api?.api_url || "",
      title: airtimeFormData.title,
    }),
    [airtimeFormData]
  );

  // Transaction Submission
  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    setLoading,
    productType: "airtime",
    formData: transactionFormData,
    bypassPhoneNumber,
  });

  // Popup Handlers
  const closePopups = useCallback((type) => {
    setPopupState(prev => ({
      ...prev,
      [type]: false
    }));
  }, []);

  // Memoized Sidebar Components
  const memoizedSidebars = useMemo(() => ({
    left: <GeneralLeft />,
    right: <GeneralRight />
  }), []);

  // Form submission handler
  const onFormSubmit = showStyle 
    ? handleSubmit 
    : (e) => handleSave(e, transactionFormData, validInputs);

  return (
    <div className={`${showStyle ? "pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]" : ""}`}>
      {showSidebars && memoizedSidebars.left}
      
      <div className="mx-auto w-full max-w-[800px]">
        {showStyle && (
          <div>
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] mb-4">
              Buy Airtime
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to="/user/dashboard">Dashboard</Link>
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Airtime</span>
            </div>
          </div>
        )}

        <div className={showStyle ? "bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6" : ""}>
          <form onSubmit={onFormSubmit}>
            {/* Shortcut Name Input (only when not showing style) */}
            {!showStyle && (
              <FloatingLabelInput
                type="text"
                name="title"
                placeholder="Shortcut Name"
                value={airtimeFormData.title}
                onChange={handleInputChange}
                error={errors.title}
              />
            )}

            {/* Network Selection */}
            <FloatingLabelSelect
              name="selectedNetwork"
              placeholder="Network"
              value={airtimeFormData.selectedNetwork}
              onChange={handleInputChange}
              error={errors.selectedNetwork}
              options={airtimeNetworks.map(item => ({
                value: item.network,
                label: item.network,
              }))}
            />

            {/* Airtime Type Selection */}
            <FloatingLabelSelect
              name="selectedAirtimeType"
              placeholder="Plan Type"
              value={airtimeFormData.selectedAirtimeType}
              onChange={handleInputChange}
              error={errors.selectedAirtimeType}
              disabled={!airtimeFormData.selectedNetwork}
              options={airtimeTypes.map(item => ({
                value: item.airtime_type,
                label: item.airtime_type,
              }))}
            />

            {/* Phone Number Input */}
            <FloatingLabelInput
              type="text"
              name="phone"
              placeholder="Phone Number"
              disabled={!airtimeFormData.selectedAirtimeType}
              value={airtimeFormData.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            
            {/* Network Message */}
            {networkMessage && (
              <p
                className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
                dangerouslySetInnerHTML={{ __html: networkMessage }}
              />
            )}

            {/* Amount Input */}
            <FloatingLabelInput
              type="text"
              name="amount"
              placeholder="Amount"
              disabled={!airtimeFormData.phone}
              value={airtimeFormData.amount}
              onChange={handleInputChange}
              error={errors.amount}
            />

            {/* PIN Input */}
            <FloatingLabelInput
              type="password"
              name="pin"
              placeholder="Pin"
              disabled={!airtimeFormData.amount}
              autoComplete="current-password"
              value={airtimeFormData.pin}
              onChange={handleInputChange}
              error={errors.pin}
            />

            {/* Bypass Phone Number Toggle */}
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3">
              <p
                className="dark:text-white text-primary opacity-80 font-semibold cursor-pointer"
                onClick={handleBypass}
              >
                Bypass Phone Number
              </p>
              <div className="flex items-center mr-3 cursor-pointer" onClick={handleBypass}>
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative transition-colors duration-300 ease-in-out ${
                    bypassPhoneNumber ? "bg-[#1CCEFF]" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`h-6 w-6 bg-white border rounded-full absolute transform transition-transform duration-300 ease-in-out ${
                      bypassPhoneNumber ? "translate-x-5" : "translate-x-[-0.1rem]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <SubmitButton label={showStyle ? "Purchase" : "Save"} loading={loading} />
          </form>
        </div>
      </div>
      
      {showSidebars && memoizedSidebars.right}

      {/* Popups */}
      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={() => closePopups('isConfirmOpen')}
        message={`Are you sure you want to proceed with transferring ₦${airtimeFormData.amount} airtime to ${airtimeFormData.phone}?`}
      />

      <ErrorPopup
        isOpen={popupState.isErrorOpen}
        message={popupState.errorPopupMessage}
        onClose={() => closePopups('isErrorOpen')}
      />

      <SuccessPopup
        isOpen={popupState.isSuccessOpen}
        message={popupState.successMessage}
        onClose={() => closePopups('isSuccessOpen')}
      />
    </div>
  );
};

export default Airtime;
