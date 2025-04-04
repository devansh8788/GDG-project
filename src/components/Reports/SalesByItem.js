import { useState, useEffect } from "react";
import { FaBars, FaFilter, FaFileExport, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as XLSX from 'xlsx';

export default function SalesByItem() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: "This Month",
  });
  const [dropdowns, setDropdowns] = useState({
    dateRange: false,
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'totalRevenue',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getDateRange = (range) => {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case "This Month":
        start.setMonth(now.getMonth());
        start.setDate(1);
        break;
      case "Last Month":
        start.setMonth(now.getMonth() - 1);
        start.setDate(1);
        break;
      case "Last 3 Months":
        start.setMonth(now.getMonth() - 3);
        break;
      case "This Year":
        start.setMonth(0);
        start.setDate(1);
        break;
      default:
        return { start: null, end: null };
    }
    
    return { start, end: now };
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const orgData = await AsyncStorage.getItem("selectedOrganization");
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;

        if (!parsedOrgData?.id) {
          alert("No valid organization selected!");
          return;
        }

        const { start, end } = getDateRange(filters.dateRange);
        let q = query(collection(db, `organizations/${parsedOrgData.id}/invoices`));
        
        if (start && end) {
          q = query(
            collection(db, `organizations/${parsedOrgData.id}/invoices`),
            where("createdAt", ">=", start),
            where("createdAt", "<=", end)
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedInvoices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedData = {};

        fetchedInvoices.forEach((invoice) => {
          if (!invoice.items) return;

          invoice.items.forEach((item) => {
            const itemName = item.itemDetails || "Unknown Item";
            const itemRate = parseFloat(item.rate) || 0;
            const itemQuantity = item.quantity || 0;
            const itemTotal = itemRate * itemQuantity;

            if (!groupedData[itemName]) {
              groupedData[itemName] = {
                name: itemName,
                totalRevenue: 0,
                itemCount: 0,
              };
            }
            groupedData[itemName].totalRevenue += itemTotal;
            groupedData[itemName].itemCount += itemQuantity;
          });
        });

        const sortedData = Object.values(groupedData).sort((a, b) => {
          if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
          }
          return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        });

        setSalesData(sortedData);
      } catch (error) {    
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [filters.dateRange, sortConfig]);

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDropdowns((prev) => ({ ...prev, [key]: false }));
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales by Item");
    XLSX.writeFile(workbook, "sales_by_item.xlsx");
  };

  const totalPages = Math.ceil(salesData.length / itemsPerPage);
  const currentItems = salesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 ml-52 text-sm">
      <div className="bg-white shadow-sm p-3 rounded-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaBars className="text-gray-600 cursor-pointer" />
          <h1 className="text-sm font-semibold">Sales by Item</h1>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          <FaFileExport /> Export
        </button>
      </div>

      <div className="bg-white shadow-sm p-3 rounded-md mt-3 flex flex-wrap gap-2 items-center">
        <button className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-md">
          <FaFilter /> Filters :
        </button>

        <div className="relative">
          <button 
            onClick={() => toggleDropdown("dateRange")} 
            className="flex items-center gap-2 border px-3 py-1 rounded-md cursor-pointer"
          >
            Date Range: {filters.dateRange}
            <IoIosArrowDown className="text-gray-500" />
          </button>
          {dropdowns.dateRange && (
            <div className="absolute bg-white shadow-md rounded-md mt-1 w-48">
              {["This Month", "Last Month", "Last 3 Months", "This Year"].map((option) => (
                <div 
                  key={option} 
                  onClick={() => updateFilter("dateRange", option)} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm p-6 rounded-md mt-3">
        {loading ? (
          <p className="text-gray-500 text-center">Loading sales data...</p>
        ) : (
          <>
            <h2 className="text-gray-700 text-base font-semibold text-center">Total Sales by Item</h2>
            <table className="w-full border-collapse mt-5 text-xs">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-600">
                  <th 
                    className="py-1 px-2 text-left cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    ITEM NAME
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                    )}
                  </th>  
                  <th 
                    className="py-1 px-2 text-center cursor-pointer"
                    onClick={() => handleSort('itemCount')}
                  >
                    ITEM COUNT
                    {sortConfig.key === 'itemCount' && (
                      sortConfig.direction === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                    )}
                  </th>
                  <th 
                    className="py-1 px-2 text-left cursor-pointer"
                    onClick={() => handleSort('totalRevenue')}
                  >
                    TOTAL REVENUE (INR)
                    {sortConfig.key === 'totalRevenue' && (
                      sortConfig.direction === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="border-b text-gray-700">
                    <td className="py-1 px-2">{item.name}</td>
                    <td className="py-1 px-2 text-center">{item.itemCount}</td>
                    <td className="py-1 px-2">₹{item.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-l-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 border-t border-b">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-r-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
