import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useListStore = create((set, get) => ({
  allLists: [],

  createList: async (listName) => {
    try {
      let res = await axiosInstance.post("/lists/create", { list: listName });
      set((state) => ({
        allLists: [...state.allLists, res.data.list],
      }));
      toast.success(res.data.message);
    } catch (error) {
      console.log("error in creating list", error);
      toast.error(error?.response?.data?.message);
    }
  },

  getAllLists: async () => {
    try {
      let res = await axiosInstance.get("/lists/getAll");
      set({ allLists: res.data.list });
      console.log("all lists", res.data.list);
    } catch (error) {
      console.log("error in fetching lists", error);
    }
  },

  deleteList: async (listId) => {
    try {
      let res = await axiosInstance.delete(`/lists/delete/${listId}`);
      set((state) => ({
        allLists: state.allLists.filter((list) => list._id !== listId),
      }));
      toast.success(res.data.message);
    } catch (error) {
      console.log("error in deleting list", error);
      toast.error(error?.response?.data?.message);
    }
  },
}));

export default useListStore;