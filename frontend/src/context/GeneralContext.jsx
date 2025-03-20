import { createContext, useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [transferForm, setTransferForm] = useState(false);
  const [servicesDropDown, setServicesDropDown] = useState(false);
  const [homeMenuToggle, setHomeMenuToggle] = useState(false);
  const [sideBarAuthToggle, setSideBarAuthToggle] = useState(false);
  const [mobileTransferForm, setMobileTransferForm] = useState(false);
  const [generalSideBarAuthToggle, setGeneralSideBarAuthToggle] =
    useState(false);
  const [mobileMenuToggle, setMobileMenuToggle] = useState(false);

  const handleGeneralSideBarAuthToggle = useMemo(
    () => () => {
      setGeneralSideBarAuthToggle((prev) => !prev);
      setMobileTransferForm(false);
    },
    []
  );

  const handleMobileTransferForm = useMemo(
    () => () => {
      setMobileTransferForm((prev) => !prev);
      if (!mobileMenuToggle) setMobileTransferForm(true);
      if (!mobileTransferForm) setGeneralSideBarAuthToggle(false);
    },
    [mobileMenuToggle, mobileTransferForm]
  );

  const handleMobileMenuToggle = useMemo(
    () => () => {
      setMobileMenuToggle((prev) => !prev);
      setMobileTransferForm(false);
      setGeneralSideBarAuthToggle(false);
    },
    []
  );

  const handleSideBarAuthToggle = useMemo(
    () => () => {
      setSideBarAuthToggle((prev) => !prev);
    },
    []
  );

  const handleHomeMenuToggle = useMemo(
    () => () => {
      setHomeMenuToggle((prev) => !prev);
    },
    []
  );

  const handleServicesDropDowns = useMemo(
    () => () => {
      setServicesDropDown((prev) => !prev);
      setTransferForm(false);
    },
    []
  );

  const handleTransferForm = useMemo(
    () => () => {
      setTransferForm((prev) => !prev);
      setServicesDropDown(false);
    },
    []
  );

  const handleThemeSettings = useMemo(
    () => () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    },
    [theme]
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = storedTheme || (prefersDarkMode ? "dark" : "light");
    setTheme(initialTheme);
    localStorage.setItem("theme", initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const api = useMemo(
    () =>
      axios.create({
        baseURL: "https://vtubackend.vercel.app/api",
        timeout: 1000 * 60 * 2,
        headers: { "Content-Type": "application/json" },
      }),
    []
  );

  const networkPrefixes = useMemo(
    () => ({
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
      "0805": "Glo",
      "0807": "Glo",
      "0705": "Glo",
      "0811": "Glo",
      "0815": "Glo",
      "0905": "Glo",
      "0915": "Glo",
      "0802": "Airtel",
      "0808": "Airtel",
      "0708": "Airtel",
      "0812": "Airtel",
      "0701": "Airtel",
      "0902": "Airtel",
      "0907": "Airtel",
      "0912": "Airtel",
      "0901": "Airtel",
      "0809": "9mobile",
      "0817": "9mobile",
      "0818": "9mobile",
      "0909": "9mobile",
      "0908": "9mobile",
      "0918": "9mobile",
    }),
    []
  );

  const detectNetwork = useMemo(
    () => (phoneNumber) => {
      const prefix = phoneNumber.substring(0, 4);
      return networkPrefixes[prefix] || "Unknown Network";
    },
    [networkPrefixes]
  );

  const contextData = useMemo(
    () => ({
      darkMode,
      theme,
      api,
      loading,
      networkPrefixes,
      transferForm,
      servicesDropDown,
      sideBarAuthToggle,
      homeMenuToggle,
      mobileMenuToggle,
      generalSideBarAuthToggle,
      setGeneralSideBarAuthToggle,
      handleGeneralSideBarAuthToggle,
      handleMobileTransferForm,
      mobileTransferForm,
      handleMobileMenuToggle,
      setMobileMenuToggle,
      handleHomeMenuToggle,
      handleSideBarAuthToggle,
      setSideBarAuthToggle,
      setServicesDropDown,
      handleServicesDropDowns,
      setTransferForm,
      handleTransferForm,
      setHomeMenuToggle,
      detectNetwork,
      setLoading,
      setTheme,
      setDarkMode,
      handleThemeSettings,
    }),
    [
      darkMode,
      theme,
      api,
      loading,
      transferForm,
      servicesDropDown,
      sideBarAuthToggle,
      homeMenuToggle,
      mobileMenuToggle,
      generalSideBarAuthToggle,
      mobileTransferForm,
      handleGeneralSideBarAuthToggle,
      handleMobileTransferForm,
      handleMobileMenuToggle,
      handleHomeMenuToggle,
      handleSideBarAuthToggle,
      handleServicesDropDowns,
      handleTransferForm,
      detectNetwork,
      handleThemeSettings,
    ]
  );

  return (
    <GeneralContext.Provider value={contextData}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);
