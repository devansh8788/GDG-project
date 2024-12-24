// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './Home';
import Chart from './charts/Chart';
import Item from './item/Item';
import Loading from './Loading'; // Import your loading component
import Customer from "./customer/MainCustomer"
import Customerform from "./customer/CustomerForm"
import Invoice from "./invoice/Invoice"
import MainData from "./invoice/MainData"
import BillPage from '../components/invoice/Bill'
import ItemForm from './item/ItemForm';
import InvoiceSend from './invoice/InvoiceSend';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Detect route changes

  // Trigger loading animation on route change
  useEffect(() => {
    setLoading(true); // Start loading

    // Simulate a small delay for loading animation (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after delay
    }, 900);

    // Cleanup the timeout to prevent memory leaks
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 bg-white">
        {loading ? (
          // Display Loading component during route change
          <Loading />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="analytics" element={<Chart />} />
            <Route path="invoice" element={<MainData/>}/>
            <Route path="invoiceform" element={<Invoice/>}/>

            <Route path="product" element={<Item />} />
            <Route path="customer" element={<Customer/>} />
            <Route path="customerform" element={<Customerform/>}/>
            <Route path="/bill/:id" element={<BillPage />} />
            <Route path="/item" element={<ItemForm />} />
            <Route path="/email" element={<InvoiceSend />} />
                  </Routes>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
