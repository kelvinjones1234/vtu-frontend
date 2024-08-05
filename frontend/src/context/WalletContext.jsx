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

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({ balance: 0 });
  const { user, authTokens, logoutUser } = useContext(AuthContext);
  const { api } = useContext(GeneralContext);

  const fetchWalletData = useCallback(async () => {
    if (!user?.username || !authTokens?.access) return;

    try {
      const response = await api.get(`wallet/${user.username}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setWalletData(response.data);
    } catch (error) {
      error.response.statusText === "Unauthorized" && logoutUser();
      console.error("Error:", error.response?.data || error.message);
    }
  }, [user, authTokens, api]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const updateWalletBalance = useCallback((newBalance) => {
    setWalletData((prevData) => ({ ...prevData, balance: newBalance }));
  }, []);

  const value = useMemo(
    () => ({
      walletData,
      updateWalletBalance,
      refreshWallet: fetchWalletData,
    }),
    [walletData, updateWalletBalance, fetchWalletData]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
