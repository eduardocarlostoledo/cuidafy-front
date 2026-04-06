import React from 'react'

import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 h-screen flex justify-center items-center">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary ">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-secondary md:text-4xl">No podemos encontrar la página que estás buscando.</p>
          <p className="mb-4 text-lg font-light text-gray-500">Lo sentimos, no podemos encontrar esa página. Encontrarás mucho para explorar en la página de inicio. </p>
          <Link  to="/servicio" className="inline-flex text-white bg-primary hover:bg-bgHover focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Volver a la página de inicio</Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound