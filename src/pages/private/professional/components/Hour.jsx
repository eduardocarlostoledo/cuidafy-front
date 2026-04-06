import React, { useState } from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'

const Hour = ({ id, hour, handleChange }) => {

    const [selectHour, setSelectHour] = useState(false)

    return (

        <label htmlFor={`${id}`} onClick={() => setSelectHour(!selectHour)} className={`schedule-badge text-center text-xs font-medium flex items-center px-2.5 py-3 rounded cursor-pointer ${selectHour ? "bg-blue-100 text-blue-800 border-blue-500" : "bg-gray-100 text-gray-800 border-gray-500"} `}>
            <AiOutlineClockCircle className="w-3 h-3 mr-1" />
            <p className='text-center'>
                {hour}
            </p>
        </label >

    )
}

export default Hour
