import axios from "axios";

const DELHIVERY_API = "https://track.delhivery.com";
const DELHIVERY_TOKEN = process.env.DELHIVERY_API_TOKEN; 

const delhiveryAPI = axios.create({
  baseURL: DELHIVERY_API,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${DELHIVERY_TOKEN}`,
  },
});

export default delhiveryAPI;
