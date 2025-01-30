import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { db } from "../../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalesByItem() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

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

        const q = query(collection(db, `organizations/${parsedOrgData.id}/invoices`));
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

        setSalesData(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 ml-52 text-sm">
      <div className="bg-white shadow-sm p-3 rounded-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaBars className="text-gray-600 cursor-pointer" />
          <h1 className="text-sm font-semibold">Sales by Item</h1>
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
                  <th className="py-1 px-2 text-left">ITEM NAME</th>
                  <th className="py-1 px-2 text-center">ITEM COUNT</th>
                  <th className="py-1 px-2 text-left">TOTAL REVENUE (INR)</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={index} className="border-b text-gray-700">
                    <td className="py-1 px-2">{item.name}</td>
                    <td className="py-1 px-2 text-center">{item.itemCount}</td>
                    <td className="py-1 px-2">₹{item.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
