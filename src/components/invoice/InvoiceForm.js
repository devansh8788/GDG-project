import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';
function InvoiceForm({ onDataChange }) {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-000001');
  const [terms, setTerms] = useState('Due On Receipt');
  const [dueDate, setDueDate] = useState('');
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
            displayName: customer.displayName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
          },
        };
      });

      setCustomerOptions(data);
    } catch (error) {
      console.error('Error fetching customers: ', error);
    }
  };

  // Function to calculate due date based on invoice date and terms
  const calculateDueDate = (invoiceDate, terms) => {
    if (!invoiceDate) return;

    const date = new Date(invoiceDate);
    let dueDate;

    switch (terms) {
      case 'Net 15':
        dueDate = new Date(date.setDate(date.getDate() + 15));
        break;
      case 'Net 30':
        dueDate = new Date(date.setDate(date.getDate() + 30));
        break;
      case 'Net 45':
        dueDate = new Date(date.setDate(date.getDate() + 45));
        break;
      default:
        dueDate = date;
        break;
    }

    // Set the due date to the state
    setDueDate(dueDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate due date whenever invoice date or terms change
    calculateDueDate(invoiceDate, terms);
  }, [invoiceDate, terms]);

  useEffect(() => {
    // Pass the full customer data to parent when customer or other fields change
    onDataChange({
      customer: selectedCustomer?.fullData || null,
      invoiceNumber:`00000${invoices.length+1}`,
      invoiceDate,
      terms,
      dueDate,
    });
  }, [selectedCustomer, invoiceNumber, invoiceDate, terms, dueDate, onDataChange]);

  return (
    <div className="p-6 bg-white rounded-lg  w-full mx-auto">
      <div className="mb-4">
        <label className="block text-red-500 font-semibold text-sm mb-1">Customer Name*</label>
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
          <label className="block text-red-500 font-semibold text-sm mb-1">Invoice#*</label>
          <input
            type="text"
            value={`INV-00000${invoices.length+1}`}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-red-500 font-semibold text-sm mb-1">Invoice Date*</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-500 text-sm mb-2">Terms</label>
          <select
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Due On Receipt</option>
            <option>Net 15</option>
            <option>Net 30</option>
            <option>Net 45</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-sm text-gray-500 mb-2">Due Date</label>
          <input
            type="date"
            value={dueDate}
            readOnly
            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;
