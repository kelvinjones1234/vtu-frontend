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
  const memoizedApi = useMemo(() => api, [api]);

  const handleError = (error) => {
    if (error.response?.status === 401) {
      logoutUser();
    } else {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const fetchWalletData = useCallback(
    async ({ signal }) => {
      if (!user?.username || !authTokens?.access) return;

      try {
        const response = await memoizedApi.get(`wallet/${user.username}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          signal,
        });
        setWalletData(response.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          handleError(error);
        }
      }
    },
    [user, authTokens, memoizedApi]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchWalletData({ signal: controller.signal });
    return () => controller.abort();
  }, [fetchWalletData]);

  const updateWalletBalance = useCallback(
    async (newBalance, amount) => {
      try {
        const response = await memoizedApi.put(
          `fund-wallet/${user.username}/`,
          { balance: amount },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );

        if (response.status === 200) {
          setWalletData((prevData) => ({ ...prevData, balance: newBalance }));
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    },
    [user, authTokens, memoizedApi]
  );

  const value = useMemo(
    () => ({
      walletData,
      setWalletData,
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
