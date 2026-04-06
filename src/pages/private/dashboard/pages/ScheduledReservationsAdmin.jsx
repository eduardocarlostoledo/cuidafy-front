import React from 'react'
import HistoryTableAdmin from '../components/HistoryTableAdmin'

const ScheduledReservationsAdmin = () => {
  return (
    <div className="flex flex-col gap-4">
         <div className="flex flex-col gap-4">
      <div className="bg-white  shadow rounded xl:flex lg:flex w-full">
        <div className="xl:w-2/5 lg:w-2/5 bg-white py-8 border-gray-300  xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full mb-3">
              <img
                className="h-full w-full object-cover rounded-full shadow"
                src="https://dh-ui.s3.amazonaws.com/assets/photo-1570211776045-af3a51026f4a.jfif"
                alt
              />
            </div>
            <p className="mb-2 text-lg font-bold text-gray-900">
              Shane Doe
            </p>
            <p className="mb-6 text-sm text-gray-700 ">
              shane@awesomeness.com
            </p>
            <button className="bg-whatsapp font-medium transition duration-150 ease-in-out  rounded text-gray-800 px-6 py-2 text-sm border border-gray-300  focus:outline-none">
              Enviar mensaje
            </button>
            <button className="bg-white font-medium transition duration-150 ease-in-out mt-2 hover:bg-gray-200 rounded text-gray-800 px-6 py-2 text-sm border border-gray-300  focus:outline-none">
                Volver a perfil
            </button>
          </div>
        </div>
        <div className="xl:w-3/5 lg:w-3/5 px-6 py-8">
          <div className="flex flex-wrap justify-between">
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Birthday
                </p>
                <p className="text-sm text-gray-700 ">
                  29 Jan, 1982
                </p>
              </div>
            </div>
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Gender
                </p>
                <p className="text-sm text-gray-700 ">Male</p>
              </div>
            </div>
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Location
                </p>
                <p className="text-sm text-gray-700 ">
                  California, USA
                </p>
              </div>
            </div>
            <div className="w-2/5 mb-8">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Phone Number
                </p>
                <p className="text-sm text-gray-700 ">
                  202-555-0191
                </p>
              </div>
            </div>
            <div className="w-2/5">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Last Login
                </p>
                <p className="text-sm text-gray-700 ">
                  Today
                </p>
              </div>
            </div>
            <div className="w-2/5">
              <div className="border-b pb-3">
                <p className="mb-2 text-sm text-gray-700  font-medium">
                  Status
                </p>
                <p className="text-sm text-gray-700 ">
                  Approved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
        <HistoryTableAdmin />
    </div>
  )
}

export default ScheduledReservationsAdmin