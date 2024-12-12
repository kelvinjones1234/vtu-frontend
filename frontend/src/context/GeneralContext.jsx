import { createContext, useEffect, useContext, react, useState } from "react";
import axios from "axios";

export const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [transferForm, setTransferForm] = useState(false);
  const [servicesDropDown, setServicesDropDown] = useState(false);

  const handleServicesDropDowns = () => {
    setServicesDropDown((previous) => !previous);
    if (transferForm) {
      setTransferForm(false);
    }
  };

  const handleTransferForm = () => {
    setTransferForm((previous) => !previous);
    if (servicesDropDown) {
      setServicesDropDown(false);
    }
  };

  const handleThemeSettings = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setDarkMode(newTheme === "dark");
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      setDarkMode(storedTheme === "dark");
    } else {
      // If no theme is stored, default to "dark"
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const api = axios.create({
    baseURL: "https://madupay.pythonanywhere.com/api",
    // baseURL: "http://127.0.0.1:8000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const networkPrefixes = {
    // MTN Prefixes
    "0803": "MTN",
    "0806": "MTN",
    "0703": "MTN",
    "0704": "MTN",
    "0706": "MTN",
    "0813": "MTN",
    "0816": "MTN",
    "0810": "MTN",
    "0814": "MTN",
    "0903": "MTN",
    "0906": "MTN",
    "0913": "MTN",
    "0916": "MTN",

    // Glo Prefixes
    "0805": "Glo",
    "0807": "Glo",
    "0705": "Glo",
    "0811": "Glo",
    "0815": "Glo",
    "0905": "Glo",
    "0915": "Glo",

    // Airtel Prefixes
    "0802": "Airtel",
    "0808": "Airtel",
    "0708": "Airtel",
    "0812": "Airtel",
    "0701": "Airtel",
    "0902": "Airtel",
    "0907": "Airtel",
    "0912": "Airtel",
    "0901": "Airtel",

    // 9mobile (Etisalat) Prefixes
    "0809": "9mobile",
    "0817": "9mobile",
    "0818": "9mobile",
    "0909": "9mobile",
    "0908": "9mobile",
    "0918": "9mobile",
  };

  const detectNetwork = (phoneNumber) => {
    const prefix = phoneNumber.substring(0, 4);
    return networkPrefixes[prefix] || "Unknown Network";
  };

  const contextData = {
    darkMode: darkMode,
    theme: theme,
    api: api,
    loading: loading,
    networkPrefixes: networkPrefixes,
    transferForm,
    servicesDropDown,
    setServicesDropDown,
    handleServicesDropDowns,
    setTransferForm,
    handleTransferForm,

    detectNetwork: detectNetwork,
    setLoading: setLoading,
    setTheme: setTheme,
    setDarkMode: setDarkMode,
    handleThemeSettings: handleThemeSettings,
  };

  return (
    <GeneralContext.Provider value={contextData}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralProvider;
