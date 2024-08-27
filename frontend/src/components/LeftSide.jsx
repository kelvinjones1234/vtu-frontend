import React from "react";
import { FaMobileAlt, FaWifi, FaBolt } from "react-icons/fa";

const LeftSide = () => (
  <div className="left relative hidden sm:flex flex-col justify-between h-[355px] shadow-lg shadow-indigo-900/20 rounded-2xl w-[20rem] bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white p-6 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5">
      <div className="w-40 h-40 rounded-full bg-white absolute -top-20 -left-20 opacity-10"></div>
      <div className="w-40 h-40 rounded-full bg-white absolute -bottom-20 -right-20 opacity-10"></div>
    </div>

    <div className="relative z-10">
      <h2 className="text-2xl font-bold mb-4">Virtual Top-Up</h2>
      <p className="text-sm opacity-80 mb-6">
        Fast, secure, and convenient recharges for all your digital needs.
      </p>
    </div>

    <div className="relative z-10 space-y-4">
      <FeatureItem icon={FaMobileAlt} text="Mobile Credit" />
      <FeatureItem icon={FaWifi} text="Internet Bundles" />
      <FeatureItem icon={FaBolt} text="Utility Bills" />
    </div>

    <div className="relative z-10 text-sm opacity-80 mt-6">
      Powering your connections, anytime, anywhere.
    </div>
  </div>
);

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3">
    <div className="bg-white bg-opacity-20 rounded-full p-2">
      <Icon className="w-5 h-5" />
    </div>
    <span>{text}</span>
  </div>
);

export default LeftSide;
