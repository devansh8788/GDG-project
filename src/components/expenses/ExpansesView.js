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
import Loading from '../Loading';
import { MdOutlineMail } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { IoMdPrint } from "react-icons/io";
const ExpensesView = () => {
    const { id } = useParams();
    const [customerData, setcustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerInvoices, setCustomerInvoices] = useState([]);
    const [rightSidebarshow, setRightSidebarshow] = useState(false);

    const navigate = useNavigate();
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

                const docRef = doc(db, `organizations/${parsedOrgData.id}/expenses`, id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const customerData = docSnap.data();
                    console.log('====================================');
                    console.log(customerData);
                    console.log('====================================');
                    setcustomerData(customerData);

                    const q = query(
                        collection(db, `organizations/${parsedOrgData.id}/expenses`)
                    );
                    const querySnapshot = await getDocs(q);

                    const fetchedInvoices = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setCustomers(fetchedInvoices);
                    console.log('====================================');
                    console.log(fetchedInvoices);
                    console.log('====================================');
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
                    {
                        customers.map((expenses)=>{
                            return (
                                <div className='border p-2 m-2 my-4'  >
                                <div className='flex justify-between'>
                                    <p className='text-blue-500'>Mr. {expenses.selectedCustomer}</p>
                                    <p>₹ {expenses.amount}</p>
                                </div>
                                <div className='flex gap-6 font-light text-sm py-2'>
                                    <p>{expenses.expensesDate}</p>
                                </div>
                            </div>
                            )
                        })
                    }

                </div>
                <div className='p-2 w-full'>
                    <p className='p-3 text-xl'>Expense Details</p>
                    <div className='flex w-full border'>
                        <p className='inline border-r border-l p-2 cursor-pointer' onClick={() => navigate("/dashboard/updateform", { state: { customerData: customerData } })}> <span ><GrEdit className='inline' /></span> Edit</p>
                        <p className='inline border-r p-2'> <IoMdPrint className='inline' /> Print</p>
                    </div>
                    <div className='p-2 py-4'>
                        <p className='text-sm'>Expense amount</p>
                        <p className='text-red-600 text-lg'>₹{customerData.amount}.00 <span className='text-gray-600 text-[12px]'>on {customerData.expensesDate}</span></p>
                        <p className='bg-[#c5e3ec] inline p-1'>Material</p>
                        <p className='mt-4'>Ref#</p>
                        <p>{customerData.expensesNumber}</p>
                        <p className='mt-4'>Customer</p>
                        <p className='text-sm text-blue-600'>{customerData.selectedCustomer}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpensesView

