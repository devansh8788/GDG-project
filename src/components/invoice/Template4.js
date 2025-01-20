import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './bill.css'
import Navbar from '../Navbar';
import TemplateSidebar from './TemplateSidebar';
const Template4 = () => {
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [customerInvoices, setCustomerInvoices] = useState([]);
    const [rightSidebarshow,setRightSidebarshow]=useState(false);

    const navigate=useNavigate();

    const [invoice, setInvoice] = useState({
      invoiceNumber: "INV2023-001",
      invoiceDate: "August 14, 2023",
      dueDate: "September 14, 2023",
      from: {
        name: "Your Company Name",
        address: "Your Company Address",
        city: "City, State, Zip Code",
        contact: "Your Contact Information",
      },
      to: {
        name: "John Smith, XYZ Corporation",
        address: "789 Elm Avenue",
        city: "Another Town, NY 54321",
        contact: "(555) 123-4567",
      },
      items: [
        { description: "Consulting Services", amount: 5, price: 1500 },
        { description: "Software Development", amount: 3, price: 2000 },
        { description: "Design Services", amount: 2, price: 4500 },
      ],
      taxRate: 10,
      bankDetails: {
        bankName: "XYZ Bank",
        accountName: "ABC Services Inc.",
        accountNumber: "1234567890",
        routingNumber: "987654321",
        reference: "Invoice #INV2023-001",
      },
      terms: "Payment is due within 30 days of the invoice date. Late payments may be subject to a 5% late fee.",
    });
  
    const subtotal = invoice.items.reduce(
      (total, item) => total + item.amount * item.price,
      0
    );
    const total = subtotal + (subtotal * invoice.taxRate) / 100;
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
  
          const q = query(
            collection(db, `organizations/${parsedOrgData.id}/invoices`)
          );
          const querySnapshot = await getDocs(q);
  
          const fetchedInvoices = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInvoices(fetchedInvoices);
  
          const filteredInvoices = fetchedInvoices.filter(invoice =>
            invoice.customer.id === billData.customer.id
          );
          setCustomerInvoices(filteredInvoices);
        } else {
          alert('No such invoice found!');
        }
      } catch (error) {
        console.error('Error fetching bill data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBillData();
  }, [id]);


// Define styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f766e",
    color: "white",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 5,
    backgroundColor: "white",
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    backgroundColor: "#0f766e",
    color: "white",
    padding: 5,
    flex: 1,
    textAlign: "center",
  },
  tableCell: {
    padding: 5,
    flex: 1,
    textAlign: "center",
    border: "1px solid #ddd",
  },
  totals: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTop: "1px solid #ddd",
    fontSize: 10,
  },
});

// Dummy Data
const invoice2 = {
  invoiceNumber: "12345",
  invoiceDate: "2025-01-15",
  dueDate: "2025-01-25",
  from: {
    name: "Your Company",
    address: "123 Main St",
    city: "City, State",
    contact: "123-456-7890",
  },
  to: {
    name: "Customer Name",
    address: "456 Elm St",
    city: "City, State",
    contact: "987-654-3210",
  },
  items: [
    { description: "Item 1", amount: 2, price: 100 },
    { description: "Item 2", amount: 1, price: 200 },
  ],
  taxRate: 10,
  bankDetails: {
    bankName: "Bank Name",
    accountName: "Account Name",
    accountNumber: "123456789",
    routingNumber: "987654321",
    reference: "Invoice #12345",
  },
  terms: "Payment due within 10 days.",
};

const InvoicePDF = () => {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.amount * item.price,
    0
  );
  const tax = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>INVOICE</Text>
          <View>
            <Text>Invoice #: {invoice2.invoiceNumber}</Text>
            <Text>Invoice Date: {invoice2.invoiceDate}</Text>
            <Text>Due Date: {invoice2.dueDate}</Text>
          </View>
        </View>

        {/* From and To Section */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontWeight: "bold" }}>From</Text>
              <Text>{invoice2.from.name}</Text>
              <Text>{invoice2.from.address}</Text>
              <Text>{invoice2.from.city}</Text>
              <Text>{invoice2.from.contact}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "bold" }}>Bill To</Text>
              <Text>{invoice2.to.name}</Text>
              <Text>{invoice2.to.address}</Text>
              <Text>{invoice2.to.city}</Text>
              <Text>{invoice2.to.contact}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Description</Text>
              <Text style={styles.tableCellHeader}>Amount</Text>
              <Text style={styles.tableCellHeader}>Price</Text>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
            {invoice2.items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.amount}</Text>
                <Text style={styles.tableCell}>{item.price.toFixed(2)}</Text>
                <Text style={styles.tableCell}>
                  {(item.amount * item.price).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totals}>
          <View>
            <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
            <Text>Tax ({invoice2.taxRate}%): ${tax.toFixed(2)}</Text>
            <Text style={{ fontWeight: "bold" }}>Total: ${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View>
            <Text style={{ fontWeight: "bold" }}>Payment Instructions</Text>
            <Text>Bank: {invoice2.bankDetails.bankName}</Text>
            <Text>Account Name: {invoice2.bankDetails.accountName}</Text>
            <Text>Account Number: {invoice2.bankDetails.accountNumber}</Text>
            <Text>Routing Number: {invoice2.bankDetails.routingNumber}</Text>
            <Text>Reference: {invoice2.bankDetails.reference}</Text>
          </View>
          <View>
            <Text style={{ fontWeight: "bold" }}>Terms & Conditions</Text>
            <Text>{invoice.terms}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
  


  return (
    <div className='ml-52'>
      <Navbar />
      <div className='flex'>
        <div className='left_bar border w-80 '>
          {
            customerInvoices.map(customer=>{
              return(
                <div className='border p-2 m-2 my-4' onClick={()=>{navigate(`/dashboard/bill/${customer.id}`)}} >
                <div className='flex justify-between'>
                  <p className='text-blue-500'>Mr. {customer.customer.displayName}</p>
                  <p>₹ {customer.total.toFixed(2)}</p>
                </div>
                <div className='flex gap-6 font-light text-sm'>
                  <p>INV-{customer.invoiceNumber}</p>
                  <p>{customer.invoiceDate}</p>
                </div>
                <p style={{color:customer.terms==='Paid'?'#22c55e':'red'}}>{customer.terms}</p>
              </div>
              )
            })
          }


        </div>
        <div style={{margin:'auto'}}>
        <div className="min-h-screen bg-gradient-to-br from-teal-20 to-teal-50 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-teal-600 text-white p-6">
          <h1 className="text-3xl font-bold">INVOICE</h1>
          <div className="text-right">
            <p className="text-sm">Invoice #: {invoice.invoiceNumber}</p>
            <p className="text-sm">Invoice Date: {invoice.invoiceDate}</p>
            <p className="text-sm">Due Date: {invoice.dueDate}</p>
          </div>
        </div>

        {/* From and To Section */}
        <div className="p-6 bg-teal-50 flex justify-between">
          <div>
            <h2 className="text-lg font-semibold text-teal-700">From</h2>
            <p className="text-sm text-gray-600">{invoice.from.name}</p>
            <p className="text-sm text-gray-600">{invoice.from.address}</p>
            <p className="text-sm text-gray-600">{invoice.from.city}</p>
            <p className="text-sm text-gray-600">{invoice.from.contact}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-teal-700">Bill To</h2>
            <p className="text-sm text-gray-600">{invoice.to.name}</p>
            <p className="text-sm text-gray-600">{invoice.to.address}</p>
            <p className="text-sm text-gray-600">{invoice.to.city}</p>
            <p className="text-sm text-gray-600">{invoice.to.contact}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Amount</th>
                <th className="border p-2 text-right">Price</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-teal-50" : "bg-white"
                  } hover:bg-teal-100`}
                >
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-right">{item.amount}</td>
                  <td className="border p-2 text-right">{item.price.toFixed(2)}</td>
                  <td className="border p-2 text-right">
                    {(item.amount * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="p-6 flex justify-end">
          <div className="w-1/3 text-sm">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax ({invoice.taxRate}%):</p>
              <p>${((subtotal * invoice.taxRate) / 100).toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <p>Total:</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-teal-50 p-6 flex">
          {/* Payment Instructions */}
          <div className="w-1/2">
            <h2 className="text-lg font-semibold text-teal-700">Payment Instructions</h2>
            <p className="text-sm text-gray-600">Bank: {invoice.bankDetails.bankName}</p>
            <p className="text-sm text-gray-600">
              Account Name: {invoice.bankDetails.accountName}
            </p>
            <p className="text-sm text-gray-600">
              Account Number: {invoice.bankDetails.accountNumber}
            </p>
            <p className="text-sm text-gray-600">
              Routing Number: {invoice.bankDetails.routingNumber}
            </p>
            <p className="text-sm text-gray-600">
              Reference: {invoice.bankDetails.reference}
            </p>
          </div>
          {/* Terms & Conditions */}
          <div className="w-1/2 text-right">
            <h2 className="text-lg font-semibold text-teal-700">Terms & Conditions</h2>
            <p className="text-sm text-gray-600">{invoice.terms}</p>
          </div>
        </div>
      </div>
    </div>
        <div className='mb-4'>
          <button className='text-blue-600' onClick={()=>{setRightSidebarshow(true)}}>Change Layout</button>
          <button className='button-83'>
                    <PDFDownloadLink document={<InvoicePDF />} fileName="invoice.pdf">
                      {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
                    </PDFDownloadLink>
                  </button>
        </div>
        </div>
      </div>
      {
        rightSidebarshow &&  <TemplateSidebar setRightSidebarshow={setRightSidebarshow} id={id} />
      }
    </div>
  );
};

export default Template4;

