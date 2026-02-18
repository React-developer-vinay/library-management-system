import API from "./api";

export const logout = () => {
  localStorage.removeItem("token");
  // Dispatch event to notify App component of token removal
  window.dispatchEvent(new Event("tokenUpdated"));
  // Redirect to login page
  window.location.href = "/";
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};
