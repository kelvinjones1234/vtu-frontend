import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useAuth } from "../context/AuthenticationContext";
import { useGeneral } from "../context/GeneralContext";
import { useProduct } from "../context/ProductContext";

// Reusable Selector Components
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

const PlanTypeSelector = React.memo(
  ({ selectedPlanType, planTypes, onChange, error, disabled }) => {
    const options = useMemo(
      () =>
        planTypes.map((type) => ({
          value: type.plan_type,
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

const DataPlanSelector = React.memo(
  ({ selectedDataPlan, dataPlans, onChange, error, disabled }) => {
    const options = useMemo(
      () =>
        dataPlans.map((item) => ({
          value: item.id,
          label: `${item.data_plan} - ₦${item.price}`,
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

// Reusable Input Components
const PhoneInput = React.memo(
  ({ phone, onChange, error, disabled, networkMessage }) => (
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
  )
);

const TitleInput = React.memo(({ title, onChange, error, disabled }) => (
  <div>
    <FloatingLabelInput
      type="text"
      name="title"
      placeholder="Shortcut Title"
      aria-label="Title"
      value={title}
      onChange={onChange}
      disabled={disabled}
      error={error}
    />
  </div>
));

const PinInput = React.memo(({ pin, onChange, error, disabled }) => (
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
));

const BypassToggle = React.memo(({ bypassPhoneNumber, onToggle }) => (
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
));

// Main Data Component
const Data = ({ showSidebars = true, showStyle = true, resetForm }) => {
  const { dataNetworks, handleSave } = useProduct();
  const { api, detectNetwork } = useGeneral();
  const { user } = useAuth();

  // State Management
  const [dataFormData, setDataFormData] = useState({
    selectedNetwork: "",
    selectedPlanType: "",
    selectedDataPlan: "",
    phone: "",
    pin: "",
    title: "",
  });


  useEffect(() => {
    setDataFormData({
      selectedNetwork: "",
      selectedPlanType: "",
      selectedDataPlan: "",
      phone: "",
      pin: "",
      title: "",
    });
  }, [resetForm]);



  const [loading, setLoading] = useState(false);
  const [allPlans, setAllPlans] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const [bypassPhoneNumber, setBypassPhoneNumber] = useState(false);
  const [networkMessage, setNetworkMessage] = useState("");
  const [isLoading, setIsLoading] = useState({
    plans: false,
    planTypes: false,
    dataPlans: false,
  });

  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  // Derived Values
  const selectedNetwork = useMemo(
    () =>
      dataNetworks.find(
        (network) => network.network === dataFormData.selectedNetwork
      ),
    [dataNetworks, dataFormData.selectedNetwork]
  );

  const selectedPlan = useMemo(
    () =>
      dataPlans.find(
        (plan) => plan.id === parseInt(dataFormData.selectedDataPlan, 10)
      ),
    [dataPlans, dataFormData.selectedDataPlan]
  );

  const generateUniqueId = (length = 16) => {
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  };

  const transactionFormData = useMemo(
    () => ({
      selectedNetwork: dataFormData.selectedNetwork,
      selectedPlanType: dataFormData.selectedPlanType,
      selectedDataPlan: dataFormData.selectedDataPlan,
      selectedDataPlanId: selectedPlan?.plan_id || "",
      networkId: selectedNetwork?.network_id || "",
      planName: selectedPlan?.data_plan || "",
      phone: dataFormData.phone,
      title: dataFormData.title,
      pin: dataFormData.pin,
      price: selectedPlan?.price || "",
      url: selectedPlan?.api?.api_url || "",
      api_name: selectedPlan?.api?.api_name || "",
      standard_id: selectedPlan?.standard_id || "",
      productType: "data",
      requestId: `Data_${generateUniqueId()}`,
    }),
    [dataFormData, selectedNetwork, selectedPlan]
  );

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setDataFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

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

  const handleBypass = useCallback(
    () => setBypassPhoneNumber((prev) => !prev),
    []
  );

  // Fetch all plans initially
  useEffect(() => {
    if (dataFormData.selectedNetwork) {
      setIsLoading((prev) => ({ ...prev, plans: true }));

      const controller = new AbortController();

      api
        .get("data/plans/", {
          signal: controller.signal,
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setAllPlans(response.data);
          } else {
            console.warn("Expected array but got:", typeof response.data);
          }
        })
        .catch((error) => {
          // Only log errors that aren't cancellation errors
          if (error.name !== "CanceledError" && error.name !== "AbortError") {
            console.error("Error fetching all data plans:", error);
          }
        })
        .finally(() => {
          // Only update loading state if the component is still mounted
          setIsLoading((prev) => ({ ...prev, plans: false }));
        });

      return () => controller.abort();
    }
  }, [api, dataFormData.selectedNetwork]);

  // Effects
  useEffect(() => {
    if (dataFormData.selectedNetwork) {
      setDataFormData((prev) => ({
        ...prev,
        selectedPlanType: "",
        selectedDataPlan: "",
      }));

      // Filter plan types based on selected network from all plans
      const filteredPlanTypes = allPlans
        .filter((plan) => plan.network_name === dataFormData.selectedNetwork)
        .map((plan) => ({
          plan_type: plan.plan_type,
          is_active: plan.is_active,
        }));

      console.log("All Plans", allPlans);

      // Remove duplicates
      const uniquePlanTypes = filteredPlanTypes.reduce((acc, current) => {
        const x = acc.find((item) => item.plan_type === current.plan_type);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setPlanTypes(uniquePlanTypes);
      setDataPlans([]);
    }
  }, [dataFormData.selectedNetwork, allPlans]);

  useEffect(() => {
    if (dataFormData.selectedPlanType) {
      setDataFormData((prev) => ({ ...prev, selectedDataPlan: "" }));

      // Filter data plans based on selected network and plan type
      const filteredDataPlans = allPlans.filter(
        (plan) =>
          plan.network_name === dataFormData.selectedNetwork &&
          plan.plan_type === dataFormData.selectedPlanType &&
          plan.is_active
      );

      setDataPlans(filteredDataPlans);
    }
  }, [dataFormData.selectedPlanType, dataFormData.selectedNetwork, allPlans]);

  // Form Validation
  const validInputs = useCallback(() => {
    const newErrors = {};
    if (!dataFormData.selectedNetwork)
      newErrors.selectedNetwork = "Please select a network";
    if (!showStyle && !dataFormData.title)
      newErrors.title = "Shortcut must be saved with a title";
    if (!dataFormData.selectedPlanType)
      newErrors.selectedPlanType = "Please select a plan type";
    if (!dataFormData.selectedDataPlan)
      newErrors.selectedDataPlan = "Please select a data plan";
    if (!dataFormData.phone) newErrors.phone = "A phone number is required";
    else if (!/^\d+$/.test(dataFormData.phone))
      newErrors.phone = "Phone number must contain only digits";
    else if (dataFormData.phone.length !== 11)
      newErrors.phone = "Enter a valid 11-digit phone number";
    if (!dataFormData.pin) newErrors.pin = "PIN is required";
    else if (dataFormData.pin !== user.user.transaction_pin)
      newErrors.pin = "Incorrect PIN";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [dataFormData, showStyle, user]);

  // Transaction Submission
  const { handleSubmit, handleConfirm } = useTransactionSubmit({
    validInputs,
    setPopupState,
    setLoading,
    generateUniqueId,
    productType: "data",
    formData: transactionFormData,
    bypassPhoneNumber,
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
              Buy Data
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Data</span>
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
            onSubmit={(e) =>
              showStyle
                ? handleSubmit(e)
                : handleSave(e, transactionFormData, validInputs, setLoading)
            }
          >
            {!showStyle && (
              <TitleInput
                title={dataFormData.title}
                onChange={handleInputChange}
                error={errors.title}
              />
            )}
            <NetworkSelector
              selectedNetwork={dataFormData.selectedNetwork}
              networks={dataNetworks}
              onChange={handleInputChange}
              error={errors.selectedNetwork}
            />
            <PlanTypeSelector
              selectedPlanType={dataFormData.selectedPlanType}
              planTypes={planTypes}
              onChange={handleInputChange}
              error={errors.selectedPlanType}
              disabled={!dataFormData.selectedNetwork || isLoading.plans}
            />
            <DataPlanSelector
              selectedDataPlan={dataFormData.selectedDataPlan}
              dataPlans={dataPlans}
              onChange={handleInputChange}
              error={errors.selectedDataPlan}
              disabled={!dataFormData.selectedPlanType || isLoading.plans}
            />
            <PhoneInput
              phone={dataFormData.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              disabled={!dataFormData.selectedDataPlan}
              networkMessage={networkMessage}
            />
            <PinInput
              pin={dataFormData.pin}
              onChange={handleInputChange}
              error={errors.pin}
              disabled={!dataFormData.phone}
            />
            {selectedPlan?.price && showStyle && (
              <FloatingLabelInput
                type="text"
                disabled
                name="price"
                placeholder="Price"
                value={`₦${selectedPlan.price}`}
              />
            )}
            {showStyle ? (
              <BypassToggle
                bypassPhoneNumber={bypassPhoneNumber}
                onToggle={handleBypass}
              />
            ) : (
              <p className="text-primary dark:text-white text-[.7rem] font-bold">
                {" "}
                NB: Create shortcuts only for validated phone numbers<br />{" "}
                Phone number validation is false by default
              </p>
            )}
            <div>
              <SubmitButton
                label={`${showStyle ? "Purchase" : "Save"}`}
                loading={loading}
              />
            </div>
          </form>
        </div>
      </div>
      {showSidebars && <GeneralRight />}
      <ConfirmationPopup
        isOpen={popupState.isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to proceed with transferring ${transactionFormData.planName} to ${transactionFormData.phone}?`}
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

export default Data;
