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
import { debounce } from "lodash";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({ balance: 0 });
  const { logoutUser } = useContext(AuthContext);
  const { api } = useContext(GeneralContext);
  const { user } = useContext(AuthContext);

  // Memoize the API reference
  const memoizedApi = useMemo(() => api, [api]);

  // Handle errors
  const handleError = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        logoutUser();
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
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          signal,
        });

        // Only update if data has changed
        if (JSON.stringify(response.data) !== JSON.stringify(walletData)) {
          setWalletData(response.data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          handleError(error);
        }
      }
    },
    [memoizedApi, handleError, walletData]
  );

  // Fetch wallet data on component mount or when user changes
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    fetchWalletData({ signal: controller.signal });

    return () => controller.abort();
  }, [fetchWalletData, user]);

  // Update wallet balance with optimistic updates
  const updateWalletBalance = useCallback(
    async (amount) => {
      if (amount <= 0) {
        console.error("Invalid amount: Amount must be greater than 0.");
        return;
      }

      const previousBalance = walletData.balance;
      const newBalance = previousBalance + amount;

      // Skip update if balance would be the same (defensive)
      if (newBalance === previousBalance) return;

      // Optimistic update
      setWalletData((prevData) => ({ ...prevData, balance: newBalance }));

      try {
        const response = await memoizedApi.put(
          "fund-wallet/",
          { amount },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        // If server response indicates error, revert
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

  // Create a stable debounced update function
  const debouncedUpdateWalletBalance = useMemo(
    () => debounce(updateWalletBalance, 500),
    [updateWalletBalance]
  );

  // Optimize context value object to prevent unnecessary renders
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
