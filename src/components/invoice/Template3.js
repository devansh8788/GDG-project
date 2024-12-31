import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Template3.css'
import Navbar from '../Navbar';
import logo from '../../assets/logo123.png'
import TemplateSidebar from './TemplateSidebar';
const Template3 = () => {
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [customerInvoices, setCustomerInvoices] = useState([]);
  const [rightSidebarshow, setRightSidebarshow] = useState(false);
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
      padding: 20,
      fontFamily: 'Helvetica',
    },
    titleView: {
      paddingHorizontal: 30
    },
    logo: {
      width: 150
    },
    title: {
      fontSize: 40,
      marginBottom: 20,
      fontWeight: 'bold',
      color: 'red',
      fontFamily: 'times-new-roman'
    },
    invoiceDetails: {
      fontSize: 10,
      marginBottom: 10,
    },
    billTo: {
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
      backgroundColor: '#3871c1'
    },
    tableColHeader: {
      fontSize: 10,
      borderRightWidth: 0.5,
      padding: 5,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#fff'
    },
    tableRow1: {
      flexDirection: 'row',
    },
    tableColHeader1: {
      fontSize: 10,
      borderColor: '#bedef1',
      borderRightWidth: 1,
      padding: 5,
      textAlign: 'center'
    },
    tableColHeader2: {
      fontSize: 10,
      borderColor: '#bedef1',
      borderRightWidth: 1,
      padding: 5,
      textAlign: 'center',
      backgroundColor: '#bedef1'
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
      width: 150,
      flexDirection: 'row',
      // borderBottomWidth: 0.4,
      paddingBottom: 5,
      justifyContent: 'space-around',
      marginTop: 7,
      marginLeft: 50
    },
    subtotalRow1: {
      width: 200,
      flexDirection: 'row',
      // borderBottomWidth: 0.4,
      justifyContent: 'space-around',
      marginTop: 7,
      fontWeight: 'bold',
      backgroundColor: '#3871c1',
      padding: 2
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

  // Invoice PDF Component
  const Invoice = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Invoice Title */}
        <View style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }}>
          <Image src={require('../../assets/back2.jpg')} style={{ width: '100%', height: '110%' }} />
        </View>
        <View style={styles.titleView}>
          <View>
            <Image src={logo} style={styles.logo} />
          </View>
          <Text style={styles.title}>Invoice</Text>
        </View>
        {/* Bill To */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
          <View>
            <Text style={styles.billTo}>Bill To:</Text>
            <Text style={{ fontSize: 16, marginVertical: 5, fontWeight: 'bold' }}>Mr. Lalan Chaudhary</Text>
            <Text style={{ fontSize: 10, marginVertical: 2 }}>+91 8235570955</Text>
            <Text style={{ fontSize: 10, marginVertical: 2 }}>lalan28@gmail.com</Text>
            <Text style={{ fontSize: 10, marginVertical: 2 }}>123 Anywhere St,at any</Text>
          </View>
          <View>
            <Text style={[styles.invoiceDetails, { fontSize: 14, fontWeight: 'bold' }]}>Invoice No. 12345</Text>
            <Text style={[styles.invoiceDetails]}>16 June 2025</Text>
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

          <View style={styles.tableRow1}>
            <Text style={[styles.tableColHeader1, { width: '5%' }]}>1</Text>
            <Text style={[styles.tableColHeader1, { width: '25%' }]}>Eardops</Text>
            <Text style={[styles.tableColHeader1, { width: '35%' }]}>Boat fire AirDops</Text>
            <Text style={[styles.tableColHeader1, { width: '10%' }]}>1</Text>
            <Text style={[styles.tableColHeader1, { width: '10%' }]}>1499</Text>
            <Text style={[styles.tableColHeader1, { width: '15%' }]}>999</Text>
          </View>

          <View style={styles.tableRow1}>
            <Text style={[styles.tableColHeader2, { width: '5%' }]}>1</Text>
            <Text style={[styles.tableColHeader2, { width: '25%' }]}>Eardops</Text>
            <Text style={[styles.tableColHeader2, { width: '35%' }]}>Boat fire AirDops</Text>
            <Text style={[styles.tableColHeader2, { width: '10%' }]}>1</Text>
            <Text style={[styles.tableColHeader2, { width: '10%' }]}>1499</Text>
            <Text style={[styles.tableColHeader2, { width: '15%' }]}>999</Text>
          </View>

          <View style={styles.tableRow1}>
            <Text style={[styles.tableColHeader1, { width: '5%' }]}>1</Text>
            <Text style={[styles.tableColHeader1, { width: '25%' }]}>Eardops</Text>
            <Text style={[styles.tableColHeader1, { width: '35%' }]}>Boat fire AirDops</Text>
            <Text style={[styles.tableColHeader1, { width: '10%' }]}>1</Text>
            <Text style={[styles.tableColHeader1, { width: '10%' }]}>1499</Text>
            <Text style={[styles.tableColHeader1, { width: '15%' }]}>999</Text>
          </View>

          <View style={styles.tableRow1}>
            <Text style={[styles.tableColHeader2, { width: '5%' }]}>1</Text>
            <Text style={[styles.tableColHeader2, { width: '25%' }]}>Eardops</Text>
            <Text style={[styles.tableColHeader2, { width: '35%' }]}>Boat fire AirDops</Text>
            <Text style={[styles.tableColHeader2, { width: '10%' }]}>1</Text>
            <Text style={[styles.tableColHeader2, { width: '10%' }]}>1499</Text>
            <Text style={[styles.tableColHeader2, { width: '15%' }]}>999</Text>
          </View>

        </View>



        {/* Subtotal and Totals */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 10 }}>Thanks for your buisness</Text>
          <View style={styles.subtotalHeadRow}>
            <View style={styles.subtotalRow}>
              <Text style={{ fontSize: 10 }}>Sub Total</Text>
              <Text style={{ fontSize: 10 }}>480</Text>
            </View>
            <View style={styles.subtotalRow}>
              <Text style={{ fontSize: 10 }}>Tax (18%)</Text>
              <Text style={{ fontSize: 10 }}>480</Text>
            </View>
            <View style={styles.subtotalRow1}>
              <Text style={{ fontSize: 15, color: '#fff' }}>Grand Total</Text>
              <Text style={{ fontSize: 15, color: '#fff' }}>480</Text>
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
          </View>
        </View>
      </Page>
    </Document>
  );


  return (
    <div className='ml-52'>
      <Navbar />
      <div className='flex'>
        <div className='left_bar border w-80 '>
          {
            customerInvoices.map(customer => {
              return (
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
        <div style={{ margin: 'auto' }}>
          <div className='page123' >
            {/* Invoice Title */}
            <div className='titlediv123' >
            </div>
            {/* <View style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 ,}}>
              <Image src={require('../../assets/back2.jpg')} style={{ width: '100%', height: '110%' }} />
            </View> */}
            {/* Bill To */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
              <div>
                <p className='billTo123'>Bill To:</p>
                <p style={{ fontSize: 16, marginVertical: 5, fontWeight: 'bold' }}>Mr. Lalan Chaudhary</p>
                <p style={{ fontSize: 12, marginVertical: 5 }}>+91 8235570955</p>
                <p style={{ fontSize: 12, marginVertical: 5 }}>lalan28@gmail.com</p>
              </div>
              <div>
                <p className='invoiceDetails123' style={{ fontSize: 14, fontWeight: 'bold' }}>Invoice No. 12345</p>
                <p className='invoiceDetails123' >16 June 2025</p>
              </div>
            </div>
            {/* Table */}
            <div className='table123'>
              <div className='tableRow123'>
                <p className='tableColHeader123' style={{ width: '5%' }}>#</p>
                <p className='tableColHeader123' style={{ width: '25%' }}>Item</p>
                <p className='tableColHeader123' style={{ width: '35%' }}>Description</p>
                <p className='tableColHeader123' style={{ width: '10%' }}>Qty</p>
                <p className='tableColHeader123' style={{ width: '10%' }}>rate</p>
                <p className='tableColHeader123' style={{ width: '15%' }}>Amount</p>
              </div>

              <div className='tableRow1123'>
                <p className='tableColHeader1123' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader1123' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader1123' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader1123' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader1123' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader1123' style={{ width: '15%' }}>999</p>
              </div>

              <div className='tableRow1123'>
                <p className='tableColHeader2123' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader2123' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader2123' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader2123' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader2123' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader2123' style={{ width: '15%' }}>999</p>
              </div>

              <div className='tableRow1123'>
                <p className='tableColHeader1123' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader1123' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader1123' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader1123' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader1123' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader1123' style={{ width: '15%' }}>999</p>
              </div>

              <div className='tableRow1123'>
                <p className='tableColHeader2123' style={{ width: '5%' }}>1</p>
                <p className='tableColHeader2123' style={{ width: '25%' }}>Eardops</p>
                <p className='tableColHeader2123' style={{ width: '35%' }}>Boat fire AirDops</p>
                <p className='tableColHeader2123' style={{ width: '10%' }}>1</p>
                <p className='tableColHeader2123' style={{ width: '10%' }}>1499</p>
                <p className='tableColHeader2123' style={{ width: '15%' }}>999</p>
              </div>

            </div>



            {/* Subtotal and Totals */}

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 14 }}>Thanks for your buisness</p>
              <div className='subtotalHeadRow123' >
                <div className='subtotalRow123'>
                  <p style={{ fontSize: 12 }}>Sub Total</p>
                  <p style={{ fontSize: 12 }}>480</p>
                </div>
                <div className='subtotalRow123' >
                  <p style={{ fontSize: 12 }}>Tax (18%)</p>
                  <p style={{ fontSize: 12 }}>480</p>
                </div>
                <div className='subtotalRow1123' >
                  <p style={{ fontSize: 15, color: '#fff' }}>Grand Total</p>
                  <p style={{ fontSize: 15, color: '#fff' }}>480</p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className='footer123'>
              <div className='footerInner123'>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'flex-end', marginTop: 20 }}>
                  <p className='bold123' >Authorized Signature</p>
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
      {
        rightSidebarshow && <TemplateSidebar setRightSidebarshow={setRightSidebarshow} />
      }
    </div>
  );
};

export default Template3;
