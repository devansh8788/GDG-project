import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../../firebase';
import { doc, getDoc, collection, getDocs, query, addDoc } from 'firebase/firestore';
import EditInvoiceForm from './EditInvoiceForm';
import EditInvoiceTable from './EditInvoiceTable';
import { useNavigate, useParams } from 'react-router-dom';

const EditInv = () => {
  const navigate=useNavigate();
  const [invoiceFormData, setInvoiceFormData] = useState({});
  const [invoiceTableData, setInvoiceTableData] = useState([]);
  const [invoiceForm1Data, setInvoiceForm1Data] = useState({});
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
    const { id } = useParams();
  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const orgData = await AsyncStorage.getItem('selectedOrganization');
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;

        if (!parsedOrgData || !parsedOrgData.id) {
          alert('No valid organization selected!');
          setLoading(false);
          return;
        }

        const docRef = doc(db, `organizations/${parsedOrgData.id}/invoices`, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const billData = docSnap.data();
          setBillData(billData);
        } else {
          alert('No such invoice found!');
          console.log('====================================');
          console.log("kuchh nhi");
          console.log('====================================');
        }
      } catch (error) {
        console.error('Error fetching bill data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillData();
  }, [id]);
  
  const handleSave = async () => {
    try {
      const orgData = await AsyncStorage.getItem('selectedOrganization');
      const parsedOrgData = orgData ? JSON.parse(orgData) : null;
  
      if (!parsedOrgData || !parsedOrgData.id) {
        alert("No valid organization selected!");
        return;
      }
  
      const invoiceData = {
        ...invoiceFormData, // Includes full customer data
        items: invoiceTableData, // Table data (items)
        notes: invoiceForm1Data.notes, // Notes
        total: invoiceForm1Data.total, // Total amount
        discount:invoiceForm1Data.discount,
        taxRate:invoiceForm1Data.taxRate,
        TaxPrice:invoiceForm1Data.TaxPrice,
        DiscPrice:invoiceForm1Data.DiscPrice,
        subTotal:invoiceForm1Data.subTotal,
        createdAt: new Date(),
      };
      await addDoc(
        collection(db, `organizations/${parsedOrgData.id}/invoices`),
        invoiceData
      );

      navigate('/dashboard/email', { state: { invoiceNumber: invoiceFormData.invoiceNumber } });

    } catch (error) {
      console.error("Error saving invoice: ", error);
    }
  };
  if (loading) return <div className="text-center mt-8">Loading...</div>;
  
  return (
    <div className="ml-52">

      <EditInvoiceForm onDataChange={(data) => setInvoiceFormData(data)} billData={billData} />
      <EditInvoiceTable onTableDataChange={(data) => setInvoiceTableData(data)} onForm1DataChange={(data) => setInvoiceForm1Data(data)} billData={billData} />
      {/* <InvoiceForm1 onForm1DataChange={(data) => setInvoiceForm1Data(data)} /> */}
      <div className="flex space-x-4 mt-6 items-center h-14">
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300 ml-6">
          Save as Draft
        </button>
        <button onClick={handleSave} className="bg-[#404dfb] text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          Save and Send
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 5a1 1 0 00-1 1v4H5a1 1 0 000 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditInv;
