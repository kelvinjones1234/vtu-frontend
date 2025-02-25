import React, { useContext, useEffect, useState } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import { ProductContext } from "../context/ProductContext";
import Pagination from "./Pagination";
import logo from "../assets/4.svg";

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

  const handlePrint = (transaction) => {
    const receiptContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaction Receipt</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            background-color: #f9f9f9;
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo img {
            max-width: 200px;
            height: auto;
          }
          h2 {
            color: #2c3e50;
            text-align: center;
            font-size: 28px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .receipt-details {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .receipt-details p {
            margin: 15px 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 10px;
          }
          .receipt-details strong {
            color: #2c3e50;
            font-weight: 500;
          }
          .receipt-details span {
            color: #34495e;
            font-weight: 400;
          }
          .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }
          .status.success {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          .status.failed {
            background-color: #ffebee;
            color: #c62828;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #7f8c8d;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="logo">
          <img src=${logo} alt="maduconnect">
        </div>
        <h2>Transaction Receipt</h2>
        <div class="receipt-details">
          <p><strong>Reference</strong> <span>${
            transaction.transaction_ref_no
          }</span></p>
          <p><strong>Phone Number</strong> <span>${transaction.phone}</span></p>
          <p><strong>Description</strong> <span>${
            transaction.product
          }</span></p>
          <p><strong>Amount</strong> <span>₦${transaction.price.toLocaleString()}</span></p>
          <p><strong>Time Stamp</strong> <span>${new Date(
            transaction.date_create
          ).toLocaleString()}</span></p>
          <p><strong>Status</strong> <span class="status ${
            transaction.status.toLowerCase() === "success"
              ? "success"
              : "failed"
          }">${transaction.status}</span></p>
        </div>
        <div class="footer">
          <p>Thank you for using our service!</p>
          <p>For support, please contact: maduconnect@gmail.com</p>
          <p>© ${new Date().getFullYear()} PraiseMedia. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto w-full max-w-[800px]">
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
            className="w-full px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap gap-4">
            <select
              name="category"
              id="category"
              className="custom-select flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
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
              className="custom-select flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
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
              className="flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="flex-grow px-4 py-1 text-primary dark:text-white bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
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
                    Phone Number
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
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
                      {item.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ₦ {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ₦ {item.new_bal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.date_create).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-[.6rem] leading-5 font-semibold rounded-lg ${
                          item.status.toLowerCase() === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <button
                        className="px-2 py-2 text-black font-semibold bg-[#1CCAFF] rounded-lg text-xs"
                        onClick={() => handlePrint(item)}
                      >
                        Print Receipt
                      </button>
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
  );
};

export default TransactionHistory;