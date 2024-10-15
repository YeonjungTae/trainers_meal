import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
  // headers: {
  //   "Content-Type": `application/json;charset=UTF-8`,
  //   "Accept": "application/json",
  
  //   // 추가  
  //   // "Access-Control-Allow-Origin": `http://3.37.154.71:3000`,
  //   // 'Access-Control-Allow-Credentials':"true",
  // },
  // withCredentials: true
});
