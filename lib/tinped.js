// lib/tinped.js
import axios from "axios";

const BASE = "https://tinped.com/api";

async function request(path, params = {}) {
  const url = `${BASE}/${path}`;
  const res = await axios.post(url, params, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });
  return res.data;
}

const Tinped = {
  /**
   * params: { api_id, api_key, service_fav? }
   */
  getServices: async (api_id, api_key, service_fav = "") => {
    const r = await request("services2", { api_id, api_key, service_fav });
    return r;
  },

  /**
   * params: { api_id, api_key }
   * returns profile info
   */
  getProfile: async (api_id, api_key) => {
    return await request("profile", { api_id, api_key });
  },

  /**
   * create order
   * params: { api_id, api_key, service, target, quantity }
   * returns { status, data:{ id, price } }
   */
  createOrder: async (api_id, api_key, service, target, quantity) => {
    return await request("order", {
      api_id,
      api_key,
      service,
      target,
      quantity,
    });
  },

  /**
   * get status
   * params: { api_id, api_key, id }
   */
  getStatus: async (api_id, api_key, id) => {
    return await request("status", { api_id, api_key, id });
  },
};

export default Tinped;
