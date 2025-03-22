import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function Contacts() {
  
  return (
    <div>
       <Outlet />
    </div>
  )
}

export default Contacts