import API from "./axios";

export const getAllUsers = async (page = 1, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(search && { q: search })
  });
  
  const response = await API.get(`/admin/users?${params}`);
  return response.data;
};
