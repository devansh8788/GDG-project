import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
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
import { toast } from 'react-toastify';

const CustomerView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [customerInvoices, setCustomerInvoices] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCustomerData = async () => {
            setLoading(true);
            setError(null);
            try {
                const orgData = await AsyncStorage.getItem('selectedOrganization');
                const parsedOrgData = orgData ? JSON.parse(orgData) : null;

                if (!parsedOrgData || !parsedOrgData.id) {
                    setError('No valid organization selected!');
                    return;
                }

                // Fetch customer data
                const docRef = doc(db, `organizations/${parsedOrgData.id}/customers`, id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    setError('Customer not found!');
                    return;
                }

                const customerData = docSnap.data();
                setCustomerData(customerData);

                // Fetch all customers for the sidebar
                const customersQuery = query(collection(db, `organizations/${parsedOrgData.id}/customers`));
                const customersSnapshot = await getDocs(customersQuery);
                const fetchedCustomers = customersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCustomers(fetchedCustomers);

                // Fetch customer invoices
                const invoicesQuery = query(
                    collection(db, `organizations/${parsedOrgData.id}/invoices`),
                    where("customer.id", "==", id)
                );
                const invoicesSnapshot = await getDocs(invoicesQuery);
                const fetchedInvoices = invoicesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCustomerInvoices(fetchedInvoices);

            } catch (error) {
                setError('Error fetching customer data: ' + error.message);
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 ml-52 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!customerData) {
        return (
            <div className="min-h-screen bg-gray-50 ml-52 p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    No customer data available.
                </div>
            </div>
        );
    }

    const calculateTotalReceivables = () => {
        return customerInvoices.reduce((total, invoice) => {
            return total + (invoice.total || 0);
        }, 0);
    };

    return (
        <div className='ml-52'>
            <Navbar />
            <div className='flex'>
                <div className='border w-80 h-screen overflow-y-auto'>
                    {customers.map((customer) => (
                        <div 
                            key={customer.id} 
                            className='border p-2 m-2 my-4 cursor-pointer hover:bg-gray-50'
                            onClick={() => navigate(`/dashboard/customerview/${customer.id}`)}
                        >
                            <div className='flex justify-between'>
                                <p className='text-blue-500'>{customer.salutation} {customer.displayName}</p>
                                <p>{customer.workPhone}</p>
                            </div>
                            <div className='flex gap-6 font-light text-sm py-2'>
                                <p>{customer.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='p-2 flex-1'>
                    <div className='p-2 flex justify-between'>
                        <p className='text-xl'>{customerData.salutation} {customerData.displayName}</p>
                    </div>
                    <div className='px-4 my-3 flex gap-8 border-b'>
                        {['overview', 'comments', 'transactions', 'mails', 'statements'].map((tab) => (
                            <p 
                                key={tab}
                                className={`text-sm p-1 cursor-pointer ${activeTab === tab ? 'border-b-2 border-blue-600' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </p>
                        ))}
                    </div>
                    <div className='flex'>
                        <div className="p-4 bg-gray-100 rounded-lg w-96">
                            <p className='border-b py-3'>Company Details</p>
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
                                    <Accordion transition transitionTimeout={200}>
                                        <AccordionItem header="ADDRESS" initialEntered>
                                            <div className="text-sm">
                                                {customerData.billingStreet1 ? (
                                                    <>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className="font-semibold">Billing Address:</p>
                                                            <button 
                                                                onClick={() => navigate(`/dashboard/customer/edit/${id}`)}
                                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                                            >
                                                                Edit Address
                                                            </button>
                                                        </div>
                                                        <p>{customerData.billingStreet1}</p>
                                                        <p>{customerData.billingStreet2}</p>
                                                        <p>{customerData.billingCity}, {customerData.billingState}</p>
                                                        <p>{customerData.billingPinCode}</p>
                                                        <p>{customerData.billingCountry}</p>
                                                    </>
                                                ) : (
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-gray-500">No address added yet</p>
                                                        <button 
                                                            onClick={() => navigate(`/dashboard/customer/edit/${id}`)}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                                        >
                                                            Add Address
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionItem>

                                        <AccordionItem header="OTHER DETAILS">
                                            <div className="text-sm">
                                                <p><span className="font-semibold">PAN:</span> {customerData.pan || 'Not provided'}</p>
                                                <p><span className="font-semibold">Payment Terms:</span> {customerData.paymentTerms || 'Not specified'}</p>
                                            </div>
                                        </AccordionItem>

                                        <AccordionItem header="CONTACT PERSONS">
                                            <div className="text-sm">
                                                <p><span className="font-semibold">Primary Contact:</span> {customerData.displayName}</p>
                                                <p><span className="font-semibold">Email:</span> {customerData.email}</p>
                                                <p><span className="font-semibold">Phone:</span> {customerData.workPhone}</p>
                                            </div>
                                        </AccordionItem>

                                        <AccordionItem header="RECORD INFO">
                                            <div className="text-sm">
                                                <p><span className="font-semibold">Created:</span> {customerData.createdAt?.toDate().toLocaleDateString() || 'Not available'}</p>
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                        <div className='p-4 flex-1'>
                            <div>
                                <p className='text-sm text-gray-400'>Payment due period</p>
                                <p className='text-sm'>{customerData.paymentTerms || 'Not specified'}</p>
                            </div>
                            <div>
                                <h2 className='text-[18px] font-semibold my-4'>Receivables</h2>
                                <div className='flex justify-around w-[550px] border border-r-0 border-l-0 bg-gray-100 p-1'>
                                    <p className='text-[12px]'>CURRENCY</p>
                                    <p className='text-[12px]'>OUTSTANDING RECEIVABLES</p>
                                    <p className='text-[12px]'>USED CREDITS</p>
                                </div>
                                <div className='flex justify-around w-[550px] border-b p-1'>
                                    <p className='text-[12px] text-left'>INR - Indian Rupees</p>
                                    <p className='text-[12px]'>₹{calculateTotalReceivables().toFixed(2)}</p>
                                    <p className='text-[12px]'>₹{customerData.unusedCredits || '0.00'}</p>
                                </div>
                                <MonthlyChart invoices={customerInvoices} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerView;

const AccordionItem = ({ header, ...rest }) => (
    <Item
        {...rest}
        header={({ state: { isEnter } }) => (
            <>
                {header}
                <img
                    className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"}`}
                    src={chevron}
                    alt="Chevron"
                />
            </>
        )}
        className="border-b"
        buttonProps={{
            className: ({ isEnter }) =>
                `flex w-full p-4 text-left hover:bg-slate-100 ${isEnter && "bg-slate-200"}`
        }}
        contentProps={{
            className: "transition-height duration-200 ease-out"
        }}
        panelProps={{ className: "p-4" }}
    />
);



