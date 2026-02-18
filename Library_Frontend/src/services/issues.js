import API from "./api";

export const issuesAPI = {
  list: () => API.get("/issues"),
  history: () => API.get("/issues/history"),
  issue: (data) => API.post("/issues", data),
  return: (id, data) => API.post(`/issues/${id}/return`, data),
};
