import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet,pdf, PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './bill.css'
import Navbar from '../Navbar';
import { CiCircleQuestion } from "react-icons/ci";
import { useLocation } from 'react-router-dom';
import Loading from '../Loading';
import emailjs from "@emailjs/browser";
import axios from 'axios'
import { getStorage, ref, uploadBytes ,getDownloadURL  } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
const InvoiceSend = () => {
    const [user, setUser] = useState(null); // To store user data
    const [loading, setLoading] = useState(true); // Add loading state
  const location = useLocation();
  const { invoiceNumber } = location.state || {};
    const [invoice, setInvoice] = useState([]);
    const [selectedOrg,setSelectedOrg]=useState(null);
    const [items,setItems]=useState([]);
    const navigate=useNavigate();
    //.....................for Organization............

    useEffect(() => {
      const loadSelectedOrg = async () => {
        try {
          const savedOrg = await AsyncStorage.getItem('selectedOrganization');
          if (savedOrg) {
            console.log('====================================');
            console.log(savedOrg);
            console.log('====================================');
            setSelectedOrg(JSON.parse(savedOrg));
          }
        } catch (error) {
          console.error('Failed to load organization from AsyncStorage:', error);
        }
      };
  
      loadSelectedOrg();
    }, [setSelectedOrg]);

    //.............................for user Data..........................
    useEffect(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (userData) => {
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      });
    }, []);
  
//..........................Fetched Invoice........................
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
                  const filterdInvoice = fetchedInvoices.filter((oneInvoice)=>{
                    return invoiceNumber===oneInvoice.invoiceNumber
                  })
                  const fiterItems=filterdInvoice[0].items.filter((item)=>{
                    return item.itemDetails!==''
                  })
                  setItems(fiterItems);
                  setInvoice(filterdInvoice)

              } catch (error) {
                  console.error("Error fetching invoices: ", error);
              }
              setLoading(false); // End loading state after fetching
          };
  
          fetchInvoices();
      }, []);



      if (loading) {
        return <Loading />;
      }



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
                    <Text style={styles.invoiceDetails}>Invoice Date: {invoice[0].invoiceDate}</Text>
                    <Text style={styles.invoiceDetails}>Invoice No. INV-{invoice[0].invoiceNumber}</Text>
                  </View>
                  <Text style={styles.title}>Invoice</Text>
                </View>
      
                {/* Bill To */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <View>
                    <Text style={styles.billTo}>Bill To:</Text>
                    <Text style={{ color: 'blue', fontSize: 10, margin: 5 }}>Mr. {invoice[0].customer.displayName}</Text>
                    <Text style={{ fontSize: 10 }}>+91 8235570955</Text>
                  </View>
                  <View>
                    <Text style={styles.invoiceDetails}>Terms: {invoice[0].terms}</Text>
                    <Text style={styles.invoiceDetails}>Due Date: {invoice[0].dueDate}</Text>
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
                    items.map((item, idx) => {
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
                      <Text style={{ fontSize: 10 }}>{invoice[0].subTotal}</Text>
                    </View>
                    <View style={styles.subtotalRow}>
                      <Text style={{ fontSize: 10 }}>Discount ({invoice[0].discount}%)</Text>
                      <Text style={{ fontSize: 10 }}>{invoice[0].DiscPrice}</Text>
                    </View>
                    <View style={styles.subtotalRow}>
                      <Text style={{ fontSize: 10 }}>Tax ({invoice[0].taxRate}%)</Text>
                      <Text style={{ fontSize: 10 }}>{invoice[0].TaxPrice}</Text>
                    </View>
                    <View style={styles.subtotalRow}>
                      <Text style={{ fontSize: 10 }}>Grand Total</Text>
                      <Text style={{ fontSize: 10 }}>Rs. {invoice[0].total.toFixed(2)}</Text>
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
          )
        };

        const generatePDF = async () => {
          try {
            const blob = await pdf(<Invoice />).toBlob();
            return blob;
          } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
          }
        };
        
        const uploadPDF = async () => {
          try {
            const pdfBlob = await generatePDF();
            const storage = getStorage();
            const storageRef = ref(storage, `invoices/${user.uid}/${invoice[0].invoiceNumber}/invoice.pdf`);
            await uploadBytes(storageRef, pdfBlob);
            console.log("PDF uploaded successfully!");
          } catch (error) {
            console.error("Error uploading PDF:", error);
            throw error;
          }
        };
        

   //...........for email.......................
    const service_id="service_7646imi";
    const template_id="template_4vmv8fr";
    const public_key="jVVxF5iMeMLW0h9sv";

    const HandleSubmit=async(e)=>{
      e.preventDefault();
      setLoading(true);
      try{
        await uploadPDF(); // Ensure upload completes
        const storage = getStorage();
        const pdfRef = ref(storage, `invoices/${user.uid}/${invoice[0].invoiceNumber}/invoice.pdf`);
        const downloadURL = await getDownloadURL(pdfRef);
    
          const res=await axios.post(`http://localhost:5000/email`,{
              email:invoice[0].customer.email,
              downloadURL:downloadURL
          })
          setLoading(false);
          navigate('/dashboard/invoice')
          console.log('====================================');
          console.log(res.data.messageId);
          console.log('====================================');
      }catch(error){
          console.log('====================================');
          console.log(error);
          console.log('====================================');
          setLoading(false);
      }
  }
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   setLoading(true);
    //   try {
    //     await uploadPDF(); // Ensure upload completes
    //     const storage = getStorage();
    //     const pdfRef = ref(storage, `invoices/${user.uid}/${invoice[0].invoiceNumber}/invoice.pdf`);
    //     const downloadURL = await getDownloadURL(pdfRef);
    
    //     const templateparams = {
    //       from_name: user.email,
    //       from_email: invoice[0].customer.email,
    //       to_name: invoice[0].customer.displayName,
    //       message: `You can download your invoice from here: ${downloadURL}`
    //     };
    
    //     emailjs
    //       .send(service_id, template_id, templateparams, public_key)
    //       .then(
    //         (response) => {
    //           console.log("Response:", response);
    //                 toast.success('Invoice sent Successfully!', {
    //                   position: "top-right",
    //                   autoClose: 3000,
    //                   hideProgressBar: false,
    //                   closeOnClick: true,
    //                   pauseOnHover: true,
    //                   draggable: true,
    //                   progress: undefined,
    //                   theme: "colored",
    //                 });
    //                 setLoading(false);
    //                 navigate('/dashboard/invoice')
    //           // alert("Invoice sent successfully!");
    //         },
    //         (error) => {
    //           console.error("Error:", error);
    //           alert("Something went wrong. Please try again.");
    //           setLoading(false);
    //         }
    //       );
    //   } catch (error) {
    //     console.error("Error in handleSubmit:", error);
    //     alert("Something went wrong. Please try again.");
    //     setLoading(false);
    //   }
    // };


  return (
    <div className='ml-52'>
      <Navbar />

      <div>
            <ToastContainer /> 
        <h1 className='text-xl p-4 border'>Email To {invoice[0].customer.displayName}</h1>
        <div className='p-2 m-3 border mr-52'>
          <div className='p-2 border-b my-2 flex gap-12'>
            <p className='text-sm font-light inline' >From <CiCircleQuestion className='font-medium inline' /></p>
            <p className='text-sm font-light' >{user.email}</p>
          </div>
          <div className='p-2 border-b my-2 flex gap-12'>
            <p className='text-sm font-light' >Send To</p>
            <p className='text-sm font-light' >{invoice[0].customer.email}</p>
          </div>
          <div className='p-2 border-b my-2 flex gap-12'>
            <p className='text-sm font-light' >Subject </p>
            <p className='text-sm font-light' >Invoice - INV - {invoice[0].invoiceNumber} from {selectedOrg.organizationName}</p>
          </div>
          <div className='bg-[#f8fafc]'>
            <div className='p-8 bg-blue-500 text-white font-bold m-2 my-8 text-center'>INVOICE NO: INV-{invoice[0].invoiceNumber}</div>

            <div className='w-1/2 m-auto my-8'>
              <p className='my-4 font-light'>Dear {invoice[0].customer.salutation} {invoice[0].customer.displayName}</p>
              <p className='font-light'>Thank you for your business. Your invoice can be viewed, printed and downloaded as PDF from the link below. You can also choose to pay it online.</p>
            </div>
            <div className='page bg-white' style={{ margin: 'auto' }}>
              <div className='titlediv'>
                <div>
                  <p className='invoiceDetails'>Invoice No: INV-{invoice[0].invoiceNumber} </p>
                  <p className='invoiceDetails'>Invoice Date: {invoice[0].invoiceDate}</p>
                </div>
                <p className='title'>Invoice</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p className='billTo'>Bill To:</p>
                  <p style={{ color: 'blue', fontSize: 14, margin: 5 }}>{invoice[0].customer.salutation} {invoice[0].customer.displayName}</p>
                  <p style={{ fontSize: 14 }}>+91 8235570955</p>
                </div>
                <div>
                  <p className='invoiceDetails'>Terms: {invoice[0].terms}</p>
                  <p className='invoiceDetails'>Due Date: {invoice[0].dueDate}</p>
                </div>
              </div>


              <div className='table'>
                <div className='tableRow'>
                  <p className='tableColHeader' style={{ width: '5%' }}>#</p>
                  <p className='tableColHeader' style={{ width: '25%' }}>Item</p>
                  <p className='tableColHeader' style={{ width: '35%' }}>Description</p>
                  <p className='tableColHeader' style={{ width: '10%' }}>Qty</p>
                  <p className='tableColHeader' style={{ width: '10%' }}>Rate (₹)</p>
                  <p className='tableColHeader' style={{ width: '15%' }}>Amount (₹)</p>
                </div>
                {
                              items.map((item, idx) => {
                                return (
                                     <div className='tableRow1'>
                                      <p className='tableColHeader1' style={{ width: '5%' }}>{idx + 1}</p>
                                      <p className='tableColHeader1' style={{ width: '25%' }}>{item.itemDetails}</p>
                                      <p className='tableColHeader1' style={{ width: '35%' }}>{item.itemDetails}</p>
                                      <p className='tableColHeader1' style={{ width: '10%' }}>{item.quantity}</p>
                                      <p className='tableColHeader1' style={{ width: '10%' }}>{item.rate}</p>
                                      <p className='tableColHeader1' style={{ width: '15%' }}>{item.amount}</p>
                                    </div> 
                
                                )
                              })
                            }



              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 200 }}>
                <p style={{ fontSize: 14 }}>Thanks for your buisness</p>
                <div className='subtotalHeadRow' >
                  <div className='subtotalRow' >
                    <p style={{ fontSize: 12, width: '60%' }}>Sub Total</p>
                    <p style={{ fontSize: 12 }}>{invoice[0].subTotal}</p>
                  </div>
                  <div className='subtotalRow'>
                    <p style={{ fontSize: 12, width: '60%' }}>Discount ({invoice[0].discount}%)</p>
                    <p style={{ fontSize: 12 }}>{invoice[0].DiscPrice}</p>
                  </div>
                  <div className='subtotalRow'>
                    <p style={{ fontSize: 12, width: '60%' }}>Tax ({invoice[0].taxRate}%)</p>
                    <p style={{ fontSize: 12, }}>{invoice[0].TaxPrice}</p>
                  </div>
                  <div className='subtotalRow' >
                    <p style={{ fontSize: 16, fontWeight: 'bold', margin: 0, padding: 5, width: '60%' }}>Grand Total</p>
                    <p style={{ fontSize: 16, fontWeight: 'bold', margin: 0, padding: 5 }}>{invoice[0].total.toFixed(2)}</p>
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
       
            </div>
          </div>

          <div className='m-4'>
            <button className='bg-blue-400 p-2 px-4 rounded m-2 text-white font-bold' onClick={HandleSubmit}>send</button>
            <button className='bg-gray-300 p-2 px-4 rounded m-2 font-bold'>cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceSend
