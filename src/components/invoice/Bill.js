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
import { GrEdit } from "react-icons/gr";
import { IoMdPrint } from "react-icons/io";
import { FaRegShareSquare } from "react-icons/fa";
const Bill = () => {
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [customerInvoices, setCustomerInvoices] = useState([]);
  const [rightSidebarshow, setRightSidebarshow] = useState(false);

  const navigate = useNavigate();
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
              <Text style={{ color: 'blue', fontSize: 10, margin: 5, marginBottom: 0 }}>{billData.customer.salutation} {billData.customer.displayName}</Text>
              <Text style={{ fontSize: 10, marginHorizontal: 5, marginVertical: 5 }}>{billData.customer.email}</Text>
              <Text style={{ fontSize: 10, marginHorizontal: 5 }}>+91 {billData.customer.mobile}</Text>
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
                  <>
                    {
                      idx !== items.length - 1 ?
                        <View style={styles.tableRow1}>
                          <Text style={[styles.tableColHeader1, { width: '5%' }]}>{idx + 1}</Text>
                          <Text style={[styles.tableColHeader1, { width: '25%' }]}>{item.itemDetails}</Text>
                          <Text style={[styles.tableColHeader1, { width: '35%' }]}>{item.itemDetails}</Text>
                          <Text style={[styles.tableColHeader1, { width: '10%' }]}>{item.quantity}</Text>
                          <Text style={[styles.tableColHeader1, { width: '10%' }]}>{item.rate}</Text>
                          <Text style={[styles.tableColHeader1, { width: '15%' }]}>{item.amount}</Text>
                        </View>
                        : ''
                    }
                  </>
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
            customerInvoices.map(customer => {
              return (
                <div className='border p-2 m-2 my-4' onClick={() => { navigate(`/dashboard/bill/${customer.id}`) }} >
                  <div className='flex justify-between'>
                    <p className='text-blue-500'>Mr. {customer.customer.displayName}</p>
                    <p>₹ {customer.total.toFixed(2)}</p>
                  </div>
                  <div className='flex  justify-between font-light text-sm'>
                    <p>INV-{customer.invoiceNumber}</p>
                    <p>{customer.invoiceDate}</p>
                  </div>
                  <p style={{ color: customer.terms === 'Paid' ? '#22c55e' : 'red' }}>{customer.terms}</p>
                </div>
              )
            })
          }


        </div>
        <div>
          <div className='p-4 text-lg font-semibold'>INV-{billData.invoiceNumber}</div>
          <div className='flex w-full border bg-gray-200'>
            <p className='inline border-r border-gray-400 p-2 px-4 cursor-pointer'> <span ><GrEdit className='inline' /></span> Edit</p>
            <p className='inline border-r border-gray-400  p-2 px-4'> <IoMdPrint className='inline' /><PDFDownloadLink document={<Invoice />} fileName="invoice.pdf">
                  {({ loading }) => (loading ? 'Loading document...' : 'Print')}
                </PDFDownloadLink></p>
            <p className='inline border-r border-gray-400  p-2 px-4'> <FaRegShareSquare className='inline' /> Share</p>
          </div>
          <div style={{ marginLeft: 50 }}>
            <div className='page'>
              <div className='titlediv'>
                <div>
                  <p className='invoiceDetails'>Invoice No. INV-{billData.invoiceNumber}</p>
                  <p className='invoiceDetails'>Invoice Date: {billData.invoiceDate}</p>
                </div>
                <p className='title'>Invoice</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p className='billTo'>Bill To:</p>
                  <p style={{ color: 'blue', fontSize: 14, margin: 5 }}>{billData.customer.salutation} {billData.customer.displayName}</p>
                  <p style={{ fontSize: 14, margin: 5 }}>{billData.customer.email}</p>
                  <p style={{ fontSize: 14, margin: 5 }}>+91 {billData.customer.mobile}</p>
                </div>
                <div>
                  <p className='invoiceDetails'>Terms: {billData.terms}</p>
                  <p className='invoiceDetails'>Due Date: {billData.dueDate}</p>
                </div>
              </div>


              <div className='table'>
                <div className='tableRow'>
                  <p className='tableColHeader' style={{ width: '5%' }}>#</p>
                  <p className='tableColHeader' style={{ width: '25%' }}>Item</p>
                  <p className='tableColHeader' style={{ width: '35%' }}>Description</p>
                  <p className='tableColHeader' style={{ width: '10%' }}>Qty</p>
                  <p className='tableColHeader' style={{ width: '10%' }}>Rate (₹)</p>
                  <p className='tableColHeader' style={{ width: '15%',borderRight:0 }}>Amount (₹)</p>
                </div>
                {
                  billData.items.map((item, idx) => {
                    return (<>
                      {
                        idx !== items.length - 1 ? <div className='tableRow1'>
                          <p className='tableColHeader1' style={{ width: '5%' }}>{idx + 1}</p>
                          <p className='tableColHeader1' style={{ width: '25%' }}>{item.itemDetails}</p>
                          <p className='tableColHeader1' style={{ width: '35%' }}>{item.description}</p>
                          <p className='tableColHeader1' style={{ width: '10%' }}>{item.quantity}</p>
                          <p className='tableColHeader1' style={{ width: '10%' }}>{item.rate}</p>
                          <p className='tableColHeader1' style={{ width: '15%',borderRight:0 }}>{item.amount}</p>
                        </div> : <></>
                      }

                    </>

                    )
                  })
                }



              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 14 }}>Thanks for your buisness</p>
                <div className='subtotalHeadRow' >
                  <div className='subtotalRow' >
                    <p style={{ fontSize: 12, width: '60%' }}>Sub Total</p>
                    <p style={{ fontSize: 12 }}>{billData.subTotal}</p>
                  </div>
                  <div className='subtotalRow'>
                    <p style={{ fontSize: 12, width: '60%' }}>Discount ({billData.discount}%)</p>
                    <p style={{ fontSize: 12 }}>{billData.DiscPrice}</p>
                  </div>
                  <div className='subtotalRow'>
                    <p style={{ fontSize: 12, width: '60%' }}>Tax ({billData.taxRate}%)</p>
                    <p style={{ fontSize: 12, }}>{billData.TaxPrice}</p>
                  </div>
                  <div className='subtotalRow' >
                    <p style={{ fontSize: 16, fontWeight: 'bold', margin: 0, padding: 5, width: '60%' }}>Grand Total</p>
                    <p style={{ fontSize: 16, fontWeight: 'bold', margin: 0, padding: 5 }}>{billData.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className='footer' >
                <div className='footerInner'>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginTop: 20 }}>
                    <p className='bold' >Authorized Signature</p>
                    <div style={{ height: 1, width: 120, backgroundColor: '#000' }}></div>
                  </div>
                </div>
              </div>
              <button className='button-83'>
                <PDFDownloadLink document={<Invoice />} fileName="invoice.pdf">
                  {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
                </PDFDownloadLink>
              </button>
            </div>
            <div className='mb-4'>
              <button className='text-blue-600' onClick={() => { setRightSidebarshow(true) }}>Change Layout</button>
            </div>
          </div>
        </div>
      </div>
      {
        rightSidebarshow && <TemplateSidebar setRightSidebarshow={setRightSidebarshow} id={id} />
      }
    </div>
  );
};

export default Bill;
