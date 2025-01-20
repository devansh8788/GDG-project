import { useState, useEffect } from "react";
import { FaBars, FaFilter, FaSlidersH } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { db } from "../../firebase"; // Import your Firestore config
import { collection, query, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalesByItem() {
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

  // Fetch data dynamically
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

        const q = query(
          collection(db, `organizations/${parsedOrgData.id}/invoices`)
        );
        const querySnapshot = await getDocs(q);

        const fetchedInvoices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedData = fetchedInvoices.reduce((acc, invoice) => {
          if (!invoice.items) return acc;

          invoice.items.forEach((item) => {
            const itemName = item.name || "Unknown Item";
            if (!acc[itemName]) {
              acc[itemName] = {
                name: itemName,
                quantitySold: 0,
                totalSales: 0,
                totalSalesWithTax: 0,
              };
            }

            acc[itemName].quantitySold += item.quantity || 0;
            acc[itemName].totalSales += item.price || 0;
            acc[itemName].totalSalesWithTax += item.priceWithTax || 0;
          });

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

  const totalItemsSold = salesData.reduce((sum, item) => sum + item.quantitySold, 0);
  const totalSales = salesData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalSalesWithTax = salesData.reduce(
    (sum, item) => sum + item.totalSalesWithTax,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 ml-52">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm p-4 rounded-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaBars className="text-gray-600 cursor-pointer" />
          <h1 className="text-lg font-semibold">Sales by Item</h1>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-sm p-4 rounded-md mt-4 flex flex-wrap gap-3 items-center">
        <button className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-2 rounded-md">
          <FaFilter />
          Filters :
        </button>

        <div className="relative">
          <button
            onClick={() => toggleDropdown("dateRange")}
            className="flex items-center gap-2 border px-3 py-2 rounded-md cursor-pointer"
          >
            Date Range: {filters.dateRange}
            <IoIosArrowDown className="text-gray-500" />
          </button>
          {dropdowns.dateRange && (
            <div className="absolute bg-white shadow-md rounded-md mt-1 w-48">
              {["This Month", "Last Month", "Last 3 Months", "This Year"].map(
                (option) => (
                  <div
                    key={option}
                    onClick={() => updateFilter("dateRange", option)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Section */}
      <div className="bg-white shadow-sm p-8 rounded-md mt-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading sales data...</p>
        ) : (
          <>
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Sales by Item
            </h2>
            <table className="w-full border-collapse mt-8">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-600 text-sm">
                  <th className="py-2 px-4 text-left">ITEM NAME</th>
                  <th className="py-2 px-4 text-left">QUANTITY SOLD</th>
                  <th className="py-2 px-4 text-left">TOTAL SALES</th>
                  <th className="py-2 px-4 text-left">TOTAL SALES WITH TAX</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={index} className="border-b text-gray-700">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.quantitySold}</td>
                    <td className="py-2 px-4">${item.totalSales.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      ${item.totalSalesWithTax.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t bg-gray-100 font-semibold">
                  <td className="py-2 px-4">Total</td>
                  <td className="py-2 px-4">{totalItemsSold}</td>
                  <td className="py-2 px-4">${totalSales.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    ${totalSalesWithTax.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
