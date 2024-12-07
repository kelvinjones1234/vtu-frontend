import React, { useContext } from "react";
import { AuthContext } from "../context/AuthenticationContext"; // Assuming AuthContext provides the user
import logo from "../assets/4.svg";
import { motion } from "framer-motion";

const LoadingSpinner = () => {

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <img src={logo} alt="MaduConnect Logo" className="w-40 h-40" />
        </motion.div>
        <div className="mt-8 text-primary text-5xl font-bold">Maduconnect</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
