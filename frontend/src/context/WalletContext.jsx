import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { AuthContext } from "./AuthenticationContext";
import { GeneralContext } from "./GeneralContext";
import { debounce } from "lodash"; // For debouncing API calls

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({ balance: 0 });
  const { logoutUser } = useContext(AuthContext);
  const { api } = useContext(GeneralContext);
  const memoizedApi = useMemo(() => api, [api]);

  // Handle errors (e.g., unauthorized access, network issues)
  const handleError = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        logoutUser(); // Log out user if token is invalid
      } else {
        console.error("Error:", error.response?.data || error.message);
      }
    },
    [logoutUser]
  );

  // Fetch wallet data from the server
  const fetchWalletData = useCallback(
    async ({ signal } = {}) => {
      try {
        const response = await memoizedApi.get("wallet/", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          signal,
        });
        setWalletData(response.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          handleError(error);
        }
      }
    },
    [memoizedApi, handleError]
  );

  // Fetch wallet data on component mount
  useEffect(() => {
    const controller = new AbortController(); // For aborting the request if the component unmounts
    fetchWalletData({ signal: controller.signal });

    // Cleanup function to abort the request if the component unmounts
    return () => {
      controller.abort();
    };
  }, [fetchWalletData]);

  console.log("Wallet data:", walletData);

  // Optimistically update wallet balance and sync with the server
  const updateWalletBalance = useCallback(
    async (amount) => {
      if (amount <= 0) {
        console.error("Invalid amount: Amount must be greater than 0.");
        return;
      }

      const previousBalance = walletData.balance;
      const newBalance = previousBalance + amount;

      // Optimistic update
      setWalletData((prevData) => ({ ...prevData, balance: newBalance }));

      try {
        const response = await memoizedApi.put(
          "fund-wallet/",

          { amount },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        // If the server responds with an error, revert the optimistic update
        if (response.status !== 200) {
          setWalletData((prevData) => ({
            ...prevData,
            balance: previousBalance,
          }));
          console.error("Failed to update wallet balance on the server.");
        }
      } catch (error) {
        // Revert optimistic update on error
        setWalletData((prevData) => ({
          ...prevData,
          balance: previousBalance,
        }));
        handleError(error);
      }
    },
    [memoizedApi, walletData.balance, handleError]
  );

  // Debounced version of updateWalletBalance to prevent rapid API calls
  const debouncedUpdateWalletBalance = useMemo(
    () => debounce(updateWalletBalance, 500),
    [updateWalletBalance]
  );

  // Provide wallet context value to children
  const value = useMemo(
    () => ({
      walletData,
      updateWalletBalance: debouncedUpdateWalletBalance,
    }),
    [walletData, debouncedUpdateWalletBalance]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
