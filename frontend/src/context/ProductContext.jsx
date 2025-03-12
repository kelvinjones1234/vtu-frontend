import {
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useGeneral } from "./GeneralContext";
import { useAuth } from "./AuthenticationContext";

export const ProductContext = createContext();

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
  const { user } = useAuth();

  const [popupState, setPopupState] = useState({
    isConfirmOpen: false,
    isErrorOpen: false,
    isSuccessOpen: false,
    successMessage: "",
    errorPopupMessage: "",
  });

  const handleSave = async (e, formData, validInputs) => {
    e.preventDefault();

    if (validInputs()) {
      const cleanedFormData = {
        shortcut_name: formData.title, // Extract title dynamically
        shortcut_payload: formData, // Send the dynamic form data
      };

      try {
        const response = await api.post("shortcuts/", cleanedFormData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log("Response Data:", response.data);
        // alert("Shortcut saved successfully!");
        setPopupState((prev) => ({
          ...prev,
          successMessage: "Shortcut saved successfully!",
          isSuccessOpen: true,
        }));
      } catch (error) {
        console.error(
          "Error saving shortcut:",
          error.response ? error.response.data : error.message
        );
        alert("Failed to save shortcut. Please try again.");
      }
    }
  };

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
  }, [api, updateState, clearMessage]);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
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
            },
            withCredentials: true,
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
  }, [api, state.notifications, updateState, clearMessage]);

  // Initial data load and periodic updates
  useEffect(() => {
    // Fetch initial data
    fetchCombinedData();

    // Fetch notifications
    user && fetchNotifications();
  }, [fetchCombinedData, user, fetchNotifications]);

  // Context value memoized to prevent unnecessary re-renders
  const contextData = useMemo(
    () => ({
      ...state,
      fetchCombinedData,
      fetchNotifications,
      handleMarkAllAsRead,
      // setDataFormData,
      handleSave,
      // setAirtimeFormData,
      // setElectricityFormData,
      // setCableFormData,
      // dataFormData,
      // airtimeFormData,
      // electricityFormData,
      // cableFormData,
      popupState,
      setPopupState,
    }),
    [
      state,
      fetchCombinedData,
      fetchNotifications,
      handleMarkAllAsRead,
      // setDataFormData,
      handleSave,
      // setAirtimeFormData,
      // setElectricityFormData,
      // setCableFormData,
      // dataFormData,
      // airtimeFormData,
      // electricityFormData,
      // cableFormData,
      popupState,
      setPopupState,
    ]
  );

  return (
    <ProductContext.Provider value={contextData}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
