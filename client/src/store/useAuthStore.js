import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  authUser: null,

  signup: async (username, email, password) => {
    try {
      let res = await axiosInstance.post("/users/signup", {
        username,
        email,
        password,
      });

      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log("error in signup", error);
      toast.error(res.data.message);
    }
  },

  login: async (email, password) => {
    console.log(email, password);
    try {
      let res = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      console.log(res);

      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log("error in signup", error);
      toast.error(error?.response?.data?.message);
    }
  },

  checkAuth: async () => {
    try {
      let res = await axiosInstance.get("/users/checkAuth");

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("error in signup", error);
    }
  },

  logout: async () => {
    try {
      let res = await axiosInstance.get("/users/logout");
      set({ authUser: null });

      toast.success(res.data.message);
    } catch (error) {
      console.log("error in logout", error);
      toast.error(error?.response?.data?.message);
    }
  },
}));

export default useAuthStore;
