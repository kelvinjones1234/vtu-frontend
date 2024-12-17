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



// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { Copy, CheckCircle } from "lucide-react";
// import GeneralLeft from "./GeneralLeft";
// import GeneralRight from "./GeneralRight";
// import { Link } from "react-router-dom";
// import { GeneralContext } from "../context/GeneralContext";

// const FundWallet = () => {
//   const [fundingData, setFundingData] = useState(null);
//   const [copiedAccount, setCopiedAccount] = useState(null);
//   const { api } = useContext(GeneralContext);
//   const localStorageKey = "fundingData"; // Key for local storage

//   useEffect(() => {
//     async function fetchFundingDetails() {
//       const apiUrl = "funding-details/";

//       try {
//         const response = await api.get(apiUrl, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const data = response.data[0]; // Assuming data is an array and you're fetching the first object
//         setFundingData(data); // Update state with the fetched data
//         localStorage.setItem(localStorageKey, JSON.stringify(data)); // Store in local storage
//       } catch (error) {
//         console.error(
//           "Error fetching data from API:",
//           error.response?.status,
//           error.response?.statusText
//         );
//       }
//     }


//     const storedData = localStorage.getItem(localStorageKey);
//     if (storedData) {
//       setFundingData(JSON.parse(storedData));
//     } else {
//       fetchFundingDetails();
//     }
//   }, [api]);

//   // Destructure funding data
//   const {
//     account_details: accounts = [], // Default to an empty array if accounts are not available
//     created_at: createdOn,
//   } = fundingData || {}; // Handle null initial state gracefully

//   // Format the date dynamically
//   const formattedDate = useMemo(() => {
//     return createdOn
//       ? new Date(createdOn).toLocaleString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//         })
//       : "N/A";
//   }, [createdOn]);

//   // Function to handle copying account number
//   const handleCopyAccount = (accountNumber) => {
//     navigator.clipboard.writeText(accountNumber).then(() => {
//       setCopiedAccount(accountNumber);

//       // Reset copied state after 2 seconds
//       setTimeout(() => {
//         setCopiedAccount(null);
//       }, 1000);
//     });
//   };

//   return (
//     <div className="mt-[6rem] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
//       <GeneralLeft />
//       <div>
//         <div>
//           <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
//             Fund Wallet
//           </h2>
//           <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
//             <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
//             <div className="h-1 w-1 mx-5 bg-white rounded-full"></div>
//             <span className="text-gray-500">Fund Wallet</span>
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
//           <h1 className="text-2xl font-bold text-primary dark:text-white text-center mb-6">
//             Linked Bank Accounts for Automated Transfer
//           </h1>

//           {fundingData ? (
//             <>
//               <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
//                 Seamless Wallet Funding: Automated Bank Transfer
//               </p>
//               <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 mb-4">
//                 <p className="text-sm text-gray-700 dark:text-gray-200">
//                   Fund your wallet instantly by transferring to any of the
//                   accounts below. Transfers are automated and credited in
//                   real-time.
//                 </p>
//               </div>
//               <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 mb-4">
//                 <p className="text-sm text-gray-700 dark:text-gray-200">
//                   <strong>Note:</strong> Use your account for transfers to
//                   ensure instant processing. Funds reflect immediately.
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {accounts.map((account, index) => (
//                   <div
//                     key={index}
//                     className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-md relative"
//                   >
//                     <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//                       Bank Name:
//                     </p>
//                     <p className="text-lg font-bold text-primary dark:text-white">
//                       {account.bankName}
//                     </p>

//                     <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
//                       Account Number:
//                     </p>
//                     <div className="flex items-center">
//                       <p className="text-lg font-bold text-primary dark:text-white flex-grow">
//                         {account.accountNumber}
//                       </p>
//                       <button
//                         onClick={() => handleCopyAccount(account.accountNumber)}
//                         className="ml-2 text-gray-500 hover:text-primary transition-colors"
//                         title="Copy Account Number"
//                       >
//                         {copiedAccount === account.accountNumber ? (
//                           <CheckCircle className="w-5 h-5 text-green-500" />
//                         ) : (
//                           <Copy className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>

//                     <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
//                       Account Name:
//                     </p>
//                     <p className="text-lg font-bold text-primary dark:text-white">
//                       {account.accountName}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-500">
//               Loading funding details...
//             </p>
//           )}
//         </div>
//       </div>
//       <GeneralRight />
//     </div>
//   );
// };

// export default FundWallet;