import React from "react";
import { useSelector } from "react-redux";
import { ROLES } from "../../helpers/Logic/roles";
import { getStoredProfile } from "../../helpers/auth/getSessionData";
import LegacyCustomerJourneyRedirect from "./LegacyCustomerJourneyRedirect";

const LegacyReservationAccess = ({ mode, legacyElement }) => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const storedProfile = getStoredProfile();
  const effectiveRole = user?.rol || storedProfile?.rol || null;

  if (effectiveRole === ROLES.ADMIN) {
    return legacyElement;
  }

  return <LegacyCustomerJourneyRedirect mode={mode} />;
};

export default LegacyReservationAccess;
