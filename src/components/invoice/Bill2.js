import React, { useState ,useEffect} from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  titleView:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-end',
    paddingBottom:20,
    borderBottomWidth:1
  },
  title: {
    fontSize:60,
    fontWeight:'black',
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
    backgroundColor:'#f5f6f7'
  },
  tableColHeader: {
    fontSize:10,
    borderRightWidth:0.5,
    padding: 5,
    textAlign:'center',
    fontWeight:'bold'
  },
  tableRow1: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    borderTopWidth:0
  },
  tableColHeader1: {
    fontSize:10,
    borderRightWidth:0.5,
    padding: 5,
    textAlign:'center'
  },
  tableCol: {
    width: '33%',
  },
  footer: {
    position:'absolute',
    bottom:20,
    width:'100%'
  },
  subtotalHeadRow:{

  },
  subtotalRow:{
    width:200,
    flexDirection:'row',
    borderBottomWidth:0.4,
    paddingBottom:5,
    justifyContent:'space-around',
    marginTop:7
  },
  footerInner:{
    width:'88%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    padding:10,
    paddingBottom:0
  },
  bold: {
    fontWeight: 'bold',
  },
});

// Invoice PDF Component
const Invoice = () =>
{
  const [name,setName]=useState("Lalan Chaudhary")
  const { id } = useParams();
  console.log('====================================');
  console.log(id);
  console.log('====================================');
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(true);
  
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
            console.log('====================================');
            console.log(docSnap.data());
            console.log('====================================');
            setBillData(docSnap.data());
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
  
  //   if (loading) return <div className="text-center mt-8">Loading...</div>;
  //   if (!billData) return <div className="text-center mt-8">No data available.</div>;
  
    // const { invoiceNumber, customer, items, total,discount,taxRate, createdAt } = billData;
  return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Invoice Title */}
      <View style={styles.titleView}>
        <View>
      <Text style={styles.invoiceDetails}>16 June 2025</Text>
      <Text style={styles.invoiceDetails}>Invoice No. 12345</Text>
      </View>
      <Text style={styles.title}>Invoice</Text>
      </View>

      {/* Bill To */}
      <Text style={styles.billTo}>Bill To:</Text>
      <Text style={{color:'blue',fontSize:10,margin:5}}>Mr. {name}</Text>
      <Text style={{fontSize:10}}>+91 8235570955</Text>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
        <Text style={[styles.tableColHeader,{width:'5%'}]}>#</Text>
        <Text style={[styles.tableColHeader,{width:'25%'}]}>Item</Text>
          <Text style={[styles.tableColHeader,{width:'35%'}]}>Description</Text>
          <Text style={[styles.tableColHeader,{width:'10%'}]}>Qty</Text>
          <Text style={[styles.tableColHeader,{width:'10%'}]}>rate</Text>
          <Text style={[styles.tableColHeader,{width:'15%'}]}>Amount</Text>
        </View>

        <View style={styles.tableRow1}>
        <Text style={[styles.tableColHeader1,{width:'5%'}]}>1</Text>
        <Text style={[styles.tableColHeader1,{width:'25%'}]}>Eardops</Text>
          <Text style={[styles.tableColHeader1,{width:'35%'}]}>Boat fire AirDops</Text>
          <Text style={[styles.tableColHeader1,{width:'10%'}]}>1</Text>
          <Text style={[styles.tableColHeader1,{width:'10%'}]}>1499</Text>
          <Text style={[styles.tableColHeader1,{width:'15%'}]}>999</Text>
        </View>

        <View style={styles.tableRow1}>
        <Text style={[styles.tableColHeader1,{width:'5%'}]}>1</Text>
        <Text style={[styles.tableColHeader1,{width:'25%'}]}>Eardops</Text>
          <Text style={[styles.tableColHeader1,{width:'35%'}]}>Boat fire AirDops</Text>
          <Text style={[styles.tableColHeader1,{width:'10%'}]}>1</Text>
          <Text style={[styles.tableColHeader1,{width:'10%'}]}>1499</Text>
          <Text style={[styles.tableColHeader1,{width:'15%'}]}>999</Text>
        </View>

      </View>



      {/* Subtotal and Totals */}

          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{fontSize:10}}>Thanks for your buisness</Text>
          <View style={styles.subtotalHeadRow}>
          <View style={styles.subtotalRow}>
            <Text style={{fontSize:10}}>Sub Total</Text>
            <Text style={{fontSize:10}}>480</Text>
          </View>
          <View style={styles.subtotalRow}>
            <Text style={{fontSize:10}}>Tax (18%)</Text>
            <Text style={{fontSize:10}}>480</Text>
          </View>
          <View style={styles.subtotalRow}>
            <Text style={{fontSize:10}}>Grand Total</Text>
            <Text style={{fontSize:10}}>480</Text>
          </View>
          </View>
          </View>
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
        <View style={{flexDirection:'row',gap:10,alignItems:'flex-end',marginTop:20}}>
          <Text style={styles.bold}>Authorized Signature</Text>
          <View style={{height:1,width:120,backgroundColor:'#000'}}></View>
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

const NewInvoice = () => (
  <div>
    <h1>Download Invoice</h1>
    <PDFDownloadLink document={<Invoice />} fileName="invoice.pdf">
      {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink>
  </div>
);

export default NewInvoice;
