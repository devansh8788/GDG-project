import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../item/item.css'; // Adjust the path as per your structure
import { FaRegEdit } from "react-icons/fa";
import Navbar from '../Navbar';
import EditDropDown from './EditDropDown';
const InvoicePage = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [dropDownShow, setDropDownShow] = useState(false);
    const [dropDownId, setDropDownId] = useState(null);
    const [terms, setTerms] = useState('');
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

    const handleClick = (id) => {
        setDropDownShow(!dropDownShow)
        setDropDownId(id)
    }


    const updateTerms = async (id, newTerms) => {
        try {
            const orgData = localStorage.getItem('selectedOrganization');
            const parsedOrgData = orgData ? JSON.parse(orgData) : null;

            if (!parsedOrgData || !parsedOrgData.id) {
                alert("No valid organization selected!");
                return;
            }

            const invoiceDocRef = doc(db, `organizations/${parsedOrgData.id}/invoices`, id);
            await updateDoc(invoiceDocRef, { terms: newTerms });

            // Update the local state to reflect changes
            setInvoices((prevInvoices) =>
                prevInvoices.map((invoice) =>
                    invoice.id === id ? { ...invoice, terms: newTerms } : invoice
                )
            );

            console.log(`Invoice ${id} updated successfully.`);
        } catch (error) {
            console.error("Error updating invoice terms: ", error);
        }
    };

    return (
        <div className="Main-Container ml-52  mx-auto px-4">
            <Navbar />
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
                <div className="flex-2 text-left">Edit</div>
            </div>

            {/* Invoice Rows */}
            {invoices.length > 0 ? (
                invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="flex items-center text-sm px-4 py-3 border-b hover:bg-gray-100 cursor-pointer relative"

                    >
                        {/* Date */}
                        <div className="flex-1 text-left" onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}>
                            {invoice.createdAt && typeof invoice.createdAt.toDate === 'function'
                                ? invoice.createdAt.toDate().toLocaleDateString()
                                : 'N/A'}
                        </div>

                        {/* Invoice Number */}
                        <div className="flex-1 text-left" onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}>INV-
                            {typeof invoice.invoiceNumber === 'string' ? invoice.invoiceNumber : 'N/A'}
                        </div>

                        {/* Customer Name */}
                        <div className="flex-1 text-left" onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}>
                            {invoice.customer && invoice.customer.displayName
                                ? invoice.customer.displayName
                                : 'N/A'}
                        </div>


                        {/* status */}
                        <div className={`flex-1 text-left`} style={{color: invoice.terms==='Paid'?'green':'red' }} onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}>
                            {invoice.customer && invoice.terms
                                ? invoice.terms
                                : 'N/A'}
                        </div>
                        {/* status */}
                        <div className="flex-1 text-left" onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}>
                            {invoice.customer && invoice.dueDate
                                ? invoice.dueDate
                                : 'N/A'}
                        </div>



                        {/* Total Amount */}
                        <div className="flex-1 text-left" onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}>
                            ₹{typeof invoice.total === 'number' ? invoice.total.toFixed(2) : '0.00'}
                        </div>
                        {/* Balance due  */}
                        <div className="flex-1 text-left" onClick={() => navigate(`/dashboard/bill/${invoice.id}`)}>
                            ₹{typeof invoice.total === 'number' ? invoice.total.toFixed(2) : '0.00'}
                        </div>
                        <div className="flex-2 text-left">
                            <FaRegEdit onClick={() => { handleClick(invoice.id) }} />
                        </div>
                        {dropDownShow && dropDownId === invoice.id && (
                            <EditDropDown dropDownId={dropDownId} updateTerms={updateTerms} setDropDownShow={setDropDownShow} setTerms={setTerms} />
                        )}


                    </div>
                ))
            ) : (
                <div className="text-left text-gray-500 py-4">No invoices found.</div>
            )}
        </div>
    );
};

export default InvoicePage;
