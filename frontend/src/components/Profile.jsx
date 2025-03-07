import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import SubmitButton from "./SubmitButton";
import FloatingLabelInput from "./FloatingLabelInput";


const accordionButtonStyle =
  "text-[1rem] w-full outline-none text-black p-1 h-[3.2rem] bg-link rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-450 ease-in-out flex items-center justify-center gap-2";

const cardStyle =
  "bg-white dark:bg-gray-800 shadow-lg p-6 mb-6 rounded-[1.5rem] shadow-lg";

const sectionTitleStyle =
  "font-semibold text-lg text-primary dark:text-white mb-4";

const Profile = () => {
  const { api, setLoading } = useContext(GeneralContext);

  // Initialize userData with default values
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
    transaction_pin: "",
    email: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetPin, setShowResetPin] = useState(false);

  const [resetPasswordData, setResetPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [resetPinData, setResetPinData] = useState({
    oldPin: "",
    newPin: "",
    confirmNewPin: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("user/", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        // Merge API response with default userData to ensure all fields are defined
        setUserData((prevData) => ({
          ...prevData,
          ...response.data,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ type: "error", text: "Failed to fetch user data" });
      } finally {
      }
    };

    fetchUserData();
  }, [api, setLoading]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("user/", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("User data updated successfully:", response.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating user data:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Handle reset password input changes
  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle reset pin input changes
  const handleResetPinChange = (e) => {
    const { name, value } = e.target;
    setResetPinData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (userData.phone && userData.phone.length !== 11) {
      newErrors.phone = "Invalid Phone Number.";
    }
    if (userData.transaction_pin && userData.transaction_pin.length !== 4) {
      newErrors.transaction_pin = "Transaction pin must be exactly 4 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle reset password submission
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword
    ) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("change-password/", resetPasswordData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Password reset successfully:", response.data);
      setMessage({ type: "success", text: "Password reset successfully!" });
      setShowResetPassword(false);
      setResetPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage({ type: "error", text: "Failed to reset password" });
    } finally {
      setLoading(false);
    }
  };

  // Handle reset pin submission
  const handleResetPinSubmit = async (e) => {
    e.preventDefault();

    if (resetPinData.newPin !== resetPinData.confirmNewPin) {
      setMessage({ type: "error", text: "New pins do not match" });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("user/reset-pin/", resetPinData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("PIN reset successfully:", response.data);
      setMessage({ type: "success", text: "PIN reset successfully!" });
      setShowResetPin(false);
      setResetPinData({ oldPin: "", newPin: "", confirmNewPin: "" });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error resetting PIN:", error);
      setMessage({ type: "error", text: "Failed to reset PIN" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto w-full max-w-[800px]">
        <div className="mb-6">
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
            Profile
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-2 font-semibold">
            <Link
              to={"/user/dashboard"}
              className="hover:text-[#1CCEFF] transition-colors"
            >
              Dashboard
            </Link>
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Edit Profile</span>
          </div>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div
            className={`transition-all duration-300 ease-in-out p-4 rounded-lg mb-6 shadow-md ${
              message.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">
                {message.type === "success" ? "✓" : "✕"}
              </span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Personal Information Card */}
        <div className={cardStyle}>
          <h3 className={sectionTitleStyle}>Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FloatingLabelInput
              type="text"
              name="username"
              value={userData.username}
              placeholder="Username"
              disabled={true}
            />
            <FloatingLabelInput
              type="email"
              name="email"
              value={userData.email}
              placeholder="Email"
              disabled={true}
            />
            <FloatingLabelInput
              type="text"
              name="first_name"
              value={userData.first_name}
              placeholder="First Name"
              disabled={true}
            />
            <FloatingLabelInput
              type="text"
              name="last_name"
              value={userData.last_name}
              placeholder="Last Name"
              disabled={true}
            />
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingLabelInput
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              error={errors.phone}
            />
            <div className="pt-2">
              <SubmitButton label="Save Changes" />
            </div>
          </form>
        </div>

        {/* Security Settings Card */}
        <div className={cardStyle}>
          <h3 className={sectionTitleStyle}>Security Settings</h3>

          {/* Reset Password Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowResetPassword(!showResetPassword)}
              className={accordionButtonStyle}
            >
              {showResetPassword ? "Hide Reset Password" : "Reset Password"}
              <span className="text-lg">{showResetPassword ? "▲" : "▼"}</span>
            </button>
            {showResetPassword && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg borde border-gray-100 dark:border-gray-700">
                <form
                  onSubmit={handleResetPasswordSubmit}
                  className="space-y-4"
                >
                  <FloatingLabelInput
                    type="password"
                    name="oldPassword"
                    value={resetPasswordData.oldPassword}
                    onChange={handleResetPasswordChange}
                    placeholder="Current Password"
                  />
                  <FloatingLabelInput
                    type="password"
                    name="newPassword"
                    value={resetPasswordData.newPassword}
                    onChange={handleResetPasswordChange}
                    placeholder="New Password"
                  />
                  <FloatingLabelInput
                    type="password"
                    name="confirmNewPassword"
                    value={resetPasswordData.confirmNewPassword}
                    onChange={handleResetPasswordChange}
                    placeholder="Confirm New Password"
                  />
                  <div className="pt-2">
                    <SubmitButton label="Reset Password" />
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Reset PIN Section */}
          <div>
            <button
              onClick={() => setShowResetPin(!showResetPin)}
              className={accordionButtonStyle}
            >
              {showResetPin ? "Hide Reset PIN" : "Reset Transaction PIN"}
              <span className="text-lg">{showResetPin ? "▲" : "▼"}</span>
            </button>
            {showResetPin && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg borde border-gray-100 dark:border-gray-700">
                <form onSubmit={handleResetPinSubmit} className="space-y-4">
                  <FloatingLabelInput
                    type="password"
                    name="oldPin"
                    value={resetPinData.oldPin}
                    onChange={handleResetPinChange}
                    placeholder="Current PIN"
                    maxLength={4}
                  />
                  <FloatingLabelInput
                    type="password"
                    name="newPin"
                    value={resetPinData.newPin}
                    onChange={handleResetPinChange}
                    placeholder="New PIN (4 digits)"
                    maxLength={4}
                  />
                  <FloatingLabelInput
                    type="password"
                    name="confirmNewPin"
                    value={resetPinData.confirmNewPin}
                    onChange={handleResetPinChange}
                    placeholder="Confirm New PIN"
                    maxLength={4}
                  />
                  <div className="pt-2">
                    <SubmitButton label="Reset PIN" />
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default Profile;
