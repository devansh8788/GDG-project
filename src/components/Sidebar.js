// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaFileInvoice, FaBox, FaUserAlt,FaFileAlt } from 'react-icons/fa';
import { AiOutlineBarChart } from 'react-icons/ai';
import logo from '../assets/logo.png';
import { FaClipboardList } from "react-icons/fa";
const Sidebar = () => {
  const [active, setActive] = useState('home');
  const navigate = useNavigate();

  return (
    <div className="h-screen w-52 bg-[#1C2233] shadow-md p-4 fixed top-0 left-0 overflow-hidden z-10">
      {/* Sidebar Profile Section */}
      <div className="mb-6 flex items-center ">
        <img
          src={logo}
          alt="Profile"
          className="rounded-full h-30 w-30 mb-1"
        />
        <h2 className="font-bold text-white ">INVOICED</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
  <SidebarLink to="/dashboard/home" title="Home" icon={<FaHome />} active={active} setActive={setActive} />
  <SidebarLink to="/dashboard/invoice" title="Invoice" icon={<FaFileInvoice />} active={active} setActive={setActive} />
  <SidebarLink to="/dashboard/product" title="Product" icon={<FaBox />} active={active} setActive={setActive} />
  <SidebarLink to="/dashboard/customer" title="Client" icon={<FaUserAlt />} active={active} setActive={setActive} />
  
  <SidebarLink to="/dashboard/expenses" title="Expenses" icon={<FaClipboardList />} active={active} setActive={setActive} className="mt-4" />
  <SidebarLink to="/dashboard/analytics" title="Analytics" icon={<AiOutlineBarChart />} active={active} setActive={setActive} />
  <SidebarLink to="/dashboard/reports" title="Reports" icon={<FaFileAlt />} active={active} setActive={setActive} />
</nav>

    </div>
  );
};

const SidebarLink = ({ to, title, icon, active, setActive }) => (
  <Link
    to={to}
    onClick={() => setActive(title.toLowerCase())}
    className={`flex items-center p-2 space-x-2 rounded-md transition-colors duration-200 
      ${active === title.toLowerCase() ? 'bg-white shadow-lg' : ''} 
      hover:bg-[#2C344C] hover:text-[#0EA5E9]`}
  >
    <span className={`transition-colors duration-200 ${active === title.toLowerCase() ? 'text-[#0EA5E9]' : 'text-white'}`}>
      {icon}
    </span>
    <span className={`font-medium text-sm transition-colors duration-200 ${active === title.toLowerCase() ? 'text-black' : 'text-white'}`}>
      {title}
    </span>
  </Link>
);

export default Sidebar;