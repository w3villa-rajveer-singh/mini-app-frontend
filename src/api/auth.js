import API from "./axios";

// SIGNUP
export const signup = async (data) => {
  const response = await API.post("/signup", {
    user: data,
  });

  return response.data;
};

// LOGIN
export const login = async (data) => {
  const response = await API.post("/login", {
    user: data,
  });

  const token = response.data.token || response.data.jwt;
  if (token) {
    localStorage.setItem("token", token);
  }

  console.log("LOGIN RESPONSE:", response.data);

  return response.data;
};



// LOGOUT
export const logout = async () => {
  try {
    await API.delete("/logout");
  } catch (err) {
    console.error("Logout API failed (can ignore if JWT)", err);
  } finally {
    localStorage.removeItem("token");
  }
};