import {
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useAuth } from "./AuthenticationContext";
import { useGeneral } from "./GeneralContext";

export const ProductContext = createContext();

const REFRESH_INTERVAL = 48 * 60 * 60 * 1000; // 48hrs
const CACHE_KEY = "combinedData";
const MESSAGE_TIMEOUT = 3000; // 3 seconds for success/error messages

export const ProductProvider = ({ children }) => {
  const [state, setState] = useState({
    dataNetworks: [],
    productData: [],
    airtimeNetworks: [],
    cableCategories: [],
    notifications: [],
    unreadCount: 0,
    allRead: true,
    isLoading: true,
    terms: "",
    policy: "",
    about: "",
    apiSettings: [],
    activeApi: null,
    errorMessage: "",
    successMessage: "",
  });

  const { api } = useGeneral();
  const { authTokens } = useAuth();

  // Memoized update function to reduce unnecessary re-renders
  const updateState = useCallback((updates) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  }, []);

  // Clear messages after a timeout
  const clearMessage = useCallback(
    (messageType) => {
      updateState({ [messageType]: "" });
    },
    [updateState]
  );

  const fetchFromAPI = async () => {
    try {
      updateState({ isLoading: true, errorMessage: "" });

      const response = await api.get("combined-data/");
      const data = response.data;

      // Atomic update of localStorage
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));

      updateState({
        dataNetworks: data.dataNetworks || [],
        productData: data.productData || [],
        airtimeNetworks: data.airtimeNetworks || [],
        cableCategories: data.cableCategories || [],
        terms: data.terms || "",
        policy: data.policy || "",
        about: data.about || "",
        apiSettings: data.apiSettings || [],
        isLoading: false,
        activeApi: data.apiSettings?.find((api) => api.active)?.api_key || null,
      });
    } catch (error) {
      console.error("Error fetching combined data:", error);
      // Fallback to cached data if network fails
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          updateState({
            ...parsedData,
            isLoading: false,
            errorMessage: "Using cached data due to network error",
          });
        } catch (parseError) {
          updateState({
            isLoading: false,
            errorMessage: "Failed to fetch and parse data",
          });
        }
      }

      // Clear error message after timeout
      setTimeout(() => clearMessage("errorMessage"), MESSAGE_TIMEOUT);
    }
  };

  // Optimized data fetching with caching
  const fetchCombinedData = useCallback(async () => {
    const cachedData = localStorage.getItem(CACHE_KEY);

    // If no cached data, fetch from API
    if (!cachedData) {
      await fetchFromAPI();
      return;
    }

    // Use cached data first
    try {
      const parsedData = JSON.parse(cachedData);
      updateState({
        ...parsedData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error parsing cached data:", error);
      await fetchFromAPI();
    }
  }, [api, updateState, clearMessage]);

  // Fetch notifications with improved error handling
  const fetchNotifications = useCallback(async () => {
    if (!authTokens) return;

    try {
      const response = await api.get("notifications/", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const notifications = response.data;
      updateState({
        notifications,
        unreadCount: notifications.filter((n) => !n.is_read).length,
        allRead: notifications.every((n) => n.is_read),
        errorMessage: "",
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      updateState({
        errorMessage: "Failed to load notifications",
        notifications: [],
      });

      // Clear error message after timeout
      setTimeout(() => clearMessage("errorMessage"), MESSAGE_TIMEOUT);
    }
  }, [authTokens, api, updateState, clearMessage]);

  // Mark a single notification as read
  const handleMarkAsRead = useCallback(
    async (id) => {
      if (!authTokens) return;

      try {
        await api.patch(
          `notifications/${id}/`,
          { is_read: true },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );

        updateState((prevState) => {
          const updatedNotifications = prevState.notifications.map(
            (notification) =>
              notification.id === id
                ? { ...notification, is_read: true }
                : notification
          );

          return {
            notifications: updatedNotifications,
            unreadCount: prevState.unreadCount - 1,
            allRead: updatedNotifications.every((n) => n.is_read),
            successMessage: "Notification marked as read.",
          };
        });

        // Clear success message after timeout
        setTimeout(() => clearMessage("successMessage"), MESSAGE_TIMEOUT);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        updateState({
          errorMessage: "Failed to mark notification as read.",
        });

        // Clear error message after timeout
        setTimeout(() => clearMessage("errorMessage"), MESSAGE_TIMEOUT);
      }
    },
    [authTokens, api, updateState, clearMessage]
  );

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    if (!authTokens) return;

    try {
      const unreadNotifications = state.notifications.filter(
        (notification) => !notification.is_read
      );

      const markAllReadPromises = unreadNotifications.map((notification) =>
        api.patch(
          `notifications/${notification.id}/`,
          { is_read: true },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        )
      );

      await Promise.all(markAllReadPromises);

      updateState({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          is_read: true,
        })),
        unreadCount: 0,
        allRead: true,
        successMessage: "All notifications marked as read.",
      });

      // Clear success message after timeout
      setTimeout(() => clearMessage("successMessage"), MESSAGE_TIMEOUT);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      updateState({
        errorMessage: "Failed to mark all notifications as read.",
      });

      // Clear error message after timeout
      setTimeout(() => clearMessage("errorMessage"), MESSAGE_TIMEOUT);
    }
  }, [authTokens, api, state.notifications, updateState, clearMessage]);

  // Initial data load and periodic updates
  useEffect(() => {
    // Fetch initial data
    fetchCombinedData();

    // Fetch notifications
    fetchNotifications();

    // Set up interval for periodic updates
    const intervalId = setInterval(() => {
      fetchFromAPI();
      fetchNotifications();
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchCombinedData, fetchNotifications]);

  // Context value memoized to prevent unnecessary re-renders
  const contextData = useMemo(
    () => ({
      ...state,
      fetchCombinedData,
      fetchNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
    }),
    [
      state,
      fetchCombinedData,
      fetchNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
    ]
  );

  return (
    <ProductContext.Provider value={contextData}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
