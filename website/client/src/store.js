import create from "zustand";
import { devtools } from "zustand/middleware";

let userProfile = (set) => ({
  userData: null,
  setUserData: (data) => {
    set((state) => ({ userData: data }));
  },
});

export const useProfileStore = create(userProfile);
