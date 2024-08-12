import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { useWallet } from "../context/WalletContext";
import { GeneralContext } from "../context/GeneralContext";

const inputStyle =
  "transition duration-450 ease-in-out my-2 w-full text-primary dark:text-white py-1 px-3 h-[2.8rem] text-[1.2rem] rounded-2xl outline-0 dark:bg-[#18202F] bg-white border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const Transfer = ({ setTransferForm }) => {
  const {api} = useContext(GeneralContext)

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const { authTokens, user } = useContext(AuthContext);
  const { walletData, updateWalletBalance } = useWallet();

  const validateInputs = () => {
    if (!username) {
      setMessage("Please enter the recipient's username");
      return false;
    }
    if (!amount) {
      setMessage("Please enter an amount");
      return false;
    }
    if (!pin) {
      setMessage("Please enter your PIN");
      return false;
    }
    return true;
  };

  const transfer = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    try {
      // Fetch the wallet data
      const walletResponse = await api.get(
        `wallet/${user.username}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      const walletData = walletResponse.data;

      // Check if the balance is sufficient
      if (walletData.balance < parseFloat(amount)) {
        setMessage("Insufficient funds");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }

      // Check if the provided PIN matches the stored PIN
      if (walletData.wallet_name.transaction_pin !== pin) {
        setMessage("Incorrect PIN");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }
      if (walletData.wallet_name.username === username) {
        setMessage("Cannot Transfer to self");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }

      // Perform the transfer
      const response = await api.post(
        "transfer/",
        {
          username: username.toLowerCase(),
          amount: amount,
          transaction_pin: pin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      setMessage("Transfer successful!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500);
      setTimeout(() => setTransferForm(false), 1500);

      // Update wallet balance in context
      updateWalletBalance(walletData.balance - parseFloat(amount));

      // Reset form fields
      setUsername("");
      setAmount("");
      setPin("");
    } catch (error) {
      console.error("Transfer Error:", error);
      setMessage(error.response.data.error);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };
  return (
    <div className="bg-primary bg-opacity-0 max-w-[208px]">
      <div className="flex flex-col justify-center border-[0.01rem] border-link dark:border-gray-700 p-5 rounded-[1.5rem] bg-opacity-15 shadow-lg shadow-indigo-950/10">
        {showMessage && (
          <div className="text-white mt-2 text-center transition-opacity duration-1000 ease-in-out opacity-100">
            {message}
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

          <button
            className="text-[1rem] my-2 w-full outline-none text-white p-1 h-[2.8rem] bg-link text-black rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-450 ease-in-out"
            type="submit"
          >
            Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
