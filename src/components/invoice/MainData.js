import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../item/item.css'; // Adjust the path as per your structure

const InvoicePage = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);

    // Fetch invoices from Firestore
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
                setInvoices(fetchedInvoices);
            } catch (error) {
                console.error("Error fetching invoices: ", error);
            }
        };

        fetchInvoices();
    }, []);

    return (
        <div className="Main-Container ml-52 max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between items-center py-4">
                <h1 className="text-lg font-bold text-left">Invoices</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate('/dashboard/invoiceform')}
                >
                    New Invoice
                </button>
            </div>

            {/* Table Header */}
            <div className="flex text-dark items-center bg-gray-200 font-semibold text-xs uppercase px-4 py-2 border-b border-gray-300">
                <div className="flex-1 text-left">Date</div>
                <div className="flex-1 text-left">Invoice#</div>
                <div className="flex-1 text-left">Customer Name</div>
                <div className="flex-1 text-left">Status</div>
                <div className="flex-1 text-left">Due Date</div>
                <div className="flex-1 text-left">Amount</div>
                <div className="flex-1 text-left">Balance Due</div>
            </div>

            {/* Invoice Rows */}
            {invoices.length > 0 ? (
                invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="flex items-center text-sm px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}
                    >
                        {/* Date */}
                        <div className="flex-1 text-left">
                            {invoice.createdAt && typeof invoice.createdAt.toDate === 'function'
                                ? invoice.createdAt.toDate().toLocaleDateString()
                                : 'N/A'}
                        </div>

                        {/* Invoice Number */}
                        <div className="flex-1 text-left">INV-
                            {typeof invoice.invoiceNumber === 'string' ? invoice.invoiceNumber : 'N/A'}
                        </div>

                        {/* Customer Name */}
                        <div className="flex-1 text-left">
                            {invoice.customer && invoice.customer.displayName
                                ? invoice.customer.displayName
                                : 'N/A'}
                        </div>

                        
                        {/* status */}
                        <div className="flex-1 text-left">
                            {invoice.customer && invoice.customer.displayName
                                ? invoice.terms
                                : 'N/A'}
                        </div>
                        {/* status */}
                        <div className="flex-1 text-left">
                            {invoice.customer && invoice.customer.displayName
                                ? invoice.dueDate
                                : 'N/A'}
                        </div>

                        

                        {/* Total Amount */}
                        <div className="flex-1 text-left">
                            ₹{typeof invoice.total === 'number' ? invoice.total.toFixed(2) : '0.00'}
                        </div>
                        {/* Balance due  */}
                        <div className="flex-1 text-left">
                            ₹{typeof invoice.total === 'number' ? invoice.total.toFixed(2) : '0.00'}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-left text-gray-500 py-4">No invoices found.</div>
            )}
        </div>
    );
};

export default InvoicePage;
