import React, { useState } from 'react';
import SideBar from './components/SideBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
   
    return (
        <div className="flex w-full">
           <SideBar/>
           <div className='w-screen '>
            <Outlet />
           
           </div>
        </div>
    );
};

export default Layout;