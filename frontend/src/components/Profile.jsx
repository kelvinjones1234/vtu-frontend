import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const Profile = () => {
  const { authTokens } = useContext(AuthContext);
  const { api, setLoading } = useContext(GeneralContext);
  

  // Initialize userData with default values
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
    transaction_pin: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("user/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        });

        // Merge API response with default userData to ensure all fields are defined
        setUserData((prevData) => ({
          ...prevData,
          ...response.data,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ type: "error", text: "Failed to fetch user data" });
      }
    };

    fetchUserData();
  }, [api, authTokens.access]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.put("user/", userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      console.log("User data updated successfully:", response.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating user data:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
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

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (userData.phone.length !== 11) {
      newErrors.phone = "Invalid Phone Number.";
    }
    if (userData.transaction_pin.length !== 4) {
      newErrors.transaction_pin = "Transaction pin must be exactly 4 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto w-full max-w-[800px]">
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
            Profile
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Edit Profile</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Message Banner */}
          {message.text && (
            <div
              className={`transition-opacity duration-1000 ease-in-out p-2 rounded mb-4 ${
                message.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                disabled
                type="text"
                name="username"
                aria-label="User Name"
                value={userData.username || ""}
                className={`${inputStyle}`}
              />
            </div>
            <div>
              <input
                disabled
                type="text"
                name="first_name"
                aria-label="First Name"
                value={userData.first_name || ""}
                className={`${inputStyle}`}
              />
            </div>
            <div>
              <input
                disabled
                type="text"
                name="last_name"
                aria-label="Last Name"
                value={userData.last_name || ""}
                className={`${inputStyle}`}
              />
            </div>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                aria-label="Phone number"
                value={userData.phone || ""}
                onChange={handleChange}
                className={`${inputStyle}`}
              />
              {errors.phone && (
                <div className="text-red-500">{errors.phone}</div>
              )}
            </div>
            <div>
              <input
                type="password"
                name="transaction_pin"
                placeholder="Pin"
                aria-label="Transaction Pin"
                value={userData.transaction_pin || ""}
                onChange={handleChange}
                className={`${inputStyle}`}
              />
              {errors.transaction_pin && (
                <div className="text-red-500">{errors.transaction_pin}</div>
              )}
            </div>
            <div>
              <button
                className="text-[1rem] my-2 w-full outline-none text-white p-1 h-[3.2rem] bg-link text-black rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-500 transition duration-450 ease-in-out"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default Profile;