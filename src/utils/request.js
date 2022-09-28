import axios from "axios";
const request = axios.create({
  baseURL: "http://localhost:3001/",
  withCredentials: true,
});
export default request;
