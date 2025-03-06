import React, { useState, useEffect, useContext } from "react";
import FundWallet from "../components/FundWallet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import Bvn from "../components/Bvn";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import axios from "axios";

const FundWalletPage = () => {
  const { user,authTokens } = useContext(AuthContext);
  const [showBvn, setShowBvn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fundingDetails, setFundingDetails] = useState(null);
  const { api } = useContext(GeneralContext);
  const localStorageKey = `${user.username}_fundingData`; // Unique key for local storage

  useEffect(() => {
    const fetchFundingDetails = async () => {
      try {
        // Check local storage first
        const storedData = localStorage.getItem(localStorageKey);
  
        if (storedData) {
          // Parse the stored data (which is an array)
          const parsedData = JSON.parse(storedData);
  
          // Extract the first element of the array
          const fundingDetails = parsedData[0];
  
          // Set the funding details and hide the BVN form
          setFundingDetails(fundingDetails);
          setShowBvn(false);
        } else {
          // Fetch data from API if not in local storage
          const response = await axios.get(
            `http://127.0.0.1:8000/api/funding-details/`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authTokens.access}`,
              },
            }
          );
  
          // Check if the response data is empty or null
          if (!response.data || response.data.length === 0) {
            setShowBvn(true);
            setFundingDetails(null);
          } else {
            // Extract the first element of the array
            const fundingDetails = response.data[0];
  
            setShowBvn(false);
            setFundingDetails(fundingDetails);
  
            // Store the fetched data in local storage
            localStorage.setItem(localStorageKey, JSON.stringify(response.data));
          }
        }
      } catch (error) {
        console.error("Error fetching funding details:", error);
        setShowBvn(true);
        setFundingDetails(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFundingDetails();
  }, [user.username, api, localStorageKey]);

  
  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      {showBvn ? <Bvn /> : <FundWallet fundingData={fundingDetails} />}
      <Footer />
    </div>
  );
};

export default FundWalletPage;
