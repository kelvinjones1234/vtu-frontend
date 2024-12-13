import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [responseMessage, setResponseMessage] = useState(""); // To store the API response
  const [loading, setLoading] = useState(false); // Loading state for button feedback

  // API Credentials
  const apiKey = "MK_TEST_5TLTGUVZ8K";
  const clientSecret = "FT4DD1PJC2SXDHC5V069HDUALMGERT16";
  const encodedCredentials = btoa(`${apiKey}:${clientSecret}`); // Base64 encode

  // Data to be sent in the POST request
  const requestData = {
    accountReference: "abc1niui23",
    accountName: "Test Reserved Account",
    currencyCode: "NGN",
    contractCode: "100693167467",
    customerEmail: "test@tester.com",
    customerName: "John Doe",
    bvn: "21212121212",
    getAllAvailableBanks: true,
  };

  const handleButtonClick = async () => {
    setLoading(true);
    setResponseMessage(""); // Clear previous response

    try {
      const response = await axios.post(
        "https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts/",
        requestData,
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMessage(JSON.stringify(response.data, null, 2)); // Display response data
    } catch (error) {
      console.error("Error making the request:", error);
      setResponseMessage(
        error.response
          ? JSON.stringify(error.response.data, null, 2)
          : "An error occurred while making the request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Monnify Reserved Account Creator</h1>
      <button
        onClick={handleButtonClick}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Reserved Account"}
      </button>
      <div style={{ marginTop: "20px" }}>
        <h2>Response:</h2>
        <pre
          style={{
            backgroundColor: "#f4f4f4",
            padding: "10px",
            borderRadius: "5px",
            overflow: "auto",
            maxHeight: "300px",
          }}
        >
          {responseMessage || "Click the button to see the response"}
        </pre>
      </div>
    </div>
  );
};

export default App;









// import { React, lazy, Suspense } from "react";
// import { BrowserRouter } from "react-router-dom";
// import AuthProvider from "./context/AuthenticationContext";
// import ProductProvider from "./context/ProductContext";
// import { WalletProvider } from "./context/WalletContext";
// import GeneralProvider from "./context/GeneralContext";
// import ParticleComponent from "./components/ParticleComponent";
// import ScrollToTop from "./components/ScrollTop";
// import ErrorBoundary from "./pages/ErrorBoundary";
// import LoadingSpinner from "./components/LoadingSpinner";

// // Lazy load the AppContent component
// const AppContent = lazy(() => import("./AppContent"));

// function App() {
//   return (
//     <BrowserRouter>
//       <GeneralProvider>
//         <AuthProvider>
//           <ProductProvider>
//             <WalletProvider>
//               <div className="absolute top-0 left-0 w-full min-h-full bg-white dark:bg-dark-custom-gradient z-[-100]"></div>
//               <ParticleComponent className="particles" />
//               <ScrollToTop />
//               <ErrorBoundary>
//                 <Suspense
//                   fallback={
//                     <div className="flex items-center justify-center h-screen">
//                       <LoadingSpinner />
//                     </div>
//                   }
//                 >
//                   <AppContent />
//                 </Suspense>
//               </ErrorBoundary>
//             </WalletProvider>
//           </ProductProvider>
//         </AuthProvider>
//       </GeneralProvider>
//     </BrowserRouter>
//   );
// }

// export default App;




// import {
//   createContext,
//   useEffect,
//   useState,
//   useContext,
//   useMemo,
//   useCallback,
// } from "react";
// import { GeneralContext } from "./GeneralContext";
// import { AuthContext } from "./AuthenticationContext";

// export const ProductContext = createContext();

// const ProductProvider = ({ children }) => {
//   const [dataNetworks, setDataNetworks] = useState([]);
//   const [productData, setProductData] = useState([]);
//   const [airtimeNetworks, setAirtimeNetworks] = useState([]);
//   const [cableCategories, setCableCategories] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [allRead, setAllRead] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [terms, setTerms] = useState("");
//   const [policy, setPolicy] = useState("");
//   const [about, setAbout] = useState("");
//   const [apiSettings, setApiSettings] = useState([]);
//   const [activeApi, setActiveApi] = useState(null);

//   const { api } = useContext(GeneralContext);
//   const { authTokens } = useContext(AuthContext);

//   useEffect(() => {
//     if (apiSettings && Array.isArray(apiSettings)) {
//       const activeApiKey = apiSettings.find((api) => api.active)?.api_key;
//       if (activeApiKey && activeApiKey !== activeApi) {
//         setActiveApi(activeApiKey);
//       }
//     } else {
//       console.error("apiSettings is null or not an array");
//     }
//   }, [apiSettings, activeApi]);

//   const fetchNotifications = useCallback(async () => {
//     if (!authTokens) return; // Exit if authTokens is null

//     setIsLoading(true);
//     try {
//       const response = await api.get("notifications/", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authTokens.access}`,
//         },
//       });
//       const notifications = response.data;
//       setNotifications(notifications);
//       setUnreadCount(notifications.filter((n) => !n.is_read).length);
//       setAllRead(notifications.every((n) => n.is_read));
//       setErrorMessage("");
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setErrorMessage("Failed to load notifications.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [authTokens, api]);

//   const fetchAndUpdateLocalStorage = useCallback(async () => {
//     try {
//       const response = await api.get("combined-data/");
//       const data = response.data;

//       // Update local storage
//       localStorage.setItem("combinedData", JSON.stringify(data));

//       // Update state
//       setDataNetworks(data.dataNetworks);
//       setProductData(data.productData);
//       setAirtimeNetworks(data.airtimeNetworks);
//       setCableCategories(data.cableCategories);
//       setTerms(data.terms);
//       setPolicy(data.policy);
//       setAbout(data.about);
//       setApiSettings(data.apiSettings);
//     } catch (error) {
//       console.error("Error fetching combined data:", error);
//     }
//   }, [api]);

//   useEffect(() => {
//     // Initial fetch from local storage or API
//     const cachedData = localStorage.getItem("combinedData");

//     if (cachedData) {
//       // If cached data exists, use it
//       const parsedData = JSON.parse(cachedData);
//       setDataNetworks(parsedData.dataNetworks);
//       setProductData(parsedData.productData);
//       setAirtimeNetworks(parsedData.airtimeNetworks);
//       setCableCategories(parsedData.cableCategories);
//       setTerms(parsedData.terms);
//       setPolicy(parsedData.policy);
//       setAbout(parsedData.about);
//       setApiSettings(parsedData.apiSettings);
//     }

//     // Fetch notifications and start periodic updates
//     fetchNotifications();
//     fetchAndUpdateLocalStorage();

//     // Set up an interval to refetch and update local storage every minute
//     const intervalId = setInterval(fetchAndUpdateLocalStorage, 48 * 60 * 60 * 1000); // 24hrs minute in milliseconds

//     // Clear the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, [fetchNotifications, fetchAndUpdateLocalStorage]);

//   const handleMarkAsRead = useCallback(
//     async (id) => {
//       if (!authTokens) return; // Exit if authTokens is null

//       try {
//         await api.patch(
//           `notifications/${id}/`,
//           { is_read: true },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${authTokens.access}`,
//             },
//           }
//         );
//         setNotifications((prevNotifications) =>
//           prevNotifications.map((notification) =>
//             notification.id === id
//               ? { ...notification, is_read: true }
//               : notification
//           )
//         );
//         setUnreadCount((prevCount) => prevCount - 1);
//         setAllRead(unreadCount - 1 === 0);
//         setSuccessMessage("Notification marked as read.");
//         clearMessageAfterTimeout(setSuccessMessage);
//       } catch (error) {
//         console.error("Error marking notification as read:", error);
//         setErrorMessage("Failed to mark notification as read.");
//         clearMessageAfterTimeout(setErrorMessage);
//       }
//     },
//     [authTokens, api, unreadCount]
//   );

//   const handleMarkAllAsRead = useCallback(async () => {
//     if (!authTokens) return; // Exit if authTokens is null

//     try {
//       const unreadNotifications = notifications.filter(
//         (notification) => !notification.is_read
//       );
//       const markAllReadPromises = unreadNotifications.map((notification) =>
//         api.patch(
//           `notifications/${notification.id}/`,
//           { is_read: true },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${authTokens.access}`,
//             },
//           }
//         )
//       );

//       await Promise.all(markAllReadPromises);

//       setNotifications((prevNotifications) =>
//         prevNotifications.map((notification) => ({
//           ...notification,
//           is_read: true,
//         }))
//       );
//       setUnreadCount(0);
//       setAllRead(true);
//       setSuccessMessage("All notifications marked as read.");
//       clearMessageAfterTimeout(setSuccessMessage);
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//       setErrorMessage("Failed to mark all notifications as read.");
//       clearMessageAfterTimeout(setErrorMessage);
//     }
//   }, [authTokens, api, notifications]);

//   const clearMessageAfterTimeout = useCallback((setMessage) => {
//     setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
//   }, []);

//   const contextData = useMemo(
//     () => ({
//       fetchNotifications,
//       handleMarkAsRead,
//       handleMarkAllAsRead,
//       about,
//       activeApi,
//       policy,
//       terms,
//       notifications,
//       unreadCount,
//       allRead,
//       isLoading,
//       errorMessage,
//       successMessage,
//       dataNetworks,
//       productData,
//       airtimeNetworks,
//       cableCategories,
//     }),
//     [
//       fetchNotifications,
//       handleMarkAsRead,
//       handleMarkAllAsRead,
//       about,
//       activeApi,
//       policy,
//       terms,
//       notifications,
//       unreadCount,
//       allRead,
//       isLoading,
//       errorMessage,
//       successMessage,
//       dataNetworks,
//       productData,
//       airtimeNetworks,
//       cableCategories,
//     ]
//   );

//   return (
//     <ProductContext.Provider value={contextData}>
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export default ProductProvider;
