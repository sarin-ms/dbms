import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

export const getCandidates = async () => {
  const response = await api.get("/candidates");
  return response.data;
};

export const addCandidate = async (candidate) => {
  const response = await api.post("/candidates", candidate);
  return response.data;
};

export const deleteCandidate = async (id) => {
  const response = await api.delete(`/candidates/${id}`);
  return response.data;
};

export const updateCandidate = async (id, data) => {
  const response = await api.put(`/candidates/${id}`, data);
  return response.data;
};

export const vote = async (voteData) => {
  const response = await api.post("/vote", voteData);
  return response.data;
};

export const getResults = async () => {
  const response = await api.get("/results");
  return response.data;
};

export const resetData = async () => {
  const response = await api.post("/reset");
  return response.data;
};
