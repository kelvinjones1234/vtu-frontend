// import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import GeneralLeft from "./GeneralLeft";
// import GeneralRight from "./GeneralRight";
// import { ProductContext } from "../context/ProductContext";
// import { GeneralContext } from "../context/GeneralContext";
// import { AuthContext } from "../context/AuthenticationContext";
// import SubmitButton from "./SubmitButton";
// import ConfirmationPopup from "./ConfirmationPopup";
// import ErrorPopup from "./ErrorPopup";
// import SuccessPopup from "./SuccessPopup";
// import { useTransactionSubmit } from "./UserTransactionSubmit";
// import FloatingLabelInput from "./FloatingLabelInput";
// import FloatingLabelSelect from "./FloatingLabelSelect";

// const selectStyle =
//   "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

// const inputStyle =
//   "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

// const errorInputStyle = "border-red-500 dark:border-red-700";

// const Data = () => {
//   const { dataNetworks } = useContext(ProductContext);
//   const { api, detectNetwork } = useContext(GeneralContext);
//   const { user } = useContext(AuthContext);

//   const [formData, setFormData] = useState({
//     selectedNetwork: "",
//     selectedPlanType: "",
//     selectedDataPlan: "",
//     selectedDataPlanId: "",
//     networkId: "",
//     planName: "",
//     phone: "",
//     pin: "",
//     price: "",
//     url: "",
//     api_name: "",
//   });

//   const [planTypes, setPlanTypes] = useState([]);
//   const [dataPlans, setDataPlans] = useState([]);
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

//   console.log("FORM DATA", formData);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when the input changes

//     if (name === "phone") {
//       handlePhoneChange(value);
//     } else if (name === "selectedNetwork") {
//       handleNetworkChange(value);
//     } else if (name === "selectedPlanType") {
//       handlePlanTypeChange(value);
//     } else if (name === "selectedDataPlan") {
//       handleDataPlanChange(value);
//     }
//   };

//   const handlePhoneChange = (inputPhone) => {
//     if (inputPhone.length === 11) {
//       const detectedNetwork = detectNetwork(inputPhone);
//       setNetworkMessage(
//         detectedNetwork !== "Unknown Network"
//           ? `Detected Network: ${detectedNetwork} <br /> NB: Ignore this for Ported Numbers`
//           : `Unable to identify network <br /> NB: Ignore this for Ported Numbers`
//       );
//     } else {
//       setNetworkMessage("");
//     }
//   };

//   const handleNetworkChange = (selectedNetworkName) => {
//     const selectedNetworkObj = dataNetworks.find(
//       (network) => network.network === selectedNetworkName
//     );
//     if (selectedNetworkObj) {
//       setFormData((prev) => ({
//         ...prev,
//         selectedNetwork: selectedNetworkName,
//         networkId: selectedNetworkObj.network_id,
//         selectedPlanType: "",
//         selectedDataPlan: "",
//         price: "",
//       }));
//       setPlanTypes([]);
//       setDataPlans([]);
//     }
//   };

//   const handlePlanTypeChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedPlanType: value,
//       selectedDataPlan: "",
//       price: "",
//     }));
//     setDataPlans([]);
//   };

//   const handleDataPlanChange = (value) => {
//     const selected = parseInt(value, 10);
//     const selectedPlan = dataPlans.find(
//       (plan) => plan.id === selected || plan.plan_id === selected
//     );
//     if (selectedPlan) {
//       setFormData((prev) => ({
//         ...prev,
//         selectedDataPlanId: selectedPlan.plan_id,
//         selectedDataPlan: selectedPlan.id,
//         planName: selectedPlan.data_plan,
//         price: selectedPlan.price,
//         url: selectedPlan.api.api_url,
//         api_name: selectedPlan.api.api_name,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         selectedDataPlanId: "",
//         selectedDataPlan: "",
//         price: "",
//       }));
//     }
//   };

//   useEffect(() => {
//     if (formData.selectedNetwork) {
//       api
//         .get(`data/plan-type/${formData.selectedNetwork}/`)
//         .then((response) => setPlanTypes(response.data))
//         .catch((error) => console.error("Error fetching plan types:", error));
//     }
//   }, [formData.selectedNetwork, api]);

//   useEffect(() => {
//     if (formData.selectedPlanType && formData.selectedNetwork) {
//       api
//         .get(
//           `data/plans/${formData.selectedNetwork}/${formData.selectedPlanType}/`
//         )
//         .then((response) => setDataPlans(response.data))
//         .catch((error) => console.error("Error fetching data plans:", error));
//     }
//   }, [formData.selectedPlanType, formData.selectedNetwork, api]);

//   const validInputs = () => {
//     const newErrors = {};
//     if (!formData.selectedNetwork) {
//       newErrors.selectedNetwork = "Please select a network";
//     }
//     if (!formData.selectedPlanType) {
//       newErrors.selectedPlanType = "Please select a plan type";
//     }
//     if (!formData.selectedDataPlan) {
//       newErrors.selectedDataPlan = "Please select a data plan";
//     }
//     if (!formData.phone) {
//       newErrors.phone = "A phone number is required";
//     } else if (!/^\d+$/.test(formData.phone)) {
//       newErrors.phone = "Phone number must contain only digits";
//     } else if (formData.phone.length !== 11) {
//       newErrors.phone = "Enter a valid 11-digit phone number";
//     }
//     if (!formData.pin) {
//       newErrors.pin = "PIN is required";
//     } else if (formData.pin !== user.transaction_pin) {
//       newErrors.pin = "Incorrect PIN";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const generateUniqueId = (length = 16) => {
//     const array = new Uint8Array(length / 2);
//     window.crypto.getRandomValues(array);
//     return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
//       ""
//     );
//   };

//   const productType = "data";

//   const { handleSubmit, handleConfirm } = useTransactionSubmit({
//     validInputs,
//     setPopupState,
//     generateUniqueId,
//     productType,
//     formData,
//     bypassPhoneNumber,
//   });

//   const handleCancel = () =>
//     setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
//   const handleErrorClose = () =>
//     setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
//   const handleBypass = () => setBypassPhoneNumber((prev) => !prev);

//   return (
//     <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
//       <GeneralLeft />
//       <div className="mx-auto w-full max-w-[800px]">
//         <div>
//           <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] md:text-3xl mb-4">
//             Buy Data
//           </h2>
//           <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
//             <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
//             <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
//             <span className="text-gray-500">Data</span>
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6">
//           <form onSubmit={handleSubmit}>
//             {/* Network Selection */}
//             <FloatingLabelSelect
//               name="selectedNetwork"
//               placeholder="Network"
//               value={formData.selectedNetwork}
//               onChange={handleInputChange}
//               error={errors.selectedNetwork}
//               disabled={false}
//               options={dataNetworks.map((item) => ({
//                 value: item.network,
//                 label: item.network.toUpperCase(),
//               }))}
//             />

//             {/* Plan Type Selection */}
//             <FloatingLabelSelect
//               name="selectedPlanType"
//               placeholder="Plan Type"
//               value={formData.selectedPlanType}
//               onChange={handleInputChange}
//               error={errors.selectedPlanType}
//               disabled={
//                 !formData.selectedNetwork ||
//                 !planTypes.some((type) => type.is_active)
//               }
//               options={planTypes.map((type) => ({
//                 value: type.id,
//                 label: type.plan_type.toUpperCase(),
//                 disabled: !type.is_active,
//               }))}
//             />

//             {/* Data Plan Selection */}
//             <FloatingLabelSelect
//               name="selectedDataPlan"
//               placeholder="Data Plan"
//               value={formData.selectedDataPlan}
//               onChange={handleInputChange}
//               error={errors.selectedDataPlan}
//               disabled={!formData.selectedPlanType}
//               options={dataPlans.map((item) => ({
//                 value: item.id,
//                 label: item.data_plan,
//               }))}
//             />

//             {/* Phone Number Input */}
//             <div>
//               {/* {errors.phone && (
//                 <p className="text-red-500 text-sm mb-1">{errors.phone}</p>
//               )} */}
//               <FloatingLabelInput
//                 type="text"
//                 name="phone"
//                 placeholder="Phone Number"
//                 aria-label="Phone number"
//                 disabled={!formData.selectedDataPlan}
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 error={errors.phone}
//               />
//               {networkMessage && (
//                 <p
//                   className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
//                   dangerouslySetInnerHTML={{ __html: networkMessage }}
//                 />
//               )}
//             </div>

//             {/* PIN Input */}
//             <div>
//               {/* {errors.pin && (
//                 <p className="text-red-500 text-sm mb-1">{errors.pin}</p>
//               )} */}
//               <FloatingLabelInput
//                 type="password"
//                 name="pin"
//                 placeholder="Pin"
//                 disabled={!formData.phone}
//                 aria-label="Pin"
//                 autoComplete="current-password"
//                 value={formData.pin}
//                 onChange={handleInputChange}
//                 error={errors.pin}
//               />
//             </div>

//             {/* Price Display */}
//             {formData.price && (
//               <FloatingLabelInput
//                 type="text"
//                 disabled
//                 name="price"
//                 placeholder="Price"
//                 value={`₦${formData.price}`}
//               />
//             )}

//             {/* Bypass Phone Number Toggle */}
//             <div
//               className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3"
//               // Make the entire div clickable
//             >
//               <p className="dark:text-white text-primary opacity-80 font-semibold">
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

//             {/* Submit Button */}
//             <div>
//               <SubmitButton label="Purchase" />
//             </div>
//           </form>
//         </div>
//       </div>
//       <GeneralRight />

//       {/* Confirmation Popup */}
//       <ConfirmationPopup
//         isOpen={popupState.isConfirmOpen}
//         onConfirm={handleConfirm}
//         onCancel={handleCancel}
//         message={`Are you sure you want to proceed with transferring ${formData.planName} to ${formData.phone}?`}
//       />

//       {/* Error Popup */}
//       <ErrorPopup
//         isOpen={popupState.isErrorOpen}
//         message={popupState.errorPopupMessage}
//         onClose={handleErrorClose}
//       />

//       {/* Success Popup */}
//       <SuccessPopup
//         isOpen={popupState.isSuccessOpen}
//         message={popupState.successMessage}
//         onClose={() =>
//           setPopupState((prev) => ({ ...prev, isSuccessOpen: false }))
//         }
//       />
//     </div>
//   );
// };

// export default Data;

import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import SubmitButton from "./SubmitButton";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useTransactionSubmit } from "./UserTransactionSubmit";
import FloatingLabelInput from "./FloatingLabelInput";
import FloatingLabelSelect from "./FloatingLabelSelect";
import { useAuth } from '../context/AuthenticationContext';
import { useGeneral } from '../context/GeneralContext';
import { useProduct } from '../context/ProductContext';

// Network Selection Component
const NetworkSelector = React.memo(
  ({ selectedNetwork, networks, onChange, error }) => {
    const options = useMemo(
      () =>
        networks.map((item) => ({
          value: item.network,
          label: item.network.toUpperCase(),
        })),
      [networks]
    );

    return (
      <FloatingLabelSelect
        name="selectedNetwork"
        placeholder="Network"
        value={selectedNetwork}
        onChange={onChange}
        error={error}
        disabled={false}
        options={options}
      />
    );
  }
);

// Plan Type Selection Component
const PlanTypeSelector = React.memo(
  ({ selectedPlanType, planTypes, onChange, error, disabled }) => {
    const options = useMemo(
      () =>
        planTypes.map((type) => ({
          value: type.id,
          label: type.plan_type.toUpperCase(),
          disabled: !type.is_active,
        })),
      [planTypes]
    );

    return (
      <FloatingLabelSelect
        name="selectedPlanType"
        placeholder="Plan Type"
        value={selectedPlanType}
        onChange={onChange}
        error={error}
        disabled={disabled || !planTypes.some((type) => type.is_active)}
        options={options}
      />
    );
  }
);

// Data Plan Selection Component
const DataPlanSelector = React.memo(
  ({ selectedDataPlan, dataPlans, onChange, error, disabled }) => {
    const options = useMemo(
      () =>
        dataPlans.map((item) => ({
          value: item.id,
          label: item.data_plan,
        })),
      [dataPlans]
    );

    return (
      <FloatingLabelSelect
        name="selectedDataPlan"
        placeholder="Data Plan"
        value={selectedDataPlan}
        onChange={onChange}
        error={error}
        disabled={disabled}
        options={options}
      />
    );
  }
);

// Phone Input Component
const PhoneInput = React.memo(
  ({ phone, onChange, error, disabled, networkMessage }) => {
    return (
      <div>
        <FloatingLabelInput
          type="text"
          name="phone"
          placeholder="Phone Number"
          aria-label="Phone number"
          disabled={disabled}
          value={phone}
          onChange={onChange}
          error={error}
        />
        {networkMessage && (
          <p
            className="text-sm ml-2 mb-4 italic font-bold text-gray-600 dark:text-white"
            dangerouslySetInnerHTML={{ __html: networkMessage }}
          />
        )}
      </div>
    );
  }
);

// PIN Input Component
const PinInput = React.memo(({ pin, onChange, error, disabled }) => {
  return (
    <div>
      <FloatingLabelInput
        type="password"
        name="pin"
        placeholder="Pin"
        disabled={disabled}
        aria-label="Pin"
        autoComplete="current-password"
        value={pin}
        onChange={onChange}
        error={error}
      />
    </div>
  );
});

// BypassToggle Component
const BypassToggle = React.memo(({ bypassPhoneNumber, onToggle }) => {
  return (
    <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-3">
      <p className="dark:text-white text-primary opacity-80 font-semibold">
        Bypass Phone Number
      </p>
      <div className="flex items-center mr-3 cursor-pointer" onClick={onToggle}>
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
  );
});

// Main Data Component
const Data = () => {
  const { dataNetworks } = useProduct();
  const { api, detectNetwork } = useGeneral();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    selectedNetwork: "",
    selectedPlanType: "",
    selectedDataPlan: "",
    phone: "",
    pin: "",
  });

  // UI state
  const [planTypes, setPlanTypes] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [networkMessage, setNetworkMessage] = useState("");
  const [isLoading, setIsLoading] = useState({
    planTypes: false,
    dataPlans: false,
  });

  // Popup state
  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  // Derived values from formData and API responses
  const selectedNetwork = useMemo(
    () =>
      dataNetworks.find(
        (network) => network.network === formData.selectedNetwork
      ),
    [dataNetworks, formData.selectedNetwork]
  );

  const selectedPlan = useMemo(
    () =>
      dataPlans.find(
        (plan) => plan.id === parseInt(formData.selectedDataPlan, 10)
      ),
    [dataPlans, formData.selectedDataPlan]
  );

  // Memoized form values for transaction submission
  const transactionFormData = useMemo(
    () => ({
      selectedNetwork: formData.selectedNetwork,
      selectedPlanType: formData.selectedPlanType,
      selectedDataPlan: formData.selectedDataPlan,
      selectedDataPlanId: selectedPlan?.plan_id || "",
      networkId: selectedNetwork?.network_id || "",
      planName: selectedPlan?.data_plan || "",
      phone: formData.phone,
      pin: formData.pin,
      price: selectedPlan?.price || "",
      url: selectedPlan?.api?.api_url || "",
      api_name: selectedPlan?.api?.api_name || "",
    }),
    [formData, selectedNetwork, selectedPlan]
  );

  // Handle form input changes - memoized to prevent recreating on every render
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error
  }, []);

  // Handle phone input with network detection - debounced
  const handlePhoneChange = useCallback(
    (e) => {
      const { value } = e.target;
      handleInputChange(e);

      if (value.length === 11) {
        const detectedNetwork = detectNetwork(value);
        setNetworkMessage(
          detectedNetwork !== "Unknown Network"
            ? `Detected Network: ${detectedNetwork} <br /> NB: Ignore this for Ported Numbers`
            : `Unable to identify network <br /> NB: Ignore this for Ported Numbers`
        );
      } else {
        setNetworkMessage("");
      }
    },
    [detectNetwork, handleInputChange]
  );

  // Reset dependent fields when network changes
  useEffect(() => {
    if (formData.selectedNetwork) {
      setFormData((prev) => ({
        ...prev,
        selectedPlanType: "",
        selectedDataPlan: "",
      }));
      setPlanTypes([]);
      setDataPlans([]);
    }
  }, [formData.selectedNetwork]);

  // Reset data plan when plan type changes
  useEffect(() => {
    if (formData.selectedPlanType) {
      setFormData((prev) => ({
        ...prev,
        selectedDataPlan: "",
      }));
      setDataPlans([]);
    }
  }, [formData.selectedPlanType]);

  // Fetch plan types when network changes
  useEffect(() => {
    if (formData.selectedNetwork) {
      setIsLoading((prev) => ({ ...prev, planTypes: true }));

      const controller = new AbortController();
      api
        .get(`data/plan-type/${formData.selectedNetwork}/`, {
          signal: controller.signal,
        })
        .then((response) => setPlanTypes(response.data))
        .catch((error) => {
          if (!error.name === "AbortError") {
            console.error("Error fetching plan types:", error);
          }
        })
        .finally(() => setIsLoading((prev) => ({ ...prev, planTypes: false })));

      return () => controller.abort();
    }
  }, [formData.selectedNetwork, api]);

  // Fetch data plans when plan type changes
  useEffect(() => {
    if (formData.selectedPlanType && formData.selectedNetwork) {
      setIsLoading((prev) => ({ ...prev, dataPlans: true }));

      const controller = new AbortController();
      api
        .get(
          `data/plans/${formData.selectedNetwork}/${formData.selectedPlanType}/`,
          { signal: controller.signal }
        )
        .then((response) => setDataPlans(response.data))
        .catch((error) => {
          if (!error.name === "AbortError") {
            console.error("Error fetching data plans:", error);
          }
        })
        .finally(() => setIsLoading((prev) => ({ ...prev, dataPlans: false })));

      return () => controller.abort();
    }
  }, [formData.selectedPlanType, formData.selectedNetwork, api]);

  // Form validation
  const validInputs = useCallback(() => {
    const newErrors = {};
    if (!formData.selectedNetwork) {
      newErrors.selectedNetwork = "Please select a network";
    }
    if (!formData.selectedPlanType) {
      newErrors.selectedPlanType = "Please select a plan type";
    }
    if (!formData.selectedDataPlan) {
      newErrors.selectedDataPlan = "Please select a data plan";
    }
    if (!formData.phone) {
      newErrors.phone = "A phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits";
    } else if (formData.phone.length !== 11) {
      newErrors.phone = "Enter a valid 11-digit phone number";
    }
    if (!formData.pin) {
      newErrors.pin = "PIN is required";
    } else if (formData.pin !== user.user.transaction_pin) {
      newErrors.pin = "Incorrect PIN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, user.transaction_pin]);

  // Generate UUID for transactions
  const generateUniqueId = useCallback((length = 16) => {
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }, []);

  const productType = "data";

  // Transaction submission handler
  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    generateUniqueId,
    setLoading,
    productType,
    formData: transactionFormData,
    bypassPhoneNumber,
  });

  // Popup handlers
  const handleCancel = useCallback(
    () => setPopupState((prev) => ({ ...prev, isConfirmOpen: false })),
    []
  );

  const handleErrorClose = useCallback(
    () => setPopupState((prev) => ({ ...prev, isErrorOpen: false })),
    []
  );

  const handleSuccessClose = useCallback(
    () => setPopupState((prev) => ({ ...prev, isSuccessOpen: false })),
    []
  );

  const handleBypass = useCallback(
    () => setBypassPhoneNumber((prev) => !prev),
    []
  );

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto w-full max-w-[800px]">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] md:text-3xl mb-4">
            Buy Data
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Data</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Network Selection */}
            <NetworkSelector
              selectedNetwork={formData.selectedNetwork}
              networks={dataNetworks}
              onChange={handleInputChange}
              error={errors.selectedNetwork}
            />

            {/* Plan Type Selection */}
            <PlanTypeSelector
              selectedPlanType={formData.selectedPlanType}
              planTypes={planTypes}
              onChange={handleInputChange}
              error={errors.selectedPlanType}
              disabled={!formData.selectedNetwork || isLoading.planTypes}
            />

            {/* Data Plan Selection */}
            <DataPlanSelector
              selectedDataPlan={formData.selectedDataPlan}
              dataPlans={dataPlans}
              onChange={handleInputChange}
              error={errors.selectedDataPlan}
              disabled={!formData.selectedPlanType || isLoading.dataPlans}
            />

            {/* Phone Number Input */}
            <PhoneInput
              phone={formData.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              disabled={!formData.selectedDataPlan}
              networkMessage={networkMessage}
            />

            {/* PIN Input */}
            <PinInput
              pin={formData.pin}
              onChange={handleInputChange}
              error={errors.pin}
              disabled={!formData.phone}
            />

            {/* Price Display */}
            {selectedPlan?.price && (
              <FloatingLabelInput
                type="text"
                disabled
                name="price"
                placeholder="Price"
                value={`₦${selectedPlan.price}`}
              />
            )}

            {/* Bypass Phone Number Toggle */}
            <BypassToggle
              bypassPhoneNumber={bypassPhoneNumber}
              onToggle={handleBypass}
            />

            {/* Submit Button */}
            <div>
              <SubmitButton label="Purchase" loading={loading} />
            </div>
          </form>
        </div>
      </div>
      <GeneralRight />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with transferring ${transactionFormData.planName} to ${transactionFormData.phone}?`}
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
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default Data;
