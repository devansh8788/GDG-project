import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, query, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
function InvoiceForm() {
  const navigate=useNavigate();
  const [customerOptions, setCustomerOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [expensesDate, setExpensesDate] = useState('');
  const [expensesNumber, setexpensesNumber] = useState('');
  const [amount,setAmount]=useState(null);
  const [notes,setNotes]=useState('');
  // Fetch customer data from Firestore
  const fetchData = async () => {
    try {
      const orgData = await AsyncStorage.getItem('selectedOrganization');
      const parsedOrgData = orgData ? JSON.parse(orgData) : null;

      if (!parsedOrgData || !parsedOrgData.id) {
        console.error('No valid organization selected!');
        return;
      }

      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/customers`));

      // Map customer data into options with full data stored
      const data = querySnapshot.docs.map((doc) => {
        const customer = doc.data();
        return {
          value: doc.id,
          label: customer.displayName || 'Unnamed Customer',
          fullData: {
            id: doc.id,
            salutation: customer.salutation,
            firstName: customer.firstName,
            lastName: customer.lastName,
            companyName: customer.companyName,
            displayName: customer.displayName,
            currency: customer.currency,
            email: customer.email,
            workPhone: customer.workPhone,
            mobile: customer.mobile,
            pan: customer.pan,
          },
        };
      });

      setCustomerOptions(data);
    } catch (error) {
      console.error('Error fetching customers: ', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const orgData = await AsyncStorage.getItem('selectedOrganization');
      const parsedOrgData = orgData ? JSON.parse(orgData) : null;
  
      if (!parsedOrgData || !parsedOrgData.id) {
        alert("No valid organization selected!");
        return;
      }

      const ExpensesData={
        selectedCustomer:selectedCustomer,
        expensesDate:expensesDate,
        categoryOptions:categoryOptions,
        expensesNumber:expensesNumber,
        amount:amount,
        notes:notes
      }
      await addDoc(
        collection(db, `organizations/${parsedOrgData.id}/expenses`),
        ExpensesData
      );
      alert("ho gaya")
      navigate("/dashboard/expenses")

    } catch (error) {
      console.error("Error saving invoice: ", error);
    }
  };


  return (
    <div className="p-6 bg-white rounded-lg  mx-auto ml-52">
      <div className="mb-4">
        <label className="block text-red-500 font-semibold text-sm mb-1">Category Name*</label>
        <Select
          options={customerOptions}
          value={customerOptions.find((option) => option.value === selectedCustomer?.id)}
          onChange={(selectedOption) => setSelectedCustomer(selectedOption)}
          placeholder="Select or add a customer"
          className="w-full text-sm"
        />
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
            <option>Labour</option>
            <option>Matelrial</option>
            <option>subcontractor</option>
            <option>Advertising and marketing</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-sm text-red-500 mb-2">Amount*</label>
          <input
            type="number"
            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={amount}
            onChange={(e)=>{setAmount(e.target.value)}}
          />
        </div>
        <div>
        <label className="block font-semibold text-sm mb-2">Notes</label>
        <textarea
          placeholder='Max. 500 characters'
          className='w-full rounded border border-gray-300 py-1 focus:border-blue-400 p-2 h-44'
          name='shippingStreet1'
          value={notes}
          onChange={(e)=>{setNotes(e.target.value)}}
        />
        </div>
      </div>
      <div className='h-16 w-full bottom-0 left-0 fixed border border-1 flex items-center shadow-md bg-white ml-52'>
                <div className='flex gap-3 px-8 '>
                    <button className='bg-[#408dfb] flex items-center px-2 py-1 gap-1 text-sm rounded text-white' style={{ fontSize: 13 }} onClick={handleSave}>Save</button>
                    <button className='px-2 py-1 border bg-[#e5e7eb] rounded font-medium' style={{ fontSize: 13 }} >Cancel</button>
                </div>
            </div>
    </div>
  );
}

export default InvoiceForm;
