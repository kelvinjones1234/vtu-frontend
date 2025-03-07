import { useCallback } from "react";
import { useWallet } from "../context/WalletContext";
import { GeneralContext } from "../context/GeneralContext";
import { AuthContext } from "../context/AuthenticationContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"; 


export const useTransactionSubmit = ({
  validInputs,
  setPopupState,
  formData,
  generateUniqueId,
  bypassMeterNumber,
  bypassPhoneNumber,
  bypassUicNumber,
  productType,
}) => {
  const { user, rememberMe, logoutUser } = useContext(AuthContext);
  const { api, setLoading } = useContext(GeneralContext);
  const { walletData, setWalletData } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (validInputs()) {
        if (rememberMe) {
          // Store the "Remember Me" flag in localStorage
          localStorage.setItem("rememberMe", "true");
        } else {
          // Remove "Remember Me" flag if not checked
          localStorage.removeItem("rememberMe");
        }

        try {
          // Send login request (cookies will be handled automatically)
          const response = await api.post(
            "/login/",
            { username, password },
            { withCredentials: true }
          );

          if (response.status === 200) {
            console.log("Login successful");
            navigate("/user/dashboard");
          } else {
            console.log("Unexpected response:", response);
          }
        } catch (error) {
          console.error("Login failed:", error.response?.data || error);
          alert("Login failed. Please check your credentials.");
        }
      }
    },
    [validInputs, rememberMe, navigate]
  );

  const handleConfirm = useCallback(async () => {
    setPopupState((prev) => ({ ...prev, isConfirmOpen: false }));
    setLoading(true);

    try {
      let payload = {
        payload_data: {},
        transaction_type: productType,
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
            amount: formData.price,
            url: formData.url,
            api_name: formData.api_name,
            "request-id": `Data_${generateUniqueId()}`,
          };
          break;

        case "airtime":
          payload.payload_data = {
            network: formData.networkId,
            phone: formData.phone,
            amount: formData.amount,
            bypass: bypassPhoneNumber,
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
            bypass: bypassUicNumber,
            "request-id": `Cable_${generateUniqueId()}`,
          };
          break;

        case "electricity":
          payload.payload_data = {
            disco: formData.selectedDisco,
            meterNumber: formData.meterNumber,
            meterType: formData.selectedMeterType,
            amount: formData.amount,
            bypass: bypassMeterNumber,
            disco_id: formData.selectedDiscoId,
            charges: formData.charges,
            "request-id": `Electricity_${generateUniqueId()}`,
          };
          break;

        default:
          throw new Error("Invalid service type");
      }

      const response = await api.post("post_payment/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
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
        String(error.response.data.error).toLowerCase().includes("insufficient")
          ? "An error occurred. If error persists, please contact admin!"
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
    bypassMeterNumber,
    api,
    setLoading,
    user.username,
    user.user_id,
  ]);

  return { handleSubmit, handleConfirm };
};
