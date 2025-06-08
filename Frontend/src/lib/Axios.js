import axios from "axios"

export const axioslib = axios.create({
 baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials:true
})