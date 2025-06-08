import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useTaskStore = create((set, get) => ({
    allTasks: [],
    isLoading: false,

  createTask: async (taskName, listId) => {
    try {
      let res = await axiosInstance.post("/tasks/create", {
        task: taskName,
        listId,
      });

      set((state) => ({
        allTasks: [...state.allTasks, res.data.task],
      }));
    } catch (error) {
      console.log("error in creating task", error);
    }
  },

    getAllTasks: async () => {
    set({ isLoading: true });
    try {
      let res = await axiosInstance.get("/tasks/getAll");
        set({ allTasks: res.data.tasks });
        console.log(res.data.tasks);
    } catch (error) {
      console.log("error in fetching tasks", error);
    } finally {
        set({ isLoading: false });
    }
  },
}));

export default useTaskStore;
