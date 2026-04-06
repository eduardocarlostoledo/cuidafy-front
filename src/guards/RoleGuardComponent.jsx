import React from 'react'
import { useSelector } from 'react-redux';

const RoleGuardComponent = ({ children, rol }) => {
//console.log("ROLE GUARD COMPONENT", children, rol);
    const { user } = useSelector((state) => ({ ...state.auth }));

    if (rol.includes(user?.trafficLightBase128)) {
        return children;
    } else {
        return null; // O cualquier otro valor predeterminado que desees
    }
}

export default RoleGuardComponent;


// import React from 'react'
// import { useSelector } from 'react-redux';

// const RoleGuardComponent = ({ children, rol }) => {

//     const { user } = useSelector((state) => ({ ...state.auth }));

//     return (
//         rol.includes(user?.trafficLightBase128) && children?.map((item) => item) 
//     )
// }

// export default RoleGuardComponent