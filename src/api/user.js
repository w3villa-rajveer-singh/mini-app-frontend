import API from "./axios";

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};