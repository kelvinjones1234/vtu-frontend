import { createContext, useEffect, useState, useContext } from "react";
import { GeneralContext } from "./GeneralContext";
import { AuthContext } from "./AuthenticationContext";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [dataNetworks, setDataNetworks] = useState([]);
  const [productData, setProductData] = useState([]);
  const [airtimeNetworks, setAirtimeNetworks] = useState([]);
  const [cableCategories, setCableCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allRead, setAllRead] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [terms, setTerms] = useState("");
  const [policy, setPolicy] = useState("");
  const [about, setAbout] = useState("");

  const [apiSettings, setApiSettings] = useState([]);
  const [activeApi, setActiveApi] = useState(null);

  const { api } = useContext(GeneralContext);
  const { authTokens, loginUser } = useContext(AuthContext);

  useEffect(() => {
    if (apiSettings && Array.isArray(apiSettings)) {
      const activeApiKey = apiSettings.find((api) => api.active)?.api_key;
      if (activeApiKey && activeApiKey !== activeApi) {
        setActiveApi(activeApiKey);
      }
    } else {
      console.error("apiSettings is null or not an array");
    }
  }, [apiSettings, activeApi]);

  const fetchNotifications = async () => {
    if (!authTokens) return; // Exit if authTokens is null

    setIsLoading(true);
    try {
      const response = await api.get("notifications/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      const notifications = response.data;
      setNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.is_read).length);
      setAllRead(notifications.every((n) => n.is_read));
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setErrorMessage("Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // if (!authTokens) return; // Exit if authTokens is null

      try {
        const response = await api.get("combined-data/");
        const data = response.data;
        setDataNetworks(data.dataNetworks);
        setProductData(data.productData);
        setAirtimeNetworks(data.airtimeNetworks);
        setCableCategories(data.cableCategories);
        setTerms(data.terms);
        setPolicy(data.policy);
        setAbout(data.about);
        setApiSettings(data.apiSettings);
      } catch (error) {
        console.error("Error fetching combined data:", error);
      }
    };

    fetchData();
    fetchNotifications();
  }, []); // Now it checks both loginUser and authTokens

  console.log(terms);
  const handleMarkAsRead = async (id) => {
    if (!authTokens) return; // Exit if authTokens is null

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
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount((prevCount) => prevCount - 1);
      setAllRead(unreadCount - 1 === 0);
      setSuccessMessage("Notification marked as read.");
      clearMessageAfterTimeout(setSuccessMessage);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setErrorMessage("Failed to mark notification as read.");
      clearMessageAfterTimeout(setErrorMessage);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!authTokens) return; // Exit if authTokens is null

    try {
      const unreadNotifications = notifications.filter(
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

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
      setUnreadCount(0);
      setAllRead(true);
      setSuccessMessage("All notifications marked as read.");
      clearMessageAfterTimeout(setSuccessMessage);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setErrorMessage("Failed to mark all notifications as read.");
      clearMessageAfterTimeout(setErrorMessage);
    }
  };

  const clearMessageAfterTimeout = (setMessage) => {
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  const contextData = {
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    about,
    activeApi,
    policy,
    terms,
    notifications,
    unreadCount,
    allRead,
    isLoading,
    errorMessage,
    successMessage,
    dataNetworks,
    productData,
    airtimeNetworks,
    cableCategories,
  };

  console.log("active api", activeApi);
  console.log(policy);

  return (
    <ProductContext.Provider value={contextData}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
