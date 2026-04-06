export const getStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("profile") || "null");
  } catch (error) {
    return null;
  }
};

export const getAuthToken = () => {
  const profile = getStoredProfile();
  return profile?.token || localStorage.getItem("token") || "";
};

export const getSessionEmail = () => getStoredProfile()?.email || "";
