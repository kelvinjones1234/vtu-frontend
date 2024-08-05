import { createContext, useEffect, useState, useContext } from "react";
import { GeneralContext } from "./GeneralContext";
import { AuthContext } from "./AuthenticationContext";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [dataNetworks, setDataNetworks] = useState([]);
  const [productData, setProductData] = useState([]);
  const [airtimeNetworks, setAirtimeNetworks] = useState([]);
  const [cableCategories, setCableCategories] = useState([]);

  const { api } = useContext(GeneralContext);
  const { user, loginUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("combined-data/");
        const data = response.data;
        setDataNetworks(data.dataNetworks);
        setProductData(data.productData);
        setAirtimeNetworks(data.airtimeNetworks);
        setCableCategories(data.cableCategories);
      } catch (error) {
        console.error("Error fetching combined data:", error);
      }
    };

    fetchData();
  }, [loginUser]);

  const contextData = {
    dataNetworks,
    productData,
    airtimeNetworks,
    cableCategories,
  };


  return (
    <ProductContext.Provider value={contextData}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
