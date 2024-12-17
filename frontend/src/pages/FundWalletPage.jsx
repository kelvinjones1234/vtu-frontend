import React, { useState, useEffect, useContext } from "react";
import FundWallet from "../components/FundWallet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import Bvn from "../components/Bvn";
import axios from "axios";
import { AuthContext } from "../context/AuthenticationContext";

const FundWalletPage = () => {
  const { user } = useContext(AuthContext);
  const [showBvn, setShowBvn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fundingDetails, setFundingDetails] = useState(null);

  useEffect(() => {
    const fetchFundingDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/funding-details/${user.username}/`
        );

        // Check if the response data is empty or null
        if (!response.data || Object.keys(response.data).length === 0) {
          setShowBvn(true);
          setFundingDetails(null);
        } else {
          setShowBvn(false);
          setFundingDetails(response.data);
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
  }, [user.username]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      {showBvn ? <Bvn /> : <FundWallet fundingDetails={fundingDetails} />}
      <Footer />
    </div>
  );
};

export default FundWalletPage;
