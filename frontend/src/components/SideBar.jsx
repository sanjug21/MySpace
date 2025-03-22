import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle, FaStickyNote,  FaCalendarAlt, FaAddressBook } from 'react-icons/fa';

function SideBar() {
  const navItems = [
    { to: '/notes', icon: <FaStickyNote />, label: 'Notes' },
    { to: '/events', icon: <FaCalendarAlt />, label: 'Events' },
    { to: '/contacts', icon: <FaAddressBook />, label: 'Contacts' },
  ];

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white p-2 rounded-xl flex items-center'
      : 'p-2 rounded-xl hover:bg-gray-300 flex items-center';

 
  return (
    <div className="h-screen w-54 bg-slate-200 p-4">
      <NavLink to={'/'} >
      <div className="flex items-center mb-4 bg-gradient-to-r from-fuchsia-500 to-orange-500 rounded-xl p-2">
        <FaUserCircle className="text-2xl mr-2" />
        <span className="text-lg font-bold">My Space</span>
      </div>
      </NavLink>
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={navLinkClass}
            aria-label={item.label}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default SideBar;