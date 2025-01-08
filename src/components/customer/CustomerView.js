import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../Navbar'
import { IoIosContact } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { FaMobileScreen } from "react-icons/fa6";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import chevron from "./chewrown.svg";
import Loading from '../Loading';
import { MdOutlineMail } from "react-icons/md";
import MonthlyChart from "./MonthlyChart"
const CustomerView = () => {
  const { id } = useParams();
  const [customerData, setcustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerInvoices, setCustomerInvoices] = useState([]);
    const [rightSidebarshow,setRightSidebarshow]=useState(false);

    const navigate=useNavigate();
  useEffect(() => {
    const fetchcustomerData = async () => {
      try {
        const orgData = await AsyncStorage.getItem('selectedOrganization');
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;
  
        if (!parsedOrgData || !parsedOrgData.id) {
          alert('No valid organization selected!');
          setLoading(false);
          return;
        }
  
        const docRef = doc(db, `organizations/${parsedOrgData.id}/customers`, id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const customerData = docSnap.data();
          console.log('====================================');
          console.log(customerData);
          console.log('====================================');
          setcustomerData(customerData);
  
          const q = query(
            collection(db, `organizations/${parsedOrgData.id}/customers`)
          );
          const querySnapshot = await getDocs(q);
  
          const fetchedInvoices = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCustomers(fetchedInvoices);
  
          const filteredInvoices = fetchedInvoices.filter(invoice =>
            invoice.customer.id === customerData.customer.id
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
  
    fetchcustomerData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='ml-52'>
      <Navbar />
      <div className='flex'>
        <div className=' border w-80 h-screen'>
        <div className='border p-2 m-2 my-4'  >
                <div className='flex justify-between'>
                  <p className='text-blue-500'>Mr. Yash raj</p>
                  <p>₹ 3245</p>
                </div>
                <div className='flex gap-6 font-light text-sm py-2'>
                  <p>INV-234445</p>
                </div>
              </div>
        </div>
        <div className='p-2'>
          <div className='p-2 flex justify-between'>
            <p className='text-xl'>{customerData.salutation} {customerData.displayName}</p>
          </div>
          <div className='px-4 my-3 flex gap-8 border-b'>
            <p className='text-sm p-1 border-b-2 border-blue-600'>OverView</p>
            <p className='text-sm p-1'>Comments</p>
            <p className='text-sm p-1'>Transactions</p>
            <p className='text-sm p-1'>Mails</p>
            <p className='text-sm p-1'>Statements</p>
          </div>
          <div className='flex'>
          <div className="p-4 bg-gray-100 rounded-lg w-96 h-screen">
            <p className='border-b py-3'>Company Name</p>
            <div className='my-3'>
              <div className='flex gap-4'>
                <IoIosContact className='text-[40px]' />
                <div>
                  <p className='text-sm font-semibold mb-2'>{customerData.salutation} {customerData.displayName}</p>
                  <p className='text-sm flex items-center gap-2'><MdOutlineMail /> {customerData.email}</p>
                  <p className='flex items-center gap-2 text-sm'><IoCallOutline /> <span>{customerData.mobile}</span> </p>
                  <p className='flex items-center gap-2 text-sm'><FaMobileScreen /> <span>{customerData.workPhone}</span> </p>
                </div>
              </div>
              <div className="mx-2 my-4 border-t">
                {/* `transitionTimeout` prop should be equal to the transition duration in CSS */}
                <Accordion transition transitionTimeout={200}>
                  <AccordionItem header="ADDRESS" initialEntered>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </AccordionItem>

                  <AccordionItem header="OTHER DETAILS">
                    Quisque eget luctus mi, vehicula mollis lorem. Proin fringilla vel
                    erat quis sodales. Nam ex enim, eleifend venenatis lectus vitae.
                  </AccordionItem>

                  <AccordionItem header="CONTACT PERSONS">
                    Suspendisse massa risus, pretium id interdum in, dictum sit amet ante.
                    Fusce vulputate purus sed tempus feugiat.
                  </AccordionItem>

                  <AccordionItem header="RECORD INFO">
                    Suspendisse massa risus, pretium id interdum in, dictum sit amet ante.
                    Fusce vulputate purus sed tempus feugiat.
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            {/* Profile Section */}

          </div>
          <div className='p-4'>
            <div >
              <p className='text-sm text-gray-400'>Payment due period</p>
              <p className='text-sm' >Due on Receipt</p>
            </div>
            <div>
              <h2 className='text-[18px] font-semibold my-4'>Receivables</h2>
              <div className='flex justify-around w-[550px] border border-r-0 border-l-0 bg-gray-100 p-1'>
                <p className='text-[12px]'>CURRENCY</p>
                <p className='text-[12px]'>OUTSTANDING RECEIVABLES</p>
                <p className='text-[12px]'>USED CREDITS</p>
              </div>
              <div className='flex justify-around w-[550px] border-b p-1'>
                <p className='text-[12px] text-left'>INR-indian Rupees</p>
                <p className='text-[12px]'>₹96000</p>
                <p className='text-[12px]'>₹0.00</p>
              </div>
              <MonthlyChart/>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerView

const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <img
          className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"
            }`}
          src={chevron}
          alt="Chevron"
        />
      </>
    )}
    className="border-b"
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full p-4 text-left hover:bg-slate-100 ${isEnter && "bg-slate-200"
        }`
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out"
    }}
    panelProps={{ className: "p-4" }}
  />
);



