// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { GeneralContext } from "../context/GeneralContext";
// import GeneralLeft from "./GeneralLeft";
// import GeneralRight from "./GeneralRight";
// import SubmitButton from "./SubmitButton";
// import FloatingLabelInput from "./FloatingLabelInput";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { AuthContext } from "../context/AuthenticationContext";

// const accordionButtonStyle =
//   "text-[1rem] w-full outline-none text-white p-1 h-[3.2rem] bg-link rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-450 ease-in-out flex items-center justify-center gap-2";

// const cardStyle =
//   "bg-white dark:bg-gray-800 shadow-lg p-6 mb-6 rounded-[1.5rem] shadow-lg";

// const sectionTitleStyle =
//   "font-semibold text-lg text-primary dark:text-white mb-4";

// const Profile = () => {
//   const { api } = useContext(GeneralContext);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [pinLoading, setPinLoading] = useState(false);
//   const { user } = useContext(AuthContext);

//   // Initialize userData with default values
//   const [userData, setUserData] = useState({
//     username: "",
//     first_name: "",
//     last_name: "",
//     phone: "",
//     transaction_pin: "",
//     email: "",
//   });

//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [errors, setErrors] = useState({});
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showResetPin, setShowResetPin] = useState(false);

//   const [resetPasswordData, setResetPasswordData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });

//   const [resetPinData, setResetPinData] = useState({
//     oldPin: "",
//     newPin: "",
//     confirmNewPin: "",
//   });

//   useEffect(() => {
//     if (message.text) {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   }, [message]);

//   const fetchUserData = useCallback(() => {
//     if (user && user.user && user.user !== undefined) {
//       setUserData({
//         first_name: user.user.first_name,
//         last_name: user.user.last_name,
//         phone: user.user.phone,
//         username: user.user.username,
//         email: user.user.email,
//       });
//     }
//   });

//   console.log(userData);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   console.log("hello", userData);

//   // Handle form submission
//   // Replace the entire handleSubmit function with this updated version
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setProfileLoading(true);
//     try {
//       // Log what we're sending for debugging
//       console.log("Sending user data:", userData);

//       // Extract only the fields that need to be updated
//       // const updateData = {
//       //   username: userData.username,
//       //   email: userData.email,
//       //   first_name: userData.first_name,
//       //   last_name: userData.last_name,
//       //   phone: userData.phone,
//       // };

//       const updateData = {
//         username: "admin",
//         email: "admin@gmail.com",
//         first_name: "userData.first_name",
//         last_name: "userData.last_name",
//         phone: 2000000999,
//       };

//       console.log(updateData);

//       const response = await api.put("/user/", updateData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       console.log("User data updated successfully:", response.data);
//       setMessage({ type: "success", text: "Profile updated successfully!" });

//       // Update the user context if needed
//       // If you have a way to update the user context, do it here

//       // Clear message after 3 seconds
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } catch (error) {
//       console.error("Error updating user data:", error.response || error);

//       // More detailed error handling
//       if (error.response) {
//         // The server responded with a status code outside the 2xx range
//         console.error("Response data:", error.response.data);
//         console.error("Response status:", error.response.status);

//         const errorMessage =
//           error.response.data?.message ||
//           error.response.data?.error ||
//           "Failed to update profile. Server returned an error.";

//         setMessage({ type: "error", text: errorMessage });
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error("Request made but no response received", error.request);
//         setMessage({
//           type: "error",
//           text: "No response from server. Please check your connection.",
//         });
//       } else {
//         // Something happened in setting up the request
//         console.error("Error setting up request:", error.message);
//         setMessage({
//           type: "error",
//           text: "An error occurred while sending the request.",
//         });
//       }
//     } finally {
//       setProfileLoading(false);
//     }
//   }; // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));

//     // Clear errors when the user starts typing
//     if (errors[name]) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   // Handle reset password input changes
//   const handleResetPasswordChange = (e) => {
//     const { name, value } = e.target;
//     setResetPasswordData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle reset pin input changes
//   const handleResetPinChange = (e) => {
//     const { name, value } = e.target;
//     setResetPinData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Validate form inputs
//   const validateForm = () => {
//     const newErrors = {};

//     if (userData.phone && userData.phone.length !== 11) {
//       newErrors.phone = "Invalid Phone Number.";
//     }
//     if (userData.transaction_pin && userData.transaction_pin.length !== 4) {
//       newErrors.transaction_pin = "Transaction pin must be exactly 4 digits.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle reset password submission
//   const handleResetPasswordSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword
//     ) {
//       setMessage({ type: "error", text: "New passwords do not match" });
//       return;
//     }

//     setPasswordLoading(true);
//     try {
//       const response = await api.post("change-password/", resetPasswordData, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });

//       console.log("Password reset successfully:", response.data);
//       setMessage({ type: "success", text: "Password reset successfully!" });
//       setShowResetPassword(false);
//       setResetPasswordData({
//         oldPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//       });

//       // Clear message after 3 seconds
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } catch (error) {
//       console.log("Error resetting password:", error);

//       // Extract the actual error message from the backend response
//       if (error.response && error.response.data && error.response.data.error) {
//         setMessage({ type: "error", text: error.response.data.error });
//       } else {
//         setMessage({
//           type: "error",
//           text: "Something went wrong. Please try again.",
//         });
//       }
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   // Handle reset pin submission
//   const handleResetPinSubmit = async (e) => {
//     e.preventDefault();

//     if (resetPinData.newPin !== resetPinData.confirmNewPin) {
//       setMessage({ type: "error", text: "New pins do not match" });
//       return;
//     }

//     setPinLoading(true);
//     try {
//       const response = await api.put("user/reset-pin/", resetPinData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       console.log("PIN reset successfully:", response.data);
//       setMessage({ type: "success", text: "PIN reset successfully!" });
//       setShowResetPin(false);
//       setResetPinData({ oldPin: "", newPin: "", confirmNewPin: "" });

//       // Clear message after 3 seconds
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } catch (error) {
//       console.error("Error resetting PIN:", error);
//       if (error.response && error.response.data && error.response.data.error) {
//         setMessage({ type: "error", text: error.response.data.error });
//       } else {
//         setMessage({
//           type: "error",
//           text: "Something went wrong. Please try again.",
//         });
//       }
//     } finally {
//       setPinLoading(false);
//     }
//   };

//   return (
//     <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
//       <GeneralLeft />
//       <div className="mx-auto w-full max-w-[800px] mt-[1.6rem]">
//         <div className="mb-6">
//           <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
//             Profile
//           </h2>
//           <div className="flex items-center text-primary dark:text-gray-100 py-2 font-semibold">
//             <Link
//               to={"/user/dashboard"}
//               className="hover:text-[#1CCEFF] transition-colors"
//             >
//               Dashboard
//             </Link>
//             <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
//             <span className="text-gray-500">Edit Profile</span>
//           </div>
//         </div>

//         {/* Message Banner */}
//         {message.text && (
//           <div
//             className={`mb-4 p-4 rounded-lg shadow-md flex items-start ${
//               message.type === "success"
//                 ? "bg-green-50 border-l-4 border-green-500"
//                 : "bg-red-50 border-l-4 border-red-500"
//             }`}
//           >
//             <div className="flex-shrink-0 mr-3 mt-0.5">
//               <svg
//                 className={`h-5 w-5 ${
//                   message.type === "success" ? "text-green-400" : "text-red-400"
//                 }`}
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 {message.type === "success" ? (
//                   // Checkmark icon for success
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 ) : (
//                   // X icon for error
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 )}
//               </svg>
//             </div>
//             <div className="flex-1">
//               <p
//                 className={`font-medium ${
//                   message.type === "success" ? "text-green-800" : "text-red-800"
//                 }`}
//               >
//                 {message.type === "success" ? "Success" : "Error"}
//               </p>
//               <p
//                 className={`mt-1 text-sm ${
//                   message.type === "success" ? "text-green-700" : "text-red-700"
//                 }`}
//               >
//                 {message.text}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Personal Information Card */}
//         <div className={cardStyle}>
//           <h3 className={sectionTitleStyle}>Personal Information</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <FloatingLabelInput
//                 type="text"
//                 name="username"
//                 value={userData.username}
//                 placeholder="Username"
//                 disabled={true}
//               />
//               <FloatingLabelInput
//                 type="email"
//                 name="email"
//                 value={userData.email}
//                 placeholder="Email"
//                 // disabled={true}
//                 onChange={handleChange}
//               />
//               <FloatingLabelInput
//                 type="text"
//                 name="first_name"
//                 value={userData.first_name}
//                 placeholder="First Name"
//                 // disabled={true}
//                 onChange={handleChange}
//               />
//               <FloatingLabelInput
//                 type="text"
//                 name="last_name"
//                 value={userData.last_name}
//                 placeholder="Last Name"
//                 // disabled={true}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Profile Form */}
//             <div className="space-y-4">
//               <FloatingLabelInput
//                 type="text"
//                 name="phone"
//                 value={userData.phone}
//                 onChange={handleChange}
//                 placeholder="Phone Number"
//                 error={errors.phone}
//               />
//               <div className="pt-2">
//                 <SubmitButton label="Save Changes" loading={profileLoading} />
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Security Settings Card */}
//         <div className={cardStyle}>
//           <h3 className={sectionTitleStyle}>Security Settings</h3>

//           {/* Reset Password Section */}
//           <div className="mb-6">
//             <button
//               onClick={() => setShowResetPassword(!showResetPassword)}
//               className={accordionButtonStyle}
//             >
//               {showResetPassword ? "Hide Reset Password" : "Reset Password"}
//               <span className="text-lg">
//                 {showResetPassword ? <FaChevronUp /> : <FaChevronDown />}
//               </span>
//             </button>
//             <div
//               className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                 showResetPassword ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transform transition-transform duration-500 ease-in-out">
//                 <form
//                   onSubmit={handleResetPasswordSubmit}
//                   className="space-y-4"
//                 >
//                   <FloatingLabelInput
//                     type="password"
//                     name="oldPassword"
//                     value={resetPasswordData.oldPassword}
//                     onChange={handleResetPasswordChange}
//                     placeholder="Current Password"
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="newPassword"
//                     value={resetPasswordData.newPassword}
//                     onChange={handleResetPasswordChange}
//                     placeholder="New Password"
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="confirmNewPassword"
//                     value={resetPasswordData.confirmNewPassword}
//                     onChange={handleResetPasswordChange}
//                     placeholder="Confirm New Password"
//                   />
//                   <div className="pt-2">
//                     <SubmitButton
//                       label="Reset Password"
//                       loading={passwordLoading}
//                     />
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>

//           {/* Reset PIN Section */}
//           <div>
//             <button
//               onClick={() => setShowResetPin(!showResetPin)}
//               className={accordionButtonStyle}
//             >
//               {showResetPin ? "Hide Reset PIN" : "Reset Transaction PIN"}
//               <span className="text-lg">
//                 {showResetPin ? <FaChevronUp /> : <FaChevronDown />}
//               </span>
//             </button>
//             <div
//               className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                 showResetPin ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transform transition-transform duration-500 ease-in-out">
//                 <form onSubmit={handleResetPinSubmit} className="space-y-4">
//                   <FloatingLabelInput
//                     type="password"
//                     name="oldPin"
//                     value={resetPinData.oldPin}
//                     onChange={handleResetPinChange}
//                     placeholder="Current PIN"
//                     maxLength={4}
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="newPin"
//                     value={resetPinData.newPin}
//                     onChange={handleResetPinChange}
//                     placeholder="New PIN (4 digits)"
//                     maxLength={4}
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="confirmNewPin"
//                     value={resetPinData.confirmNewPin}
//                     onChange={handleResetPinChange}
//                     placeholder="Confirm New PIN"
//                     maxLength={4}
//                   />
//                   <div className="pt-2">
//                     <SubmitButton label="Reset PIN" loading={pinLoading} />
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <GeneralRight />
//     </div>
//   );
// };

// export default Profile;





// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import { GeneralContext } from "../context/GeneralContext";
// import GeneralLeft from "./GeneralLeft";
// import GeneralRight from "./GeneralRight";
// import SubmitButton from "./SubmitButton";
// import FloatingLabelInput from "./FloatingLabelInput";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// const accordionButtonStyle =
//   "text-[1rem] w-full outline-none text-white p-1 h-[3.2rem] bg-link rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-450 ease-in-out flex items-center justify-center gap-2";

// const cardStyle =
//   "bg-white dark:bg-gray-800 shadow-lg p-6 mb-6 rounded-[1.5rem] shadow-lg";

// const sectionTitleStyle =
//   "font-semibold text-lg text-primary dark:text-white mb-4";

// const Profile = () => {
//   const { api, setLoading } = useContext(GeneralContext);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [pinLoading, setPinLoading] = useState(false);

//   // Initialize userData with default values
//   const [userData, setUserData] = useState({
//     username: "",
//     first_name: "",
//     last_name: "",
//     phone: "",
//     transaction_pin: "",
//     email: "",
//   });

//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [errors, setErrors] = useState({});
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [showResetPin, setShowResetPin] = useState(false);

//   const [resetPasswordData, setResetPasswordData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });

//   const [resetPinData, setResetPinData] = useState({
//     oldPin: "",
//     newPin: "",
//     confirmNewPin: "",
//   });

//   useEffect(() => {
//     if (message.text) {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   }, [message]);

//   // Fetch user data on mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await api.get("user/", {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         });

//         // Merge API response with default userData to ensure all fields are defined
//         setUserData((prevData) => ({
//           ...prevData,
//           ...response.data,
//         }));
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setMessage({ type: "error", text: "Failed to fetch user data" });
//       } finally {
//       }
//     };

//     fetchUserData();
//   }, [api, setLoading]);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setProfileLoading(true);
//     try {
//       const response = await api.put("user/", userData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       console.log("User data updated successfully:", response.data);
//       setMessage({ type: "success", text: "Profile updated successfully!" });

//       // Clear message after 3 seconds
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } catch (error) {
//       console.error("Error updating user data:", error);
//       setMessage({ type: "error", text: "Failed to update profile" });
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));

//     // Clear errors when the user starts typing
//     if (errors[name]) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   // Handle reset password input changes
//   const handleResetPasswordChange = (e) => {
//     const { name, value } = e.target;
//     setResetPasswordData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle reset pin input changes
//   const handleResetPinChange = (e) => {
//     const { name, value } = e.target;
//     setResetPinData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Validate form inputs
//   const validateForm = () => {
//     const newErrors = {};

//     if (userData.phone && userData.phone.length !== 11) {
//       newErrors.phone = "Invalid Phone Number.";
//     }
//     if (userData.transaction_pin && userData.transaction_pin.length !== 4) {
//       newErrors.transaction_pin = "Transaction pin must be exactly 4 digits.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle reset password submission
//   const handleResetPasswordSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword
//     ) {
//       setMessage({ type: "error", text: "New passwords do not match" });
//       return;
//     }

//     setPasswordLoading(true);
//     try {
//       const response = await api.post("change-password/", resetPasswordData, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });

//       console.log("Password reset successfully:", response.data);
//       setMessage({ type: "success", text: "Password reset successfully!" });
//       setShowResetPassword(false);
//       setResetPasswordData({
//         oldPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//       });

//       // Clear message after 3 seconds
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } catch (error) {
//       console.log("Error resetting password:", error);

//       // Extract the actual error message from the backend response
//       if (error.response && error.response.data && error.response.data.error) {
//         setMessage({ type: "error", text: error.response.data.error });
//       } else {
//         setMessage({
//           type: "error",
//           text: "Something went wrong. Please try again.",
//         });
//       }
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   // Handle reset pin submission
//   const handleResetPinSubmit = async (e) => {
//     e.preventDefault();

//     if (resetPinData.newPin !== resetPinData.confirmNewPin) {
//       setMessage({ type: "error", text: "New pins do not match" });
//       return;
//     }

//     setPinLoading(true);
//     try {
//       const response = await api.put("user/reset-pin/", resetPinData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       console.log("PIN reset successfully:", response.data);
//       setMessage({ type: "success", text: "PIN reset successfully!" });
//       setShowResetPin(false);
//       setResetPinData({ oldPin: "", newPin: "", confirmNewPin: "" });

//       // Clear message after 3 seconds
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } catch (error) {
//       console.error("Error resetting PIN:", error);
//       if (error.response && error.response.data && error.response.data.error) {
//         setMessage({ type: "error", text: error.response.data.error });
//       } else {
//         setMessage({
//           type: "error",
//           text: "Something went wrong. Please try again.",
//         });
//       }
//     } finally {
//       setPinLoading(false);
//     }
//   };

//   return (
//     <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
//       <GeneralLeft />
//       <div className="mx-auto w-full max-w-[800px] mt-[1.6rem]">
//         <div className="mb-6">
//           <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
//             Profile
//           </h2>
//           <div className="flex items-center text-primary dark:text-gray-100 py-2 font-semibold">
//             <Link
//               to={"/user/dashboard"}
//               className="hover:text-[#1CCEFF] transition-colors"
//             >
//               Dashboard
//             </Link>
//             <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
//             <span className="text-gray-500">Edit Profile</span>
//           </div>
//         </div>

//         {/* Message Banner */}
//         {message.text && (
//           <div
//             className={`mb-4 p-4 rounded-lg shadow-md flex items-start ${
//               message.type === "success"
//                 ? "bg-green-50 border-l-4 border-green-500"
//                 : "bg-red-50 border-l-4 border-red-500"
//             }`}
//           >
//             <div className="flex-shrink-0 mr-3 mt-0.5">
//               <svg
//                 className={`h-5 w-5 ${
//                   message.type === "success" ? "text-green-400" : "text-red-400"
//                 }`}
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 {message.type === "success" ? (
//                   // Checkmark icon for success
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 ) : (
//                   // X icon for error
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 )}
//               </svg>
//             </div>
//             <div className="flex-1">
//               <p
//                 className={`font-medium ${
//                   message.type === "success" ? "text-green-800" : "text-red-800"
//                 }`}
//               >
//                 {message.type === "success" ? "Success" : "Error"}
//               </p>
//               <p
//                 className={`mt-1 text-sm ${
//                   message.type === "success" ? "text-green-700" : "text-red-700"
//                 }`}
//               >
//                 {message.text}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Personal Information Card */}
//         <div className={cardStyle}>
//           <h3 className={sectionTitleStyle}>Personal Information</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <FloatingLabelInput
//                 type="text"
//                 name="username"
//                 value={userData.username}
//                 placeholder="Username"
//                 disabled={true}
//               />
//               <FloatingLabelInput
//                 type="email"
//                 name="email"
//                 value={userData.email}
//                 placeholder="Email"
//                 // disabled={true}
//                 onChange={handleChange}
//               />
//               <FloatingLabelInput
//                 type="text"
//                 name="first_name"
//                 value={userData.first_name}
//                 placeholder="First Name"
//                 // disabled={true}
//                 onChange={handleChange}
//               />
//               <FloatingLabelInput
//                 type="text"
//                 name="last_name"
//                 value={userData.last_name}
//                 placeholder="Last Name"
//                 // disabled={true}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Profile Form */}
//             <div className="space-y-4">
//               <FloatingLabelInput
//                 type="text"
//                 name="phone"
//                 value={userData.phone}
//                 onChange={handleChange}
//                 placeholder="Phone Number"
//                 error={errors.phone}
//               />
//               <div className="pt-2">
//                 <SubmitButton label="Save Changes" loading={profileLoading} />
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Security Settings Card */}
//         <div className={cardStyle}>
//           <h3 className={sectionTitleStyle}>Security Settings</h3>

//           {/* Reset Password Section */}
//           <div className="mb-6">
//             <button
//               onClick={() => setShowResetPassword(!showResetPassword)}
//               className={accordionButtonStyle}
//             >
//               {showResetPassword ? "Hide Reset Password" : "Reset Password"}
//               <span className="text-lg">
//                 {showResetPassword ? <FaChevronUp /> : <FaChevronDown />}
//               </span>
//             </button>
//             <div
//               className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                 showResetPassword ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transform transition-transform duration-500 ease-in-out">
//                 <form
//                   onSubmit={handleResetPasswordSubmit}
//                   className="space-y-4"
//                 >
//                   <FloatingLabelInput
//                     type="password"
//                     name="oldPassword"
//                     value={resetPasswordData.oldPassword}
//                     onChange={handleResetPasswordChange}
//                     placeholder="Current Password"
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="newPassword"
//                     value={resetPasswordData.newPassword}
//                     onChange={handleResetPasswordChange}
//                     placeholder="New Password"
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="confirmNewPassword"
//                     value={resetPasswordData.confirmNewPassword}
//                     onChange={handleResetPasswordChange}
//                     placeholder="Confirm New Password"
//                   />
//                   <div className="pt-2">
//                     <SubmitButton
//                       label="Reset Password"
//                       loading={passwordLoading}
//                     />
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>

//           {/* Reset PIN Section */}
//           <div>
//             <button
//               onClick={() => setShowResetPin(!showResetPin)}
//               className={accordionButtonStyle}
//             >
//               {showResetPin ? "Hide Reset PIN" : "Reset Transaction PIN"}
//               <span className="text-lg">
//                 {showResetPin ? <FaChevronUp /> : <FaChevronDown />}
//               </span>
//             </button>
//             <div
//               className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                 showResetPin ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transform transition-transform duration-500 ease-in-out">
//                 <form onSubmit={handleResetPinSubmit} className="space-y-4">
//                   <FloatingLabelInput
//                     type="password"
//                     name="oldPin"
//                     value={resetPinData.oldPin}
//                     onChange={handleResetPinChange}
//                     placeholder="Current PIN"
//                     maxLength={4}
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="newPin"
//                     value={resetPinData.newPin}
//                     onChange={handleResetPinChange}
//                     placeholder="New PIN (4 digits)"
//                     maxLength={4}
//                   />
//                   <FloatingLabelInput
//                     type="password"
//                     name="confirmNewPin"
//                     value={resetPinData.confirmNewPin}
//                     onChange={handleResetPinChange}
//                     placeholder="Confirm New PIN"
//                     maxLength={4}
//                   />
//                   <div className="pt-2">
//                     <SubmitButton label="Reset PIN" loading={pinLoading} />
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <GeneralRight />
//     </div>
//   );
// };

// export default Profile;
