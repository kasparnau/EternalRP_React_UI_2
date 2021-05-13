import create from 'zustand'
import { devtools } from 'zustand/middleware'

let profileStore = (set) => ({
    currentCharacterId: 0,
    changeCurrentCharacterId: (character_id) =>
        set((state) => ({ currentCharacterId: character_id })),
    profilePageData: false,
    changeProfilePageData: (data) =>
        set((state) => ({ profilePageData: data })),
})

export const useProfileStore = create(profileStore)
