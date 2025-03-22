import React from 'react'

function Spinner() {
  return (
    <div className='flex justify-center items-center h-[calc(100vh-48px)]'>
                    <div className="animate-spin rounded-full h-18 w-18 border-t-8 border-l-8 border-orange-600"></div>
                </div>
  )
}

export default Spinner