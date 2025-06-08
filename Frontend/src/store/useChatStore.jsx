import { create } from "zustand";
import toast from "react-hot-toast";
 import { axioslib } from "../lib/Axios";
import { useAuthstore } from "./useAuthStore";
 
export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

     getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axioslib.get("/messages/users");
      console.log(res);
      
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

 getMessage: async (userId) => {
 

  set({ isMessagesLoading: true });
  try {
    const res = await axioslib.get(`/messages/${userId}`);
    console.log(res);
    set({ messages: res.data });
  } catch (error) {
    console.log("Error in getMessage", error);
    toast.error(error.response.data.message);
  } finally {
    set({ isMessagesLoading: false });
  }
},
sendMessage:async (messageData)=>{
  const {selectedUser, messages} = get()
  try {
    const res = await axioslib.post(`/messages/send/${selectedUser._id}`,messageData)
    set({messages:[...messages, res.data]});
  } catch (error) {
    toast.error(error.response.data.message)
  }
},
 subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthstore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
    unsubscribeFromMessages: () => {
    const socket = useAuthstore.getState().socket;
    socket.off("newMessage");
  },
setSelectedUser:(selectedUser)=>set({selectedUser})
}));