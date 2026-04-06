import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";

const AddressCard = ({
  id,
  order,
  address,
  location,
  otherinfo,
  name,
  eliminarDireccion,
  setModalAddressForm,
  addressState,
  setAddressEdit
}) => {
  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{order + 1}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {name} - {address}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {location} - {otherinfo}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900">
          <button
            onClick={() => {
              setAddressEdit(addressState)
              setModalAddressForm(true)
            }}
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-primary focus:text-primary"
          >
            <AiFillEdit className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => {
              eliminarDireccion(id);
             
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-red-600 focus:z-10  focus:ring-red-600 focus:text-red-600"
          >
            <MdDeleteForever className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default AddressCard;
