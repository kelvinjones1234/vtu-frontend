import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import SubmitButton from "./SubmitButton";
import FloatingLabelInput from "./FloatingLabelInput";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAuth } from "../context/AuthenticationContext";
import { useGeneral } from "../context/GeneralContext";

const accordionButtonStyle =
  "text-[1rem] w-full outline-none text-white p-1 h-[3.2rem] bg-link rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-450 ease-in-out flex items-center justify-center gap-2";

const cardStyle =
  "bg-white dark:bg-gray-800 shadow-lg p-6 mb-6 rounded-[1.5rem] shadow-lg";

const sectionTitleStyle =
  "font-semibold text-lg text-primary dark:text-white mb-4";

const Profile = () => {
  const { api } = useGeneral();
  const { user } = useAuth();

  // Consolidated loading states
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    pin: false,
  });

  // Initialize userData with user context data using useMemo
  const [userData, setUserData] = useState(
    useMemo(
      () => ({
        username: user?.user?.username || "",
        first_name: user?.user?.first_name || "",
        last_name: user?.user?.last_name || "",
        phone: user?.user?.phone || "",
        email: user?.user?.email || "",
      }),
      [user]
    )
  );

  // Single message state object
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  // UI toggle states
  const [accordionStates, setAccordionStates] = useState({
    resetPassword: false,
    resetPin: false,
  });

  // Form data states
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

  // Auto-scroll on message display
  useEffect(() => {
    if (message.text) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Auto-clear messages after 3 seconds
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Update userData when user context changes
  useEffect(() => {
    if (user?.user) {
      setUserData({
        username: user.user.username || "",
        first_name: user.user.first_name || "",
        last_name: user.user.last_name || "",
        phone: user.user.phone || "",
        email: user.user.email || "",
      });
    }
  }, [user]);

  // Toggle accordion sections
  const toggleAccordion = (section) => {
    setAccordionStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Validate form inputs with field-specific validation
  const validateField = (name, value) => {
    switch (name) {
      case "phone":
        return value && value.length !== 11
          ? "Phone number must be exactly 11 digits."
          : "";
      case "transaction_pin":
        return value && value.length !== 4
          ? "Transaction pin must be exactly 4 digits."
          : "";
      case "newPassword":
      case "confirmNewPassword":
        if (
          name === "confirmNewPassword" &&
          resetPasswordData.newPassword !== value
        ) {
          return "Passwords do not match";
        }
        return "";
      case "newPin":
      case "confirmNewPin":
        if (name === "confirmNewPin" && resetPinData.newPin !== value) {
          return "PINs do not match";
        }
        return value && value.length !== 4
          ? "PIN must be exactly 4 digits."
          : "";
      default:
        return "";
    }
  };

  // Handle form input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    // Update appropriate state based on form type
    if (["oldPassword", "newPassword", "confirmNewPassword"].includes(name)) {
      setResetPasswordData((prev) => ({ ...prev, [name]: value }));
    } else if (["oldPin", "newPin", "confirmNewPin"].includes(name)) {
      setResetPinData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }

    // Update errors state
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate all form fields
  const validateForm = (formData, formType) => {
    const newErrors = {};
    let isValid = true;

    // Validate based on form type
    if (formType === "profile") {
      if (formData.phone && formData.phone.length !== 11) {
        newErrors.phone = "Phone number must be exactly 11 digits.";
        isValid = false;
      }
    } else if (formType === "password") {
      if (!formData.oldPassword) {
        newErrors.oldPassword = "Current password is required";
        isValid = false;
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
        isValid = false;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Passwords do not match";
        isValid = false;
      }
    } else if (formType === "pin") {
      if (!formData.oldPin) {
        newErrors.oldPin = "Current PIN is required";
        isValid = false;
      }
      if (!formData.newPin || formData.newPin.length !== 4) {
        newErrors.newPin = "New PIN must be exactly 4 digits";
        isValid = false;
      }
      if (formData.newPin !== formData.confirmNewPin) {
        newErrors.confirmNewPin = "PINs do not match";
        isValid = false;
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  // Handle API error responses
  const handleApiError = (error, defaultMessage) => {
    if (error.response?.data?.message || error.response?.data?.error) {
      return error.response.data.message || error.response.data.error;
    } else if (error.request) {
      return "No response from server. Please check your connection.";
    } else {
      return defaultMessage;
    }
  };

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(userData, "profile")) {
      return;
    }

    setLoading((prev) => ({ ...prev, profile: true }));

    try {
      const updateData = {
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
      };

      await api.put("/user/", updateData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to update profile. Please try again."
      );
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // Handle password reset
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(resetPasswordData, "password")) {
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));

    try {
      await api.post("change-password/", resetPasswordData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setMessage({ type: "success", text: "Password reset successfully!" });
      setAccordionStates((prev) => ({ ...prev, resetPassword: false }));
      setResetPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to reset password. Please try again."
      );
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  // Handle PIN reset
  const handleResetPinSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(resetPinData, "pin")) {
      return;
    }

    setLoading((prev) => ({ ...prev, pin: true }));

    try {
      await api.put("user/reset-pin/", resetPinData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setMessage({ type: "success", text: "PIN reset successfully!" });
      setAccordionStates((prev) => ({ ...prev, resetPin: false }));
      setResetPinData({ oldPin: "", newPin: "", confirmNewPin: "" });
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to reset PIN. Please try again."
      );
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading((prev) => ({ ...prev, pin: false }));
    }
  };

  // Message display component
  const MessageBanner = useMemo(() => {
    if (!message.text) return null;

    const isSuccess = message.type === "success";

    return (
      <div
        className={`mb-4 p-4 rounded-lg shadow-md flex items-start ${
          isSuccess
            ? "bg-green-50 border-l-4 border-green-500"
            : "bg-red-50 border-l-4 border-red-500"
        }`}
      >
        <div className="flex-shrink-0 mr-3 mt-0.5">
          <svg
            className={`h-5 w-5 ${
              isSuccess ? "text-green-400" : "text-red-400"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {isSuccess ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </div>
        <div className="flex-1">
          <p
            className={`font-medium ${
              isSuccess ? "text-green-800" : "text-red-800"
            }`}
          >
            {isSuccess ? "Success" : "Error"}
          </p>
          <p
            className={`mt-1 text-sm ${
              isSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {message.text}
          </p>
        </div>
      </div>
    );
  }, [message]);

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
        {MessageBanner}

        {/* Personal Information Card */}
        <div className={cardStyle}>
          <h3 className={sectionTitleStyle}>Personal Information</h3>
          <form onSubmit={handleProfileSubmit}>
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
                onChange={handleChange}
                error={errors.email}
              />
              <FloatingLabelInput
                type="text"
                name="first_name"
                value={userData.first_name}
                placeholder="First Name"
                onChange={handleChange}
                error={errors.first_name}
              />
              <FloatingLabelInput
                type="text"
                name="last_name"
                value={userData.last_name}
                placeholder="Last Name"
                onChange={handleChange}
                error={errors.last_name}
              />
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <FloatingLabelInput
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                error={errors.phone}
              />
              <div className="pt-2">
                <SubmitButton label="Save Changes" loading={loading.profile} />
              </div>
            </div>
          </form>
        </div>

        {/* Security Settings Card */}
        <div className={cardStyle}>
          <h3 className={sectionTitleStyle}>Security Settings</h3>

          {/* Reset Password Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleAccordion("resetPassword")}
              className={accordionButtonStyle}
              type="button"
            >
              {accordionStates.resetPassword
                ? "Hide Reset Password"
                : "Reset Password"}
              <span className="text-lg">
                {accordionStates.resetPassword ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                accordionStates.resetPassword
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="h-auto bg-white dark:bg-gray-800 py-6 px-4 sm:px-6 md:px-8 rounded-2xl shadow-md">
                <form
                  onSubmit={handleResetPasswordSubmit}
                  className="space-y-4"
                >
                  <FloatingLabelInput
                    type="password"
                    name="oldPassword"
                    value={resetPasswordData.oldPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                    error={errors.oldPassword}
                  />
                  <FloatingLabelInput
                    type="password"
                    name="newPassword"
                    value={resetPasswordData.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                    error={errors.newPassword}
                  />
                  <FloatingLabelInput
                    type="password"
                    name="confirmNewPassword"
                    value={resetPasswordData.confirmNewPassword}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    error={errors.confirmNewPassword}
                  />
                  <div className="pt-2">
                    <SubmitButton
                      label="Reset Password"
                      loading={loading.password}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Reset PIN Section */}
          <div>
            <button
              onClick={() => toggleAccordion("resetPin")}
              className={accordionButtonStyle}
              type="button"
            >
              {accordionStates.resetPin
                ? "Hide Reset PIN"
                : "Reset Transaction PIN"}
              <span className="text-lg">
                {accordionStates.resetPin ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                accordionStates.resetPin
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="h-auto bg-white dark:bg-gray-800 py-6 px-4 sm:px-6 md:px-8 rounded-2xl shadow-md">
                <form onSubmit={handleResetPinSubmit} className="space-y-4">
                  <FloatingLabelInput
                    type="password"
                    name="oldPin"
                    value={resetPinData.oldPin}
                    onChange={handleChange}
                    placeholder="Current PIN"
                    maxLength={4}
                    error={errors.oldPin}
                  />
                  <FloatingLabelInput
                    type="password"
                    name="newPin"
                    value={resetPinData.newPin}
                    onChange={handleChange}
                    placeholder="New PIN (4 digits)"
                    maxLength={4}
                    error={errors.newPin}
                  />
                  <FloatingLabelInput
                    type="password"
                    name="confirmNewPin"
                    value={resetPinData.confirmNewPin}
                    onChange={handleChange}
                    placeholder="Confirm New PIN"
                    maxLength={4}
                    error={errors.confirmNewPin}
                  />
                  <div className="pt-2">
                    <SubmitButton label="Reset PIN" loading={loading.pin} />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default Profile;
