// import React, { useCallback, useMemo, useEffect, useState } from "react";
// import SubmitButton from "./SubmitButton";
// import { useAuth } from "../context/AuthenticationContext";
// import { useProduct } from "../context/ProductContext";
// import { useGeneral } from "../context/GeneralContext";
// import GeneralLeft from "./GeneralLeft";
// import GeneralRight from "./GeneralRight";
// import { Link } from "react-router-dom";
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

// const CableSub = ({ showSidebars = true, showStyle = true }) => {
//   const { cableCategories, handleSave } = useProduct();

//   const [cableFormData, setCableFormData] = useState({
//     selectedCableCategory: "",
//     selectedCablePlan: "",
//     uicNumber: "",
//     pin: "",
//     price: "",
//     planName: "",
//     api: "",
//   });

//   const { user } = useAuth();
//   const { api } = useGeneral();
//   const [loading, setLoading] = useState(false);

//   const [bypassUicNumber, setBypassUicNumber] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [selectedCableCatId, setSelectedCableCatId] = useState("");
//   const [selectedCableId, setSelectedCableId] = useState(""); // New state for id

//   const [cablePlans, setCablePlans] = useState([]);
//   const [popupState, setPopupState] = useState({
//     isConfirmOpen: false,
//     isErrorOpen: false,
//     isSuccessOpen: false,
//     successMessage: "",
//     errorPopupMessage: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCableFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when the input changes
//   };

//   const handleSelectedCableCategory = (e) => {
//     const selectedId = parseInt(e.target.value, 10);
//     const selectedCategory = cableCategories.find(
//       (cable) => selectedId === cable.id
//     );

//     if (selectedCategory) {
//       setSelectedCableId(selectedCategory.id); // Store id for fetching plans
//       setSelectedCableCatId(selectedCategory.cable_id); // Store cable_id for cableFormData
//       setCableFormData((prev) => ({
//         ...prev,
//         selectedCableCategory: selectedCategory.cable_id, // Set to cable_id
//         selectedCablePlan: "",
//         price: "",
//       }));
//       setCablePlans([]);
//     }
//   };

//   const handleSelectedCablePlan = (e) => {
//     const selectedPlanId = parseInt(e.target.value, 10);
//     const selectedPlan = cablePlans.find(
//       (plan) => plan.plan_id === selectedPlanId
//     );

//     setCableFormData((prev) => ({
//       ...prev,
//       selectedCablePlan: selectedPlanId,
//       price: selectedPlan ? selectedPlan.price : "",
//       planName: selectedPlan ? selectedPlan.cable_plan : "",
//       api: selectedPlan ? selectedPlan : "",
//     }));
//   };

//   const validInputs = useCallback(() => {
//     const newErrors = {};
//     if (!cableFormData.selectedCableCategory) {
//       newErrors.selectedCableCategory = "Please select a cable category";
//     }
//     if (!showStyle) {
//       if (!cableFormData.title) {
//         newErrors.title = "Shortcut must be saved with a title";
//       }
//     }
//     if (!cableFormData.selectedCablePlan) {
//       newErrors.selectedCablePlan = "Please select a cable plan";
//     }
//     if (!cableFormData.uicNumber) {
//       newErrors.uicNumber = "An IUC number is required";
//     } else if (cableFormData.uicNumber.length !== 10) {
//       newErrors.uicNumber = "Enter a valid 10-digit UIC number";
//     }
//     if (!cableFormData.pin) {
//       newErrors.pin = "PIN is required";
//     } else if (cableFormData.pin !== user.user.transaction_pin) {
//       newErrors.pin = "Incorrect PIN";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [cableFormData]);

//   const generateUniqueId = (length = 16) => {
//     const array = new Uint8Array(length / 2);
//     window.crypto.getRandomValues(array);
//     return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
//       ""
//     );
//   };

//   const transactionFormData = useMemo(
//     () => ({
//       selectedCableCategory: cableFormData.selectedCableCategory,
//       selectedCablePlan: cableFormData.selectedCablePlan,
//       selectedCablePlanId: selectedCableId || "",
//       cableCategoryId: selectedCableCatId || "",
//       planName: cableFormData.planName,
//       uicNumber: cableFormData.uicNumber,
//       title: cableFormData.title,
//       pin: cableFormData.pin,
//       price: cableFormData.price,
//       url: cableFormData?.api?.api?.api_url || "",
//       api_name: cableFormData?.api?.api?.api_name || "",
//     }),
//     [cableFormData, selectedCableId, selectedCableCatId, selectedCableId]
//   );

//   const productType = "cable";

//   const { handleSubmit, handleConfirm } = useTransactionSubmit({
//     validInputs,
//     setPopupState,
//     generateUniqueId,
//     setLoading,
//     productType,
//     formData: transactionFormData,
//     bypassUicNumber,
//   });

//   const handleCancel = () =>
//     setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
//   const handleErrorClose = () =>
//     setPopupState((prev) => ({ ...prev, isErrorOpen: false }));
//   const handleBypass = () => setBypassUicNumber((prev) => !prev);

//   useEffect(() => {
//     if (selectedCableId) {
//       api
//         .get(`category/${selectedCableId}/`)
//         .then((response) => {
//           setCablePlans(response.data);
//         })
//         .catch((error) => console.error("Error fetching cable plans:", error));
//     }
//   }, [selectedCableId, api]);

//   return (
//     <div
//       className={`${
//         showStyle &&
//         "pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]"
//       }`}
//     >
//       {showSidebars && <GeneralLeft />}
//       <div className="mx-auto w-full max-w-[800px]">
//         {showStyle && (
//           <div>
//             <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] md:text-3xl mb-4">
//               Buy Cable Subscription
//             </h2>
//             <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
//               <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
//               <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
//               <span className="text-gray-500">Cable Subscription</span>
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
//                 value={cableFormData.title}
//                 onChange={handleInputChange}
//                 className={`${inputStyle} `}
//                 error={errors.title}
//               />
//             )}

//             <FloatingLabelSelect
//               name="selectedCableCategory"
//               placeholder="Cable Name"
//               value={cableFormData.selectedCableCategory}
//               onChange={handleSelectedCableCategory}
//               error={errors.selectedCableCategory}
//               options={cableCategories.map((item) => ({
//                 value: item.id,
//                 label: item.cable_name,
//               }))}
//             />

//             <FloatingLabelSelect
//               name="selectedCablePlan"
//               placeholder="Cable Plan"
//               value={cableFormData.selectedCablePlan}
//               onChange={handleSelectedCablePlan}
//               error={errors.selectedCablePlan}
//               options={cablePlans.map((item) => ({
//                 value: item.plan_id,
//                 label: item.cable_plan,
//               }))}
//             />

//             {/* UIC Number Input */}
//             <div>
//               <FloatingLabelInput
//                 type="text"
//                 name="uicNumber"
//                 placeholder="IUC Number"
//                 aria-label="UIC Number"
//                 className={`${inputStyle}`}
//                 value={cableFormData.uicNumber}
//                 onChange={handleInputChange}
//                 error={errors.uicNumber}
//               />
//             </div>

//             {/* PIN Input */}
//             <div>
//               <FloatingLabelInput
//                 type="password"
//                 name="pin"
//                 placeholder="Pin"
//                 aria-label="Password"
//                 autoComplete="current-password"
//                 className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
//                 value={cableFormData.pin}
//                 error={errors.pin}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Price Display */}
//             {cableFormData.price && !showStyle && (
//               <div>
//                 <FloatingLabelInput
//                   type="text"
//                   disabled
//                   name="price"
//                   placeholder="Price"
//                   value={`₦${Number(cableFormData.price).toLocaleString(
//                     "en-NG"
//                   )}`}
//                   className={inputStyle}
//                 />
//               </div>
//             )}

//             {/* Bypass UIC Number Toggle */}
//             <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-5">
//               <p className="dark:text-white text-primary opacity-80 font-semibold">
//                 Bypass IUC Number
//               </p>
//               <div
//                 className="flex items-center mr-3 cursor-pointer"
//                 onClick={handleBypass}
//               >
//                 <div
//                   className={`h-5 w-10 rounded-full flex items-center relative transition-colors duration-300 ease-in-out ${
//                     bypassUicNumber ? "bg-[#1CCEFF]" : "bg-gray-600"
//                   }`}
//                 >
//                   <div
//                     className={`h-6 w-6 bg-white border rounded-full absolute transform transition-transform duration-300 ease-in-out ${
//                       bypassUicNumber
//                         ? "translate-x-5"
//                         : "translate-x-[-0.1rem]"
//                     }`}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//               <SubmitButton
//                 label={
//                   showStyle
//                     ? bypassUicNumber
//                       ? "Purchase"
//                       : "Verify IUC Number"
//                     : "Save"
//                 }
//                 loading={!showStyle && loading}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//       {showSidebars && <GeneralRight />}

//       {/* Confirmation Popup */}
//       <ConfirmationPopup
//         isOpen={popupState.isConfirmOpen}
//         onConfirm={handleConfirm}
//         onCancel={handleCancel}
//         message={`Are you sure you want to proceed with subscribing ${cableFormData.planName} to ${cableFormData.uicNumber}?`}
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

// export default CableSub;

import React, { useCallback, useMemo, useEffect, useState } from "react";
import SubmitButton from "./SubmitButton";
import { useAuth } from "../context/AuthenticationContext";
import { useProduct } from "../context/ProductContext";
import { useGeneral } from "../context/GeneralContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useTransactionSubmit } from "./UserTransactionSubmit";
import FloatingLabelInput from "./FloatingLabelInput";
import FloatingLabelSelect from "./FloatingLabelSelect";

// Styles
const selectStyle =
  "custom-select dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] focus:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const errorInputStyle = "border-red-500 dark:border-red-700";

// Main Component
const CableSub = ({ showSidebars = true, showStyle = true }) => {
  const { cableCategories, handleSave } = useProduct();
  const { user } = useAuth();
  const { api } = useGeneral();

  // State Management
  const [cableFormData, setCableFormData] = useState({
    selectedCableCategory: "",
    selectedCablePlan: "",
    uicNumber: "",
    pin: "",
    price: "",
    planName: "",
    api: "",
    title: "",
  });

  const [loading, setLoading] = useState(false);
  const [bypassUicNumber, setBypassUicNumber] = useState(false);
  const [errors, setErrors] = useState({});
  const [cablePlans, setCablePlans] = useState([]);
  const [selectedCableId, setSelectedCableId] = useState("");

  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCableFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error
  }, []);

  const handleSelectedCableCategory = useCallback(
    (e) => {
      const selectedId = parseInt(e.target.value, 10);
      const selectedCategory = cableCategories.find(
        (cable) => selectedId === cable.id
      );

      if (selectedCategory) {
        setSelectedCableId(selectedCategory.id);
        setCableFormData((prev) => ({
          ...prev,
          selectedCableCategory: selectedCategory.cable_id,
          selectedCablePlan: "",
          price: "",
        }));
        setCablePlans([]);
      }
    },
    [cableCategories]
  );

  const handleSelectedCablePlan = useCallback(
    (e) => {
      const selectedPlanId = parseInt(e.target.value, 10);
      const selectedPlan = cablePlans.find(
        (plan) => plan.plan_id === selectedPlanId
      );

      setCableFormData((prev) => ({
        ...prev,
        selectedCablePlan: selectedPlanId,
        price: selectedPlan ? selectedPlan.price : "",
        planName: selectedPlan ? selectedPlan.cable_plan : "",
        api: selectedPlan || "",
      }));
    },
    [cablePlans]
  );

  const handleBypass = useCallback(
    () => setBypassUicNumber((prev) => !prev),
    []
  );

  // Form Validation
  const validInputs = useCallback(() => {
    const newErrors = {};
    if (!cableFormData.selectedCableCategory)
      newErrors.selectedCableCategory = "Please select a cable category";
    if (!showStyle && !cableFormData.title)
      newErrors.title = "Shortcut must be saved with a title";
    if (!cableFormData.selectedCablePlan)
      newErrors.selectedCablePlan = "Please select a cable plan";
    if (!cableFormData.uicNumber)
      newErrors.uicNumber = "An IUC number is required";
    else if (cableFormData.uicNumber.length !== 10)
      newErrors.uicNumber = "Enter a valid 10-digit UIC number";
    if (!cableFormData.pin) newErrors.pin = "PIN is required";
    else if (cableFormData.pin !== user.user.transaction_pin)
      newErrors.pin = "Incorrect PIN";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [cableFormData, showStyle, user]);

  // Fetch Cable Plans
  useEffect(() => {
    if (selectedCableId) {
      api
        .get(`category/${selectedCableId}/`)
        .then((response) => setCablePlans(response.data))
        .catch((error) => console.error("Error fetching cable plans:", error));
    }
  }, [selectedCableId, api]);

  // Transaction Form Data
  const transactionFormData = useMemo(
    () => ({
      selectedCableCategory: cableFormData.selectedCableCategory,
      selectedCablePlan: cableFormData.selectedCablePlan,
      selectedCablePlanId: selectedCableId,
      cableCategoryId: cableFormData.selectedCableCategory,
      planName: cableFormData.planName,
      uicNumber: cableFormData.uicNumber,
      title: cableFormData.title,
      pin: cableFormData.pin,
      price: cableFormData.price,
      url: cableFormData.api?.api?.api_url || "",
      api_name: cableFormData.api?.api?.api_name || "",
    }),
    [cableFormData, selectedCableId]
  );

  // Transaction Submission
  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    setLoading,
    productType: "cable",
    formData: transactionFormData,
    bypassUicNumber,
  });

  // Popup Handlers
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

  return (
    <div
      className={`${
        showStyle &&
        "pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]"
      }`}
    >
      {showSidebars && <GeneralLeft />}
      <div className="mx-auto w-full max-w-[800px]">
        {showStyle && (
          <div>
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem] md:text-3xl mb-4">
              Buy Cable Subscription
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Cable Subscription</span>
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
                : (e) => handleSave(e, transactionFormData, validInputs)
            }
          >
            {!showStyle && (
              <FloatingLabelInput
                type="text"
                name="title"
                placeholder="Shortcut Name"
                aria-label="Title"
                value={cableFormData.title}
                onChange={handleInputChange}
                className={`${inputStyle}`}
                error={errors.title}
              />
            )}

            <FloatingLabelSelect
              name="selectedCableCategory"
              placeholder="Cable Name"
              value={cableFormData.selectedCableCategory}
              onChange={handleSelectedCableCategory}
              error={errors.selectedCableCategory}
              options={cableCategories.map((item) => ({
                value: item.id,
                label: item.cable_name,
              }))}
            />

            <FloatingLabelSelect
              name="selectedCablePlan"
              placeholder="Cable Plan"
              value={cableFormData.selectedCablePlan}
              onChange={handleSelectedCablePlan}
              error={errors.selectedCablePlan}
              options={cablePlans.map((item) => ({
                value: item.plan_id,
                label: item.cable_plan,
              }))}
            />

            <FloatingLabelInput
              type="text"
              name="uicNumber"
              placeholder="IUC Number"
              aria-label="UIC Number"
              className={`${inputStyle}`}
              value={cableFormData.uicNumber}
              onChange={handleInputChange}
              error={errors.uicNumber}
            />

            <FloatingLabelInput
              type="password"
              name="pin"
              placeholder="Pin"
              aria-label="Password"
              autoComplete="current-password"
              className={`${inputStyle} ${errors.pin ? errorInputStyle : ""}`}
              value={cableFormData.pin}
              error={errors.pin}
              onChange={handleInputChange}
            />

            {cableFormData.price && !showStyle && (
              <FloatingLabelInput
                type="text"
                disabled
                name="price"
                placeholder="Price"
                value={`₦${Number(cableFormData.price).toLocaleString(
                  "en-NG"
                )}`}
                className={inputStyle}
              />
            )}

            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] py-5">
              <p className="dark:text-white text-primary opacity-80 font-semibold">
                Bypass IUC Number
              </p>
              <div
                className="flex items-center mr-3 cursor-pointer"
                onClick={handleBypass}
              >
                <div
                  className={`h-5 w-10 rounded-full flex items-center relative transition-colors duration-300 ease-in-out ${
                    bypassUicNumber ? "bg-[#1CCEFF]" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`h-6 w-6 bg-white border rounded-full absolute transform transition-transform duration-300 ease-in-out ${
                      bypassUicNumber
                        ? "translate-x-5"
                        : "translate-x-[-0.1rem]"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <SubmitButton
              label={
                showStyle
                  ? bypassUicNumber
                    ? "Purchase"
                    : "Verify IUC Number"
                  : "Save"
              }
              loading={!showStyle && loading}
            />
          </form>
        </div>
      </div>
      {showSidebars && <GeneralRight />}

      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with subscribing ${cableFormData.planName} to ${cableFormData.uicNumber}?`}
      />

      <ErrorPopup
        isOpen={popupState.isErrorOpen}
        message={popupState.errorPopupMessage}
        onClose={handleErrorClose}
      />

      <SuccessPopup
        isOpen={popupState.isSuccessOpen}
        message={popupState.successMessage}
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default CableSub;
