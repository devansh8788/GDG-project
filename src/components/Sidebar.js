import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaFileInvoice, FaBox, FaUserAlt, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import { AiOutlineBarChart } from 'react-icons/ai';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const [active, setActive] = useState('home');
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`h-screen bg-[#1C2233] shadow-md p-4 fixed top-0 left-0 overflow-hidden z-10 transition-all duration-300 ${
        isExpanded ? 'w-52' : 'w-16'
      }`}
    >
      {/* Sidebar Profile Section */}
      <div className="mb-6 flex items-center justify-center cursor-pointer" onClick={toggleSidebar}>
        <img
          src={logo}
          alt="Logo"
          className={`rounded-full mb-1 transition-all duration-300 ${
            isExpanded ? 'h-10 w-10' : 'h-12 w-12'
          }`}
        />
        {isExpanded && <h2 className="font-bold text-white ml-2">INVOICED</h2>}
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

interface SidebarLinkProps {
  to: string;
  title: string;
  icon: React.ReactNode;
  active: string;
  setActive: (title: string) => void;
  isExpanded: boolean;
  className?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, title, icon, active, setActive, isExpanded, className = '' }) => (
  <Link
    to={to}
    onClick={() => setActive(title.toLowerCase())}
    className={`flex items-center p-2 space-x-2 rounded-md transition-colors duration-200 
      ${active === title.toLowerCase() ? 'bg-white shadow-lg' : ''} 
      hover:bg-[#2C344C] hover:text-[#0EA5E9] ${className}`}
  >
    <span className={`transition-colors duration-200 ${active === title.toLowerCase() ? 'text-[#0EA5E9]' : 'text-white'}`}>
      {icon}
    </span>
    {isExpanded && (
      <span className={`font-medium text-sm transition-colors duration-200 ${active === title.toLowerCase() ? 'text-black' : 'text-white'}`}>
        {title}
      </span>
    )}
  </Link>
);

export default Sidebar;

