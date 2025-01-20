import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, query, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate, useLocation } from 'react-router-dom';

function UpdateForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { customerData } = location.state || {};

    const [categoryOptions, setCategoryOptions] = useState(customerData?.categoryOptions || []);
    const [selectedCustomer, setSelectedCustomer] = useState(customerData?.selectedCustomer || null);
    const [expensesDate, setExpensesDate] = useState(customerData?.expensesDate || '');
    const [expensesNumber, setexpensesNumber] = useState(customerData?.expensesNumber || '');
    const [amount, setAmount] = useState(customerData?.amount || '');
    const [notes, setNotes] = useState(customerData?.notes || '');

    const handleSave = async () => {
        try {
            const orgData = await AsyncStorage.getItem('selectedOrganization');
            const parsedOrgData = orgData ? JSON.parse(orgData) : null;

            if (!parsedOrgData || !parsedOrgData.id) {
                alert("No valid organization selected!");
                return;
            }

            const ExpensesData = {
                selectedCustomer,
                expensesDate,
                categoryOptions,
                expensesNumber,
                amount,
                notes,
            };

            await addDoc(
                collection(db, `organizations/${parsedOrgData.id}/expenses`),
                ExpensesData
            );
            alert("Expense saved successfully!");
            navigate("/dashboard/expenses");
        } catch (error) {
            console.error("Error saving expense: ", error);
        }
    };

    const updateExpense = async () => {
        try {
            const orgData = await AsyncStorage.getItem('selectedOrganization');
            const parsedOrgData = orgData ? JSON.parse(orgData) : null;

            if (!parsedOrgData || !parsedOrgData.id) {
                alert("No valid organization selected!");
                return;
            }

            const invoiceDocRef = doc(db, `organizations/${parsedOrgData.id}/expenses/${customerData.id}`);
            await updateDoc(invoiceDocRef, {
                selectedCustomer,
                expensesDate,
                categoryOptions,
                expensesNumber,
                amount,
                notes,
            });

            alert("Expense updated successfully!");
            navigate("/dashboard/expenses");
        } catch (error) {
            console.error("Error updating expense: ", error);
            alert("Failed to update the expense. Please try again.");
        }
    };



    return (
        <div className="p-6 bg-white rounded-lg  mx-auto ml-52">
            <div className="mb-4">
                <label className="block text-red-500 font-semibold text-sm mb-1">Name*</label>
                <input placeholder='Name' value={selectedCustomer} onChange={(e) => { setSelectedCustomer(e.target.value) }} className='w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-red-500 font-semibold text-sm mb-1">Invoice Date*</label>
                    <input
                        type="date"
                        value={expensesDate}
                        onChange={(e) => setExpensesDate(e.target.value)}
                        className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block font-semibold text-sm mb-1">Invoice#*</label>
                    <input
                        type="text"
                        value={expensesNumber}
                        onChange={(e) => setexpensesNumber(e.target.value)}
                        className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold text-sm mb-2">Category*</label>
                    <select
                        value={categoryOptions}
                        onChange={(e) => setCategoryOptions(e.target.value)}
                        className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        <option value="Labour">Labour</option>
                        <option value="Material">Material</option>
                        <option value="Subcontractor">Subcontractor</option>
                        <option value="Advertising and Marketing">Advertising and Marketing</option>
                    </select>
                    {categoryOptions && (
                        <p className="mt-2 text-sm text-gray-600">Selected: {categoryOptions}</p>
                    )}
                </div>
                <div>
                    <label className="block font-semibold text-sm text-red-500 mb-2">Amount*</label>
                    <input
                        type="number"
                        className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value) }}
                    />
                </div>
                <div>
                    <label className="block font-semibold text-sm mb-2">Notes</label>
                    <textarea
                        placeholder='Max. 500 characters'
                        className='w-full rounded border border-gray-300 py-1 focus:border-blue-400 p-2 h-44'
                        name='shippingStreet1'
                        value={notes}
                        onChange={(e) => { setNotes(e.target.value) }}
                    />
                </div>
            </div>
            <div className='h-16 w-full bottom-0 left-0 fixed border border-1 flex items-center shadow-md bg-white ml-52'>
                <div className='flex gap-3 px-8 '>
                    <button className='bg-[#408dfb] flex items-center px-2 py-1 gap-1 text-sm rounded text-white' style={{ fontSize: 13 }} onClick={updateExpense}>Save</button>
                    <button
    className="px-2 py-1 border bg-[#e5e7eb] rounded font-medium"
    style={{ fontSize: 13 }}
    onClick={() => navigate(-1)} // Navigates back
>
    Cancel
</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateForm;