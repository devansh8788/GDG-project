import { useState, useEffect } from "react";
import { FaBars, FaFilter } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { db } from "../../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalesByCustomer() {
  const [filters, setFilters] = useState({
    dateRange: "This Month",
    entities: "All",
    compareWith: "None",
  });
  const [salesData, setSalesData] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    dateRange: false,
    entities: false,
    compareWith: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const orgData = await AsyncStorage.getItem("selectedOrganization");
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;

        if (!parsedOrgData || !parsedOrgData.id) {
          alert("No valid organization selected!");
          return;
        }

        const q = query(collection(db, `organizations/${parsedOrgData.id}/invoices`));
        const querySnapshot = await getDocs(q);

        const fetchedInvoices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedData = fetchedInvoices.reduce((acc, invoice) => {
          const customerName = invoice.customer?.displayName || "Unknown Customer";
          if (!acc[customerName]) {
            acc[customerName] = {
              name: customerName,
              invoices: 0,
              sales: 0,
              salesWithTax: 0,
            };
          }

          acc[customerName].invoices += 1;
          acc[customerName].sales += invoice.DiscPrice || 0;
          acc[customerName].salesWithTax += invoice.TaxPrice || 0;

          return acc;
        }, {});

        setSalesData(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDropdowns((prev) => ({ ...prev, [key]: false }));
  };

  const totalInvoices = salesData.reduce((sum, item) => sum + item.invoices, 0);
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalSalesWithTax = salesData.reduce((sum, item) => sum + item.salesWithTax, 0);

  return (
    <div className="min-h-screen bg-gray-50 ml-52">
      <div className="bg-white shadow-sm p-3 rounded-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaBars className="text-gray-600 cursor-pointer text-sm" />
          <h1 className="text-md font-semibold">Sales by Customer</h1>
        </div>
      </div>

      <div className="bg-white shadow-sm p-3 rounded-md mt-3 flex flex-wrap gap-2 items-center">
        <button className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm">
          <FaFilter /> Filters :
        </button>

        <div className="relative">
          <button onClick={() => toggleDropdown("dateRange")} className="flex items-center gap-2 border px-3 py-1 rounded-md cursor-pointer text-sm">
            Date Range: {filters.dateRange}
            <IoIosArrowDown className="text-gray-500" />
          </button>
          {dropdowns.dateRange && (
            <div className="absolute bg-white shadow-md rounded-md mt-1 w-48">
              {["This Month", "Last Month", "Last 3 Months", "This Year"].map((option) => (
                <div key={option} onClick={() => updateFilter("dateRange", option)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm p-6 rounded-md mt-3">
        {loading ? (
          <p className="text-gray-500 text-center text-sm">Loading sales data...</p>
        ) : (
          <>
            <h2 className="text-gray-700 text-md font-semibold text-center">Sales by Customer</h2>
            <table className="w-full border-collapse mt-6">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-600 text-xs">
                  <th className="py-1 px-3 text-left">NAME</th>
                  <th className="py-1 px-3 text-left">INVOICE COUNT</th>
                  <th className="py-1 px-3 text-left">SALES</th>
                  <th className="py-1 px-3 text-left">SALES WITH TAX</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((customer, index) => (
                  <tr key={index} className="border-b text-gray-700 text-xs">
                    <td className="py-1 px-3">{customer.name}</td>
                    <td className="py-1 px-3">{customer.invoices}</td>
                    <td className="py-1 px-3">${customer.sales.toFixed(2)}</td>
                    <td className="py-1 px-3">${customer.salesWithTax.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="border-t bg-gray-100 font-semibold text-xs">
                  <td className="py-1 px-3">Total</td>
                  <td className="py-1 px-3">{totalInvoices}</td>
                  <td className="py-1 px-3">${totalSales.toFixed(2)}</td>
                  <td className="py-1 px-3">${totalSalesWithTax.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
