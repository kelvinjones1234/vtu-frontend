// import { useCallback } from "react";
// import { useGeneral } from "../context/GeneralContext";
// import { useAuth } from "../context/AuthenticationContext";
// import { useNavigate } from "react-router-dom";

// export const useTransactionSubmit = ({
//   validInputs,
//   setPopupState,
//   formData,
//   generateUniqueId,
//   bypassMeterNumber,
//   bypassPhoneNumber,
//   bypassUicNumber,
//   productType,
//   setLoading,
// }) => {
//   const { user } = useAuth();
//   const { api } = useGeneral();
//   const navigate = useNavigate();

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();

//       if (formData.amount || formData.price > user.user.amount) {
//         setPopupState((prev) => ({
//           ...prev,
//           errorPopupMessage: "Insufficient fund.",
//           isErrorOpen: true,
//         }));
//       } else {
//         setPopupState((prev) => ({ ...prev, isConfirmOpen: true }));
//       }
//     },
//     [validInputs, setPopupState]
//   );

//   const handleConfirm = useCallback(async () => {
//     setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
//     setLoading(true);

//     try {
//       let payload = {
//         payload_data: {},
//         transaction_type: productType,
//       };

//       // Construct payload dynamically based on product type
//       switch (productType) {
//         case "data":
//           payload.payload_data = {
//             network: formData.networkId,
//             phone: formData.phone,
//             data_plan: formData.selectedDataPlanId,
//             bypass: bypassPhoneNumber,
//             description: formData.planName,
//             amount: formData.price,
//             url: formData.url,
//             api_name: formData.api_name,
//             "request-id": `Data_${generateUniqueId()}`,
//           };
//           break;

//         case "airtime":
//           payload.payload_data = {
//             network: formData.networkId,
//             phone: formData.phone,
//             amount: formData.amount,
//             bypass: bypassPhoneNumber,
//             pin: formData.pin,
//             airtime_type: formData.selectedAirtimeType,
//             "request-id": `Airtime_${generateUniqueId()}`,
//           };
//           break;

//         case "cable":
//           payload.payload_data = {
//             provider: formData.selectedCableCategory,
//             plan: formData.selectedCablePlan,
//             uic: formData.uicNumber,
//             plan_name: formData.planName,
//             bypass: bypassUicNumber,
//             "request-id": `Cable_${generateUniqueId()}`,
//           };
//           break;

//         case "electricity":
//           payload.payload_data = {
//             disco: formData.selectedDisco,
//             meterNumber: formData.meterNumber,
//             meterType: formData.selectedMeterType,
//             amount: formData.amount,
//             bypass: bypassMeterNumber,
//             disco_id: formData.selectedDiscoId,
//             charges: formData.charges,
//             "request-id": `Electricity_${generateUniqueId()}`,
//           };
//           break;

//         default:
//           throw new Error("Invalid service type");
//       }

//       const response = await api.post("post_payment/", payload, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       // Handle different response statuses
//       if (response.data && response.data.status) {
//         switch (response.data.status) {
//           case "success":
//             setPopupState((prev) => ({
//               ...prev,
//               successMessage: "Transaction successful!",
//               isSuccessOpen: true,
//             }));
//             break;

//           case "fail":
//             setPopupState((prev) => ({
//               ...prev,
//               errorPopupMessage: response.data.response || "Transaction Failed",
//               isErrorOpen: true,
//             }));
//             break;

//           default:
//             setPopupState((prev) => ({
//               ...prev,
//               errorPopupMessage:
//                 response.data.message || "Something went wrong!",
//               isErrorOpen: true,
//             }));
//         }
//       } else if (response.data && response.data.error) {
//         // Handle error response
//         setPopupState((prev) => ({
//           ...prev,
//           errorPopupMessage: response.data.error || "Something went wrong!",
//           isErrorOpen: true,
//         }));
//       } else {
//         // Handle unexpected response structure
//         setPopupState((prev) => ({
//           ...prev,
//           errorPopupMessage: "Unexpected response from the server",
//           isErrorOpen: true,
//         }));
//       }
//     } catch (error) {
//       const errorMsg =
//         error.response &&
//         error.response.data.error &&
//         String(error.response.data.error).toLowerCase().includes("insufficient")
//           ? "An error occurred. If error persists, please contact admin!"
//           : error.response
//           ? error.response.data.message ||
//             error.response.data.error ||
//             error.message
//           : error.message;

//       setPopupState((prev) => ({
//         ...prev,
//         errorPopupMessage: errorMsg.includes("Insufficient Account")
//           ? "An error occurred. If error persists, please contact admin!"
//           : errorMsg,
//         isErrorOpen: true,
//       }));
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     setPopupState,
//     bypassPhoneNumber,
//     bypassUicNumber,
//     formData,
//     generateUniqueId,
//     productType,
//     bypassMeterNumber,
//     api,
//     user.username,
//     user.user_id,
//   ]);

//   return { handleSubmit, handleConfirm };
// };

import { useCallback } from "react";
import { useGeneral } from "../context/GeneralContext";
import { useAuth } from "../context/AuthenticationContext";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

export const useTransactionSubmit = ({
  setPopupState,
  formData,
  generateUniqueId,
  bypassMeterNumber,
  bypassPhoneNumber,
  bypassUicNumber,
  productType,
  validInputs,
  setLoading,
}) => {
  const { user } = useAuth();
  const { api } = useGeneral();
  const { walletData, updateWalletBalance } = useWallet();

  const navigate = useNavigate();

  // Helper function to create payloads based on product type
  const createPayload = useCallback(() => {
    const basePayload = {
      payload_data: {},
      transaction_type: productType,
    };

    switch (productType) {
      case "data":
        return {
          ...basePayload,
          payload_data: {
            network: formData.networkId,
            phone: formData.phone,
            data_plan: formData.selectedDataPlanId,
            bypass: bypassPhoneNumber,
            description: formData.planName,
            amount: formData.price,
            url: formData.url,
            api_name: formData.api_name,
            "request-id": `Data_${generateUniqueId()}`,
          },
        };

      case "airtime":
        return {
          ...basePayload,
          payload_data: {
            network: formData.networkId,
            phone: formData.phone,
            amount: formData.amount,
            bypass: bypassPhoneNumber,
            pin: formData.pin,
            airtime_type: formData.selectedAirtimeType,
            "request-id": `Airtime_${generateUniqueId()}`,
          },
        };

      case "cable":
        return {
          ...basePayload,
          payload_data: {
            provider: formData.selectedCableCategory,
            plan: formData.selectedCablePlan,
            uic: formData.uicNumber,
            plan_name: formData.planName,
            bypass: bypassUicNumber,
            "request-id": `Cable_${generateUniqueId()}`,
          },
        };

      case "electricity":
        return {
          ...basePayload,
          payload_data: {
            disco: formData.selectedDisco,
            meterNumber: formData.meterNumber,
            meterType: formData.selectedMeterType,
            amount: formData.amount,
            bypass: bypassMeterNumber,
            disco_id: formData.selectedDiscoId,
            charges: formData.charges,
            "request-id": `Electricity_${generateUniqueId()}`,
          },
        };

      default:
        throw new Error("Invalid service type");
    }
  }, [
    formData,
    generateUniqueId,
    bypassMeterNumber,
    bypassPhoneNumber,
    bypassUicNumber,
    productType,
  ]);

  // Check if user has sufficient balance
  const hasSufficientBalance = useCallback(() => {
    const transactionAmount = formData.amount || formData.price || 0;
    const userBalance = user?.user?.amount || 0;
    return transactionAmount <= userBalance;
  }, [formData, user]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (validInputs()) {
        setPopupState((prev) => ({ ...prev, isConfirmOpen: true }));
      } else if (!hasSufficientBalance()) {
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage: "Insufficient fund.",
          isErrorOpen: true,
        }));
      }
    },
    [hasSufficientBalance, validInputs, setPopupState]
  );

  const handleConfirm = useCallback(async () => {
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
    setLoading(true);

    try {
      const payload = createPayload();
      const response = await api.post("post_payment/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Process response
      const data = response.data || {};

      if (data.status === "success") {
        const newBalance =
          walletData.balance -
          (parseFloat(formData.amount) || parseFloat(formData.price));
        updateWalletBalance(newBalance);
        setPopupState((prev) => ({
          ...prev,
          successMessage: "Transaction successful!",
          isSuccessOpen: true,
        }));
      } else if (data.status === "fail") {
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage: data.response || "Transaction Failed",
          isErrorOpen: true,
        }));
      } else if (data.error) {
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage: data.error || "Something went wrong!",
          isErrorOpen: true,
        }));
      } else {
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage:
            data.message || "Unexpected response from the server",
          isErrorOpen: true,
        }));
      }
    } catch (error) {
      // Simplified error handling
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "An error occurred";

      // Hide sensitive financial errors
      const isSensitiveError =
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("insufficient");

      setPopupState((prev) => ({
        ...prev,
        errorPopupMessage: isSensitiveError
          ? "An error occurred. If error persists, please contact admin!"
          : errorMessage,
        isErrorOpen: true,
      }));
    } finally {
      setLoading(false);
    }
  }, [setPopupState, setLoading, createPayload, api]);

  return { handleSubmit, handleConfirm };
};
