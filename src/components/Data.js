import React, { useEffect, useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { db } from '../firebase';  // Make sure you import the db from your firebase setup
import { query, collection, getDocs } from 'firebase/firestore';
import man from '../assets/man.png';
import man2 from '../assets/man2.png';
import man3 from '../assets/man3.png';
import graph from '../assets/graph.png';
import start from '../assets/start.png';
import footware from '../assets/footware.png';
import gloves from '../assets/gloves.png';
import InvoiceTable from "./InvoiceTable";
import { Link } from 'react-router-dom';
import MonthlyChart from "./MonthlyChart"

function Dashboard() {
    const [invoices, setInvoices] = useState([]);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

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

                // Set the fetched and sorted invoices
                setInvoices(sortedInvoices);

                // Calculate total invoices and total amount
                const totalInvoicesCount = sortedInvoices.length;
                const totalAmountSum = sortedInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.total || 0), 0);
                console.log('====================================');
                console.log(sortedInvoices);
                console.log('====================================');
                setTotalInvoices(totalInvoicesCount);
                setTotalAmount(totalAmountSum);
            } catch (error) {
                console.error("Error fetching invoices: ", error);
            }
        };

        fetchInvoices();
    }, []);

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
                        <p className="text-xl font-bold">$2,500</p>
                    </div>
                </div>

                {/* Marketplace Section */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Marketplace</h2>
                    <div className="bg-white p-4 rounded-lg shadow-xl flex justify-between items-center">
                        <div>
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
                    <p className="text-2xl font-bold mb-4">₹5,320.00</p>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex justify-center items-center">
                                <span className="text-green-500 font-bold">+</span>
                            </div>
                            <p className="ml-1 text-green-500 font-bold">₹1,200.00</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex justify-center items-center">
                                <span className="text-red-500 font-bold">−</span>
                            </div>
                            <p className="ml-1 text-red-500 font-bold">₹300.00</p>
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                <div className="mb-4 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-bold">Recent Activity</h4>
                        <span className="text-purple-500 cursor-pointer text-sm">See All</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex justify-center items-center">
                                <div className="w-3 h-3 bg-white rounded"></div>
                            </div>
                            <div className="flex-1 flex justify-between items-center text-sm">
                                <span className="font-bold">Invoice Paid</span>
                                <p className="text-xs text-gray-400">Today, 10:30 AM</p>
                                <span className="font-bold">$600</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Categories */}
                <div className="p-2">
                    <h4 className="text-md font-bold mb-2">Top Clients</h4>
                    <div className="flex justify-between mb-1">
                        <div className="p-2 bg-yellow-100 rounded-lg shadow-xl flex flex-col w-1/2 mr-1">
                            <img src={footware} alt="Footwear" className="w-6 h-6 mb-2 object-cover" />
                            <span className="text-md font-bold mb-1">Client A</span>
                            <span className="text-gray-600 text-xs">Invoices: 5</span>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg shadow-xl flex flex-col w-1/2 ml-1">
                            <img src={gloves} alt="Gloves" className="w-6 h-6 mb-2 object-cover" />
                            <span className="text-md font-bold mb-1">Client B</span>
                            <span className="text-gray-600 text-xs">Invoices: 3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
