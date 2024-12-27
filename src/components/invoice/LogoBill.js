import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Logobill.css'
import Navbar from '../Navbar';
import logo from '../../assets/logo123.png'
const Logobill = () => {
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [customerInvoices, setCustomerInvoices] = useState([]);
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
  
  // useEffect(() => {
  //     const fetchInvoices = async () => {
  //         try {
  //             const orgData = localStorage.getItem('selectedOrganization');
  //             const parsedOrgData = orgData ? JSON.parse(orgData) : null;

  //             if (!parsedOrgData || !parsedOrgData.id) {
  //                 alert("No valid organization selected!");
  //                 return;
  //             }

  //             const q = query(
  //                 collection(db, `organizations/${parsedOrgData.id}/invoices`)
  //             );
  //             const querySnapshot = await getDocs(q);
  //             const fetchedInvoices = querySnapshot.docs.map(doc => ({
  //                 id: doc.id,
  //                 ...doc.data(),
  //             }));
  //             setInvoices(fetchedInvoices);
  //         } catch (error) {
  //             console.error("Error fetching invoices: ", error);
  //         }
  //     };

  //     fetchInvoices();
  // }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (!billData) return <div className="text-center mt-8">No data available.</div>;

  const { invoiceNumber, customer, items, total, createdAt } = billData;

console.log('====================================');
console.log(customerInvoices);
console.log('====================================');
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
    },
    titleView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingBottom: 20,
      borderBottomWidth: 1
    },
    title: {
      fontSize: 60,
      fontWeight: 'black',
      marginBottom: 20,
    },
    invoiceDetails: {
      fontSize: 10,
      marginBottom: 10,
    },
    billTo: {
      marginTop: 20,
      fontSize: 12,
      fontWeight: 'bold',
    },
    table: {
      display: 'flex',
      width: '100%',
      marginVertical: 20,
    },
    tableRow: {
      flexDirection: 'row',
      borderWidth: 0.5,
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
      backgroundColor: '#f5f6f7'
    },
    tableColHeader: {
      fontSize: 10,
      borderRightWidth: 0.5,
      padding: 5,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    tableRow1: {
      flexDirection: 'row',
      borderWidth: 0.5,
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
      borderTopWidth: 0
    },
    tableColHeader1: {
      fontSize: 10,
      borderRightWidth: 0.5,
      padding: 5,
      textAlign: 'center'
    },
    tableCol: {
      width: '33%',
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      width: '100%'
    },
    subtotalHeadRow: {

    },
    subtotalRow: {
      width: 200,
      flexDirection: 'row',
      borderBottomWidth: 0.4,
      paddingBottom: 5,
      justifyContent: 'space-around',
      marginTop: 7
    },
    footerInner: {
      width: '88%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 10,
      padding: 10,
      paddingBottom: 0
    },
    bold: {
      fontWeight: 'bold',
    },
  });

  const Invoice = () => {
    const [name, setName] = useState("Lalan Chaudhary")
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Invoice Title */}
          <View style={styles.titleView}>
            <View>
              <Text style={styles.invoiceDetails}>Invoice Date: {billData.invoiceDate}</Text>
              <Text style={styles.invoiceDetails}>Invoice No. INV-{billData.invoiceNumber}</Text>
            </View>
            <Text style={styles.title}>Invoice</Text>
          </View>

          {/* Bill To */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View>
              <Text style={styles.billTo}>Bill To:</Text>
              <Text style={{ color: 'blue', fontSize: 10, margin: 5 }}>Mr. {name}</Text>
              <Text style={{ fontSize: 10 }}>+91 8235570955</Text>
            </View>
            <View>
              <Text style={styles.invoiceDetails}>Terms: {billData.terms}</Text>
              <Text style={styles.invoiceDetails}>Due Date: {billData.dueDate}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableColHeader, { width: '5%' }]}>#</Text>
              <Text style={[styles.tableColHeader, { width: '25%' }]}>Item</Text>
              <Text style={[styles.tableColHeader, { width: '35%' }]}>Description</Text>
              <Text style={[styles.tableColHeader, { width: '10%' }]}>Qty</Text>
              <Text style={[styles.tableColHeader, { width: '10%' }]}>rate</Text>
              <Text style={[styles.tableColHeader, { width: '15%' }]}>Amount</Text>
            </View>
            {
              billData.items.map((item, idx) => {
                return (
                  <View style={styles.tableRow1}>
                    <Text style={[styles.tableColHeader1, { width: '5%' }]}>{idx + 1}</Text>
                    <Text style={[styles.tableColHeader1, { width: '25%' }]}>{item.itemDetails}</Text>
                    <Text style={[styles.tableColHeader1, { width: '35%' }]}>{item.itemDetails}</Text>
                    <Text style={[styles.tableColHeader1, { width: '10%' }]}>{item.quantity}</Text>
                    <Text style={[styles.tableColHeader1, { width: '10%' }]}>{item.rate}</Text>
                    <Text style={[styles.tableColHeader1, { width: '15%' }]}>{item.amount}</Text>
                  </View>
                )
              })
            }


          </View>



          {/* Subtotal and Totals */}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 10 }}>Thanks for your buisness</Text>
            <View style={styles.subtotalHeadRow}>
              <View style={styles.subtotalRow}>
                <Text style={{ fontSize: 10 }}>Sub Total</Text>
                <Text style={{ fontSize: 10 }}>{billData.subTotal}</Text>
              </View>
              <View style={styles.subtotalRow}>
                <Text style={{ fontSize: 10 }}>Discount ({billData.discount}%)</Text>
                <Text style={{ fontSize: 10 }}>{billData.DiscPrice}</Text>
              </View>
              <View style={styles.subtotalRow}>
                <Text style={{ fontSize: 10 }}>Tax ({billData.taxRate}%)</Text>
                <Text style={{ fontSize: 10 }}>{billData.TaxPrice}</Text>
              </View>
              <View style={styles.subtotalRow}>
                <Text style={{ fontSize: 10 }}>Grand Total</Text>
                <Text style={{ fontSize: 10 }}>Rs. {billData.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerInner}>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end', marginTop: 20 }}>
                <Text style={styles.bold}>Authorized Signature</Text>
                <View style={{ height: 1, width: 120, backgroundColor: '#000' }}></View>
              </View>
              <View>
                <Text style={styles.bold}>Samira Hadid</Text>
                <Text>123 Anywhere St, Any City</Text>
                <Text>+123-456-7890</Text>
                <Text>hello@reallygreatsite.com</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    )
  };

  return (
    <div className='ml-52'>
      <Navbar />
      <div className='flex'>
        <div className='left_bar border w-80 '>
          {
            customerInvoices.map(customer=>{
              return(
                <div className='border p-2 m-2 my-4'>
                <div className='flex justify-between'>
                  <p className='text-blue-500'>Mr. {customer.customer.displayName}</p>
                  <p>₹ {customer.total.toFixed(2)}</p>
                </div>
                <div className='flex gap-6 font-light text-sm'>
                  <p>INV-{customer.invoiceNumber}</p>
                  <p>{customer.invoiceDate}</p>
                </div>
                <p>Net 15</p>
              </div>
              )
            })
          }


        </div>
        <div className='page12' >
            {/* Invoice Title */}
            <div className='titlediv12' >
              <div>
                <img src={logo} className='logo12' />
              </div>
              <p className='title12' >Invoice</p>
            </div>
            {/* Bill To */}
            <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between',marginTop:30}}>
              <div>
                <p className='billTo12'>Bill To:</p>
                <p style={{ fontSize: 16, marginVertical: 5 ,fontWeight:'bold'}}>Mr. Lalan Chaudhary</p>
                <p style={{ fontSize: 12 , marginVertical: 5}}>+91 8235570955</p>
                <p style={{ fontSize: 12 , marginVertical: 5}}>lalan28@gmail.com</p>
              </div>
              <div>
                <p className='invoiceDetails12' style={{fontSize:14,fontWeight:'bold'}}>Invoice No. 12345</p>
                <p className='invoiceDetails12' >16 June 2025</p>
              </div>
            </div>
            {/* Table */}
            <div className='table12'>
              <div className='tableRow12'>
                <p className='tableColHeader12' style={{ width: '5%' }}>#</p>
                <p className='tableColHeader12' style={{ width: '25%' }}>Item</p>
                <p className='tableColHeader12' style={{ width: '35%' }}>Description</p>
                <p className='tableColHeader12' style={{ width: '10%' }}>Qty</p>
                <p className='tableColHeader12' style={ { width: '10%' }}>rate</p>
                <p className='tableColHeader12' style={ { width: '15%' }}>Amount</p>
              </div>
      
              <div className='tableRow112'>
                <p className='tableColHeader112' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader112' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader112' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader112' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader112' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader112' style={ { width: '15%' }}>999</p>
              </div>
      
              <div className='tableRow112'>
                <p className='tableColHeader212' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader212' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader212' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader212' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader212' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader212' style={ { width: '15%' }}>999</p>
              </div>
      
              <div className='tableRow112'>
                <p className='tableColHeader112' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader112' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader112' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader112' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader112' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader112' style={ { width: '15%' }}>999</p>
              </div>
      
              <div className='tableRow112'>
                <p className='tableColHeader212' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader212' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader212' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader212' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader212' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader212' style={ { width: '15%' }}>999</p>
              </div>
      
            </div>
      
      
      
            {/* Subtotal and Totals */}
      
            <div style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 14 }}>Thanks for your buisness</p>
              <div className='subtotalHeadRow12' >
                <div className='subtotalRow12'>
                  <p style={{ fontSize: 12 }}>Sub Total</p>
                  <p style={{ fontSize: 12 }}>480</p>
                </div>
                <div className='subtotalRow12' >
                  <p style={{ fontSize: 12 }}>Tax (18%)</p>
                  <p style={{ fontSize: 12 }}>480</p>
                </div>
                <div className='subtotalRow112' >
                  <p style={{ fontSize: 15,color:'#fff' }}>Grand Total</p>
                  <p style={{ fontSize: 15,color:'#fff' }}>480</p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className='footer12'>
              <div className='footerInner12'>
                <div style={{display:'flex', flexDirection: 'row', gap: 10, alignItems: 'flex-end', marginTop: 20 }}>
                  <p className='bold12' >Authorized Signature</p>
                  <div style={{ height: 1, width: 120, backgroundColor: '#000' }}></div>
                </div>
              </div>
            </div>
          </div>
      </div>
      {/* <div>
        <button className='button-83'>
        <PDFDownloadLink document={<Invoice />} fileName="invoice.pdf">
          {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink>
        </button>
      </div> */}
    </div>
  );
};

export default Logobill;
