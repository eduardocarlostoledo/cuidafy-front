import React from "react";
import { AiFillHeart } from "react-icons/ai";

const Fidelidad = () => {
  return (
    <div className="flex items-center justify-center mt-5">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-10 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="mb-4">
            <p className="font-medium text-xl mb-2">Fidelidad</p>
            <p className="text-gray-600 leading-loose">
            Es vital para las profesionales y para Calyaan
            fomentar la recompra, es por esto que se premiará a
            las profesionales que mayor número de recompras
            generen.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-medium leading-none mb-2">
                Sistema de fidelidad para profesionales
              </h5>
            </div>
            <div className="container mx-auto">
              <div className="px-6 xl:px-0">
                <div className="grid  pb-6 gap-8">
                  <div role="cell" className="bg-gray-50">
                    <div className="bg-gray-50 p-5 rounded-md relative h-full w-full">
                      <h1 className="pb-4 text-2xl font-semibold">
                        Fidelidad Calyaan
                      </h1>
                      <div className="my-5">
                    

                        <p lass="text-md text-gray-900  mb-3 leading-loose">
                          Se le obsequiará un bono por $ 60.000 mil pesos a cada
                          profesional que logre 45 servicios.
                         
                        </p>

                        <div className="flex items-center justify-between my-2">
                          <p className="text-gray-300 text-sm">
                            0/45 servicios
                          </p>
                        </div>
                        <div className="w-full h-2 bg-blue-200 rounded-full">
                          <div className="h-full text-center text-xs text-white  rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fidelidad;
