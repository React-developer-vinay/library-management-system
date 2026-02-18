import API from "./api";

export const studentsAPI = {
  list: (search) => API.get(`/students${search ? `?search=${search}` : ""}`),
  create: (data) => API.post("/students", data),
  update: (id, data) => API.put(`/students/${id}`, data),
  remove: (id) => API.delete(`/students/${id}`),
};
