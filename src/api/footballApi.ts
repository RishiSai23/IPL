import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export const getAllCachedPlayers = async () => {
  const res = await api.get("/players/all");
  return res.data.players;
};
