import { useCallback } from "react";
import { useWallet } from "../context/WalletContext";
import { GeneralContext } from "../context/GeneralContext";
import { AuthContext } from "../context/AuthenticationContext";
import { useContext } from "react";

export const useTransactionSubmit = ({
  validInputs,
  setPopupState,
  formData,
  generateUniqueId,
  bypassPhoneNumber,
  productType,
}) => {
  const { user, authTokens, rememberMe, logoutUser } = useContext(AuthContext);
  const { api, setLoading } = useContext(GeneralContext);
  const { walletData, setWalletData } = useWallet();

  const handleSubmit = useCallback(
    async (e) => {
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
    },
    [validInputs, rememberMe, authTokens, logoutUser, setPopupState]
  );

  const handleConfirm = useCallback(async () => {
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
    setLoading(true);

    try {
      let payload = {
        payload_data: {},
        price: formData.price,
      };

      // Construct payload dynamically based on product type
      switch (productType) {
        case "data":
          payload.payload_data = {
            network: formData.networkId,
            phone: formData.phone,
            data_plan: formData.selectedDataPlanId,
            bypass: bypassPhoneNumber,
            description: formData.planName,
            "request-id": `Data_${generateUniqueId()}`,
          };
          break;

        case "airtime":
          payload.payload_data = {
            network: formData.networkId,
            phone: formData.phone,
            amount: formData.amount,
            pin: formData.pin, // Required for security
            "request-id": `Airtime_${generateUniqueId()}`,
          };
          break;

        case "tv_subscription":
          payload.payload_data = {
            provider: formData.providerId,
            smartCardNumber: formData.smartCardNumber,
            package: formData.selectedPackage,
            "request-id": `TV_${generateUniqueId()}`,
          };
          break;

        case "electricity":
          payload.payload_data = {
            disco: formData.discoId,
            meterNumber: formData.meterNumber,
            meterType: formData.meterType,
            "request-id": `Electricity_${generateUniqueId()}`,
          };
          break;

        default:
          throw new Error("Invalid service type");
      }

      const response = await api.post("post_payment/", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Handle different response statuses
      switch (response.data.status) {
        case "success":
          setPopupState((prev) => ({
            ...prev,
            successMessage: "Transaction successful!",
            isSuccessOpen: true,
          }));
          break;

        case "fail":
          setPopupState((prev) => ({
            ...prev,
            errorPopupMessage: response.data.response || "Transaction Failed",
            isErrorOpen: true,
          }));
          break;

        default:
          setPopupState((prev) => ({
            ...prev,
            errorPopupMessage: response.data.message || "An error occurred",
            isErrorOpen: true,
          }));
      }
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : error.message;

      setPopupState((prev) => ({
        ...prev,
        errorPopupMessage: errorMsg.includes("Insufficient Account")
          ? "An error occurred. If it persists, please contact admin!"
          : errorMsg,
        isErrorOpen: true,
      }));
    } finally {
      setLoading(false);
    }
  }, [
    setPopupState,
    bypassPhoneNumber,
    formData,
    generateUniqueId,
    productType,
    api,
    setLoading,
    authTokens.access,
    user.username,
    user.user_id,
    walletData.balance,
    setWalletData,
  ]);

  return { handleSubmit, handleConfirm };
};
