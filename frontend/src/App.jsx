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
