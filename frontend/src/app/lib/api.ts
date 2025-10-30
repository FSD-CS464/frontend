import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
const authApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (!err.response) throw err;

    if (err.response.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await authApi.post("/refresh");
          queue.forEach((fn) => fn());
          queue = [];
        } catch (e) {
          queue = [];
          throw e;
        } finally {
          isRefreshing = false;
        }
      }

      await new Promise<void>((resolve) => {
        queue.push(() => resolve());
      });

      return api(original);
    }

    throw err;
  }
);

export { api, authApi };
