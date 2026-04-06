import React from "react";
import FormUpdateProfile from "./components/FormUpdateProfile";

const UpdateProfile = () => {
  return (
    <div className="flex items-center justify-center mt-5">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-10 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="mb-4">
            <p className="font-medium text-xl mb-2">Perfil</p>
            <p className="text-gray-600 leading-loose">
              Utiliza el siguiente formulario para actualizar tu información
              profesional.
            </p>
          </div>

          <div className="lg:col-span-2">
            <FormUpdateProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
