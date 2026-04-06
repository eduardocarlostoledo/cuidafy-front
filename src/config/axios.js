import axios from "axios";

const clienteAxios = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`
});

export default clienteAxios;