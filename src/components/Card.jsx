import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const Card = ({ image, text, count, link, countLabel = "horarios visibles" }) => {
  return (
    <Link to={link}>
      <div className="p-4 h-max bg-white max-width-card max-w-sm 2xl:max-w-sm border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 hover:scale-105 cursor-pointer">
        <LazyLoadImage
          className="rounded-xl"
          src={image}
          alt={text}
          effect="blur"
          width={300}
          height={300}
        />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="mt-5 font-semibold">{text}</h1>
            <p className="mt-2">{count} {countLabel}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;

// import React from 'react'

// import { LazyLoadImage } from 'react-lazy-load-image-component'

// const Card = ({ image, text, count, link }) => {
//     return (
//         <a href={link}>
//             <div className="p-4 h-max bg-white max-width-card max-w-sm 2xl:max-w-sm border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 hover:scale-105 cursor-pointer">
//                 <LazyLoadImage className="rounded-xl" src={image} alt="" effect='blur' />
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <h1 className="mt-5  font-semibold">{text}</h1>
//                         <p className="mt-2">{count} productos</p>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     )
// }

// export default Card
