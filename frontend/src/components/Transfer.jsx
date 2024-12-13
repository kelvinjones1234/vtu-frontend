import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { useWallet } from "../context/WalletContext";
import { GeneralContext } from "../context/GeneralContext";
import SubmitButton from "../components/SubmitButton";

const inputStyle =
  "transition duration-450 font-normal ease-in-out my-2 w-full text-primary dark:text-white py-1 px-3 h-[2.8rem] text-[1.2rem] rounded-2xl outline-0 dark:bg-[#18202F] bg-white border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const Transfer = () => {
  const { api, setLoading, setMobileTransferForm } = useContext(GeneralContext);
  const { authTokens, user } = useContext(AuthContext);
  const { updateWalletBalance } = useWallet();

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const validateInputs = () => {
    const newError = {};
    if (!username) {
      newError.usernameError = "Please enter the recipient's username";
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newError.amountError = "Please enter a valid amount";
    }
    if (!pin) {
      newError.pinError = "Please enter your PIN";
    }
    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

  const transfer = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    try {
      setLoading(true);

      // Fetch the wallet data
      const walletResponse = await api.get(`wallet/${user.username}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      const walletData = walletResponse.data;

      // Check if the balance is sufficient
      if (walletData.balance < parseFloat(amount)) {
        setErrorMessage({ balanceError: "Insufficient funds" });
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }

      // Check if the provided PIN matches the stored PIN
      if (walletData.wallet_name.transaction_pin !== pin) {
        setErrorMessage({ pinError: "Incorrect PIN" });
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }

      if (walletData.wallet_name.username === username.toLowerCase()) {
        setErrorMessage({ usernameError: "Cannot transfer to yourself" });
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }

      // Proceed with the transfer
      await api.post(
        "transfer/",
        {
          username: username.toLowerCase(),
          amount: parseFloat(amount),
          transaction_pin: pin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      // Success message
      setSuccessMessage("Transfer Successful!");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setSuccessMessage(null);
        if (setMobileTransferForm) {
          setMobileTransferForm(false);
        }
      }, 1500);

      // Update wallet balance in context
      updateWalletBalance(walletData.balance - parseFloat(amount));

      // Reset form fields
      setUsername("");
      setAmount("");
      setPin("");
    } catch (error) {
      console.error("Transfer Error:", error);
      setErrorMessage({
        anonymousError:
          error.response?.data?.error || "An error occurred during the transfer",
      });
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary bg-opacity-0 max-w-[208px]">
      <div className="flex flex-col justify-center border-[0.01rem] border-link dark:border-gray-700 p-5 rounded-[1.5rem] bg-opacity-15 shadow-lg shadow-indigo-950/10">
        {showMessage && (
          <div
            className={`mb-4 p-4 rounded-lg shadow-md flex items-start border-l-4 ${
              successMessage
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {successMessage ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  successMessage ? "text-green-800" : "text-red-800"
                }`}
              >
                {successMessage ? "Success" : "Error"}
              </p>
              <ul className="mt-1 text-sm">
                {successMessage ? (
                  <li className="text-green-800">{successMessage}</li>
                ) : (
                  Object.values(errorMessage).map(
                    (error, index) =>
                      error && (
                        <li key={index} className="text-red-800">
                          {error}
                        </li>
                      )
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={transfer}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            aria-label="Username"
            className={`${inputStyle}`}
          />

          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            aria-label="Amount"
            className={`${inputStyle}`}
          />

          <input
            onChange={(e) => setPin(e.target.value)}
            value={pin}
            type="password"
            placeholder="Pin"
            aria-label="Pin"
            autoComplete="current-password"
            className={`${inputStyle}`}
          />
          <SubmitButton label="Transfer" />
        </form>
      </div>
    </div>
  );
};

export default Transfer;