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
    const userBalance = walletData.balance || 0;
    return transactionAmount <= userBalance;
  }, [formData, user]);

  console.log("Has sufficient balance:", hasSufficientBalance());

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validInputs();
    console.log("Validation Passed:", valid);
    if (!valid) {
      console.log("Validation failed, stopping execution");
      setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
      return; // Stop execution if validation fails
    }
    if (!hasSufficientBalance()) {
      // Added parentheses here
      console.log("Insufficient balance, showing error popup");
      setPopupState((prev) => ({
        ...prev,
        errorPopupMessage: "Insufficient fund.",
        isErrorOpen: true,
      }));
      return; // Stop execution if balance is insufficient
    }
    // If both validation and balance check pass, open confirmation popup
    console.log("Opening confirmation popup");
    setPopupState((prev) => ({ ...prev, isConfirmOpen: true }));
  };

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
