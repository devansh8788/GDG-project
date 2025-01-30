import React, { useEffect, useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { db } from '../firebase';  // Make sure you import the db from your firebase setup
import { query, collection, getDocs, getFirestore } from 'firebase/firestore';
import man from '../assets/man.png';
import man2 from '../assets/man2.png';
import man3 from '../assets/man3.png';
import graph from '../assets/graph.png';
import start from '../assets/start.png';
import footware from '../assets/footware.png';
import gloves from '../assets/gloves.png';
import InvoiceTable from "./InvoiceTable";
import { Link, useNavigate } from 'react-router-dom';
import MonthlyChart from "./MonthlyChart"
import AsyncStorage from '@react-native-async-storage/async-storage';

function Dashboard({setLoading}) {
        const navigate = useNavigate();
        const [invoices, setInvoices] = useState([]);
        const [totalInvoices, setTotalInvoices] = useState(0);
        const [totalAmount, setTotalAmount] = useState(0);
        const [pendingAmount, setPendingAmount] = useState(0);
        const [expenses, setExpenses] = useState(null);
        const [topCustomers, setTopCustomers] = useState([]);
    
        useEffect(() => {
            const fetchInvoices = async () => {
                try {
                    const orgData = localStorage.getItem('selectedOrganization');
                    const parsedOrgData = orgData ? JSON.parse(orgData) : null;
    
                    if (!parsedOrgData || !parsedOrgData.id) {
                        alert("No valid organization selected!");
                        return;
                    }
    
                    const q = query(
                        collection(db, `organizations/${parsedOrgData.id}/invoices`)
                    );
                    const querySnapshot = await getDocs(q);
                    const fetchedInvoices = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
    
                    // Sort invoices by date in ascending order (oldest first)
                    const sortedInvoices = fetchedInvoices.sort((a, b) => {
                        const dateA = a.date ? a.date.toDate() : 0; // Ensure `date` is a valid timestamp
                        const dateB = b.date ? b.date.toDate() : 0;
                        return dateA - dateB;
                    });
    
                    setInvoices(sortedInvoices);
    
                    const totalInvoicesCount = sortedInvoices.length;
                    const totalAmountSum = sortedInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.total || 0), 0);
                    const pending = sortedInvoices.filter(e => e.terms !== 'Paid');
                    const temp = pending.reduce((sum, invoice) => sum + parseFloat(invoice.total || 0), 0);
                    setPendingAmount(temp);
                    setTotalInvoices(totalInvoicesCount);
                    setTotalAmount(totalAmountSum);
                } catch (error) {
                    console.error("Error fetching invoices: ", error);
                }
            };
    
            fetchInvoices();
        }, []);
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const orgData = await AsyncStorage.getItem('selectedOrganization');
                    console.log("Fetched organization data:", orgData);
                    const parsedOrgData = orgData ? JSON.parse(orgData) : null;
    
                    if (!parsedOrgData || !parsedOrgData.id) {
                        console.error("No valid organization selected!");
                        return;
                    }
    
                    const db = getFirestore();
                    const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/expenses`));
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const totalAmountSum = data.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
                    setExpenses(totalAmountSum);
                } catch (error) {
                    console.error("Error fetching items: ", error);
                }
            };
    
            fetchData();
        }, []);
    
        useEffect(() => {
            const processInvoices = async () => {
                setLoading(true); // Start loading
                try {
                    if (invoices.length > 0) {
                        const customerInvoiceCount = {};
        
                        invoices.forEach(invoice => {
                            const customer = invoice.customer;
                            if (customer && customer.displayName) {
                                if (!customerInvoiceCount[customer.displayName]) {
                                    // Initialize customer with object and count
                                    customerInvoiceCount[customer.displayName] = {
                                        customer,
                                        count: 0
                                    };
                                }
                                // Increment the count for the customer
                                customerInvoiceCount[customer.displayName].count += 1;
                            }
                        });
        
                        console.log('Customer Invoice Count:', customerInvoiceCount);
        
                        // Sort customers by count in descending order
                        const sortedCustomers = Object.values(customerInvoiceCount)
                            .sort((a, b) => b.count - a.count);
        
                        console.log('Sorted Customers:', sortedCustomers);
        
                        // Set the top 2 customers
                        setTopCustomers(sortedCustomers.slice(0, 2));
                    }
                } catch (error) {
                    console.error('Error processing invoices:', error);
                } finally {
                    setLoading(false); // End loading
                }
            };
        
            processInvoices();
        }, [invoices]);
        
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Section */}
            <div className="flex-1 p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Business Dashboard</h1>
                    <div className="flex items-center space-x-2">
                        <FaSearch className="text-lg cursor-pointer" />
                        <FaBell className="text-lg cursor-pointer" />
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className="bg-white p-4 rounded-lg shadow-xl bg-cover bg-center text-white"
                        style={{ backgroundImage: `url(${man})` }}
                    >
                        <h3 className="text-sm font-semibold">Invoices Generated</h3>
                        <p className="text-xl font-bold">{totalInvoices}</p>
                    </div>
                    <div
                        className="bg-white p-4 rounded-lg shadow-xl bg-cover bg-center text-white"
                        style={{ backgroundImage: `url(${man2})` }}
                    >
                        <h3 className="text-sm font-semibold">Total Revenue</h3>
                        <p className="text-xl font-bold">₹{totalAmount.toFixed(2)}</p>
                    </div>
                    <div
                        className="bg-white p-4 rounded-lg shadow-xl bg-cover bg-center text-white"
                        style={{ backgroundImage: `url(${man3})` }}
                    >
                        <h3 className="text-sm font-semibold">Pending Payments</h3>
                        <p className="text-xl font-bold">₹ {pendingAmount.toFixed(2)}</p>
                    </div>
                </div>

                {/* Marketplace Section */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Marketplace</h2>
                    <div className="bg-white p-4 rounded-lg shadow-xl flex justify-between items-center">
                        <div className='cursor-pointer' onClick={()=> navigate("/dashboard/analytics")}>
                            <h3 className="text-lg font-bold">Data Analytics Overview</h3>
                            <p className="text-gray-600 text-sm">Track invoices and sales trends.</p>
                        </div>
                        <Link to="/dashboard/analytic">
    <img src={start} alt="Start Icon" className="w-24 h-24 object-cover cursor-pointer" />
</Link>
                    </div>
                    <MonthlyChart/>
                </div>

                {/* Recent Invoices */}
{/* Recent Invoices */}
{/* Recent Invoices */}
<div className="mt-4">
    <h2 className="text-lg font-bold mb-2">Recent Invoices</h2>
    <div className="bg-white p-4 rounded-lg shadow-xl">
        <ul>
            {invoices.map((invoice) => (
                <li key={invoice.id} className="py-4 border-b">
                    <div className="flex items-center text-sm w-full">
                        {/* Invoice Number */}
                        <div className="w-1/4 font-bold">
                            Invoice No: {invoice.invoiceNumber || 'N/A'}
                        </div>

                        {/* Customer Name */}
                        <div className="w-1/4">
                            Customer: {invoice.customer.displayName ? invoice.customer.displayName
                                :  'N/A'}
                        </div>

                        {/* Email */}
                        <div className="w-1/3">
                            Email: {invoice.customer.email || 'N/A'}
                        </div>
                        {/* Date and Amount */}
                        <div className="w-1/5 text-center">
                            <p>{invoice.date?.toDate().toLocaleDateString()}</p>
                            <p className="font-bold">₹ {invoice.total.toFixed(2)}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
</div>


            </div>

            {/* Right Section - Summary */}
            <div className="w-[300px] bg-white p-6 rounded-lg shadow flex flex-col">
                <div className="p-2 mb-4">
                    <h2 className="text-2xl font-bold mb-2">Summary</h2>
                </div>
                <div className="mb-8 p-4 py-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-md font-semibold mb-4">Current Balance</h2>
                    <p className="text-2xl font-bold mb-4">₹{totalAmount.toFixed(0) - expenses}</p>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex justify-center items-center">
                                <span className="text-green-500 font-bold">+</span>
                            </div>
                            <p className="ml-1 text-green-500 font-bold">₹{(totalAmount - pendingAmount).toFixed(0)}</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex justify-center items-center">
                                <span className="text-red-500 font-bold">−</span>
                            </div>
                            <p className="ml-1 text-red-500 font-bold">₹{pendingAmount.toFixed(0)}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                <div className="mb-4 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-bold">Total Expenses</h4>
                        <span className="text-purple-500 cursor-pointer text-sm" onClick={()=>{navigate("/dashboard/expenses")}}>See All</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            {/* <div className="w-6 h-6 bg-purple-500 rounded-full flex justify-center items-center">
                                <div className="w-3 h-3 bg-white rounded"></div>
                            </div> */}
                            <div className="flex-1 flex justify-between items-center text-sm">
                                {/* <span className="font-bold">Invoice Paid</span> */}
                                <span className="font-bold text-lg">₹{expenses}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Categories */}
                {/* <div className="p-2">
                    <h4 className="text-md font-bold mb-2">Top Clients</h4>
                    <div className="flex justify-between mb-1">
                        <div className="p-2 bg-yellow-100 rounded-lg shadow-xl flex flex-col w-1/2 mr-1 cursor-pointer" onClick={() => navigate(`/dashboard/customerview/${topCustomers[0].customer.id}`)}>
                            <img src={footware} alt="Footwear" className="w-6 h-6 mb-2 object-cover" />
                            <span className="text-md font-bold mb-1">{topCustomers[0].customer.displayName}</span>
                            <span className="text-gray-600 text-xs">Invoices: {topCustomers[1].count}</span>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg shadow-xl flex flex-col w-1/2 ml-1 cursor-pointer" onClick={() => navigate(`/dashboard/customerview/${topCustomers[1].customer.id}`)} >
                            <img src={gloves} alt="Gloves" className="w-6 h-6 mb-2 object-cover" />
                            <span className="text-md font-bold mb-1">{topCustomers[1].customer.displayName}</span>
                            <span className="text-gray-600 text-xs">Invoices: {topCustomers[1].count}</span>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default Dashboard;
