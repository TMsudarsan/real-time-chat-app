import { create } from "zustand";
import { axioslib } from "../lib/Axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthstore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogining: false,
  isUpdating: false,
  onlineUsers: [],
  socket: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axioslib.get("athu/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in Authuser", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axioslib.post("/athu/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogining: true });
    try {
      const res = await axioslib.post("/athu/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    } finally {
      set({ isLogining: false });
    }
  },
  logout: async () => {
    try {
      await axioslib.post("/athu/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket()
    } catch (error) {
      console.log(error); // Log the full error for debugging
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdating: true });
    try {
      const res = await axioslib.put("/athu/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdating: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
