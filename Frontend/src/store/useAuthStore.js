import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
    authUser: null,
    issigningUp: false,
    isLoggingIn: false,
    isupdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('auth/check');
            set({ authUser: res.data });
        } catch (error) {
            console.log("Erros is checkAuth:",error);
            set({ authUser: null });
        }
        finally{
            set({isCheckingAuth: false});
        }
    },

}));