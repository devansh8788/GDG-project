import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const MonthlyRevenueChart = () => {

      const [invoices, setInvoices] = useState([]);
      const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0)); // Array for monthly revenue
      const [totalInvoices, setTotalInvoices] = useState(0);
      const [totalRevenue, setTotalRevenue] = useState(0);
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
    
            // Process invoices to calculate monthly revenue
            const monthlyRevenueArray = Array(12).fill(0);
            let totalRevenueSum = 0;
    
            fetchedInvoices.forEach(invoice => {
              if (invoice.invoiceDate && invoice.total) {
                const invoiceDate = new Date(invoice.invoiceDate); // Assuming invoiceDate is a string
                const month = invoiceDate.getMonth(); // Get the month (0 = January, 11 = December)
                monthlyRevenueArray[month] += invoice.total; // Add the total field to the respective month
                totalRevenueSum += invoice.total; // Add to the total revenue
              }
            });
    
            setMonthlyRevenue(monthlyRevenueArray);
            setTotalRevenue(totalRevenueSum);
            setTotalInvoices(fetchedInvoices.length);
          } catch (error) {
            console.error("Error fetching invoices: ", error);
          }
        };
    
        fetchInvoices();
      }, []);
    
    

  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue,
        backgroundColor: '#5777ff',
        hoverBackgroundColor: '#0e514f',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const month = data.labels[clickedIndex];
        const revenue = data.datasets[0].data[clickedIndex];
        alert(`Month: ${month}\nRevenue: $${revenue}`);
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl mt-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">Monthly Revenue</h3>
        <p className="text-xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        <p className="text-gray-600 text-sm">Generated from {totalInvoices} invoices</p>
      </div>
      <div className="w-2/3 h-auto">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;
