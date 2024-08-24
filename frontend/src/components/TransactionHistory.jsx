import React, { useContext, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import { ProductContext } from "../context/ProductContext";
import Pagination from "./Pagination";

const TransactionHistory = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  const { authTokens } = useContext(AuthContext);
  const { api } = useContext(GeneralContext);
  const { productData } = useContext(ProductContext);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await api.get("transactions/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        // Sort transactions by date in descending order (latest first)
        const sortedTransactions = response.data.sort(
          (a, b) => new Date(b.date_create) - new Date(a.date_create)
        );
        setTransactionHistory(sortedTransactions);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTransactionHistory();
  }, [api, authTokens.access]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await api.get("transactions/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setTransactionHistory(response.data);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTransactionHistory();
  }, [api, authTokens.access]);

  useEffect(() => {
    let filtered = transactionHistory;

    // Filter by category
    if (category) {
      filtered = filtered.filter(
        (item) =>
          item.transaction_type?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.transaction_ref_no
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.product?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date_create).getTime();
        const start = new Date(startDate).getTime();
        return itemDate >= start;
      });
    }

    if (endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date_create).getTime();
        const end = new Date(endDate).getTime();
        return itemDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  }, [category, status, searchTerm, startDate, endDate, transactionHistory]);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="bg-bg_on min-h-screen bg-contain bg-no-repeat justify-center pt-24 sm:bg-cover bg-center px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto sm:flex gap-8">
        <GeneralLeft />
        <div className="min-w-[349.20px] pr-2 mx-auto">
          <div className="mb-8">
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
              Transaction History
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Data</span>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <input
              type="search"
              placeholder="Search for transaction"
              className="w-full px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-4">
              <select
                name="category"
                id="category"
                className="custom-select flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {productData.map((product, index) => (
                  <option key={index} value={product.category.toLowerCase()}>
                    {product.category}
                  </option>
                ))}
              </select>
              <select
                name="status"
                id="status"
                className="custom-select flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Failed">Failed</option>
                <option value="Success">Successful</option>
              </select>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                className="flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentTransactions.map((item, index) => (
                    <tr
                      key={item.transaction_ref_no}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.transaction_ref_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ₦ {item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ₦ {item.new_bal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.date_create.slice(0, 10)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py- inline-flex text-[.6rem] leading-5 font-semibold rounded-lg ${
                            item.status.toLowerCase() === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <GeneralRight />
      </div>
    </div>
  );
};

export default TransactionHistory;
