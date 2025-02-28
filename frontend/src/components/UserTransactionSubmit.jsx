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
  bypassUicNumber,
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
        transaction_type: productType,
      };

      // Construct payload dynamically based on product type
      switch (productType) {
        case "data":
          payload.payload_data = {
            network: formData.networkId,
            phone: formData.phone,
            data_plan: formData.selectedDataPlanId,
            Ported_number: bypassPhoneNumber,
            description: formData.planName,
            "request-id": `Data_${generateUniqueId()}`,
          };
          break;

        case "airtime":
          payload.payload_data = {
            network: formData.networkId,
            phone: formData.phone,
            amount: formData.amount,
            Ported_number: bypassPhoneNumber,
            pin: formData.pin, 
            airtime_type: formData.selectedAirtimeType,
            "request-id": `Airtime_${generateUniqueId()}`,
          };
          break;

        case "cable":
          payload.payload_data = {
            provider: formData.selectedCableCategory,
            plan: formData.selectedCablePlan,
            uic: formData.uicNumber,
            plan_name: formData.planName,
            bypass_uic: bypassUicNumber,
            "request-id": `Cable_${generateUniqueId()}`,
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });

      // Handle different response statuses
      if (response.data && response.data.status) {
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
              errorPopupMessage:
                response.data.message || "Something went wrong!",
              isErrorOpen: true,
            }));
        }
      } else if (response.data && response.data.error) {
        // Handle error response
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage: response.data.error || "Something went wrong!",
          isErrorOpen: true,
        }));
      } else {
        // Handle unexpected response structure
        setPopupState((prev) => ({
          ...prev,
          errorPopupMessage: "Unexpected response from the server",
          isErrorOpen: true,
        }));
      }
    } catch (error) {
      const errorMsg =
        error.response &&
        error.response.data.error &&
        String(error.response.data.error).toLowerCase().includes("insufficient") // Convert to string first
          ? "An error occurred. If error persists, please contact admin!" // Replace the entire message if it contains "insufficient"
          : error.response
          ? error.response.data.message ||
            error.response.data.error ||
            error.message
          : error.message;

      setPopupState((prev) => ({
        ...prev,
        errorPopupMessage: errorMsg.includes("Insufficient Account")
          ? "An error occurred. If error persists, please contact admin!"
          : errorMsg,
        isErrorOpen: true,
      }));
    } finally {
      setLoading(false);
    }
  }, [
    setPopupState,
    bypassPhoneNumber,
    bypassUicNumber,
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
