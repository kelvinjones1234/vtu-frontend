import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useAuth } from "./AuthenticationContext";
import { useGeneral } from "./GeneralContext";

// Wallet reducer for more predictable state management
const walletReducer = (state, action) => {
  switch (action.type) {
    case "SET_BALANCE":
      return { ...state, balance: action.payload };
    case "UPDATE_BALANCE":
      return { ...state, balance: action.payload };
    default:
      return state;
  }
};

// Properly implement debounce with a cancel method
const debounce = (func, delay) => {
  let timerId;

  const debouncedFunction = function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };

  debouncedFunction.cancel = function () {
    clearTimeout(timerId);
  };

  return debouncedFunction;
};

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // Use reducer instead of useState for complex state logic
  const [walletData, dispatch] = useReducer(walletReducer, { balance: 0 });
  const { logoutUser, user } = useAuth();
  const { api } = useGeneral();

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

  // Set wallet data from user object - optimized with direct dispatch
  const fetchWalletData = useCallback(() => {
    if (user?.user?.amount !== undefined) {
      dispatch({ type: "SET_BALANCE", payload: user.user.amount });
    }
  }, [user]);

  // Update wallet data when user changes
  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // Update wallet balance with optimistic updates
  const updateWalletBalance = useCallback(
    async (amount) => {
      if (amount <= 0) {
        console.error("Invalid amount: Amount must be greater than 0.");
        return;
      }

      const previousBalance = walletData.balance;

      // Optimistic update
      dispatch({ type: "UPDATE_BALANCE", payload: amount });

      try {
        const response = await memoizedApi.put(
          "wallet/",
          { amount },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        // If server response indicates error, revert
        if (response.status !== 200) {
          dispatch({ type: "SET_BALANCE", payload: previousBalance });
          console.error("Failed to update wallet balance on the server.");
        }
      } catch (error) {
        // Revert optimistic update on error
        dispatch({ type: "SET_BALANCE", payload: previousBalance });
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

  // Clean up the debounced function when component unmounts
  useEffect(() => {
    return () => {
      if (
        debouncedUpdateWalletBalance &&
        typeof debouncedUpdateWalletBalance.cancel === "function"
      ) {
        debouncedUpdateWalletBalance.cancel();
      }
    };
  }, [debouncedUpdateWalletBalance]);

  // Optimize context value object to prevent unnecessary renders
  const value = useMemo(
    () => ({
      walletData,
      updateWalletBalance: debouncedUpdateWalletBalance,
      refreshWallet: fetchWalletData,
    }),
    [walletData, debouncedUpdateWalletBalance, fetchWalletData]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
